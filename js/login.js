function mostrarSenha(){

    const senha = document.getElementById("senha");

    if(senha.type === "password"){

        senha.type = "text";

    }else{

        senha.type = "password";

    }

}

function entrar(){

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if(nome === "" || email === "" || senha === ""){

        alert("Preencha todos os campos!");

        return;

    }

    alert("Entrada com sucesso!");
    window.location.href = "paginaPrincipal.html"

}