/*
 * sun_model.h
 *
 *  Created on: 31.07.2018
 *      Author: Tom
 */

#ifndef SRC_DETERMINATION_PREDICTION_SUN_MODEL_H_
#define SRC_DETERMINATION_PREDICTION_SUN_MODEL_H_

#include "matlib.h"

class SunModel {
private:
	RODOS::Vector3D sunPosition;
	double JD;

	bool currentHighPrec;
	bool useHighPrec;

	//Private functions
	RODOS::Vector3D getSunPosition_high(double JD);
	RODOS::Vector3D getSunPosition_low(double JD);
public:
	SunModel();
	~SunModel();

	RODOS::Vector3D getSunPosition(double JD);
	bool getEclipseState(double JD, RODOS::Vector3D satPosition);
	void setUseHighPrec();
	void setUseLowPrec();

	RODOS::Vector3D getSunVector_eci(double JD, RODOS::Vector3D satPosition_eci);


};

#endif /* SRC_DETERMINATION_PREDICTION_SUN_MODEL_H_ */
