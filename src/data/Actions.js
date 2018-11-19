import dispatcher from './Dispatcher';
import {ACTIONS} from './Constants';
import {fetchData} from './API';

export function getData(value) {
  fetchData().then((data) => {
    dispatcher.dispatch({
      type: ACTIONS.GOT_DATA,
      value: data,
    });
  });
}
