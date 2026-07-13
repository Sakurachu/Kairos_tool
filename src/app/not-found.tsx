import Link from "next/link";
import styles from "@/app/tool.module.css";

export default function NotFound() {
  return (
    <main className={styles.shell}>
      <div className={styles.notFound}>
        <div><p className={styles.eyebrow}>404</p><h1 className={styles.title}>没有找到这个活动</h1><p className={styles.subtitle}>链接可能有误，或者活动已被删除。</p><Link className={styles.submitButton} href="/">返回首页</Link></div>
      </div>
    </main>
  );
}
