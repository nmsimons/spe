/* eslint-disable react/jsx-key */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadFluidData, containerSchema } from './infra/fluid';
import { initializeDevtools } from '@fluid-experimental/devtools';
import {
    FileStorageContainer,
    clientId,
    containerTypeId,
    devtoolsLogger,
    getClientProps,
} from './infra/clientProps';
import { ITree } from '@fluid-experimental/tree2';
import { treeConfiguration } from './schema';
import './output.css';
import { ReactApp } from './react_app';
import { User, Organization, Site } from '@microsoft/microsoft-graph-types';
import {
    PublicClientApplication,
    InteractionType,
    AccountInfo,
} from '@azure/msal-browser';
import {
    AuthCodeMSALBrowserAuthenticationProvider,
    AuthCodeMSALBrowserAuthenticationProviderOptions,
} from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { Client } from '@microsoft/microsoft-graph-client';
import { OdspTestTokenProvider } from './infra/tokenProvider';

async function start() {
    const msalConfig = {
        auth: {
            clientId,
            authority: 'https://login.microsoftonline.com/common/',
            tenantId: 'common',
        },
    };
    const msalInstance = new PublicClientApplication(msalConfig);
    await msalInstance.initialize();

    // This will only work if loginPopup is synchronous, otherwise, you may need to handle the response in a different way
    await msalInstance.loginPopup({
        scopes: ['FileStorageContainer.Selected'],
    });

    const account = msalInstance.getAllAccounts()[0];
    msalInstance.setActiveAccount(account);

    const options: AuthCodeMSALBrowserAuthenticationProviderOptions = {
        account: account, // the AccountInfo instance to acquire the token for.
        interactionType: InteractionType.Popup, // msal-browser InteractionType
        scopes: ['user.read', 'mail.send'], // example of the scopes to be passed
    };

    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
        msalInstance,
        options
    );

    // Initialize the Graph client
    const graphClient = Client.initWithMiddleware({
        authProvider,
    });

    const response = await graphClient
        .api('/storage/fileStorage/containers')
        .filter('containerTypeId eq ' + containerTypeId)
        .version('beta')
        .get();

    const fileStorageContainers: FileStorageContainer[] = response.value;

    if (fileStorageContainers.length == 0) {
        console.log('TEST: no fileStorageContainers');
    }

    const fileStorageContainerID: string = fileStorageContainers[0].id;

    // const response2 = await graphClient.api('/organization').version('beta').get();

    // const organization: Organization[] = response2.value;

    // if (organization.length > 0) {
    //     const domains = organization[0].verifiedDomains;
    //     if (domains) {
    //         for (const d of domains) {
    //             if (d.isDefault) {
    //                 console.log('TEST2:', d.name);
    //             }
    //         }
    //     }
    // }

    const response2 = await graphClient
        .api('/sites')
        .version('beta')
        .filter('siteCollection/root ne null')
        .select('siteCollection,webUrl')
        .get();

    const sites: Site[] = response2.value;

    const siteUrl = sites[0].webUrl;    

    // create the root element for React
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = createRoot(app);

    // Get the root container id from the URL
    // If there is no container id, then the app will make
    // a new container.
    let containerId = location.hash.substring(1);

    // Initialize Fluid Container - this will either make a new container or load an existing one
    const { container } = await loadFluidData(
        containerId,
        containerSchema,
        getClientProps(
            siteUrl as string,
            fileStorageContainerID,
            new OdspTestTokenProvider(msalInstance)
        )
    );

    // Initialize the SharedTree Data Structure
    const appData = (container.initialObjects.appData as ITree).schematize(
        treeConfiguration // This is defined in schema.ts
    );

    // Initialize debugging tools
    initializeDevtools({
        logger: devtoolsLogger,
        initialContainers: [
            {
                container,
                containerKey: 'My Container',
            },
        ],
    });

    // Render the app - note we attach new containers after render so
    // the app renders instantly on create new flow. The app will be
    // interactive immediately.
    root.render(<ReactApp data={appData} />);

    // If the app is in a `createNew` state - no containerId, and the container is detached, we attach the container.
    // This uploads the container to the service and connects to the collaboration session.
    if (containerId.length == 0) {
        containerId = await container.attach();

        // The newly attached container is given a unique ID that can be used to access the container in another session.
        // This adds that id to the url.
        location.hash = containerId;
    }
}

export default start();
