import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuth2Callback from "./pages/OAuth2Callback";

// App
import Dashboard from "./pages/Dashboard";
import ClientsList from "./pages/clients/ClientsList";
import ClientForm from "./pages/clients/ClientForm";
import InvoicesList from "./pages/invoices/InvoicesList";
import InvoiceCreate from "./pages/invoices/InvoiceCreate";
import InvoiceDetail from "./pages/invoices/InvoiceDetail";
import PaiementSucces from "./pages/paiement/PaiementSucces";
import PaiementAnnule from "./pages/paiement/PaiementAnnule";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirection racine */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/paiement/succes" element={<PaiementSucces />} />
          <Route path="/paiement/annule" element={<PaiementAnnule />} />

          {/* Routes protégées */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          <Route path="/clients" element={<PrivateRoute><ClientsList /></PrivateRoute>} />
          <Route path="/clients/nouveau" element={<PrivateRoute><ClientForm /></PrivateRoute>} />
          <Route path="/clients/:id/modifier" element={<PrivateRoute><ClientForm /></PrivateRoute>} />

          <Route path="/factures" element={<PrivateRoute><InvoicesList /></PrivateRoute>} />
          <Route path="/factures/nouvelle" element={<PrivateRoute><InvoiceCreate /></PrivateRoute>} />
          <Route path="/factures/:id" element={<PrivateRoute><InvoiceDetail /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
