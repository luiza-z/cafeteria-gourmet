/* =========================================================
   CAFÉ AROMAS - ADMINISTRAÇÃO
   ========================================================= */


/* =========================================================
   PRODUTOS
   ========================================================= */

const produtosAdmin = {

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


/* =========================================================
   PEDIDOS
   ========================================================= */

let pedidos = JSON.parse(
    localStorage.getItem("pedidosCafeAromas")
) || [];


/* =========================================================
   FORMATAÇÃO DE PREÇO
   ========================================================= */

function formatarPreco(valor) {

    return Number(valor).toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


/* =========================================================
   SALVAR PEDIDOS
   ========================================================= */

function salvarPedidos() {

    localStorage.setItem(
        "pedidosCafeAromas",
        JSON.stringify(pedidos)
    );

}


/* =========================================================
   ATUALIZAR DASHBOARD
   ========================================================= */

function atualizarDashboard() {

    const totalPedidos =
        document.getElementById("totalPedidos");

    const pedidosPendentes =
        document.getElementById("pedidosPendentes");

    const pedidosPreparo =
        document.getElementById("pedidosPreparo");

    const faturamento =
        document.getElementById("faturamento");


    let total = pedidos.length;

    let pendentes = 0;

    let preparo = 0;

    let faturamentoTotal = 0;


    pedidos.forEach(pedido => {

        const status =
            pedido.status || "Pendente";


        if (status === "Pendente") {

            pendentes++;

        }


        if (status === "Em preparo") {

            preparo++;

        }


        faturamentoTotal +=
            Number(pedido.total) || 0;

    });


    totalPedidos.textContent = total;

    pedidosPendentes.textContent = pendentes;

    pedidosPreparo.textContent = preparo;

    faturamento.textContent =
        formatarPreco(faturamentoTotal);

}


/* =========================================================
   DESCRIÇÃO DOS PRODUTOS
   ========================================================= */

function obterItensPedido(pedido) {

    if (!pedido.produtos) {

        return "Nenhum item";

    }


    const itens = [];


    Object.keys(pedido.produtos).forEach(id => {

        const quantidade =
            pedido.produtos[id];


        if (quantidade > 0 && produtosAdmin[id]) {

            itens.push(
                quantidade +
                "x " +
                produtosAdmin[id].nome
            );

        }

    });


    return itens.join(", ");

}


/* =========================================================
   STATUS
   ========================================================= */

function obterClasseStatus(status) {

    switch (status) {

        case "Pendente":

            return "status-pendente";


        case "Em preparo":

            return "status-preparo";


        case "Pronto":

            return "status-pronto";


        case "Finalizado":

            return "status-finalizado";


        default:

            return "status-pendente";

    }

}


/* =========================================================
   PRÓXIMO STATUS
   ========================================================= */

function proximoStatus(index) {

    const statusAtual =
        pedidos[index].status || "Pendente";


    if (statusAtual === "Pendente") {

        pedidos[index].status =
            "Em preparo";

    }

    else if (statusAtual === "Em preparo") {

        pedidos[index].status =
            "Pronto";

    }

    else if (statusAtual === "Pronto") {

        pedidos[index].status =
            "Finalizado";

    }

    else {

        pedidos[index].status =
            "Pendente";

    }


    salvarPedidos();

    atualizarPagina();

}


/* =========================================================
   EXCLUIR PEDIDO
   ========================================================= */

function excluirPedido(index) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este pedido?"
    );


    if (!confirmar) {

        return;

    }


    pedidos.splice(index, 1);


    salvarPedidos();

    atualizarPagina();

}


/* =========================================================
   MOSTRAR PEDIDOS
   ========================================================= */

function mostrarPedidos() {

    const tabela =
        document.getElementById("tabelaPedidos");

    const semPedidos =
        document.getElementById("semPedidos");


    tabela.innerHTML = "";


    if (pedidos.length === 0) {

        semPedidos.style.display = "block";

        return;

    }


    semPedidos.style.display = "none";


    pedidos.forEach((pedido, index) => {

        const status =
            pedido.status || "Pendente";


        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>

                <span class="numero-pedido">

                    #${String(index + 1).padStart(3, "0")}

                </span>

            </td>


            <td>

                <div class="cliente-pedido">

                    <strong>
                        ${pedido.cliente || "Cliente"}
                    </strong>

                    <small>
                        ${obterItensPedido(pedido)}
                    </small>

                </div>

            </td>


            <td>

                ${pedido.tipoPedido === "entrega"
                    ? "Entrega"
                    : "Retirada"}

            </td>


            <td>

                <strong>
                    ${formatarPreco(pedido.total)}
                </strong>

            </td>


            <td>

                ${pedido.data || "-"}

            </td>


            <td>

                <span class="status ${obterClasseStatus(status)}">

                    ${status}

                </span>

            </td>


            <td>

                <div class="acoes-pedido">

                    <button
                        type="button"
                        class="btn-status"
                        onclick="proximoStatus(${index})">

                        Avançar

                    </button>


                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirPedido(${index})">

                        Excluir

                    </button>

                </div>

            </td>

        `;


        tabela.appendChild(tr);

    });

}


/* =========================================================
   MOSTRAR PRODUTOS
   ========================================================= */

function mostrarProdutos() {

    const lista =
        document.getElementById("listaProdutosAdmin");


    lista.innerHTML = "";


    Object.keys(produtosAdmin).forEach(id => {

        const produto =
            produtosAdmin[id];


        const coluna =
            document.createElement("div");


        coluna.className =
            "col-12 col-sm-6 col-lg-4 col-xl-3";


        coluna.innerHTML = `

            <div class="produto-admin-card">

                <h3>
                    ${produto.nome}
                </h3>

                <strong>
                    ${formatarPreco(produto.preco)}
                </strong>

            </div>

        `;


        lista.appendChild(coluna);

    });

}


/* =========================================================
   LIMPAR TODOS OS PEDIDOS
   ========================================================= */

function limparPedidos() {

    if (pedidos.length === 0) {

        alert(
            "Não existem pedidos para excluir."
        );

        return;

    }


    const confirmar = confirm(
        "Tem certeza que deseja excluir TODOS os pedidos?"
    );


    if (!confirmar) {

        return;

    }


    pedidos = [];


    salvarPedidos();

    atualizarPagina();


    alert(
        "Todos os pedidos foram removidos."
    );

}


/* =========================================================
   ATUALIZAR PÁGINA
   ========================================================= */

function atualizarPagina() {

    atualizarDashboard();

    mostrarPedidos();

    mostrarProdutos();

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarPagina();

    }
);