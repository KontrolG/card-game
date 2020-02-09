"use strict";

const Reglas = {
  esEspecial: function(aLanzar) {
    return aLanzar.tipo === "comodin";
  },

  esDeAccion: function(aLanzar) {
    return aLanzar.tipo === "accion";
  },

  mismoColor: function(aLanzar, aSuperponer) {
    return aLanzar.color === aSuperponer.color;
  },

  mismoValor: function(aLanzar, aSuperponer) {
    return aLanzar.valor === aSuperponer.valor;
  },

  noPuedeLanzar(cartaValor) {
    sonidos.invalido.play();
    cartaValor === "+4"
      ? app.mostrarAyuda(
          "No puedes lanzar",
          "Solo puedes lanzar el +4 si no posees cartas del mismo color."
        )
      : app.mostrarAyuda(
          "No puedes lanzar",
          "Escoje una carta que sea del mismo color o mismo valor"
        );
  },

  noEstaActivo() {
    sonidos.invalido.play();
    app.mostrarAyuda("No es tu turno", "Espera a que sea tu turno.");
  },

  enEspera() {
    sonidos.invalido.play();
    app.mostrarAyuda(
      "No puedes realizar esta acción",
      "En este momento no puedes llevar a cabo la acción deseada."
    );
  },

  noPuedeTomar() {
    sonidos.invalido.play();
    app.mostrarAyuda(
      "No puedes tomar otra carta",
      "Ya posees en tu mano una carta que puedes jugar."
    );
  },

  ganoJuego(nombre) {
    sonidos.ganoJuego.play();
    app.mostrarCartel(
      `¡${nombre} ha ganado el juego!`,
      "Pulsa 'JUGAR' para empezar otra ronda."
    );
  },

  ganoPartida(nombre) {
    sonidos.ganoPartida.play();
    app.mostrarCartel(
      `¡${nombre} ha ganado!`,
      "Pulsa 'JUGAR' para empezar otra ronda."
    );
  }
};

/* CARTA DE TOMAR CUATRO COLORES
El jugador decide qué color sigue en el juego. Además, el siguiente jugador debe tomar cuatro cartas. No se puede
deponer cualquier carta en esta ronda. Por desgracia, la carta sólo se puede poner si
el jugador que la tiene, no tiene ninguna carta en la mano que corresponde con el color del
montón. Si el jugador tiene una carta con el número o una carta de acción, sin embargo la carta
de tomar cuatro colores se puede poner.
 */
