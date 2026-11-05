DROP DATABASE IF EXISTS treino_dom;
CREATE DATABASE treino_dom;
USE treino_dom;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel ENUM('aluno', 'instrutor', 'admin') NOT NULL DEFAULT 'aluno',
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercicios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    grupo_muscular VARCHAR(50) NOT NULL,
    series INT NOT NULL,
    repeticoes INT NOT NULL,
    carga_kg DECIMAL(5,1) NOT NULL DEFAULT 0,
    aluno_id INT NOT NULL,
    UNIQUE (aluno_id, nome),
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id)
);

CREATE TABLE registros_treino (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exercicio_id INT NOT NULL,
    aluno_id INT NOT NULL,
    carga_kg DECIMAL(5,1) NOT NULL,
    data_registro DATE NOT NULL,
    UNIQUE (exercicio_id, data_registro),
    FOREIGN KEY (exercicio_id) REFERENCES exercicios(id) ON DELETE CASCADE,
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id)
);

INSERT INTO usuarios (nome, email, senha, nivel) VALUES
('Admin de teste', 'admin@treino.com', '$2b$10$hSG5RNR4A0W.UinAufMF1.ROZ/GTuDQZO.2e7m79TMH00.nM.ZSLq', 'admin'),
('Instrutor de teste', 'instrutor@treino.com', '$2b$10$3.U9im/I94UzwlreyUm04.Q9/viswBy/lAo/eAIuE9Dwu1W1ut80K', 'instrutor'),
('Aluno de teste', 'aluno@treino.com', '$2b$10$gVb/JLBB1rtl9A/54QM9dOs612/8zbn9lX9j5wXKHgPvS/7KSyjdW', 'aluno');

INSERT INTO exercicios (nome, grupo_muscular, series, repeticoes, carga_kg, aluno_id) VALUES
('Supino reto', 'Peito', 4, 10, 0, (SELECT id FROM usuarios WHERE email = 'aluno@treino.com')),
('Remada curvada', 'Costas', 4, 10, 0, (SELECT id FROM usuarios WHERE email = 'aluno@treino.com')),
('Rosca direta', 'Bíceps', 3, 12, 0, (SELECT id FROM usuarios WHERE email = 'aluno@treino.com')),
('Agachamento livre', 'Pernas', 4, 10, 0, (SELECT id FROM usuarios WHERE email = 'aluno@treino.com')),
('Leg press', 'Pernas', 3, 12, 0, (SELECT id FROM usuarios WHERE email = 'aluno@treino.com')),
('Elevação lateral', 'Ombro', 3, 12, 0, (SELECT id FROM usuarios WHERE email = 'aluno@treino.com')),
('Tríceps corda', 'Tríceps', 3, 12, 0, (SELECT id FROM usuarios WHERE email = 'aluno@treino.com')),
('Puxada frontal', 'Costas', 3, 12, 0, (SELECT id FROM usuarios WHERE email = 'aluno@treino.com')),
('Panturrilha em pé', 'Panturrilha', 4, 15, 0, (SELECT id FROM usuarios WHERE email = 'aluno@treino.com')),
('Crucifixo inclinado', 'Peito', 3, 12, 0, (SELECT id FROM usuarios WHERE email = 'aluno@treino.com'));

INSERT INTO registros_treino (exercicio_id, aluno_id, carga_kg, data_registro) VALUES
((SELECT id FROM exercicios WHERE nome = 'Supino reto'), (SELECT id FROM usuarios WHERE email = 'aluno@treino.com'), 20.0, CURRENT_DATE - INTERVAL 2 DAY),
((SELECT id FROM exercicios WHERE nome = 'Remada curvada'), (SELECT id FROM usuarios WHERE email = 'aluno@treino.com'), 25.0, CURRENT_DATE - INTERVAL 1 DAY),
((SELECT id FROM exercicios WHERE nome = 'Rosca direta'), (SELECT id FROM usuarios WHERE email = 'aluno@treino.com'), 10.0, CURRENT_DATE - INTERVAL 1 DAY);
