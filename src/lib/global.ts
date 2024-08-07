// src/lib/global.ts
import { Inter } from 'next/font/google';

// 使用 Google Fonts 中的 Inter 字体
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // 可选：定义 CSS 变量
});

export { inter };
