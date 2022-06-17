#pragma once

#include <time-and-mode-manager-generated/time-and-mode-manager.h>

class TimeAndModeManager : public generated::TimeAndModeManager {

    bool handleTelecommandNOP() override;
    bool handleTelecommandEnterSafeMode() override;
    bool handleTelecommandEnterNominal() override;
    bool handleTelecommandSetUTC(const generated::SetUTC &setUTC) override;
    bool handleTelecommandAdjustUTC(const generated::AdjustUTC &adjustUTC) override;
    bool handleTelecommandSetClockDrift(const generated::SetClockDrift &setClockDrift) override;
    bool handleTelecommandNextStartInLEOP() override;

protected:
    void handleTopicCriticalAnomalyTopic(corfu::Anomaly &message) override;

public:
    void runTammThread() override;

};
