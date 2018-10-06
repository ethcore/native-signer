// Copyright 2015-2017 Parity Technologies (UK) Ltd.
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
import PropTypes from 'prop-types';
import {
  Alert,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Share,
  StyleSheet,
  Linking,
  Platform
} from 'react-native';
import Markdown from '../components/Markdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/Button';
import TouchableItem from '../components/TouchableItem';
import colors from '../colors';
import toc from '../../docs/terms-and-conditions.md';

export default class TermsAndConditions extends React.PureComponent {
  static navigationOptions = {
    title: 'Terms and conditions',
    headerBackTitle: 'Back'
  };

  state = {
    tocAgreement: false,
    ppAgreement: false
  };

  render() {
    const { navigation } = this.props;
    const { tocAgreement, ppAgreement } = this.state;
    const isWelcome = navigation.getParam('isWelcome');
    return (
      <View style={styles.body}>
        <ScrollView contentContainerStyle={{}}>
          <Markdown>{toc}</Markdown>
        </ScrollView>

        <TouchableItem
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={() => {
            this.setState({ tocAgreement: !tocAgreement });
          }}
        >
          <Icon
            name={tocAgreement ? 'checkbox-marked' : 'checkbox-blank-outline'}
            style={[styles.text, { fontSize: 30 }]}
          />

          <Text style={[styles.text, { fontSize: 16 }]}>
            {'  I agree to the terms and conditions'}
          </Text>
        </TouchableItem>
        <TouchableItem
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={() => {
            this.setState({ ppAgreement: !ppAgreement });
          }}
        >
          <Icon
            name={ppAgreement ? 'checkbox-marked' : 'checkbox-blank-outline'}
            style={[styles.text, { fontSize: 30 }]}
          />

          <Text style={[styles.text, { fontSize: 16 }]}>
            <Text>{'  I agree to the '}</Text>
            <Text
              style={{ textDecorationLine: 'underline' }}
              onPress={() => {
                this.props.navigation.navigate('PrivacyPolicy');
              }}
            >
              privacy policy
            </Text>
          </Text>
        </TouchableItem>

        <Button
          buttonStyles={{ marginTop: 10, height: 60 }}
          title="Next"
          disabled={!ppAgreement || !tocAgreement}
          onPress={() => {
            this.props.navigation.navigate('AccountAdd');
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: colors.bg,
    padding: 20
  },
  top: {
    flex: 1
  },
  bottom: {
    flexBasis: 50,
    paddingBottom: 15
  },
  titleTop: {
    color: colors.bg_text_sec,
    fontSize: 24,
    fontFamily: 'Manifold CF',
    fontWeight: 'bold',
    paddingBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontFamily: 'Manifold CF',
    color: colors.bg_text_sec,
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20
  },
  text: {
    marginTop: 10,
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.card_bg
  }
});
