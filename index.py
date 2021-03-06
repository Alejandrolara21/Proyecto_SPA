import re
from MySQLdb.cursors import RE_INSERT_VALUES
from flask import Flask, render_template, request,url_for,make_response,jsonify
from flask_mysqldb import MySQL
from werkzeug.utils import redirect
from modelo.servicios import Servicios
from modelo.cliente import Cliente
from modelo.citas import Citas
from modelo.citasServicios import CitasServicios
from modelo.administrador import Administrador
import random


app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '7312010'
app.config['MYSQL_DB'] = 'barberia'

db = MySQL(app)

@app.route('/')
def inicio():
    return render_template('index.html');

@app.route('/login')
def login():
    return render_template('login.html');

@app.route('/validar',methods=['POST'])
def validar():
    if request.method == "POST":
        correo = request.form['correo'];
        password = request.form['password'];
        administrador = Administrador("","",correo,password)
        resultado = administrador.validarAdministrador(db)
        if(resultado != "ERROR"):
            return redirect('/administrador')
        else:
            mensaje = "Administrador no existe"
            return render_template('login.html',mensaje=mensaje)


@app.route('/citasAgendadas')
def citasAgendadas():
    citas = Citas()
    data = citas.consultarCitas(db)
    return render_template('citas.html',data=data)

@app.route('/administrador')
def sesionAdministrador():
    servicio = Servicios()
    data = servicio.consultarServiciosAdmin(db)
    return render_template('administrador.html',data=data)



## CRUD SERVICIO
@app.route('/crearServicio',methods=['POST'])
def crearServicio():
    if request.method == 'POST':
        objServicio = request.get_json()
        servicio = Servicios("",objServicio['nombre'],objServicio['precio'],3)
        resultado = servicio.insertarServicio(db)
        respuesta = validarConsultaSql(resultado)
        return respuesta

@app.route('/eliminarServicio',methods=["GET"])
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

@app.route('/editarServicio',methods=["POST"])
def editarServicio():
    objServicio = request.get_json()
    servicio = Servicios(objServicio['id'],objServicio['nombre'],objServicio['precio'],"")
    resultado = servicio.actualizarServicio(db)
    respuesta = validarConsultaSql(resultado)
    return respuesta
    
@app.route('/listadoServiciosAdmin')
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

@app.route('/cambiarEstadoServicio',methods=["POST"])
def cambiarEstadoServicio():
    if request.method == 'POST':
        objEstado = request.get_json()
        print(objEstado['id'])
        servicio = Servicios(objEstado['id'],"","",objEstado['estado'])
        resultado = servicio.cambiarEstado(db)
        respuesta = validarConsultaSql(resultado)
        return respuesta



## CRUD CITAS
@app.route('/cambiarEstadoCitas',methods=["POST"])
def cambiarEstadoCitas():
    if request.method == 'POST':
        objEstado = request.get_json()
        citas = Citas(objEstado['id'],"","","",objEstado['estado'])
        resultado = citas.cambiarEstado(db)
        respuesta = validarConsultaSql(resultado)
        return respuesta
           

@app.route('/listadoCitas')
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


## VERIFICACION DE LA CONSULTA SQL
def validarConsultaSql(resultado):
    if(resultado != "ERROR"):
        respuesta = make_response(jsonify({"message": "Sucessful"}),200)
        return respuesta
    else:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)
        return respuesta

### CLIENTE
@app.route('/listadoServicios')
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


@app.route('/agendarCita', methods=["POST"])
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

if __name__ == '__main__':
    app.run(port = 5000,debug=True)