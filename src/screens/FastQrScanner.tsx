// Copyright 2015-2020 Parity Technologies (UK) Ltd.
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

import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import testIDs from 'e2e/testIDs';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import Button from 'components/Button';
import { useProcessBarCode } from 'modules/sign/utils';
import { useInjectionQR } from 'e2e/injections';
import { AlertStateContext } from 'stores/alertContext';
import { NetworksContext } from 'stores/NetworkContext';
import { ScannerContext } from 'stores/ScannerContext';
import { NavigationProps } from 'types/props';
import colors from 'styles/colors';
import fonts from 'styles/fonts';
import ScreenHeading from 'components/ScreenHeading';
import { Frames, TxRequestData } from 'types/scannerTypes';
import { navigateToNetworkSettings } from 'utils/navigationHelpers';
import { getQrFrame, startQrProcess, stopQrProcess } from 'utils/native';

export default function Scanner({
	navigation
}: NavigationProps<'FastQrScanner'>): React.ReactElement {
	const scannerStore = useContext(ScannerContext);
	const networksContextState = useContext(NetworksContext);
	const { setAlert } = useContext(AlertStateContext);
	const [enableScan, setEnableScan] = useState<boolean>(true);
	const [lastFrame, setLastFrame] = useState<null | string>(null);
	const [mockIndex, onMockBarCodeRead] = useInjectionQR();
	const [multiFrames, setMultiFrames] = useState<Frames>({
		completedFramesCount: 0,
		isMultipart: false,
		missedFrames: [],
		missingFramesMessage: '',
		totalFramesCount: 0
	});
	function showAlertMessage(
		title: string,
		message: string,
		isAddNetworkSuccess?: boolean
	): void {
		const clearByTap = async (): Promise<void> => {
			scannerStore.cleanup();
			scannerStore.setReady();
			setLastFrame(null);
			setEnableScan(true);
		};
		setEnableScan(false);
		if (isAddNetworkSuccess) {
			setAlert(title, message, [
				{
					onPress: async (): Promise<void> => {
						await clearByTap();
						navigateToNetworkSettings(navigation);
					},
					testID: testIDs.QrScanner.networkAddSuccessButton,
					text: 'Done'
				}
			]);
		} else {
			setAlert(title, message, [
				{
					onPress: clearByTap,
					text: 'Try again'
				}
			]);
		}
	}

	const processBarCode = useProcessBarCode(
		showAlertMessage,
		networksContextState
	);
	useEffect(() => {
		const parseTheScan = async function (): Promise<void> {
			const readResult = await startQrProcess();
			console.log(readResult);
			await stopQrProcess();
			navigation.goBack();
		}
		parseTheScan();
	}, []);

	const onBarCodeRead = (event: any): Promise<void> => {
		getQrFrame(event.rawData);
	};

	const {
		completedFramesCount,
		isMultipart,
		missedFrames,
		totalFramesCount,
		missingFramesMessage
	} = multiFrames;
	return (
		<SafeAreaViewContainer>
			<RNCamera
				captureAudio={false}
				onBarCodeRead={onBarCodeRead}
				style={styles.view}
			>
				<View style={styles.body}>
					<View style={styles.top}>
						<ScreenHeading title="Scanner" />
					</View>
					<View style={styles.middle}>
						<View style={styles.middleLeft} />
						<View style={styles.middleCenter} />
						<View style={styles.middleRight} />
					</View>
				</View>
			</RNCamera>
		</SafeAreaViewContainer>
	);
}

const styles = StyleSheet.create({
	body: {
		backgroundColor: 'transparent',
		flex: 1,
		flexDirection: 'column'
	},
	bottom: {
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 15
	},
	descSecondary: {
		color: colors.text.main,
		fontFamily: fonts.bold,
		fontSize: 14,
		paddingBottom: 20
	},
	descTitle: {
		color: colors.text.main,
		fontFamily: fonts.bold,
		fontSize: 18,
		paddingBottom: 10,
		textAlign: 'center'
	},
	inactive: {
		backgroundColor: colors.background.app,
		flex: 1,
		flexDirection: 'column',
		padding: 20
	},
	middle: {
		backgroundColor: 'transparent',
		flexBasis: 280,
		flexDirection: 'row'
	},
	middleCenter: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		flexBasis: 280
	},
	middleLeft: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		flex: 1
	},
	middleRight: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		flex: 1
	},
	progress: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	top: {
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		flexBasis: 80,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	view: {
		backgroundColor: 'black',
		flex: 1
	}
});
