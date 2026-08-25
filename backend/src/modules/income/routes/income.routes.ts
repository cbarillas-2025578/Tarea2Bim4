import { Router } from "express";
import { incomeController } from "../controllers/income.controller";

const router = Router();

// GET /api/incomes?month=&year=&source=
router.get("/", (req, res) => incomeController.findAll(req, res));

// GET /api/incomes/:id
router.get("/:id", (req, res) => incomeController.findOne(req, res));

// POST /api/incomes
router.post("/", (req, res) => incomeController.create(req, res));

// PUT /api/incomes/:id
router.put("/:id", (req, res) => incomeController.update(req, res));

// DELETE /api/incomes/:id
router.delete("/:id", (req, res) => incomeController.delete(req, res));

export default router;
