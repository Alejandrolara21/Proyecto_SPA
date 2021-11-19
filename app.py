from flask import Flask
from routes.public import public
from routes.admin import admin
from routes.servicio import servicio
from routes.cita import cita
from routes.cliente import cliente




from flask_mysqldb import MySQL

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'barberia'

MySQL(app)

app.register_blueprint(public)
app.register_blueprint(admin)
app.register_blueprint(servicio)
app.register_blueprint(cita)
app.register_blueprint(cliente)



