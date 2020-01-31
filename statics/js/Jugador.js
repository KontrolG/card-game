class Jugador {
  constructor(nombre, numero) {
    this.nombre = nombre;
    this.numero = numero;
    this.panel = $(`#panel-jugador-${numero}`);
    this.selector = $(`#selector-jugador-${numero}`);
    this.mano = $(`#mano-jugador-${numero}`);
    this.puntuacion = $(`#puntuacion-${numero}`);
    this.cartas = [];
    this.puntos = 0;
  }

  async gritarUNO() {
    const span = document.createElement("span");
    span.className = "grito";
    span.textContent = "¡UNO!";
    span.style.animation = "gritar 4s linear";
    this.panel.appendChild(span);
    await esperar(4000);
    span.remove();
  }
}
