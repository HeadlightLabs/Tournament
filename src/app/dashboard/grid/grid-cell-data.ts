import {Bot} from "../bot";
import {MiningNode} from "../mining-node";

export interface GridCellData {
  bot?: Bot;
  node?: MiningNode;
  lastVisited: number;
}
