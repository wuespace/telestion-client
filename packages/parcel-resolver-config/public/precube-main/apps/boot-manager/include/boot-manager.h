#pragma once

#include <boot-manager-generated/boot-manager.h>

class BootManager : public generated::BootManager {

    bool handleTelecommandNOP() override;
    bool handleTelecommandReboot() override;
    bool handleTelecommandSetPermantentAddressForNextBoot(const generated::SetPermantentAddressForNextBoot &setPermantentAddressForNextBoot) override;
    bool handleTelecommandSetTemporaryAddressForNextBoot(const generated::SetTemporaryAddressForNextBoot &setTemporaryAddressForNextBoot) override;
};