import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/app/tool.module.css";
import { ActivityClient } from "@/components/activity-client";
import { getActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  let activity = null;
  try {
    activity = await getActivity((await params).id);
  } catch {
    notFound();
  }
  if (!activity) notFound();

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/"><span className={styles.brandMark}>小</span>小工具</Link>
        <Link className={styles.backLink} href="/"><ArrowLeft size={17} aria-hidden="true" /> 返回首页</Link>
      </header>
      <div className={styles.wideContent}><ActivityClient activity={activity} /></div>
    </main>
  );
}
