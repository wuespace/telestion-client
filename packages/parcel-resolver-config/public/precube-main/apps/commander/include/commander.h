#pragma once

#include <commander-generated/commander.h>

class Commander : public generated::Commander {

    uint16_t lastCmdIndex           = 0u;
    uint16_t lastCmdInSeqCtr        = 0u;
    uint16_t authErrors             = 0u;
    int64_t lastCmdReceivedTime     = 0u;
    int64_t lastValidCmdRecvTime    = 0u;
    int64_t lastValidTTCmdRecvTime  = 0u; // wie ist das mit rodos::now()?

    uint16_t iterations = 0;

    static bool isSignatureOk(const corfu::Telecommand& tm);
    void updateStdTM();

protected:
    bool isCheckPaused = false;
    bool handleTelecommandNOP() override;

public:
    void runCommandThread() override;



};