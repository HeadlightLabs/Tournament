import {Component, Input, OnInit} from '@angular/core';
import {StreamData} from "../stream-data";
import {GridCellData} from "./grid-cell-data";
import {Bot} from "../bot";
import {MiningNode} from "../mining-node";
import {Location} from "../location";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Input() set gridHeight(height: number) {
    this.rows = height;
    this.updateGrid();
  }
  @Input() set gridWidth(width: number) {
    this.columns = width;
    this.updateGrid();
  }

  @Input() set miningData(data: StreamData) {
    if ( !data ) return;
    this.updateEnvironment(data);
  }

  grid: GridCellData[][];
  rows: number;
  columns: number;

  constructor() { }

  ngOnInit() {
  }

  updateGrid() {
    if ( !this.columns || !this.rows ) return;

    this.grid = new Array(this.rows).fill(null)
      .map(() => new Array(this.columns).fill(null)
        .map(() => ({lastVisited: 0})));
  }

  updateEnvironment({bots, nodes}: StreamData) {
    if ( !this.grid ) return;
    this.clearGrid();
    this.placeBots(bots);
    this.placeNodes(nodes);
  }

  clearGrid() {
    this.grid = this.grid.map(row => row.map(({bot, lastVisited}) => {
      let updatedCount = bot ? 1 : lastVisited ? lastVisited + 1 : 0;
      return {lastVisited: updatedCount};
    }));
  }

  placeBots(bots: Bot[]) {
    bots.forEach(bot => {
      const gridCell = this.getCell(bot.location);
      if ( gridCell ) {
        gridCell.bot = bot;
        gridCell.lastVisited = 0;
      }
    })
  }

  placeNodes(nodes: MiningNode[]) {
    nodes.forEach(node => {
      const gridCell = this.getCell(node.location);
      if ( gridCell ) {
        gridCell.node = node;
      }
    })
  }

  getCell({x, y}: Location): GridCellData {
    if ( x >= this.rows || y >= this.columns ) return null;
    return this.grid[y][x];
  }
}
