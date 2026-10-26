import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerServicios,
  obtenerClientesCatalogo,
  obtenerTecnicosCatalogo,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
} from "../services/api";

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [tecnicoId, setTecnicoId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [fecha, setFecha] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    try {
      const [s, c, t] = await Promise.all([
        obtenerServicios(),
        obtenerClientesCatalogo(),
        obtenerTecnicosCatalogo(),
      ]);
      if (s.ok) setServicios(s.datos.servicios || []);
      if (c.ok) setClientes(c.datos.clientes || []);
      if (t.ok) setTecnicos(t.datos.tecnicos || []);
    } catch (error) {
      setMensaje("Error al cargar los catálogos o servicios");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiar = () => {
    setClienteId("");
    setTecnicoId("");
    setDescripcion("");
    setEstado("Pendiente");
    setFecha("");
    setEditandoId(null);
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!clienteId || !tecnicoId || !descripcion.trim() || !estado || !fecha) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    setCargando(true);
    const datos = {
      cliente_id: Number(clienteId),
      tecnico_id: Number(tecnicoId),
      descripcion: descripcion.trim(),
      estado,
      fecha,
    };

    try {
      const r = editandoId
        ? await actualizarServicio(editandoId, datos)
        : await crearServicio(datos);

      setMensaje(r.datos.message || "Operación procesada");
      if (r.ok) {
        limpiar();
        await cargarDatos();
      }
    } catch (error) {
      setMensaje("Error al procesar la solicitud del servicio");
    } finally {
      setCargando(false);
    }
  };

  const editar = (s) => {
    setEditandoId(s.id);
    setClienteId(s.cliente_id);
    setTecnicoId(s.tecnico_id);
    setDescripcion(s.descripcion);
    setEstado(s.estado || "Pendiente");
    setFecha(s.fecha ? s.fecha.split("T")[0] : "");
    setMensaje("");
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar este servicio de prueba?")) return;
    try {
      const r = await eliminarServicio(id);
      setMensaje(r.datos.message || "Operación procesada");
      if (r.ok) await cargarDatos();
    } catch (error) {
      setMensaje("Error al conectar para eliminar servicio");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      <nav style={{ display: "flex", gap: "15px", marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
        <Link to="/dashboard">← Inicio</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/tecnicos">Técnicos</Link>
        <Link to="/servicios"><strong>Servicios</strong></Link>
      </nav>

      <h1>Gestión de Servicios Técnicos</h1>
      {mensaje && <p style={{ color: "blue", fontWeight: "bold" }}>{mensaje}</p>}

      <form onSubmit={guardar} style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "25px" }}>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
          <option value="">Seleccione cliente...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)} required>
          <option value="">Seleccione técnico...</option>
          {tecnicos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>

        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción del problema/servicio"
          required
          style={{ minWidth: "250px" }}
        />

        <select value={estado} onChange={(e) => setEstado(e.target.value)} required>
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Terminado">Terminado</option>
          <option value="Cancelado">Cancelado</option>
        </select>

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <button type="submit" disabled={cargando}>
          {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Registrar"}
        </button>
        {editandoId && (
          <button type="button" onClick={limpiar}>
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Técnico</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.cliente_nombre}</td>
              <td>{s.tecnico_nombre}</td>
              <td>{s.descripcion}</td>
              <td>{s.estado}</td>
              <td>{s.fecha ? s.fecha.split("T")[0] : ""}</td>
              <td style={{ textAlign: "center" }}>
                <button onClick={() => editar(s)} style={{ marginRight: "8px" }}>
                  Editar
                </button>
                <button onClick={() => eliminar(s.id)} style={{ color: "red" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {servicios.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No hay servicios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Servicios;