import pg from "pg"

const db = new pg.Pool({
    host: process.env.PGHOST,
    database: process.env.PGNAME,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
})

export default db;