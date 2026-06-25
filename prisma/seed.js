const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@capitracapital.com";
  
  // Clean start
  await prisma.trade.deleteMany({});
  await prisma.payoutRequest.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash password
  const passwordHash = await bcryptjs.hash("123456", 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: "Demo Trader",
      email,
      password: passwordHash,
      phone: "+91 98765 43210",
      accountName: "Demo Trader",
      accountNo: "1234567890",
      ifsc: "HDFC0001234",
      bankName: "HDFC Bank",
    },
  });

  // Create active trading account
  const account = await prisma.account.create({
    data: {
      userId: user.id,
      planName: "Professional",
      initialBalance: 500000,
      balance: 542000,
      status: "ACTIVE",
    },
  });

  // Seed trades
  await prisma.trade.createMany({
    data: [
      {
        userId: user.id,
        accountId: account.id,
        date: "2026-06-25",
        symbol: "NIFTY 50",
        direction: "BUY",
        entry: "23,450",
        exit: "23,620",
        pnl: "+₹12,750",
        isProfit: true,
        notes: "Clean breakout above resistance after RBI hold.",
      },
      {
        userId: user.id,
        accountId: account.id,
        date: "2026-06-25",
        symbol: "BANKNIFTY",
        direction: "SELL",
        entry: "51,200",
        exit: "51,480",
        pnl: "–₹4,200",
        isProfit: false,
        notes: "Entered early, trend wasn't confirmed.",
      },
      {
        userId: user.id,
        accountId: account.id,
        date: "2026-06-24",
        symbol: "BTC/USDT",
        direction: "BUY",
        entry: "62,100",
        exit: "63,500",
        pnl: "+₹21,000",
        isProfit: true,
        notes: "Strong momentum after ETF news.",
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
