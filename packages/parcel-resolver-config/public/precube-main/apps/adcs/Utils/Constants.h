/*********************************************************************
 **  Copyright
 **  Constants.h class in project WMM
 **
 **  @file       Constants.h
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

#ifndef WMM_CONSTANTS_H
#define WMM_CONSTANTS_H
#pragma once

#include <cstdint>

namespace Constants {
    /*
     * Scientific Constants
     */
    static constexpr double PI = 3.14159265358979323e0;
    static constexpr double TWO_PI = 2*PI;

    /*
     * Unit Conversions
     */
    static constexpr double degToRad = PI / 180.0;
    static constexpr double radToDeg = 180.0 / PI;

    static constexpr double meterToKilometer = 1.0 / 1000.0;
    static constexpr double kilometerToMeter = 1000.0;

    static constexpr double millisecondsToSeconds = 1.0 / 1000.0;
    static constexpr double secondsToMilliseconds = 1000.0;

    static constexpr double nanoTeslaToMicroTesla = 1.0 / 1000.0;
    static constexpr double microTeslaToNanoTesla = 1000.0;

    static constexpr double AE = 1.0;
    static constexpr double AE_TO_KM = 149597870.700;
    static constexpr double SUN_RADIUS = 696342.000; //km
    static constexpr double EARTH_RADIUS = 6378.137; //km



    /**
    * Julian Date of the 1st January 2000 12 TDT
    */
    static const double JD_offset = 2451545.0;

}
#endif //WMM_CONSTANTS_H
