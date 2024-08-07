// src/components/ResultComp.tsx
import React from 'react';

interface PriceInfo {
  new: string;
  renew: string;
  transfer: string;
  currency: string;
}

interface Props {
  data: {
    status: boolean;
    result: any; // 根据实际数据类型定义
    error: string | null;
    time: number;
    price: PriceInfo;
  };
  target: string;
  isCapture: boolean;
}

const ResultComp = React.forwardRef<HTMLDivElement, Props>(
  ({ data, target, isCapture }: Props, ref) => {
    const { status, result, error, price } = data;

    return (
      <div className={`w-full h-fit mt-4 ${isCapture ? "flex flex-col items-center m-0 p-4 w-full bg-background" : ""}`}>
        <div ref={ref} className={`shadow ${isCapture ? "w-fit max-w-[768px]" : ""}`}>
          <div className="mb-2">
            <h2 className="text-lg font-semibold">域名信息概览</h2>
            <p className="text-sm text-gray-600">以下是关于域名的详细信息：</p>
          </div>
          <h3 className={`flex flex-row items-center text-lg md:text-xl`}>详情如下:</h3>
          <div className={`w-full p-0`}>
            {!status ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              <div className={`flex flex-col h-fit w-full mt-2`}>
                {/* 显示 Whois 数据的表格 */}
                <div>{JSON.stringify(result)}</div>

                {/* 显示价格信息 */}
                <div className="mt-2">
                  <h3 className="text-md font-semibold">价格信息</h3>
                  <p>注册价格: {price.new} {price.currency}</p>
                  <p>续费价格: {price.renew} {price.currency}</p>
                  <p>转入价格: {price.transfer} {price.currency}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default ResultComp;
