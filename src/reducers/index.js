import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { MainTabNavigator } from '../navigation/RootNavigation';
import { WordListNavigator } from '../navigation/WordListNavigation';


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
        NavigationActions.navigate({ routeName: 'Links'}),
        state
      );
      break;
    case 'Settings':
      nextState = MainTabNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Settings' }),
        state
      );
      break;
    default:
      nextState = MainTabNavigator.router.getStateForAction(action, state);
      break;
  }
  return nextState || state;
}


const firstListAction = WordListNavigator.router.getActionForPathAndParams('WordList');
const initialListState = WordListNavigator.router.getStateForAction(firstListAction);

const nav_word_list = (state = initialListState, action) => {
  let nextState = WordListNavigator.router.getStateForAction(action, state);
  return nextState || state;
}


const AppReducer = combineReducers({
  nav,
  nav_word_list,
});

export default AppReducer;
