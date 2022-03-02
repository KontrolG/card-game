"use strict";
/* 
Para el juego:
Acciones <- ¿poder encadenar acciones?
*/

const juego = {
  jugadores: [new Jugador("Jugador", 0), new CPU(1), new CPU(2), new CPU(3)],
  jugadorActivo: 0,
  estadoActual: "No iniciado",
  colorTemporal: false,

  async puedeContinuar() {
    await esperar(800);
    await esperar(10, () => this.estadoActual === "Jugando");
    await esperar(800);
  },

  cambioColor() {
    return this.colorTemporal;
  },

  obtenerJugadorActivo() {
    return this.jugadores[this.jugadorActivo];
  },

  prepararJugadores() {
    this.jugadores.forEach((jugador) => {
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
    if (this.estadoActual === "Esperando") {
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
    this.jugadores.forEach((jugador) => {
      jugador.reestablecer();
    });
  },

  inicializar() {
    this.prepararJugadores();
    this.prepararJuego();
    mazo.preparar();
  },

  jugar() {
    if (this.estadoActual === "No iniciado") {
      app.esconder($(".overlap"));
      this.inicializar();
    }
  },

  proceder(estado) {
    this.estadoActual = estado;
    this.mostrarEstado();
  },

  mostrarEstado() {
    app.mostrarAyuda(this.estadoActual, "");
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
    if (jugador.esCPU()) jugador.jugar();
    else {
      queueMicrotask(() => {
        if (
          mazo.ultimoDescarte().valor !== "+4" &&
          this.estadoActual === "Jugando"
        )
          app.mostrarAyuda(
            `Es el turno de ${jugador.nombre}`,
            "Selecciona una carta para jugar."
          );
      });
    }
  },

  siguienteJugador() {
    this.cambiarJugador();
    this.jugarTurno();
  },

  async accionRobaCartas(cantidad) {
    if (this.estadoActual === "Jugando") {
      this.estadoActual = "Esperando";
      const jugadorQueRoba = this.obtenerJugadorActivo();
      await jugadorQueRoba.robarCartas(cantidad);
      this.siguienteJugador();
      this.estadoActual = "Jugando";
    }
  },

  solicitarColor() {
    this.estadoActual = "Esperando";
    app.mostrarAyuda(this.estadoActual, "Selecciona un color para continuar.");
    app.alternarSelector();
  },

  modificarColor(valor) {
    app.alternarSelector();
    mazo.cambiarColor(valor);
    this.estadoActual = "Jugando";
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

  async comenzar() {
    this.estadoActual = "Jugando";
    this.obtenerJugadorActivo().cambiarEstado();
    await app.mostrarAyuda(
      "Empezó el juego",
      "Selecciona una carta de tu mano para lanzarla."
    );
  }
};
