import {Location} from "./location";

export interface MiningNode {
  id: string;
  location: Location;
  value: number;
  claimedBy: string;
}
