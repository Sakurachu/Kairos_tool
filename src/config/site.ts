export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "集合工具",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "用于投票、抽奖和日常选择的轻量在线工具。数据功能将在数据库连接后启用。",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
