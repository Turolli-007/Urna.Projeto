// 1. Banco de dados simulado dos candidatos com fotos da web
const bancoCandidatos = {
    Senador: {
        "11111": { 
            nome: "Bluezao da Silva", 
            partido: "MENDIGO", 
            foto: "../fotos/bluezao.jpg" 
        },

        "22222": { 
            nome: "Galo Cego", 
            partido: "PCD", 
            foto: "../fotos/5 conto.jpg" 
        }
    },

    Presidente: {
        "11": { 
            nome: "DR. Delicia", 
            partido: "MENDIGO", 
            foto: "../fotos/jailson.jpg" 
        },

        "22": { 
            nome: "Calor?", 
            partido: "PCD", 
            foto: "../fotos/vera verao.jpg" 
        }
    }
};


// Configuração das etapas do fluxo da votação
const etapas = [
    { cargo: "Senador", digitos: 5, chave: "Senador" },
    { cargo: "Presidente", digitos: 2, chave: "Presidente" }
];

let etapaAtual = 0;
let numeroDigitado = "";
let eBranco = false;

// Som da confirmação do voto
const somConfirma = new Audio("../sons/confirma.mp3");
somConfirma.volume = 0.3;

function tocarSomConfirma() {
    somConfirma.currentTime = 0;
    somConfirma.play();
}

// 2. Inicia ou limpa a tela para a etapa atual
function iniciarEtapa() {
    let etapa = etapas[etapaAtual];
    numeroDigitado = "";
    eBranco = false;

    document.getElementById("cargo").innerText = etapa.cargo;
    document.getElementById("topo-voto").style.opacity = "0";
    document.getElementById("dados-candidato").innerHTML = "";
    document.getElementById("foto-candidato").style.display = "none";

    atualizarPreenchimentoCaixas();
}

// 3. Monta e gerencia os quadradinhos na tela
function atualizarPreenchimentoCaixas() {
    let etapa = etapas[etapaAtual];
    let container = document.getElementById("container-numeros");
    container.innerHTML = ""; 

    for (let i = 0; i < etapa.digitos; i++) {
        let caixa = document.createElement("div");
        caixa.classList.add("caixa-numero");

        if (numeroDigitado[i] !== undefined) {
            caixa.innerText = numeroDigitado[i]; 
        } else if (i === numeroDigitado.length && !eBranco) {
            caixa.classList.add("pisca"); 
        }

        container.appendChild(caixa);
    }

    verificarFimDigitos();
}

// Ouve as teclas numéricas digitadas
function inserir(num) {
    let etapa = etapas[etapaAtual];
    if (numeroDigitado.length < etapa.digitos && !eBranco) {
        numeroDigitado += num;
        atualizarPreenchimentoCaixas();
    }
}

// 4. Executa a busca se o eleitor terminou de preencher os campos
function verificarFimDigitos() {
    let etapa = etapas[etapaAtual];
    let campoDados = document.getElementById("dados-candidato");
    let campoFoto = document.getElementById("foto-candidato");

    if (numeroDigitado.length === etapa.digitos) {
        document.getElementById("topo-voto").style.opacity = "1";
        let listaCandidatos = bancoCandidatos[etapa.chave];

        if (listaCandidatos[numeroDigitado]) {
            let cand = listaCandidatos[numeroDigitado];
            campoDados.innerHTML = `<br><b>Nome:</b> ${cand.nome}<br><b>Partido:</b> ${cand.partido}`;
            campoFoto.src = cand.foto;
            campoFoto.style.display = "block"; 
        } else {
            campoDados.innerHTML = `<br><h2 class="pisca" style="margin:0; color:#cc0000;">VOTO NULO</h2>`;
            campoFoto.style.display = "none";
        }
    }
}

// Função do Botão Branco
function votoBranco() {
    let etapa = etapas[etapaAtual];
    if (numeroDigitado === "") {
        eBranco = true;
        document.getElementById("topo-voto").style.opacity = "1";
        document.getElementById("container-numeros").innerHTML = "";
        document.getElementById("dados-candidato").innerHTML = `<br><h2 class="pisca" style="margin:0;">VOTO EM BRANCO</h2>`;
        document.getElementById("foto-candidato").style.display = "none";
    }
}

// Função do Botão Corrige
function corrige() {
    iniciarEtapa();
}

// Função do Botão Confirma
function confirma() {
    let etapa = etapas[etapaAtual];
    
    if (numeroDigitado.length === etapa.digitos || eBranco) {

        tocarSomConfirma(); // 🔊 som quando confirma o voto

        etapaAtual++; 

        if (etapas[etapaAtual]) {
            iniciarEtapa();
        } else {

            document.getElementById("tela").innerHTML = `
                <div class="tela-fim">FIM</div>
            `;

            setTimeout(() => { 
                location.reload(); 
            }, 4000);
        }
    }
}

// Gatilho inicial ao carregar a página
iniciarEtapa();
