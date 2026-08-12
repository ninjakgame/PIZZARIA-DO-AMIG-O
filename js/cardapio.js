/* ===========================================
   CARROSSÉIS
=========================================== */

const carrosseis = document.querySelectorAll(".carousel");


carrosseis.forEach((carousel) => {

    const produtos =
        carousel.querySelector(".descricaoProduto");

    const btnAnterior =
        carousel.querySelector(".btnAnterior");

    const btnProximo =
        carousel.querySelector(".btnProximo");


    /* ===============================
       PRÓXIMO
    =============================== */

    btnProximo.addEventListener("click", () => {

        produtos.scrollBy({

            left: 350,

            behavior: "smooth"

        });

    });


    /* ===============================
       ANTERIOR
    =============================== */

    btnAnterior.addEventListener("click", () => {

        produtos.scrollBy({

            left: -350,

            behavior: "smooth"

        });

    });

});



/* ===========================================
   MODAL
=========================================== */

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


const btnAdicionarPedido =
    document.getElementById("btnAdicionarPedido");


const contadorCarrinho =
    document.getElementById("contadorCarrinho");


const chavePedidos =
    "meusPedidos";


let produtoSelecionado =
    null;


function precoParaNumero(preco) {

    return Number(
        preco
            .replace("R$", "")
            .replace(".", "")
            .replace(",", ".")
            .trim()
    );

}


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


function atualizarContadorCarrinho() {

    if (!contadorCarrinho) {

        return;

    }

    const quantidade =
        buscarPedidos().reduce((total, item) => {

            return total + item.quantidade;

        }, 0);

    contadorCarrinho.textContent =
        quantidade;

}



/* ===========================================
   ABRIR MODAL
=========================================== */

cards.forEach((card) => {

    card.addEventListener("click", () => {


        const nome =
            card.dataset.nome;


        const descricao =
            card.dataset.descricao;


        const preco =
            card.dataset.preco;


        const imagem =
            card.dataset.imagem;


        produtoSelecionado = {
            nome,
            descricao,
            preco,
            precoNumero: precoParaNumero(preco),
            imagem,
            quantidade: 1
        };


        /* COLOCAR INFORMAÇÕES */

        modalNome.textContent =
            nome;


        modalDescricao.textContent =
            descricao;


        modalPreco.textContent =
            preco;


        modalImagem.src =
            imagem;


        modalImagem.alt =
            nome;



        /* ABRIR */

        modal.classList.add("ativo");


        /* BLOQUEAR SCROLL DA PÁGINA */

        document.body.style.overflow =
            "hidden";

    });

});


btnAdicionarPedido.addEventListener("click", () => {

    if (!produtoSelecionado) {

        return;

    }

    const pedidos =
        buscarPedidos();

    const produtoExistente =
        pedidos.find((item) => {

            return item.nome === produtoSelecionado.nome;

        });

    if (produtoExistente) {

        produtoExistente.quantidade += 1;

    } else {

        pedidos.push(produtoSelecionado);

    }

    salvarPedidos(pedidos);
    atualizarContadorCarrinho();

    window.location.href =
        "/html/pedidos.html";

});



/* ===========================================
   FECHAR MODAL
=========================================== */

function fecharProduto() {

    modal.classList.remove("ativo");

    document.body.style.overflow =
        "";

}


fecharModal.addEventListener(
    "click",
    fecharProduto
);



/* ===========================================
   CLICAR FORA
=========================================== */

modal.addEventListener("click", (event) => {

    if (
        event.target === modal
    ) {

        fecharProduto();

    }

});



/* ===========================================
   TECLA ESC
=========================================== */

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape"
    ) {

        fecharProduto();

    }

});



/* ===========================================
   ANIMAÇÃO AO ROLAR
=========================================== */

const elementosAnimar =
    document.querySelectorAll(".animar");


const observer =
    new IntersectionObserver(

        (elementos) => {

            elementos.forEach((elemento) => {

                if (
                    elemento.isIntersecting
                ) {

                    elemento.target
                        .classList
                        .add("mostrar");

                }

            });

        },

        {
            threshold: 0.15
        }

    );


elementosAnimar.forEach((elemento) => {

    observer.observe(elemento);

});


function facaAgora(){
    window.location.href = "/html/pedidos.html"
}


atualizarContadorCarrinho();
