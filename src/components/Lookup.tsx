import React, { useEffect } from 'react';
import { fetchWhoisData } from '../api/whois'; // 导入 Whois API 函数
import { fetchDomainPrice } from '../api/nazhumi'; // 假设这是获取域名价格的 API 函数
import { Button, Input as CustomInput, Loader2, Badge, Link as NextLink, ScrollArea } from './YourComponentLibrary'; // 使用别名导入 Link
import ResultComp from './ResultComp'; // 确保 ResultComp 组件的路径正确
import { Search, Send, CornerDownRight } from 'lucide-react'; // 根据实际情况导入图标

interface Props {
  data: any; // 根据实际数据结构定义类型
  target: string;
}

export default function Lookup({ data, target }: Props) {
  const [inputDomain, setInputDomain] = React.useState<string>(target);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [domainInfo, setDomainInfo] = React.useState<any>(null); // 新增状态存储域名信息
  const [error, setError] = React.useState<string | null>(null); // 新增状态存储错误信息

  const goStage = async (target: string) => {
    setLoading(true);
    setError(null); // 清除之前的错误信息

    try {
      // 获取域名价格信息
      const priceData = await fetchDomainPrice(inputDomain);
      // 获取 Whois 数据
      const whoisData = await fetchWhoisData(inputDomain);
      
      // 更新状态
      setDomainInfo({ price: priceData, whois: whoisData });
    } catch (err) {
      setError('获取域名信息失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 其他副作用逻辑
  }, [target]); // Dependency array to run effect when target changes

  return (
    <ScrollArea className="w-full h-full overflow-auto">
      <main className="relative w-full min-h-full grid place-items-center px-4 pt-20 pb-6">
        <div className="flex flex-col items-center w-full h-fit max-w-[568px] m-2">
          <h1 className="text-lg md:text-2xl lg:text-3xl font-bold flex flex-row items-center select-none">
            <Search className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-1.5 shrink-0" />
            域名信息查询
          </h1>
          <p className="text-md text-center text-secondary">
            请在下方输入要查找的域名或IP等信息
          </p>
          <div className="relative flex flex-row items-center w-full mt-2">
            <CustomInput // 使用别名
              className="w-full text-center transition-all duration-300 hover:shadow"
              placeholder="domain name (e.g. google.com, 8.8.8.8)"
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  goStage(inputDomain);
                }
              }}
              style={{ flexShrink: 0, minWidth: '300px' }} // 确保输入框不缩放并固定宽度
            />
            <Button
              size="icon"
              variant="outline"
              className="absolute right-0 rounded-l-none"
              onClick={() => goStage(inputDomain)}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          {error && <p className="text-red-500">{error}</p>} {/* 显示错误信息 */}
          {domainInfo && (
            <ResultComp data={domainInfo} target={inputDomain} isCapture={false} /> // 将获取到的域名信息传递给 ResultComp
          )}
          <div className="flex items-center flex-row w-full text-xs mt-1.5 select-none text-secondary transition">
            <div className="flex-grow" />
            <CornerDownRight className="w-3 h-3 mr-1" />
            <p className="px-1 py-0.5 border rounded-md">Enter</p>
          </div>
        </div>
        <div className="mt-12 text-sm flex flex-row items-center font-medium text-muted-foreground select-none">
          © 2024 由{" "}
          <NextLink
            href="https://nic.bn"
            target="_blank"
            className="text-primary underline underline-offset-2 mx-1"
          >
            NIC.BN
          </NextLink>
          运营
          <Badge variant="outline" className="ml-1" style={{ backgroundColor: 'black', color: 'white' }}>
            <span className="ml-1">作者: Minghan Zhang</span>
          </Badge>
          <Badge variant="outline">v{NAME}</Badge>
        </div>
      </main>
    </ScrollArea>
  );
}
