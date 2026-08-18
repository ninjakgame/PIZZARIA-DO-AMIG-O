/* =========================================================
   PRINCIPAL.JS
   PIZZARIA DO AMIGÃO
========================================================= */

const chavePedidos = "meusPedidos";

/* =========================================================
   ELEMENTOS
========================================================= */

const carrosseis =
    document.querySelectorAll(".carousel");

const cards =
    document.querySelectorAll(".gridProduto");

const modal =
    document.getElementById("modalProduto");

const fecharModal =
    document.getElementById("fecharModal");

const modalImagem =
    document.getElementById("modalImagem");

const modalNome =
    document.getElementById("modalNome");

const modalDescricao =
    document.getElementById("modalDescricao");

const modalPreco =
    document.getElementById("modalPreco");

const opcoesPizza =
    document.getElementById("opcoesPizza");

const opcoesProduto =
    document.getElementById("opcoesProduto");

const btnAdicionarPedido =
    document.getElementById("btnAdicionarPedido");

const contadorCarrinho =
    document.getElementById("quantidadeCarrinho");

const precoGrande =
    document.getElementById("precoGrande");

const precoBroto =
    document.getElementById("precoBroto");

const observacao =
    document.getElementById("observacao");

const contadorObservacao =
    document.getElementById("contadorObservacao");

const observacaoProduto =
    document.getElementById("observacaoProduto");

const contadorObservacaoProduto =
    document.getElementById("contadorObservacaoProduto");


let produtoSelecionado = null;


/* =========================================================
   FORMATAR DINHEIRO
========================================================= */

function formatarDinheiro(valor) {

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return "R$ 0,00";
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


/* =========================================================
   PEGAR PEDIDOS
========================================================= */

function buscarPedidos() {

    try {

        const dados =
            localStorage.getItem(chavePedidos);

        if (!dados) {
            return [];
        }

        const pedidos =
            JSON.parse(dados);

        if (!Array.isArray(pedidos)) {
            return [];
        }

        return pedidos;

    } catch (erro) {

        console.error(
            "Erro ao carregar pedidos:",
            erro
        );

        return [];
    }
}


/* =========================================================
   SALVAR PEDIDOS
========================================================= */

function salvarPedidos(pedidos) {

    localStorage.setItem(
        chavePedidos,
        JSON.stringify(pedidos)
    );
}


/* =========================================================
   CONTADOR DO CARRINHO
========================================================= */

function atualizarQuantidadeCarrinho() {

    if (!contadorCarrinho) {
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

    contadorCarrinho.textContent =
        quantidade;


    if (quantidade === 0) {

        contadorCarrinho.classList.add(
            "vazio"
        );

    } else {

        contadorCarrinho.classList.remove(
            "vazio"
        );
    }
}


/* =========================================================
   CARROSSEL
========================================================= */

carrosseis.forEach((carousel) => {

    const produtos =
        carousel.querySelector(
            ".descricaoProduto"
        );

    const btnAnterior =
        carousel.querySelector(
            ".btnAnterior"
        );

    const btnProximo =
        carousel.querySelector(
            ".btnProximo"
        );


    if (
        !produtos ||
        !btnAnterior ||
        !btnProximo
    ) {
        return;
    }


    btnProximo.addEventListener(
        "click",
        () => {

            produtos.scrollBy({
                left: 350,
                behavior: "smooth"
            });

        }
    );


    btnAnterior.addEventListener(
        "click",
        () => {

            produtos.scrollBy({
                left: -350,
                behavior: "smooth"
            });

        }
    );

});


/* =========================================================
   ABRIR MODAL
========================================================= */

cards.forEach((card) => {

    card.addEventListener(
        "click",
        () => {

            const tipo =
                card.dataset.tipo || "produto";

            const nome =
                card.dataset.nome || "";

            const descricao =
                card.dataset.descricao || "";

            const imagem =
                card.dataset.imagem || "";


            /* =========================================
               INFORMAÇÕES BÁSICAS
            ========================================= */

            if (modalNome) {

                modalNome.textContent =
                    nome;
            }


            if (modalDescricao) {

                modalDescricao.textContent =
                    descricao;
            }


            if (modalImagem) {

                modalImagem.src =
                    imagem;

                modalImagem.alt =
                    nome;
            }


            /* =========================================
               PROMOÇÃO
            ========================================= */

            if (tipo === "promocao") {

                const preco =
                    Number(
                        card.dataset.preco
                    ) || 0;


                produtoSelecionado = {

                    tipo: "produto",

                    subtipo: "promocao",

                    nome: nome,

                    descricao: descricao,

                    imagem: imagem,

                    preco: preco,

                    quantidade: 1,

                    saborPizza: "",

                    observacao: ""

                };


                if (opcoesPizza) {

                    opcoesPizza.style.display =
                        "none";
                }


                if (opcoesProduto) {

                    opcoesProduto.style.display =
                        "flex";
                }


                if (modalPreco) {

                    modalPreco.textContent =
                        formatarDinheiro(
                            preco
                        );
                }


                /* =====================================
                   CRIAR ESCOLHA DA PIZZA DO COMBO
                ===================================== */

                let escolhaPizza =
                    document.getElementById(
                        "escolhaPizzaPromocao"
                    );


                if (!escolhaPizza) {

                    escolhaPizza =
                        document.createElement(
                            "div"
                        );

                    escolhaPizza.id =
                        "escolhaPizzaPromocao";

                    escolhaPizza.className =
                        "escolhaPizzaPromocao";

                    escolhaPizza.innerHTML = `

                        <div class="grupoOpcao">

                            <h3>
                                Escolha sua pizza
                            </h3>

                            <label class="opcao">

                                <input
                                    type="radio"
                                    name="pizzaPromocao"
                                    value="Mussarela"
                                >

                                <span class="opcaoTexto">

                                    <strong>
                                        Pizza de Mussarela
                                    </strong>

                                    <small>
                                        Incluso no combo
                                    </small>

                                </span>

                                <span class="opcaoPreco">
                                    Incluso
                                </span>

                            </label>


                            <label class="opcao">

                                <input
                                    type="radio"
                                    name="pizzaPromocao"
                                    value="Calabresa"
                                >

                                <span class="opcaoTexto">

                                    <strong>
                                        Pizza de Calabresa
                                    </strong>

                                    <small>
                                        Incluso no combo
                                    </small>

                                </span>

                                <span class="opcaoPreco">
                                    Incluso
                                </span>

                            </label>

                        </div>

                    `;

                    if (opcoesProduto) {

                        opcoesProduto.parentNode.insertBefore(
                            escolhaPizza,
                            opcoesProduto
                        );
                    }
                }


                /* =====================================
                   LIMPAR ESCOLHA ANTERIOR
                ===================================== */

                const sabores =
                    escolhaPizza.querySelectorAll(
                        'input[name="pizzaPromocao"]'
                    );

                sabores.forEach((radio) => {

                    radio.checked = false;

                });


                /* =====================================
                   SELECIONAR SABOR
                ===================================== */

                sabores.forEach((radio) => {

                    radio.addEventListener(
                        "change",
                        () => {

                            produtoSelecionado.saborPizza =
                                radio.value;

                        }
                    );

                });


                /* =====================================
                   ESCONDER OPÇÕES NORMAIS
                ===================================== */

                if (opcoesProduto) {

                    opcoesProduto.style.display =
                        "flex";
                }


                if (observacaoProduto) {

                    observacaoProduto.value =
                        "";
                }


                if (contadorObservacaoProduto) {

                    contadorObservacaoProduto.textContent =
                        "0";
                }

            }


            /* =========================================
               PIZZA NORMAL
            ========================================= */

            else if (tipo === "pizza") {

                const precoGrandePizza =
                    Number(
                        card.dataset.precoGrande
                    ) || 0;


                const precoBrotoPizza =
                    Number(
                        card.dataset.precoBroto
                    ) || 0;


                produtoSelecionado = {

                    tipo: "pizza",

                    nome: nome,

                    descricao: descricao,

                    imagem: imagem,

                    precoGrande:
                        precoGrandePizza,

                    precoBroto:
                        precoBrotoPizza,

                    tamanho:
                        "grande",

                    borda:
                        "Sem borda",

                    precoBorda:
                        0,

                    observacao:
                        "",

                    preco:
                        precoGrandePizza,

                    quantidade:
                        1

                };


                /* =====================================
                   MOSTRAR OPÇÕES DA PIZZA
                ===================================== */

                if (opcoesPizza) {

                    opcoesPizza.style.display =
                        "flex";
                }


                if (opcoesProduto) {

                    opcoesProduto.style.display =
                        "none";
                }


                /* =====================================
                   PREÇOS
                ===================================== */

                if (precoGrande) {

                    precoGrande.textContent =
                        formatarDinheiro(
                            precoGrandePizza
                        );
                }


                if (precoBroto) {

                    precoBroto.textContent =
                        formatarDinheiro(
                            precoBrotoPizza
                        );
                }


                /* =====================================
                   RESETAR TAMANHO
                ===================================== */

                const tamanhoGrande =
                    document.querySelector(
                        'input[name="tamanhoPizza"][value="grande"]'
                    );

                const tamanhoBroto =
                    document.querySelector(
                        'input[name="tamanhoPizza"][value="broto"]'
                    );


                if (tamanhoGrande) {

                    tamanhoGrande.checked =
                        true;
                }


                if (tamanhoBroto) {

                    tamanhoBroto.checked =
                        false;
                }


                /* =====================================
                   RESETAR BORDA
                ===================================== */

                const bordas =
                    document.querySelectorAll(
                        'input[name="bordaPizza"]'
                    );


                bordas.forEach((borda) => {

                    borda.checked =
                        borda.value ===
                        "Sem borda";

                });


                /* =====================================
                   RESETAR OBSERVAÇÃO
                ===================================== */

                if (observacao) {

                    observacao.value =
                        "";
                }


                if (contadorObservacao) {

                    contadorObservacao.textContent =
                        "0";
                }


                atualizarPrecoPizza();

            }


            /* =========================================
               PRODUTO NORMAL
            ========================================= */

            else {

                const preco =
                    Number(
                        card.dataset.preco
                    ) || 0;


                produtoSelecionado = {

                    tipo: "produto",

                    nome: nome,

                    descricao: descricao,

                    imagem: imagem,

                    preco: preco,

                    quantidade: 1,

                    observacao: ""

                };


                if (opcoesPizza) {

                    opcoesPizza.style.display =
                        "none";
                }


                if (opcoesProduto) {

                    opcoesProduto.style.display =
                        "flex";
                }


                if (observacaoProduto) {

                    observacaoProduto.value =
                        "";
                }


                if (contadorObservacaoProduto) {

                    contadorObservacaoProduto.textContent =
                        "0";
                }


                if (modalPreco) {

                    modalPreco.textContent =
                        formatarDinheiro(
                            preco
                        );
                }

            }


            /* =========================================
               ABRIR MODAL
            ========================================= */

            if (modal) {

                modal.classList.add(
                    "ativo"
                );

                modal.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }


            document.body.style.overflow =
                "hidden";

        }
    );

});


/* =========================================================
   ATUALIZAR PREÇO DA PIZZA
========================================================= */

function atualizarPrecoPizza() {

    if (
        !produtoSelecionado ||
        produtoSelecionado.tipo !== "pizza"
    ) {

        return;
    }


    const tamanho =
        document.querySelector(
            'input[name="tamanhoPizza"]:checked'
        );


    const borda =
        document.querySelector(
            'input[name="bordaPizza"]:checked'
        );


    if (!tamanho) {
        return;
    }


    let preco = 0;


    if (
        tamanho.value ===
        "grande"
    ) {

        preco =
            Number(
                produtoSelecionado.precoGrande
            ) || 0;

    } else {

        preco =
            Number(
                produtoSelecionado.precoBroto
            ) || 0;

    }


    let precoBorda = 0;


    if (borda) {

        precoBorda =
            Number(
                borda.dataset.preco
            ) || 0;
    }


    preco +=
        precoBorda;


    produtoSelecionado.tamanho =
        tamanho.value;

    produtoSelecionado.borda =
        borda
            ? borda.value
            : "Sem borda";

    produtoSelecionado.precoBorda =
        precoBorda;

    produtoSelecionado.preco =
        preco;


    if (modalPreco) {

        modalPreco.textContent =
            formatarDinheiro(
                preco
            );
    }

}


/* =========================================================
   EVENTOS DAS OPÇÕES DA PIZZA
========================================================= */

document
    .querySelectorAll(
        'input[name="tamanhoPizza"], input[name="bordaPizza"]'
    )
    .forEach((input) => {

        input.addEventListener(
            "change",
            atualizarPrecoPizza
        );

    });


/* =========================================================
   CONTADOR DE OBSERVAÇÃO
========================================================= */

if (observacao) {

    observacao.addEventListener(
        "input",
        () => {

            if (contadorObservacao) {

                contadorObservacao.textContent =
                    observacao.value.length;

            }

        }
    );

}


if (observacaoProduto) {

    observacaoProduto.addEventListener(
        "input",
        () => {

            if (contadorObservacaoProduto) {

                contadorObservacaoProduto.textContent =
                    observacaoProduto.value.length;

            }

        }
    );

}


/* =========================================================
   ADICIONAR AO CARRINHO
========================================================= */

if (btnAdicionarPedido) {

    btnAdicionarPedido.addEventListener(
        "click",
        () => {

            if (!produtoSelecionado) {

                alert(
                    "Selecione um produto."
                );

                return;
            }


            /* =====================================
               PROMOÇÃO
            ===================================== */

            if (
                produtoSelecionado.subtipo ===
                "promocao"
            ) {

                const saborSelecionado =
                    document.querySelector(
                        'input[name="pizzaPromocao"]:checked'
                    );


                if (!saborSelecionado) {

                    alert(
                        "Escolha a pizza do combo: Mussarela ou Calabresa."
                    );

                    return;
                }


                produtoSelecionado.saborPizza =
                    saborSelecionado.value;


                produtoSelecionado.observacao =
                    observacaoProduto
                        ? observacaoProduto.value.trim()
                        : "";

            }


            /* =====================================
               PIZZA NORMAL
            ===================================== */

            else if (
                produtoSelecionado.tipo ===
                "pizza"
            ) {

                const tamanho =
                    document.querySelector(
                        'input[name="tamanhoPizza"]:checked'
                    );


                if (!tamanho) {

                    alert(
                        "Escolha o tamanho da pizza."
                    );

                    return;
                }


                const borda =
                    document.querySelector(
                        'input[name="bordaPizza"]:checked'
                    );


                if (!borda) {

                    alert(
                        "Escolha a borda da pizza."
                    );

                    return;
                }


                atualizarPrecoPizza();


                produtoSelecionado.observacao =
                    observacao
                        ? observacao.value.trim()
                        : "";

            }


            /* =====================================
               PRODUTO NORMAL
            ===================================== */

            else {

                produtoSelecionado.observacao =
                    observacaoProduto
                        ? observacaoProduto.value.trim()
                        : "";

            }


            /* =====================================
               GARANTIR PREÇO
            ===================================== */

            const preco =
                Number(
                    produtoSelecionado.preco
                );


            if (
                !Number.isFinite(preco) ||
                preco <= 0
            ) {

                alert(
                    "O preço do produto é inválido."
                );

                return;
            }


            /* =====================================
               BUSCAR CARRINHO
            ===================================== */

            const pedidos =
                buscarPedidos();


            /* =====================================
               PRODUTO EXISTENTE
            ===================================== */

            let existente =
                null;


            if (
                produtoSelecionado.subtipo ===
                "promocao"
            ) {

                existente =
                    pedidos.find(
                        (item) => {

                            return (

                                item.tipo ===
                                "produto" &&

                                item.subtipo ===
                                "promocao" &&

                                item.nome ===
                                produtoSelecionado.nome &&

                                item.saborPizza ===
                                produtoSelecionado.saborPizza &&

                                item.observacao ===
                                produtoSelecionado.observacao

                            );

                        }
                    );

            }


            else if (
                produtoSelecionado.tipo ===
                "pizza"
            ) {

                existente =
                    pedidos.find(
                        (item) => {

                            return (

                                item.tipo ===
                                "pizza" &&

                                item.nome ===
                                produtoSelecionado.nome &&

                                item.tamanho ===
                                produtoSelecionado.tamanho &&

                                item.borda ===
                                produtoSelecionado.borda &&

                                item.observacao ===
                                produtoSelecionado.observacao

                            );

                        }
                    );

            }


            else {

                existente =
                    pedidos.find(
                        (item) => {

                            return (

                                item.tipo ===
                                "produto" &&

                                item.nome ===
                                produtoSelecionado.nome &&

                                item.observacao ===
                                produtoSelecionado.observacao

                            );

                        }
                    );

            }


            /* =====================================
               SOMAR OU ADICIONAR
            ===================================== */

            if (existente) {

                existente.quantidade =
                    (
                        Number(
                            existente.quantidade
                        ) || 0
                    ) + 1;

            }


            else {

                pedidos.push({

                    ...produtoSelecionado,

                    quantidade: 1

                });

            }


            /* =====================================
               SALVAR
            ===================================== */

            salvarPedidos(
                pedidos
            );


            /* =====================================
               ATUALIZAR CONTADOR
            ===================================== */

            atualizarQuantidadeCarrinho();


            /* =====================================
               FECHAR MODAL
            ===================================== */

            fecharProduto();


            /* =====================================
               IR PARA PEDIDOS
            ===================================== */

            window.location.href =
                "/html/principalPagina/finalizar.html";

        }
    );

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharProduto() {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "ativo"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    produtoSelecionado =
        null;
}


if (fecharModal) {

    fecharModal.addEventListener(
        "click",
        fecharProduto
    );

}


/* =========================================================
   CLICAR FORA DO MODAL
========================================================= */

if (modal) {

    modal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                modal
            ) {

                fecharProduto();

            }

        }
    );

}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            fecharProduto();

        }

    }
);


/* =========================================================
   ANIMAÇÃO AO ROLAR
========================================================= */

const elementosAnimar =
    document.querySelectorAll(
        ".animar"
    );


if (
    "IntersectionObserver"
    in window
) {

    const observer =
        new IntersectionObserver(

            (elementos) => {

                elementos.forEach(
                    (elemento) => {

                        if (
                            elemento.isIntersecting
                        ) {

                            elemento.target
                                .classList
                                .add(
                                    "mostrar"
                                );

                        }

                    }
                );

            },

            {
                threshold: 0.15
            }

        );


    elementosAnimar.forEach(
        (elemento) => {

            observer.observe(
                elemento
            );

        }
    );

}


/* =========================================================
   BOTÃO IR PARA CARRINHO
========================================================= */

function facaAgora() {

    window.location.href =
        "/html/principalPagina/finalizar.html";

}


/* =========================================================
   ATUALIZAR CARRINHO AO ABRIR
========================================================= */

atualizarQuantidadeCarrinho();


/* =========================================================
   ATUALIZAR SE OUTRA ABA ALTERAR
========================================================= */

window.addEventListener(
    "storage",
    atualizarQuantidadeCarrinho
);