import client from 'part:@sanity/base/client'

const groq = '*[_type == $type && defined(description) && defined(description2)] [0..2] {_id, title, description}';
const params = {
    "type": "category"
}

client.fetch(groq, params).then(resultSet => {
    console.log(`got ${resultSet.length} new records`);

    for (let e of resultSet) {
        client.patch(e._id)
            .unset(['description2'])
            .commit()
            .then(n => {
                console.log(`unset kt2 to ${e.title}`);
            })
            .catch(err => {
                console.error('Oh no, the update failed: ', err.message)
            })
    }
});