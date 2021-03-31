// Copyright 2015-2020 Parity Technologies (UK) Ltd.
// Copyright 2021 Commonwealth Labs, Inc.
// This file is part of Layer Wallet.

// Layer Wallet is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Layer Wallet is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.	If not, see <http://www.gnu.org/licenses/>.

import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { alertDeleteIdentity } from 'utils/alertUtils';

import ButtonIcon from 'components/ButtonIcon';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import ScreenHeading from 'components/ScreenHeading';
import Separator from 'components/Separator';
import NavigationTab from 'components/NavigationTab';
import { AccountsContext } from 'stores/AccountsContext';
import { AlertStateContext } from 'stores/alertContext';
import { Identity } from 'types/identityTypes';
import { NavigationProps } from 'types/props';
import { RootStackParamList } from 'types/routes';
import testIDs from 'e2e/testIDs';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';
import { getIdentityName } from 'utils/identitiesUtils';
import { resetNavigationTo } from 'utils/navigationHelpers';
import { unlockIdentitySeedWithReturn } from 'utils/identitiesUtils';
import { alertError } from 'utils/alertUtils';
import { useSeedRef } from 'utils/seedRefHooks';

function ButtonWithArrow(props: {
	onPress: () => void;
	testID?: string;
	title: string;
}): React.ReactElement {
	return <ButtonIcon {...props} {...i_arrowOptions} />;
}

function Settings({}: NavigationProps<'Settings'>): React.ReactElement {
	const accountsStore = useContext(AccountsContext);
	const navigation: StackNavigationProp<RootStackParamList> = useNavigation();
	const { setAlert } = useContext(AlertStateContext);
	const { currentIdentity, identities } = accountsStore.state;
	const { createSeedRef, destroySeedRef } = useSeedRef(currentIdentity.encryptedSeed);

	const renderNonSelectedIdentity = (
		identity: Identity
	): React.ReactElement => {
		const title = getIdentityName(identity, identities);

		const deleteIdentity = async (value: string): Promise<void> => {
			alertDeleteIdentity(
				setAlert,
				async (): Promise<void> => {
					try {
						await destroySeedRef();
						await accountsStore.deleteCurrentIdentity(); // TODO XXX: delete this identity, not current identity
						resetNavigationTo(navigation, 'Main');
					} catch (err) {
						alertError(setAlert, "Can't delete wallet");
					}
				}
			);
                };
		const showRecoveryPhrase = async (identity): Promise<void> => {
			const seedPhrase = await unlockIdentitySeedWithReturn(identity, createSeedRef);
			navigation.navigate('ShowRecoveryPhrase', { isNew: false, seedPhrase });
                };

		return (
			<View key={identity.encryptedSeed}>
				<ButtonIcon
					title={title}
					onPress={(): void => { accountsStore.selectIdentity(identity); resetNavigationTo(navigation, 'Main'); }}
					iconType="antdesign"
					iconName="user"
					iconSize={24}
					style={styles.indentedButton}
					textStyle={fontStyles.h2}
				/>
				<ButtonWithArrow
					title="Rename"
					onPress={(): void => navigation.navigate('RenameWallet')} // TODO XXX: rename selected identity
					testID={testIDs.IdentitiesSwitch.manageIdentityButton}
				/>
				<ButtonWithArrow
					title="Delete"
					onPress={(): void => deleteIdentity(identity)}
				/>
				<ButtonWithArrow
					title="Show Recovery Phrase"
					onPress={(): void => showRecoveryPhrase(identity)}
				/>
				<Separator style={{ marginBottom: 0 }} />
			</View>
		);
	};

	return (
		<SafeAreaViewContainer>
			<View style={styles.card}>
	                        <ScrollView bounces={false}>
					<View style={{ paddingVertical: 8 }}>
						{identities.map(renderNonSelectedIdentity)}
					</View>
				</ScrollView>

				<ButtonIcon
					title="Add wallet"
					testID={testIDs.IdentitiesSwitch.addIdentityButton}
					onPress={(): void => navigation.navigate('CreateWallet')}
					iconName="plus"
					iconType="antdesign"
					iconSize={24}
					textStyle={fontStyles.t_big}
					style={styles.indentedButton}
				/>
			</View>
			{/* TODO: get this footer on every page */}
			<View style={styles.tab}>
				<NavigationTab />
			</View>
		</SafeAreaViewContainer>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.background.app,
		borderRadius: 4,
		paddingBottom: 16,
		paddingTop: 8
	},
	container: {
		justifyContent: 'center',
		paddingHorizontal: 16
	},
	i_arrowStyle: {
		paddingLeft: 64,
		paddingTop: 0
	},
	indentedButton: {
		paddingLeft: 32
	},
	tab: {
		flex: 1,
		justifyContent: 'flex-end'
	}
});

const i_arrowOptions = {
	iconColor: colors.signal.main,
	iconName: 'arrowright',
	iconSize: fontStyles.i_medium.fontSize,
	iconType: 'antdesign',
	style: styles.i_arrowStyle,
	textStyle: { ...fontStyles.a_text, color: colors.signal.main }
};

export default Settings;