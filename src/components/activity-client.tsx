"use client";

import { Crown, RefreshCw, Share2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import styles from "@/app/tool.module.css";
import type { PublicActivity } from "@/lib/activity";

function getVisitorId() {
  const key = "kairos:visitor";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

const subscribeToStorage = () => () => {};

export function ActivityClient({ activity }: { activity: PublicActivity }) {
  const router = useRouter();
  const adminToken = useSyncExternalStore(
    subscribeToStorage,
    () => localStorage.getItem(`kairos:admin:${activity.id}`) || "",
    () => "",
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [operation, setOperation] = useState<"vote" | "join" | "draw" | "">("");
  const busy = operation !== "";
  const totalVotes = useMemo(() => activity.options.reduce((sum, option) => sum + option.votes, 0), [activity.options]);
  const winner = activity.participants.find((participant) => participant.isWinner);

  async function request(path: string, body: object) {
    setOperation(path as "vote" | "join" | "draw");
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/activities/${activity.id}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "操作失败");
      setMessage(path === "vote" ? "投票成功" : path === "join" ? "报名成功" : "开奖完成");
      setName("");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "操作失败");
    } finally {
      setOperation("");
    }
  }

  async function vote(event: FormEvent) {
    event.preventDefault();
    if (!selectedOption) return setError("请先选择一个选项");
    await request("vote", { optionId: selectedOption, visitorId: getVisitorId() });
  }

  async function join(event: FormEvent) {
    event.preventDefault();
    await request("join", { name, visitorId: getVisitorId() });
  }

  async function share() {
    await navigator.clipboard.writeText(window.location.href);
    setMessage("分享链接已复制");
  }

  return (
    <>
      <div className={styles.activityHeader}>
        <div>
          <span className={`${styles.status} ${activity.status !== "open" ? styles.statusClosed : ""}`}>
            {activity.status === "open" ? "进行中" : activity.status === "drawn" ? "已开奖" : "已结束"}
          </span>
          <h1 className={styles.activityTitle}>{activity.title}</h1>
          {activity.description && <p className={styles.activityDescription}>{activity.description}</p>}
        </div>
        <div className={styles.actionBar}>
          <button className={styles.iconButton} onClick={share} type="button"><Share2 size={16} aria-hidden="true" /> 分享</button>
          <button aria-label="刷新数据" className={styles.iconButton} onClick={() => router.refresh()} type="button"><RefreshCw size={16} aria-hidden="true" /></button>
        </div>
      </div>

      {(message || error) && <p className={error ? styles.error : styles.success} role="status">{error || message}</p>}

      <div className={styles.grid}>
        <section className={styles.section}>
          {activity.type === "poll" ? (
            <>
              <h2 className={styles.sectionTitle}>选择一项</h2>
              <form onSubmit={vote}>
                <div className={styles.choiceList}>
                  {activity.options.map((option) => (
                    <label className={styles.choice} key={option.id}>
                      <input checked={selectedOption === option.id} disabled={activity.status !== "open"} name="option" onChange={() => setSelectedOption(option.id)} type="radio" />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <button className={`${styles.submitButton} ${styles.voteButton}`} disabled={busy || activity.status !== "open"} type="submit">
                  {operation === "vote" ? "正在提交..." : "确认投票"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className={styles.sectionTitle}>参与抽奖</h2>
              {winner ? (
                <div className={styles.winner}>
                  <span className={styles.winnerIcon}><Crown size={22} aria-hidden="true" /></span>
                  <div><p className={styles.muted}>本次中奖者</p><strong>{winner.name}</strong></div>
                </div>
              ) : (
                <form className={styles.joinRow} onSubmit={join}>
                  <input aria-label="参与者昵称" disabled={activity.status !== "open"} maxLength={60} onChange={(event) => setName(event.target.value)} placeholder="输入你的昵称" required value={name} />
                  <button className={styles.submitButton} disabled={busy || activity.status !== "open"} type="submit">{operation === "join" ? "提交中" : "报名"}</button>
                </form>
              )}
              <div className={styles.participantList} aria-label="参与者名单">
                {activity.participants.map((participant) => <span className={styles.participant} key={participant.id}>{participant.name}</span>)}
              </div>
              {activity.participants.length === 0 && <p className={styles.muted}>还没有人报名，分享链接邀请朋友参加。</p>}
            </>
          )}
        </section>

        <aside className={styles.section}>
          {activity.type === "poll" ? (
            <>
              <h2 className={styles.sectionTitle}>实时结果 · {totalVotes} 票</h2>
              <div className={styles.resultList}>
                {activity.options.map((option) => {
                  const percent = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                  return (
                    <div key={option.id}>
                      <div className={styles.resultTop}><span>{option.label}</span><strong>{option.votes} · {percent}%</strong></div>
                      <div className={styles.track}><div className={styles.fill} style={{ width: `${percent}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.sectionTitle}>活动状态</h2>
              <p className={styles.muted}>已有 {activity.participants.length} 人报名。开奖由创建者在服务端发起，结果只生成一次。</p>
              {adminToken && activity.status === "open" && (
                <div className={styles.adminBox}>
                  <p className={styles.muted}>你是此活动的创建者。</p>
                  <button className={styles.dangerButton} disabled={busy} onClick={() => request("draw", { adminToken })} type="button">
                    <Sparkles size={17} aria-hidden="true" /> {operation === "draw" ? "正在开奖..." : "立即开奖"}
                  </button>
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </>
  );
}
