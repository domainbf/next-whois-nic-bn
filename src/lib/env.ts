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

// 示例版本号
const version = "v1.0.0"; // 示例版本号
const cleanedVersion = version.replace(/^v/, ""); // 去掉开头的 "v"

// 使用 cleanedVersion
console.log(`项目名称: ${NAME}`); // 输出项目名称
console.log(`版本: ${cleanedVersion}`); // 输出去掉 "v" 的版本号

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
