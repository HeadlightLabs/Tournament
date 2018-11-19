import {Component, Input, OnInit} from '@angular/core';
import {MiningNode} from "../../mining-node";
import {Bot} from "../../bot";

@Component({
  selector: 'app-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrls: ['./grid-cell.component.scss']
})
export class GridCellComponent implements OnInit {
  @Input() bot: Bot;
  @Input() node: MiningNode;
  @Input() lastVisited: number;

  constructor() { }

  ngOnInit() {
  }

  getCellBg() {
    if ( !this.lastVisited || this.lastVisited >= 10 ) return '#000000';
    if ( this.lastVisited < 5 ) return '#232323';
    if ( this.lastVisited < 10 ) return '#111111';
  }

  getBotClass() {
    if ( !this.bot ) return '';
    if ( this.node ) return 'text-success';
    return 'text-primary';
  }

  getNodeValueClass() {
    if ( !this.node ) return '';
    const value = this.node.value;
    if ( !value ) return 'text-danger';
    if ( value < 10 ) return 'text-warning';
    return 'text-success';
  }
}
