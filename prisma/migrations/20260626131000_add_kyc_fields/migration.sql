-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT DEFAULT '+91 98765 43210',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "accountName" TEXT DEFAULT 'Demo Trader',
    "accountNo" TEXT DEFAULT '1234567890',
    "ifsc" TEXT DEFAULT 'HDFC0001234',
    "bankName" TEXT DEFAULT 'HDFC Bank',
    "emailNotif" BOOLEAN NOT NULL DEFAULT true,
    "drawdownNotif" BOOLEAN NOT NULL DEFAULT true,
    "payoutNotif" BOOLEAN NOT NULL DEFAULT true,
    "newsNotif" BOOLEAN NOT NULL DEFAULT false,
    "kycStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "kycIdUrl" TEXT,
    "kycSelfieUrl" TEXT,
    "kycNotes" TEXT
);
INSERT INTO "new_User" ("accountName", "accountNo", "bankName", "createdAt", "drawdownNotif", "email", "emailNotif", "id", "ifsc", "name", "newsNotif", "password", "payoutNotif", "phone", "updatedAt") SELECT "accountName", "accountNo", "bankName", "createdAt", "drawdownNotif", "email", "emailNotif", "id", "ifsc", "name", "newsNotif", "password", "payoutNotif", "phone", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
