class Cliente:
    def __init__(self,id="",nombre="",telefono="",email=""):
        self.id = id
        self.nombre = nombre
        self.telefono = telefono
        self.email = email


    def consultarCliente(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("SELECT * FROM cliente WHERE email = %s;",[self.email])
            datos = conexion.fetchall()
            if(len(datos) > 0): 
                for cliente in datos:
                    objCliente = Cliente(cliente[0],cliente[1],cliente[2],cliente[3])
            return objCliente
        except:
            return "ERROR"


    def insertarCliente(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("INSERT INTO cliente (nombre,telefono,email) VALUES (%s,%s,%s);",[self.nombre, self.telefono, self.email])
            db.connection.commit()

            return "OKAY"
        except:
            return "ERROR"

    def __str__(self):
        return f'{self.nombre} {self.telefono} {self.email}'