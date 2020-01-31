function indiceAleatorio() { return Math.floor(Math.random() * mazo.length) };
var mazo = [];
var descartes = [];
var colores = ["verde", "rojo", "amarillo", "azul"];

function crearMazo() {
  mazo = [];
  descartes = [];
  var descartesDOM = $("#descartes");
  if (descartesDOM.childElementCount) {
    descartesDOM.removeChild(descartesDOM.lastChild);
  }
  for (let indice = 0; indice < colores.length; indice++) {
    for (let numero = 0; numero < 10; numero++) {
      mazo.push(new Carta("normal", colores[indice], numero))
      if (numero) {
        mazo.push(new Carta("normal", colores[indice], numero))
      }
    }
    mazo.push(new Carta("accion", colores[indice], "+2"));
    mazo.push(new Carta("accion", colores[indice], "+2"));
    mazo.push(new Carta("accion", colores[indice], "reversa"));
    mazo.push(new Carta("accion", colores[indice], "reversa"));
    mazo.push(new Carta("accion", colores[indice], "pierdeTurno"));
    mazo.push(new Carta("accion", colores[indice], "pierdeTurno"));

    mazo.push(new Carta("comodin", "negro", "+4"))
    mazo.push(new Carta("comodin", "negro", "cambiaColor"))
  }
  barajar();
}

async function barajar() {
  Juego.estadoActual++;
  mostrarAyuda(Juego.estados[Juego.estadoActual], "");
  revolverMazo();
  mezclar();
  await esperar(4000);
  repartir();
    
}

function mezclar() {
  mazo.sort(indiceAleatorio); 
  mazo.sort(indiceAleatorio); 
  mazo.sort(indiceAleatorio); 
  mazo.sort(indiceAleatorio); 
}

async function revolverMazo() {
  $("#mazo").style.animation = "mezclar 4s linear";
  await esperar(4000);
  $("#mazo").style.animation = "";
}

function reponerMazo() {
  mazo = descartes;
  descartes = [mazo[(mazo.length) - 1]];
  barajar();
}

function puedeJugar(jugador) {
  const cartasJugador = jugador.cartas;
  return cartasJugador.reduce((estadoInicial, carta) => {
    return carta.puedeLanzar(cartasJugador) ? true : estadoInicial;
  }, false);
}

function tomarCarta(jugador) {
  if (!puedeJugar(jugador)) {
    darCarta(jugador);
    if (!puedeJugar(jugador)) {
      Juego.siguienteJugador(); 
    }
  } else {
    mostrarAyuda("No puedes tomar otra carta", "Ya posees en tu mano una carta que puedes jugar.")
  }
}

function darCarta(jugador) {
    new Audio("statics/sounds/darCartaW.mp3").play();
    carta = mazo.pop();
    jugador.cartas.push(carta);
    $("#mano-jugador-" + jugador.numero).appendChild(generarCarta(carta, jugador));
}

async function repartir() {
  const { jugadores } = Juego;
  Juego.estadoActual++;
  mostrarAyuda(Juego.estados[Juego.estadoActual], "");
  for (let index = 0; index < 7; index++) {
    for (let index = 0; index < jugadores.length; index++) {
      darCarta(jugadores[index]);
      await esperar(200);
    }
  }
  await esperar(200);
  voltearUltima();
}

function voltearUltima() {
  new Audio("statics/sounds/lanzarW.mp3").play();
  carta = mazo.pop();
  if (carta.valor === "+4") {
    alert("Era un +4");
    mazo.unshift(carta);
    carta = mazo.pop();
  }
  $("#descartes").appendChild(generarCarta(carta));
  descartes.push(carta);
  Juego.estadoActual++;
  Juego.alternarJugador();
  Juego.siguienteJugador();
  mostrarAyuda(Juego.estados[Juego.estadoActual], "Selecciona una carta de tu mano.");
  if (carta.tipo !== "normal") {
    carta.accion(Juego.jugadores[Juego.jugadorActivo]);
  }
}
