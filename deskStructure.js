import S from '@sanity/desk-tool/structure-builder';
import sanityClient from '@sanity/client';

const client = sanityClient({
    projectId: '480iybm6',
    dataset: 'dev',
    token: 'skD3cWxuaLuBjVQCPJqNVnMI4xvJChbMtMKmZlmqwzgSMeCtZI4BJWIkYUzvXGLyCN7wMXaSFzEwXS5Wa4QC30i9GBgR7dUyJ7H9vhzmPRI2Jm6CCTAD8D10avav8o3xHn8TsoATJgiJX4pPhqApPQnKHi6KbReJE7wP0IY99khcPJ4G7k3R',
    useCdn: false,
});

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
            S.listItem()
                .title('Folder structure')
                .child(
                    S.documentList()
                        .title('Root folders')
                        .menuItems(S.documentTypeList('folder').getMenuItems())
                        .filter('_type == "folder" && !defined(parent)')
                        .child(childBuilder)
                ),
            S.listItem()
                .title('Ordnung mus zein')
                .child(
                    S.editor()
                        .id('myFolderOrdering')
                        .schemaType('myFolderOrdering')
                        .documentId('my-folder-ordering')
                ),
            ...S.documentTypeListItems()
                .filter(listItem => !['config'].includes(listItem.getId())),
        ]);
