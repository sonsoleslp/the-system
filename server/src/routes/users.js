/**ALLOWED**/
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// GET user by id
router.get("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST create user
router.post("/", async (req, res) => {
  const { email, name } = req.body;
  const user = await prisma.user.create({ data: { email, name } });
  res.status(201).json(user);
});

// PUT update user
router.put("/:id", async (req, res) => {
  const { email, name } = req.body;
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { email, name },
  });
  res.json(user);
});

// DELETE user
router.delete("/:id", async (req, res) => {
  await prisma.user.delete({ where: { id: Number(req.params.id) } });
  res.json({ deleted: true });
});

module.exports = router;