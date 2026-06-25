import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Blog" };

const posts = [
  {
    slug: "how-to-pass-prop-firm-challenge",
    tag: "Strategy",
    tagColor: "blue",
    title: "How to Pass a Prop Firm Challenge Without Blowing Your Account",
    excerpt: "Most traders fail prop firm challenges not because of bad strategy, but because of poor risk management. Here's what the top 10% do differently.",
    date: "June 20, 2026",
    readTime: "5 min read",
    author: "Capitra Team",
  },
  {
    slug: "trading-psychology-discipline",
    tag: "Psychology",
    tagColor: "yellow",
    title: "The Discipline Paradox: Why Smart Traders Make Dumb Decisions",
    excerpt: "Trading psychology is the least-discussed but most impactful factor in your P&L. Learn how to recognize and break emotional trading patterns.",
    date: "June 15, 2026",
    readTime: "7 min read",
    author: "Capitra Team",
  },
  {
    slug: "understanding-drawdown-rules",
    tag: "Rules",
    tagColor: "red",
    title: "Understanding Drawdown Rules: Daily vs Overall — What's the Difference?",
    excerpt: "Drawdown limits are the most commonly misunderstood rules in prop trading. We break down exactly how they work with real examples.",
    date: "June 10, 2026",
    readTime: "4 min read",
    author: "Capitra Team",
  },
  {
    slug: "position-sizing-guide",
    tag: "Risk Management",
    tagColor: "green",
    title: "Position Sizing: The #1 Skill Every Funded Trader Needs",
    excerpt: "If you can master position sizing, you can survive almost any market condition. Here's a practical guide with formulas and examples.",
    date: "June 5, 2026",
    readTime: "6 min read",
    author: "Capitra Team",
  },
  {
    slug: "nifty-banknifty-trading-tips",
    tag: "Strategy",
    tagColor: "blue",
    title: "Trading NIFTY & BANKNIFTY Options: 5 Rules That Keep You in the Game",
    excerpt: "Indian index options are volatile and expensive. These 5 rules will help you manage risk while staying profitable in the F&O market.",
    date: "May 28, 2026",
    readTime: "8 min read",
    author: "Capitra Team",
  },
  {
    slug: "funded-trader-mindset",
    tag: "Psychology",
    tagColor: "yellow",
    title: "The Funded Trader Mindset: How to Think When Real Capital Is on the Line",
    excerpt: "Getting funded is just the beginning. The mental shift from your own capital to a firm's capital changes everything. Here's how to adapt.",
    date: "May 20, 2026",
    readTime: "5 min read",
    author: "Capitra Team",
  },
];

const tagColors: Record<string, string> = {
  blue:   "badge-blue",
  yellow: "badge-yellow",
  red:    "badge-red",
  green:  "badge-green",
};

export default function BlogPage() {
  return (
    <>
      <div className="inner-hero">
        <div className="section-eyebrow">Knowledge Base</div>
        <h1 className="inner-hero-title">Blog</h1>
        <p className="inner-hero-sub">
          Trading strategies, psychology, and platform guides — written by traders, for traders.
        </p>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem" }}>
        {/* Featured post */}
        <Link href={`/blog/${posts[0].slug}`} className="blog-featured-card" style={{ textDecoration: "none", display: "block" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <span className={`badge ${tagColors[posts[0].tagColor]}`}>{posts[0].tag}</span>
            <h2 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--text-1)", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
              {posts[0].title}
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-2)", lineHeight: 1.6 }}>{posts[0].excerpt}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.75rem", color: "var(--text-3)" }}>
              <span>{posts[0].date}</span>
              <span>·</span>
              <span>{posts[0].readTime}</span>
              <span style={{ marginLeft: "auto", color: "var(--blue-400)" }}>Read article →</span>
            </div>
          </div>
        </Link>

        {/* Grid of rest */}
        <div className="blog-grid" style={{ marginTop: "1.5rem" }}>
          {posts.slice(1).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card" style={{ textDecoration: "none" }}>
              <span className={`badge ${tagColors[post.tagColor]}`} style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
                {post.tag}
              </span>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-card-meta">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
