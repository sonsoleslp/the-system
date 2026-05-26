-- CreateTable
CREATE TABLE "Virus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genus" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
