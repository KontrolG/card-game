"use strict";
/*
Para la CPU:
Evaluar los siguientes aspectos de la mano del jugador
1.- Cantidad de cartas de determinado color.
2.- Cartas que puede jugar esta ronda.
3.- Cartas normales, de acción y comodines. 
*/
class CPU extends Jugador {
  constructor(numero) {
    super(`CPU ${numero}`, numero);
    this.puntosPorTipo = {
      normal: 0.25,
      accion: 0.75,
      comodin: 1
    };
  }

  ordenarPorPuntuacion(arreglo) {
    return arreglo.sort((a, b) => a[1] < b[1]);
  }

  jugarTurno() {
    const [carta] = this.obtenerPrimeraOpcion();
    carta.lanzar();
    if (this.esperandoColor()) this.seleccionarColor();
  }

  obtenerCartasPosibles() {
    return this.cartas.map((carta, indice) => [
      carta,
      this.calcularPuntaje(indice)
    ]);
  }

  noEsBuenaOpcion(carta, cartas) {
    return carta.valor === "cambiaColor" || !carta.puedeLanzar(cartas);
  }

  conseguirOtraOpcion(primeraOpcion, posiblesCartas, cartas) {
    return posiblesCartas.find(([carta]) => {
      return carta !== primeraOpcion[0] ? carta.puedeLanzar(cartas) : false;
    });
  }

  buscarMejor(primeraOpcion, posiblesCartas, cartas) {
    const otraOpcion = this.conseguirOtraOpcion(
      primeraOpcion,
      posiblesCartas,
      cartas
    );
    return otraOpcion ? otraOpcion : primeraOpcion;
  }

  elegirOpcion(posiblesCartas, cartas) {
    let primeraOpcion = posiblesCartas[0];
    if (this.noEsBuenaOpcion(primeraOpcion[0], cartas))
      primeraOpcion = this.buscarMejor(primeraOpcion, posiblesCartas, cartas);
    return primeraOpcion;
  }

  obtenerPrimeraOpcion() {
    const { cartas } = this;
    const posiblesCartas = this.obtenerCartasPosibles();
    this.ordenarPorPuntuacion(posiblesCartas);
    return this.elegirOpcion(posiblesCartas, cartas);
  }

  calcularPuntaje(indice) {
    const carta = this.cartas[indice];
    let puntaje = this.puntuacionPorColor(carta);
    puntaje += this.puntosPorTipo[carta.tipo];
    return carta.puedeLanzar(this.cartas) ? puntaje : 0;
  }

  posicionPorColor(carta) {
    const coloresEnMano = this.contarColores();
    const posicion = coloresEnMano.findIndex(
      ([color, cantidad]) => carta.color === color && cantidad > 0
    );
    return posicion < 0 ? 4 : posicion;
  }

  puntuacionPorColor(carta) {
    const posicionColor = this.posicionPorColor(carta);
    return 1 - posicionColor * 0.25;
  }

  evaluarColor(colores, carta) {
    for (const color of colores) color[1] += color[0] === carta.color ? 1 : 0;
    return colores;
  }

  contarColores() {
    const cartasPorColor = this.cartas.reduce(this.evaluarColor, [
      ["verde", 0],
      ["amarillo", 0],
      ["azul", 0],
      ["rojo", 0]
    ]);

    return this.ordenarPorPuntuacion(cartasPorColor);
  }

  esperandoColor() {
    return this.selector.classList.contains("mostrarSelector");
  }

  async alternarCuadro(cuadroColor) {
    await esperar(1000);
    cuadroColor.classList.toggle("hover");
  }

  async cambiarColorTemporal(cuadroColor) {
    await esperar(1000);
    juego.cambiarColorTemporal(cuadroColor.classList[0]);
  }

  async seleccionarCuadro(cuadroColor) {
    await this.alternarCuadro(cuadroColor);
    await this.cambiarColorTemporal(cuadroColor);
    await this.alternarCuadro(cuadroColor);
  }

  async seleccionarColor() {
    const colorMasRepetido = this.contarColores(this.cartas)[0][0];
    const cuadroColor = $(
      `#selector-jugador-${this.numero} .${colorMasRepetido}`
    );
    await this.seleccionarCuadro(cuadroColor);
  }

  async revisarMano() {
    if (!this.puedeJugar()) {
      await mazo.pescarCarta();
      await esperar(1000);
    }
    if (this.puedeJugar()) {
      this.jugarTurno();
    }
  }

  async jugar() {
    await juego.puedeContinuar();
    if (this.estaActivo()) {
      await this.revisarMano();
    }
  }
}
