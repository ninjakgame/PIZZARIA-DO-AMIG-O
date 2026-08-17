const chavePedidos = "meusPedidos";

const numeroWhatsApp = "558587144716";

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


/* ==================================================
   BUSCAR PEDIDOS
================================================== */

function buscarPedidos() {

    try {

        return JSON.parse(
            localStorage.getItem(chavePedidos)
        ) || [];

    } catch (erro) {

        console.error(
            "Erro ao buscar pedidos:",
            erro
        );

        return [];

    }

}


/* ==================================================
   SALVAR PEDIDOS
================================================== */

function salvarPedidos(pedidos) {

    localStorage.setItem(
        chavePedidos,
        JSON.stringify(pedidos)
    );

}


/* ==================================================
   FORMATAR MOEDA
================================================== */

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* ==================================================
   CALCULAR TOTAIS
================================================== */

function calcularTotais(pedidos) {

    return pedidos.reduce(

        (totais, item) => {

            const quantidade =
                Number(item.quantidade) || 0;

            const preco =
                Number(item.precoNumero) || 0;

            totais.itens += quantidade;

            totais.valor +=
                preco * quantidade;

            return totais;

        },

        {
            itens: 0,
            valor: 0
        }

    );

}


/* ==================================================
   BUSCAR DADOS DO CLIENTE
================================================== */

function buscarDadosCliente() {

    const pagamentoSelecionado =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    return {

        nome:
            document
                .getElementById("nomeCliente")
                .value
                .trim(),

        cep:
            document
                .getElementById("cepCliente")
                .value
                .trim(),

        rua:
            document
                .getElementById("ruaCliente")
                .value
                .trim(),

        numero:
            document
                .getElementById("numeroCliente")
                .value
                .trim(),

        bairro:
            document
                .getElementById("bairroCliente")
                .value
                .trim(),

        cidade:
            document
                .getElementById("cidadeCliente")
                .value
                .trim(),

        estado:
            document
                .getElementById("estadoCliente")
                .value
                .trim(),

        complemento:
            document
                .getElementById("complementoCliente")
                .value
                .trim(),

        pagamento:
            pagamentoSelecionado
                ? pagamentoSelecionado.value
                : ""

    };

}


/* ==================================================
   MONTAR MENSAGEM DO WHATSAPP
================================================== */

function montarMensagemWhatsApp(
    pedidos,
    dadosCliente
) {

    const totais =
        calcularTotais(pedidos);


    const itens =
        pedidos
            .map((item) => {

                const quantidade =
                    Number(item.quantidade) || 0;

                const preco =
                    Number(item.precoNumero) || 0;

                const subtotal =
                    preco * quantidade;


                return `- ${quantidade}x ${item.nome} - ${formatarMoeda(subtotal)}`;

            })
            .join("\n");


    const complemento =
        dadosCliente.complemento
            ? `\nComplemento: ${dadosCliente.complemento}`
            : "";


    /* ==================================================
       PAGAMENTO
    ================================================== */

    let pagamento;


    if (dadosCliente.pagamento === "Pix") {

        pagamento =
            "Pix - confirmar pagamento";

    }

    else if (
        dadosCliente.pagamento === "Dinheiro"
    ) {

        pagamento =
            "Dinheiro";

    }

    else if (
        dadosCliente.pagamento === "Debito" ||
        dadosCliente.pagamento === "Débito"
    ) {

        pagamento =
            "Cartão de Débito";

    }

    else if (
        dadosCliente.pagamento === "Credito" ||
        dadosCliente.pagamento === "Crédito"
    ) {

        pagamento =
            "Cartão de Crédito";

    }

    else {

        pagamento =
            "Não informado";

    }


    /* ==================================================
       MENSAGEM
    ================================================== */

    return `Queria fazer o seguinte pedido:

Nome: ${dadosCliente.nome}

Endereço:
CEP: ${dadosCliente.cep}
Rua: ${dadosCliente.rua}
Número: ${dadosCliente.numero}
Bairro: ${dadosCliente.bairro}
Cidade: ${dadosCliente.cidade}
Estado: ${dadosCliente.estado}${complemento}

Forma de pagamento:
${pagamento}

Pedido:

${itens}

Total:
${formatarMoeda(totais.valor)}`;

}


/* ==================================================
   ENVIAR PEDIDO PELO WHATSAPP
================================================== */

function enviarPedidoWhatsApp(event) {

    event.preventDefault();


    const pedidos =
        buscarPedidos();


    if (pedidos.length === 0) {

        alert(
            "Você ainda não adicionou nenhum produto ao pedido."
        );

        return;

    }


    const dadosCliente =
        buscarDadosCliente();


    /* ==================================================
       VALIDAR CEP
    ================================================== */

    const campoCep =
        document.getElementById("cepCliente");


    const cepNumeros =
        dadosCliente.cep.replace(
            /\D/g,
            ""
        );


    if (cepNumeros.length !== 8) {

        alert(
            "Digite um CEP válido antes de finalizar o pedido."
        );

        campoCep.focus();

        return;

    }


    /* ==================================================
       VERIFICAR SE O ENDEREÇO FOI ENCONTRADO
    ================================================== */

    if (
        !dadosCliente.rua ||
        !dadosCliente.bairro ||
        !dadosCliente.cidade ||
        !dadosCliente.estado
    ) {

        alert(
            "Consulte um CEP válido antes de finalizar o pedido."
        );

        campoCep.focus();

        return;

    }


    /* ==================================================
       MENSAGEM
    ================================================== */

    const mensagem =
        encodeURIComponent(

            montarMensagemWhatsApp(
                pedidos,
                dadosCliente
            )

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


/* ==================================================
   ALTERAR QUANTIDADE
================================================== */

function alterarQuantidade(
    nome,
    mudanca
) {

    const pedidos =
        buscarPedidos()
            .map((item) => {

                if (item.nome === nome) {

                    item.quantidade =
                        (Number(item.quantidade) || 0)
                        + mudanca;

                }

                return item;

            })
            .filter((item) => {

                return Number(item.quantidade) > 0;

            });


    salvarPedidos(pedidos);

    renderizarPedidos();

    atualizarQuantidadeCarrinho();

}


/* ==================================================
   REMOVER PEDIDO
================================================== */

function removerPedido(nome) {

    const pedidos =
        buscarPedidos()
            .filter((item) => {

                return item.nome !== nome;

            });


    salvarPedidos(pedidos);

    renderizarPedidos();

    atualizarQuantidadeCarrinho();

}


/* ==================================================
   CRIAR CARD DO PEDIDO
================================================== */

function criarCardPedido(item) {

    const card =
        document.createElement("article");


    card.className =
        "cardPedido";


    card.innerHTML = `

        <img
            src="${item.imagem}"
            alt="${item.nome}"
        >


        <div class="infoPedido">

            <h2>
                ${item.nome}
            </h2>

            <p>
                ${item.descricao || ""}
            </p>

            <strong>
                ${formatarMoeda(item.precoNumero)}
            </strong>

        </div>


        <div class="acoesPedido">

            <div class="controleQuantidade">

                <button
                    type="button"
                    data-acao="diminuir"
                    aria-label="Diminuir quantidade"
                >
                    -
                </button>


                <span>
                    ${item.quantidade}
                </span>


                <button
                    type="button"
                    data-acao="aumentar"
                    aria-label="Aumentar quantidade"
                >
                    +
                </button>

            </div>


            <button
                type="button"
                class="btnRemover"
                data-acao="remover"
            >
                Remover
            </button>

        </div>

    `;


    /* ==================================================
       DIMINUIR
    ================================================== */

    card
        .querySelector(
            '[data-acao="diminuir"]'
        )
        .addEventListener(
            "click",
            () => {

                alterarQuantidade(
                    item.nome,
                    -1
                );

            }
        );


    /* ==================================================
       AUMENTAR
    ================================================== */

    card
        .querySelector(
            '[data-acao="aumentar"]'
        )
        .addEventListener(
            "click",
            () => {

                alterarQuantidade(
                    item.nome,
                    1
                );

            }
        );


    /* ==================================================
       REMOVER
    ================================================== */

    card
        .querySelector(
            '[data-acao="remover"]'
        )
        .addEventListener(
            "click",
            () => {

                removerPedido(
                    item.nome
                );

            }
        );


    return card;

}


/* ==================================================
   RENDERIZAR PEDIDOS
================================================== */

function renderizarPedidos() {

    if (!listaPedidos) {
        return;
    }


    const pedidos =
        buscarPedidos();


    listaPedidos.innerHTML =
        "";


    const temPedidos =
        pedidos.length > 0;


    if (pedidoVazio) {

        pedidoVazio.style.display =
            temPedidos
                ? "none"
                : "flex";

    }


    const container =
        document.querySelector(
            ".containerPedidos"
        );


    if (container) {

        container.style.display =
            temPedidos
                ? "grid"
                : "none";

    }


    pedidos.forEach((item) => {

        listaPedidos.appendChild(
            criarCardPedido(item)
        );

    });


    const totais =
        calcularTotais(pedidos);


    if (totalItens) {

        totalItens.textContent =
            totais.itens;

    }


    if (valorTotal) {

        valorTotal.textContent =
            formatarMoeda(
                totais.valor
            );

    }

}


/* ==================================================
   LIMPAR PEDIDOS
================================================== */

if (btnLimpar) {

    btnLimpar.addEventListener(
        "click",
        () => {

            const confirmar =
                confirm(
                    "Deseja realmente limpar todos os pedidos?"
                );


            if (!confirmar) {
                return;
            }


            salvarPedidos([]);

            renderizarPedidos();

            atualizarQuantidadeCarrinho();

        }
    );

}


/* ==================================================
   FINALIZAR PEDIDO
================================================== */

if (formDadosPedido) {

    formDadosPedido.addEventListener(
        "submit",
        enviarPedidoWhatsApp
    );

}


/* ==================================================
   ATUALIZAR QUANTIDADE DO CARRINHO
================================================== */

function atualizarQuantidadeCarrinho() {

    const contador =
        document.getElementById(
            "quantidadeCarrinho"
        );


    if (!contador) {
        return;
    }


    const pedidos =
        buscarPedidos();


    const quantidade =
        pedidos.reduce(
            (total, item) => {

                return total +
                    (Number(item.quantidade) || 0);

            },
            0
        );


    contador.textContent =
        quantidade;


    if (quantidade === 0) {

        contador.classList.add(
            "vazio"
        );

    }

    else {

        contador.classList.remove(
            "vazio"
        );

    }

}


/* ==================================================
   BUSCAR CEP
================================================== */

async function buscarCep() {

    const campoCep =
        document.getElementById(
            "cepCliente"
        );

    const mensagem =
        document.getElementById(
            "mensagemCep"
        );

    const rua =
        document.getElementById(
            "ruaCliente"
        );

    const bairro =
        document.getElementById(
            "bairroCliente"
        );

    const cidade =
        document.getElementById(
            "cidadeCliente"
        );

    const estado =
        document.getElementById(
            "estadoCliente"
        );


    if (
        !campoCep ||
        !rua ||
        !bairro ||
        !cidade ||
        !estado
    ) {

        return;

    }


    const cep =
        campoCep.value.replace(
            /\D/g,
            ""
        );


    /* ==================================================
       LIMPAR ENDEREÇO
    ================================================== */

    rua.value = "";
    bairro.value = "";
    cidade.value = "";
    estado.value = "";


    campoCep.setCustomValidity("");


    /* ==================================================
       CEP INCOMPLETO
    ================================================== */

    if (cep.length !== 8) {

        if (mensagem) {

            mensagem.textContent =
                "Digite um CEP válido com 8 números.";

            mensagem.style.color =
                "#8b1e1e";

        }


        campoCep.setCustomValidity(
            "Digite um CEP válido."
        );

        return;

    }


    if (mensagem) {

        mensagem.textContent =
            "Consultando CEP...";

        mensagem.style.color =
            "#666666";

    }


    try {

        const resposta =
            await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar CEP."
            );

        }


        const dados =
            await resposta.json();


        /* ==================================================
           CEP NÃO ENCONTRADO
        ================================================== */

        if (dados.erro) {

            if (mensagem) {

                mensagem.textContent =
                    "CEP não encontrado.";

                mensagem.style.color =
                    "#8b1e1e";

            }


            campoCep.setCustomValidity(
                "CEP não encontrado."
            );

            return;

        }


        /* ==================================================
           PREENCHER ENDEREÇO
        ================================================== */

        rua.value =
            dados.logradouro || "";

        bairro.value =
            dados.bairro || "";

        cidade.value =
            dados.localidade || "";

        estado.value =
            dados.uf || "";


        /* ==================================================
           CEP VÁLIDO
        ================================================== */

        if (mensagem) {

            mensagem.textContent =
                "✓ CEP encontrado.";

            mensagem.style.color =
                "#008000";

        }


        campoCep.setCustomValidity("");


    }

    catch (erro) {

        console.error(
            "Erro ao consultar CEP:",
            erro
        );


        if (mensagem) {

            mensagem.textContent =
                "Não foi possível consultar o CEP.";

            mensagem.style.color =
                "#8b1e1e";

        }


        campoCep.setCustomValidity(
            "Não foi possível validar o CEP."
        );

    }

}


/* ==================================================
   MÁSCARA DO CEP
================================================== */

const campoCep =
    document.getElementById(
        "cepCliente"
    );


if (campoCep) {

    campoCep.addEventListener(
        "input",
        function () {

            let valor =
                this.value.replace(
                    /\D/g,
                    ""
                );


            /* Máximo 8 números */

            if (valor.length > 8) {

                valor =
                    valor.substring(
                        0,
                        8
                    );

            }


            /* Adicionar hífen */

            if (valor.length > 5) {

                valor =
                    valor.substring(
                        0,
                        5
                    )
                    + "-"
                    + valor.substring(
                        5
                    );

            }


            this.value =
                valor;


            /* ==================================================
               LIMPAR ERRO ENQUANTO DIGITA
            ================================================== */

            this.setCustomValidity("");


            const mensagem =
                document.getElementById(
                    "mensagemCep"
                );


            if (mensagem) {

                mensagem.textContent =
                    "";

            }


            /* ==================================================
               CONSULTAR QUANDO COMPLETAR
            ================================================== */

            if (
                valor.replace(
                    /\D/g,
                    ""
                ).length === 8
            ) {

                buscarCep();

            }

        }
    );

}


/* ==================================================
   ATUALIZA CARRINHO AO ABRIR
================================================== */

atualizarQuantidadeCarrinho();


/* ==================================================
   ATUALIZA CARRINHO EM OUTRAS ABAS
================================================== */

window.addEventListener(
    "storage",
    function () {

        renderizarPedidos();

        atualizarQuantidadeCarrinho();

    }
);


/* ==================================================
   INICIAR
================================================== */

renderizarPedidos();