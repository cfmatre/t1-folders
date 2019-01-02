const clientTests = {
    ListItemTestMigrate: () => {
        return S.listItem()
            .title('Migrate')
            .child(() => {
                console.log('(:(|)');

                // clientTests.addSomeQuarks();
                // clientTests.listenToQ();
                clientTests.dropSomeQuarks();
                return null;
            })
    },
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