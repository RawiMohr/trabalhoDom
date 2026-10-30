DROP DATABASE IF EXISTS treino_dom;
CREATE DATABASE treino_dom;
USE treino_dom;

CREATE TABLE exercicios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    grupo_muscular VARCHAR(50) NOT NULL,
    series INT NOT NULL,
    repeticoes INT NOT NULL
);

INSERT INTO exercicios (nome, grupo_muscular, series, repeticoes) VALUES
('Supino reto', 'Peito', 4, 10),
('Remada curvada', 'Costas', 4, 10),
('Rosca direta', 'Bíceps', 3, 12),
('Agachamento livre', 'Pernas', 4, 10),
('Leg press', 'Pernas', 3, 12),
('Elevação lateral', 'Ombro', 3, 12),
('Tríceps corda', 'Tríceps', 3, 12),
('Puxada frontal', 'Costas', 3, 12),
('Panturrilha em pé', 'Panturrilha', 4, 15),
('Crucifixo inclinado', 'Peito', 3, 12);
