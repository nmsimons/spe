import { TreeConfiguration, SchemaFactory } from '@fluidframework/tree';

const sf = new SchemaFactory('d302b84c-75f6-4ecd-9663-524f467013e3');

export class StringArray extends sf.array('StringList', sf.string) {
    // Remove the first item in the list if the list is not empty
    public removeFirst() {
        if (this.length > 0) this.removeAt(0);
    }

    // Add an item to the beginning of the list
    public insertNew() {
        this.insertAtStart('');
    }
}

export class App extends sf.object('App', {
    stringArray: StringArray,
}) {}

// Specify the root type - App.
// Specify the initial state of the tree which is used if this is a new tree.
// This object is passed into the SharedTree via the schematize
// method.
export const treeConfiguration = new TreeConfiguration(
    App,
    () =>
        new App({
            stringArray: [],
        })
);
