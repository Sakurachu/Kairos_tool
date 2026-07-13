import { ArrowRight, CheckCircle2, Gift, Vote } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";
import { siteConfig } from "@/config/site";

const tools = [
  {
    name: "在线投票",
    description: "创建选项、分享链接，实时查看每个选项的票数。",
    href: "/new?type=poll",
    icon: Vote,
    tone: "green",
  },
  {
    name: "公平抽奖",
    description: "收集参与者，由服务端随机开奖并永久保存结果。",
    href: "/new?type=lottery",
    icon: Gift,
    tone: "yellow",
  },
] as const;

export default function Home() {
  return (
    <main>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label={`${siteConfig.name} 首页`}>
          <span className={styles.brandMark}>小</span>
          <span>{siteConfig.name}</span>
        </Link>
        <span className={styles.environment}>
          <CheckCircle2 size={15} aria-hidden="true" /> 数据库已连接
        </span>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>不用注册，创建后立即分享</p>
        <h1>投票和抽奖，<br />现在就能开始。</h1>
        <p className={styles.lead}>{siteConfig.description}</p>
        <Link className={styles.primaryAction} href="/new">
          创建新活动 <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section className={styles.tools} aria-labelledby="tools-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>选择工具</p>
            <h2 id="tools-title">今天要解决什么？</h2>
          </div>
          <span className={styles.count}>2 个工具</span>
        </div>

        <div className={styles.toolGrid}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link className={`${styles.toolCard} ${styles[tool.tone]}`} href={tool.href} key={tool.name}>
                <span className={styles.toolIcon}><Icon size={25} aria-hidden="true" /></span>
                <div className={styles.toolCopy}>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                </div>
                <ArrowRight className={styles.cardArrow} size={21} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>{siteConfig.name}</span>
        <span>Neon PostgreSQL / Vercel</span>
      </footer>
    </main>
  );
}
