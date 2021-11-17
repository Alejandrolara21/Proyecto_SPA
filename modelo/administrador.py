class Administrador:
    def __init__(self,id="",nombre="",correo="",password=""):
        self.id = id
        self.nombre = nombre
        self.correo = correo   
        self.password = password

    def validarAdministrador(self,db):
        try:
            conexion = db.connection.cursor()
            conexion.execute("SELECT * FROM administrador WHERE correo = %s AND password = %s;",[self.correo,self.password])
            datos = conexion.fetchall()
            return "ENTRO"
        except:
            return "ERROR"



    def __str__(self):
        return f'{self.nombre} {self.telefono} {self.email}'