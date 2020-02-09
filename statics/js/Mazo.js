"use strict";

const mazo = (function() {
  const mazo = [];
  let descartes;
  const descartesDOM = $("#descartes");

  function indiceAleatorio() {
    return Math.floor(Math.random() * mazo.length);
  }

  function quitarDescarte() {
    descartes = [];
    if (descartesDOM.childElementCount) {
      descartesDOM.removeChild(descartesDOM.lastChild);
    }
  }

  function generarCartasNormales(color) {
    for (let numero = 0; numero < 10; numero++) {
      mazo.push(new Carta("normal", color, numero));
      if (numero) {
        mazo.push(new Carta("normal", color, numero));
      }
    }
  }

  function generarCartasDeAccion(color) {
    for (let cantidad = 0; cantidad < 2; cantidad++) {
      mazo.push(new Carta("accion", color, "+2"));
      mazo.push(new Carta("accion", color, "reversa"));
      mazo.push(new Carta("accion", color, "pierdeTurno"));
    }
  }

  function generarComodines() {
    mazo.push(new Carta("comodin", "negro", "+4"));
    mazo.push(new Carta("comodin", "negro", "cambiaColor"));
  }

  function generarCartas(color) {
    generarCartasNormales(color);
    generarCartasDeAccion(color);
    generarComodines();
  }

  function construir() {
    quitarDescarte();
    for (const color of ["verde", "rojo", "amarillo", "azul"]) {
      generarCartas(color);
    }
  }

  async function barajar() {
    juego.proceder();
    revolver();
    await app.mezclarMazo();
  }

  function revolver() {
    for (let indice = 0; indice < mazo.length; indice++) {
      const indiceNuevo = indiceAleatorio();
      let temporal = mazo[indice];
      [mazo[indice], mazo[indiceNuevo]] = [mazo[indiceNuevo], temporal];
    }
  }

  function reponer() {
    mazo.push(...descartes);
    manejar();
  }

  async function repartirA(jugador) {
    await darCarta(jugador);
    await esperar(200);
  }

  async function unaPorJugador(jugadores) {
    for (const jugador of jugadores) {
      await repartirA(jugador);
    }
  }

  async function repartirTodas(cantidad) {
    const { jugadores } = juego;
    for (let conteo = 0; conteo < cantidad; conteo++) {
      await unaPorJugador(jugadores);
    }
  }

  async function repartir() {
    juego.proceder();
    await repartirTodas(7);
    await esperar(200);
  }

  function obtenerUltimaCarta() {
    let carta = mazo.pop();
    if (carta.valor === "+4") {
      mazo.unshift(carta);
      carta = mazo.pop();
    }
    return carta;
  }

  function reemplazar(carta) {
    if (descartesDOM.childElementCount) {
      descartesDOM.lastElementChild.remove();
    }
    descartesDOM.appendChild(carta);
  }

  function descartar(carta) {
    reemplazar(carta.generar());
    descartes.push(carta);
  }

  function finalizar(carta) {
    if (!carta.esNormal()) juego.obtenerJugadorActivo().acciones[carta.valor]();
    else juego.jugarTurno();
  }

  function voltearUltima() {
    sonidos.lanzar.play();
    let carta = obtenerUltimaCarta();
    descartar(carta);
    juego.comenzar();
    finalizar(carta);
  }

  async function darCarta(jugador) {
    await sonidos.darCarta().play();
    const carta = mazo.pop();
    jugador.añadirCarta(carta);
  }

  async function manejar() {
    await barajar();
    await repartir();
    voltearUltima();
  }

  function cambiarCarta(valor) {
    const carta = descartesDOM.firstElementChild;
    const color = juego.colorTemporal.color;
    carta.src = `statics/img/negro/${valor}-${color}.png`;
    return carta;
  }

  /* El jugador puede clickear el mazo y hacer a los contrincantes tomar cartas */
  async function pescar() {
    if (juego.estadoActual === 3)
      await juego.obtenerJugadorActivo().tomarCarta();
    else Reglas.enEspera();
  }

  return {
    test: function() {
      return mazo;
    },

    preparar: async () => {
      construir();
      manejar();
    },

    darCarta: darCarta,

    descartar: descartar,

    ultimoDescarte: () => {
      return descartes[descartes.length - 1];
    },

    async pescarCarta() {
      if (mazo.length === 0) reponer();
      else await pescar();
    },

    cambiarColor(valor) {
      const carta = cambiarCarta(valor);
      reemplazar(carta);
    }
  };
})();
