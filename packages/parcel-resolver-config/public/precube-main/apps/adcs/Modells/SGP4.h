/********************************************************************* 
 **  Copyright
 **  SGP4.h class in project SGP4_Port
 **
 **  @file       SGP4.h
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

#ifndef SGP4_PORT_SGP4_H
#define SGP4_PORT_SGP4_H

//#include "CoordinateFrames.h"
#include <matlib.h>

 struct elsetrec
{
    long int  satnum;
    int       epochyr;
    int       error;
    char      operationmode;
    char      init, method;

    /* Near Earth */
    int    isimp;
    double aycof  , con41  , cc1    , cc4      , cc5    , d2      , d3   , d4    ,
            delmo  , eta    , argpdot, omgcof   , sinmao , t       , t2cof, t3cof ,
            t4cof  , t5cof  , x1mth2 , x7thm1   , mdot   , nodedot, xlcof , xmcof ,
            nodecf;

    double a       , epochdays, jdsatepoch       , nddot , ndot  ,
            bstar  , inclo  , nodeo    , ecco             , argpo , mo    ,
            no;
};

class SGP4 {

    /*
     * Member Variables
     */
private:
    elsetrec sat_data;
    char first_line[130] = "";
    char second_line[130] = "";
    bool init_completed = false;

    /*
     * Functions
     */
private:

    bool is_tle_set();
    static void initl
            (       int satn, double ecco,  double epoch, double inclo,   double& no,
                    char& method,
                    double& ainv,  double& ao,    double& con41,  double& con42, double& cosio,
                    double& cosio2,double& eccsq, double& omeosq, double& posq,
                    double& rp,    double& rteosq,double& sinio
            );
    bool twoline2rv
            (
                    char      longstr1[130], char longstr2[130],
                    elsetrec& satrec
            );
    bool sgp4init
            (
                    const int satn,     const double epoch,
                    const double xbstar,  const double xecco, const double xargpo,
                    const double xinclo,  const double xmo,   const double xno,
                    const double xnodeo,  elsetrec& satrec
            );


    bool sgp4
            (
                    elsetrec& satrec,  double tsince,
                    double r[3],  double v[3]
            );

public:
    bool set_tle(char first_line[130], char second_line[130]);
    bool init_sgp4();
    bool propagate(double JD, RODOS::Vector3D &position, RODOS::Vector3D &velocity, bool timediff = false);

};


#endif //SGP4_PORT_SGP4_H
