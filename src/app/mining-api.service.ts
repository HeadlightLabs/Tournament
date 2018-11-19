import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {map} from "rxjs/internal/operators";
import {Location} from "./dashboard/location";
import {Bot} from "./dashboard/bot";
import {MiningNode} from "./dashboard/mining-node";

@Injectable({
  providedIn: 'root'
})
export class MiningApiService {
  readonly BASE = 'http://headlight-tournament-3.herokuapp.com';

  constructor(private httpClient: HttpClient) { }

  getBotData(): Observable<Bot[]> {
    return this.httpClient.get<any>(`${this.BASE}/bots`).pipe(
      map(({Bots}) => Bots.map(({Id, Location, Claims}) => ({
        id: Id,
        location: this.normalizeLocation(Location),
        claims: Claims
      })))
    );
  }

  getNodeData(): Observable<MiningNode[]> {
    return this.httpClient.get<any>(`${this.BASE}/nodes`).pipe(
      map(({Nodes}) => Nodes.map(({Id, Location, Value, ClaimedBy}) => ({
        id: Id,
        location: this.normalizeLocation(Location),
        value: Value,
        claimedBy: ClaimedBy
      })))
    );
  }

  private normalizeLocation({X, Y}: {X: number, Y: number}): Location {
    return {x: X, y: Y};
  }
}
