# Git 与 Vercel 发布

## 需要由项目所有者提供的信息

发布前确认以下内容：

- GitHub 用户名或组织名
- GitHub 仓库名称，以及公开或私有
- 正式站点名称和一句话描述
- 是否已经拥有域名；如有，请提供域名
- 数据库选择：推荐 Supabase 或 Neon
- Vercel 账号所连接的 GitHub 账号

不要通过聊天或 Git 提交发送数据库密码、Token、私钥。密钥应直接填写到本机 `.env.local` 或 Vercel 的 Environment Variables 页面。

## 1. 初始化 Git

```powershell
git init
git branch -M main
git add .
git commit -m "Initial project setup"
```

## 2. 上传 GitHub

先在 GitHub 网页创建一个空仓库，不要勾选生成 README 或 `.gitignore`，然后执行：

```powershell
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

可用以下命令确认远程地址和提交状态：

```powershell
git remote -v
git status
```

## 3. 创建数据库

在 Vercel Marketplace 中安装 Supabase 或 Neon，连接到当前 Vercel 项目。连接完成后确认 Production 和 Preview 环境都获得所需数据库变量。

数据库区域应尽量靠近 Vercel Function 的运行区域。数据库表和迁移会在投票功能开发时加入。

## 4. 导入 Vercel

1. 在 Vercel 点击 `Add New` -> `Project`。
2. 导入上一步的 GitHub 仓库。
3. Framework Preset 保持 `Next.js`。
4. Build Command、Output Directory 保持默认。
5. 添加 `.env.example` 中列出的环境变量。
6. 点击 `Deploy`。
7. 部署成功后访问 `/api/health`，应返回 `status: ok`。

## 5. 绑定域名

在 Vercel 项目的 `Settings` -> `Domains` 添加域名，并按提示修改 DNS。绑定成功后，把 `NEXT_PUBLIC_SITE_URL` 更新为正式 HTTPS 地址并重新部署。

## 日常发布

```powershell
git add .
git commit -m "Describe the change"
git push
```

推送 `main` 后 Vercel 会自动构建正式版本。功能分支和 Pull Request 应先使用 Preview Deployment 验证。
