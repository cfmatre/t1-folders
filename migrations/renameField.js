import client from 'part:@sanity/base/client'

// Run this script with: `sanity exec --with-user-token migrations/renameField.js`
// Writer1: skMFAI6KSEJNvuFV95MscNQbgz4IfSJfD8xqHEHN6fr0sPai4lRLAnBxnHxvFWkLL638rQ03LVthhYE1rrGvwhI1e4ks4VGQldU5Tyfw9sKfTCcfCsF1mtVpB4Co0d3AClw3S3PHV2Ny57Y6zmcLw3SCfzBanr0gA8i2zRL41eJs0HBgQlpi

const candyBrands = ['Mars', 'Bimbo', 'Nestlé', 'Hershey', 'Ferrero', 'Haribo', 'Lindt'];
const candyBrandsString = candyBrands.map(b => `'${b}'`).join(',');
var groq = `*[_type == 'vendor' && title in ${candyBrandsString}}] [0...3] {_id, title}`;
groq = "*[_type == 'vendor' && (defined(title2) || defined(fullname))] [0...10] {_id, _rev, title}"

// Fetching documents that matches the precondition for the migration. This query should eventually return an empty set.
const fetchDocuments = () =>
    client.fetch(groq);

const buildPatches = docs =>
    docs.map(doc => ({
        id: doc._id,
        patch: {
            //set: { title2: doc.title + " 2" },
            unset: ['title2', 'fullname'],
            ifRevisionID: doc._rev
        }
    }))

const createTransaction = patches =>
    patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction())

const commitTransaction = tx => tx.commit()

const migrateNextBatch = async () => {
    const documents = await fetchDocuments()
    const patches = buildPatches(documents)
    if (patches.length === 0) {
        console.log('No more documents to migrate!')
        return null
    }
    console.log(
        `Migrating batch:\n %s`,
        patches.map(patch => `${patch.id} => ${JSON.stringify(patch.patch)}`).join('\n')
    )
    const transaction = createTransaction(patches)
    await commitTransaction(transaction)
    return migrateNextBatch()
}

migrateNextBatch().catch(err => {
    console.error(err)
    process.exit(1)
})
