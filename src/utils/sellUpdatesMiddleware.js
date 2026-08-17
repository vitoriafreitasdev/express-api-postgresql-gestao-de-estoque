
const sellUpdates = (req, res, next) => {
    //pegar o id da empresa do usuario, com ele pegar os produtos que estao com baixo estoque
    const vendaFeitaPor = req.user
    const produtosVendidos =  req.produtos_vendidos 
    const produtosSemEstoque = req.produtos_sem_estoque
    const lucroTotal = req.lucroTotal 
    
    const test = {
        vendaFeitaPor,
        produtosVendidos,
        produtosSemEstoque,
        lucroTotal
    }

    res.send(test)
}

export default sellUpdates