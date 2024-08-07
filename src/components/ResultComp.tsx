// src/components/ResultComp.tsx
import React from 'react';

interface ResultCompProps {
  result?: string; // 新增 result 属性
  data?: any; // 根据实际数据结构定义类型
  target?: string; // 传入的目标域名
}

const ResultComp: React.FC<ResultCompProps> = ({ result, data, target }) => {
  return (
    <div>
      {result && <p>{result}</p>} {/* 显示 result 属性 */}
      {data && (
        <div>
          {/* 根据 data 显示其他信息 */}
          <h2>域名信息</h2>
          <p>目标域名: {target}</p>
          {/* 假设 data 包含价格和 Whois 信息 */}
          {data.price && <p>价格: {data.price}</p>}
          {data.whois && <p>Whois 信息: {data.whois}</p>}
        </div>
      )}
    </div>
  );
};

export default ResultComp;
