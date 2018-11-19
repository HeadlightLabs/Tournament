import { Injectable } from '@angular/core';
import {MiningApiService} from "../mining-api.service";
import {forkJoin, interval, Observable, timer} from "rxjs/index";
import {map, switchMap} from "rxjs/internal/operators";
import {StreamData} from "./stream-data";

@Injectable({
  providedIn: 'root'
})
export class MiningStreamingService {

  constructor(private miningApi: MiningApiService) {}

  getMiningStream(interval: number = 10000): Observable<StreamData> {
    return timer(0, interval).pipe(
      switchMap(() => this.getCombinedData())
    );
  }

  getCombinedData(): Observable<StreamData> {
    return forkJoin(
      this.miningApi.getBotData(),
      this.miningApi.getNodeData()
    ).pipe(
      map(([bots, nodes]) => ({bots, nodes}))
    );
  }
}
