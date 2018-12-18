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
            ...S.documentTypeListItems()
                .filter(listItem => !['config'].includes(listItem.getId())),
            S.listItem()
                .title('Migrate')
                .child(() => {
                    console.log('(:(|)');

                    // clientTests.addSomeQuarks();
                    // clientTests.listenToQ();
                    clientTests.dropSomeQuarks();
                    return null;
                })
        ]);

const clientTests = {
    dropSomeQuarks: () => {
        const query = '*[_type == $type && title match $title]'
        const params = { "type": "quark", "title": "a*" }

        client.fetch(query, params).then(resultSet => {
            console.log(resultSet);

            // if (debugOnce('for')) debugger;

            for (var e of resultSet) {
                client.delete(e._id)
                    .then((res) => {
                        console.log(`${res.documentIds} deleted successfully`)
                    })
                    .catch(err => {
                        console.error('Delete failed: ', err.message)
                    })
            }
        })
    },
    listenToQ: () => {
        const query = '*[_type == $type && title == $title]'
        const params = { "type": "quark", "title": "Mars" }

        const subscription = client.listen(query, params)
            .subscribe(ret => {
                console.log(ret);
                // console.log(`${ret.title} commented: ${comment.text}`)
            })

        console.log('talk to the hand (:(|)');
    },
    addSomeQuarks: () => {
        const candyBrands = ['Mars_990', 'Bimbo_990', 'Nestlé_990', 'Hershey_990', 'Ferrero_990', 'Haribo_990', 'Lindt_990'];
        const groq = '*[_type == $type && title in $ar] {title}';
        const params = {
            "type": "quark",
            "ar": candyBrands
        }

        client.fetch(groq, params).then(resultSet => {
            console.log(resultSet);
            const resultArr = resultSet.map(x => x.title);

            // for (var e of resultSet) { console.log(e); }

            if (debugOnce('for')) debugger;
            for (var e of candyBrands) {
                if (resultArr.indexOf(e) < 0) {
                    const doc = {
                        _type: 'quark',
                        title: e
                    }
                    client.create(doc).then(res => {
                        console.log(`Created vendor ${e}!`)
                    })
                } else {
                    console.log(`Allready have a ${e}.`)
                }
            }
        })
    }
}

// window.debugOnce = ++window.debugOnce || 0;
window.debugOnceKeys = [];
window.debugOnce = (key) => {
    if (debugOnceKeys.indexOf(key) < 0) {
        debugOnceKeys.push(key);
        return true;
    }
    return false;
};