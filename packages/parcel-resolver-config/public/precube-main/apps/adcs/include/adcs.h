//
// Created by Tom on 04.11.2020.
//
#pragma once

#include <adcs-generated/adcs.h>

#include "../Modells/WMM.h"
#include "../Modells/SGP4.h"
#include "../Modells/SunModel.h"


class Adcs : public generated::Adcs {
protected:
    void runMyThread() override;

    bool handleTelecommandNop() override;

    bool handleTelecommandGenerateAnomaly() override;

    bool handleTelecommandIncrementCounter(const generated::IncrementCounter &incrementCounter) override;

    bool handleTelecommandTwoParameters(const generated::TwoParameters &twoParameters) override;

private:
    WMM WMM_Model;
    SGP4 sgp4;
    SunModel sunModel;

    ECICoordinates position;

    RODOS::TimeModel timeModel;
public:
    void initialize() override;

};
