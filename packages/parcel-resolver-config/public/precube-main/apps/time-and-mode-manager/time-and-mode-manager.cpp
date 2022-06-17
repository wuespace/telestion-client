#include "time-and-mode-manager.h"


//@todo !!!
void TimeAndModeManager::runTammThread() {

}

// @todo !!!
void TimeAndModeManager::handleTopicCriticalAnomalyTopic(corfu::Anomaly &message) {

}

bool TimeAndModeManager::handleTelecommandNOP() {
    return false;
}

bool TimeAndModeManager::handleTelecommandEnterSafeMode() {
    return false;
}

bool TimeAndModeManager::handleTelecommandEnterNominal() {
    return false;
}

bool TimeAndModeManager::handleTelecommandSetUTC(const generated::SetUTC &setUTC) {
    return false;
}

bool TimeAndModeManager::handleTelecommandAdjustUTC(const generated::AdjustUTC &adjustUTC) {
    return false;
}

bool TimeAndModeManager::handleTelecommandSetClockDrift(const generated::SetClockDrift &setClockDrift) {
    return false;
}

bool TimeAndModeManager::handleTelecommandNextStartInLEOP() {
    return false;
}

