export default {
  name: 'folder',
  title: 'Folder',
  type: 'document',
  fields: [
    {
      name: 'foldername',
      title: 'Foldername',
      type: 'string'
    },
    {
      name: 'parent',
      title: 'Parent folder',
      type: 'reference',
      to: [{ type: 'folder' }]
    }
  ]
}
