import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #ccc", paddingBottom: "15px" }}>
        <h2>Panel de Control - Servicios Técnicos</h2>
        <nav style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <Link to="/dashboard">Inicio</Link>
          <Link to="/clientes">Clientes</Link>
          <Link to="/tecnicos">Técnicos</Link>
          <Link to="/servicios">Servicios</Link>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
          >
            Cerrar sesión
          </button>
        </nav>
      </header>

      <main>
        <h3>Bienvenido, {usuario?.username || "Usuario"}</h3>
        <p>Selecciona un módulo en el menú superior para comenzar a administrar el sistema.</p>
      </main>
    </div>
  );
}

export default Dashboard;