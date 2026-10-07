import express from "express";
import { listarLivros, cadastrarLivro, atualizarLivro, buscarLivrosId, excluirLivro } from "../controllers/livrosController.js";

const router = express.Router();
router.get("/", listarLivros);
router.post("/", cadastrarLivro);
router.put("/:id", atualizarLivro);
router.get("/:id", buscarLivrosId);
router.delete("/:id", excluirLivro);

export default router;