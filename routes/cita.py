from flask import (Blueprint, make_response, jsonify, render_template, request )
from utils.validate import validarConsultaSql
from modelo.citas import Citas
from modelo.citasServicios import CitasServicios
from modelo.cliente import Cliente

from utils.db import db
import random


cita = Blueprint('cita',__name__)

@cita.route('/cambiarEstadoCitas',methods=["POST"])
def cambiarEstadoCitas():
    if request.method == 'POST':
        objEstado = request.get_json()
        citas = Citas(objEstado['id'],"","","",objEstado['estado'])
        resultado = citas.cambiarEstado(db)
        respuesta = validarConsultaSql(resultado)
        return respuesta
           

@cita.route('/listadoCitas')
def listadoCitas():
    cita = Citas()
    data = cita.consultarCitas(db)

    #print(data)
    if(data != "ERROR"):
        jsonData = {}
        jsonData['citas'] = []

        for cita in data:
            arreglo_json = {
                'id': f'{cita.id}',
                'fecha': f'{cita.fecha}',
                'hora': f'{cita.hora}',
                'estado': f'{cita.estado}'
            }

            jsonData['citas'].append(arreglo_json)

        respuesta = make_response(jsonify(jsonData),200)
        return respuesta
    else:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)
        return respuesta

@cita.route('/agendarCita', methods=["POST"])
def agendarCita():
    objCita = request.get_json()
    cliente = Cliente("",objCita['cliente']['nombre'],objCita['cliente']['telefono'],objCita['cliente']['email'])

    clienteViejo = cliente.consultarCliente(db)
    if(clienteViejo != "ERROR"):
        idCita = random.randrange(100000)

        cita = Citas(idCita)
        resultadoCita = cita.validarCita(db)
        
        if(resultadoCita  != "ERROR"):
            cita = Citas(idCita,objCita['cita']['fecha'],objCita['cita']['hora'],clienteViejo.id,2)
            resultadoInsertadoCita = cita.insertarCita(db)

            if(resultadoInsertadoCita == "OKAY"):
                for servicio in objCita['cita']['servicios']:
                    citaServicio = CitasServicios("",idCita,servicio['id'])
                    citaServicio.insertarCitaServicio(db)

                return "OKAY"
            else:
                return "ERROR INSERTADO CITA"
        else:
            return "ERROR EXISTE CITA"    
    else:
        resultado = cliente.insertarCliente(db)
        if(resultado != "ERROR"):
            clienteViejo = cliente.consultarCliente(db)
            idCita = random.randrange(100000)
            cita = Citas(idCita)
            resultadoCita = cita.validarCita(db)
            
            if(resultadoCita  != "ERROR"):
                cita = Citas(idCita,objCita['cita']['fecha'],objCita['cita']['hora'],clienteViejo.id,2)
                resultadoInsertadoCita = cita.insertarCita(db)

                if(resultadoInsertadoCita == "OKAY"):
                    for servicio in objCita['cita']['servicios']:
                        citaServicio = CitasServicios("",idCita,servicio['id'])
                        citaServicio.insertarCitaServicio(db)

                    return "OKAY"
                else:
                    return "ERROR INSERTADO CITA"
            else:
                return "ERROR EXISTE CITA"

@cita.route('/citasAgendadas')
def citasAgendadas():
    citas = Citas()
    data = citas.consultarCitas(db)
    return render_template('citas.html',data=data)