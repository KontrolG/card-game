function esperarColor() {
  return new Promise(resolve => setInterval(function () {
    if (Juego.colorTemporal) {
      clearInterval();
      resolve();
    }
  }, 1))
}

function alternarSelector() {
  const selector = $("#selector-jugador-" + Juego.jugadores[Juego.jugadorActivo].numero);
  selector.classList.toggle("mostrarSelector");
  selector.classList.contains("oculto") ? mostrar(selector) : esconder(selector);
}

function cambiarColor(valor) {
  var color = Juego.colorTemporal.color;
  var descartes = $("#descartes");
  carta = descartes.firstChild;
  carta.src = "statics/img/negro/" + valor + "-" + color + ".png";
  descartes.replaceChild(carta, descartes.firstChild);
  
}

async function robarCartas(cantidad, jugador) {
  while (cantidad > 0) {
    await esperar(500);
    darCarta(jugador);
    cantidad--;
  }
}

async function accionRobaCartas(cantidad) {
  if (Juego.estadoActual === 3) {
    Juego.estadoActual = 4;
    jugadorQueRoba = Juego.jugadores[Juego.jugadorActivo];
    await robarCartas(cantidad, jugadorQueRoba);
    Juego.siguienteJugador();
    Juego.estadoActual = 3;
  }  
}

async function accionComodin(Jugador, valor) {
  Juego.estadoActual = 4;
  mostrarAyuda(Juego.estados[Juego.estadoActual], "Selecciona un color para continuar.");
  alternarSelector();
  await esperarColor();
  alternarSelector();
  cambiarColor(valor);
  Juego.estadoActual = 3;
  mostrarAyuda(Juego.estados[Juego.estadoActual], "");
  terminarTurno(Jugador);
}

var Carta = function (tipo, color, valor) {
  this.tipo = tipo;
  this.color = color;
  this.valor = valor;
}

/* Metodos de cartas de accion. */
const acciones = {
  "reversa": Jugador => {
    new Audio("statics/sounds/reversa2.mp3").play();
    Juego.jugadores.reverse();
    cambiarSentido();
    Juego.jugadorActivo = Juego.jugadores.indexOf(Jugador);
    terminarTurno(Jugador)
  },       
  "pierdeTurno": Jugador => {
    new Audio("statics/sounds/pierdeTurnoW.mp3").play();
    terminarTurno(Jugador);
    Juego.siguienteJugador();
  },  
  "+2": Jugador => {
    terminarTurno(Jugador);
    accionRobaCartas(2);
  },
  "+4": async Jugador => {
    await accionComodin(Jugador, "+4");
    accionRobaCartas(4);
  },
  "cambiaColor": Jugador =>{
    accionComodin(Jugador, "cambiaColor");
  }
}

Carta.prototype.accion = async function (Jugador) {
  if (this.tipo !== "normal") {
    acciones[this.valor](Jugador);
  }
}

Carta.prototype.puedeLanzar = function (cartasJugador) {
  const { esEspecial, mismoColor, mismoValor } = Reglas;
  const { colorTemporal } = Juego;
  var ultimoDescarte = colorTemporal ? colorTemporal : descartes[(descartes.length) - 1];
  var puede = true;
  if (ultimoDescarte) {
    if (esEspecial(this)) {
      puedeLanzarMas4 = true;
      cartasJugador.forEach(carta => {
        if (mismoColor(carta, ultimoDescarte)) {
          puedeLanzarMas4 = false;
        }
      });
      if (this.valor === "+4" && !puedeLanzarMas4) {
        puede = false;
      }
    }
    else if (!(mismoColor(this, ultimoDescarte) || mismoValor(this, ultimoDescarte))) {
      puede = false;
    }
  }
  
  return puede;
}

function calcularPuntos(jugadorGanador) {
  var puntos = 0;
  Juego.jugadores.forEach(function (jugador) {
    if (jugador !== jugadorGanador) {
      jugador.cartas.forEach(function (carta) {
        if (carta.tipo === "accion") {
          puntos += 20;
        } else if (carta.tipo === "comodin") {
          puntos += 50;
        }
      })
    }
  })
  return puntos;
}

function modificarPuntaje(Jugador) {
  var puntosRonda = calcularPuntos(Jugador);
  Jugador.puntos += puntosRonda;
  $("#puntuacion-" + Jugador.numero).textContent = Jugador.puntos;
  if (Jugador.puntos >= 100) {
    new Audio("statics/sounds/fin.mp3").play();
    mostrarCartel("¡" + Jugador.nombre + " ha ganado el juego!", "Pulsa 'JUGAR' para empezar otra ronda.");
  }
}

function terminarTurno(Jugador) {
  if (Jugador.cartas.length <= 0) {
    new Audio("statics/sounds/ganoW.mp3").play();
    mostrarCartel("¡" + Jugador.nombre + " ha ganado!", "Pulsa 'JUGAR' para empezar otra ronda.");
    Juego.alternarJugador();
    Juego.estadoActual = 0;
    modificarPuntaje(Jugador);
  } else {
    if (Jugador.cartas.length === 1) {
      Jugador.gritarUNO();
    }
    Juego.siguienteJugador();
  }
}

Carta.prototype.obtenerJugador = function () {
  return Juego.jugadores.find(({ cartas }) => {
    let poseeLaCarta = false;
    cartas.forEach((carta) => {
      if (carta === this) {
        poseeLaCarta = true;
      }
    })
    return poseeLaCarta;
  });
}

Carta.prototype.lanzar = function () {
  const Jugador = this.obtenerJugador();
  
  if (Juego.estadoActual === 3) {
    if (Juego.jugadores.indexOf(Jugador) === Juego.jugadorActivo) {
      if (this.puedeLanzar(Jugador.cartas)) {
        Juego.colorTemporal = false;
        descartes.push(this);
        if ($("#descartes").childElementCount) {
          $("#descartes").removeChild($("#descartes").firstChild);
        }
        $("#descartes").appendChild(generarCarta(this));
        indice = localizarCarta(Jugador.cartas, this);
        $(`#mano-jugador-${Jugador.numero}`).childNodes[indice].remove();
        Jugador.cartas.splice(indice, 1);
        new Audio("statics/sounds/lanzarW.mp3").play();
        if (Reglas.esDeAccion(this) || Reglas.esEspecial(this)) {
          this.accion(Jugador);
        } else {
          terminarTurno(Jugador);
        }
      } else {
        new Audio("statics/sounds/invalidoW.mp3").play();
        this.valor === "+4" ?
        mostrarAyuda("No puedes lanzar", "Solo puedes lanzar el +4 si no posees cartas del mismo color.") :
        mostrarAyuda("No puedes lanzar", "Escoje una carta que sea del mismo color o mismo valor");
      }
    } else {
      new Audio("statics/sounds/invalidoW.mp3").play();
      mostrarAyuda("No es tu turno", "Espera a que sea tu turno.")
    }
  } else {
    new Audio("statics/sounds/invalidoW.mp3").play();
    mostrarAyuda("No puedes realizar esta acción", "En este momento no puedes llevar a cabo la acción deseada.")
  }
}

function localizarCarta(cartasJugador, Carta) {
  return cartasJugador.indexOf(Carta);
}