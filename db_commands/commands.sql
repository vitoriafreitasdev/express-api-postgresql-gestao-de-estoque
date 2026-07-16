DROP DATABASE gestao_estoque;
CREATE DATABASE gestao_estoque;

\c gestao_estoque;

CREATE TABLE Empresas (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    CNPJ VARCHAR(70) NOT NULL UNIQUE 
);

CREATE TABLE Administradores(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    id_empresa_fk INTEGER NOT NULL,
    CONSTRAINT fk_admin_empresa
        FOREIGN KEY(id_empresa_fk) 
            REFERENCES Empresas(id)
);

CREATE TABLE Gerenciadores(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    vendas INTEGER NOT NULL DEFAULT 0, 
    id_empresa_fk INTEGER NOT NULL,
    CONSTRAINT fk_geren_empresa
        FOREIGN KEY(id_empresa_fk) 
            REFERENCES Empresas(id)
);

CREATE TABLE Produtos(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    preco NUMERIC(6, 2),
    quantidade INTEGER NOT NULL DEFAULT 0, 
    id_empresa_fk INTEGER NOT NULL,
    CONSTRAINT fk_prod_empresa
        FOREIGN KEY(id_empresa_fk) 
            REFERENCES Empresas(id)
);

CREATE TABLE Relatorio_vendas(
    id_produto INTEGER NOT NULL,
    id_empresa INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    id_empresa_fk INTEGER NOT NULL,
    id_produto_fk INTEGER NOT NULL,
    PRIMARY KEY(id_produto, id_empresa),
    CONSTRAINT fk_rel_ven_empresa
        FOREIGN KEY(id_empresa_fk) 
            REFERENCES Empresas(id),
    CONSTRAINT fk_rel_ven_produto
        FOREIGN KEY(id_produto_fk) 
            REFERENCES Produtos(id)
);