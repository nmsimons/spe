import { OdspClient, OdspClientProps, OdspContainerServices } from "@fluid-experimental/odsp-client";
import { ContainerSchema, IFluidContainer } from 'fluid-framework';
import { SharedTree } from '@fluid-experimental/tree2';

/**
 * This function will create a container if no container ID is passed on the hash portion of the URL.
 * If a container ID is provided, it will load the container.
 *
 * @returns The loaded container and container services.
 */
export const loadFluidData = async (
    containerId: string,
    containerSchema: ContainerSchema,
    clientProps: OdspClientProps
): Promise<{
    services: OdspContainerServices;
	container: IFluidContainer;
}> => {
    let container: IFluidContainer;
    let services: OdspContainerServices;

    const client = new OdspClient(clientProps);

    // Get or create the document depending if we are running through the create new flow
    if (containerId.length === 0) {
        // The client will create a new detached container using the schema
        // A detached container will enable the app to modify the container before attaching it to the client
        ({ container, services } = await client.createContainer(containerSchema));
    } else {
        // Use the unique container ID to fetch the container created earlier. It will already be connected to the
        // collaboration session.
        ({ container, services } = await client.getContainer(
            containerId,
            containerSchema
        ));
    }
    return { services, container };
};

export const containerSchema: ContainerSchema = {
    initialObjects: {
        appData: SharedTree,
    },
};
