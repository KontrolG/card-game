/*
Para la CPU:
Evaluar los siguientes aspectos de la mano del jugador
1.- Cantidad de cartas de determinado color.
2.- Cartas que puede jugar esta ronda.
3.- Cartas normales, de acción y comodines. 
*/
'use strict';

const CPU = (() => {
  
  const puntosPorTipo = {
    "normal": 0.25,
    "accion": 0.75,
    "comodin": 1,
  }

  function contarColores(cartasJugador) {
    const cartasPorColor = cartasJugador.reduce((prev, cur) => {
      for (let index = 0; index < prev.length; index++) {
        prev[index][1] += prev[index][0] === cur.color ? 1 : 0;
      }
      return prev;
    }, [["verde", 0], ["amarillo", 0], ["azul", 0], ["rojo", 0]])
    
    cartasPorColor.sort((a, b) => a[1] < b[1]);
    return cartasPorColor;
  }

  function puntuacionPorColor(cartasJugador, carta) {
    const coloresEnMano = contarColores(cartasJugador);
    let posicionColor = coloresEnMano.findIndex(([color, cantidad]) => carta.color === color && cantidad > 0);
    posicionColor = posicionColor < 0 ? 4 : posicionColor;
    return 1 - posicionColor * 0.25;
  }

  function calcularPuntaje(cartasJugador, carta) {
    let puntaje = puntuacionPorColor(cartasJugador, carta);
    puntaje += puntosPorTipo[carta.tipo];
    return carta.puedeLanzar(cartasJugador) ? puntaje : 0;
  }  

  function obtenerPrimeraOpcion({cartas}) {
    const posiblesCartas = cartas.map(carta => [carta, calcularPuntaje(cartas, carta)]);
    posiblesCartas.sort((a, b) => a[1] < b[1]);
    let primeraOpcion = posiblesCartas[0];
    if (primeraOpcion[0].valor === "cambiaColor" || !primeraOpcion[0].puedeLanzar(cartas)) {
      const otraOpcion = posiblesCartas.find(([carta]) => {
        return carta !== primeraOpcion[0] ? carta.puedeLanzar(cartas) : false;
      });
  
      primeraOpcion = otraOpcion ? otraOpcion : primeraOpcion;
    }

    return primeraOpcion;
  }

  async function seleccionarColor(jugador) {
    const colorMasRepetido = contarColores(jugador.cartas)[0][0];
    const cuadroColor = $(`#selector-jugador-${jugador.numero} .${colorMasRepetido}`);
    await esperar(1000);
    cuadroColor.classList.add("hover");
    await esperar(1000);
    cuadroColor.click();
    await esperar(1000);
    cuadroColor.classList.remove("hover");
  }

  function jugarTurno(jugador) {
    const [carta] = obtenerPrimeraOpcion(jugador);
    carta.lanzar();
    if ($("#selector-jugador-" + jugador.numero).classList.contains("mostrarSelector")) {
      seleccionarColor(jugador);
    }
  }

  return {
    jugar: async () => {
      const jugador = Juego.jugadores[Juego.jugadorActivo];
      if (jugador.nombre !== "German") {
        if (puedeJugar(jugador)) {
          jugarTurno(jugador);
        } else {
          pescarCarta();
          if (puedeJugar(jugador)) {
            await esperar(1000);
            jugarTurno(jugador);
          }
        }
      }
    }
  }
})();