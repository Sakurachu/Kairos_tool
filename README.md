# 集合工具

面向投票、抽奖等轻量在线场景的 Next.js 项目，已准备好通过 Git 和 Vercel 发布。

## 本地运行

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。健康检查地址为 `http://localhost:3000/api/health`。

## 上线前检查

```powershell
npm run check
```

## 环境变量

| 名称 | 是否保密 | 用途 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_NAME` | 否 | 站点名称 |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | 否 | 站点描述 |
| `NEXT_PUBLIC_SITE_URL` | 否 | 正式域名 |
| `DATABASE_URL` | 是 | PostgreSQL 连接字符串 |
| `ADMIN_SECRET` | 是 | 管理操作服务端密钥 |

`.env.example` 只保存变量名称和安全示例。真实值写入 `.env.local` 和 Vercel 项目设置，不能提交到 Git。

## 发布

完整步骤见 [DEPLOYMENT.md](./DEPLOYMENT.md)。本项目使用 Vercel 可自动识别的标准 Next.js 结构，因此暂时不需要 `vercel.json`。
