import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "@/app/tool.module.css";
import { CreateTool } from "@/components/create-tool";
import type { ActivityType } from "@/lib/activity";

export default async function NewActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const requestedType = (await searchParams).type;
  const initialType: ActivityType = requestedType === "lottery" ? "lottery" : "poll";

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/"><span className={styles.brandMark}>小</span>小工具</Link>
        <Link className={styles.backLink} href="/"><ArrowLeft size={17} aria-hidden="true" /> 返回首页</Link>
      </header>
      <div className={styles.content}>
        <p className={styles.eyebrow}>创建活动</p>
        <h1 className={styles.title}>几步完成，分享链接即可参与。</h1>
        <p className={styles.subtitle}>创建者会在当前浏览器获得管理权限。请不要清理本站浏览器数据，直到活动结束。</p>
        <CreateTool initialType={initialType} />
      </div>
    </main>
  );
}
