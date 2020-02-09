"use strict";
/* 
Para el juego:
Acciones <- ¿poder encadenar acciones?
*/

const juego = {
  jugadores: [new Jugador("German", 0), new CPU(1), new CPU(2), new CPU(3)],
  estados: [
    "No iniciado",
    "Barajando...",
    "Repartiendo...",
    "Jugando",
    "Esperando"
  ],
  jugadorActivo: 0,
  estadoActual: 0,
  colorTemporal: false,

  async puedeContinuar() {
    await esperar(800);
    await esperar(10, () => this.estadoActual === 3);
    await esperar(800);
  },

  cambioColor() {
    return this.colorTemporal;
  },

  obtenerJugadorActivo() {
    return this.jugadores[this.jugadorActivo];
  },

  prepararJugadores() {
    this.jugadores.forEach(jugador => {
      jugador.limpiarMano();
    });
  },

  jugadorAleatorio() {
    return Math.floor(Math.random() * (this.jugadores.length - 1));
  },

  prepararJuego() {
    this.jugadorActivo = this.jugadorAleatorio();
    this.estadoActual = 0;
    this.colorTemporal = false;
  },

  cambiarColorTemporal(color) {
    this.colorTemporal = new Carta("temporal", color, "ninguno");
  },

  elegirColor(event) {
    if (this.estadoActual === 4) {
      this.colorTemporal = new Carta(
        "temporal",
        event.target.classList[0],
        "ninguno"
      );
    } else {
      Reglas.enEspera();
    }
  },

  reestablecer() {
    this.jugadores.forEach(jugador => {
      jugador.reestablecer();
    });
  },

  inicializar() {
    this.prepararJugadores();
    this.prepararJuego();
    mazo.preparar();
  },

  jugar() {
    if (this.estadoActual === 0) {
      app.esconder($(".overlap"));
      this.inicializar();
    }
  },

  proceder() {
    this.estadoActual++;
    this.mostrarEstado();
  },

  mostrarEstado() {
    app.mostrarAyuda(this.estados[this.estadoActual], "");
  },

  cambiarSiguiente() {
    if (this.jugadorActivo >= this.jugadores.length - 1) {
      this.jugadorActivo = 0;
    } else {
      this.jugadorActivo++;
    }
  },

  cambiarJugador() {
    this.obtenerJugadorActivo().cambiarEstado();
    this.cambiarSiguiente();
    this.obtenerJugadorActivo().cambiarEstado();
  },

  jugarTurno() {
    const jugador = this.obtenerJugadorActivo();
    if (jugador.esCPU()) {
      jugador.jugar();
    }
  },

  siguienteJugador() {
    this.cambiarJugador();
    this.jugarTurno();
  },

  async accionRobaCartas(cantidad) {
    if (this.estadoActual === 3) {
      this.estadoActual = 4;
      const jugadorQueRoba = this.obtenerJugadorActivo();
      await jugadorQueRoba.robarCartas(cantidad);
      this.siguienteJugador();
      this.estadoActual = 3;
    }
  },

  solicitarColor() {
    this.estadoActual = 4;
    app.mostrarAyuda(
      this.estados[this.estadoActual],
      "Selecciona un color para continuar."
    );
    app.alternarSelector();
  },

  modificarColor(valor) {
    app.alternarSelector();
    mazo.cambiarColor(valor);
    this.estadoActual = 3;
  },

  finalizarTurno() {
    this.mostrarEstado();
    juego.obtenerJugadorActivo().terminarTurno();
  },

  async accionComodin(valor) {
    this.solicitarColor();
    await esperar(10, () => this.colorTemporal);
    this.modificarColor(valor);
    this.finalizarTurno();
  },

  comenzar() {
    this.estadoActual++;
    this.obtenerJugadorActivo().cambiarEstado();
    app.mostrarAyuda(
      "Empezó el juego",
      "Selecciona una carta de tu mano para lanzarla."
    );
  }
};
