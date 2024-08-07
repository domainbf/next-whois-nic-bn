// src/pages/_app.tsx
import { strEnv } from '@/utils'; // 确保路径正确
import { ThemeToggle } from '@/components/theme-switch';

const siteTitle = strEnv("NEXT_PUBLIC_SITE_TITLE", "Whois");
const siteDescription = strEnv("NEXT_PUBLIC_SITE_DESCRIPTION", "Whois Lookup Tool, Support Domain/IPv4/IPv6/ASN/CIDR Whois Lookup, Provided Beautiful, Clean and Simple UI.");

// 其他代码...
