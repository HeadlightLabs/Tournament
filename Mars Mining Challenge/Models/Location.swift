//
//  Location.swift
//  Mars Mining Challenge
//
//  Created by Orion Nebula on 9/15/18.
//  Copyright © 2018 Orion Nebula. All rights reserved.
//

import Foundation
import Mapper

struct Location: Mappable {
    let xPosition: Int?
    let yPosition: Int?
    
    init(map: Mapper) throws {
        xPosition = map.optionalFrom("X")
        yPosition = map.optionalFrom("Y")
    }
    
    init(x: Int?, y: Int?) {
        self.xPosition = x
        self.yPosition = y
    }
}
