#pragma once

#include <cstdint>
#include <iterator>

#include <corfu/array.h>
#include <corfu/telecommand.h>


#define UNSET -2

/*
 * Always use this list as a corfu::ProtectedVariable !
 */

/* List Elements ______________________________________________________________________________________________________*/
template <typename ELEMENT = corfu::Telecommand>
class SortedListItem {

    template <typename SortedListItem, std::uint8_t length>
    friend class SortedLinkedList;

    ELEMENT data;
    [[maybe_unused]] int64_t sortVal = INT64_MAX;

    bool active  = false;
    bool deleted = true;

    SortedListItem * previousItem = nullptr;
    SortedListItem * nextItem     = nullptr;
    int16_t indexInArray          = UNSET;

    // only the list itself may add & delete items and set those details!
    void setNewSet() { deleted = false; active = false; }
    void setDeleted() { deleted = true; }

public:

    SortedListItem() = default;

    SortedListItem(ELEMENT _data, int64_t _sortVal) {
        data = _data;
        sortVal = _sortVal;
    }

    [[nodiscard]] ELEMENT * getData()  { return &data;}
    [[nodiscard]] int64_t getSortVal() const { return sortVal; }
    [[nodiscard]] int8_t getArrayIndex() const { return indexInArray; }

    // getters for neighbour items
    SortedListItem * getNext()     { return nextItem; }
    SortedListItem * getPrevious() { return previousItem; }

    bool hasNext() const { return nextItem != nullptr; }
    bool hasPrevious() const { return previousItem != nullptr; }


    void setActive() {
        if (! isDeleted()) {
            active = true;
        }
    }

    [[nodiscard]] bool isEmpty()   const { return this->deleted; }
    [[nodiscard]] bool isStaged()  const { return !isActive() && !isDeleted(); }
    [[nodiscard]] bool isActive()  const { return active; }
    [[nodiscard]] bool isDeleted() const { return deleted; }

};


/* The List Itself ____________________________________________________________________________________________________*/
template <typename SortedListItem, std::uint8_t length>
class SortedLinkedList {

    SortedListItem items[length];
    SortedListItem * FIRST_ITEM = nullptr;
    uint8_t numberOfItems = 0;


public:
    SortedLinkedList() {
        FIRST_ITEM = nullptr;
        numberOfItems = 0;
    }

    /*
     * the maximum number of items the list can store (size of the raw array the list uses)
     */
    static constexpr std::uint8_t MAX_LENGTH = length;

    /*
     *  returns true, if the List is empty
     */
    bool isEmpty() const { return numberOfItems == 0; }

    /*
     * returns the number of items currently stored in the list
     */
    uint8_t getNumberOfStoredItems() const { return numberOfItems; }

    /*
     * returns the number of active items currently stored in the list,
     * by iterating over the list & counting them.
     */
    uint8_t getNumberOfActiveItems() const {
        if(numberOfItems == 0) return 0;

        uint8_t activeFound = 0;
        SortedListItem * it = FIRST_ITEM;
        for(uint8_t i=0u; i<getNumberOfStoredItems(); i++) {
            if(it->isActive()) activeFound++;
            if(it->hasNext()) it = it->nextItem;
            else break;
        }
        return activeFound;
    }

    /*
    * returns the number of staged items currently stored in the list,
    * by iterating counting the active items and substracting them from the number of stored items.
    */
    uint8_t getNumberOfStagedItems() const { return getNumberOfStoredItems() - getNumberOfActiveItems(); }

    /*
     * returns a pointer to the first item of the sorted list
     */
    SortedListItem * getFirstItem() const { return FIRST_ITEM; }


    /*
  * Inserts the given item according to its sortValue into the linked list
  * the ARRAY_INDEX describes, where the listItem is stored in the underlying array
  * but the position in the list is only determined by the previous and next item pointer
  * of the sort item (this is what the list iterator uses)
  *
  * @param new_item : the SortedListItem to be inserted
  */
    bool insertItem(SortedListItem new_item);

    /**
     * Removes the item from the list
     * @param item_to_remove
     * @returns false, if trying to remove an item not in the list, or sth from an empty list
     *          true, otherwise
     */
    bool removeItem(SortedListItem * item_to_remove);

};


template<typename SortedListItem, std::uint8_t length>
bool SortedLinkedList<SortedListItem, length>::insertItem(SortedListItem new_item) {

    // 1) find first free place in the array -> ARRAY_INDEX
    int8_t ARRAY_INDEX = 0;
    for (SortedListItem & i: items) {
        if(i.isEmpty()) break;
        ARRAY_INDEX++;
    } if(ARRAY_INDEX == MAX_LENGTH) { return false; }  // @todo: use RODOS::RESULT MEMORY::ERROR

    auto * new_item_ptr   = & items[ARRAY_INDEX];
    new_item.indexInArray = ARRAY_INDEX; // = "physical" storage location in raw array (!= list index)!!!
    new_item.setNewSet();


    // 2) find where in the sorted list the new item belongs
    if(isEmpty()) {
        RODOS_ASSERT(ARRAY_INDEX == 0);
        RODOS_ASSERT(numberOfItems == 0);
        // we have no next or previous yet, but need to set the list's first item pointer
        FIRST_ITEM = new_item_ptr;
    }
    else {
        bool found = false;
        SortedListItem * curr = FIRST_ITEM;
        uint8_t i;
        for(i=0u; i<this->getNumberOfStoredItems(); i++) {
            if(new_item.sortVal < curr->sortVal) {
                found = true;
                break;
            }
            SortedListItem * it = curr->getNext();
            if(it != nullptr) { curr = it; }
        }
        if (curr->nextItem == nullptr && !found) { // insert at the end
            new_item.previousItem = curr;
            curr->nextItem = new_item_ptr;
        }
        else
            if(curr->previousItem == nullptr) {
                RODOS_ASSERT(curr->indexInArray == getFirstItem()->indexInArray);
                if(found) {                        // insert  at the front
                    curr->previousItem = new_item_ptr;
                    FIRST_ITEM = new_item_ptr;
                    new_item.nextItem = curr;
                } else {                           // insert AFTER the first item
                    new_item.nextItem = curr->nextItem;
                    curr->nextItem = new_item_ptr;
                }
        }
        else {                                     // insert before curr
            (curr->previousItem)->nextItem = new_item_ptr;
            new_item.previousItem = curr->previousItem;
            curr->previousItem = new_item_ptr;
            new_item.nextItem = curr;
        }
    }

    // 3) increment list size and insert into the raw array
    numberOfItems++;
    RODOS_ASSERT(numberOfItems <= MAX_LENGTH);
    items[ARRAY_INDEX] = new_item;
    items[ARRAY_INDEX].setNewSet();

    return true;
}


template<typename SortedListItem, std::uint8_t length>
bool SortedLinkedList<SortedListItem, length>::removeItem(SortedListItem *item_to_remove) {
    RODOS_ASSERT_IFNOT_RETURN(numberOfItems > 0, false);
    RODOS_ASSERT_IFNOT_RETURN(!item_to_remove->isDeleted(), false);

    if(item_to_remove->hasPrevious()) {
        (item_to_remove->previousItem)->nextItem = item_to_remove->nextItem;
    } else {
        FIRST_ITEM = item_to_remove->nextItem; // may be set to nullptr, if we remove the only item
    }

    if(item_to_remove->hasNext()) {
        (item_to_remove->nextItem)->previousItem = item_to_remove->previousItem;
    }

    item_to_remove->previousItem = nullptr;   // remove item info
    item_to_remove->nextItem = nullptr;
    item_to_remove->indexInArray = -2;

    item_to_remove->setDeleted();             // this only sets the deleted pointer to true
    this->numberOfItems--;
    return true;
}
















// **
// we are the very first insert at front of the linked list
// this does not always mean we are at array[0], if the array was in use before & has not yet been cleared, or does it ?
// but, it _should_ be cleared (meaning every place in the array set to available/deleted/freed), if there is no first element, else sth. is really wrong


/*
 *
 * bool SortedLinkedList<SortedListItem, length>::insertItem(SortedListItem new_item) {

    int8_t ARRAY_INDEX             = 0;
    SortedListItem * PREV_ITEM_PTR = nullptr;
    SortedListItem * NEXT_ITEM_PTR = nullptr;

    RODOS_ASSERT(new_item.getSortVal() >= 0);

    // 1) find first free place in the array -> ARRAY_INDEX
    for (SortedListItem & i: items) {
        if(i.isEmpty()) break;
        ARRAY_INDEX++;
    } if(ARRAY_INDEX == MAX_LENGTH-1) { return false; }                                                                   // @todo: use RODOS::RESULT MEMORY::ERROR

    // ^ok .............................................................................................................
    new_item.setArrayIndex(ARRAY_INDEX); // = "physical" storage location in raw array (!= list index)!!!
    new_item.setNewSet();


    // 2) find the items place in the sorted list
    if(FIRST_ITEM != nullptr) {
        // iterate list & compare sortValues to find out, where it belongs in the sorting
        Iterator it = begin();
        for(uint8_t i=0u; i<numberOfItems; i++) {

            if(new_item.getSortVal() < it->getSortVal()) {  // we want to be before the it->currentItem in list!
                NEXT_ITEM_PTR = it.operator->();
                break;
            } else {
                PREV_ITEM_PTR = it.operator->();
                RODOS_ASSERT(PREV_ITEM_PTR != nullptr);
                it.operator++();
            }
        }

        // 3) set pointers / indices of neighbour items

        // new item belongs to the end of the list
        if(NEXT_ITEM_PTR == nullptr) {
           // [...] [PREV_ITEM] [NEW_ITEM] [nullptr]
            RODOS_ASSERT(PREV_ITEM_PTR != nullptr);
            PREV_ITEM_PTR->setNext(&new_item);
            new_item.setPrevious(PREV_ITEM_PTR);
            RODOS_ASSERT(new_item.previousItem != nullptr);
        }
        // new item has a previous and next item
        else {
            // [...] [PREV_ITEM] [NEW_ITEM] [NEXT_ITEM] [...]

            PREV_ITEM_PTR->setNext(&new_item);
            new_item.setPrevious(PREV_ITEM_PTR);

            NEXT_ITEM_PTR->setPrevious(&new_item);
            new_item.setNext(NEXT_ITEM_PTR);
        }
    }
    else  { // if(FIRST_ITEM == nullptr) {
        // we are the very first insert at front of the linked list (and the array?) **
        RODOS_ASSERT(ARRAY_INDEX == 0);
        RODOS_ASSERT(numberOfItems == 0);
        // we have no next or previous, but need to set the list's first item pointer
        FIRST_ITEM = &new_item;
    }
    // 4) increment list size and insert into the raw array
    numberOfItems++;
    RODOS_ASSERT(numberOfItems <= MAX_LENGTH);
    items[ARRAY_INDEX] = new_item;
    items[ARRAY_INDEX].setNewSet();

    return true;
} */