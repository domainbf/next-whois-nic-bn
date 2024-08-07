// src/api/nazhumi.js
const API_URL = 'https://www.nazhumi.com/api/v1';

export const fetchDomainPrices = async (domain, registrar) => {
  const response = await fetch(`${API_URL}?domain=${domain}&registrar=${registrar}`);
  if (!response.ok) {
    throw new Error('无法获取价格信息');
  }
  return response.json();
};
