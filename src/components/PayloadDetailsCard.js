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

// @flow

import Call from '@polkadot/types/primitive/Generic/Call';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';

import colors from '../colors';
import fonts from '../fonts';

export default class PayloadDetailsCard extends React.PureComponent {
  static propTypes = {
    description: PropTypes.string.isRequired,
    payload: PropTypes.object,
    signature: PropTypes.string,
    style: ViewPropTypes.style
  };

  render() {
    const { description, payload, signature, style } = this.props;

    return (
      <View style={[styles.body, style]}>
        <Text style={styles.titleText}>{description}</Text>
        {
          !!payload && (
            <View style={{ padding: 5, paddingVertical: 2 }}>
              <ExtrinsicPart label='Block Hash' value={payload.blockHash.toString()} />
              <ExtrinsicPart label='Method' value={payload.method} />
              <ExtrinsicPart label='Era' value={payload.era} />
              <ExtrinsicPart label='Nonce' value={payload.nonce.toString()} />
              <ExtrinsicPart label='Tip' value={payload.tip.toString()} />
              <ExtrinsicPart label='Genesis Hash' value={payload.genesisHash.toString()} />
            </View>
          )
        }
        {
          !!signature && (
            <View style={{ padding: 5, paddingVertical: 2 }}>
              <Text style={styles.label}>Signature</Text>
              <Text style={styles.secondaryText}>{signature}</Text>
            </View>
          )
        }
      </View>
    );
  }
}

function ExtrinsicPart({ label, value }) {
  const [argNameValue, setArgNameValue] = useState();
  const [period, setPeriod] = useState();
  const [phase, setPhase] = useState();
  const [sectionMethod, setSectionMethod] = useState();

  useEffect(() => {
    if (label === 'Method') {
      const call = new Call(value);
      const { args, meta, methodName, sectionName } = call;
      
      const result = {};
      for (let i = 0; i < meta.args.length; i ++) {
          result[meta.args[i].name.toString()] = args[i].toString();
      }

      setArgNameValue(result);
      setSectionMethod(`${sectionName}.${methodName}`);
    };

    if (label === 'Era') {
      if (value.isMortalEra) {
        setPeriod(value.asMortalEra.period.toString());
        setPhase(value.asMortalEra.phase.toString());
      }
    }
  }, []);

  const renderEraDetails = () => {
    if (period && phase) {
      return (
        <View style={{ display: 'flex', flexDirection: 'column', padding: 5 }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={styles.subLabel}>With Phase:</Text>
            <Text style={styles.secondaryText}>{phase}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={styles.subLabel}>And Period:</Text>
            <Text style={styles.secondaryText}>{period}</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: 5 }}>
          <Text style={{...styles.subLabel, flex: 1}}>Immortal Era</Text>
          <Text style={{...styles.secondaryText, flex: 3}}>{value.toString()}</Text>
        </View>
      )
    }
  }

  const renderMethodDetails = () => {
    return (
      argNameValue && sectionMethod && (
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={styles.secondaryText}>
            You are calling <Text style={styles.secondaryText}>{sectionMethod}</Text> with the following arguments:
          </Text>
            {
              Object.entries(argNameValue).map(([key, value]) => { return (
                <View key={key} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: 5 }}>
                  <Text style={{...styles.subLabel, flex: 1}}>{key}: </Text>
                  <Text style={{...styles.secondaryText, flex: 3}}>{value}</Text>
                </View>
              )})
            }
        </View>
      )
    );
  }

  return (
    <View style={[{ justifyContent: 'flex-start', alignItems: 'baseline' }]}>
      <View style={{ margin: 5, padding: 5, paddingVertical: 2 }}>
        <Text style={styles.label}>
          {label}
        </Text>
        {
          label === 'Method'
            ? renderMethodDetails()
            : label === 'Era'
              ? renderEraDetails()
              : <Text style={styles.secondaryText}>{value}</Text>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 20,
    paddingTop: 10,
    flexDirection: 'column',
    backgroundColor: colors.card_bg
  },
  content: {},
  footer: {
    backgroundColor: '#977CF6',
    flexDirection: 'row-reverse',
    padding: 5
  },
  label: {
    backgroundColor: colors.bg,
    color: colors.card_bg,
    textAlign: 'left', 
    fontSize: 20, 
    fontFamily: fonts.bold,
  },
  subLabel: {
    backgroundColor: null,
    color: colors.card_bg_text,
    textAlign: 'left', 
    fontSize: 20, 
    fontFamily: fonts.bold,
  },
  icon: {
    width: 47,
    height: 47
  },
  titleText: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.card_bg_text
  },
  secondaryText: {
    textAlign: 'center',
    color: colors.card_bg_text,
    fontFamily: fonts.semiBold,
    fontSize: 12
  },
  footerText: {
    color: colors.card_bg,
    fontFamily: fonts.bold
  }
});
