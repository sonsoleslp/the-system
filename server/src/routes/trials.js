/**ALLOWED**/
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET trials for a specific virus
router.get("/virus/:virusId", async (req, res) => {
  try {
    const virusId = Number(req.params.virusId);
    const { status, limit, offset } = req.query;

    const where = { virusId };
    if (status) where.status = status;

    const trials = await prisma.trial.findMany({
      where,
      take: limit ? Number(limit) : undefined,
      skip: offset ? Number(offset) : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        virusId: true,
        geneticSequence: true,
        createdAt: true,
        updatedAt: true,
        virus: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
            species: true
          }
        }
      }
    });
    res.json({trials});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// POST create trial (for lab simulation)
router.post("/", async (req, res) => {
  try {
    const { virusId, name, status } = req.body;

    // Validate required fields
    if (!virusId || !name || !status) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["virusId", "name", "status"]
      });
    }

    // Validate status
    if (!["SUCCESS", "FAIL"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        allowed: ["SUCCESS", "FAIL"]
      });
    }

    // Check if virus exists
    const virus = await prisma.virus.findUnique({
      where: { id: Number(virusId) }
    });

    if (!virus) {
      return res.status(404).json({ error: "Virus not found" });
    }

    const trial = await prisma.trial.create({
      data: {
        virusId: Number(virusId),
        name: name.toString(),
        status: status
      },
      select: {
        id: true,
        status: true,
        name: true,
        virusId: true,
        geneticSequence: true,
        createdAt: true,
        updatedAt: true,
        virus: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
            species: true
          }
        }
      }
    });

    res.status(201).json(trial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;