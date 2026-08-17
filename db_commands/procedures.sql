CREATE OR REPLACE FUNCTION select_produtos() RETURNS TABLE(id bigint, nome varchar(50), preco numeric(6,2), preco_de_venda numeric(6,2), quantidade int, codigo_de_barras varchar(50), id_empresa_fk int)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT Produtos.id, Produtos.nome, Produtos.preco, Produtos.preco_de_venda, Produtos.quantidade, Produtos.codigo_de_barras, Produtos.id_empresa_fk FROM Produtos;
END;
$$;

CREATE OR REPLACE FUNCTION select_funcionarios() RETURNS TABLE(id bigint, email varchar(50), senha varchar(60), isadmin boolean, id_empresa_fk int)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT Funcionarios.id, Funcionarios.nome, Funcionarios.email, Funcionarios.isadmin, Funcionarios.id_empresa_fk FROM Funcionarios;
END;
$$;

CREATE OR REPLACE FUNCTION select_empresa() RETURNS TABLE(id bigint, nome varchar(50)) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT Empresas.id, Empresas.nome FROM Empresas;
END;
$$;