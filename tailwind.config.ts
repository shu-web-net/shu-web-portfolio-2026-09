import type { Config } from 'tailwindcss';

// テーマの実体はCSS変数（globals.cssの:root）。ここではそれをTailwindのトークンにマップし、
// ユーティリティ（bg-surface / text-muted / border-line 等）から参照できるようにする。
// 色はCSS変数駆動でライト/ダークが自動で切り替わるため、dark:バリアントは基本不要。
// 例外：@tailwindcss/typography の prose/prose-invert 切替だけは dark: バリアントを使うので、
// 独自のテーマ切替（[data-theme="dark"]）と連動するようセレクタ戦略を指定する。
const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        accentink: 'var(--accent-ink)',
        chip: 'var(--chip-bg)',
        chipline: 'var(--chip-line)',
        nda: 'var(--nda-bg)',
        ndaink: 'var(--nda-ink)',
      },
      fontFamily: {
        sans: 'var(--sans)',
        mono: 'var(--mono)',
      },
      boxShadow: {
        card: 'var(--shadow)',
      },
      maxWidth: {
        wrap: '1080px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
