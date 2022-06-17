/*********************************************************************
 **  Copyright
 **  CoordinateFrames.cpp class in project WMM
 **
 **  @file       CoordinateFrames.cpp
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

#include <matlib.h>

#include "AstroTimeUtils.h"
#include "CoordinateFrames.h"
#include "Constants.h"

using namespace std;

/*
 * Converts Local Cartesian Coordinates to ECEF Coordinates
 * input:   input_localCartesian: Input Coordinates in Local Cartesian Frame
 *          orientation_only: Use "true", when only directional vectors are used, so the origin will not be moved.
 *          Defaults to false
 * output:  ECEFCoordinates
 */
ECEFCoordinates CoordinateFrames::localCartesianToECEF(LocalCartesianCoordinates input_localCartesian, bool orientation_only) {
    /*
     * For Reference:
     * REFERENCES
     *
     *    Further information on Coordinate Conversion Service can be found in the
     *    Coordinate Conversion Service Reuse Manual.
     *
     *    Coordinate Conversion Service originated from :
     *            U.S. Army Topographic Engineering Center
     *            Digital Concepts & Analysis Center
     *            7701 Telegraph Road
     *            Alexandria, VA  22310-3864
     *
     *
     */

    double originLatitude = input_localCartesian.origin.lat;
    double originLongitude = input_localCartesian.origin.lon;
    double originHeight = input_localCartesian.origin.height;
    double N0;
    double val;

    double LocalCart_Origin_Lat = originLatitude;
    if (originLongitude > Constants::PI)
        originLongitude -= Constants::TWO_PI;
    double LocalCart_Origin_Long = originLongitude;
    double LocalCart_Origin_Height = originHeight;
    double orientation = 0.0;   // Set to 0 degrees (rotation about z-axis)
    if (orientation > Constants::PI)
        orientation -= Constants::TWO_PI;
    double LocalCart_Orientation = orientation;
    double es2 = Geocent_e2;

    double Sin_LocalCart_Origin_Lat = sin(LocalCart_Origin_Lat);
    double Cos_LocalCart_Origin_Lat = cos(LocalCart_Origin_Lat);
    double Sin_LocalCart_Origin_Lon = sin(LocalCart_Origin_Long);
    double Cos_LocalCart_Origin_Lon = cos(LocalCart_Origin_Long);
    double Sin_LocalCart_Orientation = sin(LocalCart_Orientation);
    double Cos_LocalCart_Orientation = cos(LocalCart_Orientation);

    //double Sin_Lat_Sin_Orient = Sin_LocalCart_Origin_Lat * Sin_LocalCart_Orientation;
    //double Sin_Lat_Cos_Orient = Sin_LocalCart_Origin_Lat * Cos_LocalCart_Orientation;

    N0 = semiMajorAxis / sqrt(1 - es2 * Sin_LocalCart_Origin_Lat * Sin_LocalCart_Origin_Lat);

    val = (N0 + LocalCart_Origin_Height) * Cos_LocalCart_Origin_Lat;
    double u0 = 0;
    double v0 = 0;
    double w0 = 0;

    if(!orientation_only)
    {
        u0 = val * Cos_LocalCart_Origin_Lon;
        v0 = val * Sin_LocalCart_Origin_Lon;
        w0 = ((N0 * (1 - es2)) + LocalCart_Origin_Height) * Sin_LocalCart_Origin_Lat;
    }

    /* The Vector X, Y, Z should be expressed in the following frame (see Geotrans code):
     * Origin:  As given by the origin of the localCartesianCooridnates
     * U:       Points East
     * V:       Points North
     * W:       Points "Up" (Anti-Nadir)
     *
     * Our localCartesianCoordinates are expressed in:
     * X:       Points North
     * Y:       Points East
     * Z:       Points "Down" (Nadir)
     *
     * In order to match the coordinate system, we need to rotate the localCartesianCoordinates in the following ways:
     * 1. Turn 180 Degrees around X Axis
     * 2. Turn 90 Degrees around Z Axis (negative)
     * -->
     * X = localVector.y
     * Y = localVector.x
     * Z = -localVector.z
     * */

    double X = input_localCartesian.localVector.y;
    double Y = input_localCartesian.localVector.x;
    double Z = -input_localCartesian.localVector.z;

    double U, V, W;

    if (LocalCart_Orientation == 0.0) {
        double sin_lat_y = Sin_LocalCart_Origin_Lat * Y;
        double cos_lat_z = Cos_LocalCart_Origin_Lat * Z;

        U = -Sin_LocalCart_Origin_Lon * X - sin_lat_y * Cos_LocalCart_Origin_Lon +
            cos_lat_z * Cos_LocalCart_Origin_Lon + u0;
        V = Cos_LocalCart_Origin_Lon * X - sin_lat_y * Sin_LocalCart_Origin_Lon + cos_lat_z * Sin_LocalCart_Origin_Lon +
            v0;
        W = Cos_LocalCart_Origin_Lat * Y + Sin_LocalCart_Origin_Lat * Z + w0;
    } else {
        double rotated_x, rotated_y;
        double rotated_y_sin_lat, z_cos_lat;

        rotated_x = Cos_LocalCart_Orientation * X + Sin_LocalCart_Orientation * Y;
        rotated_y = -Sin_LocalCart_Orientation * X + Cos_LocalCart_Orientation * Y;

        rotated_y_sin_lat = rotated_y * Sin_LocalCart_Origin_Lat;
        z_cos_lat = Z * Cos_LocalCart_Origin_Lat;

        U = -Sin_LocalCart_Origin_Lon * rotated_x - Cos_LocalCart_Origin_Lon * rotated_y_sin_lat +
            Cos_LocalCart_Origin_Lon * z_cos_lat + u0;
        V = Cos_LocalCart_Origin_Lon * rotated_x - Sin_LocalCart_Origin_Lon * rotated_y_sin_lat +
            Sin_LocalCart_Origin_Lon * z_cos_lat + v0;
        W = Cos_LocalCart_Origin_Lat * rotated_y + Sin_LocalCart_Origin_Lat * Z + w0;
    }

    ECEFCoordinates out;
    out.x = U;
    out.y = V;
    out.z = W;
    return out;
}

GeodeticCoordinates CoordinateFrames::ECEFToGeodetic(ECEFCoordinates input_ecef) {
    /*
* This function converts geocentric
* coordinates (X, Y, Z) to geodetic coordinates (latitude, longitude,
* and height), according to the current ellipsoid parameters.
*
*    X         : Geocentric X coordinate, in meters.         (input)
*    Y         : Geocentric Y coordinate, in meters.         (input)
*    Z         : Geocentric Z coordinate, in meters.         (input)
*    longitude : Calculated longitude value in rad.          (output)
*    latitude  : Calculated latitude value in rad.           (output)
*    height    : Calculated height value, in meters.         (output)
*
* The method used here is derived from 'An Improved Algorithm for
* Geocentric to Geodetic Coordinate Conversion', by Ralph Toms, Feb 1996
*/

/* Note: Variable names follow the notation used in Toms, Feb 1996 */

    double x = input_ecef.x;
    double y = input_ecef.y;
    double z = input_ecef.z;
    double lat, lon, ht;

    double equatorial_radius = semiMajorAxis;
    double eccentricity_squared = Geocent_e2;

    double rho, c, s, e1, e2a;

    e1 = 1.0 - eccentricity_squared;
    e2a = eccentricity_squared * equatorial_radius;

    rho = sqrt(x * x + y * y);

    if (z == 0.0) {
        c = 1.0;
        s = 0.0;
        lat = 0.0;
    } else {
        double ct, new_ct, zabs;
        double f, new_f, df_dct, e2;

        zabs = fabs(z);

        new_ct = rho / zabs;
        new_f = 1E+37; // From DBL_MAX float.h

        do {
            ct = new_ct;
            f = new_f;

            e2 = sqrt(e1 + ct * ct);

            new_f = rho - zabs * ct - e2a * ct / e2;

            if (new_f == 0.0) break;

            df_dct = -zabs - (e2a * e1) / (e2 * e2 * e2);

            new_ct = ct - new_f / df_dct;

            if (new_ct < 0.0) new_ct = 0.0;
        } while (fabs(new_f) < fabs(f));

        s = 1.0 / sqrt(1.0 + ct * ct);
        c = ct * s;

        if (z < 0.0) {
            s = -s;
            lat = -atan(1.0 / ct);
        } else {
            lat = atan(1.0 / ct);
        }
    }

    lon = atan2(y, x);
    lat = lat;

    ht = (rho * c + z * s - equatorial_radius * sqrt(1.0 - eccentricity_squared * s * s));


    GeodeticCoordinates out;
    out.lat = lat;
    out.lon = lon;
    out.height = ht;
    return out;
}

/*
 * Converts ECI to ECEF Coordinates at given Julian Date
 * input:   input:  ECI Coordinates
 *          JD:     Julian Date, Days from 4713 bc
 */
ECEFCoordinates CoordinateFrames::ECIToECEF(ECICoordinates input, double JD) {
    //TODO: Double check
    double theta = AstroTimeUtils::JDToSideralTime(JD);
    double x = input.x*cos(theta) + input.y*sin(theta);
    double y = -input.x*sin(theta) + input.y*cos(theta);
    double z = input.z;
    return ECEFCoordinates(x,y,z);
}

/*
 * Converts ECEF to ECI Coordinates at given Julian Date
 * input:   input:  ECEF Coordinates
 *          JD:     Julian Date, Days from 4713 bc
 */
ECICoordinates CoordinateFrames::ECEFToECI(ECEFCoordinates input, double JD) {
    //TODO: Double check
    double theta = AstroTimeUtils::JDToSideralTime(JD);
    double x = input.x*cos(theta) - input.y*sin(theta);
    double y = input.x*sin(theta) + input.y*cos(theta);
    double z = input.z;
    return ECICoordinates(x,y,z);
}

/*
 * Converts ECI to Geodetic Coordinates at given Julian Date
 * input:   input:  ECI Coordinates
 *          JD:     Julian Date, Days from 4713 bc
 */
GeodeticCoordinates CoordinateFrames::ECIToGeodetic(ECICoordinates input, double JD) {
    ECEFCoordinates ecef_coordinate = ECIToECEF(input, JD);
    GeodeticCoordinates geodetic_coordinate = ECEFToGeodetic(ecef_coordinate);
    return geodetic_coordinate;
}

/*
 * Converts Local Cartesian to ECI Coordinates at given Julian Date
 * input:   input:              ECI Coordinates
 *          JD:                 Julian Date, Days from 4713 bc
 *          orientation_only:   Use "true", when only directional vectors are used, so the origin will not be moved.
 */
ECICoordinates CoordinateFrames::localCartesianToECI(LocalCartesianCoordinates input_localCartesian, double JD, bool orientation_only) {
    ECEFCoordinates ecef_coordinate = localCartesianToECEF(input_localCartesian, orientation_only);
    ECICoordinates eci_coordinate = ECEFToECI(ecef_coordinate, JD);
    return eci_coordinate;
}
