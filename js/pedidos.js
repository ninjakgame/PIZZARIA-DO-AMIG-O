const chavePedidos =
    "meusPedidos";


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


const checkoutPedido =
    document.getElementById("checkoutPedido");


const formCheckout =
    document.getElementById("formCheckout");


const btnVoltarCheckout =
    document.getElementById("btnVoltarCheckout");


const btnProximoCheckout =
    document.getElementById("btnProximoCheckout");


const btnConfirmarCompra =
    document.getElementById("btnConfirmarCompra");


const confirmacaoPedido =
    document.getElementById("confirmacaoPedido");


let etapaAtual =
    1;


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
        telefone: document.getElementById("telefoneCliente").value.trim(),
        endereco: document.getElementById("enderecoCliente").value.trim(),
        numero: document.getElementById("numeroCliente").value.trim(),
        bairro: document.getElementById("bairroCliente").value.trim(),
        complemento: document.getElementById("complementoCliente").value.trim(),
        pagamento: pagamentoSelecionado ? pagamentoSelecionado.value : ""
    };

}


function validarEtapaAtual() {

    const etapa =
        document.querySelector(`.etapaCheckout[data-etapa="${etapaAtual}"]`);

    const camposObrigatorios =
        etapa.querySelectorAll("[required]");

    for (const campo of camposObrigatorios) {

        if (!campo.checkValidity()) {

            campo.reportValidity();
            return false;

        }

    }

    if (etapaAtual === 2) {

        const pagamentoSelecionado =
            document.querySelector('input[name="pagamento"]:checked');

        if (!pagamentoSelecionado) {

            alert("Escolha o tipo de pagamento.");
            return false;

        }

    }

    return true;

}


function montarConfirmacao() {

    const pedidos =
        buscarPedidos();

    const dados =
        buscarDadosCliente();

    const totais =
        calcularTotais(pedidos);

    const itens =
        pedidos.map((item) => {

            const subtotal =
                formatarMoeda(item.precoNumero * item.quantidade);

            return `
                <li>
                    <span>${item.quantidade}x ${item.nome}</span>
                    <strong>${subtotal}</strong>
                </li>
            `;

        }).join("");

    confirmacaoPedido.innerHTML = `
        <div class="blocoConfirmacao">
            <h3>Cliente</h3>
            <p>${dados.nome}</p>
            <p>${dados.telefone}</p>
        </div>

        <div class="blocoConfirmacao">
            <h3>Entrega</h3>
            <p>${dados.endereco}, ${dados.numero}</p>
            <p>${dados.bairro}</p>
            <p>${dados.complemento || "Sem complemento"}</p>
        </div>

        <div class="blocoConfirmacao">
            <h3>Pagamento</h3>
            <p>${dados.pagamento}</p>
        </div>

        <div class="blocoConfirmacao">
            <h3>Itens</h3>
            <ul>${itens}</ul>
        </div>

        <div class="totalConfirmacao">
            <span>Total</span>
            <strong>${formatarMoeda(totais.valor)}</strong>
        </div>
    `;

}


function atualizarCheckout() {

    document.querySelectorAll(".etapaCheckout").forEach((etapa) => {

        etapa.classList.toggle(
            "ativa",
            Number(etapa.dataset.etapa) === etapaAtual
        );

    });

    document.querySelectorAll(".passo").forEach((passo) => {

        passo.classList.toggle(
            "ativo",
            Number(passo.dataset.passo) <= etapaAtual
        );

    });

    btnVoltarCheckout.style.display =
        etapaAtual === 1 ? "none" : "inline-flex";

    btnProximoCheckout.style.display =
        etapaAtual === 3 ? "none" : "inline-flex";

    btnConfirmarCompra.style.display =
        etapaAtual === 3 ? "inline-flex" : "none";

    if (etapaAtual === 3) {

        montarConfirmacao();

    }

}


function mostrarCheckout() {

    etapaAtual =
        1;

    checkoutPedido.classList.add("ativo");
    atualizarCheckout();

    checkoutPedido.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

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
    atualizarCheckout();

}


function removerPedido(nome) {

    const pedidos =
        buscarPedidos().filter((item) => {

            return item.nome !== nome;

        });

    salvarPedidos(pedidos);
    renderizarPedidos();
    atualizarCheckout();

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

    checkoutPedido.classList.toggle(
        "ativo",
        temPedidos && checkoutPedido.classList.contains("ativo")
    );

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
    formCheckout.reset();
    renderizarPedidos();

});


btnFinalizar.addEventListener("click", () => {

    const pedidos =
        buscarPedidos();

    if (pedidos.length === 0) {

        return;

    }

    mostrarCheckout();

});


btnProximoCheckout.addEventListener("click", () => {

    if (!validarEtapaAtual()) {

        return;

    }

    etapaAtual += 1;
    atualizarCheckout();

});


btnVoltarCheckout.addEventListener("click", () => {

    etapaAtual -= 1;
    atualizarCheckout();

});


formCheckout.addEventListener("submit", (event) => {

    event.preventDefault();

    alert("Compra confirmada com sucesso!");
    salvarPedidos([]);
    formCheckout.reset();
    renderizarPedidos();

});


renderizarPedidos();
