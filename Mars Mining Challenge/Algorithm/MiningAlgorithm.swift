//
//  MiningAlgorithm.swift
//  Mars Mining Challenge
//
//  Created by Orion Nebula on 9/15/18.
//  Copyright © 2018 Orion Nebula. All rights reserved.
//

import Foundation
import RxSwift
import RxCocoa
import GameplayKit

enum ResponseState {
    case register
    case move
    case scan
    case claim
    case release
    case mine
}

class MiningAlgorithm: NSObject {
    private let callsign = UserDefaults.standard.string(forKey: Constants.callsignKey)
    private let disposeBag = DisposeBag()

    private let _currentState = Variable<ResponseState?>(nil)
    var currentState: Observable<ResponseState?> { return _currentState.asObservable() }
    
    private let _miningResponse = Variable<MiningResponse?>(nil)
    private var miningResponse: MiningResponse? { return _miningResponse.value }
    
    private var xIncrease = true
    private var yIncrease = true
    
    override init() {
        super.init()
        bind()
        register()
    }
    
    private func register() {
        MiningNetwork.register(callsign)?.bind{ [weak self] response in
            self?._miningResponse.value = response
            self?._currentState.value = .register
        }.disposed(by: disposeBag)
    }
    
    private func move(to location: Location) {
        guard let x = location.xPosition,
            let y = location.yPosition else { return }
        MiningNetwork.move(callsign, xPosition: String(x), yPosition: String(y))?.bind{ [weak self] response in
            self?._miningResponse.value = response
            self?._currentState.value = .move
        }.disposed(by: disposeBag)
    }
    
    private func scan() {
        MiningNetwork.scan(callsign)?.bind{ [weak self] response in
            self?._miningResponse.value = response
            self?._currentState.value = .scan
        }.disposed(by: disposeBag)
    }
    
    private func claim() {
        MiningNetwork.claim(callsign)?.bind{ [weak self] response in
            self?._miningResponse.value = response
            self?._currentState.value = .claim
        }.disposed(by: disposeBag)
    }
    
    private func release(_ node: Node?) {
        MiningNetwork.release(callsign, node: node?.id)?.bind{ [weak self] response in
            self?._miningResponse.value = response
            self?._currentState.value = .release
        }.disposed(by: disposeBag)
    }
    
    private func mine(_ node: Node?) {
        MiningNetwork.mine(callsign, node: node?.id)?.bind{ [weak self] response in
            self?._miningResponse.value = response
            self?._currentState.value = .mine
        }.disposed(by: disposeBag)
    }
    
    private func bind() {
        currentState.bind{ [weak self] response in
            guard let state = response else { return }
            switch state {
            case .register, .move, .release, .mine:
                self?.scan()
            case .scan:
                guard let response = self?.miningResponse,
                    let status = response.status,
                    let node = self?.miningResponse?.nodes?.first,
                    status.id == node.id else {
                        let location = self?.miningResponse?.status?.location
                        let xPosition = (location?.xPosition ?? 0)
                        let yPosition = (location?.yPosition ?? 0)
                        if xPosition == 100 || xPosition == 0 {
                            self?.xIncrease = !(self?.xIncrease ?? false)
                        }
                        if yPosition == 100 || yPosition == 0 {
                            self?.yIncrease = !(self?.yIncrease ?? false)
                        }
                        let x = (self?.xIncrease ?? false) ? xPosition + 1 : xPosition - 1
                        let y = (self?.yIncrease ?? false) ? yPosition + 1 : yPosition - 1
                        self?.move(to: Location(x: x, y: y))
                        return
                }
                // Needs Logic for Dijkstra Pathing
                self?.claim()
            case .claim:
                guard let nodes = self?.miningResponse?.nodes,
                    let node = nodes.first else {
                        self?.scan()
                        return
                }
                self?.mine(node)
            }
        }.disposed(by: disposeBag)
    }
}
