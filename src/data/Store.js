import dispatcher from './Dispatcher';
import {EventEmitter} from 'events';
import {ACTIONS} from './Constants';

let bots = [];
let nodes = [];

class Store extends EventEmitter {

  handleActions(action) {

    switch (action.type) {
        case ACTIONS.GOT_DATA: {
          bots = action.value.bots;
          nodes = action.value.nodes;
          break;
        }
        default: {
          break;
        }
    }

    this.emit("storeUpdated");
  }

  getValuesFromStore() {
    return {
      bots,
      nodes
    };
  }
}

const store = new Store();
dispatcher.register(store.handleActions.bind(store));
export default store;
