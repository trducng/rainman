/**
 * Copyright (c) 2017, Duc Nguyen
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of this software authors nor the names of its
 *       contributors may be used to endorse or promote products derived from
 *       this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL DUC NGUYEN BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @flow
 */

import { Notifications, Permissions } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import { EventSubscription } from 'fbemitter';

import React from 'react';
import { Platform } from 'react-native';
import { addNavigationHelpers, TabNavigator,
  TabBarBottom, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import { setShuffleFirstWord } from '../api/WordActions';
import requestNotificationsPermissions from '../api/requestNotificationsPermissions';
import registerWordReminderNotification from '../api/registerWordReminderNotification';


import Colors from '../constants/Colors';
import { WORD, DEFINITION, ID } from '../constants/DB';

import AddScreen from '../screens/AddScreen';
import ShuffleScreen from '../screens/ShuffleScreen';
import QuizScreen from '../screens/QuizScreen';
import StackScreen from '../screens/StackScreen';

import WordListStackNavigator from './WordListNavigation';


type Props = {
  dispatch: Function,
  nav: Object,
  words: Object,
  sortedScores: Array<number>,
}


export const MainTabNavigator = TabNavigator(
  {
    List: {
      screen: WordListStackNavigator,
    },
    Add: {
      screen: AddScreen,
    },
    Shuffle: {
      screen: ShuffleScreen,
    },
    Quiz: {
      screen: QuizScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'List':
            iconName = Platform.OS === 'ios'
              ? `ios-apps${focused ? '' : '-outline'}`
              : 'md-apps';
            break;
          case 'Add':
            iconName = Platform.OS === 'ios'
              ? `ios-create${focused ? '' : '-outline'}`
              : 'md-create';
            break;
          case 'Shuffle':
            iconName = Platform.OS === 'ios'
              ? `ios-shuffle${focused ? '' : '-outline'}`
              : 'md-shuffle';
            break;
          case 'Quiz':
            iconName = Platform.OS === 'ios'
              ? `ios-book${focused ? '' : '-outline'}`
              : 'md-book';
            break;
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

/**
 * Integrate react-navigation state into redux state tree.
 */
class RootNavigator extends React.Component<Props> {

  _notificationSubscription: EventSubscription;
  _navigation: Object

  componentDidMount() {
    if (Platform.OS === 'ios') {
      requestNotificationsPermissions();
    }

    this._scheduleWordReminder();
  }

  componentWillUnmount() {
    // TODO: the removal of notification subscription during exit might prevent
    // the app from handling the notification after it exits
    console.log('RootNavigator: componentWillUnmount');
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    this._navigation = addNavigationHelpers({
      dispatch: this.props.dispatch,
      state: this.props.nav
    });

    return (
      <MainTabNavigator
        navigation={this._navigation}
      />
    );
  }

  /**
   * Get the schedule for the next three notifications. There are 3 time slots:
   * 9AM, 4PM and 10PM.
   */
  _prepareSchedule = (): Array<Date> => {
    const createDate = (date: number, hour: number): Date => {
      let d = new Date();
      d.setHours(hour);
      d.setDate(date);
      return d;
    };
    const notiHours = [9, 16, 20];

    var date = new Date();
    var schedule = [], idx = 0, sameDay = true;

    while (schedule.length < notiHours.length) {
      if (date.getHours() < notiHours[idx] || sameDay === false) {
        schedule.push(createDate(
          sameDay ? date.getDate() : date.getDate() + 1,
          notiHours[idx]
        ));
      }

      if (idx === notiHours.length - 1) {
        sameDay = false;
      }

      idx = (idx + 1) % notiHours.length;
    }

    return schedule;
  }

  async _scheduleWordReminder() {
    await Notifications.cancelAllScheduledNotificationsAsync();

    var numberOfWords = this.props.sortedScores.length;
    var numberOfRemindersPerDay = Math.min(3, numberOfWords);

    // get the schedule for each word
    var schedules = this._prepareSchedule();

    for (var i=0; i<numberOfRemindersPerDay; i++) {
      var wordId = this.props.sortedScores[numberOfWords-i-1];
      registerWordReminderNotification(
        'Remember this word?',
        this.props.words[wordId][WORD],
        {
          [WORD]: this.props.words[wordId][WORD],
          [DEFINITION]: this.props.words[wordId][DEFINITION],
          [ID]: wordId,
          day: schedules[i].getDate(),
          hour: schedules[i].getHours(),
        },
        schedules[i]
      );
    }

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = ({origin, data}) => {
    console.log(
      `Local notification ${origin} with data: ${JSON.stringify(data)}`
    );

    if (origin === 'selected') {
      this.props.dispatch(setShuffleFirstWord(data[ID]));
      this._navigation.navigate('Shuffle');
    }
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  words: state.wordData.WORDS,
  sortedScores: state.wordData.SORTED_SCORES,
});

export default connect(mapStateToProps)(RootNavigator);
