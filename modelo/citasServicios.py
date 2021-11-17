class citasServicios:
    def __init__(self,id="",citaId="",servicioId=""):
        self.id = id
        self.citaId = citaId
        self.servicioId = servicioId

    

    def insertarCitaServicio(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("INSERT INTO citasServicios (citaId,servicioId) VALUES (%s,%s);",[self.citaId, self.servicioId])
            db.connection.commit()

            return "OKAY"
        except:
            return "ERROR"