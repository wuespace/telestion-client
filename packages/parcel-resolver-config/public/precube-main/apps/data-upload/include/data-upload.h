//
// Created by felix on 18.10.21.
//
#pragma once

#include <data-upload-generated/data-upload.h>
#include <corfu/file-segment.h>


class DataUpload: public generated::DataUpload {

    /* bitmap to mark received chunks -> bitmap size = max possible number of chunks */
    static const uint32_t bitmapLength = config::data_upload::MAX_FILE_SIZE_IN_BYTES / config::data_upload::EXPECTED_CHUNK_SIZE;
    corfu::BitArray<bitmapLength> bitmap;


protected:
     // void handleTopicFileTransferTopic(corfu::FileSegment& message) override;
     // we take care of incomming file segments in this thread (not anymore in context of the gateway thread, as we did before)
     void runDupThread() override;

     bool handleTelecommandNOP() override;
     bool handleTelecommandSendBitmap() override;
     bool handleTelecommandExpectFile(const generated::ExpectFile& expectFile) override;
     bool handleTelecommandComputeCRC(const generated::ComputeCRC& computeCRC) override;
     bool handleTelecommandCheckUploadComplete(const generated::CheckUploadComplete& checkUploadComplete) override;
     bool handleTelecommandDeleteBlock(const generated::DeleteBlock &deleteBlock) override;

};