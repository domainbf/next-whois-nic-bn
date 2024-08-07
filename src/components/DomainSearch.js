// src/components/DomainSearch.tsx
import React, { useState } from 'react';
import { fetchDomainPrices } from '../api/nazhumi'; // 假设这是获取价格的 API
import { fetchWhoisData } from '../api/whois'; // 假设这是获取 Whois 数据的 API
import ResultComp from './ResultComp'; // 导入 ResultComp 组件

const DomainSearch = () => {
  const [domain, setDomain] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 获取 Whois 数据
      const whoisData = await fetchWhoisData(domain);
      // 获取价格信息
      const priceData = await fetchDomainPrices(domain, 'aliyun'); // 替换为适当的注册商

      // 将 Whois 数据和价格合并
      setData({ ...whoisData, price: priceData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="输入域名后缀 (如 .com)"
          required
        />
        <button type="submit">搜索</button>
      </form>

      {loading && <p>加载中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <ResultComp data={data} target={domain} isCapture={false} />
      )}
    </div>
  );
};

export default DomainSearch;
