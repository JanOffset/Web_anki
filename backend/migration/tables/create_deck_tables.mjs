const createDeckTable = `
    CREATE TABLE IF NOT EXISTS deck (
        id SERIAL PRIMARY KEY,
        deck_name VARCHAR(255) NOT NULL,
        alternative VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
`;

export default createDeckTable