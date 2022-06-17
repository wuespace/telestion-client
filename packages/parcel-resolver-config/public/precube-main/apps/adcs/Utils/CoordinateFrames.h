/*********************************************************************
 **  Copyright
 **  CoordinateFrames.h class in project WMM
 **
 **  @file       CoordinateFrames.h
 **
 **  @desc       
 **
 **  @author     Tom Baumann, tom.baumann@uni-wuerzburg.de
 **
 **  @copyright  Copyright (C) 2020, JMU Wuerzburg, Lehrstuhl Informatik 8
 **  All rights reserved.
 **  Created on 15.12.2020 in CLion
 **
 ** Redistribution and use in source and binary forms, with or without
 ** modification, are permitted provided that the following conditions are
 ** met:
 **
 ** 1 Redistributions of source code must retain the above copyright
 **   notice, this list of conditions and the following disclaimer.
 **
 ** 2 Redistributions in binary form must reproduce the above copyright
 **   notice, this list of conditions and the following disclaimer in the
 **   documentation and/or other materials provided with the
 **   distribution.
 **
 ** 3 Neither the name of the German Aerospace Center nor the names of
 **   its contributors may be used to endorse or promote products derived
 **   from this software without specific prior written permission.
 **
 ** THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 ** "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 ** LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 ** A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 ** OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 ** LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 ** DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 ** THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 ** (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 ** OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **
****************************************************************************/

#ifndef WMM_COORDINATEFRAMES_H
#define WMM_COORDINATEFRAMES_H

#include "AstroTimeUtils.h"
#include <matlib.h>

/*
 * ECEF Coordinates in Meters (Earth Fixed)
 * Origin: Center of Earth
 * X-Axis: 0 Meridian
 * Y-Axis: East
 * Z-Axis: Direction North Pole
 */
class ECEFCoordinates : public RODOS::Vector3D{
public:
    ECEFCoordinates():RODOS::Vector3D(){};
    ECEFCoordinates(double x, double y, double z) : RODOS::Vector3D(x,y,z){};
};

/*
 * ECI Coordinates in Meters (Intertially Fixed)
 * Origin: Center of Earth
 * X-Axis: Vernal Equinox
 * Y-Axis: Completes Coordinate System
 * Z-Axis: Direction North Pole
 */
class ECICoordinates : public RODOS::Vector3D{
public:
    ECICoordinates():RODOS::Vector3D(){};
    ECICoordinates(double x, double y, double z) : RODOS::Vector3D(x,y,z){};
};

/*
 * Geodetic Coordinates on Earth
 * Based on the WSG-84 Ellipsoid
 * Latitude/Longitude in rad
 * Height above surface in meters
 */
class GeodeticCoordinates{
public:
    double lat=0;
    double lon=0;
    double height=0;
};

/*
 * Local Cartesian Coordinate
 * Origin: Given as Geodetic Coordinates
 * X-Axis: Northernly (Local)
 * Y-Axis: Easterly (Local)
 * Z-Axis: Nadir (Downwards)
 */
class LocalCartesianCoordinates{
public:
    LocalCartesianCoordinates(){};
    GeodeticCoordinates origin;
    RODOS::Vector3D localVector;
};

class CoordinateFrames {
private:

    static constexpr double semiMajorAxis = 6378137.0;    //m
    static constexpr double flattening = 1 / 298.257223563;
    static constexpr double Geocent_e2  = 2 * flattening - flattening * flattening;

public:
    static ECEFCoordinates localCartesianToECEF(LocalCartesianCoordinates input_localCartesian, bool orientation_only=false);
    static ECICoordinates localCartesianToECI(LocalCartesianCoordinates input_localCartesian, double JD, bool orientation_only=false);
    static ECICoordinates ECEFToECI(ECEFCoordinates input, double JD);
    static ECEFCoordinates ECIToECEF(ECICoordinates input, double JD);
    static GeodeticCoordinates ECEFToGeodetic(ECEFCoordinates input);
    static GeodeticCoordinates ECIToGeodetic(ECICoordinates input, double JD);
};


#endif //WMM_COORDINATEFRAMES_H
