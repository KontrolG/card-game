"use strict";

const configurarJugadores = () => {
  for (const jugador of juego.jugadores) {
    if (!jugador.esCPU()) {
      jugador.configurar();
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
