/* =========================================================
   CAFÉ AROMAS - PÁGINA DE PEDIDOS
   ========================================================= */

// =========================================================
// PRODUTOS
// =========================================================

const produtos = {

    espresso: {
        nome: "Espresso",
        preco: 6.90
    },

    mocha: {
        nome: "Mocha",
        preco: 11.90
    },

    cafecoado: {
        nome: "Café Coado",
        preco: 6.50
    },

    suco: {
        nome: "Sucos Naturais",
        preco: 8.90
    },

    milkshake: {
        nome: "Milkshakes",
        preco: 12.90
    },

    misto: {
        nome: "Misto Quente",
        preco: 6.90
    },

    esfiha: {
        nome: "Esfihas",
        preco: 10.00
    },

    empada: {
        nome: "Empadas",
        preco: 7.50
    },

    paodequeijo: {
        nome: "Pão de Queijo",
        preco: 6.90
    },

    cookies: {
        nome: "Cookies",
        preco: 10.00
    }

};


// =========================================================
// CARRINHO
// =========================================================

let carrinho = JSON.parse(
    localStorage.getItem("carrinhoCafeAromas")
) || {};


// =========================================================
// ALTERAR QUANTIDADE
// =========================================================

function alterarQuantidade(id, valor) {

    // Se o produto ainda não estiver no carrinho
    if (!carrinho[id]) {
        carrinho[id] = 0;
    }

    // Altera a quantidade
    carrinho[id] += valor;


    // Impede quantidade negativa
    if (carrinho[id] < 0) {
        carrinho[id] = 0;
    }


    // Salva no navegador
    salvarCarrinho();


    // Atualiza os números da página
    atualizarQuantidade(id);


    // Atualiza o resumo
    atualizarCarrinho();
}


// =========================================================
// ATUALIZAR QUANTIDADE NA LISTA DE PRODUTOS
// =========================================================

function atualizarQuantidade(id) {

    const elemento = document.getElementById(`qtd-${id}`);

    if (!elemento) {
        return;
    }

    elemento.textContent = carrinho[id] || 0;
}


// =========================================================
// ATUALIZAR TODAS AS QUANTIDADES
// =========================================================

function atualizarTodasQuantidades() {

    Object.keys(produtos).forEach(id => {

        atualizarQuantidade(id);

    });
}


// =========================================================
// SALVAR CARRINHO
// =========================================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinhoCafeAromas",
        JSON.stringify(carrinho)
    );
}


// =========================================================
// ATUALIZAR RESUMO DO PEDIDO
// =========================================================

function atualizarCarrinho() {

    const lista = document.getElementById("lista-carrinho");
    const totalElemento = document.getElementById("total");


    if (!lista || !totalElemento) {
        return;
    }


    lista.innerHTML = "";


    let total = 0;
    let quantidadeItens = 0;


    // Percorre os produtos
    Object.keys(carrinho).forEach(id => {

        const quantidade = carrinho[id];

        if (quantidade <= 0) {
            return;
        }


        const produto = produtos[id];

        if (!produto) {
            return;
        }


        const subtotal = produto.preco * quantidade;

        total += subtotal;

        quantidadeItens += quantidade;


        // Cria o item no resumo
        const item = document.createElement("div");

        item.className = "item-carrinho";


        item.innerHTML = `

            <div class="item-carrinho-info">

                <strong>
                    ${produto.nome}
                </strong>

                <small>
                    ${quantidade} x ${formatarPreco(produto.preco)}
                </small>

            </div>


            <div class="item-carrinho-acoes">

                <strong>
                    ${formatarPreco(subtotal)}
                </strong>

                <button
                    type="button"
                    onclick="removerProduto('${id}')"
                    title="Remover produto">
                    ×
                </button>

            </div>

        `;


        lista.appendChild(item);

    });


    // Se estiver vazio
    if (quantidadeItens === 0) {

        lista.innerHTML = `

            <div class="carrinho-vazio">

                <span>
                    🛍️
                </span>

                <p>
                    Seu carrinho está vazio.
                </p>

                <small>
                    Adicione produtos ao seu pedido.
                </small>

            </div>

        `;

    }


    // Atualiza o total
    totalElemento.textContent = formatarPreco(total);
}


// =========================================================
// REMOVER PRODUTO
// =========================================================

function removerProduto(id) {

    carrinho[id] = 0;


    salvarCarrinho();

    atualizarQuantidade(id);

    atualizarCarrinho();
}


// =========================================================
// CALCULAR TOTAL
// =========================================================

function calcularTotal() {

    let total = 0;


    Object.keys(carrinho).forEach(id => {

        const quantidade = carrinho[id];

        const produto = produtos[id];


        if (produto && quantidade > 0) {

            total += produto.preco * quantidade;

        }

    });


    return total;
}


// =========================================================
// FORMATAR PREÇO
// =========================================================

function formatarPreco(valor) {

    return valor.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


// =========================================================
// FINALIZAR PEDIDO
// =========================================================

function finalizarPedido() {

    const total = calcularTotal();


    // Verifica se há produtos
    if (total === 0) {

        alert(
            "Seu pedido está vazio. Adicione pelo menos um produto."
        );

        return;
    }


    // Pega os dados
    const nome =
        document.getElementById("nome").value.trim();

    const telefone =
        document.getElementById("telefone").value.trim();

    const tipoPedido =
        document.getElementById("tipoPedido").value;

    const pagamento =
        document.getElementById("pagamento").value;

    const observacao =
        document.getElementById("observacao").value.trim();


    // Validação do nome
    if (!nome) {

        alert("Digite seu nome.");

        document.getElementById("nome").focus();

        return;
    }


    // Validação do telefone
    if (!telefone) {

        alert("Digite seu telefone.");

        document.getElementById("telefone").focus();

        return;
    }


    // Validação do tipo de pedido
    if (!tipoPedido) {

        alert("Selecione o tipo de pedido.");

        document.getElementById("tipoPedido").focus();

        return;
    }


    // Validação do pagamento
    if (!pagamento) {

        alert("Selecione a forma de pagamento.");

        document.getElementById("pagamento").focus();

        return;
    }


    // Monta o pedido
    const pedido = {

        cliente: nome,

        telefone: telefone,

        tipoPedido: tipoPedido,

        pagamento: pagamento,

        observacao: observacao,

        produtos: carrinho,

        total: total,

        data: new Date().toLocaleString("pt-BR")

    };


    console.log("Pedido realizado:", pedido);

    const pedidosSalvos =
        JSON.parse(localStorage.getItem("pedidosCafeAromas")) || [];

    pedido.status = "Pendente";

    pedidosSalvos.push(pedido);

    localStorage.setItem(
        "pedidosCafeAromas",
        JSON.stringify(pedidosSalvos)
    );


    // Mensagem para o cliente
    alert(

        "Pedido realizado com sucesso! ☕\n\n" +

        "Cliente: " + nome + "\n" +

        "Total: " + formatarPreco(total) + "\n\n" +

        "Obrigado por escolher o Café Aromas!"

    );


    // Limpa o carrinho
    carrinho = {};

    salvarCarrinho();

    atualizarTodasQuantidades();

    atualizarCarrinho();


    // Limpa os campos
    document.getElementById("nome").value = "";

    document.getElementById("telefone").value = "";

    document.getElementById("tipoPedido").value = "";

    document.getElementById("pagamento").value = "";

    document.getElementById("observacao").value = "";

}


// =========================================================
// MÁSCARA DE TELEFONE
// =========================================================

const telefoneInput =
    document.getElementById("telefone");


if (telefoneInput) {

    telefoneInput.addEventListener(
        "input",
        function () {

            let valor =
                telefoneInput.value.replace(/\D/g, "");


            valor = valor.substring(0, 11);


            if (valor.length <= 10) {

                valor = valor.replace(
                    /^(\d{2})(\d{4})(\d{0,4})$/,
                    "($1) $2-$3"
                );

            } else {

                valor = valor.replace(
                    /^(\d{2})(\d{5})(\d{0,4})$/,
                    "($1) $2-$3"
                );

            }


            telefoneInput.value = valor;

        }
    );

}


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarTodasQuantidades();

        atualizarCarrinho();

    }
);