/* ==================================================
   CONFIGURAÇÕES
================================================== */

const chavePedidos = "meusPedidos";

/*
   Número do WhatsApp da pizzaria
*/
const numeroWhatsApp = "558587144716";


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

    /*
       Se já for número
    */

    if (typeof valor === "number") {

        return Number.isFinite(valor)
            ? valor
            : 0;

    }


    /*
       Se não existir
    */

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return 0;

    }


    /*
       Converter texto
       Exemplos:

       "43"
       "43.00"
       "43,00"
       "R$ 43,00"
       "R$ 1.043,00"
    */

    let texto =
        String(valor)
            .trim();


    texto =
        texto
            .replace(/R\$/gi, "")
            .trim();


    /*
       Se tiver ponto e vírgula:

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
       Se tiver somente vírgula:

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
       Remover qualquer caractere
       que não seja número, ponto ou sinal
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
       NOVO FORMATO
       usado pelo principal.js
    */

    if (
        item.preco !== undefined &&
        item.preco !== null
    ) {

        const preco =
            converterPreco(
                item.preco
            );

        if (preco >= 0) {

            return preco;

        }

    }


    /*
       FORMATO ANTIGO
    */

    if (
        item.precoNumero !== undefined &&
        item.precoNumero !== null
    ) {

        const preco =
            converterPreco(
                item.precoNumero
            );

        if (preco >= 0) {

            return preco;

        }

    }


    /*
       PREÇO BASE
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
           Normalizar os pedidos
           para evitar valores inválidos
        */

        return pedidos.map(
            (item) => {

                const preco =
                    obterPrecoItem(
                        item
                    );


                return {

                    ...item,

                    quantidade:
                        Math.max(
                            1,
                            Number(
                                item.quantidade
                            ) || 1
                        ),

                    preco:
                        preco,

                    precoNumero:
                        preco

                };

            }
        );

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

    /*
       Antes de salvar,
       garantir que todos tenham preço válido
    */

    const pedidosCorrigidos =
        pedidos.map(
            (item) => {

                const preco =
                    obterPrecoItem(
                        item
                    );


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
        converterPreco(
            valor
        );


    return numero.toLocaleString(
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
                Math.max(
                    1,
                    Number(
                        item.quantidade
                    ) || 1
                );


            const preco =
                obterPrecoItem(
                    item
                );


            totais.itens +=
                quantidade;


            totais.valor +=
                preco *
                quantidade;


            return totais;

        },
        {
            itens: 0,
            valor: 0
        }
    );

}


/* ==================================================
   ESCAPAR TEXTO
================================================== */

function escaparHTML(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    return String(texto)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
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
                .getElementById(
                    "nomeCliente"
                )
                .value
                .trim(),

        cep:
            document
                .getElementById(
                    "cepCliente"
                )
                .value
                .trim(),

        rua:
            document
                .getElementById(
                    "ruaCliente"
                )
                .value
                .trim(),

        numero:
            document
                .getElementById(
                    "numeroCliente"
                )
                .value
                .trim(),

        bairro:
            document
                .getElementById(
                    "bairroCliente"
                )
                .value
                .trim(),

        cidade:
            document
                .getElementById(
                    "cidadeCliente"
                )
                .value
                .trim(),

        estado:
            document
                .getElementById(
                    "estadoCliente"
                )
                .value
                .trim(),

        complemento:
            document
                .getElementById(
                    "complementoCliente"
                )
                .value
                .trim(),

        pagamento:
            pagamentoSelecionado
                ? pagamentoSelecionado.value
                : ""

    };

}


/* ==================================================
   MONTAR TEXTO DOS PRODUTOS
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
                    obterPrecoItem(
                        item
                    );


                const subtotal =
                    preco *
                    quantidade;


                let texto =
                    `- ${quantidade}x ${item.nome}`;


                /*
                   TAMANHO DA PIZZA
                */

                if (
                    item.tamanho
                ) {

                    texto +=
                        `\n  Tamanho: ${item.tamanho}`;

                }

                /*
   SABOR DA PIZZA DO COMBO
*/

                if (
                    item.saborPizza
                ) {

                    texto +=
                        `\n  Pizza escolhida: ${item.saborPizza}`;

                }


                /*
                   BORDA
                */

                if (
                    item.borda
                ) {

                    texto +=
                        `\n  Borda: ${item.borda}`;

                }


                /*
                   OBSERVAÇÃO
                */

                if (
                    item.observacao
                ) {

                    texto +=
                        `\n  Observação: ${item.observacao}`;

                }


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
        calcularTotais(
            pedidos
        );


    const itens =
        montarItensWhatsApp(
            pedidos
        );


    /*
       COMPLEMENTO
    */

    const complemento =
        dadosCliente.complemento
            ? `\nComplemento: ${dadosCliente.complemento}`
            : "";


    /*
       PAGAMENTO
    */

    let pagamento =
        "Não informado";


    if (
        dadosCliente.pagamento ===
        "Pix"
    ) {

        pagamento =
            "Pix - confirmar pagamento";

    }

    else if (
        dadosCliente.pagamento ===
        "Dinheiro"
    ) {

        pagamento =
            "Dinheiro";

    }

    else if (
        dadosCliente.pagamento ===
        "Débito" ||
        dadosCliente.pagamento ===
        "Debito"
    ) {

        pagamento =
            "Cartão de Débito";

    }

    else if (
        dadosCliente.pagamento ===
        "Crédito" ||
        dadosCliente.pagamento ===
        "Credito"
    ) {

        pagamento =
            "Cartão de Crédito";

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

                    /*
                       Usar ID quando existir
                    */

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
        obterPrecoItem(
            item
        );


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
            item.nome
        );


    const descricao =
        escaparHTML(
            item.descricao ||
            ""
        );


    /*
       INFORMAÇÕES DA PIZZA
    */

    let detalhesPizza =
        "";

    /*
SABOR DA PIZZA DO COMBO
*/

    if (
        item.saborPizza
    ) {

        detalhesPizza += `
        <p class="detalhePedido">
            <strong>Pizza escolhida:</strong>
            ${escaparHTML(item.saborPizza)}
        </p>
    `;

    }


    if (
        item.tamanho
    ) {

        detalhesPizza += `
            <p class="detalhePedido">
                <strong>Tamanho:</strong>
                ${escaparHTML(item.tamanho)}
            </p>
        `;

    }


    if (
        item.borda
    ) {

        detalhesPizza += `
            <p class="detalhePedido">
                <strong>Borda:</strong>
                ${escaparHTML(item.borda)}
            </p>
        `;

    }


    if (
        item.observacao
    ) {

        detalhesPizza += `
            <p class="detalhePedido">
                <strong>Observação:</strong>
                ${escaparHTML(item.observacao)}
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
       CARRINHO VAZIO
    */

    if (pedidoVazio) {

        pedidoVazio.style.display =
            temPedidos
                ? "none"
                : "flex";

    }


    /*
       CONTAINER
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


            salvarPedidos(
                []
            );


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

    } else {

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


    /*
       LIMPAR ENDEREÇO
    */

    rua.value = "";
    bairro.value = "";
    cidade.value = "";
    estado.value = "";


    campoCep.setCustomValidity("");


    /*
       CEP INCOMPLETO
    */

    if (
        cep.length !== 8
    ) {

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


    /*
       CONSULTANDO
    */

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


        /*
           CEP NÃO ENCONTRADO
        */

        if (
            dados.erro
        ) {

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


        /*
           PREENCHER ENDEREÇO
        */

        rua.value =
            dados.logradouro ||
            "";

        bairro.value =
            dados.bairro ||
            "";

        cidade.value =
            dados.localidade ||
            "";

        estado.value =
            dados.uf ||
            "";


        /*
           CEP VÁLIDO
        */

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


            /*
               MÁXIMO 8 NÚMEROS
            */

            if (
                valor.length > 8
            ) {

                valor =
                    valor.substring(
                        0,
                        8
                    );

            }


            /*
               COLOCAR HÍFEN
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


            const mensagem =
                document.getElementById(
                    "mensagemCep"
                );


            if (mensagem) {

                mensagem.textContent =
                    "";

            }


            /*
               CONSULTAR AUTOMATICAMENTE
            */

            const cepNumeros =
                valor.replace(
                    /\D/g,
                    ""
                );


            if (
                cepNumeros.length === 8
            ) {

                buscarCep();

            }

        }
    );

}


/* ==================================================
   ATUALIZAR AO ABRIR
================================================== */

atualizarQuantidadeCarrinho();


/* ==================================================
   ATUALIZAR EM OUTRAS ABAS
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