import {Bot} from "./bot";
import {MiningNode} from "./mining-node";

export interface StreamData {
  bots: Bot[];
  nodes: MiningNode[];
}
