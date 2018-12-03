import S from '@sanity/desk-tool/structure-builder';

// export default () =>
//     S.list()
//         .title('Content')
//         .items([
//             S.listItem()
//                 .title('Your first structure!')
//         ]);

export default () =>
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
                        .child(folderId => {
                            const x = S.documentList('folder').getMenuItems();
                            console.log(x);
                            // This is where I'd like to have a stack of both 
                            // - a documentList of folders 
                            // - and documentList of products 
                            // like in the category section below, but in the same pane
                            // also repeating it for every subfolder - which i want to make recursive when all else is done ,'-)
                            const r = S.documentList()
                                .title('Sub folder')
                                .menuItems(S.documentList('folder').getMenuItems())
                                .filter('_type == "folder" && $folderId == parent._ref')
                                .params({ folderId })
                                .child(folderId =>
                                    S.documentList()
                                        .title('Sub folder')
                                        .menuItems(S.documentList('folder').getMenuItems())
                                        .filter('_type == "folder" && $folderId == parent._ref')
                                        .params({ folderId })
                                        .child(folderId =>
                                            S.documentList()
                                                .title('Sub folder')
                                                .menuItems(S.documentList('folder').getMenuItems())
                                                .filter('_type == "folder" && $folderId == parent._ref')
                                                .params({ folderId })
                                        )
                                )
                            return r;
                        })
                ),

            S.listItem()
                .title('Products by Categories')
                .child(
                    S.documentList()
                        .title('Parent categories')
                        .menuItems(S.documentTypeList('category').getMenuItems())
                        .filter('_type == $type && !defined(parents)')
                        .params({ type: 'category' })
                        .child(categoryId =>
                            S.documentList()
                                .title('Cild categories')
                                .menuItems(S.documentList('category').getMenuItems())
                                .filter('_type == $type && $categoryId in parents[]._ref')
                                .params({ type: 'category', categoryId })
                                .child(categoryId =>
                                    S.documentList()
                                        .title('Products')
                                        .menuItems(S.documentTypeList('product').getMenuItems())
                                        .filter('_type == $type && $categoryId in categories[]._ref')
                                        .params({ type: 'product', categoryId })
                                )
                        )
                    // .child(
                    //     S.documentList()
                    //         .title('Products')
                    //         .menuItems(S.documentTypeList('product').getMenuItems())
                    //         .filter('_type == $type && $categoryId in categories[]._ref')
                    //         .params({ type: 'product', categoryId })
                    // )
                ),

            S.listItem()
                .title('Config')
                .child(
                    S.editor()
                        .id('config')
                        .schemaType('config')
                        .documentId('global-config')
                ),

            ...S.documentTypeListItems().filter(listItem => !['config'].includes(listItem.getId()))
        ]);