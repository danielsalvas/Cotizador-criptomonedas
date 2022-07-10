const criptomonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado')

//Objeto almacena información de criptomonedas

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//EVENT LISTENERS

document.addEventListener('DOMContentLoaded', () => {

    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedaSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

//FUNCIONES

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=15&tsym=USD'

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => selectCriptomonedas(resultado.Data))
}

function selectCriptomonedas(resultado) {
    resultado.forEach (crypto => {
        const {FullName, Name} = crypto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedaSelect.appendChild(option);
    })
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function submitFormulario(e) {
    e.preventDefault();

    //Validar formulario

    const { moneda, criptomoneda} = objBusqueda;

    if (moneda==='' || criptomoneda ==='') {
        mostrarAlerta('Ambos campos son obligatorios')
        return
    }

    //Consultar la API con los resultados

    consultarAPI();

}

function mostrarAlerta(msg) {

    const claseError = document.querySelector('.error');

    if (!claseError) {
        const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    divMensaje.textContent = msg;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
        divMensaje.remove();
    }, 3000);
    }
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner')

    spinner.innerHTML = `
    
        <div class="dot1"></div>
        <div class="dot2"></div>
    
    `;

    resultado.appendChild(spinner)

    setTimeout(() => {
        spinner.style.display = 'none'

        const { PRICE, HIGHDAY, LOWDAY, MKTCAP, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    
        const precio = document.createElement('p');
        precio.classList.add('precio');
        precio.innerHTML = `El precio actual es: <span>${PRICE}</span>`;
    
        const precioAlto = document.createElement('p'); 
        precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;
        
        const precioBajo = document.createElement('p'); 
        precioBajo.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`;
        
        const marketCAP = document.createElement('p');
        marketCAP.innerHTML = `MarketCAP actual: <span>${MKTCAP}</span>`;
    
        const change24 = document.createElement('p');
        change24.innerHTML = `Variación diaria: <span>${CHANGEPCT24HOUR}%</span>`;
    
        resultado.appendChild(precio);
        resultado.appendChild(precioAlto);
        resultado.appendChild(precioBajo);
        resultado.appendChild(marketCAP);
        resultado.appendChild(change24); 
    }, 2000);
}

function limpiarHTML() {
    resultado.innerHTML = ''
}

