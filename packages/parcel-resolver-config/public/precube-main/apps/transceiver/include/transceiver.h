//
// Created by felix on 22.01.21.
//
#pragma once

#include <transceiver-generated/transceiver.h>

#include <gateway/gateway.h>
#include <gateway/linkinterfaceudp.h>
#include <gateway/linkinterfaceuart.h>
#include <gateway/networkmessage.h>
#include <hal/hal_uart.h>
#include <hal/udp.h>

namespace RODOS {
    // extern HAL_UART uart_stdout;
    extern HAL_UART uart_egse;
}


class Transceiver: public generated::Transceiver {

    // already configured in standard telemestry
    corfu::ProtectedVariable<bool>     isUplinkActive;
    corfu::ProtectedVariable<bool>     isDownlinkActive;
    corfu::ProtectedVariable<uint16_t> transmissionPower;

private:
    /*
     * using UDP
     */
    // RODOS::UDPInOut         udpio { config::transceiver::UPLINK_PORT, config::transceiver::DOWNLINK_PORT, "localhost" };
    // RODOS::LinkinterfaceUDP link  { &udpio };

    /*
     * using UART
     */
    RODOS::LinkinterfaceUART link { &RODOS::uart_egse };

    RODOS::Gateway          gw    { &link, true };
    RODOS::TopicListReport  topics;

protected:
    void handleTopicRadioUpTopic(corfu::Telecommand &message) override;
    void handleTopicRadioUploadTopic(corfu::FileSegment& message) override;
    bool handleTelecommandNOP() override;
    bool handleTelecommandResetReceiver(const generated::ResetReceiver& resetReceiver) override;
    bool handleTelecommandStartDownlink() override;
    bool handleTelecommandStopDownlink() override;
    bool handleTelecommandResetModem() override;
    bool handleTelecommandSetTransmissionPower(const generated::SetTransmissionPower& setTransmissionPower) override;

public:
    void initialize() override;
    void runTxThread() override;
    void updateStandardTelemetry() override;

};
