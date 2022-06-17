#pragma once

#include "../sorted-linked-list/sorted-linked-list.h"

class SortedLinkedListTest {

    SortedLinkedList<SortedListItem<corfu::Telecommand>, 24> telecommandList;
    SortedLinkedList<SortedListItem<std::uint16_t>, 24>  intList;

    void clearLists() {
        telecommandList = SortedLinkedList<SortedListItem<corfu::Telecommand>, 24>();
        intList         = SortedLinkedList<SortedListItem<uint16_t>, 24>();
    }

    bool addIntTestItems() {
        for(uint16_t i=0u; i<intList.MAX_LENGTH; i++) {
            SortedListItem<uint16_t> item {i,i};
            intList.insertItem(item);
        }
        RODOS::PRINTF("break here in debugger to look at lists \n");
        return true;
    }

    bool addTestTelecommands() {
        corfu::Telecommand tc;
        tc.serviceID   = 7353;
        tc.subserviceID = 1; // NOPs

        for(uint16_t i=1u; i<telecommandList.MAX_LENGTH/2; i++) {
            tc.commandIndex = i;
            tc.timeToExecute = i*10000;
            SortedListItem<corfu::Telecommand> item {tc, tc.timeToExecute};
            telecommandList.insertItem(item);
        }
        RODOS::PRINTF("break here in debugger to look at lists \n");
        return true;
    }






};
