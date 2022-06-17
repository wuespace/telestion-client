//
// Created by felix on 22.01.21.
//
#include "transceiver.h"
#include <transceiver-generated/topic/file-upload-topic.h>

bool Transceiver::handleTelecommandNOP() {
    RODOS::PRINTF("RADIO      -> RADIO_NOP\n");
    return true;
}

// add ID of topic to forward through the udp gateway
void Transceiver::initialize() {

    topics.init();
    topics.add(generated::radioDownTopicTopic.topicId); // workaround, because of problem in topic generator
    gw.setTopicsToForward(&topics);

    RODOS::PRINTF("TRX ====> set up LinkInterfaceUART!!! \n");
}


bool Transceiver::handleTelecommandResetReceiver(const generated::ResetReceiver& resetReceiver) { return false; }

bool Transceiver::handleTelecommandStartDownlink() {
    RODOS::PRINTF("RADIO      -> RADIO_START_TX\n");
    this->standardTelemetry.access()->isDownlinkActive = true;
    return false;
}

bool Transceiver::handleTelecommandStopDownlink() {
    RODOS::PRINTF("RADIO      -> RADIO_STOP_TX\n");
    this->standardTelemetry.access()->isDownlinkActive = false;
    return false;
}

bool Transceiver::handleTelecommandResetModem() { return false; }
bool Transceiver::handleTelecommandSetTransmissionPower(const generated::SetTransmissionPower& setTransmissionPower) { return false; }


void Transceiver::handleTopicRadioUpTopic(corfu::Telecommand &msg) {

    auto acc = this->standardTelemetry.access();
    acc->tcUplinkCtr++;

    corfu::uplinkTelecommandTopic.publish(msg);
}

// file segments are big, so they are not stored, but forwarded to the firmware uploader
void Transceiver::handleTopicRadioUploadTopic(corfu::FileSegment &message) {
    generated::fileUploadTopicTopic.publish(message);
}


void Transceiver::runTxThread() { /* in reality make sure receiver is off, before sending !!! */
    //  if(this->corfuDownlinkTelemetryFifo.isEmpty()) return;

    // auto acc = this->standardTelemetry.access();
    // if(acc->isDownlinkActive) {

        while(! this->corfuDownlinkTelemetryFifo.isEmpty()) {
            corfu::Telemetry tm;
            bool stuffToSend = this->corfuDownlinkTelemetryFifo.syncGet(tm,0);

            if(stuffToSend) {
                generated::radioDownTopicTopic.publish(tm, true);
                // RODOS::PRINTF("Sent down telemetry @%f \n", RODOS::SECONDS_NOW());
            }
        }

   //  }


}

void Transceiver::updateStandardTelemetry() {}
