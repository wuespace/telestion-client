#pragma once

#include <downlink-manager-generated/downlink-manager.h>

class DownlinkManager : public generated::DownlinkManager {

    corfu::ProtectedVariable<bool> isStdTMPaused;

    bool handleTelecommandNOP() override;
    bool handleTelecommandPauseLiveTM() override;
    bool handleTelecommandResumeLiveTM() override;
    bool handleTelecommandFlushSTDQueue() override;
    bool handleTelecommandFlushEXTQueue() override;
    void updateStandardTM();

public:
    void runDlmThread() override;

};


