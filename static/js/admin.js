document.addEventListener('DOMContentLoaded', function(){
    crearServicio();
    cambiarEstadoServicio();
    eliminarServicio();
    cambiarFormulario();
    actualizarServicio();
    cambiarEstadoCitas();
});

function cargarListadoCitas(tabla){
    const listado = document.querySelector('.datosCitas');
    while(listado.firstChild){
        listado.removeChild(listado.firstChild);
    }
    listado.append(tabla);
    cambiarEstadoCitas();
}

function cargarListado(tabla,cambiarForm = 0){
    const listado = document.querySelector('.datosServicios');
    while(listado.firstChild){
        listado.removeChild(listado.firstChild);
    }
    listado.appendChild(tabla);
    cambiarEstadoServicio();
    eliminarServicio();
    cambiarFormulario(cambiarForm);
    actualizarServicio();
}

function errorBD(){
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }
    const alerta = document.createElement('DIV');
    alerta.textContent = "ERROR EN LA BASE DE DATOS";
    alerta.classList.add('alerta');
    alerta.classList.add('error');
    return alerta;
}


function cambiarEstadoCitas(){
    if(document.querySelectorAll('.estadoCitas')[0]){
        const estados = document.querySelectorAll('.estadoCitas');
        estados.forEach(estado => {
            estado.addEventListener('change', e=>{
                valorEstado = estado.value;
                idCita = e.target.dataset.id;
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
                .then(resultado =>{
                    console.log(resultado);
                    if(resultado["status"] === 200){
                        fetchListadoCitas();
                    }else if(resultado["status"] === 500){
                        alerta = errorBD();
                        cargarListadoCitas(alerta);
                    }
                })
                .catch(error =>{
                    alerta = errorBD();
                    cargarListadoCitas(alerta);
                })
            });
        });
    }
}

function cambiarFormulario(cambiar = 0){
    if(document.querySelectorAll('.actualizarServicio')[0]){
        const actualizarSer = document.querySelectorAll('.actualizarServicio');
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
        if(cambiar === 0){
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
                .then(resultado =>{
                    console.log(resultado);
                    if(resultado["status"] === 200){
                        fetchListadoServicios(url);
                        mensaje("Servicio Actualizado",1);
                    }else if(resultado["status"] === 500){
                        alerta = errorBD();
                        cargarListado(alerta);
                    }
                })
                .catch(error =>{
                    alerta = errorBD();
                    cargarListado(alerta);
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
                .then(resultado =>{
                    console.log(resultado);
                    if(resultado["status"] === 200){
                        fetchListadoServicios(url);
                        mensaje("Servicio Eliminado",1);
                    }else if(resultado["status"] === 500){
                        alerta = errorBD();
                        cargarListado(alerta);
                    }
                })
                .catch(error =>{
                    alerta = errorBD();
                    cargarListado(alerta);
                })
            });
        });
    }
}

function cambiarEstadoServicio(){
    if(document.querySelectorAll('.estado')[0]){
        const estados = document.querySelectorAll('.estado');
        estados.forEach(estado => {
            estado.addEventListener('change', e=>{
                valorEstado = estado.value;
                idServicio = e.target.dataset.id;
                console.log(idServicio);
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
                .then(resultado =>{
                    console.log(resultado);
                    if(resultado["status"] === 200){
                        fetchListadoServicios(url);
                        mensaje("Estado Actualizado",1);
                    }else if(resultado["status"] === 500){
                        alerta = errorBD();
                        cargarListado(alerta);
                    }
                })
                .catch(error =>{
                    alerta = errorBD();
                    cargarListado(alerta);
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
                .then(resultado =>{
                    console.log(resultado);
                    if(resultado["status"] === 200){
                        fetchListadoServicios(url);
                        mensaje("Servicio Registrado",1);
                    }else if(resultado["status"] === 500){
                        alerta = errorBD();
                        cargarListado(alerta);
                    }
                })
                .catch(error =>{
                    alerta = errorBD();
                    cargarListado(alerta);
                })
            }else{
                mensaje("Todos los campos son obligatorios",0);
            }
        });
    }
}

async function fetchListadoServicios(){
    try{
        url = "/listadoServiciosAdmin";
        const resultado = await fetch(url);
        if(resultado["status"] === 200){
            const datos = await resultado.json();

            const tabla = document.createElement("TABLE");
            tabla.classList.add('tabla_servicios');
    
            const thId = document.createElement("TH");
            thId.textContent = "Id";
            const thNombre = document.createElement("TH");
            thNombre.textContent = "Nombre";
            const thPrecio = document.createElement("TH");
            thPrecio.textContent = "Precio";
            const thEstado = document.createElement("TH");
            thEstado.textContent = "Estado";
            const thOpciones = document.createElement("TH");
            thOpciones.textContent = "Opciones";
    
            const tHead = document.createElement("THEAD");
            const tBody = document.createElement("TBODY");
            tHead.appendChild(thId);
            tHead.appendChild(thNombre);
            tHead.appendChild(thPrecio);
            tHead.appendChild(thEstado);
            tHead.appendChild(thOpciones);
            console.log(datos);
            datos['servicios'].forEach( servicio => {
                const {id, estado, nombre, precio} = servicio;
                trServicio = crearServiciosTabla(id,estado,nombre,precio);
                tBody.appendChild(trServicio);
            });
    
            tabla.appendChild(tHead);
            tabla.appendChild(tBody);
    
            cargarListado(tabla);
        }else if(resultado["status"] === 500){
            alerta = errorBD();
            cargarListado(alerta);
        }

    }catch (error){
        console.log(error)
    }
}

async function fetchListadoCitas(){
    try{
        url = "/listadoCitas";
        const resultado = await fetch(url);
        if(resultado["status"] === 200){
            const datos = await resultado.json();

            const tabla = document.createElement("TABLE");
            tabla.classList.add('tabla_servicios');
    
            const thId = document.createElement("TH");
            thId.textContent = "Id";
            const thEstado = document.createElement("TH");
            thEstado.textContent = "Estado";
            const thFecha = document.createElement("TH");
            thFecha.textContent = "Fecha";
            const thHora = document.createElement("TH");
            thHora.textContent = "Hora";
    
            const tHead = document.createElement("THEAD");
            const tBody = document.createElement("TBODY");
            tHead.appendChild(thId);
            tHead.appendChild(thFecha);
            tHead.appendChild(thHora);
            tHead.appendChild(thEstado);
            datos['citas'].forEach( cita => {
                const {id, estado, fecha, hora} = cita;
                trCita = crearCitasTabla(id,estado,fecha,hora);
                tBody.appendChild(trCita)
            });
    
            tabla.appendChild(tHead);
            tabla.appendChild(tBody);
    
            cargarListadoCitas(tabla);
        }else if(resultado["status"] === 500){
            alerta = errorBD();
            cargarListadoCitas(alerta);
        }

    }catch (error){
        console.log(error)
    }
}

function crearServiciosTabla(id,estado,nombre,precio){
    const tr = document.createElement("TR");

    const tdId = document.createElement("TD");
    tdId.textContent = id;
    const tdNombre = document.createElement("TD");
    tdNombre.textContent = nombre;
    tdNombre.classList.add(`nombre${id}`);
    const tdPrecio = document.createElement("TD");
    tdPrecio.textContent = precio;
    tdPrecio.classList.add(`precio${id}`);
    const tdEstado = document.createElement("TD");
    const selectEstado = document.createElement("SELECT");
    selectEstado.classList.add("estado");
    selectEstado.dataset.id = id;

    const opcActivo = document.createElement("OPTION");
    opcActivo.value = 3;
    opcActivo.textContent = "Activo";
    const opcInactivo = document.createElement("OPTION");
    opcInactivo.value = 4;
    opcInactivo.textContent = "Inactivo";

    if(estado === "3"){
        opcActivo.setAttribute("selected","");
    }else if (estado === "4"){
        opcInactivo.setAttribute("selected","");
    }

    selectEstado.appendChild(opcActivo);
    selectEstado.appendChild(opcInactivo);
    tdEstado.appendChild(selectEstado);
    // HTML OPCIONES
    const tdOpciones = document.createElement("TD");
    const divActualizar = document.createElement("DIV");
    divActualizar.classList.add("opcion");
    const divEliminar = document.createElement("DIV");
    divEliminar.classList.add("opcion");

    const aActualizar = document.createElement("A");
    aActualizar.classList.add("actualizarServicio");
    aActualizar.dataset.actualizar = id;
    aActualizar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil" width="20" height="20" viewBox="0 0 24 24" stroke-width="3" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
    <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
    </svg>`
    divActualizar.appendChild(aActualizar);

    const aEliminar = document.createElement("A");
    aEliminar.classList.add("eliminarServicio");
    aEliminar.dataset.eliminar = id;
    aEliminar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="3" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
    </svg>`
    divEliminar.appendChild(aEliminar);

    tdOpciones.appendChild(divActualizar);
    tdOpciones.appendChild(divEliminar);

    tr.appendChild(tdId);
    tr.appendChild(tdNombre);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdEstado);
    tr.appendChild(tdOpciones);

    return tr;
}

function crearCitasTabla(id,estado,fecha,hora){
    const tr = document.createElement("TR");

    const tdId = document.createElement("TD");
    tdId.textContent = id;
    const tdFecha = document.createElement("TD");
    tdFecha.textContent = fecha;
    const tdHora = document.createElement("TD");
    tdHora.textContent = hora;
    const tdEstado = document.createElement("TD");
    const selectEstado = document.createElement("SELECT");
    selectEstado.classList.add("estadoCitas");
    selectEstado.dataset.id = id;

    const opcFinalizado = document.createElement("OPTION");
    opcFinalizado.value = 1;
    opcFinalizado.textContent = "Finalizado";
    const opcPendiente = document.createElement("OPTION");
    opcPendiente.value = 2;
    opcPendiente.textContent = "Pendiente";

    if(estado === "1"){
        opcFinalizado.setAttribute("selected","");
    }else if (estado === "2"){
        opcPendiente.setAttribute("selected","");
    }

    selectEstado.appendChild(opcFinalizado);
    selectEstado.appendChild(opcPendiente);

    tdEstado.appendChild(selectEstado);

    tr.appendChild(tdId);
    tr.appendChild(tdFecha);
    tr.appendChild(tdHora);
    tr.appendChild(tdEstado);

    return tr;
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