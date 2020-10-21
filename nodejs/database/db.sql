CREATE TABLE usuarios(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);
ALTER TABLE usuarios
    ADD PRIMARY KEY(id);
ALTER TABLE usuarios
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;



CREATE TABLE links(
    id INT(11) NOT NULL,
    titulo VARCHAR(30)NOT NULL,
    descritption TEXT,
    user_id INT(11),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES usuarios(id)
);
ALTER TABLE links
    ADD PRIMARY KEY(id);
ALTER TABLE links
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;