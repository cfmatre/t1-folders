import S from '@sanity/desk-tool/structure-builder';
import sanityClient from '@sanity/client';

const client = sanityClient({
    projectId: '480iybm6',
    dataset: 'dev',
    useCdn: false
});

const getChildren = async (id) => {
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
            .child(getChildren)
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
                        .child(getChildren)
                ),
            ...S.documentTypeListItems().filter(listItem => !['config'].includes(listItem.getId()))
        ]);