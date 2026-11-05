import express from "express";
import { cadastrarUsuario, fazerLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/cadastro", cadastrarUsuario);
router.post("/login", fazerLogin);

export default router;
