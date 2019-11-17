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
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import toc from '../../docs/terms-and-conditions.md';
import colors from '../colors';
import fontStyles from '../fontStyles';
import ButtonMainAction from '../components/ButtonMainAction';
import Markdown from '../components/Markdown';
import TouchableItem from '../components/TouchableItem';
import { saveToCAndPPConfirmation } from '../util/db';
import testIDs from '../../e2e/testIDs';

export default class TermsAndConditions extends React.PureComponent {
	state = {
		ppAgreement: false,
		tocAgreement: false
	};

	render() {
		const { navigation } = this.props;
		const { tocAgreement, ppAgreement } = this.state;
		const firstScreenActions = navigation.getParam('firstScreenActions', null);
		return (
			<View style={styles.body} testID={testIDs.TacScreen.tacView}>
				<ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
					<Markdown>{toc}</Markdown>
				</ScrollView>

				{firstScreenActions && (
					<>
						<TouchableItem
							testID={testIDs.TacScreen.agreeTacButton}
							style={{
								alignItems: 'center',
								flexDirection: 'row',
								paddingHorizontal: 16,
								paddingVertical: 10
							}}
							onPress={() => {
								this.setState({ tocAgreement: !tocAgreement });
							}}
						>
							<Icon
								name={
									tocAgreement ? 'checkbox-marked' : 'checkbox-blank-outline'
								}
								style={styles.icon}
							/>

							<Text style={fontStyles.t_big}>
								{'  I agree to the terms and conditions'}
							</Text>
						</TouchableItem>
						<TouchableItem
							style={{
								alignItems: 'center',
								flexDirection: 'row',
								paddingHorizontal: 16,
								paddingVertical: 10
							}}
							onPress={() => {
								this.setState({ ppAgreement: !ppAgreement });
							}}
						>
							<Icon
								testID={testIDs.TacScreen.agreePrivacyButton}
								name={
									ppAgreement ? 'checkbox-marked' : 'checkbox-blank-outline'
								}
								style={styles.icon}
							/>

							<Text style={fontStyles.t_big}>
								<Text>{'  I agree to the '}</Text>
								<Text
									style={{ textDecorationLine: 'underline' }}
									onPress={() => {
										navigation.navigate('PrivacyPolicy');
									}}
								>
									privacy policy
								</Text>
							</Text>
						</TouchableItem>

						<ButtonMainAction
							testID={testIDs.TacScreen.nextButton}
							title="Next"
							disabled={!ppAgreement || !tocAgreement}
							style={{ marginBottom: 32, marginTop: 8 }}
							bottom={false}
							onPress={async () => {
								await saveToCAndPPConfirmation();
								navigation.dispatch(firstScreenActions);
							}}
						/>
					</>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	body: {
		backgroundColor: colors.bg,
		flex: 1,
		flexDirection: 'column',
		overflow: 'hidden'
	},
	icon: {
		color: colors.bg_text_sec,
		fontSize: 30
	}
});
