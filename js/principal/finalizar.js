const chavePedidos =
    "meusPedidos";


const numeroWhatsApp =
    "558587144716";


const listaPedidos =
    document.getElementById("listaPedidos");


const pedidoVazio =
    document.getElementById("pedidoVazio");


const totalItens =
    document.getElementById("totalItens");


const valorTotal =
    document.getElementById("valorTotal");


const btnLimpar =
    document.getElementById("btnLimpar");


const btnFinalizar =
    document.getElementById("btnFinalizar");


const formDadosPedido =
    document.getElementById("formDadosPedido");


function buscarPedidos() {

    return JSON.parse(
        localStorage.getItem(chavePedidos)
    ) || [];

}


function salvarPedidos(pedidos) {

    localStorage.setItem(
        chavePedidos,
        JSON.stringify(pedidos)
    );

}


function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


function calcularTotais(pedidos) {

    return pedidos.reduce((totais, item) => {

        totais.itens += item.quantidade;
        totais.valor += item.precoNumero * item.quantidade;

        return totais;

    }, {
        itens: 0,
        valor: 0
    });

}


function buscarDadosCliente() {

    const pagamentoSelecionado =
        document.querySelector('input[name="pagamento"]:checked');

    return {
        nome: document.getElementById("nomeCliente").value.trim(),
        rua: document.getElementById("ruaCliente").value.trim(),
        numero: document.getElementById("numeroCliente").value.trim(),
        bairro: document.getElementById("bairroCliente").value.trim(),
        complemento: document.getElementById("complementoCliente").value.trim(),
        pagamento: pagamentoSelecionado ? pagamentoSelecionado.value : ""
    };

}


function montarMensagemWhatsApp(pedidos, dadosCliente) {

    const totais =
        calcularTotais(pedidos);

    const itens =
        pedidos.map((item) => {

            const subtotal =
                item.precoNumero * item.quantidade;

            return `- ${item.quantidade}x ${item.nome} - ${formatarMoeda(subtotal)}`;

        }).join("\n");

    const complemento =
        dadosCliente.complemento
            ? `\nComplemento: ${dadosCliente.complemento}`
            : "";

    const pagamento =
        dadosCliente.pagamento === "Pix"
            ? "Pix - confirmar pagamento"
            : "Dinheiro";

    return `Queria as pizzas e bebidas escolhidas no cardapio:\n\nNome: ${dadosCliente.nome}\nRua: ${dadosCliente.rua}\nNumero: ${dadosCliente.numero}\nBairro: ${dadosCliente.bairro}${complemento}\nPagamento: ${pagamento}\n\nPedido:\n${itens}\n\nTotal: ${formatarMoeda(totais.valor)}`;

}


function enviarPedidoWhatsApp(event) {

    event.preventDefault();

    const pedidos =
        buscarPedidos();

    if (pedidos.length === 0) {

        return;

    }

    const dadosCliente =
        buscarDadosCliente();

    const mensagem =
        encodeURIComponent(
            montarMensagemWhatsApp(pedidos, dadosCliente)
        );

    const numero =
        numeroWhatsApp.trim();

    const url =
        numero
            ? `https://wa.me/${numero}?text=${mensagem}`
            : `https://wa.me/?text=${mensagem}`;

    window.open(
        url,
        "_blank"
    );

}


function alterarQuantidade(nome, mudanca) {

    const pedidos =
        buscarPedidos()
            .map((item) => {

                if (item.nome === nome) {

                    item.quantidade += mudanca;

                }

                return item;

            })
            .filter((item) => {

                return item.quantidade > 0;

            });

    salvarPedidos(pedidos);
    renderizarPedidos();

}


function removerPedido(nome) {

    const pedidos =
        buscarPedidos().filter((item) => {

            return item.nome !== nome;

        });

    salvarPedidos(pedidos);
    renderizarPedidos();

}


function criarCardPedido(item) {

    const card =
        document.createElement("article");

    card.className =
        "cardPedido";

    card.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}">

        <div class="infoPedido">
            <h2>${item.nome}</h2>
            <p>${item.descricao}</p>
            <strong>${formatarMoeda(item.precoNumero)}</strong>
        </div>

        <div class="acoesPedido">
            <div class="controleQuantidade">
                <button type="button" data-acao="diminuir" aria-label="Diminuir quantidade">-</button>
                <span>${item.quantidade}</span>
                <button type="button" data-acao="aumentar" aria-label="Aumentar quantidade">+</button>
            </div>

            <button type="button" class="btnRemover" data-acao="remover">
                Remover
            </button>
        </div>
    `;

    card
        .querySelector('[data-acao="diminuir"]')
        .addEventListener("click", () => {

            alterarQuantidade(item.nome, -1);

        });

    card
        .querySelector('[data-acao="aumentar"]')
        .addEventListener("click", () => {

            alterarQuantidade(item.nome, 1);

        });

    card
        .querySelector('[data-acao="remover"]')
        .addEventListener("click", () => {

            removerPedido(item.nome);

        });

    return card;

}


function renderizarPedidos() {

    const pedidos =
        buscarPedidos();

    listaPedidos.innerHTML =
        "";

    const temPedidos =
        pedidos.length > 0;

    pedidoVazio.style.display =
        temPedidos ? "none" : "flex";

    document
        .querySelector(".containerPedidos")
        .style
        .display =
            temPedidos ? "grid" : "none";

    pedidos.forEach((item) => {

        listaPedidos.appendChild(
            criarCardPedido(item)
        );

    });

    const totais =
        calcularTotais(pedidos);

    totalItens.textContent =
        totais.itens;

    valorTotal.textContent =
        formatarMoeda(totais.valor);

}


btnLimpar.addEventListener("click", () => {

    salvarPedidos([]);
    renderizarPedidos();

});


formDadosPedido.addEventListener("submit", enviarPedidoWhatsApp);


renderizarPedidos();
