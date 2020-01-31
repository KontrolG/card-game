var Reglas = {
  esEspecial: function (aLanzar) {
    return aLanzar.tipo === "comodin"
  },
  esDeAccion: function (aLanzar) {
    return aLanzar.tipo === "accion"
  },
  mismoColor: function (aLanzar, aSuperponer) {
    return aLanzar.color === aSuperponer.color
  },
  mismoValor: function (aLanzar, aSuperponer) {
    return aLanzar.valor === aSuperponer.valor
  },
}

/* CARTA DE TOMAR CUATRO COLORES
El jugador decide qué color sigue en el juego. Además, el siguiente jugador debe tomar cuatro cartas. No se puede
deponer cualquier carta en esta ronda. Por desgracia, la carta sólo se puede poner si
el jugador que la tiene, no tiene ninguna carta en la mano que corresponde con el color del
montón. Si el jugador tiene una carta con el número o una carta de acción, sin embargo la carta
de tomar cuatro colores se puede poner.
 */