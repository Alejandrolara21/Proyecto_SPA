document.addEventListener('DOMContentLoaded', function(){
    crearServicio();
    cambiarEstado();
    eliminarServicio();
    cambiarFormulario();
    actualizarServicio();
    cambiarEstadoCitas();
});


function cambiarEstadoCitas(){
    if(document.querySelectorAll('.estadoCitas')[0]){
        const estados = document.querySelectorAll('.estadoCitas');
        estados.forEach(estado => {
            estado.addEventListener('change', e=>{
                valorEstado = estado.value;
                idCita = e.target.dataset.idcita;
                objEstado = {
                    'id': idCita,
                    'estado': valorEstado
                }

                url = "/cambiarEstadoCitas";
                fetch(url,{
                    method: 'POST',
                    body: JSON.stringify(objEstado),
                    headers: {
                        'Content-Type': 'application/json'// AQUI indicamos el formato
                    }
                })
                    .then(respuesta =>{
                        return respuesta.text()
                    })
                    .then(datos =>{
                        cargarListadoCitas(datos);
                        mensaje("Estado Cambiado",1);
                    })
            });
        });
    }
}

function cargarListadoCitas(datos,cambiarForm = 0){
    const listado = document.querySelector('.datosCitas');
    while(listado.firstChild){
        listado.removeChild(listado.firstChild);
    }
    listado.insertAdjacentHTML('afterbegin',datos);
    cambiarEstadoCitas();
}


function cargarListado(datos,cambiarForm = 0){
    const listado = document.querySelector('.datosServicios');
    while(listado.firstChild){
        listado.removeChild(listado.firstChild);
    }
    listado.insertAdjacentHTML('afterbegin',datos);
    cambiarEstado();
    eliminarServicio();
    cambiarFormulario(cambiarForm);
    actualizarServicio();
}


function cambiarFormulario(cambiar = 0){
    if(document.querySelectorAll('.actualizarServicio')[0]){
        const actualizarSer= document.querySelectorAll('.actualizarServicio');
        const divActualizar = document.querySelector('#formularioActualizar');
        const divCrear = document.querySelector('#formularioCrear');
        actualizarSer.forEach(servicio =>{
            servicio.addEventListener('click', e=>{
                id = servicio.dataset.actualizar;
                const nombreServicio = document.querySelector(`.nombre${id}`).textContent;
                const precioServicio = document.querySelector(`.precio${id}`).textContent;

                divActualizar.classList.remove('hidden');
                divCrear.classList.add('hidden');

                document.querySelector('#nombreActualizar').value = nombreServicio;
                document.querySelector('#precioActualizar').value = precioServicio;;
                document.querySelector('#idServicioActualizar').value = id;
            });
        });

        if(cambiar != 0){
            divActualizar.classList.add('hidden');
            divCrear.classList.remove('hidden');
        }
    }
}

function actualizarServicio(){
    if(document.querySelector('#botonActualizar')){
        const boton = document.querySelector('#botonActualizar');
        boton.addEventListener('click', e =>{
            e.preventDefault();
            const id = document.querySelector('#idServicioActualizar').value;
            const nombre = document.querySelector('#nombreActualizar').value;
            const precio = document.querySelector('#precioActualizar').value;
            if(nombre != "" && precio != ""){
                objServicio = {
                    'id': id,
                    'nombre': nombre,
                    'precio': precio
                }

                url = "/editarServicio";
                fetch(url,{
                    method: 'POST',
                    body: JSON.stringify(objServicio),
                    headers: {
                        'Content-Type': 'application/json'// AQUI indicamos el formato
                    }
                })
                .then(respuesta =>{
                    return respuesta.text();
                })
                .then(datos => {
                    cargarListado(datos,1);
                    mensaje("Servicio Actualizado",1)
                })
            }else{
                mensaje("Todos los campos son obligatorios",0);
            }
        });
    }
}


function eliminarServicio(){
    if(document.querySelectorAll('.eliminarServicio')[0]){
        const iconosEliminar = document.querySelectorAll('.eliminarServicio');

        iconosEliminar.forEach(icono =>{
            icono.addEventListener('click', e =>{
                e.preventDefault();
                id = icono.dataset.eliminar;
                url = `/eliminarServicio?id=${id}`;
                fetch(url,{
                    method: 'GET',
                    headers: {},
                })
                .then(respuesta =>{
                    return respuesta.text();
                })
                .then(datos =>{
                    cargarListado(datos);
                    mensaje("Servicio Eliminada",1);
                })
            });
        });
    }
}

function cambiarEstado(){
    if(document.querySelectorAll('.estado')[0]){
        const estados = document.querySelectorAll('.estado');
        estados.forEach(estado => {
            estado.addEventListener('change', e=>{
                valorEstado = estado.value;
                idServicio =e.target.dataset.idservicio;
                objEstado = {
                    'id': idServicio,
                    'estado': valorEstado
                }

                url = "/cambiarEstadoServicio";
                fetch(url,{
                    method: 'POST',
                    body: JSON.stringify(objEstado),
                    headers: {
                        'Content-Type': 'application/json'// AQUI indicamos el formato
                    }
                })
                    .then(respuesta =>{
                        return respuesta.text()
                    })
                    .then(datos =>{
                        cargarListado(datos);
                        mensaje("Estado Cambiado",1);
                    })
            });
        });
    }
}


// Permite crear los servicios por medio de fetch 
function crearServicio(){
    if(document.querySelector('#botonServicio')){
        const boton = document.querySelector('#botonServicio');
        boton.addEventListener('click', e =>{
            e.preventDefault();
            const nombre = document.querySelector('#nombre').value;
            const precio = document.querySelector('#precio').value;

            if(nombre != "" && precio != ""){
                objServicio = {
                    'nombre':nombre,
                    'precio': precio
                }
    
                url = "/crearServicio";
                fetch(url,{
                    method: 'POST',
                    body: JSON.stringify(objServicio),
                    headers: {
                        'Content-Type': 'application/json'// AQUI indicamos el formato
                    }
                })
                .then(respuesta =>{
                    return respuesta.text();
                })
                .then(datos => {
                    cargarListado(datos);
                    mensaje("Servicio Agregado Correctamente",1);
                })
            }else{
                mensaje("Todos los campos son obligatorios",0);
            }
        });
    }
}


function mensaje(mensaje,tipo){
    if(document.querySelector('#formulario')){
        const alertaPrevia = document.querySelector('.alerta');
        if(alertaPrevia) {
            return;
        }
        const div = document.querySelector('#formulario');
        const alerta = document.createElement('DIV');
        alerta.textContent = mensaje;
        alerta.classList.add('alerta');
        if(tipo == 0){
            alerta.classList.add('error');
        }else if(tipo == 1){
            alerta.classList.add('exito');
        }
        div.insertAdjacentElement('beforeend',alerta);

        setTimeout( () => {
            alerta.remove();
        }, 2000);
    }
}