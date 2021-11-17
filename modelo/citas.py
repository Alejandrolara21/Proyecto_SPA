class Citas:
    def __init__(self, id="", fecha="",hora="",clienteId="",estado=""):
        self.id = id
        self.fecha = fecha
        self.hora = hora
        self.clienteId = clienteId
        self.estado = estado

    def validarCita(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("SELECT * FROM citas WHERE id = %s;",[self.id])
            datos = conexion.fetchall()

            if(len(datos) > 0): 
                return "EXISTE"
            else:
                return "NO_EXISTE"
        except:
            return "ERROR"

    def insertarCita(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("INSERT INTO citas (id,fecha,hora,clienteId,id_estado) VALUES (%s,%s,%s,%s,%s);",[self.id, self.fecha, self.hora,self.clienteId,self.estado])
            db.connection.commit()

            return "OKAY"
        except:
            return "ERROR"

    def consultarCitas(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("SELECT * FROM citas WHERE id_estado = 2 ORDER BY fecha ASC;")
            datos = conexion.fetchall()

            arrayCitas = []
            if(len(datos) > 0): 
                for cita in datos:
                    objServicio = Citas(cita[0],cita[1],cita[2],cita[3],cita[4])
                    arrayCitas.append(objServicio)
            return arrayCitas
        except:
            return "ERROR"

    def cambiarEstado(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("UPDATE citas SET id_estado = (%s) WHERE id = %s;",[self.estado, self.id])
            db.connection.commit()

            return "OKAY"
        except:
            return "ERROR"