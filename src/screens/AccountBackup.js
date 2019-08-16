// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

import React from 'react';
import { Alert, AppState, Clipboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Subscribe } from 'unstated';

import colors from '../colors';
import fonts from "../fonts";
import AccountCard from '../components/AccountCard';
import Background from '../components/Background';
import Button from '../components/Button';
import TouchableItem from '../components/TouchableItem';
import AccountsStore from '../stores/AccountsStore';

export default class AccountBackup extends React.PureComponent {
  static navigationOptions = {
    title: 'Account Backup'
  };
  render() {
    return (
      <Subscribe to={[AccountsStore]}>
        {accounts => <AccountBackupView {...this.props} accounts={accounts} />}
      </Subscribe>
    );
  }
}

class AccountBackupView extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'inactive') {
      this.props.navigation.goBack();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    const { accounts, navigation } = this.props;
    const {navigate} = navigation;
    const isNew = navigation.getParam('isNew');
    const {address, derivationPassword, derivationPath, name, networkKey, seed, seedPhrase} = isNew ? accounts.getNew() : accounts.getSelected();
    
    return (
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
      >
        <Background />
        <Text style={styles.titleTop}>BACKUP ACCOUNT</Text>
        <AccountCard
          address={address}
          networkKey={networkKey}
          title={name}
        />
        {isNew &&
          <View>
            <Text style={styles.titleTop}>RECOVERY PHRASE</Text>
            <Text style={styles.hintText}>
              Write these words down on paper. Keep it safe. These words allow
              anyone to recover and access the funds of this account.
            </Text>
          </View>
        }
        <TouchableItem
          onPress={() => {
            Alert.alert(
              'Write this recovery phrase on paper',
              `It is not recommended to transfer or store a recovery phrase digitally and unencrypted. Anyone in possession of this recovery phrase is able to spend funds from this account.
              `,
              [
                {
                  text: 'Copy anyway',
                  style: 'default',
                  onPress: () => {
                    Clipboard.setString(`${seedPhrase}${derivationPath}`);
                  }
                },
                {
                  text: 'Cancel',
                  style: 'cancel'
                }
              ]
            );
          }}
        >
          <Text style={styles.seedText}>
            {seedPhrase || seed}
          </Text>
        </TouchableItem>
        {!!derivationPath &&
          <Text style={styles.derivationText}>
            {derivationPath}
          </Text>}
        {!!derivationPassword &&
          <Text style={styles.passwordText}>
            <Icon name={'info'} size={20} color={colors.bg_text_sec} />
             This account countains a derivation password. <Text style={styles.link}  onPress={() => navigate('derivePasswordCheck')} >Verify it here.</Text>
          </Text>}
        {isNew &&
          <Button
            buttonStyles={[styles.nextStep, { marginBottom: 20 }]}
            title="Backup Done"
            onPress={() => {

              Alert.alert(
                'Important',
                "Make sure you've backed up this recovery phrase. It is the only way to restore your account in case of device failure/lost.",
                [
                  {
                    text: 'Proceed',
                    onPress: () => {
                      navigate('AccountPin', { isNew });
                    }
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  }
                ]
              );
            }}
          />
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.bg,
    flex: 1,
    flexDirection: 'column',
    padding: 20
  },
  bodyContent: {
    paddingBottom: 40
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  top: {
    flex: 1
  },
  bottom: {
    flexBasis: 50,
    paddingBottom: 15
  },
  title: {
    fontFamily: fonts.bold,
    color: colors.bg_text_sec,
    fontSize: 18,
    paddingBottom: 20
  },
  titleTop: {
    color: colors.bg_text_sec,
    fontSize: 24,
    fontFamily: fonts.bold,
    paddingBottom: 20,
    textAlign: 'center'
  },
  hintText: {
    fontFamily: fonts.bold,
    textAlign: 'center',
    color: colors.bg_text_sec,
    fontSize: 12,
    paddingBottom: 20
  },
  link: {
    textDecorationLine: 'underline',
  },
  passwordText: {
    fontFamily: fonts.regular,
    color: colors.bg_text_sec,
    fontSize: 18,
    marginTop: 20
  },
  seedText: {
    padding: 10,
    minHeight: 160,
    lineHeight: 26,
    fontSize: 20,
    fontFamily: fonts.regular,
    backgroundColor: colors.card_bg
  },
  derivationText: {
    padding: 10,
    marginTop: 20,
    minHeight: 30,
    lineHeight: 26,
    fontSize: 20,
    fontFamily: fonts.regular,
    backgroundColor: colors.card_bg
  },
  nextStep: {
    marginTop: 20
  },
  deleteButton: {
    backgroundColor: colors.bg_alert
  }
});
