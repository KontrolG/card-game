"use strict";
const configurarSelector = jugador => {
  jugador.selector.addEventListener("click", juego.elegirColor.bind(juego));
};

const configurarMano = jugador => {
  jugador.mano.addEventListener("click", e => {
    const targetElement = e.target;
    if (targetElement.matches(".carta")) {
      const indice = Array.from(jugador.mano.children).indexOf(targetElement);
      jugador.cartas[indice].lanzar();
    }
  });
};

const configurar = jugador => {
  configurarSelector(jugador);
  configurarMano(jugador);
}

const configurarJugadores = () => {
  for (const jugador of juego.jugadores) {
    if (!jugador.esCPU()) {
      configurar(jugador);
    }
  }
};

$(".jugar").addEventListener("click", juego.jugar.bind(juego));

app.cerrarAyuda.addEventListener("click", () => app.esconder(app.ayuda));

$("#mazo").addEventListener("click", () => {if (!juego.obtenerJugadorActivo().esCPU()) mazo.pescarCarta()});

app.ayuda.addEventListener("mouseenter", app.mantenerAyuda);

app.ayuda.addEventListener("mouseout", app.mantenerAyuda);

window.addEventListener("load", () => {
  configurarJugadores();
  app.preparar();
  juego.mostrarEstado();
});
