import React, { useState } from 'react';
import { fetchDomainPrices } from '../api/nazhumi';

const DomainSearch = () => {
  const [domain, setDomain] = useState('');
  const [registrar, setRegistrar] = useState('aliyun'); // 默认注册商
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await fetchDomainPrices(domain, registrar);
      setPrices(data);
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
      
      {prices && (
        <div>
          <h3>价格信息</h3>
          <p>注册商: {prices.registrarname}</p>
          <p>注册价格: {prices.new !== 'n/a' ? `${prices.new} ${prices.currency}` : '不适用'}</p>
          <p>续费价格: {prices.renew !== 'n/a' ? `${prices.renew} ${prices.currency}` : '不适用'}</p>
          <p>转入价格: {prices.transfer !== 'n/a' ? `${prices.transfer} ${prices.currency}` : '不适用'}</p>
        </div>
      )}
    </div>
  );
};

export default DomainSearch;
