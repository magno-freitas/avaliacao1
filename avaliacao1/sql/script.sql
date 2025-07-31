CREATE DATABASE documentos;


CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('Administrador', 'Editor', 'Leitor')) NOT NULL DEFAULT 'Leitor'
);

INSERT INTO usuarios (username, password, role) VALUES 
  ('admin', 'admin123', 'Administrador'),
  ('editor1', 'editor123', 'Editor'),
  ('leitor1', 'leitor123', 'Leitor');