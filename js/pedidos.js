/* ==================================================
   PEDIDOS.JS
   PIZZARIA DO AMIGÃO
================================================== */


/* ==================================================
   CONFIGURAÇÕES
================================================== */

const chavePedidos = "meusPedidos";

/*
   Número do WhatsApp da pizzaria
*/
const numeroWhatsApp = "8587144716";


/* ==================================================
   ELEMENTOS DO HTML
================================================== */

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
   CONVERTER PREÇO PARA NÚMERO
================================================== */

function converterPreco(valor) {

    if (typeof valor === "number") {

        return Number.isFinite(valor)
            ? valor
            : 0;

    }


    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return 0;

    }


    let texto =
        String(valor).trim();


    texto =
        texto
            .replace(/R\$/gi, "")
            .trim();


    /*
       Exemplo:
       1.043,00
       vira:
       1043.00
    */

    if (
        texto.includes(".") &&
        texto.includes(",")
    ) {

        texto =
            texto
                .replace(/\./g, "")
                .replace(",", ".");

    }


    /*
       Exemplo:
       43,00
       vira:
       43.00
    */

    else if (
        texto.includes(",")
    ) {

        texto =
            texto.replace(",", ".");

    }


    /*
       Remover caracteres inválidos
    */

    texto =
        texto.replace(
            /[^0-9.-]/g,
            ""
        );


    const numero =
        Number(texto);


    return Number.isFinite(numero)
        ? numero
        : 0;

}


/* ==================================================
   PEGAR PREÇO DO ITEM
================================================== */

function obterPrecoItem(item) {

    /*
       Preço atual
    */

    if (
        item.preco !== undefined &&
        item.preco !== null
    ) {

        return converterPreco(
            item.preco
        );

    }


    /*
       Formato antigo
    */

    if (
        item.precoNumero !== undefined &&
        item.precoNumero !== null
    ) {

        return converterPreco(
            item.precoNumero
        );

    }


    /*
       Preço base
    */

    if (
        item.precoBase !== undefined &&
        item.precoBase !== null
    ) {

        return converterPreco(
            item.precoBase
        );

    }


    return 0;

}


/* ==================================================
   BUSCAR PEDIDOS
================================================== */

function buscarPedidos() {

    try {

        const dados =
            localStorage.getItem(
                chavePedidos
            );


        if (!dados) {

            return [];

        }


        const pedidos =
            JSON.parse(dados);


        if (!Array.isArray(pedidos)) {

            return [];

        }


        /*
           Normalizar pedidos
        */

        return pedidos.map(
            (item, index) => {

                const preco =
                    obterPrecoItem(item);


                return {

                    ...item,

                    /*
                       Garantir ID
                    */

                    id:
                        item.id ||
                        `${Date.now()}-${index}`,

                    /*
                       Garantir quantidade
                    */

                    quantidade:
                        Math.max(
                            1,
                            Number(
                                item.quantidade
                            ) || 1
                        ),

                    /*
                       Garantir preço
                    */

                    preco:
                        preco,

                    precoNumero:
                        preco

                };

            }
        );

    }

    catch (erro) {

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

    const pedidosCorrigidos =
        pedidos.map(
            (item) => {

                const preco =
                    obterPrecoItem(item);


                return {

                    ...item,

                    preco:
                        preco,

                    precoNumero:
                        preco,

                    quantidade:
                        Math.max(
                            1,
                            Number(
                                item.quantidade
                            ) || 1
                        )

                };

            }
        );


    localStorage.setItem(
        chavePedidos,
        JSON.stringify(
            pedidosCorrigidos
        )
    );

}


/* ==================================================
   FORMATAR MOEDA
================================================== */

function formatarMoeda(valor) {

    const numero =
        converterPreco(valor);


    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* ==================================================
   CALCULAR TOTAL
================================================== */

function calcularTotais(pedidos) {

    return pedidos.reduce(
        (totais, item) => {

            const quantidade =
                Math.max(
                    1,
                    Number(
                        item.quantidade
                    ) || 1
                );


            const preco =
                obterPrecoItem(item);


            /*
               SOMAR QUANTIDADE
            */

            totais.itens +=
                quantidade;


            /*
               SOMAR VALOR
            */

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
   ESCAPAR HTML
================================================== */

function escaparHTML(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==================================================
   BUSCAR DADOS DO CLIENTE
================================================== */

function buscarDadosCliente() {

    const pagamentoSelecionado =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    function pegarCampo(id) {

        const campo =
            document.getElementById(id);


        if (!campo) {

            return "";

        }


        return campo.value.trim();

    }


    return {

        nome:
            pegarCampo("nomeCliente"),

        cep:
            pegarCampo("cepCliente"),

        rua:
            pegarCampo("ruaCliente"),

        numero:
            pegarCampo("numeroCliente"),

        bairro:
            pegarCampo("bairroCliente"),

        cidade:
            pegarCampo("cidadeCliente"),

        estado:
            pegarCampo("estadoCliente"),

        complemento:
            pegarCampo("complementoCliente"),

        pagamento:
            pagamentoSelecionado
                ? pagamentoSelecionado.value
                : ""

    };

}


/* ==================================================
   MONTAR ITENS DO WHATSAPP
================================================== */

function montarItensWhatsApp(pedidos) {

    return pedidos
        .map(
            (item) => {

                const quantidade =
                    Math.max(
                        1,
                        Number(
                            item.quantidade
                        ) || 1
                    );


                const preco =
                    obterPrecoItem(item);


                const subtotal =
                    preco * quantidade;


                let texto =
                    `- ${quantidade}x ${item.nome}`;


                /*
                   TAMANHO
                */

                if (item.tamanho) {

                    texto +=
                        `\n  Tamanho: ${item.tamanho}`;

                }


                /*
                   SABOR DA PROMOÇÃO
                */

                if (item.saborPizza) {

                    texto +=
                        `\n  Pizza escolhida: ${item.saborPizza}`;

                }


                /*
                   BORDA
                */

                if (item.borda) {

                    texto +=
                        `\n  Borda: ${item.borda}`;

                }


                /*
                   OBSERVAÇÃO
                */

                if (item.observacao) {

                    texto +=
                        `\n  Observação: ${item.observacao}`;

                }


                /*
                   VALOR
                */

                texto +=
                    `\n  Valor: ${formatarMoeda(subtotal)}`;


                return texto;

            }
        )
        .join("\n\n");

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
        montarItensWhatsApp(pedidos);


    /*
       COMPLEMENTO
    */

    const complemento =
        dadosCliente.complemento
            ? `\nComplemento: ${dadosCliente.complemento}`
            : "";


    /* ==================================================
   PAGAMENTO
================================================== */

    let pagamento = "Não informado";

    if (dadosCliente.pagamento === "Pix") {

        pagamento = "Pix - confirmar pagamento";

    }

    else if (dadosCliente.pagamento === "Dinheiro") {

        pagamento = "Dinheiro";

    }

    else if (dadosCliente.pagamento === "Débito") {

        pagamento = "Cartão de Débito";

    }

    else if (dadosCliente.pagamento === "Crédito") {

        pagamento = "Cartão de Crédito";

    }


    /*
       MENSAGEM
    */

    return `🍕 *NOVO PEDIDO - PIZZARIA DO AMIGÃO*

*CLIENTE*
Nome: ${dadosCliente.nome}

*ENDEREÇO*
CEP: ${dadosCliente.cep}
Rua: ${dadosCliente.rua}
Número: ${dadosCliente.numero}
Bairro: ${dadosCliente.bairro}
Cidade: ${dadosCliente.cidade}
Estado: ${dadosCliente.estado}${complemento}

*PAGAMENTO*
${pagamento}

*PEDIDO*

${itens}

*TOTAL*
${formatarMoeda(totais.valor)}

Obrigado!`;

}


/* ==================================================
   ENVIAR PEDIDO PELO WHATSAPP
================================================== */

function enviarPedidoWhatsApp(event) {

    event.preventDefault();


    const pedidos =
        buscarPedidos();


    if (
        pedidos.length === 0
    ) {

        alert(
            "Você ainda não adicionou nenhum produto ao pedido."
        );

        return;

    }


    const dadosCliente =
        buscarDadosCliente();


    /*
       VALIDAR CEP
    */

    const campoCep =
        document.getElementById(
            "cepCliente"
        );


    const cepNumeros =
        dadosCliente.cep.replace(
            /\D/g,
            ""
        );


    if (
        cepNumeros.length !== 8
    ) {

        alert(
            "Digite um CEP válido antes de finalizar o pedido."
        );


        if (campoCep) {

            campoCep.focus();

        }


        return;

    }


    /*
       VALIDAR ENDEREÇO
    */

    if (
        !dadosCliente.rua ||
        !dadosCliente.bairro ||
        !dadosCliente.cidade ||
        !dadosCliente.estado
    ) {

        alert(
            "Consulte um CEP válido antes de finalizar o pedido."
        );


        if (campoCep) {

            campoCep.focus();

        }


        return;

    }


    /*
       VALIDAR PAGAMENTO
    */

    if (
        !dadosCliente.pagamento
    ) {

        alert(
            "Escolha uma forma de pagamento."
        );

        return;

    }


    /*
       MONTAR MENSAGEM
    */

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
    id,
    mudanca
) {

    const pedidos =
        buscarPedidos();


    const novosPedidos =
        pedidos
            .map(
                (item) => {

                    if (
                        String(item.id) ===
                        String(id)
                    ) {

                        item.quantidade =
                            (
                                Number(
                                    item.quantidade
                                ) || 1
                            ) + mudanca;

                    }


                    return item;

                }
            )
            .filter(
                (item) => {

                    return (
                        Number(
                            item.quantidade
                        ) || 0
                    ) > 0;

                }
            );


    salvarPedidos(
        novosPedidos
    );


    renderizarPedidos();

    atualizarQuantidadeCarrinho();

}


/* ==================================================
   REMOVER PEDIDO
================================================== */

function removerPedido(id) {

    const pedidos =
        buscarPedidos();


    const novosPedidos =
        pedidos.filter(
            (item) => {

                return String(item.id) !==
                    String(id);

            }
        );


    salvarPedidos(
        novosPedidos
    );


    renderizarPedidos();

    atualizarQuantidadeCarrinho();

}


/* ==================================================
   CRIAR CARD DO PEDIDO
================================================== */

function criarCardPedido(item) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "cardPedido";


    const preco =
        obterPrecoItem(item);


    const quantidade =
        Math.max(
            1,
            Number(
                item.quantidade
            ) || 1
        );


    const imagem =
        escaparHTML(
            item.imagem ||
            "/img/logo.png"
        );


    const nome =
        escaparHTML(
            item.nome ||
            "Produto"
        );


    const descricao =
        escaparHTML(
            item.descricao ||
            ""
        );


    /*
       DETALHES
    */

    let detalhesPizza =
        "";


    /*
       SABOR DA PROMOÇÃO
    */

    if (item.saborPizza) {

        detalhesPizza += `

            <p class="detalhePedido">

                <strong>
                    Pizza escolhida:
                </strong>

                ${escaparHTML(
            item.saborPizza
        )}

            </p>

        `;

    }


    /*
       TAMANHO
    */

    if (item.tamanho) {

        detalhesPizza += `

            <p class="detalhePedido">

                <strong>
                    Tamanho:
                </strong>

                ${escaparHTML(
            item.tamanho
        )}

            </p>

        `;

    }


    /*
       BORDA
    */

    if (item.borda) {

        detalhesPizza += `

            <p class="detalhePedido">

                <strong>
                    Borda:
                </strong>

                ${escaparHTML(
            item.borda
        )}

            </p>

        `;

    }


    /*
       OBSERVAÇÃO
    */

    if (item.observacao) {

        detalhesPizza += `

            <p class="detalhePedido">

                <strong>
                    Observação:
                </strong>

                ${escaparHTML(
            item.observacao
        )}

            </p>

        `;

    }


    /*
       CARD
    */

    card.innerHTML = `

        <img
            src="${imagem}"
            alt="${nome}"
            onerror="this.src='/img/logo.png'"
        >


        <div class="infoPedido">

            <h2>
                ${nome}
            </h2>


            <p>
                ${descricao}
            </p>


            ${detalhesPizza}


            <strong>
                ${formatarMoeda(preco)}
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
                    ${quantidade}
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


    /*
       DIMINUIR
    */

    const btnDiminuir =
        card.querySelector(
            '[data-acao="diminuir"]'
        );


    if (btnDiminuir) {

        btnDiminuir.addEventListener(
            "click",
            () => {

                alterarQuantidade(
                    item.id,
                    -1
                );

            }
        );

    }


    /*
       AUMENTAR
    */

    const btnAumentar =
        card.querySelector(
            '[data-acao="aumentar"]'
        );


    if (btnAumentar) {

        btnAumentar.addEventListener(
            "click",
            () => {

                alterarQuantidade(
                    item.id,
                    1
                );

            }
        );

    }


    /*
       REMOVER
    */

    const btnRemover =
        card.querySelector(
            '[data-acao="remover"]'
        );


    if (btnRemover) {

        btnRemover.addEventListener(
            "click",
            () => {

                removerPedido(
                    item.id
                );

            }
        );

    }


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


    /*
       MOSTRAR / ESCONDER
       CARRINHO VAZIO
    */

    if (pedidoVazio) {

        pedidoVazio.style.display =
            temPedidos
                ? "none"
                : "flex";

    }


    /*
       CONTAINER DOS PEDIDOS
    */

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


    /*
       CRIAR CARDS
    */

    pedidos.forEach(
        (item) => {

            listaPedidos.appendChild(
                criarCardPedido(
                    item
                )
            );

        }
    );


    /*
       CALCULAR TOTAL
    */

    const totais =
        calcularTotais(
            pedidos
        );


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
                    (
                        Number(
                            item.quantidade
                        ) || 0
                    );

            },
            0
        );


    contador.textContent =
        quantidade;


    if (
        quantidade === 0
    ) {

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


    /*
       VERIFICAR SE OS CAMPOS EXISTEM
    */

    if (
        !campoCep ||
        !rua ||
        !bairro ||
        !cidade ||
        !estado
    ) {

        console.error(
            "Campos do endereço não encontrados."
        );

        return;

    }


    const cep =
        campoCep.value.replace(
            /\D/g,
            ""
        );


    /*
       CEP INCOMPLETO
    */

    if (
        cep.length !== 8
    ) {

        campoCep.setCustomValidity(
            "Digite um CEP válido."
        );


        if (mensagem) {

            mensagem.textContent =
                "Digite um CEP válido com 8 números.";

        }


        return;

    }


    /*
       CONSULTANDO
    */

    if (mensagem) {

        mensagem.textContent =
            "Consultando CEP...";

    }


    campoCep.setCustomValidity("");


    try {

        const resposta =
            await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar o CEP."
            );

        }


        const dados =
            await resposta.json();


        /*
           CEP NÃO ENCONTRADO
        */

        if (dados.erro) {

            rua.value = "";

            bairro.value = "";

            cidade.value = "";

            estado.value = "";


            campoCep.setCustomValidity(
                "CEP não encontrado."
            );


            if (mensagem) {

                mensagem.textContent =
                    "CEP não encontrado.";

            }


            return;

        }


        /*
           PREENCHER ENDEREÇO
        */

        rua.value =
            dados.logradouro || "";

        bairro.value =
            dados.bairro || "";

        cidade.value =
            dados.localidade || "";

        estado.value =
            dados.uf || "";


        /*
           SUCESSO
        */

        campoCep.setCustomValidity("");


        if (mensagem) {

            mensagem.textContent =
                "✓ CEP encontrado.";

        }

    }

    catch (erro) {

        console.error(
            "Erro ao consultar CEP:",
            erro
        );


        campoCep.setCustomValidity(
            "Não foi possível consultar o CEP."
        );


        if (mensagem) {

            mensagem.textContent =
                "Não foi possível consultar o CEP.";

        }

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


            /*
               MÁXIMO 8 NÚMEROS
            */

            valor =
                valor.substring(
                    0,
                    8
                );


            /*
               FORMATO:

               00000-000
            */

            if (
                valor.length > 5
            ) {

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


            /*
               LIMPAR VALIDAÇÃO
            */

            this.setCustomValidity("");


            /*
               LIMPAR MENSAGEM
            */

            const mensagem =
                document.getElementById(
                    "mensagemCep"
                );


            if (mensagem) {

                mensagem.textContent =
                    "";

            }


            /*
               PEGAR SOMENTE NÚMEROS
            */

            const cepNumeros =
                valor.replace(
                    /\D/g,
                    ""
                );


            /*
               CONSULTAR AUTOMATICAMENTE
               QUANDO TIVER 8 NÚMEROS
            */

            if (
                cepNumeros.length === 8
            ) {

                buscarCep();

            }

        }
    );

}


/* ==================================================
   LIMPAR ENDEREÇO SE CEP FOR ALTERADO
================================================== */

if (campoCep) {

    campoCep.addEventListener(
        "change",
        () => {

            const cep =
                campoCep.value.replace(
                    /\D/g,
                    ""
                );


            if (
                cep.length !== 8
            ) {

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


                if (rua) {
                    rua.value = "";
                }

                if (bairro) {
                    bairro.value = "";
                }

                if (cidade) {
                    cidade.value = "";
                }

                if (estado) {
                    estado.value = "";
                }

            }

        }
    );

}


/* ==================================================
   ATUALIZAR AO ABRIR
================================================== */

atualizarQuantidadeCarrinho();


/* ==================================================
   ATUALIZAR QUANDO OUTRA ABA ALTERAR
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