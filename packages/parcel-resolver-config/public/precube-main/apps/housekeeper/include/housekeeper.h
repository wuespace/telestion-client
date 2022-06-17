#pragma once

#include <housekeeper-generated/housekeeper.h>
#include <common-generated/anomaly.h>

#include <corfu/map.h>
#include <ringbuffer.h>



class Housekeeper : public generated::Housekeeper {

    corfu::ProtectedVariable<std::uint16_t> historyRate;
    std::uint16_t intervallCounter = 0;

    corfu::ProtectedVariable<corfu::Map<corfu::Anomaly::ID, uint8_t, generated::NUMBER_OF_ANOMALIES>> histogram;
    corfu::ProtectedVariable<RODOS::RingBuffer<corfu::Anomaly, config::housekeeper::ANOMALY_HISTORYSIZE>> history;
    int64_t last_heartbeat  = 0;

    bool handleTelecommandNOP() override;
    bool handleTelecommandSetHistoryRate(const generated::SetHistoryRate& setHistoryRate) override;
    bool handleTelecommandSendHistogram() override;
    bool handleTelecommandSendHistory() override;

protected:
    void handleTopicCorfuAnomaly(corfu::Anomaly &message) override;

private:
    bool handleTelecommandClearAnomalyCounter()override;

public:
    void runCollector() override;

};
