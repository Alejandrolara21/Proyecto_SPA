from flask import (Blueprint, render_template, redirect, request)
from modelo.administrador import Administrador
from modelo.citas import Citas
from modelo.servicios import Servicios
from utils.db import db



admin = Blueprint('admin',__name__)

@admin.route('/login')
def login():
    return render_template('login.html');

@admin.route('/validar',methods=['POST'])
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

@admin.route('/administrador')
def sesionAdministrador():
    servicio = Servicios()
    data = servicio.consultarServiciosAdmin(db)
    return render_template('administrador.html',data=data)