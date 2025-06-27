-- usuário: root
-- senha: c@tolic@

CREATE DATABASE biblioteca;

USE biblioteca;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	senha VARCHAR(100) NOT NULL,
	perfil ENUM('bibliotecario', 'leitor') NOT NULL DEFAULT 'leitor'
);

CREATE TABLE livros (
	id INT AUTO_INCREMENT PRIMARY KEY,
	titulo VARCHAR(100) NOT NULL,
	autor VARCHAR(100) NOT NULL,
	ano_publicacao INT NULL,
	quantidade_disponivel INT NOT NULL, -- Representa estoque
	UNIQUE (titulo, autor) -- Não permite que tenha livros iguais com o mesmo autor e titulo
);

CREATE TABLE emprestimos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	solicitacao_id INT NOT NULL,
	data_emprestimo DATE NOT NULL,
	data_devolucao_prevista DATE NOT NULL,
	data_devolucao_real DATE NULL, -- Preenchido quando devolvido
	status ENUM('ativo', 'devolvido', 'atrasado') NOT NULL DEFAULT 'ativo',
	CONSTRAINT fk_solicitacao_emprestimo FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes_emprestimo(id)
);

CREATE TABLE solicitacoes_emprestimo (
	id INT AUTO_INCREMENT PRIMARY KEY,
	livro_id INT NOT NULL,
	leitor_id INT NOT NULL,
	data_solicitacao DATE NOT NULL,
	status ENUM('pendente', 'aprovado') NOT NULL DEFAULT 'pendente',
	CONSTRAINT fk_livro_emprestimo FOREIGN KEY (livro_id) REFERENCES livros(id),
    CONSTRAINT fk_leitor_emprestimo FOREIGN KEY (leitor_id) REFERENCES users(id)
);

SELECT * FROM users;
SELECT * FROM livros;
SELECT * FROM emprestimos;