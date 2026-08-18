DROP DATABASE gestao_estoque;
CREATE DATABASE gestao_estoque;

\c gestao_estoque;

CREATE TABLE Empresas (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    CNPJ VARCHAR(70) NOT NULL UNIQUE 
);

CREATE TABLE Funcionarios(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(60) NOT NULL,
    isAdmin BOOLEAN,
    id_empresa_fk INTEGER NOT NULL,
    CONSTRAINT fk_funcionarios_empresa
        FOREIGN KEY(id_empresa_fk) 
            REFERENCES Empresas(id)
);

drop table Relatorio_vendas;
drop table Produtos;

CREATE TABLE Produtos(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    preco NUMERIC(6, 2),
    preco_de_venda NUMERIC(6, 2),
    quantidade INTEGER NOT NULL DEFAULT 0, 
    codigo_de_barras VARCHAR(50) UNIQUE NOT NULL,
    id_empresa_fk INTEGER NOT NULL,
    CONSTRAINT fk_prod_empresa
        FOREIGN KEY(id_empresa_fk) 
            REFERENCES Empresas(id)
);

CREATE TABLE Relatorio_vendas(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    id_produto INTEGER NOT NULL,
    id_empresa INTEGER NOT NULL,
    id_vendedor INTEGER NOT NULL,
    quantidade_vendida INTEGER NOT NULL,
    data_de_venda TIMESTAMP,
    CONSTRAINT fk_rel_ven_empresa
        FOREIGN KEY(id_empresa) 
            REFERENCES Empresas(id),
    CONSTRAINT fk_rel_ven_produto
        FOREIGN KEY(id_produto) 
            REFERENCES Produtos(id),
    CONSTRAINT fk_rel_ven_func
        FOREIGN KEY(id_vendedor) 
            REFERENCES Funcionarios(id)
);

--relatorio para mostrar
SELECT 
    p.nome, e.nome, f.nome, r.quantidade_vendida, r.data_de_venda, 
    p.quantidade as quantidade_restante, p.preco_de_venda, p.preco, 
    (p.preco_de_venda - p.preco) * r.quantidade_vendida as lucro
FROM Relatorio_vendas r
    INNER JOIN Produtos p
        ON p.id = r.id_produto
    INNER JOIN Funcionarios f
        ON f.id = r.id_vendedor
    INNER JOIN Empresas e
        ON e.id = r.id_empresa;

-- CREATE TABLE ProdutosBaixoEstoque(
--     id_produto INTEGER NOT NULL,
--     id_empresa INTEGER NOT NULL,
--     quantidade INTEGER NOT NULL,
--     PRIMARY KEY(id_produto, id_empresa),
--     CONSTRAINT fk_produto
--         FOREIGN KEY(id_produto) 
--             REFERENCES Produtos(id),
--     CONSTRAINT fk_empresa
--         FOREIGN KEY(id_empresa) 
--             REFERENCES Empresas(id)        
-- );