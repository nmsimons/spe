import {
	IOdspTokenProvider,
    OdspClientProps,    
} from '@fluid-experimental/odsp-client';
import { DevtoolsLogger } from '@fluid-experimental/devtools';

// Instantiate the logger
export const devtoolsLogger = new DevtoolsLogger();

export const getClientProps = (siteUrl: string, driveId: string, tokenProvider: IOdspTokenProvider): OdspClientProps => {
    const connectionConfig = {
        tokenProvider: tokenProvider,
        siteUrl: siteUrl,
        driveId: driveId,
    };
	
	return {
		connection: connectionConfig,
	};
};
