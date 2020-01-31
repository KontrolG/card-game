/* 
Para el juego:
Acciones <- ¿poder encadenar acciones?
*/

// Función para facilitar la recuperación de elementos del DOM.
function $(selector) {
  let elementos = document.querySelectorAll(selector)
  return elementos.length > 1 ? elementos : elementos[0];
}

Juego = {
  jugadorActivo: 0,
  jugadores: [new Jugador("German", 0), new Jugador("CPU 1", 1), new Jugador("CPU 2", 2), new Jugador("CPU 3", 3)],
  estados: ["No iniciado", "Barajando...", "Repartiendo...", "Jugando", "Esperando"],
  estadoActual: 0,
  colorTemporal: false,
  esperarTurno() {
    return new Promise((resolve) => {
      setInterval(() => {
        if (this.estadoActual === 3) {
          resolve()
        }
      }, 1);
    })
  },
  obtenerJugadorActivo() {
    return this.jugadores[this.jugadorActivo];
  },
  alternarJugador() {
    $(`#mano-jugador-${this.obtenerJugadorActivo().numero}`).classList.toggle("activo");
  },
  siguienteJugador: async function () {
    this.alternarJugador();
    if (this.jugadorActivo >= this.jugadores.length - 1) {
      this.jugadorActivo = 0;
    } else {
      this.jugadorActivo++;
    }
    this.alternarJugador();
    if (this.obtenerJugadorActivo().nombre !== "German") {
      await esperar(750);
      await this.esperarTurno();
      await esperar(750);
      CPU.jugar();
    }
  }
}

/* Juego = (function () {
  let jugadorActivo = 0;
  const jugadores = [new Jugador("German", 0), new Jugador("CPU 1", 1), new Jugador("CPU 2", 2), new Jugador("CPU 3", 3)];
  const estados = ["No iniciado", "Barajando...", "Repartiendo...", "Jugando", "Esperando"];
  let estadoActual = 0;
  let colorTemporal = false;

  esperarTurno = () => {
    return new Promise((resolve) => {
      setInterval(() => {
        if (this.estadoActual === 3) {
          resolve()
        }
      }, 1);
    })
  };
  obtenerJugadorActivo = () => {
    return this.jugadores[this.jugadorActivo];
  };

  return {
    obtenerEstado: () => {
      return estados[estadoActual];
    },
    alternarJugador: () => {
      $(`#mano-jugador-${this.obtenerJugadorActivo.numero}`).classList.toggle("activo");
    },
    siguienteJugador: async () => {
      this.alternarJugador();
      if (this.jugadorActivo >= this.jugadores.length - 1) {
        this.jugadorActivo = 0;
      } else {
        this.jugadorActivo++;
      }
      this.alternarJugador();
      if (obtenerJugadorActivo.nombre !== "German") {
        await esperar(1000);
        await this.esperarTurno();
        await esperar(1000);
        CPU.jugar();
      }
    }
  }
  
})(); */

function mostrarAyuda(titulo, cuerpo) {
  const ayuda = $(".ayuda");
  $(".ayuda>h3").textContent = titulo;
  $(".ayuda>p").textContent = cuerpo;
  mostrar(ayuda);
  setTimeout(() => {
    esconder(ayuda);
  }, 3000);
}

function mostrarCartel(titulo, cuerpo) {
  $(".overlap").classList.remove("ocultar");
  $(".overlap").classList.remove("oculto");
  $(".overlap>h2").textContent = titulo;
  $(".overlap>p").textContent = cuerpo;
}

function cambiarSentido() {
  let flecha1 = $("#flecha1");
  let flecha2 = $("#flecha2");
  rotacionFlecha1 = flecha1.style.transform === "rotateY(0deg) rotateX(0deg)" ? "rotateY(180deg)" : "rotateY(0deg)";
  rotacionFlecha2 = flecha2.style.transform === "rotateY(180deg) rotateX(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
  flecha1.style.transform = `${rotacionFlecha1} rotateX(0deg)`;
  flecha2.style.transform = `${rotacionFlecha2} rotateX(180deg)`;
  if (rotacionFlecha1 !== "rotateY(0deg)") {
    flecha1.style.marginLeft = "-15px";
    flecha2.style.marginLeft = "0px";
  } else {
    flecha1.style.marginLeft = "0px";
    flecha2.style.marginLeft = "-15px";
  }
}

mostrarAyuda(Juego.estados[Juego.estadoActual], "");

function prepararJugadores() {
  Juego.jugadores.forEach(jugador => {
    jugador.cartas = [];
  });
}

function prepararManos() {
  Juego.jugadores.forEach(jugador => {
    var mano = $("#mano-jugador-" + jugador.numero)    
    while (mano.childElementCount) {
      mano.removeChild(mano.lastChild)
    }    
  });
}

function prepararJuego() {
  Juego.jugadorActivo = Math.floor(Math.random() * (Juego.jugadores.length - 1));
  Juego.estadoActual = 0;
  Juego.colorTemporal = false;
}

function inicializar() {
  prepararManos();
  prepararJugadores();
  prepararJuego();
  crearMazo(); 
}

$(".jugar").addEventListener("click", function () {
  if (Juego.estadoActual === 0) {
    esconder($(".overlap"));
    configurarSelectores();
    inicializar();
  }
});

/* $(".reiniciar").addEventListener("click", function () {
  inicializar();
}); */

$(".cerrar-ayuda").addEventListener("click", (evento) => esconder(evento.target.parentNode))

function configurarSelectores() {
  var selectores = $(".selector-colores");

  for (let index = 0; index < selectores.length; index++) {
    selectores[index].addEventListener("click", function (event) {
      if (Juego.estadoActual === 4) {
        Juego.colorTemporal = new Carta("temporal", event.target.classList[0], "ninguno");
      } else {
        mostrarAyuda("No puedes realizar esta acción", "En este momento no puedes llevar a cabo la acción deseada.")
      }
    })
  }
}

function pescarCarta() {
  if (mazo.length === 0) {
    reponerMazo();
  } else {
    if (Juego.estadoActual === 3) {
      const { jugadores, jugadorActivo } = Juego;
      tomarCarta(jugadores[jugadorActivo]);
    } else {
      mostrarAyuda("No puedes realizar esta acción", "En este momento no puedes llevar a cabo la acción deseada.")
    }
  }
}

$("#mazo").addEventListener("click", pescarCarta);

async function esconder(DOMObject) {
  DOMObject.classList.add("ocultar");
  await esperar(500);
  DOMObject.classList.add("oculto");
}

async function mostrar(DOMObject) {
  DOMObject.classList.remove("oculto");
  await esperar(0);
  DOMObject.classList.remove("ocultar");
}

function generarCarta(Carta, jugador /* = {nombre: "German"} */) {
  imagen = document.createElement("img");
  imagen.classList.add("carta");
  imagen.src = /* jugador.nombre !== "German" ? `statics/img/hide.png` : */ ruta(Carta.color, Carta.valor);
  imagen.addEventListener("click", Carta.lanzar.bind(Carta, jugador))
  return imagen;
}

function ruta(color, valor) {
  return `statics/img/${color}/${valor}.png`;
}

function esperar(milisegundos) {
  return new Promise(resolve => setTimeout(resolve, milisegundos))
}