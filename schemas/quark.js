import icon from 'react-icons/lib/fa/modx'

export default {
    name: 'quark',
    title: 'Quark',
    type: 'document',
    icon,
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            name: 'description',
            title: 'Description',
            type: 'blockContent'
        },
        {
            name: 'vector',
            title: 'Vector',
            type: 'number'
        },
        {
            name: 'data',
            title: 'Data',
            type: 'string'
        },
    ]
}