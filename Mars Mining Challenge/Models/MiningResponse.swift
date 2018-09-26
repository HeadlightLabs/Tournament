//
//  MiningResponse.swift
//  Mars Mining Challenge
//
//  Created by Orion Nebula on 9/15/18.
//  Copyright © 2018 Orion Nebula. All rights reserved.
//

import Foundation
import Mapper

struct MiningResponse: Mappable {
    let status: Status?
    let nodes: [Node]?
    let error: Bool?
    let errorMessage: String?
    
    init(map: Mapper) throws {
        status = map.optionalFrom("Status")
        nodes = map.optionalFrom("Nodes")
        error = map.optionalFrom("Error")
        errorMessage = map.optionalFrom("ErrorMsg")
    }
}
