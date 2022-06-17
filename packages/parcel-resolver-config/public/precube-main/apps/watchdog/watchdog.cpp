#include "watchdog.h"

#include <watchdog-generated/anomaly.h>
#include <watchdog-generated/extended-telemetry/thread-dead-lines.h>
#include <watchdog.h>
#include <corfu/map.h>


void Watchdog::runWatcher() {

    uint8_t monitored  = 0;
    uint8_t critical   = 0;
    uint8_t alive      = 0;
    uint8_t dead       = 0;

    uint8_t criticalId = 0;
    int64_t criticalDl = 0;

    corfu::Accessor<corfu::Map<uint8_t, int64_t, config::watchdog::MAX_APPS>> mac = this->lastAppContactMap.access();
    int64_t time_now = RODOS::NOW();

    uint8_t  c = 0;
    for(const auto& entry : *mac) {
        if (entry.first != 0) {
            monitored++;

           // RODOS::PRINTF("looking at appID %d at %u \n", entry.first, c++);

            if(entry.second > time_now + 1_s) {   // make wat threashold configurable?
                alive++;
            } else if(entry.second <= time_now) {
                dead++;
                reportAnomaly(generated::anomaly::watchdog::APP_TIMEOUT);
            } else {
                // @todo: write those directly to tm?
                critical++;
                criticalId = entry.first;
                criticalDl = time_now - entry.second;
            }
        }
    }

    // RODOS::PRINTF("Apps monitored: %u, Apps alive: %u, Apps critical: %u, Apps dead: %u \n", monitored, alive, critical, dead);

    // update standard telemetry
    corfu::Accessor stm     = this->standardTelemetry.access();
    stm->criticalThreads    = critical;
    stm->deadThreads        = dead;
    stm->watchedThreads     = monitored;
    stm->isResetEnabled     = this->isResetEnabled.access().operator*();


    // stay on
    RODOS::hwTriggerWatchdog();
}

void Watchdog::handleTopicCorfuAppIsAlive(corfu::Alive &message) {
    // this->lastAppContactMap.access()->set(message.id, message.timeout);
    corfu::Accessor<corfu::Map<uint8_t, int64_t, config::watchdog::MAX_APPS>> lcm = this->lastAppContactMap.access();
    lcm->set(message.id, message.timeout);
    // RODOS::PRINTF("received keepalive from %d \n" , message.id);
}

bool Watchdog::handleTelecommandNOP() {
    RODOS::PRINTF("WAT=      -> WAT_NOP\n");
    return true;
}

bool Watchdog::handleTelecommandAllowAutomaticReset() {
    RODOS::PRINTF("WAT=      -> WAT_ALLOW_RESET\n");
    this->isResetEnabled.access().operator*() = true;
    return true;
}

bool Watchdog::handleTelecommandForbidAutomaticReset() {
    RODOS::PRINTF("WAT=      -> WAT_FORBID_RESET\n");
    this->isResetEnabled.access().operator*() = false;
    return true;
}

bool Watchdog::handleTelecommandResetNode() {
    RODOS::PRINTF("WAT=      -> WAT_RESET_NODE!\n");
    if(this->isResetEnabled.access().operator*() == true) {
        RODOS::hwResetAndReboot(); // never returns
    }
    RODOS::PRINTF("WAT=      -> WAT_RESET_NOT_ALLOWED!\n");
    return false;
}


bool Watchdog::handleTelecommandSendThreadDeadlines() {
    RODOS::PRINTF("WAT=      -> WAT_SEND_APP_DLS!\n");
    generated::ThreadDeadLines deadlines;

    corfu::Accessor acc = this->lastAppContactMap.access();
    corfu::Map<uint8_t, int64_t, config::watchdog::MAX_APPS>::Iterator it = acc->begin();

    for(auto & entry : deadlines.entries) {
        if(it != acc->end()) {
            entry.threadId = it.operator*().first;
            entry.deadLine = it.operator*().second;
            it.operator++();
        }
    }
    corfu::Telemetry tm = this->finalizeTelemetry(deadlines);
    corfu::extendedTelemetryTopic.publish(tm);
    return false;
}

// @todo !!!
void Watchdog::handleTopicTimeAndModeTopic(generated::TimeAndModeTopic &message) {

}

// @todo !!!
void Watchdog::handleTopicCorfuAnomaly(corfu::Anomaly &message) {

}

bool Watchdog::handleTelecommandSetNodeUTC(const generated::SetNodeUTC &setNodeUTC) {
    return false;
}

