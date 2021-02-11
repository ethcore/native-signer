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
import NetworkInfoCard from 'modules/network/components/NetworkInfoCard';
import React, { useContext } from 'react';
import { NavigationProps } from 'types/props';
import { getSubstrateNetworkKeyByPathId } from 'utils/identitiesUtils';

import { NetworksContext } from '../../../context';

export default function NetworkDetails({ route }: NavigationProps<'NetworkDetails'>): React.ReactElement {
	const networkPathId = route.params.pathId;
	const { getSubstrateNetwork, networks } = useContext(NetworksContext);
	const networkKey = getSubstrateNetworkKeyByPathId(networkPathId, networks);
	const networkParams = getSubstrateNetwork(networkKey);

	return (
		<SafeAreaScrollViewContainer>
			<NetworkCard
				networkKey={networkParams.genesisHash}
				title={networkParams.title}
			/>
			<NetworkInfoCard label="Title"
				text={networkParams.title} />
			<NetworkInfoCard label="Path ID"
				text={networkParams.pathId} />
			<NetworkInfoCard
				label="Genesis Hash"
				small
				text={networkParams.genesisHash}
			/>
			<NetworkInfoCard label="Unit"
				text={networkParams.unit} />
			<NetworkInfoCard
				label="Decimals"
				text={networkParams.decimals.toString()}
			/>
			<NetworkInfoCard
				label="Address prefix"
				text={networkParams.prefix.toString()}
			/>
		</SafeAreaScrollViewContainer>
	);
}
