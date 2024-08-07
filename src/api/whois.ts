// src/api/whois.ts
export const fetchWhoisData = async (domain: string) => {
  // 假设这是一个 API 调用
  const response = await fetch(`https://www.whois.ls/=${domain}`);
  if (!response.ok) {
    throw new Error('无法获取 Whois 数据');
  }
  const data = await response.json();
  return data;
};
