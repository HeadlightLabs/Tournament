import {Component, OnDestroy, OnInit} from '@angular/core';
import {MiningStreamingService} from "./mining-streaming.service";
import {Observable} from "rxjs/index";
import {StreamData} from "./stream-data";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  miningData$: Observable<StreamData>;

  constructor(private miningStreamingService: MiningStreamingService) {}

  ngOnInit() {
    this.miningData$ = this.miningStreamingService.getMiningStream(5000);
  }
}
