import db from "../../../migration/pgConnection.mjs"

const create = async ({ deck_name, alternative, password}) => {
    const query = `
        INSER INTO 
            deck ( deck_name, alternative, password)
        VALUES
            ($1, $2, $3)
        RETURNING *
    ;`

    const result = await db.query(query, [deck_name, alternative, password]);

    return result.rows[0];
}

export default {
    create
}