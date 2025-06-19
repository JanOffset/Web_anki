import db from './pgConnection.mjs'
import createDeckTablefrom from './tables/create_deck_tables.mjs'

const runDbMigration = async () => {
    console.log("migration begin")
    const client = await db.connect()

    try {
        
        await client.query(createDeckTablefrom);

        await client.query('COMMIt');
        console.log("migration end")

    } catch (err) {
        await client.query('ROLLBACK');

        throw err
    } finally {
        client.release()
    }
}

export default runDbMigration