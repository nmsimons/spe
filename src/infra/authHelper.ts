import { PublicClientApplication } from "@azure/msal-browser";
import { clientId } from "./clientProps";

export async function authHelper() {
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
    return { msalInstance, account };
}