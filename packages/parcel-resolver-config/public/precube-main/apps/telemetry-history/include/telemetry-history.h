#pragma once

#include <telemetry-history-generated/telemetry-history.h>

class TelemetryHistory : public generated::TelemetryHistory {

    bool handleTelecommandNOP() override;
    bool handleTelecommandSendHistoricTM() override;
    bool handleTelecommandStopSending() override;

};