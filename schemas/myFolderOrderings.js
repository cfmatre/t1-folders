export default {
    name: 'myFolderOrdering',
    type: 'object',
    title: 'MyFolderOrderings',
    fields: [{
            name: 'folderOrder',
            type: 'array',
            title: 'folderOrder',
            of: [{
                type: 'reference',
                to: {
                    type: 'folder'
                }
            }]
        },

    ]
}