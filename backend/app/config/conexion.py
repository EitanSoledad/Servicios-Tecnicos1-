import mysql.connector
# Ya no es necesario importar Error

HOST = "localhost"
USER = "root" 
PASSWORD = "" 
DATABASE = "tecnico1"

def conectar():
    try:
        conexion = mysql.connector.connect(
            host=HOST,
            user=USER,
            password=PASSWORD,
            database=DATABASE,
            use_pure=True     # <--- AGREGA ESTO
        )
        
        if conexion.is_connected():
            print("Conexión exitosa a la base de datos")
            return conexion
            
    except Exception as e:    # <--- CAMBIA ESTO
        print(f"Error al conectar a la base de datos: {e}")
        return None