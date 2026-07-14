# 部署与维护

## 当前资源

- GitHub：`Sakurachu/Kairos_tool`
- Vercel 项目：`sakurachus-projects/kairos-tool`
- 正式站点：`https://tool.sakurachu.cn`
- Vercel 备用域名：`https://kairos-tool.vercel.app`
- 数据库：Neon `kairos-tool-db`，Free 方案，区域 `iad1`

Neon 已连接 Production、Preview、Development 环境，环境变量前缀为 `DATABASE`。

## 日常发布

```powershell
npm run check
git add .
git commit -m "Describe the change"
git push
```

`main` 分支推送成功后，Vercel 自动创建 Production Deployment。

## 数据库变更

1. 修改 `scripts/migrate.mjs`，迁移必须可以重复执行。
2. 本地执行 `npm run db:migrate`。
3. 完成代码兼容性验证后再提交。

当前 Production、Preview 和 Development 使用同一数据库资源，尚未开启每次部署自动创建数据库分支。

## 拉取环境变量

```powershell
npx vercel env pull .env.local --environment=development
```

变量修改后，旧的 Vercel Deployment 不会自动更新，需要重新部署或推送新提交。

## 自定义域名

`tool.sakurachu.cn` 通过阿里云 DNS 的 CNAME 记录连接 Vercel。修改或删除该记录会导致正式域名不可用；Vercel 自动管理 HTTPS 证书。
