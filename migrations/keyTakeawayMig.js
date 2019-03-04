import client from 'part:@sanity/base/client'

// client.projectId = '480iybm6';
// client.dataset = 'dev';
// client.token = 'skD3cWxuaLuBjVQCPJqNVnMI4xvJChbMtMKmZlmqwzgSMeCtZI4BJWIkYUzvXGLyCN7wMXaSFzEwXS5Wa4QC30i9GBgR7dUyJ7H9vhzmPRI2Jm6CCTAD8D10avav8o3xHn8TsoATJgiJX4pPhqApPQnKHi6KbReJE7wP0IY99khcPJ4G7k3R';
// client.useCdn = false;

const groq = '*[_type == $type && defined(description) && !defined(description2)] [0..2] {_id, title, description}';
const params = {
    "type": "category"
}

client.fetch(groq, params).then(resultSet => {
    console.log(`got ${resultSet.length} new records`);

    for (let e of resultSet) {
        const d1Array = e.description.trim().split(/\r\n?|\n\r?/);
        const d2Array = d1Array.map(b => {
            return {
                _type: 'block',
                children: [
                    {
                        _type: 'span',
                        // marks: [],
                        text: b.trim()
                    }
                ],
                level: 1,
                listItem: 'bullet',
                markDefs: [],
                style: 'normal'
            }
        });

        client.patch(e._id)
            .setIfMissing({ description2: d2Array })
            .commit()
            .then(n => {
                console.log(`added ${d1Array.length} kt to ${e.title}`);
            })
            .catch(err => {
                console.error('Oh no, the update failed: ', err.message)
            })

    }
});