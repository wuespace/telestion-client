#pragma once

#include <watchdog-generated/watchdog.h>

#include <corfu/map.h>
#include <corfu/protected-variable.h>


struct AppInfo {
    uint8_t threadsMonitored;
    uint8_t threadsAlive;
    uint8_t threadsCritical;
    uint8_t threadsDead;
};

class Watchdog : public generated::Watchdog {
    corfu::ProtectedVariable<corfu::Map<uint8_t, int64_t, config::watchdog::MAX_APPS>> lastAppContactMap;
    corfu::ProtectedVariable<bool> isResetEnabled;

    corfu::ProtectedVariable<AppInfo> appInfo;

    bool handleTelecommandNOP() override;
    bool handleTelecommandAllowAutomaticReset() override;
    bool handleTelecommandForbidAutomaticReset() override;
    bool handleTelecommandResetNode() override;
    bool handleTelecommandSendThreadDeadlines() override;

    void handleTopicCorfuAnomaly(corfu::Anomaly &message) override;
    void handleTopicCorfuAppIsAlive(corfu::Alive &message) override;
    void handleTopicTimeAndModeTopic(generated::TimeAndModeTopic &message) override;
    bool handleTelecommandSetNodeUTC(const generated::SetNodeUTC &setNodeUTC) override;
    void runWatcher() override;
};
