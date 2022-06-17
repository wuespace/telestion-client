#pragma once

#include <distributed-backup-generated/distributed-backup.h>

class DistributedBackup : public generated::DistributedBackup {

    bool handleTelecommandNOP() override;
};