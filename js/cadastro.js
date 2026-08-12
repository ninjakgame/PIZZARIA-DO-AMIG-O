const telefone = document.getElementById("telefone");

telefone.addEventListener("input", () =>{
    let valor = telefone.value;

    valor = valor.replace(/\D/g, "");

    valor = valor.replace(/^(\d{2})/, "($1) ");

    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

    telefone.value = valor;
});

function cadastrar(){
    const usuario = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if(usuario === "" || email === "" || telefone === "" || senha === ""){
        alert("ERRO");
        return
    }

    alert("voce cadastrou");
}