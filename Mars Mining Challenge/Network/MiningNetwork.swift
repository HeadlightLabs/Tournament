//
//  MiningNetwork.swift
//  Mars Mining Challenge
//
//  Created by Orion Nebula on 9/15/18.
//  Copyright © 2018 Orion Nebula. All rights reserved.
//

import Foundation
import RxSwift
import Alamofire
import Mapper

private enum Route {
    case register
    case move
    case scan
    case claim
    case release
    case mine
    
    var path: String {
        switch self {
        case .register: return "/register"
        case .move: return "/move"
        case .scan: return "/scan"
        case .claim: return "/claim"
        case .release: return "/release"
        case .mine: return "/mine"
        }
    }
}

class MiningNetwork: NSObject {
    private static let urlString: String = "http://localhost:5000"
    typealias JSON = [String: Any]
    
    static func register(_ callsign: String?) -> Observable<MiningResponse?>? {
        guard let callsign = callsign else { return nil }
        let parameters = [Constants.callsignKey: callsign]
        return fetch(.register, parameters: parameters)
    }
    
    static func move(_ callsign: String?, xPosition: String, yPosition: String) -> Observable<MiningResponse?>? {
        guard let callsign = callsign else { return nil }
        let parameters = [Constants.callsignKey: callsign,
                          Constants.xPositionKey: xPosition,
                          Constants.yPositionKey: yPosition]
        return fetch(.move, parameters: parameters)
    }
    
    static func scan(_ callsign: String?) -> Observable<MiningResponse?>? {
        guard let callsign = callsign else { return nil }
        let parameters = [Constants.callsignKey: callsign]
        return fetch(.scan, parameters: parameters)
    }
    
    static func claim(_ callsign: String?) -> Observable<MiningResponse?>? {
        guard let callsign = callsign else { return nil }
        let parameters = [Constants.callsignKey: callsign]
        return fetch(.claim, parameters: parameters)
    }
    
    static func release(_ callsign: String?, node: String?) -> Observable<MiningResponse?>? {
        guard let callsign = callsign,
            let node = node else { return nil }
        let parameters = [Constants.callsignKey: callsign,
                          Constants.nodeKey: node]
        return fetch(.release, parameters: parameters)
    }
    
    static func mine(_ callsign: String?, node: String?) -> Observable<MiningResponse?>? {
        guard let callsign = callsign,
            let node = node else { return nil }
        let parameters = [Constants.callsignKey: callsign,
                          Constants.nodeKey: node]
        return fetch(.mine, parameters: parameters)
    }
    
    private static func fetch(_ route: Route, parameters: Parameters?) -> Observable<MiningResponse?> {
        let requestUrl = "\(urlString)\(route.path)"
        return Observable<MiningResponse?>.create { subscriber in
            let request = Alamofire.request(requestUrl, method: .post, parameters: parameters, encoding: JSONEncoding(), headers: nil).responseJSON(completionHandler: { response in
                guard let json = response.result.value as? NSDictionary else {
                    subscriber.onError(MissingJSONError())
                    return
                }
                let miningResponse = MiningResponse.from(json)
                subscriber.onNext(miningResponse)
                subscriber.onCompleted()
            })
            return Disposables.create(with: request.cancel)
        }
    }
}

class MissingJSONError: Error {}
