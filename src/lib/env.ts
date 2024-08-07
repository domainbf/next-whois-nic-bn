import { useEffect } from 'react';

// 项目名称
export const NAME = "0.3.0"; // 这里定义项目名称

// 从环境变量获取历史记录限制，默认为 6
export const HISTORY_LIMIT: number = intEnv("NEXT_PUBLIC_HISTORY_LIMIT", 6);

// 从环境变量获取 WHOIS 跟踪限制，默认为 0
export const MAX_WHOIS_FOLLOW: number = intEnv("NEXT_PUBLIC_MAX_WHOIS_FOLLOW", 0);

// 从环境变量获取 IP WHOIS 跟踪限制，默认为 5
export const MAX_IP_WHOIS_FOLLOW: number = intEnv("NEXT_PUBLIC_MAX_IP_WHOIS_FOLLOW", 5);

// 从环境变量中获取整数值的辅助函数
function intEnv(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (value === undefined) return defaultValue; // 修复: 使用严格比较

  const parsed = parseInt(value);
  if (isNaN(parsed)) return defaultValue;

  return parsed;
}

// 从环境变量中获取字符串值的辅助函数
export function strEnv(name: string, defaultValue?: string): string {
  return process.env[name] || defaultValue || "";
}
// React 组件
const MyComponent = () => {
  useEffect(() => {
    // 动态创建黑框和文本
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.marginTop = '20px';

    const projectNameElement = document.createElement('span');
    projectNameElement.textContent = `项目名称: ${NAME}`;
    container.appendChild(projectNameElement);

    const blackBox = document.createElement('div');
    blackBox.textContent = '感谢作者';
    blackBox.style.backgroundColor = 'black';
    blackBox.style.color = 'white';
    blackBox.style.padding = '5px 10px';
    blackBox.style.marginLeft = '10px';
    blackBox.style.borderRadius = '5px';

    container.appendChild(blackBox);

    // 将黑框和项目名称添加到 body 中
    document.body.appendChild(container);

    // 清理函数，移除 DOM 元素
    return () => {
      document.body.removeChild(container);
    };
  }, []); // 依赖数组为空，确保只在组件挂载时执行

  return null; // 如果没有其他内容，返回 null
};

export default MyComponent;
