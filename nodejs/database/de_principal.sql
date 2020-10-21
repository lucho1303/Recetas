


CREATE TABLE usuarios(
	id INT(11) NOT NULL,
	nombre VARCHAR(30) NOT NULL,
	apellido VARCHAR(30) NOT NULL,
	username VARCHAR(16) NOT NULL,
	correo VARCHAR(255) NOT NULL,
	clave VARCHAR(60) NOT NULL
);

ALTER TABLE usuarios
	ADD PRIMARY KEY (id);
ALTER TABLE usuarios
	MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;


CREATE TABLE recetas(
	id INT(11) NOT NULL,
	title VARCHAR(150) NOT NULL,
	description TEXT,
	ingredientes TEXT,
	user_id INT(11),
	estado bool,
	created_at timestamp NOT NULL DEFAULT current_timestamp,
	CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES usuarios(id)
);

ALTER TABLE recetas
	ADD PRIMARY KEY (id);
ALTER TABLE recetas
	MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

CREATE TABLE ingredientes(
	id INT(11) NOT NULL,
	name VARCHAR(100) NOT NULL,	
	user_id INT(11),
	estado bool,
	CONSTRAINT fk_in_user FOREIGN KEY(user_id) REFERENCES usuarios(id)
);
ALTER TABLE ingredientes
	ADD PRIMARY KEY (id);
ALTER TABLE ingredientes
	MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

