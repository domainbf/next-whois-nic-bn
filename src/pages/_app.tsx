import { useState, useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-switch";
import { Inter } from 'next/font/google'; // 导入 Inter 字体

const inter = Inter({ subsets: ['latin'] }); // 定义 inter 变量

// 定义 strEnv 函数
function strEnv(variableName: string, defaultValue: string): string {
  return process.env[variableName] || defaultValue;
}

const siteTitle = strEnv("NEXT_PUBLIC_SITE_TITLE", "Whois.ls");
const siteDescription = strEnv(
  "NEXT_PUBLIC_SITE_DESCRIPTION",
  "域名查询工具，支持域名/IPv4/IPv6/ASN/CIDR查询，帮助你获取域名的状态和持有人信息。"
);
const siteKeywords = strEnv(
  "NEXT_PUBLIC_SITE_KEYWORDS",
  "whois.ls, 域名Whois查询, DNS查询, ip查询, 域名持有人查询, Lookup, Tool, 域名状态"
);

// 使用本地图片
const siteImage = "/gg.gif"; // 仍然用作网站左上角的 logo
const ogImage = "/whoislogo.jpeg"; // 用于 Open Graph 和 Twitter Card 的图片

interface Announcement {
  text: string;
  link?: string;
}

const announcements: Announcement[] = [
  { text: "我们不存储不记录查询记录" },
  { text: "问题及反馈可发至：a@f.af" },
  { text: "我们不存储不记录所有查询内容" },
  { text: "提供域名注册和过期域名抢注服务" },
  { text: "域名注册、定制、延期交付：NIC.BN", link: "https://nic.bn" },
  { text: "立即可购买的域名列表：DOMAIN.BF", link: "https://domain.bf" },
];

export default function App({ Component, pageProps }: AppProps) {
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prevIndex) =>
        prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); 

    return () => {
      clearInterval(timer);
    };
  }, []);

  const currentAnnouncement = announcements[announcementIndex];

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph meta tags for social media preview */}
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://whois.ls" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteTitle} />

        {/* Twitter Card meta tags for Twitter preview */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:site" content="@yourTwitterHandle" />

        {/* Additional Meta Tags for Search Engines */}
        <link rel="image_src" href={ogImage} />
      </Head>
      <Toaster />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className={cn(`relative w-full h-full`, inter.className)}>
          <div
            className={cn(
              `flex flex-row items-center space-x-4`, // 补充 space-x-4
              `absolute top-4 left-4 z-50`
            )}
          >
            <img src={siteImage} alt="Logo" className="w-8 h-8" />
            <div className="text-sm">
              {currentAnnouncement.link ? (
                <a
                  href={currentAnnouncement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {currentAnnouncement.text}
                </a>
              ) : (
                currentAnnouncement.text
              )}
            </div>
          </div>
          <div
            className={cn(
              `absolute top-4 right-4 flex flex-row items-center z-50 space-x-2`
            )}
          >
            <ThemeToggle />
            <Link href={`https://domain.bf`} passHref>
              <Button variant={`outline`} size={`icon`} tapEnabled>
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="" // 修复了命名空间问题
                  className={`w-5 h-5 fill-primary`}
                >
                  <title>Earth</title>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z" />
                </svg>
              </Button>
            </Link>
          </div>
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}
