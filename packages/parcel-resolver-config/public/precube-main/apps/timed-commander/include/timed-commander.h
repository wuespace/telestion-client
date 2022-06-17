//
// Created by felix on 19.12.20.
//

#pragma once

#include <timed-commander-generated/timed-commander.h>
#include <timed-commander-generated/struct/timed-command-header.h>
#include "utils/sorted-linked-list/sorted-linked-list.h"

// explicit instatiation of template class
template class SortedLinkedList<SortedListItem<corfu::Telecommand>,config::timed_commander::MAX_LISTENTRIES>;

class TimedCommander : public generated::TimedCommander {

    uint8_t numberOfStagedCommands = 0u;
    uint8_t numberOfActiveCommands = 0u;

    uint16_t  iterations = 0;

    corfu::ProtectedVariable<SortedLinkedList<SortedListItem<corfu::Telecommand>,config::timed_commander::MAX_LISTENTRIES>> timedCommands;

    void init() {

    }
    void runTcmThread() override;
    void handleTopicTimedTelecommandTopic(corfu::Telecommand& message) override;
    void handleTopicTimeAndModeTopic(generated::TimeAndModeTopic &message) override;

    bool handleTelecommandNOP() override;
    bool handleTelecommandClearActiveList() override;
    bool handleTelecommandDeleteStagingList() override;
    bool handleTelecommandSendActiveList() override;
    bool handleTelecommandSendStagingList() override;
    bool handleTelecommandActivateStagingList() override;
    bool handleTelecommandOverrideSafeModeList() override;
    bool handleTelecommandClearAllLists() override;


    /* ! ground sends the TimeToExecute in seconds ! */
    inline int64_t absoluteTime(int64_t ttx) { return ttx >= 0 ? ttx*RODOS::SECONDS : RODOS::NOW() - ttx*RODOS::SECONDS; }

    inline uint8_t howManyNeeded(uint8_t numElements, uint8_t containerSize) {
        RODOS_ASSERT(containerSize > 0);
        return (numElements%containerSize == 0) ? numElements/containerSize : numElements/containerSize +1;
    }

    /*
     * returns a pointer to the the timed telecommand with the given ttxm, commandIndex and checksum
     * or nullptr, if no matching telecommand was found in the list
     */
    SortedListItem<corfu::Telecommand> * findTimedCommand(int64_t timeToExecute, uint16_t commandIndex, uint16_t checksum);

public:
    ~TimedCommander() override = default;

};
