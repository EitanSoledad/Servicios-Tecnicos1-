from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.login import login_bp
from app.routes.clientes import clientes_bp
from app.routes.tecnicos import tecnicos_bp
from app.routes.servicios import servicios_bp

app = Flask(__name__)
CORS(app)

# Registro de Blueprints
app.register_blueprint(login_bp)
app.register_blueprint(clientes_bp)
app.register_blueprint(tecnicos_bp)
app.register_blueprint(servicios_bp)

@app.route("/")
def inicio():
    return jsonify({
        "success": True,
        "mensaje": "API de Servicios Técnicos activa"
    }), 200

if __name__ == "__main__":
    app.run(debug=True)