const API_URL = "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=c1e1ec18e68745078111d2b9512b47dd";

const montoInput = document.getElementById("monto");
const monedaOrigenSelect = document.getElementById("monedaOrigen");
const monedaDestinoSelect = document.getElementById("monedaDestino");
const convertirBtn = document.getElementById("convertirBtn");
const resultadoTexto = document.getElementById("resultado");
const resultadoConvertidoInput = document.getElementById("resultadoConvertido");

let tasasDeCambio = {};

async function obtenerTasas() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    tasasDeCambio = data.rates;

    llenarSelects(Object.keys(tasasDeCambio));
  } catch (error) {
    console.error("Error al obtener las tasas de cambio:", error);
    resultadoTexto.textContent = "Error al obtener datos de la API.";
  }
}

function llenarSelects(monedas) {
  monedas.forEach((moneda) => {
    const optionOrigen = document.createElement("option");
    optionOrigen.value = moneda;
    optionOrigen.textContent = moneda;

    const optionDestino = optionOrigen.cloneNode(true);

    monedaOrigenSelect.appendChild(optionOrigen);
    monedaDestinoSelect.appendChild(optionDestino);
  });

  monedaOrigenSelect.value = "USD";
  monedaDestinoSelect.value = "EUR";
}

function convertirMoneda() {
  const monto = parseFloat(montoInput.value);
  const monedaOrigen = monedaOrigenSelect.value;
  const monedaDestino = monedaDestinoSelect.value;

  if (isNaN(monto) || monto <= 0) {
    resultadoTexto.textContent = "Por favor, ingresa una cantidad válida.";
    return;
  }

  if (!tasasDeCambio[monedaOrigen] || !tasasDeCambio[monedaDestino]) {
    resultadoTexto.textContent = "Moneda seleccionada no válida.";
    return;
  }

  const tasaOrigen = parseFloat(tasasDeCambio[monedaOrigen]);
  const tasaDestino = parseFloat(tasasDeCambio[monedaDestino]);
  const resultado = (monto / tasaOrigen) * tasaDestino;

  resultadoTexto.textContent = `${monto} ${monedaOrigen} = ${resultado.toFixed(2)} ${monedaDestino}`;
  resultadoConvertidoInput.value = resultado.toFixed(2);
}

convertirBtn.addEventListener("click", convertirMoneda);

obtenerTasas();
