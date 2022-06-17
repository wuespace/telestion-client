#include "boot-manager.h"

bool BootManager::handleTelecommandNOP() {
    RODOS::PRINTF("BTM ====> NOP!\n");
    return true;
}

bool BootManager::handleTelecommandReboot() {
    return false;
}

bool BootManager::handleTelecommandSetPermantentAddressForNextBoot(
        const generated::SetPermantentAddressForNextBoot &setPermantentAddressForNextBoot) {
    return false;
}

bool BootManager::handleTelecommandSetTemporaryAddressForNextBoot(
        const generated::SetTemporaryAddressForNextBoot &setTemporaryAddressForNextBoot) {
    return false;
}
