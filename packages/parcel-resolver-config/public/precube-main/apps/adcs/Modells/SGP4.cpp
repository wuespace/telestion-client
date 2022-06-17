/********************************************************************* 
 **  Copyright
 **  SGP4.cpp class in project SGP4_Port
 **
 **  @file       SGP4.cpp
 **
 **  @desc       
 **
 **  @author     Tom Baumann, tom.baumann@uni-wuerzburg.de
 **
 **  @copyright  Copyright (C) 2020, JMU Wuerzburg, Lehrstuhl Informatik 8
 **  All rights reserved.
 **  Created on 23.12.2020 in CLion
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

#include "SGP4.h"
#include <cstring>
#include <cstdio>
#include "../Utils/AstroTimeUtils.h"
#include "../Utils/Constants.h"


/*-----------------------------------------------------------------------------
*
*                           procedure initl
*
*  this procedure initializes the spg4 propagator. all the initialization is
*    consolidated here instead of having multiple loops inside other routines.
*
*  author        : david vallado                  719-573-2600   28 jun 2005
*
*  inputs        :
*    ecco        - eccentricity                           0.0 - 1.0
*    epoch       - epoch time in days from jan 0, 1950. 0 hr
*    inclo       - inclination of satellite
*    no          - mean motion of satellite
*    satn        - satellite number
*
*  outputs       :
*    ainv        - 1.0 / a
*    ao          - semi major axis
*    con41       -
*    con42       - 1.0 - 5.0 cos(i)
*    cosio       - cosine of inclination
*    cosio2      - cosio squared
*    eccsq       - eccentricity squared
*    method      - flag for deep space                    'd', 'n'
*    omeosq      - 1.0 - ecco * ecco
*    posq        - semi-parameter squared
*    rp          - radius of perigee
*    rteosq      - square root of (1.0 - ecco*ecco)
*    sinio       - sine of inclination
*    gsto        - gst at time of observation               rad
*    no          - mean motion of satellite
*
*
*  references    :
*    hoots, roehrich, norad spacetrack report #3 1980
*    hoots, norad spacetrack report #6 1986
*    hoots, schumacher and glover 2004
*    vallado, crawford, hujsak, kelso  2006
  ----------------------------------------------------------------------------*/
void SGP4::initl(int satn, double ecco, double epoch, double inclo, double &no, char &method, double &ainv, double &ao,
                 double &con41, double &con42, double &cosio, double &cosio2, double &eccsq, double &omeosq,
                 double &posq, double &rp, double &rteosq, double &sinio) {
/* --------------------- local variables ------------------------ */
    double ak, d1, del, adel, po, x2o3, j2, xke,
            mu, radiusearthkm;

    /* ----------------------- earth constants ---------------------- */
    // ------------ wgs-84 constants ------------
    mu = 398600.5;            // in km3 / s2
    radiusearthkm = 6378.137;     // km
    xke = 60.0 / sqrt(radiusearthkm * radiusearthkm * radiusearthkm / mu);
    j2 = 0.00108262998905;
    x2o3 = 2.0 / 3.0;

    /* ------------- calculate auxillary epoch quantities ---------- */
    eccsq = ecco * ecco;
    omeosq = 1.0 - eccsq;
    rteosq = sqrt(omeosq);
    cosio = cos(inclo);
    cosio2 = cosio * cosio;

    /* ------------------ un-kozai the mean motion ----------------- */
    ak = pow(xke / no, x2o3);
    d1 = 0.75 * j2 * (3.0 * cosio2 - 1.0) / (rteosq * omeosq);
    del = d1 / (ak * ak);
    adel = ak * (1.0 - del * del - del *
                                   (1.0 / 3.0 + 134.0 * del * del / 81.0));
    del = d1 / (adel * adel);
    no = no / (1.0 + del);

    ao = pow(xke / no, x2o3);
    sinio = sin(inclo);
    po = ao * omeosq;
    con42 = 1.0 - 5.0 * cosio2;
    con41 = -con42 - cosio2 - cosio2;
    ainv = 1.0 / ao;
    posq = po * po;
    rp = ao * (1.0 - ecco);
    method = 'n';

}

/*-----------------------------------------------------------------------------
*
*                             procedure sgp4init
*
*  this procedure initializes variables for sgp4.
*
*  author        : david vallado                  719-573-2600   28 jun 2005
*
*  inputs        :
*    satn        - satellite number
*    bstar       - sgp4 type drag coefficient              kg/m2er
*    ecco        - eccentricity
*    epoch       - epoch time in days from jan 0, 1950. 0 hr
*    argpo       - argument of perigee (output if ds)
*    inclo       - inclination
*    mo          - mean anomaly (output if ds)
*    no          - mean motion
*    nodeo       - right ascension of ascending node
*
*  outputs       :
*    satrec      - common values for subsequent calls
*    return code - non-zero on error.
*                   1 - mean elements, ecc >= 1.0 or ecc < -0.001 or a < 0.95 er
*                   2 - mean motion less than 0.0
*                   3 - pert elements, ecc < 0.0  or  ecc > 1.0
*                   4 - semi-latus rectum < 0.0
*                   5 - epoch elements are sub-orbital
*                   6 - satellite has decayed
*
*  locals        :
*    cnodm  , snodm  , cosim  , sinim  , cosomm , sinomm
*    cc1sq  , cc2    , cc3
*    coef   , coef1
*    cosio4      -
*    day         -
*    dndt        -
*    em          - eccentricity
*    emsq        - eccentricity squared
*    eeta        -
*    etasq       -
*    gam         -
*    argpm       - argument of perigee
*    nodem       -
*    inclm       - inclination
*    mm          - mean anomaly
*    nm          - mean motion
*    perige      - perigee
*    pinvsq      -
*    psisq       -
*    qzms24      -
*    rtemsq      -
*    s1, s2, s3, s4, s5, s6, s7          -
*    sfour       -
*    ss1, ss2, ss3, ss4, ss5, ss6, ss7         -
*    sz1, sz2, sz3
*    sz11, sz12, sz13, sz21, sz22, sz23, sz31, sz32, sz33        -
*    tc          -
*    temp        -
*    temp1, temp2, temp3       -
*    tsi         -
*    xpidot      -
*    xhdot1      -
*    z1, z2, z3          -
*    z11, z12, z13, z21, z22, z23, z31, z32, z33         -
*
*  references    :
*    hoots, roehrich, norad spacetrack report #3 1980
*    hoots, norad spacetrack report #6 1986
*    hoots, schumacher and glover 2004
*    vallado, crawford, hujsak, kelso  2006
  ----------------------------------------------------------------------------*/
bool SGP4::sgp4init(const int satn, const double epoch, const double xbstar, const double xecco,
                    const double xargpo, const double xinclo, const double xmo, const double xno, const double xnodeo,
                    elsetrec &satrec) {
    /* --------------------- local variables ------------------------ */
    double ao, ainv, con42, cosio, sinio, cosio2, eccsq,
            omeosq, posq, rp, rteosq,
            cc1sq,
            cc2, cc3, coef, coef1, cosio4, eeta, etasq, perige, pinvsq, psisq, qzms24,
            sfour, temp, temp1, temp2, temp3, tsi,
            xhdot1,
            qzms2t, ss, j2, j3oj2, j4, x2o3, r[3], v[3],
            radiusearthkm, j3, delmotemp, qzms2ttemp, qzms24temp;

    /* ------------------------ initialization --------------------- */
    // sgp4fix divisor for divide by zero check on inclination
    // the old check used 1.0 + cos(pi-1.0e-9), but then compared it to
    // 1.5 e-12, so the threshold was changed to 1.5e-12 for consistency
    const double temp4 = 1.5e-12;

    /* ----------- set all near earth variables to zero ------------ */
    satrec.isimp = 0;
    satrec.method = 'n';
    satrec.aycof = 0.0;
    satrec.con41 = 0.0;
    satrec.cc1 = 0.0;
    satrec.cc4 = 0.0;
    satrec.cc5 = 0.0;
    satrec.d2 = 0.0;
    satrec.d3 = 0.0;
    satrec.d4 = 0.0;
    satrec.delmo = 0.0;
    satrec.eta = 0.0;
    satrec.argpdot = 0.0;
    satrec.omgcof = 0.0;
    satrec.sinmao = 0.0;
    satrec.t = 0.0;
    satrec.t2cof = 0.0;
    satrec.t3cof = 0.0;
    satrec.t4cof = 0.0;
    satrec.t5cof = 0.0;
    satrec.x1mth2 = 0.0;
    satrec.x7thm1 = 0.0;
    satrec.mdot = 0.0;
    satrec.nodedot = 0.0;
    satrec.xlcof = 0.0;
    satrec.xmcof = 0.0;
    satrec.nodecf = 0.0;

    // sgp4fix - note the following variables are also passed directly via satrec.
    // it is possible to streamline the sgp4init call by deleting the "x"
    // variables, but the user would need to set the satrec.* values first. we
    // include the additional assignments in case twoline2rv is not used.
    satrec.bstar = xbstar;
    satrec.ecco = xecco;
    satrec.argpo = xargpo;
    satrec.inclo = xinclo;
    satrec.mo = xmo;
    satrec.no = xno;
    satrec.nodeo = xnodeo;

    /* ------------------------ earth constants ----------------------- */
    // sgp4fix identify constants and allow alternate values
    //getgravconst( whichconst, tumin, mu, radiusearthkm, xke, j2, j3, j4, j3oj2 );
    // ------------ wgs-84 constants ------------
    radiusearthkm = 6378.137;     // km
    j2 = 0.00108262998905;
    j3 = -0.00000253215306;
    j4 = -0.00000161098761;
    j3oj2 = j3 / j2;

    ss = 78.0 / radiusearthkm + 1.0;
    // sgp4fix use multiply for speed instead of pow
    qzms2ttemp = (120.0 - 78.0) / radiusearthkm;
    qzms2t = qzms2ttemp * qzms2ttemp * qzms2ttemp * qzms2ttemp;
    x2o3 = 2.0 / 3.0;

    satrec.init = 'y';
    satrec.t = 0.0;

    initl
            (
                    satn, satrec.ecco, epoch, satrec.inclo, satrec.no, satrec.method,
                    ainv, ao, satrec.con41, con42, cosio, cosio2, eccsq, omeosq,
                    posq, rp, rteosq, sinio
            );
    satrec.error = 0;

    // sgp4fix remove this check as it is unnecessary
    // the mrt check in sgp4 handles decaying satellite cases even if the starting
    // condition is below the surface of te earth
//     if (rp < 1.0)
//       {
//         printf("# *** satn%d epoch elts sub-orbital ***\n", satn);
//         satrec.error = 5;
//       }

    if ((omeosq >= 0.0) || (satrec.no >= 0.0)) {
        satrec.isimp = 0;
        if (rp < (220.0 / radiusearthkm + 1.0))
            satrec.isimp = 1;
        sfour = ss;
        qzms24 = qzms2t;
        perige = (rp - 1.0) * radiusearthkm;

        /* - for perigees below 156 km, s and qoms2t are altered - */
        if (perige < 156.0) {
            sfour = perige - 78.0;
            if (perige < 98.0)
                sfour = 20.0;
            // sgp4fix use multiply for speed instead of pow
            qzms24temp = (120.0 - sfour) / radiusearthkm;
            qzms24 = qzms24temp * qzms24temp * qzms24temp * qzms24temp;
            sfour = sfour / radiusearthkm + 1.0;
        }
        pinvsq = 1.0 / posq;

        tsi = 1.0 / (ao - sfour);
        satrec.eta = ao * satrec.ecco * tsi;
        etasq = satrec.eta * satrec.eta;
        eeta = satrec.ecco * satrec.eta;
        psisq = fabs(1.0 - etasq);
        coef = qzms24 * pow(tsi, 4.0);
        coef1 = coef / pow(psisq, 3.5);
        cc2 = coef1 * satrec.no * (ao * (1.0 + 1.5 * etasq + eeta *
                                                             (4.0 + etasq)) + 0.375 * j2 * tsi / psisq * satrec.con41 *
                                                                              (8.0 + 3.0 * etasq * (8.0 + etasq)));
        satrec.cc1 = satrec.bstar * cc2;
        cc3 = 0.0;
        if (satrec.ecco > 1.0e-4)
            cc3 = -2.0 * coef * tsi * j3oj2 * satrec.no * sinio / satrec.ecco;
        satrec.x1mth2 = 1.0 - cosio2;
        satrec.cc4 = 2.0 * satrec.no * coef1 * ao * omeosq *
                     (satrec.eta * (2.0 + 0.5 * etasq) + satrec.ecco *
                                                         (0.5 + 2.0 * etasq) - j2 * tsi / (ao * psisq) *
                                                                               (-3.0 * satrec.con41 *
                                                                                (1.0 - 2.0 * eeta + etasq *
                                                                                                    (1.5 -
                                                                                                     0.5 * eeta)) +
                                                                                0.75 * satrec.x1mth2 *
                                                                                (2.0 * etasq - eeta * (1.0 + etasq)) *
                                                                                cos(2.0 * satrec.argpo)));
        satrec.cc5 = 2.0 * coef1 * ao * omeosq * (1.0 + 2.75 *
                                                        (etasq + eeta) + eeta * etasq);
        cosio4 = cosio2 * cosio2;
        temp1 = 1.5 * j2 * pinvsq * satrec.no;
        temp2 = 0.5 * temp1 * j2 * pinvsq;
        temp3 = -0.46875 * j4 * pinvsq * pinvsq * satrec.no;
        satrec.mdot = satrec.no + 0.5 * temp1 * rteosq * satrec.con41 + 0.0625 *
                                                                        temp2 * rteosq *
                                                                        (13.0 - 78.0 * cosio2 + 137.0 * cosio4);
        satrec.argpdot = -0.5 * temp1 * con42 + 0.0625 * temp2 *
                                                (7.0 - 114.0 * cosio2 + 395.0 * cosio4) +
                         temp3 * (3.0 - 36.0 * cosio2 + 49.0 * cosio4);
        xhdot1 = -temp1 * cosio;
        satrec.nodedot = xhdot1 + (0.5 * temp2 * (4.0 - 19.0 * cosio2) +
                                   2.0 * temp3 * (3.0 - 7.0 * cosio2)) * cosio;
        satrec.omgcof = satrec.bstar * cc3 * cos(satrec.argpo);
        satrec.xmcof = 0.0;
        if (satrec.ecco > 1.0e-4)
            satrec.xmcof = -x2o3 * coef * satrec.bstar / eeta;
        satrec.nodecf = 3.5 * omeosq * xhdot1 * satrec.cc1;
        satrec.t2cof = 1.5 * satrec.cc1;
        // sgp4fix for divide by zero with xinco = 180 deg
        if (fabs(cosio + 1.0) > 1.5e-12)
            satrec.xlcof = -0.25 * j3oj2 * sinio * (3.0 + 5.0 * cosio) / (1.0 + cosio);
        else
            satrec.xlcof = -0.25 * j3oj2 * sinio * (3.0 + 5.0 * cosio) / temp4;
        satrec.aycof = -0.5 * j3oj2 * sinio;
        // sgp4fix use multiply for speed instead of pow
        delmotemp = 1.0 + satrec.eta * cos(satrec.mo);
        satrec.delmo = delmotemp * delmotemp * delmotemp;
        satrec.sinmao = sin(satrec.mo);
        satrec.x7thm1 = 7.0 * cosio2 - 1.0;

        /* ----------- set variables if not deep space ----------- */
        if (satrec.isimp != 1) {
            cc1sq = satrec.cc1 * satrec.cc1;
            satrec.d2 = 4.0 * ao * tsi * cc1sq;
            temp = satrec.d2 * tsi * satrec.cc1 / 3.0;
            satrec.d3 = (17.0 * ao + sfour) * temp;
            satrec.d4 = 0.5 * temp * ao * tsi * (221.0 * ao + 31.0 * sfour) *
                        satrec.cc1;
            satrec.t3cof = satrec.d2 + 2.0 * cc1sq;
            satrec.t4cof = 0.25 * (3.0 * satrec.d3 + satrec.cc1 *
                                                     (12.0 * satrec.d2 + 10.0 * cc1sq));
            satrec.t5cof = 0.2 * (3.0 * satrec.d4 +
                                  12.0 * satrec.cc1 * satrec.d3 +
                                  6.0 * satrec.d2 * satrec.d2 +
                                  15.0 * cc1sq * (2.0 * satrec.d2 + cc1sq));
        }
    } // if omeosq = 0 ...

    /* finally propogate to zero epoch to initialize all others. */
    // sgp4fix take out check to let satellites process until they are actually below earth surface
//       if(satrec.error == 0)
    sgp4(satrec, 0.0, r, v);

    satrec.init = 'n';
    //sgp4fix return boolean. satrec.error contains any error codes
    return true;
}

/*-----------------------------------------------------------------------------
*
*                             procedure sgp4
*
*  this procedure is the sgp4 prediction model from space command. this is an
*    updated and combined version of sgp4 and sdp4, which were originally
*    published separately in spacetrack report #3. this version follows the
*    methodology from the aiaa paper (2006) describing the history and
*    development of the code.
*
*  author        : david vallado                  719-573-2600   28 jun 2005
*
*  inputs        :
*    satrec	 - initialised structure from sgp4init() call.
*    tsince	 - time eince epoch (minutes)
*
*  outputs       :
*    r           - position vector                     km
*    v           - velocity                            km/sec
*  return code - non-zero on error.
*                   1 - mean elements, ecc >= 1.0 or ecc < -0.001 or a < 0.95 er
*                   2 - mean motion less than 0.0
*                   3 - pert elements, ecc < 0.0  or  ecc > 1.0
*                   4 - semi-latus rectum < 0.0
*                   5 - epoch elements are sub-orbital
*                   6 - satellite has decayed
*
*  locals        :
*    am          -
*    axnl, aynl        -
*    betal       -
*    cosim   , sinim   , cosomm  , sinomm  , cnod    , snod    , cos2u   ,
*    sin2u   , coseo1  , sineo1  , cosi    , sini    , cosip   , sinip   ,
*    cosisq  , cossu   , sinsu   , cosu    , sinu
*    delm        -
*    delomg      -
*    dndt        -
*    eccm        -
*    emsq        -
*    ecose       -
*    el2         -
*    eo1         -
*    eccp        -
*    esine       -
*    argpm       -
*    argpp       -
*    omgadf      -
*    pl          -
*    r           -
*    rtemsq      -
*    rdotl       -
*    rl          -
*    rvdot       -
*    rvdotl      -
*    su          -
*    t2  , t3   , t4    , tc
*    tem5, temp , temp1 , temp2  , tempa  , tempe  , templ
*    u   , ux   , uy    , uz     , vx     , vy     , vz
*    inclm       - inclination
*    mm          - mean anomaly
*    nm          - mean motion
*    nodem       - right asc of ascending node
*    xinc        -
*    xincp       -
*    xl          -
*    xlm         -
*    mp          -
*    xmdf        -
*    xmx         -
*    xmy         -
*    nodedf      -
*    xnode       -
*    nodep       -
*    np          -
*
*  coupling      :
*    getgravconst-
*    dpper
*    dpspace
*
*  references    :
*    hoots, roehrich, norad spacetrack report #3 1980
*    hoots, norad spacetrack report #6 1986
*    hoots, schumacher and glover 2004
*    vallado, crawford, hujsak, kelso  2006
  ----------------------------------------------------------------------------*/

bool SGP4::sgp4
        (
                elsetrec &satrec, double tsince,
                double r[3], double v[3]
        ) {
    double am, axnl, aynl, betal, cosim, cnod,
            cos2u, coseo1, cosi, cosip, cossu, cosu,
            delm, delomg, em, ecose, el2, eo1,
            ep, esine, argpm, argpp, argpdf, pl, mrt,
            mvt, rdotl, rl, rvdot, rvdotl, sinim,
            sin2u, sineo1, sini, sinip, sinsu, sinu,
            snod, su, t2, t3, t4, tem5, temp,
            temp1, temp2, tempa, tempe, templ, u, ux,
            uy, uz, vx, vy, vz, inclm, mm,
            nm, nodem, xinc, xincp, xl, xlm, mp,
            xmdf, xmx, xmy, nodedf, xnode, nodep,
            twopi, x2o3, j2, xke, radiusearthkm,
            mu, vkmpersec, delmtemp;
    int ktr;

    /* ------------------ set mathematical constants --------------- */
    // sgp4fix divisor for divide by zero check on inclination
    // the old check used 1.0 + cos(pi-1.0e-9), but then compared it to
    // 1.5 e-12, so the threshold was changed to 1.5e-12 for consistency
    twopi = 2.0 * Constants::PI;
    // ------------ wgs-84 constants ------------
    mu = 398600.5;            // in km3 / s2
    radiusearthkm = 6378.137;     // km
    xke = 60.0 / sqrt(radiusearthkm * radiusearthkm * radiusearthkm / mu);
    j2 = 0.00108262998905;
    x2o3 = 2.0 / 3.0;
    vkmpersec = radiusearthkm * xke / 60.0;

    /* --------------------- clear sgp4 error flag ----------------- */
    satrec.t = tsince;
    satrec.error = 0;

    /* ------- update for secular gravity and atmospheric drag ----- */
    xmdf = satrec.mo + satrec.mdot * satrec.t;
    argpdf = satrec.argpo + satrec.argpdot * satrec.t;
    nodedf = satrec.nodeo + satrec.nodedot * satrec.t;
    argpm = argpdf;
    mm = xmdf;
    t2 = satrec.t * satrec.t;
    nodem = nodedf + satrec.nodecf * t2;
    tempa = 1.0 - satrec.cc1 * satrec.t;
    tempe = satrec.bstar * satrec.cc4 * satrec.t;
    templ = satrec.t2cof * t2;

    if (satrec.isimp != 1) {
        delomg = satrec.omgcof * satrec.t;
        // sgp4fix use mutliply for speed instead of pow
        delmtemp = 1.0 + satrec.eta * cos(xmdf);
        delm = satrec.xmcof *
               (delmtemp * delmtemp * delmtemp -
                satrec.delmo);
        temp = delomg + delm;
        mm = xmdf + temp;
        argpm = argpdf - temp;
        t3 = t2 * satrec.t;
        t4 = t3 * satrec.t;
        tempa = tempa - satrec.d2 * t2 - satrec.d3 * t3 -
                satrec.d4 * t4;
        tempe = tempe + satrec.bstar * satrec.cc5 * (sin(mm) -
                                                     satrec.sinmao);
        templ = templ + satrec.t3cof * t3 + t4 * (satrec.t4cof +
                                                  satrec.t * satrec.t5cof);
    }

    nm = satrec.no;
    em = satrec.ecco;
    inclm = satrec.inclo;

    if (nm <= 0.0) {
//         printf("# error nm %f\n", nm);
        satrec.error = 2;
        // sgp4fix add return
        return false;
    }
    am = pow((xke / nm), x2o3) * tempa * tempa;
    nm = xke / pow(am, 1.5);
    em = em - tempe;

    // fix tolerance for error recognition
    // sgp4fix am is fixed from the previous nm check
    if ((em >= 1.0) || (em < -0.001)/* || (am < 0.95)*/ ) {
//         printf("# error em %f\n", em);
        satrec.error = 1;
        // sgp4fix to return if there is an error in eccentricity
        return false;
    }
    // sgp4fix fix tolerance to avoid a divide by zero
    if (em < 1.0e-6)
        em = 1.0e-6;
    mm = mm + satrec.no * templ;
    xlm = mm + argpm + nodem;

    nodem = fmod(nodem, twopi);
    argpm = fmod(argpm, twopi);
    xlm = fmod(xlm, twopi);
    mm = fmod(xlm - argpm - nodem, twopi);

    /* ----------------- compute extra mean quantities ------------- */
    sinim = sin(inclm);
    cosim = cos(inclm);

    /* -------------------- add lunar-solar periodics -------------- */
    ep = em;
    xincp = inclm;
    argpp = argpm;
    nodep = nodem;
    mp = mm;
    sinip = sinim;
    cosip = cosim;

    /* -------------------- long period periodics ------------------ */
    axnl = ep * cos(argpp);
    temp = 1.0 / (am * (1.0 - ep * ep));
    aynl = ep * sin(argpp) + temp * satrec.aycof;
    xl = mp + argpp + nodep + temp * satrec.xlcof * axnl;

    /* --------------------- solve kepler's equation --------------- */
    u = fmod(xl - nodep, twopi);
    eo1 = u;
    tem5 = 9999.9;
    ktr = 1;
    //   sgp4fix for kepler iteration
    //   the following iteration needs better limits on corrections
    while ((fabs(tem5) >= 1.0e-12) && (ktr <= 10)) {
        sineo1 = sin(eo1);
        coseo1 = cos(eo1);
        tem5 = 1.0 - coseo1 * axnl - sineo1 * aynl;
        tem5 = (u - aynl * coseo1 + axnl * sineo1 - eo1) / tem5;
        if (fabs(tem5) >= 0.95)
            tem5 = tem5 > 0.0 ? 0.95 : -0.95;
        eo1 = eo1 + tem5;
        ktr = ktr + 1;
    }

    /* ------------- short period preliminary quantities ----------- */
    ecose = axnl * coseo1 + aynl * sineo1;
    esine = axnl * sineo1 - aynl * coseo1;
    el2 = axnl * axnl + aynl * aynl;
    pl = am * (1.0 - el2);
    if (pl < 0.0) {
//         printf("# error pl %f\n", pl);
        satrec.error = 4;
        // sgp4fix add return
        return false;
    } else {
        rl = am * (1.0 - ecose);
        rdotl = sqrt(am) * esine / rl;
        rvdotl = sqrt(pl) / rl;
        betal = sqrt(1.0 - el2);
        temp = esine / (1.0 + betal);
        sinu = am / rl * (sineo1 - aynl - axnl * temp);
        cosu = am / rl * (coseo1 - axnl + aynl * temp);
        su = atan2(sinu, cosu);
        sin2u = (cosu + cosu) * sinu;
        cos2u = 1.0 - 2.0 * sinu * sinu;
        temp = 1.0 / pl;
        temp1 = 0.5 * j2 * temp;
        temp2 = temp1 * temp;

        /* -------------- update for short period periodics ------------ */
        mrt = rl * (1.0 - 1.5 * temp2 * betal * satrec.con41) +
              0.5 * temp1 * satrec.x1mth2 * cos2u;
        su = su - 0.25 * temp2 * satrec.x7thm1 * sin2u;
        xnode = nodep + 1.5 * temp2 * cosip * sin2u;
        xinc = xincp + 1.5 * temp2 * cosip * sinip * cos2u;
        mvt = rdotl - nm * temp1 * satrec.x1mth2 * sin2u / xke;
        rvdot = rvdotl + nm * temp1 * (satrec.x1mth2 * cos2u +
                                       1.5 * satrec.con41) / xke;

        /* --------------------- orientation vectors ------------------- */
        sinsu = sin(su);
        cossu = cos(su);
        snod = sin(xnode);
        cnod = cos(xnode);
        sini = sin(xinc);
        cosi = cos(xinc);
        xmx = -snod * cosi;
        xmy = cnod * cosi;
        ux = xmx * sinsu + cnod * cossu;
        uy = xmy * sinsu + snod * cossu;
        uz = sini * sinsu;
        vx = xmx * cossu - cnod * sinsu;
        vy = xmy * cossu - snod * sinsu;
        vz = sini * cossu;

        /* --------- position and velocity (in km and km/sec) ---------- */
        r[0] = (mrt * ux) * radiusearthkm;
        r[1] = (mrt * uy) * radiusearthkm;
        r[2] = (mrt * uz) * radiusearthkm;
        v[0] = (mvt * ux + rvdot * vx) * vkmpersec;
        v[1] = (mvt * uy + rvdot * vy) * vkmpersec;
        v[2] = (mvt * uz + rvdot * vz) * vkmpersec;
    }  // if pl > 0

    // sgp4fix for decaying satellites
    if (mrt < 1.0) {
//         printf("# decay condition %11.6f \n",mrt);
        satrec.error = 6;
        return false;
    }

    return true;
}

bool SGP4::twoline2rv(char *longstr1, char *longstr2, elsetrec &satrec) {
    const double deg2rad = Constants::degToRad;
    const double xpdotp = 1440.0 / (2.0 * Constants::PI);  // 229.1831180523293

    double sec, mu, radiusearthkm, tumin, xke;
    int cardnumb, numb, j;
    long revnum = 0, elnum = 0;
    char classification, intldesg[11];
    int year = 0;
    int mon, day, hr, minute, nexp, ibexp;
    mu = 398600.5;            // in km3 / s2
    radiusearthkm = 6378.137;     // km
    xke = 60.0 / sqrt(radiusearthkm * radiusearthkm * radiusearthkm / mu);
    tumin = 1.0 / xke;
    satrec.error = 0;

    // set the implied decimal points since doing a formated read
    // fixes for bad input data values (missing, ...)
    for (j = 10; j <= 15; j++)
        if (longstr1[j] == ' ')
            longstr1[j] = '_';

    if (longstr1[44] != ' ')
        longstr1[43] = longstr1[44];
    longstr1[44] = '.';
    if (longstr1[7] == ' ')
        longstr1[7] = 'U';
    if (longstr1[9] == ' ')
        longstr1[9] = '.';
    for (j = 45; j <= 49; j++)
        if (longstr1[j] == ' ')
            longstr1[j] = '0';
    if (longstr1[51] == ' ')
        longstr1[51] = '0';
    if (longstr1[53] != ' ')
        longstr1[52] = longstr1[53];
    longstr1[53] = '.';
    longstr2[25] = '.';
    for (j = 26; j <= 32; j++)
        if (longstr2[j] == ' ')
            longstr2[j] = '0';
    if (longstr1[62] == ' ')
        longstr1[62] = '0';
    if (longstr1[68] == ' ')
        longstr1[68] = '0';

    sscanf(longstr1, "%2d %5ld %1c %10s %2d %12lf %11lf %7lf %2d %7lf %2d %2d %6ld ",
           &cardnumb, &satrec.satnum, &classification, intldesg, &satrec.epochyr,
           &satrec.epochdays, &satrec.ndot, &satrec.nddot, &nexp, &satrec.bstar,
           &ibexp, &numb, &elnum);

    // simply run -1 day to +1 day or user input times
    if (longstr2[52] == ' ')
        sscanf(longstr2, "%2d %5ld %9lf %9lf %8lf %9lf %9lf %10lf %6ld \n",
               &cardnumb, &satrec.satnum, &satrec.inclo,
               &satrec.nodeo, &satrec.ecco, &satrec.argpo, &satrec.mo, &satrec.no,
               &revnum);
    else
        sscanf(longstr2, "%2d %5ld %9lf %9lf %8lf %9lf %9lf %11lf %6ld \n",
               &cardnumb, &satrec.satnum, &satrec.inclo,
               &satrec.nodeo, &satrec.ecco, &satrec.argpo, &satrec.mo, &satrec.no,
               &revnum);

    // ---- find no, ndot, nddot ----
    satrec.no = satrec.no / xpdotp; //* rad/min
    satrec.nddot = satrec.nddot * pow(10.0, nexp);
    satrec.bstar = satrec.bstar * pow(10.0, ibexp);

    // ---- convert to sgp4 units ----
    satrec.a = pow(satrec.no * tumin, (-2.0 / 3.0));
    satrec.ndot = satrec.ndot / (xpdotp * 1440.0);  //* ? * minperday
    satrec.nddot = satrec.nddot / (xpdotp * 1440.0 * 1440);

    // ---- find standard orbital elements ----
    satrec.inclo = satrec.inclo * deg2rad;
    satrec.nodeo = satrec.nodeo * deg2rad;
    satrec.argpo = satrec.argpo * deg2rad;
    satrec.mo = satrec.mo * deg2rad;

    // ----------------------------------------------------------------
    // find sgp4epoch time of element set
    // remember that sgp4 uses units of days from 0 jan 1950 (sgp4epoch)
    // and minutes from the epoch (time)
    // ----------------------------------------------------------------

    // ---------------- temp fix for years from 1957-2056 -------------------
    // --------- correct fix will occur when year is 4-digit in tle ---------
    if (satrec.epochyr < 57)
        year = satrec.epochyr + 2000;
    else
        year = satrec.epochyr + 1900;

    AstroTimeUtils::daysTomdhms(year, satrec.epochdays, mon, day, hr, minute, sec);
    satrec.jdsatepoch = AstroTimeUtils::DateToJD(year, mon, day, hr, minute, sec);

    // ---------------- initialize the orbit at sgp4epoch -------------------
    sgp4init(satrec.satnum, satrec.jdsatepoch - 2433281.5, satrec.bstar,
             satrec.ecco, satrec.argpo, satrec.inclo, satrec.mo, satrec.no,
             satrec.nodeo, satrec);

    // TODO: Check if TLE was correct
    return true;
}


/*
 * This procedure sets the tle inside the modell according to the first and second line strings
 * It has to be called before the init_sgp4 method!
 * input:   first_line: String containing the first line of the TLE (130 chars)
 *          second_line: String containing the second line of the TLE (130 chars)
 * output:  true, if TLE has been correctly set
 */
bool SGP4::set_tle(char *first_line, char *second_line) {
    // TODO: Check if TLE String is correct
    std::copy(first_line, first_line + 130, this->first_line);
    std::copy(second_line, second_line + 130, this->second_line);
    // reset init_completed, since it has to be reloaded
    // TODO: Maybe do this automatically?
    if (init_completed) init_completed = false;
    // TODO: Check if successfull
    return true;
}

/*
 * This procedure checks whether the model tle has been set
 * output:  true, if there is a tle present
 */
bool SGP4::is_tle_set() {
    return (strlen(first_line) != 0) && (strlen(second_line) != 0);
}

/*
 * This procedure initializes the sgp4 model after a TLE has been set.
 * It has to be called prior to any propagation is possible!
 * output:  true, if the init has been successfull
 */
bool SGP4::init_sgp4() {
    // Read TLE and initialize sgp4 parameters
    if (!is_tle_set()) return false;
    init_completed = twoline2rv(first_line, second_line, sat_data);
    return init_completed;
}

/*
 * This procedure returns the propagated position and velocity vector at the given time
 * input:  JD:          The time for which the propagation should be made in days. Either Julian Date (days from 4713 bc)
 *                      or timedifference in days from the TLE Epoch (if timediff is set to true)
 *         timediff:    If true, JD is used as time diffeence in days from the TLE Epoch. Defaults to false (JD is used)
 * output: position     Vector3D Position in meters
 *         velocity     Vector3D velocity in meter/second
 */
bool SGP4::propagate(double JD, RODOS::Vector3D &position, RODOS::Vector3D &velocity, bool timediff) {
    if (!init_completed) return false;
    // Calculate Time Difference to TLE Epoch in Minutes
    double time_diff;
    // If timediff is false, JD is the absolute JD, so we have to calculate the time difference based on the epoch
    if (!timediff) {
        time_diff = (JD - sat_data.jdsatepoch) * 1440.0; //difference in minutes (24*60min =1440)
    } else {
        time_diff = JD * 1440.0; //difference in minutes (24*60min =1440)
    }
    double r[3], v[3];
    sgp4(sat_data, time_diff, r, v);
    // Check for errors
    if (sat_data.error > 0) {
       // TODO: Throw error
        // printf("# *** error: t:= %f *** code = %3d\n", sat_data.t, sat_data.error);
        return false;
    } else {
        position.x = r[0]*Constants::kilometerToMeter;
        position.y = r[1]*Constants::kilometerToMeter;
        position.z = r[2]*Constants::kilometerToMeter;
        velocity.x = v[0]*Constants::kilometerToMeter;
        velocity.y = v[1]*Constants::kilometerToMeter;
        velocity.z = v[2]*Constants::kilometerToMeter;
    }
    return true;
}

