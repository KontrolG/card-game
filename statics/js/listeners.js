"use strict";

$(".jugar").addEventListener("click", juego.jugar.bind(juego));

app.cerrarAyuda.addEventListener("click", () => app.esconder(app.ayuda));

$("#mazo").addEventListener("click", () => {if (!juego.obtenerJugadorActivo().esCPU()) mazo.pescarCarta()});

app.ayuda.addEventListener("mouseenter", app.mantenerAyuda);

app.ayuda.addEventListener("mouseout", app.mantenerAyuda);

for (const jugador of juego.jugadores) {
  if (!jugador.esCPU())
    jugador.selector.addEventListener("click", juego.elegirColor.bind(juego));
}
