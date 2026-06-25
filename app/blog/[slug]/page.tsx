import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const articles: Record<string, { title: string; tag: string; date: string; readTime: string; content: string }> = {
  "how-to-pass-prop-firm-challenge": {
    title: "How to Pass a Prop Firm Challenge Without Blowing Your Account",
    tag: "Strategy",
    date: "June 20, 2026",
    readTime: "5 min read",
    content: `
Most traders who attempt prop firm challenges fail. Not because they lack a profitable strategy — but because they treat a challenge like a demo account.

**The challenge mentality trap**

When there's no real money on the line (from your perspective), you subconsciously take more risk. You widen your stop-loss "just this once." You revenge trade after a loss. You size up because "the account isn't real."

This is the challenge mentality trap — and it kills more attempts than bad strategies ever will.

**Rule 1: Trade your minimum size first**

The first week of any challenge, trade at 30–50% of your normal position size. Learn the platform. Understand the slippage. Build confidence. Your goal is to NOT lose in week one, not to hit your profit target.

**Rule 2: Know your daily loss limit cold**

The most common reason for challenge failures is breaching the daily loss limit. Know this number before you open any trade. Set an alarm or a hard stop on your platform.

If your account is ₹5,00,000 and daily loss limit is 4%, that's ₹20,000. Write it on a sticky note. Put it on your monitor.

**Rule 3: Define your daily profit target and stop**

Before each session, set a daily profit target (e.g., 1%) and a daily stop-loss (e.g., 2%). Once you hit either, close the platform. No exceptions.

**Rule 4: Track every trade in a journal**

You cannot improve what you do not measure. Write down: instrument, direction, entry, exit, P&L, and one sentence on why you took the trade. Review weekly.

**Rule 5: Consistency beats performance**

The evaluation is looking for a consistent, disciplined trader — not a hero. You don't need a 30% month. You need to hit 8% without breaching drawdown. That's it.

**Final thought**

The traders who pass aren't necessarily the most skilled. They're the most disciplined. Treat the challenge like it's real capital, because the funded account after it is.
    `,
  },
  "trading-psychology-discipline": {
    title: "The Discipline Paradox: Why Smart Traders Make Dumb Decisions",
    tag: "Psychology",
    date: "June 15, 2026",
    readTime: "7 min read",
    content: `
Intelligence doesn't make you a better trader. In fact, it can make you worse.

**The overconfidence trap**

Highly analytical traders tend to over-rationalize their decisions. They build complex justifications for breaking their own rules. "The market structure is clearly showing X, so widening my stop makes sense here."

This is not analysis. It's post-hoc rationalization of an emotional decision.

**The two-system problem**

Psychologist Daniel Kahneman described two thinking systems: System 1 (fast, emotional, automatic) and System 2 (slow, rational, deliberate). 

When you're in a trade, System 1 dominates. Fear and greed override your carefully constructed plan. The only antidote is to make as many decisions as possible BEFORE you open a trade.

**Pre-trade checklist ritual**

Before entering any trade, ask:
1. Where is my stop-loss? (Before entry, not after)
2. What is my position size based on this stop?
3. What is my profit target?
4. Why am I taking this trade? (One sentence)

If you can't answer all four, don't trade.

**The revenge trade pattern**

After a loss, your brain wants to "get it back." This is evolutionary — loss aversion is wired into us. The only solution is a mandatory cooling-off period. After any losing trade, wait 15 minutes before placing another.

**Building real discipline**

Discipline is not willpower. It's systems. Build rules that make the right behavior the path of least resistance, and you won't have to rely on willpower at all.
    `,
  },
  "understanding-drawdown-rules": {
    title: "Understanding Drawdown Rules: Daily vs Overall — What's the Difference?",
    tag: "Rules",
    date: "June 10, 2026",
    readTime: "4 min read",
    content: `
The two drawdown rules in prop trading are often confused — here's a clear breakdown.

**Daily Loss Limit (4%)**

This resets every calendar day. It includes both realized losses AND open floating losses at any point during the day.

Example: Account = ₹5,00,000. Daily limit = 4% = ₹20,000.
If your open positions are down ₹20,000 at any moment — even if you haven't closed them — you've breached the daily limit.

This is why you must always know your floating exposure, not just your closed P&L.

**Overall Loss Limit (8%)**

This does NOT reset. It's measured from your initial starting balance — always.

Example: Account = ₹5,00,000. Overall limit = 8% = ₹40,000.
Your account balance can never drop below ₹4,60,000 at any point.

**Key difference**

Daily = soft reset every day (but still measured against starting balance)
Overall = permanent floor from starting balance

**Common mistake**

Traders assume that if they're profitable, the overall limit moves up with them. It doesn't. The 8% limit is always anchored to ₹5,00,000 — regardless of whether you're up ₹50,000 or down ₹20,000.

**Practical tip**

Always trade with at least 3–4% buffer from both limits. If you're within 1% of either limit, stop trading for the day.
    `,
  },
  "position-sizing-guide": {
    title: "Position Sizing: The #1 Skill Every Funded Trader Needs",
    tag: "Risk Management",
    date: "June 5, 2026",
    readTime: "6 min read",
    content: `
Position sizing is the only variable that separates a profitable strategy from an account-destroying one.

**The 1% rule**

Risk no more than 1% of your account on any single trade. For a ₹5,00,000 account, that's ₹5,000 per trade.

This means: if your stop-loss is 50 points on Nifty (₹3,750 per lot), you can trade 1 lot. If your stop is 100 points (₹7,500), you cannot take the trade at 1% risk.

**The formula**

Position size = Account Risk ÷ Trade Risk per unit

Example:
- Account: ₹5,00,000
- Max risk per trade: 1% = ₹5,000
- Stop-loss: 50 Nifty points = ₹3,750 per lot
- Position size: ₹5,000 ÷ ₹3,750 = 1.33 → Round down to 1 lot

**Why this matters for challenges**

With a 4% daily loss limit, you can afford to lose 4 trades in a row at 1% risk before you're out for the day. This gives you enough room to have a bad day without ending your challenge.

**The volatility adjustment**

During high volatility events (RBI policy, earnings, budget), widen your mental stop and reduce position size by 50%. The market moves unpredictably, and protecting capital is the priority.

**Final formula to remember**

Know your risk per trade → Know your stop distance → Calculate your lots. Never reverse this process.
    `,
  },
  "nifty-banknifty-trading-tips": {
    title: "Trading NIFTY & BANKNIFTY Options: 5 Rules That Keep You in the Game",
    tag: "Strategy",
    date: "May 28, 2026",
    readTime: "8 min read",
    content: `
Indian index options are among the most liquid instruments in the world. They're also among the easiest ways to blow an account if you're not careful.

**Rule 1: Never buy options in the last hour of expiry day**

Theta decay accelerates exponentially in the final hour of expiry. Buying options here is gambling, not trading. Sell premium or stay out.

**Rule 2: Use defined risk strategies**

Instead of naked calls/puts, consider spreads. A bull call spread caps your max loss while still giving you directional exposure. This aligns perfectly with challenge drawdown rules.

**Rule 3: Know when NOT to trade**

Before RBI policy, budget announcements, and global events — stay flat. The premium expansion before events and crush after them can destroy directional positions even if you called direction correctly.

**Rule 4: Track IV (Implied Volatility) every day**

If IV is above 20%, option buying strategies become expensive. If IV is below 12%, option selling becomes relatively safer. Always know the current IV environment before choosing your strategy.

**Rule 5: Keep a stop on the premium paid**

If you buy an option for ₹50, set a hard stop at ₹25 (50% of premium). Options can go to zero. A hard stop prevents the classic "let me see if it recovers" mistake.

These 5 rules won't guarantee profits — but they'll keep you in the game long enough to find consistent ones.
    `,
  },
  "funded-trader-mindset": {
    title: "The Funded Trader Mindset: How to Think When Real Capital Is on the Line",
    tag: "Psychology",
    date: "May 20, 2026",
    readTime: "5 min read",
    content: `
Getting funded changes everything. The moment you're trading a firm's capital, the psychological pressure multiplies.

**The identity shift**

You're no longer a retail trader experimenting. You're a professional managing real capital. This shift in identity is necessary — and it changes how you make decisions.

Professionals don't take impulsive trades. They don't revenge trade. They don't trade when they're emotional or tired. Adopt this identity before your first funded trade.

**The paradox of funded trading**

The less you care about making money on each individual trade, the more money you'll make. Your job is to execute your edge consistently. The P&L is a result, not a goal.

**Journaling as a performance tool**

Every funded trader should have a trading journal. Not just trade data — emotional data. How did you feel before the trade? Were you anxious? Overconfident? Bored?

Patterns in your emotional state often predict your worst trading days more accurately than any indicator.

**The drawdown conversation**

Before you start funded trading, decide in advance: "If I lose X%, I will take a break for Y days." Make this decision when you're calm, not in the middle of a drawdown.

**One final thought**

The firms that fund you want you to succeed. They make money when you make money. Trust the process, follow the rules, and treat every trading day as an opportunity to prove your consistency.
    `,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return { title: "Article Not Found" };
  return { title: article.title };
}

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) notFound();

  const paragraphs = article.content
    .trim()
    .split("\n\n")
    .filter(Boolean);

  return (
    <>
      <div className="inner-hero" style={{ paddingBottom: "1.5rem" }}>
        <div className="section-eyebrow">Blog</div>
        <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, maxWidth: 780 }}>
          {article.title}
        </h1>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", fontSize: "0.8125rem", color: "var(--text-3)", flexWrap: "wrap" }}>
          <span>{article.tag}</span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem" }}>
        <div style={{ maxWidth: 720 }}>
          {/* Article body */}
          <div className="card" style={{ padding: "2.5rem", marginBottom: "2rem" }}>
            {paragraphs.map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return (
                  <h2 key={i} style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-1)", margin: "1.75rem 0 0.75rem" }}>
                    {para.replace(/\*\*/g, "")}
                  </h2>
                );
              }
              if (para.includes("**")) {
                const html = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                return (
                  <p key={i} style={{ fontSize: "0.9375rem", color: "var(--text-2)", lineHeight: 1.75, marginBottom: "1rem" }}
                    dangerouslySetInnerHTML={{ __html: html }} />
                );
              }
              if (para.startsWith("1.") || para.startsWith("-")) {
                const items = para.split("\n").filter(Boolean);
                return (
                  <ul key={i} style={{ paddingLeft: "1.5rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {items.map((item, j) => (
                      <li key={j} style={{ fontSize: "0.9375rem", color: "var(--text-2)", lineHeight: 1.65 }}>
                        {item.replace(/^[-\d.]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} style={{ fontSize: "0.9375rem", color: "var(--text-2)", lineHeight: 1.75, marginBottom: "1rem" }}>
                  {para}
                </p>
              );
            })}
          </div>

          {/* CTA */}
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-2)", marginBottom: "1.25rem" }}>
              Ready to put this into practice?
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/challenges" className="btn btn-blue">Start a Challenge →</Link>
              <Link href="/blog" className="btn btn-ghost">More Articles</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
