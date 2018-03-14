DROP DATABASE IF EXISTS articles;
CREATE DATABASE articles;

\c articles;

CREATE TABLE artics (
  ID SERIAL PRIMARY KEY,
  author VARCHAR,
  title VARCHAR,
  content VARCHAR
);

INSERT INTO artics (author, title, content)
  VALUES ('Admin', 'Test title', 'Here is content...');