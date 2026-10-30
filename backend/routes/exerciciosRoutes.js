import express from "express";
import {
    listarExercicios,
    buscarExercicioPorId,
    cadastrarExercicio,
    atualizarExercicio,
    excluirExercicio
} from "../controllers/exerciciosController.js";

const router = express.Router();

// Liga cada endereço à função responsável pela operação.
router.get("/", listarExercicios);
router.get("/:id", buscarExercicioPorId);
router.post("/", cadastrarExercicio);
router.put("/:id", atualizarExercicio);
router.delete("/:id", excluirExercicio);

export default router;
