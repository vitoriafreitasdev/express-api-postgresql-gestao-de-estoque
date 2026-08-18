CREATE OR REPLACE FUNCTION func_produtos() RETURNS TABLE(id bigint, quantidade int, codigo_de_barras varchar(50), id_empresa_fk int)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT Produtos.id, Produtos.quantidade, Produtos.codigo_de_barras, Produtos.id_empresa_fk FROM Produtos;
END;
$$;

CREATE OR REPLACE FUNCTION func_funcionarios() RETURNS TABLE(id bigint, email varchar(50), senha varchar(60), isadmin boolean, id_empresa_fk int)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT Funcionarios.id, Funcionarios.nome, Funcionarios.email, Funcionarios.isadmin, Funcionarios.id_empresa_fk FROM Funcionarios;
END;
$$;

CREATE OR REPLACE FUNCTION func_empresa() RETURNS TABLE(id bigint, nome varchar(50)) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT Empresas.id, Empresas.nome FROM Empresas;
END;
$$;

SELECT func_produtos();

drop function func_produtos;
drop function func_funcionarios;
drop function func_empresa;