var caixa;
var rotacao;
var frames;

window.addEventListener("load", carregar);

function carregar(){
    rotacao = 0;
    caixa = document.getElementById("dv1");
    caixa.addEventListener("click", girar);
}

function girar(){
    if(rotacao <= 360){
        caixa.style.transform = `rotate(${rotacao}deg)`;
        rotacao++;
    } else {
        rotacao = 0;
        cancelAnimationFrame(frames);
        return;
    }

    frames = requestAnimationFrame(girar);
}