"use strict";

class Jugador {
  constructor(nombre, numero) {
    this.nombre = nombre;
    this.numero = numero;
    this.panel = $(`#panel-jugador-${numero}`);
    this.selector = $(`#selector-jugador-${numero}`);
    this.mano = $(`#mano-jugador-${numero}`);
    this.identificador = $(`#nombre-jugador-${numero} p`);
    this.puntuacion = $(`#puntuacion-${numero}`);
    this.cartas = [];
    this.puntos = 0;
    this.acciones = {
      reversa: () => {
        sonidos.reversa.play();
        juego.jugadores.reverse();
        app.cambiarSentido();
        juego.jugadorActivo = juego.jugadores.indexOf(this);
        this.terminarTurno();
      },

      pierdeTurno: () => {
        sonidos.pierdeTurno.play();
        this.terminarTurno();
        juego.siguienteJugador();
      },

      "+2": async () => {
        this.terminarTurno();
        await juego.accionRobaCartas(2);
      },

      "+4": async () => {
        await juego.accionComodin("+4");
        juego.accionRobaCartas(4);
      },

      cambiaColor: () => {
        juego.accionComodin("cambiaColor");
      }
    };
  }

  limpiarMano() {
    while (this.mano.childElementCount) {
      this.mano.removeChild(this.mano.lastElementChild);
    }
    this.cartas = [];
  }

  esCPU() {
    return this instanceof CPU;
  }

  cambiarEstado() {
    this.panel.classList.toggle("activo");
  }

  verificarCartas(estadoInicial, carta, indice, cartas) {
    return carta.puedeLanzar(cartas) ? true : estadoInicial;
  }

  puedeJugar() {
    return this.cartas.reduce(this.verificarCartas, false);
  }

  estaActivo() {
    return this === juego.obtenerJugadorActivo();
  }

  añadirCarta(carta) {
    this.mano.appendChild(carta.generar(this));
    this.cartas.push(carta);
  }

  removerCarta(carta) {
    const indice = carta.localizarCarta(this.cartas, carta);
    this.mano.childNodes[indice].remove();
    this.cartas.splice(indice, 1);
  }

  finalizarJugada(carta) {
    if (!carta.esNormal()) this.acciones[carta.valor]();
    else this.terminarTurno();
  }

  async tomarCarta() {
    if (!this.puedeJugar()) {
      await mazo.darCarta(this);
      if (!this.puedeJugar()) {
        juego.siguienteJugador();
      }
    } else {
      Reglas.noPuedeTomar();
    }
  }

  generarGrito() {
    const grito = document.createElement("span");
    grito.textContent = "¡UNO!";
    grito.className = "grito";
    return grito;
  }

  async gritarUNO() {
    const grito = this.generarGrito();
    this.panel.appendChild(grito);
    await esperar(4000);
    grito.remove();
  }

  calcularPuntos() {
    let puntos = 0;
    juego.jugadores.forEach(jugador => {
      if (jugador !== this) {
        jugador.cartas.forEach(carta => {
          puntos += carta.obtenerPuntos();
        });
      }
    });
    return puntos;
  }

  reestablecer() {
    this.cambiarPuntos(-this.puntos);
  }

  cambiarPuntos(puntosASumar) {
    this.puntos += puntosASumar;
    this.puntuacion.textContent = this.puntos;
  }

  ganoJuego() {
    Reglas.ganoJuego(this.nombre);
    juego.reestablecer();
  }

  modificarPuntaje() {
    const puntosRonda = this.calcularPuntos();
    this.cambiarPuntos(puntosRonda);
    if (this.puntos >= 100) {
      this.ganoJuego();
    }
  }

  ganoPartida() {
    Reglas.ganoPartida(this.nombre);
    this.cambiarEstado();
    juego.estadoActual = 0;
    this.modificarPuntaje();
  }

  async terminarTurno() {
    if (this.cartas.length <= 0) {
      this.ganoPartida();
    } else {
      if (this.cartas.length === 1) this.gritarUNO();
      juego.siguienteJugador();
    }
  }

  async robarCartas(cantidad) {
    while (cantidad > 0) {
      await esperar(500);
      await mazo.darCarta(this);
      cantidad--;
    }
  }
}
