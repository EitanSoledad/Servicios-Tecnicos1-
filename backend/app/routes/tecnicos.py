from flask import Blueprint, jsonify, request
from app.config.conexion import conectar

tecnicos_bp = Blueprint("tecnicos", __name__)

@tecnicos_bp.route("/api/tecnicos", methods=["GET"])
def obtener_tecnicos():
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500

    cursor = None
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tecnico ORDER BY id DESC")
        tecnicos = cursor.fetchall()
        return jsonify({"success": True, "tecnicos": tecnicos}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        conexion.close()

@tecnicos_bp.route("/api/tecnicos", methods=["POST"])
def crear_tecnico():
    datos = request.get_json(silent=True)
    if not isinstance(datos, dict):
        return jsonify({"success": False, "message": "JSON válido requerido"}), 400

    nombre = datos.get("nombre")

    if not nombre or not str(nombre).strip():
        return jsonify({"success": False, "message": "El nombre del técnico es obligatorio"}), 400

    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500

    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute(
            "INSERT INTO tecnico (nombre) VALUES (%s)",
            (nombre.strip(),)
        )
        conexion.commit()
        return jsonify({
            "success": True,
            "message": "Técnico registrado exitosamente",
            "id": cursor.lastrowid
        }), 201
    except Exception as e:
        conexion.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        conexion.close()

@tecnicos_bp.route("/api/tecnicos/<int:tecnico_id>", methods=["PUT"])
def actualizar_tecnico(tecnico_id):
    datos = request.get_json(silent=True)
    if not isinstance(datos, dict):
        return jsonify({"success": False, "message": "JSON válido requerido"}), 400

    nombre = datos.get("nombre")

    if not nombre or not str(nombre).strip():
        return jsonify({"success": False, "message": "El nombre del técnico es obligatorio"}), 400

    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500

    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute(
            "UPDATE tecnico SET nombre=%s WHERE id=%s",
            (nombre.strip(), tecnico_id)
        )
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({"success": False, "message": "Técnico no encontrado"}), 404
        return jsonify({"success": True, "message": "Técnico actualizado exitosamente"}), 200
    except Exception as e:
        conexion.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        conexion.close()

@tecnicos_bp.route("/api/tecnicos/<int:tecnico_id>", methods=["DELETE"])
def eliminar_tecnico(tecnico_id):
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a la base de datos"}), 500

    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute("DELETE FROM tecnico WHERE id=%s", (tecnico_id,))
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({"success": False, "message": "Técnico no encontrado"}), 404
        return jsonify({"success": True, "message": "Técnico eliminado exitosamente"}), 200
    except Exception as e:
        conexion.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        conexion.close()