import React, {Component} from 'react';
import {Alert} from 'react-native';
import firebase from 'react-native-firebase';
import Dashboard from './src/Dashboard';

export default class App extends Component {
  componentDidMount() {
    // Create notification channel required for Android devices
    this.createNotificationChannel();

    // Ask notification permission and add notification listener
    this.checkPermission();
  }
  createNotificationChannel = () => {
    // Build a android notification channel
    const channel = new firebase.notifications.Android.Channel(
      'reminder', // channelId
      'Reminders Channel', // channel name
      firebase.notifications.Android.Importance.High, // channel importance
    ).setDescription('Used for getting reminder notification'); // channel description
    // Create the android notification channel
    firebase.notifications().android.createChannel(channel);
  };

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      // We've the permission
      this.notificationListener = firebase
        .notifications()
        .onNotification(async notification => {
          // Display your notification
          await firebase.notifications().displayNotification(notification);
        });
    } else {
      // user doesn't have permission
      try {
        await firebase.messaging().requestPermission();
      } catch (error) {
        Alert.alert(
          'Unable to access the Notification permission. Please enable the Notification Permission from the settings',
        );
      }
    }
  };

  render() {
    return <Dashboard />;
  }
}
