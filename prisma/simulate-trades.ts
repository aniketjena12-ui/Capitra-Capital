import { prisma } from "../lib/prisma";
import { checkAccountRules } from "../lib/rulesCheck";

async function main() {
  const email = "admin@capitracapital.com";
  
  // Find admin user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error("Error: Admin user admin@capitracapital.com not found. Run npm run seed first.");
    process.exit(1);
  }

  // Find or create account
  let account = await prisma.account.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  if (!account) {
    account = await prisma.account.create({
      data: {
        userId: user.id,
        planName: "Professional",
        initialBalance: 500000,
        balance: 500000,
        status: "ACTIVE"
      }
    });
  }

  console.log(`Current Account ID: ${account.id}, Status: ${account.status}, Balance: ₹${account.balance.toLocaleString("en-IN")}`);

  const mode = process.argv[2] ? process.argv[2].toLowerCase() : "pass";

  if (mode === "reset") {
    console.log("Resetting account and clearing logs...");
    await prisma.trade.deleteMany({ where: { userId: user.id } });
    await prisma.notification.deleteMany({ where: { userId: user.id } });
    
    account = await prisma.account.update({
      where: { id: account.id },
      data: {
        balance: 500000,
        initialBalance: 500000,
        status: "ACTIVE",
        planName: "Professional"
      }
    });
    console.log("Account successfully reset to ₹5,00,000 ACTIVE status.");
    return;
  }

  if (mode === "fail") {
    console.log("Simulating Daily Drawdown Breach (4%)...");
    
    // Make sure account is ACTIVE
    await prisma.account.update({
      where: { id: account.id },
      data: { balance: 500000, status: "ACTIVE" }
    });
    await prisma.trade.deleteMany({ where: { accountId: account.id } });

    // Log a large losing trade today
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const todayStr = new Date(Date.now() - tzOffset).toISOString().split("T")[0];
    
    await prisma.trade.create({
      data: {
        userId: user.id,
        accountId: account.id,
        date: todayStr,
        symbol: "BANKNIFTY",
        direction: "SELL",
        entry: "51,500",
        exit: "52,100",
        pnl: "–₹22,000",
        isProfit: false,
        notes: "Automated simulation trade: massive loss breaching 4% daily drawdown limit."
      }
    });

    // Update account balance
    await prisma.account.update({
      where: { id: account.id },
      data: { balance: 478000 }
    });

    // Run rules engine
    const rules = await checkAccountRules(account.id);
    console.log("Simulation complete! Rules check output:", rules);
    return;
  }

  if (mode === "pass") {
    console.log("Simulating Evaluation Passed Requirements (8% profit, 5 distinct trading days)...");

    // Make sure account is ACTIVE and reset
    await prisma.account.update({
      where: { id: account.id },
      data: { balance: 500000, status: "ACTIVE" }
    });
    await prisma.trade.deleteMany({ where: { accountId: account.id } });

    const days = ["2026-06-21", "2026-06-22", "2026-06-23", "2026-06-24", "2026-06-25"];
    let currentBalance = 500000;

    for (let i = 0; i < days.length; i++) {
      const dateStr = days[i];
      const winAmt = i === 4 ? 12000 : 9000; // Total profit will be 9000*4 + 12000 = 48000 (9.6% return, >8%)
      currentBalance += winAmt;

      await prisma.trade.create({
        data: {
          userId: user.id,
          accountId: account.id,
          date: dateStr,
          symbol: "NIFTY 50",
          direction: "BUY",
          entry: "23,400",
          exit: "23,500",
          pnl: `+₹${winAmt.toLocaleString("en-IN")}`,
          isProfit: true,
          notes: `Automated simulation trade: Day ${i + 1} of evaluation challenge.`
        }
      });
    }

    // Update account balance
    await prisma.account.update({
      where: { id: account.id },
      data: { balance: currentBalance }
    });

    // Run rules engine
    const rules = await checkAccountRules(account.id);
    console.log("Simulation complete! Rules check output:", rules);
    return;
  }

  console.error(`Invalid mode "${mode}". Supported modes: pass, fail, reset`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
