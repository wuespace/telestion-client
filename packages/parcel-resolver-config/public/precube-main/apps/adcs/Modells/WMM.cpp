/*********************************************************************
 **  Copyright
 **  WMM.cpp class in project WMM
 **
 **  @file       WMM.cpp
 **
 **  @desc
 **
 **  @author     Tom Baumann, tom.baumann@uni-wuerzburg.de
 **
 **  @copyright  Copyright (C) 2020, JMU Wuerzburg, Lehrstuhl Informatik 8
 **  All rights reserved.
 **  Created on 11.12.2020 in CLion
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

#include "WMM.h"
#include <matlib.h>
#include "../Utils/Constants.h"

using namespace std;
using namespace WMM_Data;

WMM::WMM() {
    p = snorm;
    sp[0] = 0.0;
    cp[0] = *p = pp[0] = 1.0;
    dp[0][0] = 0.0;

    otime = oalt = olat = olon = -1000.0;
}


/*
 * Main function to call from outside to get current magnetic Vector in ECI
 * input:   position:   Satellite Position in Vector3D ECI Coordinates (meters)
 *          JD:         Current Time in Julian Date TODO: Which Epoch here? J2000 or 4000 bc??
 */
ECICoordinates WMM::calculateMagneticVector(ECICoordinates position, double JD) {
    double current_year_time = AstroTimeUtils::JDToYear(JD);
    double dec, dip, ti;
    double alt, glat, glon;
    GeodeticCoordinates geodetic_position = CoordinateFrames::ECIToGeodetic(position, JD);
    alt = geodetic_position.height;
    glat = geodetic_position.lat;
    glon = geodetic_position.lon;
    // Call actual calculation of field components
    // The inputs for the E0000 Function are in degrees and km, so first convert
    double alt_km = alt*Constants::meterToKilometer;
    double glat_degrees = glat*Constants::radToDeg;
    double glon_degrees = glon*Constants::radToDeg;
    E0000(alt_km, glat_degrees, glon_degrees, current_year_time, dec, dip, ti);
    // Convert from Declination and Inclination and Total Intensity to Local Vector
    LocalCartesianCoordinates local_field_cartesian;
    local_field_cartesian.localVector = decdiptiToLocalComponents(dec, dip, ti);
    local_field_cartesian.origin = geodetic_position;
    //Convert to ECI Frame Vector (Only the rotation should be applied to the Vector)
    ECICoordinates magnetic_field_eci = CoordinateFrames::localCartesianToECI(local_field_cartesian, JD, true);
    return magnetic_field_eci;
}


/*
 * this procedure calculates the current magnetic field components
 * input:   alt:    Altitude in KILOMETERS ABOVE WGS84 ELLIPSOID
 *          glat:   Geodetic Latitude (degrees)
 *          glon:   Geodetic Longitude (degrees)
 *          time:   Time in years (eg. 2020.4)
 * output:
 *          dec:    Declination Angle [degrees]
 *          dip:    Inclination Angle [degrees]
 *          ti:     Total Intensity [nT]
 *          gv:     Grid Variation [nT] (not important here)
 */
void WMM::E0000(double alt, double glat, double glon, double time, double &dec, double &dip,
                double &ti) {

    /* INITIALIZE VARIABLES */
    uint8_t n, m;
    double gv;
    p = snorm;

    dt = time - epoch;
    if (otime < 0.0 && (dt < 0.0 || dt > 5.0)) {
        //printf("\n\n WARNING - TIME EXTENDS BEYOND MODEL 5-YEAR LIFE SPAN");
    }


    rlon = glon * Constants::degToRad;
    rlat = glat * Constants::degToRad;
    srlon = sin(rlon);
    srlat = sin(rlat);
    crlon = cos(rlon);
    crlat = cos(rlat);
    srlat2 = srlat * srlat;
    crlat2 = crlat * crlat;
    sp[1] = srlon;
    cp[1] = crlon;

    /* CONVERT FROM GEODETIC COORDS. TO SPHERICAL COORDS. */
    if (alt != oalt || glat != olat) {
        q = sqrt(a2 - c2 * srlat2);
        q1 = alt * q;
        q2 = ((q1 + a2) / (q1 + b2)) * ((q1 + a2) / (q1 + b2));
        ct = srlat / sqrt(q2 * crlat2 + srlat2);
        st = sqrt(1.0 - (ct * ct));
        r2 = (alt * alt) + 2.0 * q1 + (a4 - c4 * srlat2) / (q * q);
        r = sqrt(r2);
        d = sqrt(a2 * crlat2 + b2 * srlat2);
        ca = (alt + d) / r;
        sa = c2 * crlat * srlat / (r * d);
    }
    if (glon != olon) {
        for (m = 2; m <= maxord; m++) {
            sp[m] = sp[1] * cp[m - 1] + cp[1] * sp[m - 1];
            cp[m] = cp[1] * cp[m - 1] - sp[1] * sp[m - 1];
        }
    }
    aor = re / r;
    ar = aor * aor;
    br = bt = bp = bpp = 0.0;


    for (n = 1; n <= maxord; n++) {
        ar = ar * aor;
        uint16_t D3, D4;
        for (m = 0, D3 = 1, D4 = (n + m + D3) / D3; D4 > 0; D4--, m += D3) {
            /*
               COMPUTE UNNORMALIZED ASSOCIATED LEGENDRE POLYNOMIALS
               AND DERIVATIVES VIA RECURSION RELATIONS
            */
            if (alt != oalt || glat != olat) {
                if (n == m) {
                    *(p + n + m * 13) = st * *(p + n - 1 + (m - 1) * 13);
                    dp[m][n] = st * dp[m - 1][n - 1] + ct * *(p + n - 1 + (m - 1) * 13);
                } else if (n == 1 && m == 0) {
                    *(p + n + m * 13) = ct * *(p + n - 1 + m * 13);
                    dp[m][n] = ct * dp[m][n - 1] - st * *(p + n - 1 + m * 13);
                } else if (n > 1 && n != m) {
                    if (m > n - 2) *(p + n - 2 + m * 13) = 0.0;
                    if (m > n - 2) dp[m][n - 2] = 0.0;
                    *(p + n + m * 13) = ct * *(p + n - 1 + m * 13) - k[m][n] * *(p + n - 2 + m * 13);
                    dp[m][n] = ct * dp[m][n - 1] - st * *(p + n - 1 + m * 13) - k[m][n] * dp[m][n - 2];
                }
            }

            /*
                    TIME ADJUST THE GAUSS COEFFICIENTS
                    */
            if (time != otime) {
                tc[m][n] = c[m][n] + dt * cd[m][n];
                if (m != 0) tc[n][m - 1] = c[n][m - 1] + dt * cd[n][m - 1];
            }
            /*
                ACCUMULATE TERMS OF THE SPHERICAL HARMONIC EXPANSIONS
            */
            par = ar * *(p + n + m * 13);
            if (m == 0) {
                temp1 = tc[m][n] * cp[m];
                temp2 = tc[m][n] * sp[m];
            } else {
                temp1 = tc[m][n] * cp[m] + tc[n][m - 1] * sp[m];
                temp2 = tc[m][n] * sp[m] - tc[n][m - 1] * cp[m];
            }
            bt = bt - ar * temp1 * dp[m][n];
            bp += (fm[m] * temp2 * par);
            br += (fn[n] * temp1 * par);
            /*
                SPECIAL CASE:  NORTH/SOUTH GEOGRAPHIC POLES
            */
            if (st == 0.0 && m == 1) {
                if (n == 1) pp[n] = pp[n - 1];
                else pp[n] = ct * pp[n - 1] - k[m][n] * pp[n - 2];
                parp = ar * pp[n];
                bpp += (fm[m] * temp2 * parp);
            }
        }
    }
    if (st == 0.0) bp = bpp;
    else bp /= st;
    /*
        ROTATE MAGNETIC VECTOR COMPONENTS FROM SPHERICAL TO
        GEODETIC COORDINATES
    */
    bx = -bt * ca - br * sa;
    by = bp;
    bz = bt * sa - br * ca;
    /*
        COMPUTE DECLINATION (DEC), INCLINATION (DIP) AND
        TOTAL INTENSITY (TI)
    */
    bh = sqrt((bx * bx) + (by * by));
    ti = sqrt((bh * bh) + (bz * bz));
    dec = atan2(by, bx) * Constants::radToDeg;
    dip = atan2(bz, bh) * Constants::radToDeg;
    /*
        COMPUTE MAGNETIC GRID VARIATION IF THE CURRENT
        GEODETIC POSITION IS IN THE ARCTIC OR ANTARCTIC
        (I.E. GLAT > +55 DEGREES OR GLAT < -55 DEGREES)

        OTHERWISE, SET MAGNETIC GRID VARIATION TO -999.0
    */
    gv = -999.0;
    if (fabs(glat) >= 55.) {
        if (glat > 0.0 && glon >= 0.0) gv = dec - glon;
        if (glat > 0.0 && glon < 0.0) gv = dec + fabs(glon);
        if (glat < 0.0 && glon >= 0.0) gv = dec + glon;
        if (glat < 0.0 && glon < 0.0) gv = dec - fabs(glon);
        if (gv > +180.0) gv -= 360.0;
        if (gv < -180.0) gv += 360.0;
    }
    otime = time;
    oalt = alt;
    olat = glat;
    olon = glon;

}

/*
 * Convert Declination, Inclination and Total Intensity to X, Y, Z Components
 * X is pointing in local northern direction
 * Y is pointing in local eastern direction
 * Z is pointing towards "down" (Nadir)
 * input:   dec:    Declination [Degrees]
 *          dip:    Inclination [Degrees]
 *          ti:     Total intensity [nT]
 */
RODOS::Vector3D WMM::decdiptiToLocalComponents(double dec, double dip, double ti) {
    /*COMPUTE X, Y and Z COMPONENTS OF THE MAGNETIC FIELD*/
    double x = ti * (cos((dec * Constants::degToRad)) * cos((dip * Constants::degToRad)));
    double y = ti * (cos((dip * Constants::degToRad)) * sin((dec * Constants::degToRad)));
    double z = ti * (sin((dip * Constants::degToRad)));

    return RODOS::Vector3D(x,y,z);
}
