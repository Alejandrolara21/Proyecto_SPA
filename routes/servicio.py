from flask import (Blueprint, make_response, jsonify, request )
from utils.validate import validarConsultaSql
from modelo.servicios import Servicios
from modelo.citasServicios import CitasServicios
from utils.db import db


servicio = Blueprint('servicio',__name__)

@servicio.route('/crearServicio',methods=['POST'])
def crearServicio():
    if request.method == 'POST':
        objServicio = request.get_json()
        servicio = Servicios("",objServicio['nombre'],objServicio['precio'],3)
        resultado = servicio.insertarServicio(db)
        respuesta = validarConsultaSql(resultado)
        return respuesta

@servicio.route('/eliminarServicio',methods=["GET"])
def eliminarServicio():
    idServicio = request.args.get("id")
    respuesta = idServicio

    citaServicio = CitasServicios("","",idServicio)
    resultadoCiSer = citaServicio.eliminarCitasServicio(db)

    if(resultadoCiSer != "ERROR"):
        servicio = Servicios(idServicio,"","","")
        resultado = servicio.eliminarServicio(db)
        respuesta = validarConsultaSql(resultado)
        return respuesta
    else:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)
        return respuesta

@servicio.route('/editarServicio',methods=["POST"])
def editarServicio():
    objServicio = request.get_json()
    servicio = Servicios(objServicio['id'],objServicio['nombre'],objServicio['precio'],"")
    resultado = servicio.actualizarServicio(db)
    respuesta = validarConsultaSql(resultado)
    return respuesta
    
@servicio.route('/listadoServiciosAdmin')
def listadoServiciosAdmin():
    servicio = Servicios()
    data = servicio.consultarServiciosAdmin(db)
    if(data != "ERROR"):
        jsonData = {}
        jsonData['servicios'] = []

        for servicio in data:
            arreglo_json = {
                'id': f'{servicio.id}',
                'nombre': f'{servicio.nombre}',
                'precio': f'{servicio.precio}',
                'estado': f'{servicio.estado}'
            }

            jsonData['servicios'].append(arreglo_json)

        respuesta = make_response(jsonify(jsonData),200)
        return respuesta
    else:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)
        return respuesta

@servicio.route('/cambiarEstadoServicio',methods=["POST"])
def cambiarEstadoServicio():
    if request.method == 'POST':
        objEstado = request.get_json()
        print(objEstado['id'])
        servicio = Servicios(objEstado['id'],"","",objEstado['estado'])
        resultado = servicio.cambiarEstado(db)
        respuesta = validarConsultaSql(resultado)
        return respuesta

@servicio.route('/listadoServicios')
def listadoServicios():
    servicio = Servicios()
    data = servicio.consultarServicios(db)

    #print(data)
    if(data != "ERROR"):
        jsonData = {}
        jsonData['servicios'] = []

        for servicio in data:
            arreglo_json = {
                'id': f'{servicio.id}',
                'nombre': f'{servicio.nombre}',
                'precio': f'{servicio.precio}',
                'estado': f'{servicio.estado}'
            }

            jsonData['servicios'].append(arreglo_json)

        respuesta = make_response(jsonify(jsonData),200)
        return respuesta
    else:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)
        return respuesta
