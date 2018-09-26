//
//  Node.swift
//  Mars Mining Challenge
//
//  Created by Orion Nebula on 9/15/18.
//  Copyright © 2018 Orion Nebula. All rights reserved.
//

import Foundation
import Mapper

struct Node: Mappable {
    let id: String?
    let location: Location?
    let value: Int?
    let claimed: Bool?
    
    init(map: Mapper) throws {
        id = map.optionalFrom("Id")
        location = map.optionalFrom("Location")
        value = map.optionalFrom("Value")
        claimed = map.optionalFrom("Claimed")
    }
}
