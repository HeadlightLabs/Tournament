import {Location} from "./location";

export interface Bot {
  id: string;
  location: Location;
  claims: string[];
}
