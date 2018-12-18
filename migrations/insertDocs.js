import client from 'part:@sanity/base/client'

// Run this script with: `sanity exec --with-user-token migrations/insertDocs.js`
// Read more: https://www.sanity.io/docs/client-libraries/js-client

const candyBrands = ['Mars', 'Bimbo', 'Nestlé', 'Hershey', 'Ferrero', 'Haribo2', 'Lindt2'];
const groq = '*[_type == $type && !(title in $ar)] {title}';
const params = {
    "type": "quark",
    "ar": candyBrands
}

client.useCdn = false;
client.fetch(groq, params).then(resultSet => {
    console.log(`got dataset (${resultSet.length})`);
    console.log(resultSet);

    // for (var e of resultSet) { console.log(e); }

    for (var e of candyBrands) {
        if (resultSet.indexOf({"title":e}) == -1) {
            const doc = {
                _type: 'quark',
                title: e
            }
            client.create(doc).then(res => {
                console.log(`Created vendor ${e}!`)
            })
        }else{
            console.log(`Allready have a ${e}.`)
        }
    }
})
