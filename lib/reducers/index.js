import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { MainTabNavigator } from '../navigation/RootNavigation';


const firstAction = MainTabNavigator.router.getActionForPathAndParams('List');
const initialNavState = MainTabNavigator.router.getStateForAction(firstAction);

const nav = (state = initialNavState, action) => {
  let nextState;
  switch (action.type) {
    case 'List':
      nextState = MainTabNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'List' }),
        state
      );
      break;
    case 'Links':
      nextState = MainTabNavigator.router.getStateForAction(
        MainTabNavigator.navigate({ routeName: 'Links'}),
        state
      );
      break;
    case 'Settings':
      nextState = MainTabNavigator.router.getStateForAction(
        MainTabNavigator.navigate({ routename: 'Settings' }),
        state
      );
      break;
    default:
      nextState = MainTabNavigator.router.getStateForAction(action, state);
      break;
  }
  return nextState || state;
}


const AppReducer = combineReducers({
  nav,
});

export default AppReducer;
