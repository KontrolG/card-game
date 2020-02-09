"use strict";

class Carta {
  constructor(tipo, color, valor) {
    this.tipo = tipo;
    this.color = color;
    this.valor = valor;
  }

  esComodin() {
    return this.tipo === "comodin";
  }

  esDeAccion() {
    return this.tipo === "accion";
  }

  esNormal() {
    return this.tipo === "normal";
  }

  evaluarCartas(cartasJugador, ultimoDescarte) {
    let puede = true;

    if (this.esComodin()) {
      let puedeLanzarMas4 = true;
      cartasJugador.forEach(carta => {
        if (Reglas.mismoColor(carta, ultimoDescarte)) {
          puedeLanzarMas4 = false;
        }
      });
      if (this.valor === "+4" && !puedeLanzarMas4) {
        puede = false;
      }
    } else if (
      !(
        Reglas.mismoColor(this, ultimoDescarte) ||
        Reglas.mismoValor(this, ultimoDescarte)
      )
    ) {
      puede = false;
    }

    return puede;
  }

  puedeLanzar(cartasJugador) {
    const { colorTemporal } = juego;
    const ultimoDescarte = colorTemporal
      ? colorTemporal
      : mazo.ultimoDescarte();
    return this.evaluarCartas(cartasJugador, ultimoDescarte);
  }

  obtenerJugador() {
    return juego.jugadores.find(({ cartas }) => {
      let poseeCarta = false;
      cartas.forEach(carta => {
        if (carta === this) poseeCarta = true;
      });
      return poseeCarta;
    });
  }

  generar(jugador = { esCPU: () => false }) {
    const imagen = document.createElement("img");
    imagen.classList.add("carta");
    imagen.src = jugador.esCPU()
      ? `statics/img/oculto.png`
      : this.ruta(this.color, this.valor);
    if (!jugador.esCPU() && jugador.nombre)
      imagen.addEventListener("click", this.lanzar.bind(this));
    return imagen;
  }

  ruta(color, valor) {
    return `statics/img/${color}/${valor}.png`;
  }

  jugarCarta(jugador) {
    juego.colorTemporal = false;
    mazo.descartar(this);
    jugador.removerCarta(this);
    sonidos.lanzar.play();
  }

  comprobarJugador(jugador) {
    if (jugador.estaActivo()) this.comprobarCarta(jugador);
    else Reglas.noEstaActivo();
  }

  comprobarCarta(jugador) {
    if (this.puedeLanzar(jugador.cartas)) this.terminarLanzada(jugador);
    else Reglas.noPuedeLanzar(this.valor);
  }

  terminarLanzada(jugador) {
    this.jugarCarta(jugador);
    jugador.finalizarJugada(this);
  }

  lanzar() {
    const jugador = this.obtenerJugador();
    if (juego.estadoActual === 3) this.comprobarJugador(jugador);
    else Reglas.enEspera();
  }

  localizarCarta(cartasJugador, Carta) {
    return cartasJugador.indexOf(Carta);
  }

  obtenerPuntos() {
    if (this.esDeAccion()) {
      return 20;
    } else if (this.esComodin()) {
      return 50;
    }
    return 0;
  }
}
