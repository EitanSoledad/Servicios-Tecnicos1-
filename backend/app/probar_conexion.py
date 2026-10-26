from config.conexion import conectar

# Hecho por Beto -w-
conexion = conectar()


if conexion:
    print("=================================")
    print("        CONEXIÓN EXITOSA         ")
    print("Base de datos: tecnico           ")
    print("=================================")
    conexion.close()
else:
    
    print("=================================")
    print("        ERROR DE CONEXIÓN        ")
    print("=================================")