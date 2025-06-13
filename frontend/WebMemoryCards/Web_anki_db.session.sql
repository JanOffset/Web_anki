CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    card_info VARCHAR(255) NOT NULL
);

INSERT INTO cards (card_info) VALUES
    ('this is the first question !'),
    ('this is the second question !');

INSERT INTO cards (card_info)
VALUES (
    
    'third question !'
  );

SELECT * FROM cards;