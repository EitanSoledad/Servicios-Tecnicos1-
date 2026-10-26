const BASE_URL = "http://127.0.0.1:5000";

// ==========================================
// 1. Autenticación (Login)
// ==========================================
export async function login(username, password) {
  const respuesta = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const datos = await respuesta.json();
  return { ok: respuesta.ok, status: respuesta.status, datos };
}

// ==========================================
// 2. Módulo de Clientes
// ==========================================
export async function obtenerClientes() {
  const r = await fetch(`${BASE_URL}/api/clientes`);
  return { ok: r.ok, datos: await r.json() };
}

export async function obtenerClientesCatalogo() {
  const r = await fetch(`${BASE_URL}/api/clientes/catalogo`);
  return { ok: r.ok, datos: await r.json() };
}

export async function crearCliente(cliente) {
  const r = await fetch(`${BASE_URL}/api/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente),
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function actualizarCliente(id, cliente) {
  const r = await fetch(`${BASE_URL}/api/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente),
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function eliminarCliente(id) {
  const r = await fetch(`${BASE_URL}/api/clientes/${id}`, {
    method: "DELETE",
  });
  return { ok: r.ok, datos: await r.json() };
}

// ==========================================
// 3. Módulo de Técnicos
// ==========================================
export async function obtenerTecnicos() {
  const r = await fetch(`${BASE_URL}/api/tecnicos`);
  return { ok: r.ok, datos: await r.json() };
}

export async function obtenerTecnicosCatalogo() {
  const r = await fetch(`${BASE_URL}/api/tecnicos/catalogo`);
  return { ok: r.ok, datos: await r.json() };
}

export async function crearTecnico(tecnico) {
  const r = await fetch(`${BASE_URL}/api/tecnicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico),
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function actualizarTecnico(id, tecnico) {
  const r = await fetch(`${BASE_URL}/api/tecnicos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico),
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function eliminarTecnico(id) {
  const r = await fetch(`${BASE_URL}/api/tecnicos/${id}`, {
    method: "DELETE",
  });
  return { ok: r.ok, datos: await r.json() };
}

// ==========================================
// 4. Módulo de Servicios
// ==========================================
export async function obtenerServicios() {
  const r = await fetch(`${BASE_URL}/api/servicios`);
  return { ok: r.ok, datos: await r.json() };
}

export async function crearServicio(servicio) {
  const r = await fetch(`${BASE_URL}/api/servicios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(servicio),
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function actualizarServicio(id, servicio) {
  const r = await fetch(`${BASE_URL}/api/servicios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(servicio),
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function eliminarServicio(id) {
  const r = await fetch(`${BASE_URL}/api/servicios/${id}`, {
    method: "DELETE",
  });
  return { ok: r.ok, datos: await r.json() };
}