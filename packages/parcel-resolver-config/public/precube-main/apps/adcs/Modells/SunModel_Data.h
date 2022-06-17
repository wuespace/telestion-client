/********************************************************************* 
 **  Copyright
 **  SunModel_Data.h class in project untitled
 **
 **  @file       SunModel_Data.h
 **
 **  @desc       
 **
 **  @author     Tom Baumann, tom.baumann@uni-wuerzburg.de
 **
 **  @copyright  Copyright (C) 2021, JMU Wuerzburg, Lehrstuhl Informatik 8
 **  All rights reserved.
 **  Created on 15.01.2021 in CLion
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

#ifndef UNTITLED_SUNMODEL_DATA_H
#define UNTITLED_SUNMODEL_DATA_H
#pragma once

#include <cstdint>

namespace SunModel_Data {
    /*
	 * Constants for high precicion sun model
	 */

    static constexpr double L0[64][3] = { { 175347046, 0, 0 }, { 3341656,
                                                       4.669257, 6283.0759 }, { 34894, 4.6261, 12566.152 }, { 3497, 2.7441,
                                                  5753.3849 }, { 3418, 2.8289, 3.5231 }, { 3136, 3.6277, 77713.772 },
            { 2676, 4.4181, 7860.4194 }, { 2343, 6.1352, 3930.2097 }, { 1324,
                                                  0.7425, 11506.77 }, { 1273, 2.0371, 529691 }, { 1199,
                                                  1.1096, 1577.3435 }, { 990, 5233, 5884927 }, { 902, 2045,
                                                  26298 }, { 857, 3508, 398149 }, { 780, 1179, 5223694 }, {
                                                  753, 2533, 5507553 }, { 505, 4583, 18849228 }, { 492, 4205,
                                                  775523 }, { 357, 2.92, 0.067 }, { 317, 5849, 11790629 }, {
                                                  284, 1899, 796298 }, { 271, 0.315, 10977079 }, { 243, 0.345,
                                                  5486778 }, { 206, 4806, 2544314 }, { 205, 1869, 5573143 }, {
                                                  202, 2458, 6069777 }, { 156, 0.833, 213299 }, { 132, 3411,
                                                  2942463 }, { 126, 1083, 20775 }, { 115, 0.645, 0.98 }, {
                                                  103, 0.636, 4694003 }, { 102, 0.976, 15720839 }, { 102,
                                                  4267, 7114 }, { 99, 6.21, 2146.17 }, { 98, 0.68, 155.42 }, {
                                                  86, 5.98, 161000.69 }, { 85, 1.3, 6275.96 }, { 85, 3.67,
                                                  71430.7 }, { 80, 1.81, 17260.15 }, { 79, 3.04, 12036.46 }, {
                                                  75, 1.76, 5088.63 }, { 74, 3.5, 3154.69 }, { 74, 4.68,
                                                  801.82 }, { 70, 0.83, 9437.76 }, { 62, 3.98, 8827.39 }, {
                                                  61, 1.82, 7084.9 }, { 57, 2.78, 6286.6 }, { 56, 4.39,
                                                  14143.5 }, { 56, 3.47, 6279.55 }, { 52, 0.19, 12139.55 }, {
                                                  52, 1.33, 1748.02 }, { 51, 0.28, 5856.48 }, { 49, 0.49,
                                                  1194.45 }, { 41, 5.37, 8429.24 }, { 41, 2.4, 19651.05 }, {
                                                  39, 6.17, 10447.39 }, { 37, 6.04, 10213.29 }, { 37, 2.57,
                                                  1059.38 }, { 36, 1.71, 2352.87 }, { 36, 1.78, 6812.77 }, {
                                                  33, 0.59, 17789.85 }, { 30, 0.44, 83996.85 }, { 30, 2.74,
                                                  1349.87 }, { 25, 3.16, 4690.48 } };

    static constexpr double L1[34][3] = { { 628331966747, 0, 0 }, { 206059,
                                                          2.678235, 6283.07585 }, { 4303, 2.6351, 12566.1517 }, { 425, 1.59,
                                                  3523 }, { 119, 5796, 26298 }, { 109, 2966, 1577344 }, { 93, 2.59,
                                                  18849.23 }, { 72, 1.14, 529.69 }, { 68, 1.87, 398.15 }, { 67, 4.41,
                                                  5507.55 }, { 59, 2.89, 5223.69 }, { 56, 2.17, 155.42 }, { 45, 0.4,
                                                  796.3 }, { 36, 0.47, 775.52 }, { 29, 2.65, 7.11 },
            { 21, 5.34, 0.98 }, { 19, 1.85, 5486.78 }, { 19, 4.97, 213.3 }, {
                                                  17, 2.99, 6275.96 }, { 16, 0.03, 2544.31 }, { 16, 1.43,
                                                  2146.17 }, { 15, 1.21, 10977.08 }, { 12, 2.83, 1748.02 }, {
                                                  12, 3.26, 5088.63 }, { 12, 5.27, 1194.45 },
            { 12, 2.08, 4694 }, { 11, 0.77, 553.57 }, { 10, 1.3, 6286.6 }, { 10,
                                                  4.24, 1349.87 }, { 9, 2.7, 242.73 }, { 9, 5.64, 951.72 }, {
                                                  8, 5.3, 2352.87 }, { 6, 2.65, 9437.76 },
            { 6, 4.67, 4690.48 } };

    static constexpr double L2[20][3] = { { 52919, 0, 0 }, { 8720, 1.0721,
                                                      6283.0758 }, { 309, 0.867, 12566152 }, { 27, 0.05, 3.52 }, { 16,
                                                  5.19, 26.3 }, { 16, 3.68, 155.42 }, { 10, 0.76, 18849.23 }, { 9,
                                                  2.06, 77713.77 }, { 7, 0.83, 775.52 }, { 5, 4.66, 1577.34 }, { 4,
                                                  1.03, 7.11 }, { 4, 3.44, 5573.14 }, { 3, 5.14, 796.3 }, { 3, 6.05,
                                                  5507.55 }, { 3, 1.19, 242.73 }, { 3, 6.12, 529.69 }, { 3, 0.31,
                                                  398.15 }, { 3, 2.28, 553.57 }, { 2, 4.38, 5223.69 },
            { 2, 3.75, 0.98 } };

    static constexpr double L3[7][3] = { { 289, 5844, 6283076 }, { 35, 0, 0 }, {
                                           17, 5.49, 12566.15 }, { 3, 5.2, 155.42 }, { 1, 4.72, 3.52 }, { 1,
                                                5.3, 18849.23 }, { 1, 5.97, 242.73 } };

    static constexpr double L4[3][3] = { { 114, 3.142, 0 },
                                         { 8, 4.13, 6283.08 }, { 1, 3.84, 12566.15 } };

    static constexpr double L5[1][3] = { { 1, 3.14, 0 } };

    static constexpr double B0[5][3] = { { 280, 3199, 84334662 }, { 102, 5422,
                                                      5507553 }, { 80, 3.88, 5223.69 }, { 44, 3.7, 2352.87 }, { 32, 4,
                                                      1577.34 } };

    static constexpr double B1[2][3] = { { 9, 3.39, 5507.55 }, { 6, 1.73,
                                                    5223.69 } };

    static constexpr double R0[40][3] = { { 100013989, 0, 0 }, { 1670700,
                                                       3.0984635, 6283.07585 }, { 13956, 3.05525, 12566.1517 }, { 3084,
                                                       5.1985, 77713.7715 }, { 1628, 1.1739, 5753.3849 }, { 1576, 2.8469,
                                                  7860.4194 }, { 925, 5453, 11506.77 }, { 542, 4564, 3930.21 }, { 472,
                                                  3661, 5884927 }, { 346, 0.964, 5507553 }, { 329, 5.9, 5223694 }, {
                                                  307, 0.299, 5573143 }, { 243, 4273, 11790629 },
            { 212, 5847, 1577344 }, { 186, 5022, 10977079 }, { 175, 3012,
                                                  18849228 }, { 110, 5055, 5486778 }, { 98, 0.89, 6069.78 }, {
                                                  86, 5.69, 15720.84 }, { 86, 1.27, 161000.69 }, { 65, 0.27,
                                                  17260.15 }, { 63, 0.92, 529.69 }, { 57, 2.01, 83996.85 }, {
                                                  56, 5.24, 71430.7 }, { 49, 3.25, 2544.31 }, { 47, 2.58,
                                                  775.52 }, { 45, 5.54, 9437.76 }, { 43, 6.01, 6275.96 }, {
                                                  39, 5.36, 4694 }, { 38, 2.39, 8827.39 }, { 37, 0.83,
                                                  19651.05 }, { 37, 4.9, 12139.55 }, { 36, 1.67, 12036.46 }, {
                                                  35, 1.84, 2942.46 }, { 33, 0.24, 7084.9 }, { 32, 0.18,
                                                  5088.63 }, { 32, 1.78, 398.15 }, { 28, 1.21, 6286.6 }, { 28,
                                                  1.9, 6279.55 }, { 26, 4.59, 10447.39 } };

    static constexpr double R1[10][3] = { { 103019, 1.10749, 6283.07585 }, {
                                            1721, 1.0644, 12566.1517 }, { 702, 3142, 0 },
            { 32, 1.02, 18849.23 }, { 31, 2.84, 5507.55 },
            { 25, 1.32, 5223.69 }, { 18, 1.42, 1577.34 },
            { 10, 5.91, 10977.08 }, { 9, 1.42, 6275.96 }, { 9, 0.27, 5486.78 } };

    static constexpr double R2[6][3] = { { 4359, 5.7846, 6283.0758 }, { 124,
                                                 5579, 12566152 }, { 12, 3.14, 0 }, { 9, 3.63, 77713.77 }, { 6, 1.87,
                                                         5573.14 }, { 3, 5.47, 18849.23 } };

    static constexpr double R3[2][3] = { { 145, 4.273, 6283.076 }, { 7, 3.92,
                                                       12566.15 } };

    static constexpr double R4[1][3] = { { 4, 2.56, 6283.08 } };
}
#endif //UNTITLED_SUNMODEL_DATA_H
