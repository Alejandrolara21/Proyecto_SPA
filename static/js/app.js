let pagina = 1;

const cliente ={
    nombre: '',
    telefono: '',
    email:''
}

const cita = {
    fecha: '',
    hora: '',
    servicios: []
}
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // Muestra una sección 

    cambiarSeccion(); // Cambia la página actual con los tabs
    paginaSiguiente(); // Pagina Siguiente del paginador
    paginaAnterior(); // Pagina anterior del paginador
    mostrarServicios();// Consulta la API
    botonesPaginador(); // Muestra u oculta los botones del paginador

    // Validacion y almacenar cita
    nombreCliente();
    telefonoCliente();
    emailCliente();
    deshabilitarFechaAnterior();
    seleccionarDiaCita();
    seleccionarHoraCita();

    // Resumen de la cita con servicios y datos
    mostrarResumen();
}
function mostrarSeccion() {
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    const seccionNueva = document.querySelector(`#paso-${pagina}`);
    seccionNueva.classList.add('mostrar-seccion');

    // Resalta el Tab Actual
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta la primera opción de la navegación
    const tab = document.querySelector(`[data-tab="${pagina}"]`);
    tab.classList.add('actual');
}


function cambiarSeccion() {
   const enlaces = document.querySelectorAll('.tabs button');
   enlaces.forEach( enlace => {
        enlace.addEventListener('click', function(e) {
                e.preventDefault();
                // Conocer a que le dimos click..
                const paso = parseInt( e.target.dataset.tab);

                if(paso === 1) {
                    pagina = 1;
                } else if( paso === 2) {
                    pagina = 2;
                } else if (paso === 3) {
                    pagina = 3;
                    mostrarResumen();
                }
                botonesPaginador();
        });
   })
}

async function mostrarServicios() {
    try {
        const url = '/listadoServicios';

        const resultado = await fetch(url)
        const datos = await resultado.json();

        datos['servicios'].forEach( servicio => {
            const { id, nombre, precio } = servicio;

            const nombreServicio = document.createElement('P');
            nombreServicio.classList.add('nombre-servicio');
            nombreServicio.textContent = nombre;

            const precioServicio = document.createElement('P');
            precioServicio.classList.add('precio-servicio');
            precioServicio.innerHTML = `$ ${precio}`;
            
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;
            servicioDiv.onclick = seleccionarServicio;

            // Inyectar a ServicioDiv
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            document.querySelector('#servicios').appendChild(servicioDiv)
        });

    
        
    } catch (error) {
        console.log(error)
    }
}

function seleccionarServicio(e) {
    let servicio;

    if(e.target.tagName === 'P') {
        servicio = e.target.parentElement;
    } else {
       servicio = e.target;
    }
    if(servicio.classList.contains('seleccionado')) {
        servicio.classList.remove('seleccionado') // El Usuario eliminó el servicio
        const id = parseInt( servicio.dataset.idServicio );
        eliminarServicio(id);
    } else {
        servicio.classList.add('seleccionado'); // El usuario seleccionó un servicio
        let servicioObj = {
            id: parseInt( servicio.dataset.idServicio ),
            nombre: servicio.firstElementChild.textContent,
            precio: servicio.firstElementChild.nextElementSibling.textContent
        }; 
        agregarServicio(servicioObj); 
    }
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios,  servicioObj];
}

function eliminarServicio(id) {
    const { servicios } = cita;
    // const nuevoArray = servicios.filter( servicio => servicio.id !== id );
    cita.servicios = servicios.filter( servicio => servicio.id !== id );
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {
        pagina--;
        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');
    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen(); 
    } else if(pagina < 1 || pagina > 3) {
        return;
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // Muestra la nueva sección 

}

function nombreCliente() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim(); 
        if( nombreTexto === '') {
            cliente.nombre = nombreTexto;
            mostrarAlerta( 'Nombre Obligatorio', 'error');
        } else {
            // TODO: Añadirlo al objeto
            cliente.nombre = nombreTexto;
        }
    })
}

function telefonoCliente() {
    const telefonoInput = document.querySelector('#telefono');
    telefonoInput.addEventListener('input', e => {
        const telefonoTexto = e.target.value.trim(); 
        if( telefonoTexto === '') {
            cliente.telefono = telefonoTexto;
            mostrarAlerta( 'Telefono Obligatorio', 'error');
        } else {
            // TODO: Añadirlo al objeto
            cliente.telefono = telefonoTexto;
        }
    })
}

function emailCliente() {
    const emailInput = document.querySelector('#correo');
    emailInput.addEventListener('input', e => {
        const emailTexto = e.target.value.trim(); 
        if( emailTexto === '') {
            cliente.email = emailTexto;
            mostrarAlerta( 'Correo Obligatorio', 'error');
        } else {
            // TODO: Añadirlo al objeto
            cliente.email = emailTexto;
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');
    const ahora = new Date();
    const year = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;
    const dia = ahora.getDate() + 1;
    // Formato deseado... 
    const fechaDeshabilitar =`${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;
}

function seleccionarDiaCita() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {
        const dia = new Date(e.target.value).getUTCDay(); // getUTCDay nos retorna el día de la semana de 0 a 6 siendo 0 domingo
        if([0].includes(dia)){ // 6,0 Deshabilita los sábados y domingos, 0 solo el domingo
            e.preventDefault();
            mostrarAlerta( 'Fines de Semana no permitidos', 'error', inputFecha);
        } else {
            cita.fecha = e.target.value;
        }
    })
}

function seleccionarHoraCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        if(hora[0] < 6 || hora[0] > 20) {
            mostrarAlerta('Hora no válida', 'error', inputHora );
            setTimeout(() => {
                e.target.value = '';
            }, 3000);
        } else {
            cita.hora = e.target.value;
        }
    })
}

function mostrarAlerta( mensaje, tipo = null, elemento = null ) {
    // Si la alerta existe no crear una nueva
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error')
    } else {
        alerta.classList.add('exito');
    }
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    setTimeout( () => {
        alerta.remove();

        if( elemento ) {
            elemento.value = '';
        }
    }, 3000);
}


function mostrarMensaje( mensaje, tipo = null) {
    // Si la alerta existe no crear una nueva
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error')
    } else {
        alerta.classList.add('exito');
    }
    const resumenDiv = document.querySelector('.contenido-resumen');
    resumenDiv.appendChild(alerta);

    setTimeout( () => {
        alerta.remove();
    }, 2000);
}


function mostrarResumen() {
    const {fecha, hora, servicios } = cita;
    const {nombre,telefono,email} = cliente;
    const resumenDiv = document.querySelector('.contenido-resumen');
    console.log(servicios);
    // Limpiar el resumen en caso de ser necesario
    while(resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild); 
    }


    if(Object.values(cita).includes('') || servicios.length === 0 || Object.values(cliente).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan Datos de Servicios, para poder agendar la cita';
        noServicios.classList.add('invalidar-cita');
        resumenDiv.appendChild(noServicios);
        return;
    } 

    // Agrega el Nombre al HTML
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Agrega el telefono al HTML
    const telefonoCita = document.createElement('P');
    telefonoCita.innerHTML = `<span>Nombre:</span> ${telefono}`;

    // Agrega el email al HTML
    const emailCita = document.createElement('P');
    emailCita.innerHTML = `<span>Nombre:</span> ${email}`;

    // Agrega la fecha al HTML
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    // aGREGA LA hORA
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;
    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    if(servicios.length > 0 ) {
        const headingServicios = document.createElement('H3');
        headingServicios.textContent = 'Resumen de Servicios';
        serviciosCita.appendChild(headingServicios);
        servicios.forEach( servicio => {
            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');
            const textoServicio = document.createElement('P');
            textoServicio.textContent = servicio.nombre;
            const precioServicio = document.createElement('P');
            precioServicio.innerHTML = `<span>Precio:</span> ${servicio.precio}`;
            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);
            serviciosCita.appendChild(contenedorServicio);
        });


        // Total a pagar
    }
    // añadir al HTML
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(telefonoCita);
    resumenDiv.appendChild(emailCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    // Crear el botón para la cita
    const botonReservar = document.createElement('button');
    botonReservar.classList.add('btn', 'btn-block', 'enviar-datos');
    botonReservar.textContent = 'RESERVAR CITA';

    resumenDiv.appendChild(botonReservar);

    botonReservar.addEventListener('click', agregarCita);
}


function agregarCita(){
    const {fecha, hora, servicios } = cita;
    const {nombre,telefono,email} = cliente;
    objCita = {
        'cita': cita,
        'cliente' : cliente
    }
    url = "/agendarCita";
    fetch(url,{
        method: 'POST',
        body: JSON.stringify(objCita),
        headers: {
        'Content-Type': 'application/json'// AQUI indicamos el formato
    }})
    .then(respuesta =>{
        return respuesta.text()
    })
    .then(datos =>{
        console.log(datos)
        if(datos === "OKAY"){
            mostrarMensaje("Cita Agendada","exito");
            setTimeout(() => {
                location.reload(true); 
            }, 1000);
        }
    });
}