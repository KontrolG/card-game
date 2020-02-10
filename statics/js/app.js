"use strict";

// Función para facilitar la recuperación de elementos del DOM.
function $(selector) {
  let elementos = document.querySelectorAll(selector);
  return elementos.length > 1 ? elementos : elementos[0];
}

function esperar(milisegundos, condicion = () => true) {
  return new Promise(resolve => {
    const intervalo = setInterval(() => {
      if (condicion()) {
        clearInterval(intervalo);
        resolve();
      };
    }, milisegundos);
  });
}

const app = {
  ayuda: $(".ayuda"),
  cerrarAyuda: $(".cerrar-ayuda"),
  overlap: $(".overlap"),
  flechas: [$("#flecha1"), $("#flecha2")],
  mazo: $("#mazo"),

  async esconder(DOMObject) {
    DOMObject.classList.add("ocultar");
    await esperar(500);
    DOMObject.classList.add("oculto");
  },

  async mostrar(DOMObject) {
    DOMObject.classList.remove("oculto");
    DOMObject.classList.remove("ocultar");
    await esperar(3000);
  },

  async mostrarAyuda(titulo, cuerpo) {
    this.modificarAyuda(titulo, cuerpo);
    await this.animacionMostrar(this.ayuda);
  },

  modificarAyuda(titulo, cuerpo) {
    this.ayuda.children[0].textContent = titulo;
    this.ayuda.children[2].textContent = cuerpo;
  },

  async animacionMostrar(elemento) {
    await this.mostrar(elemento);
    await esperar(3000, () => !this.ayuda.classList.contains("mantener"));
    this.esconder(elemento);
  },

  mantenerAyuda() {
    app.ayuda.classList.toggle("mantener");
  },

  mostrarCartel(titulo, cuerpo) {
    this.overlap.classList.remove("ocultar", "oculto");
    this.overlap.children[0].textContent = titulo;
    this.overlap.children[1].textContent = cuerpo;
  },

  cambiarSentido() {
    const [flecha1, flecha2] = this.flechas;
    flecha1.classList.toggle("rotar");
    flecha2.classList.toggle("rotar");
  },

  async mezclarMazo() {
    this.mazo.classList.toggle("mezclando");
    await esperar(4000);
    this.mazo.classList.toggle("mezclando");
  },

  alternarSelector() {
    const selector = juego.obtenerJugadorActivo().selector;
    selector.classList.toggle("mostrarSelector");
    selector.classList.contains("oculto")
      ? app.mostrar(selector)
      : app.esconder(selector);
  },

  preparar() {
    for (const { nombre, identificador } of juego.jugadores) {
      identificador.textContent = nombre;
    };
  }
};
