function pedirAgora(){
    addEventListener("click", () => {
        window.location.href = "../html/paginaPrincipal.html";
    })
}

const elementos = document.querySelectorAll(".animar");

function aparecer(){

    const alturaTela = window.innerHeight;

    elementos.forEach((item)=>{

        const distancia = item.getBoundingClientRect().top;

        if(distancia < alturaTela - 100){
            item.classList.add("mostrar");
        }

    });

}

window.addEventListener("scroll", aparecer);

aparecer();