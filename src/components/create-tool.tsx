"use client";

import { ArrowRight, Gift, Plus, Trash2, Vote } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import styles from "@/app/tool.module.css";
import type { ActivityType } from "@/lib/activity";

export function CreateTool({ initialType }: { initialType: ActivityType }) {
  const router = useRouter();
  const [type, setType] = useState<ActivityType>(initialType);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function changeOption(index: number, value: string) {
    setOptions((current) => current.map((option, i) => (i === index ? value : option)));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          description,
          options: type === "poll" ? options : [],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "创建失败");
      localStorage.setItem(`kairos:admin:${data.id}`, data.adminToken);
      router.push(`/a/${data.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "创建失败");
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.segment} aria-label="活动类型">
        <button className={type === "poll" ? styles.active : ""} onClick={() => setType("poll")} type="button">
          <Vote size={18} aria-hidden="true" /> 投票
        </button>
        <button className={type === "lottery" ? styles.active : ""} onClick={() => setType("lottery")} type="button">
          <Gift size={18} aria-hidden="true" /> 抽奖
        </button>
      </div>

      <form className={styles.form} onSubmit={submit}>
        <div className={styles.field}>
          <label htmlFor="title">活动名称</label>
          <input id="title" maxLength={120} onChange={(event) => setTitle(event.target.value)} placeholder={type === "poll" ? "例如：周末去哪儿？" : "例如：七月幸运抽奖"} required value={title} />
        </div>
        <div className={styles.field}>
          <label htmlFor="description">补充说明（可选）</label>
          <textarea id="description" maxLength={500} onChange={(event) => setDescription(event.target.value)} placeholder="参与规则、截止时间或其他说明" value={description} />
        </div>

        {type === "poll" && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>投票选项</span>
            <div className={styles.optionList}>
              {options.map((option, index) => (
                <div className={styles.optionRow} key={index}>
                  <input aria-label={`选项 ${index + 1}`} maxLength={80} onChange={(event) => changeOption(index, event.target.value)} placeholder={`选项 ${index + 1}`} required value={option} />
                  <button aria-label={`删除选项 ${index + 1}`} className={styles.removeButton} disabled={options.length <= 2} onClick={() => setOptions((current) => current.filter((_, i) => i !== index))} type="button">
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            {options.length < 10 && (
              <button className={styles.addButton} onClick={() => setOptions((current) => [...current, ""])} type="button">
                <Plus size={17} aria-hidden="true" /> 添加选项
              </button>
            )}
          </div>
        )}

        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.submitButton} disabled={submitting} type="submit">
          {submitting ? "正在创建..." : "创建并获取分享链接"}
          {!submitting && <ArrowRight size={18} aria-hidden="true" />}
        </button>
      </form>
    </div>
  );
}
