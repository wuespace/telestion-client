#include "commander.h"
#include "commander-generated/anomaly.h"
#include "../../generated/apps/timed-commander/include/timed-commander-generated/topic/timed-telecommand-topic.h"

#include <corfu/node.h>


void Commander::runCommandThread() {
    // check incoming tc fifo, look at as many items as are currently set
    // (fifo will be refilled constantly), optional: just look at first X items?

     RODOS::PRINTF("CMDThread @%u \n", this->iterations);
    this->iterations++;

    uint16_t elements = corfuUplinkTelecommandFifo.getElementCount();
    for (uint16_t i=0u; i<elements; i++) {
        if(corfuUplinkTelecommandFifo.isEmpty()) break;

        corfu::Telecommand tc;
        corfuUplinkTelecommandFifo.syncGet(tc, 1_s);
        this->lastCmdReceivedTime = RODOS::NOW();

        if(tc.timeToExecute == 0u) { // immediate command

            this->lastCmdIndex++;  // = tc.commandIndex;
            this->lastCmdReceivedTime = RODOS::NOW();

            if(isSignatureOk(tc)) {
                this->lastValidCmdRecvTime = RODOS::NOW();

                if (getNode().nodeId == tc.nodeID) {
                    // publish on local node only
                    corfu::telecommandTopic.publish(tc, false);
                } else {
                    // send to network
                    corfu::telecommandTopic.publish(tc, true);
                }
            } else { this->authErrors++; }
        }
        else {  // time tagged telecommand -> forward via timed telecommand topic

            this->lastCmdInSeqCtr++; // = tc.commandIndex;
            // this->lastCmdReceivedTime = RODOS::NOW();

            if(isSignatureOk(tc)) {
                this->lastValidTTCmdRecvTime = RODOS::NOW();

                if(getNode().nodeId == tc.nodeID) {
                    // publish on local node only
                    generated::timedTelecommandTopicTopic.publish(tc, false);
                }
                else {
                    // send to network
                    generated::timedTelecommandTopicTopic.publish(tc, true);
                }
            } else { this->authErrors++; }

        } // end of signature checking

    } // end of for loop

    // check anomaly conditions
    if( RODOS::NOW() > this->lastCmdReceivedTime + 86400_s) {
        reportAnomaly(generated::anomaly::commander::ONE_DAYNOCOMMAND);
    }
    if(this->lastValidCmdRecvTime - this->lastCmdReceivedTime >= 3600_s) { reportAnomaly(generated::anomaly::commander::NO_VALIDSIGNATURES); }

    // send keepalive
    this->sendAlive(RODOS::NOW()+5_s);
    // update standardTelemetry
    updateStdTM();

    // if(got_cmd) { RODOS::PRINTF("CMD ... GOT  %u NOPs! \n", got_cmd); }
   //  else { RODOS::PRINTF("CMD ...  GOT NO CMDS :( \n"); }
}


bool Commander::handleTelecommandNOP() {
    RODOS::PRINTF("\n CMD: CMD_NOP\n");
    return true;
}


bool Commander::isSignatureOk(const corfu::Telecommand& tm) {
    // we have no checking yet, so
    return true;
}

void Commander::updateStdTM() {
    corfu::Accessor acc = standardTelemetry.access();
    acc->cmdCounter = this->lastCmdIndex;
    acc->lastCmdInSeqCounter = this->lastCmdInSeqCtr;
    acc->authErrorCounter = this->authErrors;
    acc->iteration = this->iterations;
}



// do we need a last measure, in case signature checks are compromised / broken?
// stop validate could carry &  be checked against one hardcoded passphrase
// bool Commander::handleTelecommandStopValidate(const StopValidate& stopValidate) {}