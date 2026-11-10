import express from "express";
import autenticacaoMiddleware from "../middlewares/autenticacaoMiddleware.js";
import autorizacaoMiddleware from "../middlewares/autorizacaoMiddleware.js";
import { listarRegistros, registrarTreino } from "../controllers/registrosController.js";

const router = express.Router();

router.use(autenticacaoMiddleware);
router.get("/", listarRegistros);
router.post("/", autorizacaoMiddleware("aluno"), registrarTreino);

export default router;
