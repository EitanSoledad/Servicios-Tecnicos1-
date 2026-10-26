import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerTecnicos,
  crearTecnico,
  actualizarTecnico,
  eliminarTecnico,
} from "../services/api";

function Tecnicos() {
  const [tecnicos, setTecnicos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarTecnicos = async () => {
    try {
      const r = await obtenerTecnicos();
      if (r.ok && r.datos.success) {
        setTecnicos(r.datos.tecnicos);
      } else {
        setMensaje(r.datos.message || "Error al cargar los técnicos");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
    }
  };

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !especialidad.trim()) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    setCargando(true);
    const datos = { nombre: nombre.trim(), especialidad: especialidad.trim() };

    try {
      const r = editandoId
        ? await actualizarTecnico(editandoId, datos)
        : await crearTecnico(datos);

      setMensaje(r.datos.message || "Operación realizada con éxito");
      if (r.ok) {
        setNombre("");
        setEspecialidad("");
        setEditandoId(null);
        await cargarTecnicos();
      }
    } catch (error) {
      setMensaje("Error al procesar la solicitud del técnico");
    } finally {
      setCargando(false);
    }
  };

  const editar = (tecnico) => {
    setEditandoId(tecnico.id);
    setNombre(tecnico.nombre);
    setEspecialidad(tecnico.especialidad);
    setMensaje("");
  };

  const cancelar = () => {
    setEditandoId(null);
    setNombre("");
    setEspecialidad("");
    setMensaje("");
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar este técnico?")) return;
    try {
      const r = await eliminarTecnico(id);
      setMensaje(r.datos.message || "Operación procesada");
      if (r.ok) await cargarTecnicos();
    } catch (error) {
      setMensaje("Error al conectar para eliminar técnico");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <nav style={{ display: "flex", gap: "15px", marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
        <Link to="/dashboard">← Inicio</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/tecnicos"><strong>Técnicos</strong></Link>
        <Link to="/servicios">Servicios</Link>
      </nav>

      <h1>Módulo de Técnicos</h1>
      {mensaje && <p style={{ color: "blue", fontWeight: "bold" }}>{mensaje}</p>}

      <form onSubmit={guardar} style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre completo"
          required
        />
        <input
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          placeholder="Especialidad (ej. Redes)"
          required
        />
        <button type="submit" disabled={cargando}>
          {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Registrar"}
        </button>
        {editandoId && (
          <button type="button" onClick={cancelar}>
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tecnicos.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.nombre}</td>
              <td>{t.especialidad}</td>
              <td style={{ textAlign: "center" }}>
                <button onClick={() => editar(t)} style={{ marginRight: "8px" }}>
                  Editar
                </button>
                <button onClick={() => eliminar(t.id)} style={{ color: "red" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {tecnicos.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No hay técnicos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Tecnicos;