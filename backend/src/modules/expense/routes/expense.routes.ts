import { Router } from "express";
import { expenseController } from "../controllers/expense.controller";

const router = Router();

// GET /api/expenses?month=&year=&category=
router.get("/", (req, res) => expenseController.findAll(req, res));

// GET /api/expenses/:id
router.get("/:id", (req, res) => expenseController.findOne(req, res));

// POST /api/expenses
router.post("/", (req, res) => expenseController.create(req, res));

// PUT /api/expenses/:id
router.put("/:id", (req, res) => expenseController.update(req, res));

// DELETE /api/expenses/:id
router.delete("/:id", (req, res) => expenseController.delete(req, res));

export default router;
