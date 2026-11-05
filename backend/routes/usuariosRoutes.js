import express from "express";
import autenticacaoMiddleware from "../middlewares/autenticacaoMiddleware.js";
import autorizacaoMiddleware from "../middlewares/autorizacaoMiddleware.js";
import { listarUsuarios, listarAlunos, alterarNivel } from "../controllers/usuariosController.js";

const router = express.Router();

router.use(autenticacaoMiddleware);
router.get("/", autorizacaoMiddleware("admin"), listarUsuarios);
router.get("/alunos", autorizacaoMiddleware("instrutor", "admin"), listarAlunos);
router.put("/:id/nivel", autorizacaoMiddleware("admin"), alterarNivel);

export default router;
