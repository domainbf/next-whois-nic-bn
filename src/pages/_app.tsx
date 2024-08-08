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
import { Inter } from 'next/font/google'; // Import Inter font

const inter = Inter({ subsets: ['latin'] }); // Define inter variable

// Define strEnv function
function strEnv(variableName: string, defaultValue: string): string {
  return process.env[variableName] || defaultValue;
}

const siteTitle = strEnv("NEXT_PUBLIC_SITE_TITLE", "Whois.ls");
const siteDescription = strEnv(
  "NEXT_PUBLIC_SITE_DESCRIPTION",
  "Whois Lookup Tool, Support Domain/IPv4/IPv6/ASN/CIDR Whois Lookup, Provided Beautiful, Clean and Simple UI."
);
const siteKeywords = strEnv(
  "NEXT_PUBLIC_SITE_KEYWORDS",
  "Whois, Lookup, Tool, whois"
);

// Use local image
const siteImage = "/gg.gif"; // Relative path pointing to the public folder image

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
  { text: "立即可购买的域名列表：DOMAIN.BN", link: "https://domain.bf" },
];

export default function App({ Component, pageProps }: AppProps) {
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prevIndex) =>
        prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change announcement every 5 seconds

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

        {/* Open Graph meta tags */}
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={siteImage} />
      </Head>
      <Toaster />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className={cn(`relative w-full h-full`, inter.className)}> {/* Use inter.className */}
          <div
            className={cn(
              `flex flex-row items-center space-x-4`,
              `absolute top-4 left-4 z-50` // Absolute positioning to fix at top of page
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
                  xmlns="http://www.w3.org/2000/svg" // Added namespace
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
