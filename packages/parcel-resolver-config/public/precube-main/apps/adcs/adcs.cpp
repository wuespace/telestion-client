//
// Created by Tom on 04.11.2020.
//

#include "adcs.h"
#include "Utils/Constants.h"
#include "Modells/SGP4.h"

using namespace RODOS;


void Adcs::initialize() {
    App::initialize();

    // Time Init
    timeModel.setUTC(TimeModel::calendar2LocalTime(2020, 03, 21, 12, 00, 00));

    // TLE Init
    char tle1[130];
    char tle2[130];
    strncpy(tle1, "1 25544U 98067A   21014.31054398  .00001697  00000-0  38545-4 0  9993", 130);
    strncpy(tle2, "2 25544  51.6457  23.8259 0000410 224.6534 316.4858 15.49291243264748", 130);

    int64_t starting = TimeModel::getNanoseconds();

    sgp4.set_tle(tle1, tle2);
    sgp4.init_sgp4();
    double duration = (TimeModel::getNanoseconds() - starting) / MILLISECONDS;
    PRINTF("SGP4 Init:\n");
    PRINTF("Duration: %lf Milliseconds\n", duration);
}

void Adcs::runMyThread() {
    PRINTF("\nRunning Simulation\n");
    PRINTF("Time Alive: %lf\n\n", (TimeModel::getNanoseconds()/(float)SECONDS));

    Vector3D velocity;
    double current_JD = AstroTimeUtils::RodosTimeToJD(timeModel.getUTC());
    PRINTF("Current JD: %lf\n", current_JD);
    PRINTF("Current UTC: %lf\n", timeModel.getUTC()/(double)SECONDS);
    int64_t starting = TimeModel::getNanoseconds();
    sgp4.propagate(current_JD, position, velocity);
    double duration = (TimeModel::getNanoseconds() - starting) / MILLISECONDS;
    PRINTF("SGP4 Propagate:\n");
    PRINTF("Duration: %lf Milliseconds\n", duration);
    PRINTF("SGP4 ECI Vector x: %lf, y: %lf, z: %lf\n", position.x, position.y, position.z);
    PRINTF("SGP4 ECI Velocity x: %lf, y: %lf, z: %lf\n", velocity.x, velocity.y, velocity.z);


    starting = TimeModel::getNanoseconds();
    ECICoordinates magnetic_vector = WMM_Model.calculateMagneticVector(position, current_JD);
    duration = (TimeModel::getNanoseconds() - starting) / MILLISECONDS;
    PRINTF("WMM Propagate:\n");

    PRINTF("Duration: %lf Milliseconds\n", duration);
    PRINTF("Magnetic ECI Vector x: %lf, y: %lf, z: %lf\n", magnetic_vector.x * Constants::nanoTeslaToMicroTesla,
           magnetic_vector.y * Constants::nanoTeslaToMicroTesla, magnetic_vector.z * Constants::nanoTeslaToMicroTesla);

    Vector3D sunVec;
    starting = TimeModel::getNanoseconds();
    sunVec = sunModel.getSunVector_eci(current_JD, position);
    duration = (TimeModel::getNanoseconds() - starting) / MILLISECONDS;
    PRINTF("Sun Modell:\n");

    PRINTF("Duration: %lf Milliseconds\n", duration);
    PRINTF("Sun Vector x: %lf, y: %lf, z: %lf\n", sunVec.x, sunVec.y, sunVec.z);

}

bool Adcs::handleTelecommandNop() {
    return false;
}

bool Adcs::handleTelecommandGenerateAnomaly() {
    return false;
}

bool Adcs::handleTelecommandIncrementCounter(const generated::IncrementCounter &incrementCounter) {
    return false;
}

bool Adcs::handleTelecommandTwoParameters(const generated::TwoParameters &twoParameters) {
    return false;
}
