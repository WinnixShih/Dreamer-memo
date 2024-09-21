CREATE TABLE dreamer (
    id SERIAL PRIMARY KEY,
    name varchar(30) UNIQUE NOT NULL,
    password varchar(20) NOT NULL
);

CREATE TABLE dream (
    id SERIAL PRIMARY KEY,
    date DATE,
    people varchar(30),
    thing varchar(30),
    place varchar(30),
    description text,
    dreamer_id int REFERENCES dreamer(id)
);
