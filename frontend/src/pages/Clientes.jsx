import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../services/api";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarClientes = async () => {
    try {
      const res = await obtenerClientes();
      if (res.ok && res.datos.success) {
        setClientes(res.datos.clientes);
      } else {
        setMensaje("No se pudieron cargar los clientes");
      }
    } catch (error) {
      setMensaje("Error al conectar con el backend");
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setMensaje("El nombre del cliente es obligatorio");
      return;
    }

    setCargando(true);
    try {
      const r = editandoId
        ? await actualizarCliente(editandoId, { nombre: nombre.trim() })
        : await crearCliente({ nombre: nombre.trim() });

      setMensaje(r.datos.message || "Operación procesada");
      if (r.ok) {
        setNombre("");
        setEditandoId(null);
        await cargarClientes();
      }
    } catch (error) {
      setMensaje("Ocurrió un error al guardar el cliente");
    } finally {
      setCargando(false);
    }
  };

  const prepararEdicion = (cliente) => {
    setEditandoId(cliente.id);
    setNombre(cliente.nombre);
    setMensaje("");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre("");
    setMensaje("");
  };

  const borrar = async (id) => {
    if (!window.confirm("¿Deseas eliminar este cliente?")) return;
    try {
      const r = await eliminarCliente(id);
      setMensaje(r.datos.message || "Operación procesada");
      if (r.ok) {
        await cargarClientes();
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor para eliminar");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <nav style={{ display: "flex", gap: "15px", marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
        <Link to="/dashboard">← Inicio</Link>
        <Link to="/clientes"><strong>Clientes</strong></Link>
        <Link to="/tecnicos">Técnicos</Link>
        <Link to="/servicios">Servicios</Link>
      </nav>

      <h1>Módulo de Clientes</h1>
      {mensaje && <p style={{ color: "blue", fontWeight: "bold" }}>{mensaje}</p>}

      <form onSubmit={guardar} style={{ marginBottom: "25px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit" disabled={cargando}>
          {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Registrar"}
        </button>
        {editandoId && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td style={{ textAlign: "center" }}>
                <button onClick={() => prepararEdicion(c)} style={{ marginRight: "8px" }}>
                  Editar
                </button>
                <button onClick={() => borrar(c.id)} style={{ color: "red" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {clientes.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No hay clientes registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;