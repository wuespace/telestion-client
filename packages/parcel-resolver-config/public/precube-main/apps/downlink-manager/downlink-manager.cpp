#include "downlink-manager.h"
//#include <downlink-manager-generated/config.h>


void DownlinkManager::runDlmThread() {

    uint8_t sent = 0;
    corfu::Telemetry tm;

    if(! *(isStdTMPaused.access())) {

        for (uint8_t i = 0; i <  config::downlink_manager::MAX_NUMSTDTM; i++) {
            // get n elements from fifo & post to DownlinkTM Topic
            if(this->corfuStandardTelemetryFifo.isEmpty()) break;
            if(this->corfuStandardTelemetryFifo.syncGet(tm)) {
                corfu::downlinkTelemetryTopic.publish(tm);
                sent++;
            }
        }
    }
    for (uint8_t i = 0; i <  config::downlink_manager::MAX_NUMEXTTM; i++) {
        // get n elements from fifo & post to DownlinkTM Topic
        if(this->corfuExtendedTelemetryFifo.isEmpty()) break;
        if(this->corfuExtendedTelemetryFifo.syncGet(tm)) {
            corfu::downlinkTelemetryTopic.publish(tm);
            sent++;
        }
    }

   // RODOS::PRINTF("DLM: sent %i telemetry msgs for transceiver \n",  sent);
    this->sendAlive(RODOS::NOW()+5_s);
    updateStandardTM();
}


bool DownlinkManager::handleTelecommandNOP() {
    // RODOS::PRINTF("DLM  -->  NOP\n");
    return true;
}

bool DownlinkManager::handleTelecommandPauseLiveTM() {
    // RODOS::PRINTF("DLM  -->  PauseLiveTelemetry\n");
    this->isStdTMPaused.access().operator*() = true;
    // RODOS::PRINTF("DLM paused Transmission of Online StdTM\n");
    return true;
}

bool DownlinkManager::handleTelecommandResumeLiveTM() {
    // RODOS::PRINTF("DLM  -->  ResumeLiveTelemetry\n");
    this->isStdTMPaused.access().operator*() = false;
    // RODOS::PRINTF("DLM resuming Transmission of Online StdTM\n");
    return true;
}

bool DownlinkManager::handleTelecommandFlushSTDQueue() {
    // RODOS::PRINTF("DLM  -->  FlushSTDQueue(\n");
    this->corfuStandardTelemetryFifo.clear();
    return true;
}

bool DownlinkManager::handleTelecommandFlushEXTQueue() {
    // RODOS::PRINTF("DLM  -->  FlushEXTQueue(\n");
    this->corfuExtendedTelemetryFifo.clear();
    return true;
}

void DownlinkManager::updateStandardTM() {
    corfu::Accessor<generated::DownlinkManagerStandardTelemetry> stm = this->standardTelemetry.access();
    stm->stdTMQueue = static_cast<uint8_t>(this->corfuStandardTelemetryFifo.getElementCount());
    stm->extTMQueue = static_cast<uint8_t>(this->corfuExtendedTelemetryFifo.getElementCount());
}
