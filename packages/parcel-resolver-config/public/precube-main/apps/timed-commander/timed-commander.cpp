//
// Created by felix on 19.12.20.
//

#include "timed-commander.h"
#include <timed-commander-generated/extended-telemetry/staging-list.h>
#include <timed-commander-generated/extended-telemetry/active-list.h>



void TimedCommander::runTcmThread() {

    corfu::Accessor acc = timedCommands.access();

    // check active list, issue all commands that are due, then delete them
    uint8_t numActives = acc->getNumberOfActiveItems();
    int64_t now = RODOS::NOW();

    SortedListItem<corfu::Telecommand> * item = acc->getFirstItem();
    SortedListItem<corfu::Telecommand> * item_to_delete = nullptr;
    for(uint8_t i=0u; i<numActives; i++) {

        if(item->getSortVal() <= now) {
            corfu::Telecommand tc = *(item->getData());
            corfu::telecommandTopic.publish(tc);
            item_to_delete = item;
        }

        item = item->getNext();
        if(item_to_delete != nullptr) {
            acc->removeItem(item_to_delete);
            item_to_delete = nullptr;
        }

        if(item == nullptr) break;
    }

    // update standard telemetry
    corfu::Accessor tmacc = this->standardTelemetry.access();
    tmacc->activeCommands = acc->getNumberOfActiveItems();
    tmacc->iteration = this->iterations;

    // RODOS::PRINTF("TCMthread @%u", this->iterations);
    this->iterations++;
}


// @todo !!!
void TimedCommander::handleTopicTimeAndModeTopic(generated::TimeAndModeTopic &message) {

}

void TimedCommander::handleTopicTimedTelecommandTopic(corfu::Telecommand& message) {
    // RODOS::PRINTF("TCM: \n received timed telecommand!\n");
    auto list_accessor = timedCommands.access();
    auto stdtm_acc     = standardTelemetry.access();

    //@todo: maybe use RODOS::RESULT instead of ASSERT?
    RODOS_ASSERT(list_accessor->insertItem(SortedListItem(message, absoluteTime(message.timeToExecute))));

    // update stdtm
    stdtm_acc->stagedCommands = list_accessor->getNumberOfStagedItems();
}


bool TimedCommander::handleTelecommandNOP() {
    // RODOS::PRINTF("TCM=      -> TCM_NOP\n");
    return true;

}


bool TimedCommander::handleTelecommandClearActiveList() {
    // RODOS::PRINTF("TCM=      -> TCM_CLEAR_ACTIVE_LIST\n");

    // 1) collect the pointers of all active entries
    corfu::Accessor acc = timedCommands.access();
    uint8_t numItemsToDelete = acc->getNumberOfActiveItems();
    if(numItemsToDelete == 0) return false;

    SortedListItem<corfu::Telecommand> * itemsToDelete[numItemsToDelete];
    SortedListItem<corfu::Telecommand> * item = acc->getFirstItem();
    uint8_t j = 0u;
    for(uint8_t i=0u; i<acc->getNumberOfStoredItems(); i++) {
        if(item->isActive()) {
            itemsToDelete[j] = item;
            j++;
        }
        if(item->hasNext()) item = item->getNext();
        else break;
    }
    // 2) delete those entries
    for(j=0u; j<numItemsToDelete; j++) {
        acc->removeItem(itemsToDelete[j]);
    }

    standardTelemetry.access()->activeCommands = acc->getNumberOfActiveItems();  // update stdtm
    return true;
}


bool TimedCommander::handleTelecommandDeleteStagingList() {
    // RODOS::PRINTF("TCM=      -> TCM_DELETE_STAGING_LIST\n");

    corfu::Accessor acc = timedCommands.access();
    uint8_t numItemsToDelete = acc->getNumberOfStagedItems();
    if(numItemsToDelete == 0) return false;

    // 1) collect the pointers of all staged entries
    SortedListItem<corfu::Telecommand> * itemsToDelete[numItemsToDelete];
    SortedListItem<corfu::Telecommand> * item = acc->getFirstItem();
    uint8_t j = 0u;
    for(uint8_t i=0u; i<acc->getNumberOfStoredItems(); i++) {
        if(! item->isActive()) {
            itemsToDelete[j] = item;
            j++;
        }
        if(item->hasNext()) item = item->getNext();
        else break;
    }
    // 2) delete those entries
    for(j=0u; j<numItemsToDelete; j++) {
        acc->removeItem(itemsToDelete[j]);
    }
    standardTelemetry.access()->stagedCommands = acc->getNumberOfStagedItems();
    return true;
}


/* ! the dev egse will only show the extended telemetry sent last ! */
bool TimedCommander::handleTelecommandSendActiveList() {
    // RODOS::PRINTF("TCM=      -> TCM_SEND_ACTIVE_LIST\n");

    corfu::Accessor acc = timedCommands.access();
    uint8_t numElements = acc->getNumberOfActiveItems();
    uint8_t maxElements = config::timed_commander::MAX_ENTRIESINTM;
    generated::ActiveList al;

    if(numElements == 0) {
        al.part = 1;
        al.of   = 1;
        corfu::Telemetry tm = this->finalizeTelemetry(al);
        corfu::extendedTelemetryTopic.publish(tm);
        return true;
    }
    else {
        // how many telemetry messages do we need to send?
        uint8_t k = howManyNeeded(numElements, maxElements);
        al.part   = 1;
        al.of     = k;

        uint8_t   j = 0u;
        SortedListItem<corfu::Telecommand> * item = acc->getFirstItem();
        for (uint8_t i = 0u; i < acc->getNumberOfStoredItems(); i++) {

            if (item->isActive()) {
                corfu::Telecommand *tc = item->getData();
                generated::TimedCommandHeader tch;
                tch.sortVal = item->getSortVal();
                tch.cmdIndex = tc->commandIndex;
                tch.checksum = tc->checksum;
                tch.nodeID = tc->nodeID;
                tch.serviceID = tc->serviceID;
                tch.subserviceID = tc->subserviceID;
                al.activeListEntries[i] = tch;

                j++;
                if(j == maxElements) {
                    // send current list
                    corfu::Telemetry tm = this->finalizeTelemetry(al);
                    corfu::extendedTelemetryTopic.publish(tm);

                    // reset counter and increment list id
                    j = 0u;
                    al.part++;

                    // reset list - no copy constructor. grrr!!!
                    for (uint8_t k = 0u; k < maxElements; k++) {
                        al.activeListEntries[k] = generated::TimedCommandHeader();
                    }
                }
            }
            item = item->getNext();
            if (item == nullptr) break;
        }

        // send the last (yet unsent) extendedTelemetry message
        if( 0 < j && j < maxElements) {
            corfu::Telemetry tm = this->finalizeTelemetry(al);
            corfu::extendedTelemetryTopic.publish(tm);
        }
        return true;
    }
}


/* ! the dev egse will only show the extended telemetry sent last ! */
bool TimedCommander::handleTelecommandSendStagingList() {
    // RODOS::PRINTF("TCM=      -> TCM_SEND_STAGING_LIST\n");
    corfu::Accessor acc = this->timedCommands.access();
    uint8_t maxElements = config::timed_commander::MAX_ENTRIESINTM;
    generated::StagingList sl;

    // we have nothing to send, except an empty answer
    if(acc->isEmpty() || acc->getNumberOfStoredItems() == acc->getNumberOfActiveItems()) {
        sl.part = 1;
        sl.of   = 1;
        corfu::Telemetry tm = this->finalizeTelemetry(sl);
        corfu::extendedTelemetryTopic.publish(tm);
        return true;
    }

    // all commands in the list, which are not active are staged
    uint8_t neededTMs = howManyNeeded(acc->getNumberOfStoredItems(), maxElements);
    sl.of  = neededTMs;

    sl.part = 1;
    SortedListItem<corfu::Telecommand> * it = acc->getFirstItem();

    uint8_t   j = 0;

    for(uint8_t i=0u; i < acc->getNumberOfStoredItems(); i++) {
        corfu::Telecommand * tc = it->getData();
        RODOS_ASSERT(tc != nullptr);

        if (!it->isActive()) {
            generated::TimedCommandHeader tch;
            tch.sortVal = it->getSortVal();
            tch.cmdIndex = tc->commandIndex;
            tch.checksum = tc->checksum;
            tch.nodeID = tc->nodeID;
            tch.serviceID = tc->serviceID;
            tch.subserviceID = tc->subserviceID;
            sl.stagedListEntries[j] = tch;

            j++;
            if (j == maxElements) {
                // send current list
                corfu::Telemetry tm = this->finalizeTelemetry(sl);
                corfu::extendedTelemetryTopic.publish(tm);

                // reset counter and inkrement list id
                j = 0u;
                sl.part++;

                // reset list
                // sl = generated::StagingList(); // nope, no copy constructor. grrr!!!
                for (uint8_t k = 0u; k < maxElements; k++) {
                    sl.stagedListEntries[k] = generated::TimedCommandHeader();
                }
            }
        }

        it = it->getNext();
        if (it == nullptr) break;
    }

    // send the last (yet unsent) extendedTelemetry message
    if( 0 < j && j < maxElements) {
        corfu::Telemetry tm = this->finalizeTelemetry(sl);
        corfu::extendedTelemetryTopic.publish(tm);
    }

    return true;
}


bool TimedCommander::handleTelecommandActivateStagingList() {
    corfu::Accessor acc = this->timedCommands.access();

    auto * it = acc.operator*().getFirstItem();
    for(uint8_t i=0u; i < acc.operator*().getNumberOfStoredItems(); i++) {  // iterate over all commands in the list
        if(it->isStaged()) { it->setActive(); }                             // change all staged commands to active
        it = it->getNext();
    }

    standardTelemetry.access()->stagedCommands = acc->getNumberOfStagedItems();
    return true;
}


// @todo: implement!
bool TimedCommander::handleTelecommandOverrideSafeModeList() { return false; }

bool TimedCommander::handleTelecommandClearAllLists() {
    return false;
}


// helper methods ______________________________________________________________________________________________________
SortedListItem<corfu::Telecommand> * TimedCommander::findTimedCommand(int64_t ttx, uint16_t cmdIndex, uint16_t checksum) {
    corfu::Accessor acc = this->timedCommands.access();

    auto * it = (*acc).getFirstItem();
    for(uint8_t i=0u; i < (*acc).getNumberOfStoredItems(); i++) {

       corfu::Telecommand * tc = it->getData();
       if(tc->timeToExecute == ttx && tc->commandIndex == cmdIndex && tc->checksum == checksum) {
           return it;
       }
        it = it->getNext();
    }

   return nullptr;
}


