import cors from "cors";

// Libera o acesso da página aberta pelo Live Server.
const corsMiddleware = cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"]
});

export default corsMiddleware;
