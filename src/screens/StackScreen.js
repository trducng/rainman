import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { addNavigationHelpers, StackNavigator, NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Screen1 extends React.Component {

  render() {
    return (
      <View>
        <Text>This is screen 1</Text>
        <Button
          onPress={() => this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'S2'}))}
          title="Go to screen 2" />
      </View>
    );
  }

}

class Screen2 extends React.Component {

  render() {
    return(
      <View>
        <Text>This is screen 2</Text>
      </View>
    );
  }
}

export const StackScreen = StackNavigator({
  S1: { screen: Screen1 },
  S2: { screen: Screen2 }
});


class StackScreenNav extends React.Component {
  render() {
    return (
      <StackScreen
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })}
      />
    );
  }
}

StackScreenNav.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired
}

const mapStateToProps = state => ({ nav: state.nav_list })

// export default StackScreen;
export default connect(mapStateToProps)(StackScreenNav);
