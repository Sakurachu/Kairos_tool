import styles from "./page.module.css";
import { siteConfig } from "@/config/site";

const tools = [
  {
    name: "在线投票",
    description: "创建选项、收集投票并查看实时结果。",
    status: "准备接入数据库",
    mark: "票",
  },
  {
    name: "公平抽奖",
    description: "固定参与名单，由服务端生成并保存开奖结果。",
    status: "准备接入数据库",
    mark: "奖",
  },
];

const readiness = [
  ["应用框架", "Next.js + TypeScript", true],
  ["Vercel 部署", "已上线", true],
  ["健康检查", "/api/health", true],
  ["数据库", "等待连接", false],
  ["Git 远程仓库", "已连接", true],
] as const;

export default function Home() {
  return (
    <main>
      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label={`${siteConfig.name} 首页`}>
          <span className={styles.brandMark}>集</span>
          <span>{siteConfig.name}</span>
        </a>
        <span className={styles.environment}>线上测试环境</span>
      </header>

      <section className={styles.intro} id="top">
        <p className={styles.eyebrow}>轻量、清楚、可分享</p>
        <h1>需要做个决定？<br />交给一个简单工具。</h1>
        <p className={styles.lead}>{siteConfig.description}</p>
      </section>

      <section className={styles.tools} aria-labelledby="tools-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>工具列表</p>
            <h2 id="tools-title">从这里开始</h2>
          </div>
          <span className={styles.count}>{tools.length} 个工具</span>
        </div>

        <div className={styles.toolGrid}>
          {tools.map((tool) => (
            <article className={styles.toolCard} key={tool.name}>
              <div className={styles.toolMark} aria-hidden="true">{tool.mark}</div>
              <div className={styles.toolCopy}>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
              <span className={styles.status}>{tool.status}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.readiness} aria-labelledby="readiness-title">
        <div>
          <p className={styles.eyebrow}>发布状态</p>
          <h2 id="readiness-title">上线前准备</h2>
          <p className={styles.readinessNote}>基础发布已经完成，连接数据库后即可启用投票和抽奖的数据功能。</p>
        </div>
        <dl className={styles.checklist}>
          {readiness.map(([label, value, done]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className={done ? styles.done : styles.pending}>
                <span aria-hidden="true">{done ? "✓" : "·"}</span>{value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className={styles.footer}>
        <span>{siteConfig.name}</span>
        <span>Next.js / Vercel Ready</span>
      </footer>
    </main>
  );
}
