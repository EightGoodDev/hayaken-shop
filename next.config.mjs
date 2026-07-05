/** @type {import('next').NextConfig} */

// GitHub Pages（プロジェクトページ）配信用の basePath。
// CI（Actions）でのみ PAGES_BASE_PATH を設定し、ローカルの pnpm dev には影響させない。
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  // 静的サイトとして書き出す（out/）。サーバー不要でどこでもホストできる。
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
