//
// Created by felix on 22.10.21.
//

#include <file-system-generated/file-system.h>

// a filesystem with bad block markers and filetable for 100 Entries would use 3KB of 1MB MRAM
// we will probably dupicate it, to be safe.
// this is only a description and does not handle any flash interactions

struct FileSystemEntry {
    uint16_t fileID      = 0u;
    uint16_t blockIDs[6] = {0u,0u,0u,0u,0u,0u};
    uint16_t firstPageID = 0u;
    uint32_t fileSize    = 0u;

public:
    FileSystemEntry() : fileID(), blockIDs(), firstPageID(),fileSize() {}

    FileSystemEntry(uint16_t fileId, uint16_t blockIds[6], uint16_t firstPageId, uint32_t fileSize) {
        this->fileID      = fileId;
        this->firstPageID = firstPageId;
        this->fileSize    = fileSize;

        for(uint8_t i=0; i<6; i++) {
            if(blockIds[i] == 0u) break;
            this->blockIDs[i] = blockIds[i];
        }
    }
};

class FileSystem : public generated::FileSystem {

    static constexpr uint16_t NUM_BLOCKS = 1024;

    corfu::BitArray<NUM_BLOCKS> badBlockMarkers; // initialized with zeroes, set respective bit to one, if block is bad
    corfu::Array<FileSystemEntry,100> filetable; // initialized with empty entries
    //FileSystemEntry filetable [128];


    bool handleTelecommandNOP() override;
    bool handleTelecommandSendBBBM() override;
    bool handleTelecommandSendFileInfo(const generated::SendFileInfo &sendFileInfo) override;
    bool handleTelecommandSendFileList() override;

    bool handleTelecommandWriteToMRAM() override;
    bool handleTelecommandReadFromMRAM() override;

public:
    /**
     * sets the Bad Block Marker for a block
     * @param blockID: id of the block found to be bad (0 ... NumberOfBlocks-1)
     */
    RODOS::ErrorCode setBBM(uint32_t blockID) {
        if(badBlockMarkers.getBit(blockID)) { return RODOS::ErrorCode::OK; }
        return badBlockMarkers.setBit(blockID,true);
    }

    /**
     * checks if the Bad Block Marker for the block with the given id is set
     * @param blockID: id of the block (0 ... NumberOfBlocks-1)
     * @return true, if Bad Block Marker set or invalid blockID given;
     */
    bool isBadBlock(uint32_t blockID) {
        auto res = badBlockMarkers.getBit(blockID);
        if(res.isOk()) { return res.val; }
        else return true;
    }

    /**
     * based on the Bad Block table entries of the FileSystem
     * @return number of known bad blocks
     */
    uint16_t recountBadBlocks() {
        uint16_t bb = 0u;
        for(uint16_t i=0u; i<badBlockMarkers.PAYLOAD_SIZE; i++) {
            if(badBlockMarkers.getBit(i).val) { bb++; }
        }
        return bb;
    }




};