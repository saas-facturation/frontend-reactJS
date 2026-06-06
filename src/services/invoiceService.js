import api from "./api";

const invoiceService = {
  // GET /api/invoices
  lister: () => api.get("/api/invoices").then((r) => r.data),

  // GET /api/invoices/:id
  getById: (id) => api.get(`/api/invoices/${id}`).then((r) => r.data),

  // POST /api/invoices
  creer: (data) => api.post("/api/invoices", data).then((r) => r.data),

  // PATCH /api/invoices/:id/statut?valeur=SENT
  changerStatut: (id, statut) =>
    api.patch(`/api/invoices/${id}/statut?valeur=${statut}`).then((r) => r.data),

  // DELETE /api/invoices/:id
  supprimer: (id) => api.delete(`/api/invoices/${id}`),

  // POST /api/payments/checkout/:id → retourne { checkoutUrl }
  creerCheckout: (id) =>
    api.post(`/api/payments/checkout/${id}`).then((r) => r.data.checkoutUrl),

  // GET /api/dashboard/stats
  stats: () => api.get("/api/dashboard/stats").then((r) => r.data),
};

export default invoiceService;
