#include "file-system.h"

bool FileSystem::handleTelecommandNOP() {
    RODOS::PRINTF("\n FS: FS_NOP\n");
    return true;
}

bool FileSystem::handleTelecommandSendBBBM() {
    RODOS::PRINTF("\n FS: FS_SEND_BBM\n");
    return false;
}

bool FileSystem::handleTelecommandSendFileInfo(const generated::SendFileInfo &sendFileInfo) {

    uint8_t ids = sizeof (sendFileInfo.fileIDs);

    for(uint8_t i=0; i<ids; i++) {
        if()
    }

    return false;
}

bool FileSystem::handleTelecommandSendFileList() {
    return false;
}

bool FileSystem::handleTelecommandWriteToMRAM() {
    return false;
}

bool FileSystem::handleTelecommandReadFromMRAM() {
    return false;
}


