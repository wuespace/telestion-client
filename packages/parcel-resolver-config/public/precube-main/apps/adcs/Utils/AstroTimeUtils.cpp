/*********************************************************************
 **  Copyright
 **  AstroTimeUtils.cpp class in project WMM
 **
 **  @file       AstroTimeUtils.cpp
 **
 **  @desc       
 **
 **  @author     Tom Baumann, tom.baumann@uni-wuerzburg.de
 **
 **  @copyright  Copyright (C) 2020, JMU Wuerzburg, Lehrstuhl Informatik 8
 **  All rights reserved.
 **  Created on 21.12.2020 in CLion
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
#include "Constants.h"


/* -----------------------------------------------------------------------------
	*
	*                           procedure RodosTimeToJD
	*
	*  this procedure finds the julian date given the localTime rodos outputs
    *  "getUTC".
	*  the julian date is defined by each elapsed day since noon, jan 1, 4713 bc.
	*
	*
    *  author         : Tom Baumann                   21 dec 2020
	*
	*  inputs          description                    range / units
	*    rodosTime     Time from "getUTC"             int64_t, nanoseconds from 1.1.2000
	*
	*  outputs       :
	*    jd          - julian date (incl fraction)    days from 4713 bc
	*
	*
	* --------------------------------------------------------------------------- */
double AstroTimeUtils::RodosTimeToJD(int64_t rodosTime) {
    double jd = rodosTime/(double)(24*60*60*1000LL*1000LL*1000LL) + 2451545.0;
    return jd;
}

/* -----------------------------------------------------------------------------
	*
	*                           procedure jday
	*
	*  this procedure finds the julian date given the year, month, day, and time.
	*    the julian date is defined by each elapsed day since noon, jan 1, 4713 bc.
	*
	*  algorithm     : calculate the answer in one step for efficiency
	*
	*  author        : david vallado                 01 mar 2001
 *                   : Tom Baumann                   21 dec 2020
	*
	*  inputs          description                    range / units
	*    year        - year                           1900 .. 2100
	*    month       - month                          1 .. 12
	*    day         - day                            1 .. 28,29,30,31
	*    hour        - universal time hour            0 .. 23
	*    minute      - universal time minute          0 .. 59
	*    second      - universal time second          0.0 .. 59.999
	*
	*  outputs       :
	*    jd          - julian date (incl fraction)    days from 4713 bc
	*
	*  references    :
	*    vallado       2013, 183, alg 14, ex 3-4
	*
	* --------------------------------------------------------------------------- */
double AstroTimeUtils::DateToJD(int year, int month, int day, int hour, int minute, double second) {

    double jd = 367.0 * year -
                floor((7 * (year + floor((month + 9) / 12.0))) * 0.25) +
                floor(275 * month / 9.0) +
                day + 1721013.5;  // use - 678987.0 to go to mjd directly
    double jdFrac = (second + minute * 60.0 + hour* 3600.0) / 86400.0;

    // check that the day and fractional day are correct
    if (fabs(jdFrac) >= 1.0) {
        double dtt = floor(jdFrac);
        jd = jd + dtt;
        jdFrac = jdFrac - dtt;
    }
    double out = jd + jdFrac;
    // - 0.5*sgn(100.0*year + month - 190002.5) + 0.5;
    return out;
}

/*
 * This procedure converts the given Julian Date (UT1) to fraction of years (eg. 2020.24)
 * The procedure accounts for leap years
 * input: JD (UT1) days from 4713 bc (incl. fraction of days)
 * output: current time expressed in years (eg. 2020.25)
 */
double AstroTimeUtils::JDToYear(double JD) {
    int year, month, day, hour, minute;
    double second;
    JDToDate(JD, year, month, day, hour, minute, second);
    double days = finddays(year, month, day, hour, minute, second);
    //check if leap year
    double days_per_year = 365.0;
    if (((year - 1900) % 4) == 0)
        days_per_year += 1.0;
    double year_frac = days/days_per_year;
    return year + year_frac;
}

/* -----------------------------------------------------------------------------
*
*                           procedure invjday
*
*  this procedure finds the year, month, day, hour, minute and second
*  given the julian date. tu can be ut1, tdt, tdb, etc.
*
*  algorithm     : set up starting values
*                  find leap year - use 1900 because 2000 is a leap year
*                  find the elapsed days through the year in a loop
*                  call routine to find each individual value
*
*  author        : david vallado                  719-573-2600    1 mar 2001
*
*  inputs          description                    range / units
*    jd          - julian date (incl. fractions)           days from 4713 bc
*
*  outputs       :
*    year        - year                           1900 .. 2100
*    month       - month                          1 .. 12
*    day         - day                            1 .. 28,29,30,31
*    hour        - hour                           0 .. 23
*    minute      - minute                         0 .. 59
*    second      - second                         0.0 .. 59.999
*
*  locals        :
*    days        - day of year plus fractional
*                  portion of a day               days
*    tu          - julian centuries from 0 h
*                  jan 0, 1900
*    temp        - temporary double values
*    leapyrs     - number of leap years from 1900
*
*
*  references    :
*    vallado       2013, 203, alg 22, ex 3-13
* --------------------------------------------------------------------------- */

void    AstroTimeUtils::JDToDate(double jd, int &year, int &month, int &day, int &hour, int &minute,
                                   double &second)
{
    int leapyrs;
    double dt, days, tu, temp;
    double jd_days = floor(jd);
    double jdfrac = jd - floor(jd);
    // check jdfrac for multiple days
    if (fabs(jdfrac) >= 1.0)
    {
        jd_days= jd_days + floor(jdfrac);
        jdfrac = jdfrac - floor(jdfrac);
    }

    // check for fraction of a day included in the jd
    dt = jd_days- floor(jd) - 0.5;
    if (fabs(dt) > 0.00000001)
    {
        jd_days= jd_days- dt;
        jdfrac = jdfrac + dt;
    }

    /* --------------- find year and days of the year --------------- */
    temp = jd_days- 2415019.5;
    tu = temp / 365.25;
    year = 1900 + (int)floor(tu);
    leapyrs = (int)floor((year - 1901) * 0.25);

    days = floor(temp - ((year - 1900) * 365.0 + leapyrs));

    /* ------------ check for case of beginning of a year ----------- */
    if (days + jdfrac < 1.0)
    {
        year = year - 1;
        leapyrs = (int)floor((year - 1901) * 0.25);
        days = floor(temp - ((year - 1900) * 365.0 + leapyrs));
    }

    /* ----------------- find remaing data  ------------------------- */
    // now add the daily time in to preserve accuracy
    daysTomdhms(year, days + jdfrac, month, day, hour, minute, second);
}

/* -----------------------------------------------------------------------------
*
*                           procedure finddays
*
*  this procedure finds the fractional days through a year given the year,
*    month, day, hour, minute and second.
*
*  algorithm     : set up array for the number of days per month
*                  find leap year - use 1900 because 2000 is a leap year
*                  check for a leap year
*                  loop to find the elapsed days in the year
*
*  author        : david vallado                  719-573-2600
*
*  inputs          description                    range / units
*    year        - year                           1900 .. 2100
*    month       - month                          1 .. 12
*    day         - day                            1 .. 28,29,30,31
*    hour        - hour                           0 .. 23
*    minute      - minute                         0 .. 59
*    second      - second                         0.0 .. 59.999
*
*  outputs       :
*    days        - day of year plus fraction of a day
*
*  locals        :
*    lmonth      - length of months of year
*    i           - index
*
*  references    :
*    vallado       2013, 201, ex 3-12
* --------------------------------------------------------------------------- */

double AstroTimeUtils::finddays
        (
                int year, int month, int day, int hour, int minute,
                double second
        )
{
    // shift index values to be 1-12
    int lmonth[] = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
    int i;
    if (((year - 1900) % 4) == 0)
        lmonth[2] = 29;

    i = 1;
    double days = 0.0;
    while ((i < month) && (i < 12))
    {
        days = days + lmonth[i];
        i = i + 1;
    }
    days = days + day + hour/ 24.0 + minute / 1440.0 + second / 86400.0;
    return days;
}

/* -----------------------------------------------------------------------------
*
*                           procedure days2mdhms
*
*  this procedure converts the day of the year, days, to the equivalent month
*    day, hour, minute and second.
*
*  algorithm     : set up array for the number of days per month
*                  find leap year - use 1900 because 2000 is a leap year
*                  loop through a temp value while the value is < the days
*                  perform int conversions to the correct day and month
*                  convert remainder into h m s using type conversions
*
*  author        : david vallado                  719-573-2600    1 mar 2001
*
*  inputs          description                    range / units
*    year        - year                           1900 .. 2100
*    days        - julian day of the year         0.0  .. 366.0
*
*  outputs       :
*    month       - month                          1 .. 12
*    day         - day                            1 .. 28,29,30,31
*    hour        - hour                           0 .. 23
*    minute      - minute                         0 .. 59
*    second      - second                         0.0 .. 59.999
*
*  locals        :
*    dayofyr     - day of year
*    temp        - temporary extended values
*    inttemp     - temporary int value
*    i           - index
*    lmonth[12]  - int array containing the number of days per month
*
* --------------------------------------------------------------------------- */

void AstroTimeUtils::daysTomdhms(int year, double days, int &month, int &day, int &hour, int &minute, double &second) {
    int i, inttemp, dayofyr;
    double    temp;
    // start indicies at 1
    int lmonth[] = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

    dayofyr = (int)floor(days);
    /* ----------------- find month and day of month ---------------- */
    if ((year % 4) == 0)
        lmonth[2] = 29;

    i = 1;
    inttemp = 0;
    while ((dayofyr > inttemp + lmonth[i]) && (i < 12))
    {
        inttemp = inttemp + lmonth[i];
        i++;
    }
    month = i;
    day = dayofyr - inttemp;

    /* ----------------- find hours minutes and seconds ------------- */
    temp = (days - dayofyr) * 24.0;
    hour= floor(temp);
    temp = (temp - hour) * 60.0;
    minute = floor(temp);
    second = (temp - minute) * 60.0;
}

/* -----------------------------------------------------------------------------
*
*                           function gstime
*
*  this function finds the greenwich sidereal time (iau-82).
*
*  author        : david vallado                  719-573-2600    1 mar 2001
*
*  inputs          description                    range / units
*    jdut1       - julian date in ut1             days from 4713 bc
*
*  outputs       :
*    gstime      - greenwich sidereal time        0 to 2pi rad
*
*  locals        :
*    temp        - temporary variable for doubles   rad
*    tut1        - julian centuries from the
*                  jan 1, 2000 12 h epoch (ut1)
*
*  references    :
*    vallado       2013, 187, eq 3-45
* --------------------------------------------------------------------------- */

double AstroTimeUtils::JDToSideralTime(double JD) {
    double temp, tut1;

    tut1 = (JD - 2451545.0) / 36525.0;
    temp = -6.2e-6 * tut1 * tut1 * tut1 + 0.093104 * tut1 * tut1 +
           (876600.0 * 3600 + 8640184.812866) * tut1 + 67310.54841;  // second
    temp = fmod(temp * Constants::degToRad / 240.0, Constants::TWO_PI); //360/86400 = 1/240, to deg, to rad

    // ------------------------ check quadrants ---------------------
    if (temp < 0.0)
        temp = temp + Constants::TWO_PI;
    return temp;
}


double AstroTimeUtils::JDToJ2000(double JD) {
    return JD - 2451545.0;
}

double AstroTimeUtils::J2000ToJD(double J2000) {
    return J2000 + 2451545.0;
}
