/*
 * sun_model.cpp
 *
 *  Created on: 31.07.2018
 *      Author: Tom
 *
 *      //Uses code from:
 *                            companion code for
 *               fundamentals of astrodynamics and applications
 *                                    2013
 *                              by david vallado
 *
 *       (w) 719-573-2600, email dvallado@agi.com
 */

#include "SunModel.h"
#include "../Utils/Constants.h"
#include <math.h>

#include "SunModel_Data.h"

using namespace SunModel_Data;
using namespace RODOS;

SunModel::SunModel() {
	JD = 0;
	useHighPrec = false;
	currentHighPrec = useHighPrec; //set current calced model to what was choosen above
}

SunModel::~SunModel() {

}

void SunModel::setUseHighPrec() {
	useHighPrec = true;
}

void SunModel::setUseLowPrec() {
	useHighPrec = false;
}

Vector3D SunModel::getSunPosition(double JD) {
	if (useHighPrec)
		return getSunPosition_high(JD);
	return getSunPosition_low(JD);
}

//calc suns position in ECI in J2000.0
//From Astronomical Algorithms Jean Meeus, S. 151ff and S. 205ff
Vector3D SunModel::getSunPosition_high(double JD) {
	//check if currently already calculated
	if (this->JD == JD && currentHighPrec) {
		return sunPosition;
	}

	Vector3D out;

	double jd = JD; //2000?

	double tao = (jd - 2451545.0) / 365250;

	//Calc L0:
	double L0Sum = 0;
	for (int i = 0; i < 64; i++) {
		L0Sum += L0[i][0] * cos(L0[i][1] + L0[i][2] * tao);
	}
	double L1Sum = 0;
	for (int i = 0; i < 34; i++) {
		L1Sum += L1[i][0] * cos(L1[i][1] + L1[i][2] * tao);
	}

	double L2Sum = 0;
	for (int i = 0; i < 20; i++) {
		L2Sum += L2[i][0] * cos(L2[i][1] + L2[i][2] * tao);
	}

	double L3Sum = 0;
	for (int i = 0; i < 7; i++) {
		L3Sum += L3[i][0] * cos(L3[i][1] + L3[i][2] * tao);
	}

	double L4Sum = 0;
	for (int i = 0; i < 3; i++) {
		L4Sum += L4[i][0] * cos(L4[i][1] + L4[i][2] * tao);
	}

	double L5Sum = 0;
	for (int i = 0; i < 1; i++) {
		L5Sum += L5[i][0] * cos(L5[i][1] + L5[i][2] * tao);
	}

	double L = (L0Sum + L1Sum * pow(tao, 1) + +L2Sum * pow(tao, 2)
			+ L3Sum * pow(tao, 3) + L4Sum * pow(tao, 4) + L5Sum * pow(tao, 5))
			/ 1E8;

	//Calc B

	double B0Sum = 0;

	for (int i = 0; i < 5; i++) {
		B0Sum += B0[i][0] * cos(B0[i][1] + B0[i][2] * tao);
	}

	double B1Sum = 0;
	for (int i = 0; i < 2; i++) {
		B1Sum += B1[i][0] * cos(B1[i][1] + B1[i][2] * tao);
	}

	double B = (B0Sum + B1Sum * pow(tao, 1)) / 1E8;

	//calc R
	double R0Sum = 0;

	for (int i = 0; i < 40; i++) {
		R0Sum += R0[i][0] * cos(R0[i][1] + R0[i][2] * tao);
	}

	double R1Sum = 0;

	for (int i = 0; i < 10; i++) {
		R1Sum += R1[i][0] * cos(R1[i][1] + R1[i][2] * tao);
	}

	double R2Sum = 0;

	for (int i = 0; i < 6; i++) {
		R2Sum += R2[i][0] * cos(R2[i][1] + R2[i][2] * tao);
	}

	double R3Sum = 0;

	for (int i = 0; i < 2; i++) {
		R3Sum += R3[i][0] * cos(R3[i][1] + R3[i][2] * tao);
	}

	double R4Sum = 0;

	for (int i = 0; i < 1; i++) {
		R4Sum += R4[i][0] * cos(R4[i][1] + R4[i][2] * tao);
	}

	//In AE, so multiply by km in AE
	double R = Constants::AE_TO_KM
			* ((R0Sum + R1Sum * pow(tao, 1) + +R2Sum * pow(tao, 2)
					+ R3Sum * pow(tao, 3) + R4Sum * pow(tao, 4)) / 1E8);

	//std::cout<<"R "<<R<<std::endl;

	//make geocentric:
	double phi = L + M_PI;
	double beta = -1 * B;

	//calc mean epsilon and in rad
	double T = 10 * tao;
	double epsilon = (23 + (26.0 / 60.0) + (21.448 / (60 * 60)))
			- (46.8150 / (60 * 60)) * T - (0.00059 / (60 * 60)) * pow(T, 2)
			+ (0.001813 / (60 * 60)) * pow(T, 3);
	epsilon = epsilon * Constants::degToRad;

	//std::cout<<"Eb "<<epsilon<<std::endl;

	//calc coordinates
	out.x = R * (cos(beta) * cos(phi));
	out.y = R
			* (cos(beta) * sin(phi) * cos(epsilon) - sin(beta) * sin(epsilon));
	out.z = R
			* (cos(beta) * sin(phi) * sin(epsilon) + sin(beta) * cos(epsilon));

	sunPosition = out;
	currentHighPrec = true;
	return out;

}

Vector3D SunModel::getSunPosition_low(double JD) {
	//check if currently already calculated and used low prec
	if (this->JD == JD && !currentHighPrec) {
		return sunPosition;
	}

	/* ------------------------------------------------------------------------------
	 *
	 *                           function sun
	 *
	 *  this function calculates the geocentric equatorial position vector
	 *    the sun given the julian date.  this is the low precision formula and
	 *    is valid for years from 1950 to 2050.  accuaracy of apparent coordinates
	 *    is 0.01  degrees.  notice many of the calculations are performed in
	 *    degrees, and are not changed until later.  this is due to the fact that
	 *    the almanac uses degrees exclusively in their formulations.
	 *
	 *  author        : david vallado                  719-573-2600   27 may 2002
	 *
	 *  revisions
	 *    vallado     - fix mean lon of sun                            7 mat 2004
	 *
	 *  inputs          description                    range / units
	 *    jdtdb         - epoch julian date              days from 4713 BC
	 *    jdtdbF        - epoch julian date fraction     day fraction from jdutc
	 *
	 *  outputs       :
	 *    rsun        - ijk position vector of the sun au
	 *    rtasc       - right ascension                rad
	 *    decl        - declination                    rad
	 *
	 *  locals        :
	 *    meanlong    - mean longitude
	 *    meananomaly - mean anomaly
	 *    eclplong    - ecliptic longitude
	 *    obliquity   - mean obliquity of the ecliptic
	 *    tut1        - julian centuries of ut1 from
	 *                  jan 1, 2000 12h
	 *    ttdb        - julian centuries of tdb from
	 *                  jan 1, 2000 12h
	 *    hr          - hours                          0 .. 24              10
	 *    min         - minutes                        0 .. 59              15
	 *    sec         - seconds                        0.0  .. 59.99          30.00
	 *    temp        - temporary variable
	 *    deg         - degrees
	 *
	 *  coupling      :
	 *    none.
	 *
	 *  references    :
	 *    vallado       2013, 279, alg 29, ex 5-1
	 * --------------------------------------------------------------------------- */
	Vector3D sun_ijk;

	double deg2rad;
	double tut1, meanlong, ttdb, meananomaly, eclplong, obliquity, magr;

	deg2rad = Constants::degToRad;
	double twopi = 2 * M_PI;

	// -------------------------  implementation   -----------------
	// -------------------  initialize values   --------------------
	tut1 = (JD - 2451545.0) / 36525.0;

	meanlong = 280.460 + 36000.77 * tut1;
	meanlong = fmod(meanlong, 360.0);	//deg

	ttdb = tut1;
	meananomaly = 357.5277233 + 35999.05034 * ttdb;
	meananomaly = fmod(meananomaly * deg2rad, twopi);	//rad
	if (meananomaly < 0.0) {
		meananomaly = twopi + meananomaly;
	}
	eclplong = meanlong + 1.914666471 * sin(meananomaly)
			+ 0.019994643 * sin(2.0 * meananomaly); //deg
	obliquity = 23.439291 - 0.0130042 * ttdb; //deg
	meanlong = meanlong * deg2rad;
	if (meanlong < 0.0) {
		meanlong = twopi + meanlong;
	}
	eclplong = eclplong * deg2rad;
	obliquity = obliquity * deg2rad;

	// --------- find magnitude of sun vector, ) components ------
	magr = 1.000140612 - 0.016708617 * cos(meananomaly)
			- 0.000139589 * cos(2.0 * meananomaly); // in au's

	sun_ijk.x = magr * cos(eclplong) * Constants::AE_TO_KM;
	sun_ijk.y = magr * cos(obliquity) * sin(eclplong) * Constants::AE_TO_KM;
	sun_ijk.z = magr * sin(obliquity) * sin(eclplong) * Constants::AE_TO_KM;
	/*
	 double rtasc;
	 double decl;
	 rtasc = atan(cos(obliquity) * tan(eclplong));

	 // --- check that rtasc is in the same quadrant as eclplong ----
	 if (eclplong < 0.0) {
	 eclplong = eclplong + twopi;    // make sure it's in 0 to 2pi range
	 }
	 if (fabs(eclplong - rtasc) > M_PI * 0.5) {
	 rtasc = rtasc
	 + 0.5 * M_PI * round((eclplong - rtasc) / (0.5 * M_PI));
	 }
	 decl = asin(sin(obliquity) * sin(eclplong));
	 */
	sunPosition = sun_ijk;
	currentHighPrec = false;
	return sun_ijk;

}  // sun

bool SunModel::getEclipseState(double JD, Vector3D satPosition_eci) {
// based on orekit 6.0 EclipseDetector class

//sun vector
	Vector3D sunVector_eci = getSunPosition(JD);
//Earth Vector (is 0 in eci)
	Vector3D earthVector_eci;
	earthVector_eci.x = 0;
	earthVector_eci.y = 0;
	earthVector_eci.z = 0;
//sat vector
	Vector3D satVector_eci = satPosition_eci;

	Vector3D satToSun = sunVector_eci - satVector_eci;

	Vector3D earthToSat = earthVector_eci - satVector_eci;

	double angle = satToSun.getAngle(earthToSat);

	double rs = asin(Constants::SUN_RADIUS / satToSun.getLen());
	double ro = asin(Constants::EARTH_RADIUS / earthToSat.getLen());

	if ((angle - ro + rs) < 0) {
		return true;
	} else if ((angle - ro - rs) < 0) {
		return true;
	} else {
		return false;
	}

}

//Returns the normalized vector from sat to sun in eci
Vector3D SunModel::getSunVector_eci(double JD, Vector3D satPosition_eci)
{
	//get vector from sat to sun
	Vector3D satToSun = getSunPosition(JD) - satPosition_eci;
	//normalize
	satToSun = satToSun.normalize();
	return satToSun;
}





