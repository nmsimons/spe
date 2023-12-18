/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import {
	IOdspTokenProvider,
    OdspClientProps,
    OdspConnectionConfig,
} from '@fluid-experimental/odsp-client';
import { OdspTestTokenProvider } from './tokenProvider';
import { DevtoolsLogger } from '@fluid-experimental/devtools';

// Instantiate the logger
export const devtoolsLogger = new DevtoolsLogger();

export const clientId = '19abc360-c059-48d8-854e-cfeef9a3c5b8';
export const containerTypeId = '6d740a46-9d72-41f3-b321-8ee1f72a1564';

export interface FileStorageContainer {
    containerTypeId: string;
    createdDateTime: string;
    displayName: string;
    id: string;
}

export interface OdspTestCredentials {
    siteUrl: string;
    driveId: string;
    clientId: string;
}

// export const props: OdspTestCredentials = {
//     siteUrl: 'https://M365x82694150.sharepoint.com',
//     driveId: 'b!dIZsq5Xo6UaIKdlqxx7IF-GNdyKV3DhEo3LZUnsGbnMFUDWKgBF5QImlyKpAJHpB',
//     clientId: clientId,
// };

export const getClientProps = (siteUrl: string, driveId: string, tokenProvider: IOdspTokenProvider): OdspClientProps => {

    const connectionConfig = {
        tokenProvider: tokenProvider,
        siteUrl: siteUrl,
        driveId: driveId,
    };

	console.log (connectionConfig);

	return {
		connection: connectionConfig,
	};
};
