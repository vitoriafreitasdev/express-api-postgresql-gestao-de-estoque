
CREATE DATABASE session_store;

\c session_store

CREATE table session(
    sid VARCHAR(50) NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL
);