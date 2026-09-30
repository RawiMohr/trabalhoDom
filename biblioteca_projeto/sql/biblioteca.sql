CREATE DATABASE biblioteca_dom;
use biblioteca_dom;

-- 1. Criação da tabela
CREATE TABLE livros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    ano_publicacao INT,
    preco DECIMAL(10, 2)
);

-- 2. Inserção dos dados
INSERT INTO livros (titulo, autor, ano_publicacao, preco) VALUES
('Dom Casmurro', 'Machado de Assis', 1899, 39.90),
('O Alquimista', 'Paulo Coelho', 1988, 29.90),
('1984', 'George Orwell', 1949, 45.00),
('O Senhor dos Anéis', 'J.R.R. Tolkien', 1954, 89.90),
('Torto Arado', 'Itamar Vieira Junior', 2019, 54.90);
