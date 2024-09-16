CREATE TABLE dream (
    id SERIAL PRIMARY KEY,
    date DATE,
    people varchar(30),
    thing varchar(30),
    place varchar(30),
    description text
);
