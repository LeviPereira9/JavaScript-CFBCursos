
var jogadorDX, jogadorDY;
var jogadorPX, jogadorPY, velocidade, velocidadeTiro;
var naveJogador, naveInimigo;
var jogo, frames;
var telaLargura, telaAltura;
var contadorBombas, painelBomba, bombasTotal, velocidadeBomba, tempoBomba, velocidadeSpawnBomba, quantidadeExplosoes;
var vidaPlaneta, barraPlaneta;
var contadorSom;
var tela, botao;

window.addEventListener("load", iniciar)
document.addEventListener("keydown", teclaDw);
document.addEventListener("keyup", teclaUp);



function iniciar(){
    jogo = false;

    //Controle de Nave
    velocidade = 5;
    velocidadeTiro = 10;
    jogadorDX = 0;
    jogadorDY = 0;
    telaLargura = innerWidth;
    telaAltura = innerHeight;
    jogadorPX = (telaLargura/2)-20;
    jogadorPY = (telaAltura/2)-20;
    naveJogador = document.getElementById("naveJogo");
    naveJogador.style.left = jogadorPX + "px";
    naveJogador.style.top = jogadorPY + "px";

    //Controles Planeta
    vidaPlaneta = 300;
    barraPlaneta = document.getElementById("barraPlaneta");
    barraPlaneta.style.width=`${vidaPlaneta}px`

    //controles das bombas

    contadorBombas = 150;
    velocidadeBomba = 3;


    //controles de explosoes
    quantidadeExplosoes = 0;

    //Controle som
    contadorSom = 0;
    
    //Controle de telas
    tela = document.getElementById("telaMsg");
    tela.style.backgroundImage="url(intro.jpg)";
    tela.style.display = "block";

    botao = document.getElementById("btnJogar");
    botao.addEventListener("click", reiniciar);

    painelBomba = document.getElementById("contBombas");
}

function teclaDw(){
    var teclaDw = event.key;

    if(teclaDw == "ArrowLeft"){
        jogadorDX = -1;
    } else if (teclaDw == "ArrowRight"){
        jogadorDX = 1;
    } else if (teclaDw == "ArrowUp"){
        jogadorDY = -1;
    } else if (teclaDw == "ArrowDown"){
        jogadorDY = 1;
    } else if (teclaDw == " "){
        //Atira
        jogadorAtira(jogadorPX+17, jogadorPY)
    }
}

function teclaUp(){
    var teclaUp = event.key

    if(teclaUp == "ArrowLeft"){
        jogadorDX = 0;
    } else if (teclaUp == "ArrowRight"){
        jogadorDX = 0;
    } else if (teclaUp == "ArrowUp"){
        jogadorDY = 0;
    } else if (teclaUp == "ArrowDown"){
        jogadorDY = 0;
    }
}

function motorJogador(){
    jogadorPX += jogadorDX * velocidade;
    jogadorPY += jogadorDY * velocidade;    

    naveJogador.style.left = jogadorPX + "px";
    naveJogador.style.top = jogadorPY + "px";

}

function jogadorAtira(x,y){
    var tiro = document.createElement("div");
    var tiroAtributo0 = document.createAttribute("class");
    var tiroAtributo1 = document.createAttribute("style");

    tiroAtributo0.value = "tiroJogador"
    tiroAtributo1.value = `top:${y}px;left:${x}px;`;
    tiro.setAttributeNode(tiroAtributo0);
    tiro.setAttributeNode(tiroAtributo1);
    document.body.appendChild(tiro);
}

function controleTiro(){
    var tiros = document.getElementsByClassName("tiroJogador");
    var QuantidadeTiros = tiros.length;

    for(var c = 0; QuantidadeTiros > c; c++){
        if(tiros[c]){
            var posicaoTiro = tiros[c].offsetTop;
            posicaoTiro-=velocidadeTiro;
            tiros[c].style.top = posicaoTiro + "px";
            colisaoTiroBomba(tiros[c]);
            if(posicaoTiro < 0){
                tiros[c].remove();
            }
        }
    }
}



function criarBombas(){
    if(jogo){
       var y = 0;
       var x = Math.round(Math.random()*telaLargura); 
       var bomba = document.createElement("div");
       var bombaAtributo0 = document.createAttribute("class");
       var bombaAtributo1 = document.createAttribute("style");
        
       bombaAtributo0.value = "bomba";
       bombaAtributo1.value = `top:${y}px; left:${x}px`;
       
       bomba.setAttributeNode(bombaAtributo0);
       bomba.setAttributeNode(bombaAtributo1);

       document.body.appendChild(bomba);
       contadorBombas--;
    }
}

function soltarBombas(){
    bombasTotal = document.getElementsByClassName("bomba");
    var tamanhoBombas = bombasTotal.length;

    for(var c = 0; tamanhoBombas > c; c++){
        if(bombasTotal[c]){
            var posicaoBomba = bombasTotal[c].offsetTop;
            posicaoBomba += velocidadeBomba;

            bombasTotal[c].style.top = `${posicaoBomba}px`
            if(posicaoBomba+30 > telaAltura){
                vidaPlaneta-=5;
                gestaoJogo();
                criaExplosoes(1,bombasTotal[c].offsetLeft,null);
                bombasTotal[c].remove();
            }
        }
    }
}

function contarBombas(){
    painelBomba.innerHTML = `Bombas restantes: ${contadorBombas}`;
}

function colisaoTiroBomba(tiro){
    var tamanhoBombas = bombasTotal.length;
    for(var c = 0; tamanhoBombas > c; c++){
        if(bombasTotal[c]){
            if(
                (
                (tiro.offsetTop<=(bombasTotal[c].offsetTop+39))&&(tiro.offsetTop+5>=(bombasTotal[c].offsetTop)) //Verifica se esta no eixo Y da bomba.
                )&&(
                    (tiro.offsetLeft<=(bombasTotal[c].offsetLeft+24))&&((tiro.offsetLeft+5)>=(bombasTotal[c].offsetLeft))//Verifica se esta no eixo X da bomba
                )
            ){
                criaExplosoes(0,bombasTotal[c].offsetLeft-17,bombasTotal[c].offsetTop)
                bombasTotal[c].remove();
                tiro.remove();
            }
        }
    }

}

function criaExplosoes(tipo, x, y){//Tipo: 0 = Ar, 1 = Chão.

    var explosao = document.createElement("div");
    var imagemExplosao = document.createElement("img");
    var somExplosao = document.createElement("audio");
    //Atributos para explosão;
    var explosaoAtributo0 = document.createAttribute("class");
    var explosaoAtributo1 = document.createAttribute("style");
    var explosaoAtributo2 = document.createAttribute("id");
    //Atributos para imagemExplosao;
    var imagemExplosaoAtributo0 = document.createAttribute("src");
    //Atributos para audio;
    var somExplosaoAtributo0 = document.createAttribute("src");
    var somExplosaoAtributo1 = document.createAttribute("id");

    //Valores atributos para explosão
    explosaoAtributo2.value = `explosao${quantidadeExplosoes}`;
    if(tipo==0){
        explosaoAtributo0.value = "explosaoAr";
        explosaoAtributo1.value = `left:${x}px; top:${y}px;`;
        imagemExplosaoAtributo0.value = `explosao_ar.gif?${new Date()}`;
    } else {
        explosaoAtributo0.value = "explosaoChao";
        explosaoAtributo1.value = `left:${x-17}px; top:${telaAltura-57}px;`;
        imagemExplosaoAtributo0.value = `explosao_chao.gif?${new Date()}`;
    }
    somExplosaoAtributo0.value = "exp1.mp3";
    somExplosaoAtributo1.value = `som${contadorSom}`;
    
    //Integrando os atributos explosão.
    explosao.setAttributeNode(explosaoAtributo0);//Classe
    explosao.setAttributeNode(explosaoAtributo1);//Posição de Spawn
    explosao.setAttributeNode(explosaoAtributo2);//id
    //Integrando os atributos de imagem.
    imagemExplosao.setAttributeNode(imagemExplosaoAtributo0);//gif
    //Integrando os atributos de audio.
    somExplosao.setAttributeNode(somExplosaoAtributo0);//audio
    somExplosao.setAttributeNode(somExplosaoAtributo1);//id

    //Integrando no navegador.
    explosao.appendChild(imagemExplosao);
    explosao.appendChild(somExplosao);
    document.body.appendChild(explosao);
    
    //Soltar o som.
    document.getElementById(`som${contadorSom}`).play();

    //Remover explosões
    if(document.getElementById(`explosao${quantidadeExplosoes-5}`)){
        document.getElementById(`explosao${quantidadeExplosoes-5}`).remove();
    }


    quantidadeExplosoes++;
    contadorSom++;
}

function gestaoJogo(){
    barraPlaneta.style.width=`${vidaPlaneta}px`;
    if(contadorBombas <= 0){
        jogo = false;
        clearInterval(tempoBomba);
        tela.style.backgroundImage="url('vitoria.jpg')";
        tela.style.display="block";
    } else if (vidaPlaneta <= 0){
        jogo = false;
        clearInterval(tempoBomba);
        tela.style.backgroundImage="url('derrota.jpg')";
        tela.style.display="block";
    }
}

function gameLoop(){
    if(jogo){
        //Controles
        motorJogador();
        controleTiro();
        soltarBombas();
        contarBombas();
    }
    
    frames = requestAnimationFrame(gameLoop); 
    
}


function reiniciar(){
    bombasTotal = document.getElementsByClassName("bomba");
    var tamanhoBombas = bombasTotal.length;
    for(var c = 0; tamanhoBombas > c; c++){
        if(bombasTotal[c]){
            bombasTotal[c].remove();
        }
    }
    tela.style.display = "none";
    cancelAnimationFrame(frames);
    clearInterval(tempoBomba);
    vidaPlaneta = 300;
    jogadorPX = telaLargura/2;
    jogadorPY = telaAltura/2;
    naveJogador.style.left = `${jogadorPX}px`;
    naveJogador.style.top = `${jogadorPY}px`;
    contadorBombas = 150;
    jogo = true;
    velocidadeSpawnBomba = 1700;
    tempoBomba = setInterval(criarBombas, velocidadeSpawnBomba);
    gameLoop();
}
