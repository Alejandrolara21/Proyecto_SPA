from flask import (make_response,jsonify)

def validarConsultaSql(resultado):
    if(resultado != "ERROR"):
        respuesta = make_response(jsonify({"message": "Sucessful"}),200)
        return respuesta
    else:
        respuesta = make_response(jsonify({"message": "ERROR MYSQL"}),500)
        return respuesta