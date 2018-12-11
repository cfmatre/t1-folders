import S from '@sanity/desk-tool/structure-builder';
import sanityClient from '@sanity/client';

const client = sanityClient({ useCdn: false, dataset: 'dev', projectId: '----' });

const childBuilder = async (id) => {
    // If this is a product I wish to show the editor in the next pane.
    // If it's a folder, show sub folders.
    // To determine this I am doing an extra api call for folders with this _id.
    // (only reason I as for sub folders at the end is to return null if this is the end)
    const folders = await client.fetch(`*[_type == "folder" && _id == "${id}"] {foldername} + *[_type == "folder" && parent._ref == "${id}"] {foldername}`);
    if (folders.length === 0) {
        return S.editor()
            .id('product')
            .schemaType("product")
            .documentId(id)
    }
    else if (folders.length === 1) {
        return null;
    }
    else {
        return S.documentList()
            .title(folders[0].foldername)
            .filter('_type in ["folder", "product"] && ($id == parent._ref || $id == inFolder._ref)')
            .params({ id })
            .child(childBuilder)
    }
}

export default async () =>
    S.list()
        .title('Content')
        .items([
            S.listItem().title('Folder structure').child(
                    S.documentList().title('Root folders').menuItems(S.documentTypeList('folder').getMenuItems())
                        .filter('_type == "folder" && !defined(parent)').child(childBuilder)
                ),
            ...S.documentTypeListItems().filter(listItem => !['config'].includes(listItem.getId()))
        ]);