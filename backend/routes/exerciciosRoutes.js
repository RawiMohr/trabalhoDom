import express from "express";
import autenticacaoMiddleware from "../middlewares/autenticacaoMiddleware.js";
import autorizacaoMiddleware from "../middlewares/autorizacaoMiddleware.js";
import {
    listarExercicios,
    buscarExercicioPorId,
    cadastrarExercicio,
    atualizarExercicio,
    excluirExercicio
} from "../controllers/exerciciosController.js";

const router = express.Router();

router.use(autenticacaoMiddleware);

router.get("/", listarExercicios);
router.get("/:id", buscarExercicioPorId);
router.post("/", autorizacaoMiddleware("instrutor", "admin"), cadastrarExercicio);
router.put("/:id", autorizacaoMiddleware("instrutor", "admin"), atualizarExercicio);
router.delete("/:id", autorizacaoMiddleware("instrutor", "admin"), excluirExercicio);

export default router;
