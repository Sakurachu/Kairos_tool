# 小工具

基于 Next.js、Vercel 和 Neon PostgreSQL 的在线投票与抽奖工具。

## 功能

- 创建投票，分享链接并实时查看结果
- 匿名浏览器身份去重，限制重复投票
- 创建抽奖、收集参与者并由服务端安全随机开奖
- 创建者管理密钥仅保存在创建活动的浏览器中
- 开奖结果持久化，刷新或重新访问不会改变

## 本地运行

首次使用时安装并登录 Vercel CLI，然后关联线上项目：

```powershell
npm install
npx vercel link --project kairos-tool --scope sakurachus-projects
npx vercel env pull .env.local --environment=development
npm run db:migrate
npm run dev
```

打开 `http://localhost:3000`。健康检查地址为 `/api/health`。

## 检查与迁移

```powershell
npm run check
npm run db:migrate
```

数据库迁移采用可重复执行的 `CREATE TABLE IF NOT EXISTS`，脚本位于 `scripts/migrate.mjs`。

## 环境变量

| 名称 | 是否保密 | 用途 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_NAME` | 否 | 站点名称 |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | 否 | 站点描述 |
| `NEXT_PUBLIC_SITE_URL` | 否 | 正式域名 |
| `DATABASE_URL` | 是 | Neon PostgreSQL 连接字符串 |
| `VISITOR_SALT` | 是 | 匿名参与身份哈希盐 |

`.env.local` 和 `.vercel` 已被 Git 忽略。不要把数据库连接字符串、Token 或其他密钥提交到仓库。

## 发布

推送 `main` 分支后 Vercel 会自动部署。详细维护步骤见 [DEPLOYMENT.md](./DEPLOYMENT.md)。
