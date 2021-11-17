class Servicios:
    def __init__(self, id="", nombre="",precio="",estado=""):
        self.id = id
        self.nombre = nombre
        self.precio = precio
        self.estado = estado

    def consultarServicios(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("SELECT * FROM servicios WHERE estado = 3;")
            datos = conexion.fetchall()

            arrayServicio = []
            if(len(datos) > 0): 
                for servicio in datos:
                    objServicio = Servicios(servicio[0],servicio[1],servicio[2],servicio[3])
                    arrayServicio.append(objServicio)
            return arrayServicio
        except:
            return "ERROR"
    

    def consultarServiciosAdmin(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("SELECT * FROM servicios;")
            datos = conexion.fetchall()

            arrayServicio = []
            if(len(datos) > 0): 
                for servicio in datos:
                    objServicio = Servicios(servicio[0],servicio[1],servicio[2],servicio[3])
                    arrayServicio.append(objServicio)
            return arrayServicio
        except:
            return "ERROR"

    def insertarServicio(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("INSERT INTO servicios (nombre,precio,estado) VALUES (%s,%s,%s);",[self.nombre, self.precio, self.estado])
            db.connection.commit()

            return "OKAY"
        except:
            return "ERROR"

    def cambiarEstado(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("UPDATE servicios SET estado = (%s) WHERE id = %s;",[self.estado, self.id])
            db.connection.commit()

            return "OKAY"
        except:
            return "ERROR"

    def eliminarServicio(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("DELETE FROM servicios WHERE id = %s LIMIT 1;",[self.id])
            db.connection.commit()

            return "OKAY"
        except:
            return "ERROR"

    def actualizarServicio(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("UPDATE servicios SET nombre = (%s),precio = (%s) WHERE id = %s;",[self.nombre, self.precio,self.id])
            db.connection.commit()

            return "OKAY"
        except:
            return "ERROR"