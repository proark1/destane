import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'investor',
      bio TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS productions (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      genre VARCHAR(100),
      description TEXT,
      director VARCHAR(255),
      starring VARCHAR(500),
      budget DECIMAL(15,2) DEFAULT 0,
      funding_goal DECIMAL(15,2) DEFAULT 0,
      funding_raised DECIMAL(15,2) DEFAULT 0,
      token_price DECIMAL(10,2) DEFAULT 1.00,
      min_investment DECIMAL(10,2) DEFAULT 100,
      projected_roi DECIMAL(5,2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'pending',
      image_url TEXT,
      release_date VARCHAR(50),
      revenue_share_pct DECIMAL(5,2) DEFAULT 15,
      created_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS investments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      production_id INTEGER REFERENCES productions(id) ON DELETE CASCADE,
      amount DECIMAL(15,2) NOT NULL,
      tokens INTEGER NOT NULL,
      equity_pct DECIMAL(5,4) DEFAULT 0,
      invested_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Add bio column if missing (for existing DBs)
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
  `).catch(() => {});

  // Seed productions if empty
  const count = await pool.query("SELECT COUNT(*) FROM productions");
  if (parseInt(count.rows[0].count) === 0) {
    await seedProductions();
  }
}

async function seedProductions() {
  const seeds = [
    {
      title: "Neon Horizon",
      genre: "Sci-Fi Thriller",
      description: "A high-stakes techno-thriller exploring the blurred lines between synthetic consciousness and human emotion in 2077 Tokyo.",
      director: "Elena Vance",
      starring: "Marcus Thorne, Sera Kim",
      budget: 3000000,
      funding_goal: 3000000,
      funding_raised: 2400000,
      token_price: 50,
      min_investment: 250,
      projected_roi: 22.1,
      status: "funding",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjLWqJXrEzb04_S9MvvMubyLVyAWCq8q3mQ0bU8TrQ9kUBUM0N423uXNJAiBTgOdaRKm35VRtMkWFA5csd95Rv9Q-M1Cgt4p11FzKr8AwVVBRpVvDXe18uh8taomWYat_id-s1ZRG0AemqzfUZ_dYfB4ujhQ6qBGtFfZ9CnjMtXl7UiiuCO8MOGW6kYREvHLfqulZgZFXkfFxjQVZp2b3u8qRAIXbKHGfo06o64cMpfxg0akNebmtj5QxEV-hs4ghblqeP6SqXeQ",
      release_date: "Q4 2025",
      revenue_share_pct: 15,
    },
    {
      title: "The Last Protocol",
      genre: "Cyberpunk Drama",
      description: "In a world where memories are traded as currency, a disgraced detective uncovers a conspiracy that threatens to delete humanity's collective history.",
      director: "James Whitfield",
      starring: "Elena Voss, Marcus Reid",
      budget: 1800000,
      funding_goal: 1800000,
      funding_raised: 1404000,
      token_price: 50,
      min_investment: 250,
      projected_roi: 18.5,
      status: "funding",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBy5FhonEsjh8F4tS4AOIzEgDdQ0fTod88_-y2o6-Y6bumbvOC7wNWtXrE5aO2B0cB6JLIyuME_-iOv2kSstFkJ_VJXvtbWdMDmi0hEVgNChli_yZOo8-OMXKwSRAF26_HXzrfNrgVRxR9bDb8CUJN6hvZ69a6ufmOe90_j-kn2-FC57jO1BE1JWq7iQsP9mE4U-DoAHWUhthIQUxjapl3P_hwsq_7xx5F7o1S37bNpuYmLwP2IpArr5INnkb8rEqz1qNxL9prWLQ",
      release_date: "Q2 2026",
      revenue_share_pct: 12,
    },
    {
      title: "Crimson Meridian",
      genre: "Political Thriller",
      description: "A geopolitical thriller set across three continents following a journalist who uncovers a shadow network controlling global energy markets.",
      director: "Sofia Chen",
      starring: "David Park, Amara Osei",
      budget: 5000000,
      funding_goal: 5000000,
      funding_raised: 2700000,
      token_price: 100,
      min_investment: 500,
      projected_roi: 24.5,
      status: "funding",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsrzTFsQg3_4vYkuwUOMYi0eYid6oY6e8jLo8ftiKK-owUq3hXMiu-yyUUALZGzjOeaTw3ABz_3j8FWHIQavsx1Umiv9wBfkvgLwDIYxQUM_7cg6Sts2rI7fTDeSyVW_sxB0oJfPBvwlJ4KtrhIoF0-AfoBZdLVMNtV7fiSGZud6su_gLzS2IcpAMZEORQFA0yqO3un2ca8RldxQUSRzwGWoWyyn9ZxtVOqZkIgC8EY3D9jXZaDAz3ntQpdpU0rJGKDYk6-XOVng",
      release_date: "Q1 2026",
      revenue_share_pct: 18,
    },
    {
      title: "Silk & Embers",
      genre: "Historical Drama",
      description: "A high-fidelity historical drama utilizing generative environment mapping for unprecedented scale in 19th century narrative.",
      director: "Marcus Thorne",
      starring: "Isabella Rosetti, Chen Wei",
      budget: 5000000,
      funding_goal: 5000000,
      funding_raised: 4700000,
      token_price: 75,
      min_investment: 375,
      projected_roi: 16.8,
      status: "funding",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaA3U8gluwCEKyyycve0oXnFaHxv3vkbZaYxnXRj8OHu0mOztwM_zx4bUkmj_kJzX_iOid5D4RqOm7j3B87Vd16AvzakBAo33oyMJyC_sZQUH69jICq21JNNa-qBCI6SUZYeqIGgjwJn_32Otq-Qnvt29nb9WKDsEjc63k_2PuREvyiyC8pxjJKsURaLZMGKY4QqlmETIPJ9LQIil0vmXJ4TgfCMsIVsZNsjt1SBkWQjk6lblkl6HvAN_hyBGS_Tk2k4bxrr3nuA",
      release_date: "Q3 2025",
      revenue_share_pct: 14,
    },
    {
      title: "VORTEX: VR",
      genre: "Immersive Experience",
      description: "A groundbreaking VR cinematic experience that puts the audience inside a living, breathing sci-fi world.",
      director: "Dimensional Media",
      starring: "Interactive Cast",
      budget: 12200000,
      funding_goal: 12200000,
      funding_raised: 0,
      token_price: 200,
      min_investment: 1000,
      projected_roi: 32.0,
      status: "pending",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjmspdWtonEusy6iMFsZH1wARTqAzAyvJYjsAs2onCbP9iPLdmNi0555xRUEyGp2R-VEkMGmDkBVs9GLnzKozuFVxnwSsn3-nAfPAMnEupSdRmUK66fOFK-1c97F2w_qaQMa2Fni2Lg_6ueOiBB3NVLCzdVnSE9KpubetyWQ_3RknBkmQb3tG1As50NKenVMFz2ogFzHsiQCSZ-49HkBol1So5REuJRBnegwma8ZHCDPggIqgD72xx-AI3lx4C8nQgYuFob9eClQ",
      release_date: "Q4 2026",
      revenue_share_pct: 20,
    },
  ];

  for (const s of seeds) {
    await pool.query(
      `INSERT INTO productions (title, genre, description, director, starring, budget, funding_goal, funding_raised, token_price, min_investment, projected_roi, status, image_url, release_date, revenue_share_pct)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [s.title, s.genre, s.description, s.director, s.starring, s.budget, s.funding_goal, s.funding_raised, s.token_price, s.min_investment, s.projected_roi, s.status, s.image_url, s.release_date, s.revenue_share_pct]
    );
  }
}

export default pool;
