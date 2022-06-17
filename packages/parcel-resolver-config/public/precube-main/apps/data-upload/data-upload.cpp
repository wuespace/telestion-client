//
// Created by felix on 18.10.21.
// rewrite of FirmwareReceiver from May 21
// to use real spi flash + file system
//

#include "data-upload.h"
#include "../../../drivers/flash/FlashInnocube/FlashInnocube.h"


void DataUpload::runDupThread() {
// look if there are file segments in the queue
// then:

    // check crc
    // check if bitmap (i) is still zero -> double write attempts are not good with flash

    // write segment to flash
    // set bit of bitmap

    // update standard telemetry

}


bool DataUpload::handleTelecommandExpectFile(const generated::ExpectFile& expectFile) {
    RODOS::PRINTF("DUP ====> EXPECT FILE\n");

    // check, if there is enough free space to put the file (filesystem / mram-manager)
    // might cause ANOMALY EXT_FLASH_FULL

    // clear BITMAP and define used length according to expected number of chunks

    // now file segments can be received and stored where we can find them

    return false;
}

bool DataUpload::handleTelecommandNOP(){
    RODOS::PRINTF("DUP ====> RECEIVED NOP\n");
    return true;
}

bool DataUpload::handleTelecommandSendBitmap(){
    RODOS::PRINTF("DUP ====> SEND BITMAP\n");

    return false;
}

bool DataUpload::handleTelecommandComputeCRC(const generated::ComputeCRC& computeCRC){
    RODOS::PRINTF("DUP ====> COMPUTE CRC of %u.\n", computeCRC.blockID);
return false;
}

bool DataUpload::handleTelecommandCheckUploadComplete(const generated::CheckUploadComplete& checkUploadComplete){
    // is bitmap _all_ ones?
    // is overall crc correct?
return false;
}

bool DataUpload::handleTelecommandDeleteBlock(const generated::DeleteBlock &deleteBlock) {
    return false;
}


