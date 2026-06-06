import api from "./api";

const clientService = {
  // GET /api/clients
  lister: () => api.get("/api/clients").then((r) => r.data),

  // GET /api/clients/:id
  getById: (id) => api.get(`/api/clients/${id}`).then((r) => r.data),

  // POST /api/clients
  creer: (data) => api.post("/api/clients", data).then((r) => r.data),

  // PUT /api/clients/:id
  modifier: (id, data) => api.put(`/api/clients/${id}`, data).then((r) => r.data),

  // DELETE /api/clients/:id
  supprimer: (id) => api.delete(`/api/clients/${id}`),
};

export default clientService;
