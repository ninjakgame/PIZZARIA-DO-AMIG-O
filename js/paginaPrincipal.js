/*==========================================
    PEDIR AGORA
==========================================*/

function pedirAgora() {
    window.location.href = "/html/cardapio.html";
}

/*==========================================
    ANIMAÇÃO AO ROLAR
==========================================*/

const elementos = document.querySelectorAll(".animar");

function aparecer() {

    const alturaTela = window.innerHeight;

    elementos.forEach((item) => {

        const distancia = item.getBoundingClientRect().top;

        if (distancia < alturaTela - 120) {

            item.classList.add("mostrar");

        } else {

            item.classList.remove("mostrar");

        }

    });

}

window.addEventListener("scroll", aparecer);
window.addEventListener("load", aparecer);

/*==========================================
    HEADER COM SOMBRA
==========================================*/

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.style.boxShadow = "0 10px 25px rgba(0,0,0,.15)";

    } else {

        header.style.boxShadow = "none";

    }

});