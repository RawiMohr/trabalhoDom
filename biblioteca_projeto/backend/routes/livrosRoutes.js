import express from "express";
import { listarLivros } from "../controllers/livrosController.js"; 

const router = express.Router();
router.get("/", listarLivros);

export default router; 





