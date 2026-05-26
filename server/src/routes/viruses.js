/**ALLOWED**/
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all viruses with optional filtering
// Example /viruses?genus=Agatevirus&species=Bacillus&abbreviation=bh&limit=50&offset=100
router.get("/", async (req, res) => {
  try {
    const { genus, species, name, abbreviation, limit, offset } = req.body;

    const where = {};

    const viruses = await prisma.virus.findMany({
      where,
      take: limit ? Number(limit) : undefined,
      skip: offset ? Number(offset) : undefined,
      orderBy: { genus: 'asc' }
    });

    res.json(viruses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET virus by id (numeric)
router.get("/:id(\\d+)", async (req, res) => {
  try {
    const virus = await prisma.virus.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!virus) return res.status(404).json({ error: "Virus not found" });
    res.json(virus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create virus
router.post("/", async (req, res) => {
  try {
    const { genus, species, name, abbreviation, designation } = req.body;
    const virus = await prisma.virus.create({
      data: { genus, species, name, abbreviation, designation }
    });
    res.status(201).json(virus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update virus
router.put("/:id", async (req, res) => {
  try {
    const { genus, species, name, abbreviation, designation } = req.body;
    const virus = await prisma.virus.update({
      where: { id: Number(req.params.id) },
      data: { genus, species, name, abbreviation, designation },
    });
    res.json(virus);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Virus not found" });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE virus
router.delete("/:id", async (req, res) => {
  try {
    await prisma.virus.delete({ where: { id: Number(req.params.id) } });
    res.json({ deleted: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Virus not found" });
    }
    res.status(500).json({ error: error.message });
  }
});

// Create virus search router for /virus/:virus endpoint
const virusSearchRouter = express.Router();

// GET virus detailed view by abbreviation or name
virusSearchRouter.get("/:virus", async (req, res) => {
  try {
    const virusParam = req.params.virus;

    // Validate input
    if (!virusParam || virusParam.trim().length === 0) {
      return res.status(400).json({
        error: "Invalid virus identifier",
        message: "Virus identifier cannot be empty"
      });
    }

    // Try to find by abbreviation first, then by name (case insensitive)
    const virus = await prisma.virus.findFirst({
      where: {
        OR: [
          { abbreviation: { equals: virusParam } },
          { abbreviation: { contains: virusParam } },
          { name: { contains: virusParam } },
          { species: { contains: virusParam } },
          { genus: { contains: virusParam } }
        ]
      }
    });

    if (!virus) {
      return res.status(404).json({
        error: "Virus not found",
        message: `No virus found matching identifier: ${virusParam}`,
        searchTerm: virusParam
      });
    }

    // Add image path and metadata
    const virusWithImage = {
      ...virus,
      imagePath: `/images/virus/${virus.id}.png`,
      hasImage: true,
      lastUpdated: new Date().toISOString(),
      source: 'detailed_database'
    };

    res.json(virusWithImage);
  } catch (error) {
    console.error('Error in /virus/:virus endpoint:', error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve virus details",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = {
  virusesRouter: router,
  virusSearchRouter
};