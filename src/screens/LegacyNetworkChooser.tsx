// Copyright 2015-2021 Parity Technologies (UK) Ltd.
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

import { NetworkCard } from 'components/NetworkCard';
import { SafeAreaScrollViewContainer } from 'components/SafeAreaContainer';
import { SubstrateNetworkKeys, UnknownNetworkKeys } from 'constants/networkSpecs';
import React, { useContext } from 'react';
import { NetworkParams } from 'types/networkTypes';
import { NavigationProps } from 'types/props';
import { emptyAccount } from 'utils/account';

import { AccountsContext, NetworksContext } from '../context';

export default function LegacyNetworkChooserView({ navigation }: NavigationProps<'LegacyNetworkChooser'>): React.ReactElement {
	const accountsStore = useContext(AccountsContext);
	const { allNetworks } = useContext(NetworksContext);
	const excludedNetworks = [UnknownNetworkKeys.UNKNOWN];

	if (!__DEV__) {
		excludedNetworks.push(SubstrateNetworkKeys.SUBSTRATE_DEV);
		excludedNetworks.push(SubstrateNetworkKeys.KUSAMA_DEV);
	}

	return (
		<SafeAreaScrollViewContainer contentContainerStyle={{ padding: 20 }}>
			{Array.from(allNetworks.entries())
				.filter(([networkKey]: [string, any]): boolean =>
					!excludedNetworks.includes(networkKey))
				.map(([networkKey, networkParams]: [
						string,
						NetworkParams
					]): React.ReactElement => (
					<NetworkCard
						key={networkKey}
						networkKey={networkKey}
						onPress={(): void =>{
							accountsStore.updateNew(emptyAccount('', networkKey));
							navigation.goBack();
						}}
						title={networkParams.title}
					/>
				))}
		</SafeAreaScrollViewContainer>
	);
}
