-- CreateTable
CREATE TABLE "Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purchasePrice" REAL NOT NULL,
    "renewalPrice" REAL NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "renewalDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "repoLink" TEXT NOT NULL,
    "driveLink" TEXT NOT NULL
);
