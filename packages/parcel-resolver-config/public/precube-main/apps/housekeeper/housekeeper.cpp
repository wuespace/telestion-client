#include "housekeeper.h"

#include <corfu/node.h>
#include <corfu/telemetry.h>


void Housekeeper::runCollector() {
   corfu::Accessor hr = this->historyRate.access();
    // auto acc = this->standardTelemetry.access();

    // why two history rates???!

    if(*hr == 0) { // @todo: move this to init, so we don't check it every iteration
        *hr = config::housekeeper::DEFAULT_HISTORY_RATE;
        // RODOS::PRINTF("In housekeeper collector setting hr \n");
        corfu::Accessor stdtm = this->standardTelemetry.access();
        stdtm->historyRate = *hr; // hr.operator*();
    }

    intervallCounter++;
    if(intervallCounter >= *hr) {
        auto stm = this->standardTelemetry.access();
        stm->iteration += intervallCounter;
        corfu::Telemetry telemetry;
        telemetry.subserviceID  = config::housekeeper::STANDARD_TELEMETRY_SUBSERVICE_ID;
        telemetry.payloadLength = static_cast<uint16_t>(getNode().serializeStandardTelemetry(telemetry.getSerializedPayloadSlice()));
        finalizeTelemetry(telemetry);
        corfu::standardTelemetryTopic.publish(telemetry);
        intervallCounter = 0;
        // RODOS::PRINTF("HKE sent tm \n");
    }
    // RODOS::PRINTF(" HKE end of collector \n");


    // todo: send iAmAlive to local watchdog!
}


void Housekeeper::handleTopicCorfuAnomaly(corfu::Anomaly &message) {
    corfu::Accessor stm = this->standardTelemetry.access();
    stm->anomalyCtr++;
    // this->standardTelemetry.access()->anomalyCtr++;

    corfu::Accessor acc = this->histogram.access();
    RODOS::Result   res = acc->get(message.id);
    uint8_t count       = res.isOk() ? res.val : 0u;
    acc->set(message.id, count+1u);

    this->history.access()->put(message);
}

bool Housekeeper::handleTelecommandNOP() {
    // RODOS::PRINTF("HKR: HKR_NOP\n");
    return true;
}

bool Housekeeper::handleTelecommandSetHistoryRate(const generated::SetHistoryRate& setHistoryRate) {
    // RODOS::PRINTF("HKR: HKR_SHR\n");

    corfu::Accessor hr = this->historyRate.access();
    *hr = setHistoryRate.rate;
    corfu::Accessor stdtm = this->standardTelemetry.access();

    stdtm->historyRate = *hr;
    return true;
}

bool Housekeeper::handleTelecommandClearAnomalyCounter() {
    // RODOS::PRINTF("ANM=      -> ANM_CLEAR\n");

    // reset all counters in the histogram
    corfu::Accessor acc = this->histogram.access();
    for (auto& [id, amount] : *acc) {
        id     = 0;
        amount = 0;
    }

    // reset standard Telemetry counters
    corfu::Accessor stm  = this->standardTelemetry.access();
    stm->anomalyCtr   = 0;

    // clear history ringbuffer
    corfu::Accessor acc2 = this->history.access();
    acc2.operator*() = RODOS::RingBuffer<corfu::Anomaly, config::housekeeper::ANOMALY_HISTORYSIZE>();

    return true;
}

bool Housekeeper::handleTelecommandSendHistory() {
    // RODOS::PRINTF("ANM=      -> ANM_SEND_RINGBUFFER\n");
    corfu::Accessor acc = this->history.access();
    RODOS::RingBuffer<corfu::Anomaly, config::housekeeper::ANOMALY_HISTORYSIZE> * rb = acc.operator->();

    generated::AnomalyHistory histoForTM;
    for(auto & h : histoForTM.history) {

        /* workaround until generator allows corfu built-in types as tm payloads */
        corfu::Anomaly a;
        rb->get(a);
        h.anomalyId  = a.id;
        h.isCritical = a.isCritical;
        h.reportTime = a.reportTime;

        /* this is how it will be */
        // rb->get(h);             // we need no range check here, as rb will not move the read index past the last write
    }
    corfu::Telemetry extm = this->finalizeTelemetry(histoForTM);
    corfu::extendedTelemetryTopic.publish(extm);

    return true;
}

bool Housekeeper::handleTelecommandSendHistogram() {
    // RODOS::PRINTF("ANM=      -> ANM_SEND_HISTOGRAM\n");

    generated::AnomalyHistogram histoForTM;
    corfu::Accessor acc = this->histogram.access();
    corfu::Map<corfu::Anomaly::ID, uint8_t, generated::NUMBER_OF_ANOMALIES>::Iterator it = acc->begin();
    for (auto & entry : histoForTM.entries) {
        if(it != acc->end()) {
            entry.anomalyId = it.operator*().first;
            entry.counted   = it.operator*().second;
            it.operator++();
        }
    }
    corfu::Telemetry extm = this->finalizeTelemetry(histoForTM);
    corfu::extendedTelemetryTopic.publish(extm);
    return true;
}


