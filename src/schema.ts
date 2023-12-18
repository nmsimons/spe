import { TreeConfiguration, SchemaFactory } from '@fluid-experimental/tree2';

const sf = new SchemaFactory('d302b84c-75f6-4ecd-9663-524f467013e3');

export class StringList extends sf.list('StringList', sf.string) {
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
    stringList: StringList,    
}) {}

// Specify the root type - App.
// Specify the initial state of the tree which is used if this is a new tree.
// This object is passed into the SharedTree via the schematize
// method.
export const treeConfiguration = new TreeConfiguration(
    App,
    () =>
        new App({
            stringList: []
        })
);
