//
//  Status.swift
//  Mars Mining Challenge
//
//  Created by Orion Nebula on 9/15/18.
//  Copyright © 2018 Orion Nebula. All rights reserved.
//

import Foundation
import Mapper

struct Status: Mappable {
    let claims: [String]?
    let location: Location?
    let id: String?
    let score: Int?
    
    init(map: Mapper) throws {
        claims = map.optionalFrom("Claims")
        location = map.optionalFrom("Location")
        id = map.optionalFrom("Id")
        score = map.optionalFrom("Score")
    }
}
