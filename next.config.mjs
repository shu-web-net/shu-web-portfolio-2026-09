/** @type {import('next').NextConfig} */
const nextConfig = {
  // Xserver静的配信用に静的書き出し（out/ に出力）
  output: 'export',
  // /blog/{slug}/ の末尾スラッシュURLを維持（WordPress時代のURL・SEO流入を守る）
  trailingSlash: true,
  // 静的エクスポートでは next/image の最適化サーバが無いため無効化
  images: { unoptimized: true },
};

export default nextConfig;
