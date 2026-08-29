import RelatorioVendas from "../models/RelatorioVendas.js"

const sellUpdates = async (req, res, next) => {

    const vendaFeitaPor = req.user
    const produtosVendidos =  req.produtos_vendidos 
    const produtosSemEstoque = req.produtos_sem_estoque
    const lucroTotal = req.lucro_total 
    const quantidadDisponivelInsuficiente = req.quantidade_disponivel_insuficiente

    const data = {
        vendaFeitaPor,
        produtosVendidos,
        produtosSemEstoque,
        lucroTotal,
        quantidadDisponivelInsuficiente
    }

    const dataDeVenda = new Date()
    const idVendedor = vendaFeitaPor.id

    for(let i = 0; i < produtosVendidos.length; i++){
        const idProduto = produtosVendidos[i].produto.id
        const idEmpresa = produtosVendidos[i].produto.id_empresa_fk
        const quantidade = produtosVendidos[i].quantidadeDeVenda

        const relatorio = new RelatorioVendas(idProduto, idEmpresa, idVendedor, quantidade, dataDeVenda)
        
        await relatorio.create()
        
    }

    return res.status(201).json({msg: "Venda realizada com sucesso, relatório de venda atualizado.", data: data})
}

export default sellUpdates