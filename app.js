const pisoSelect = document.getElementById('pisoActual');
const destinoSelect = document.getElementById('destino');
const contenedorPlano = document.getElementById('contenedorPlano');
let flecha = null;
let posX = 100;
let posY = 100;
let isSensorActive = false;
let animationFrameId = null;
let pathRutaActual = null;
let svgDoc = null;
let sensitivity = 0.5;
let initialBeta = null;
let initialGamma = null;
let lastCenterTime = 0;
let targetCenterX = 0;
let targetCenterY = 0;

const destinosPorPiso = {
  1: ["Seleccione", "Direccion", "Prefectura", "Sala de Maestros", "Cubiculos Planta Baja", "Banos", "Area Medica", "Dentista", "Zona puma"],
  2: ["Seleccione", "Aula 1", "Aula 2", "Aula 3", "Aula 32", "Banos", "Competitividad", "Coronel", "Cubículo Planta 2", "Laboratorio Industrial", "Laboratorio Magna", "Laboratorio TI", "Oficina Grande", "Pachuca", "Sala de capacitación", "Secretaría Académica"],
  3: ["Seleccione", "Aula 7", "Aula 8", "Aula 9", "Aula 10", "Aula 11", "Aula 12", "Aula 13", "Aula 14", "Aula 15", "Aula 16", "Aula 17", "Aula 18", "Aula 19", "Aula 20", "Aula 21", "Aula 22", "Aula 23", "Aula 24", "Aula 25", "Banos", "Ciencias basicas", "Cisco 2", "Cisco1", "Laboratorio De Electronica"]
};

const rutas = {
    "1_Seleccione":"",
    "1_Banos": "m 909.76033,565.74701 -1.6304,-123.91001 158.14827,1.6304 1.6304,58.69421",
    "1_Area Medica": "M 914.65151,565.74701 911.39072,246.18962 810.30624,242.92883",
    "1_Prefectura": "m 912.25747,569.32039 -2.24142,-275.69452 -198.36557,-2.24142 -1.12071,-7.84497",
    "1_Cubiculos Planta Baja": "M 912.25747,567.07897V 442.68022l -137.84726,-1.12071v 23.5349",
    "1_Zona puma": "M 912.12121,569.69697 906.06061,296.9697H 142.42424l -1.51515,-100",
    "1_Sala de Maestros": "M 913.7931,567.24138 908.62069,405.17241 44.827586,401.72414v 65.51724",
    "1_Direccion": "m 914.49889,568.19968 -2.24142,-277.93594 -467.33583,1.12071 1.12071,-10.08639",
    "1_Dentista": "m 915.6196,568.19968 -5.60355,-345.17851 -99.74314,-1.1207",
    
    "2_Seleccione":"",
    "2_Banos":"m 617.11137,78.853119 0.8571,29.141371h 55.71144V 53.997245",
    "2_Aula 1": "m 616.66667,77.777778 0.79365,175.396822 -263.49207,0.79365 v 16.66667",
    "2_Aula 2": "m 618.25397,76.984127 -1.5873,182.539683 -323.80953,1.5873v 11.11111",
    "2_Aula 3": "m 618.25397,76.984127 1.5873,180.952383 -386.50794,2.38095v 11.90476",
    "2_Aula 32": "m 611.86441,77.966102 -2.54238,179.661018 -137.28813,2.54237 -0.84746,22.0339 15.25424,0.84746", 
    "2_Competitividad": "m 615.45455,80 0.90909,70 -150,-0.90909 0.90909,-44.54546L 443.63636,110 481.81818,101.81818 496.36364,90 482.72727,101.81818 500.90909,110",
    "2_Coronel": "M 613.25301,77.108434V 146.98795L 19.277108,145.78313v -37.3494H 90.361446V 46.987952H 65.060241",
    "2_Cubículo Planta 2": "m 615.18325,78.534031 -0.52356,32.460729 h 158.63874 l -1.04712,23.03665 56.5445,-0.52356 -0.52356,-14.65968",
    "2_Laboratorio Industrial": "m 616.36364,75.454545 1.81818,70.000005h -350l 4.54545,-22.72728",
    "2_Laboratorio Magna": "m 614.10256,76.923077 -0.64102,184.615383 -507.05128,0.64103 0.64102,10.25641",
    "2_Laboratorio TI": "m 618.18182,77.272727 2.30011,62.486313 -602.409641,-1.20482 1.204819,-34.93976 h 44.578314",
    "2_Oficina Grande": "m 616.10169,76.271186 0.84746,163.559324 488.13555,2.54237 -0.8474,-123.72881",
    "2_Pachuca": "m 613.55932,77.118644 -3.38983,180.508476 -137.28813,0.84746v 38.98305",
    "2_Sala de capacitación": "m 616.94915,77.118644 1.69492,183.898306 -161.01695,0.84746 0.84746,20.33898 -16.94916,0.84746",
    "2_Secretaría Académica": "M 618.18182,75.454545 619.09091,120.90909 740,120l -0.90909,132.72727 191.81818,1.81818 0.90909,18.18182",
      
    "3_Seleccione": "",
    "3_Aula 7": "m 605.22388,86.567164v 40.298506l 250,-0.74627V 100l 50,0.74627v -9.701494",
    "3_Aula 8": "m 604.47761,87.313433v 37.313437l 244.77612,2.2388 0.74627,-11.19403 68.65672,0.74627 0.74627,-26.865671",
    "3_Aula 9": "m 604.2735,85.470085 -0.8547,42.735045 250.42735,-0.8547v -17.94872l 189.74355,0.8547 -0.8547,-20.51282",
    "3_Aula 10": "m 604.21053,88.421053 -2.10527,34.736837 244.21053,2.10527 1.05263,-25.26316 210.52628,1.05263 -1.0526,-12.631577",
    "3_Aula 11": "m 604.8,86.4v 151.2l 208,6.4 -0.8,12.8 124,0.8v 8",
    "3_Aula 12": "m 600.8,87.2 1.6,156.8 268,4 1.6,20",
    "3_Aula 13": "m 604,86.4 -0.8,160.8 252.8,2.4 1.6,19.2",
    "3_Aula 14": "M 603.2,85.6 601.6,264 572,263.2 573.6,280",
    "3_Aula 15": "M 600.8,85.6 596,270.4h -87.2v 9.6",
    "3_Aula 16": "m 604,84.8 -3.2,184H 492v 9.6",
    "3_Aula 17": "m 602.4,86.4 3.2,183.2 -219.2,-0.8 0.8,10.4",
    "3_Aula 18": "m 602.4,87.2 -1.6,182.4 -232,-0.8V 280",
    "3_Aula 19": "m 604,84.8 -1.6,180H 273.6v 12",
    "3_Aula 20": "m 602.4,86.4 0.8,176.8 -341.6,1.6v 46.4",
    "3_Aula 21": "m 602.4,88 0.8,183.2 -353.6,-1.6 -1.6,37.6",
    "3_Aula 22": "m 603.2,85.6 -0.8,180.8 -369.6,0.8 1.6,12",
    "3_Aula 23": "m 604.90196,80.392157 -0.98039,190.196083 -420.58824,0.98039v 10.78431",
    "3_Aula 24": "m 603.92157,85.294118 -1.96079,184.313722 -478.43137,-0.98039 -0.98039,13.72549",
    "3_Aula 25": "m 601.96078,86.27451 0.9804,180.39216H 61.764706l -1.960784,15.68627",
    "3_Banos": "m 603.92157,86.27451 0.98039,36.27451 64.70588,0.98039 2.94118,-58.823528",
    "3_Ciencias basicas": "m 604.90196,87.254902 -2.94118,166.666668 -162.74509,2.94118 2.94117,-143.13726",
    "3_Cisco 2": "m 605.88235,87.254902 0.9804,161.764708 -182.35295,1.96078 2.94118,-156.862743",
    "3_Cisco1": "M 605.88235,87.254902V 249.01961l -186.27451,2.94117 2.94118,-149.0196H 275.4902V 91.176471",
    "3_Laboratorio De Electronica": "m 606.86275,88.235294 -2.94118,164.705886 -373.52941,0.98039 4.90196,-135.29412",
};

function actualizarDestinos() {
  const piso = pisoSelect.value;
  destinoSelect.innerHTML = '';
  destinosPorPiso[piso].forEach(dest => {
    const option = document.createElement('option');
    option.value = dest;
    option.textContent = dest;
    destinoSelect.appendChild(option);
  });
}

function cargarPlano() {
  const piso = pisoSelect.value;
  fetch(`planos/plano_piso${piso}.svg`)
    .then(res => res.text())
    .then(svg => {
      contenedorPlano.innerHTML = svg;
      dibujarRuta();
    })
    .catch(err => {
      console.error('Error al cargar el plano:', err);
      contenedorPlano.innerHTML = '<p>Error al cargar el plano. Intente nuevamente.</p>';
    });
}

function dibujarRuta() {
  const piso = pisoSelect.value;
  const destino = destinoSelect.value;
  const keyRuta = `${piso}_${destino}`;
  const pathRuta = rutas[keyRuta];

  // Limpiar elementos anteriores
  const rutaAnterior = contenedorPlano.querySelector('#rutaIndicada');
  if (rutaAnterior) rutaAnterior.remove();
  const flechaAnterior = contenedorPlano.querySelector('#flechita');
  if (flechaAnterior) flechaAnterior.remove();

  if (!pathRuta) return;

  const svg = contenedorPlano.querySelector('svg');
  if (!svg) return;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathRuta);
  path.setAttribute("stroke", "red");
  path.setAttribute("stroke-width", (piso === "2" || piso === "3") ? 0.8 : 5);
  path.setAttribute("fill", "none");
  path.setAttribute("id", "rutaIndicada");
  svg.appendChild(path);

  const puntoInicial = path.getPointAtLength(0);
  flecha = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  flecha.setAttribute("r", "7");
  flecha.setAttribute("fill", "blue");
  flecha.setAttribute("id", "flechita");
  flecha.setAttribute("cx", puntoInicial.x);
  flecha.setAttribute("cy", puntoInicial.y);
  svg.appendChild(flecha);
  
  // Resetear posición y valores iniciales
  posX = puntoInicial.x;
  posY = puntoInicial.y;
  initialBeta = null;
  initialGamma = null;

  // Centrar la vista en el punto inicial
  centrarVista(puntoInicial.x, puntoInicial.y);

  // Animación de la ruta
  path.animate([
    { strokeDasharray: "0, 1000" },
    { strokeDasharray: "1000, 0" }
  ], {
    duration: 1500,
    fill: "forwards"
  });

  pathRutaActual = path;
  svgDoc = svg;
}

function centrarVista(x, y) {
  const svg = contenedorPlano.querySelector('svg');
  if (!svg) return;

  const viewBox = svg.getAttribute('viewBox');
  const [vbX, vbY, vbWidth, vbHeight] = viewBox ? viewBox.split(' ').map(Number) : [0, 0, svg.width.baseVal.value, svg.height.baseVal.value];
  
  // Calcular el centro deseado
  const centerX = x - vbWidth / 3;
  const centerY = y - vbHeight / 3;
  
  // Establecer nuevo viewBox centrado
  svg.setAttribute('viewBox', `${centerX} ${centerY} ${vbWidth} ${vbHeight}`);
}




async function activarSensor() {
  try {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      const permissionState = await DeviceOrientationEvent.requestPermission();
      
      if (permissionState === 'granted') {
        isSensorActive = true;
        initialBeta = null;
        initialGamma = null;
        window.addEventListener("deviceorientation", moverConSensor);
        alert("Sensor de movimiento activado correctamente.");
      } else {
        alert("Se necesitan permisos para usar el sensor de movimiento.");
      }
    } else {
      isSensorActive = true;
      initialBeta = null;
      initialGamma = null;
      window.addEventListener("deviceorientation", moverConSensor);
    }
  } catch (error) {
    console.error("Error al activar el sensor:", error);
    alert("Error al activar el sensor: " + error.message);
  }
}

function limpiarSensor() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  window.removeEventListener("deviceorientation", moverConSensor);
  isSensorActive = false;
}

// Evento para ajustar sensibilidad con teclado
document.addEventListener('keydown', (e) => {
  if (e.key === '+' && sensitivity < 2) {
    sensitivity += 0.1;
    console.log(`Sensibilidad aumentada a: ${sensitivity.toFixed(1)}`);
    mostrarNotificacion(`Sensibilidad: ${sensitivity.toFixed(1)}`);
  } else if (e.key === '-' && sensitivity > 0.1) {
    sensitivity -= 0.1;
    console.log(`Sensibilidad reducida a: ${sensitivity.toFixed(1)}`);
    mostrarNotificacion(`Sensibilidad: ${sensitivity.toFixed(1)}`);
  }
});

function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement('div');
  notificacion.style.position = 'fixed';
  notificacion.style.bottom = '20px';
  notificacion.style.right = '20px';
  notificacion.style.backgroundColor = 'rgba(0,0,0,0.7)';
  notificacion.style.color = 'white';
  notificacion.style.padding = '10px 20px';
  notificacion.style.borderRadius = '5px';
  notificacion.style.zIndex = '1000';
  notificacion.textContent = mensaje;
  
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 500);
  }, 2000);
}

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  actualizarDestinos();
  cargarPlano();
  
  // Mostrar instrucciones al inicio
  setTimeout(() => {
    mostrarNotificacion("Usa +/- para ajustar la sensibilidad del movimiento");
  }, 1000);
});

pisoSelect.addEventListener('change', () => {
  limpiarSensor();
  actualizarDestinos();
  cargarPlano();
});

destinoSelect.addEventListener('change', () => {
  limpiarSensor();
  cargarPlano();
});

// Botón para activar/desactivar sensor
const btnSensor = document.createElement('button');
btnSensor.textContent = 'Activar Navegación por Movimiento';
btnSensor.style.position = 'fixed';
btnSensor.style.bottom = '20px';
btnSensor.style.left = '20px';
btnSensor.style.zIndex = '1000';
btnSensor.style.padding = '10px 15px';
btnSensor.style.backgroundColor = '#4CAF50';
btnSensor.style.color = 'white';
btnSensor.style.border = 'none';
btnSensor.style.borderRadius = '4px';
btnSensor.style.cursor = 'pointer';

btnSensor.addEventListener('click', () => {
  if (isSensorActive) {
    limpiarSensor();
    btnSensor.textContent = 'Activar Navegación por Movimiento';
    btnSensor.style.backgroundColor = '#4CAF50';
  } else {
    activarSensor();
    btnSensor.textContent = 'Desactivar Navegación por Movimiento';
    btnSensor.style.backgroundColor = '#f44336';
  }
});

document.body.appendChild(btnSensor);
