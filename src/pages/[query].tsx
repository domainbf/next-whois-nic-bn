import { lookupWhois } from "@/lib/whois/lookup";
import {
  cleanDomainQuery,
  cn,
  isEnter,
  toReadableISODate,
  toSearchURI,
  useClipboard,
} from "@/lib/utils";
import { NextPageContext } from "next";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CopyIcon,
  CornerDownRight,
  ExternalLink,
  Link2,
  Loader2,
  Search,
  Send,
  ShieldIcon,
  ShieldOffIcon,
  ShieldQuestionIcon,
  Unlink2,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { useEffect, useMemo } from "react";
import { addHistory } from "@/lib/history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NAME } from "@/lib/env";  // 更改 VERSION 为 NAME
import { WhoisAnalyzeResult, WhoisResult } from "@/lib/whois/types";
import Icon from "@/components/icon";
import { useImageCapture } from "@/lib/image";
import ErrorArea from "@/components/items/error-area";
import RichTextarea from "@/components/items/rich-textarea";
import InfoText from "@/components/items/info-text";
import Clickable from "@/components/motion/clickable";

type Props = {
  data: WhoisResult;
  target: string;
  isCapture?: boolean;
};

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context;
  const target: string = cleanDomainQuery(query);

  return {
    props: {
      data: await lookupWhois(target),
      target,
    },
  };
}

type ResultTableProps = {
  result?: WhoisAnalyzeResult;
  target: string;
};

function getDnssecIcon(dnssec?: string) {
  if (!dnssec) {
    return <ShieldQuestionIcon />;
  }
  const key = dnssec.toLowerCase();

  switch (key) {
    case "unsigned":
      return <ShieldOffIcon />;
    case "signed":
      return <ShieldIcon />;
    default:
      return <ShieldQuestionIcon />;
  }
}

function ResultTable({ result, target }: ResultTableProps) {
  const Row = ({
    name,
    value,
    children,
    hidden,
    likeLink,
  }: {
    name: string;
    value: any;
    hidden?: boolean;
    children?: React.ReactNode;
    likeLink?: boolean;
  }) =>
    !hidden && (
      <tr>
        <td
          className={`py-1 pr-2 text-right font-medium text-secondary whitespace-pre-wrap md:w-36`}
        >
          {name}
        </td>
        <td
          className={cn(
            `py-1 pl-2 text-left text-primary whitespace-pre-wrap break-all`,
            likeLink && `cursor-pointer hover:underline`,
          )}
          onClick={() => {
            if (likeLink) {
              window.open(
                value.startsWith("http") ? value : `http://${value}`,
                "_blank",
                "noopener,noreferrer",
              );
            }
          }}
        >
          {value}
          {children}
        </td>
      </tr>
    );

  const StatusComp = () => {
    if (!result || result.status.length === 0) {
      return "N/A";
    }

    const status = useMemo(() => {
      const length = result.status.length;
      if (length > 3 && !expand) {
        return [
          ...result.status.slice(0, 3),
          {
            status: `...${length - 3} more`,
            url: "expand",
          },
        ];
      }

      return result.status;
    }, [result.status]);

    return (
      <div className={`inline-flex flex-row items-center flex-wrap`}>
        {status.map((status, index) => (
          <Link
            href={status.url}
            key={index}
            target={`_blank`}
            className={`inline-flex group flex-row whitespace-nowrap flex-nowrap items-center m-0.5 cursor-pointer px-1 py-0.5 border rounded text-xs`}
            onClick={(e) => {
              if (status.url === "expand") {
                e.preventDefault();
                setExpand(!expand);
              } else if (!status.url) {
                e.preventDefault();
              }
            }}
          >
            {status.url !== "expand" && (
              <Icon
                icon={status.url ? <Link2 /> : <Unlink2 />}
                className={`w-3 h-3 mr-1 shrink-0 text-muted-foreground transition group-hover:text-primary`}
              />
            )}
            {status.status}
          </Link>
        ))}
      </div>
    );
  };

  const [expand, setExpand] = React.useState<boolean>(false);
  const copy = useClipboard();

  return (
    result && (
      <table className={`w-full text-sm mb-4 whitespace-pre-wrap`}>
        <tbody>
          <Row name={`域名:`} value={result.domain || target.toUpperCase()} />
          <Row name={`状态:`} value={<StatusComp />} />
          <Row
            name={`注册商:`}
            value={result.registrar}
            hidden={!result.registrar || result.registrar === "Unknown"}
          />
          <Row
            name={`网址:`}
            value={result.registrarURL}
            likeLink
            hidden={!result.registrarURL || result.registrarURL === "Unknown"}
          />
          <Row
            name={`注册商ID:`}
            value={result.ianaId}
            hidden={!result.ianaId || result.ianaId === "N/A"}
          >
            <Link
              className={`inline-flex ml-1`}
              href={`https://www.internic.net/registrars/registrar-${result.ianaId ?? 0}.html`}
              target={`_blank`}
            >
              <Button variant={`ghost`} size={`icon-xs`}>
                <ExternalLink className={`w-3 h-3`} />
              </Button>
            </Link>
          </Row>

          {/* IP Whois Only */}
          <Row
            name={`CIDR`}
            value={result.cidr}
            hidden={!result.cidr || result.cidr === "Unknown"}
          />
          <Row
            name={`类型`}
            value={result.netType}
            hidden={!result.netType || result.netType === "Unknown"}
          />
          <Row
            name={`公司`}
            value={result.netName}
            hidden={!result.netName || result.netName === "Unknown"}
          />
          <Row
            name={`IP段`}
            value={result.inetNum}
            hidden={!result.inetNum || result.inetNum === "Unknown"}
          />
          <Row
            name={`INet6 Num`}
            value={result.inet6Num}
            hidden={!result.inet6Num || result.inet6Num === "Unknown"}
          />
          <Row
            name={`范围`}
            value={result.netRange}
            hidden={!result.netRange || result.netRange === "Unknown"}
          />
          <Row
            name={`源地`}
            value={result.originAS}
            hidden={!result.originAS || result.originAS === "Unknown"}
          />
          {/* IP Whois Only End */}

          <Row
            name={`WHOIS:`}
            value={result.whoisServer}
            likeLink
            hidden={!result.whoisServer || result.whoisServer === "Unknown"}
          />

          <Row
            name={`注册日期:`}
            value={toReadableISODate(result.creationDate)}
            hidden={!result.creationDate || result.creationDate === "Unknown"}
          >
            <InfoText content={`UTC`} />
          </Row>
          <Row
            name={`更新日期:`}
            value={toReadableISODate(result.updatedDate)}
            hidden={!result.updatedDate || result.updatedDate === "Unknown"}
          >
            <InfoText content={`UTC`} />
          </Row>
          <Row
            name={`到期日期:`}
            value={toReadableISODate(result.expirationDate)}
            hidden={
              !result.expirationDate || result.expirationDate === "Unknown"
            }
          >
            <InfoText content={`UTC`} />
          </Row>
          <Row
            name={`登记人:`}
            value={result.registrantOrganization}
            hidden={
              !result.registrantOrganization ||
              result.registrantOrganization === "Unknown"
            }
          />
          <Row
            name={`城市地址:`}
            value={result.registrantProvince}
            hidden={
              !result.registrantProvince ||
              result.registrantProvince === "Unknown"
            }
          />
          <Row
            name={`国家代码:`}
            value={result.registrantCountry}
            hidden={
              !result.registrantCountry ||
              result.registrantCountry === "Unknown"
            }
          />
          <Row
            name={`联系电话:`}
            value={result.registrantPhone}
            hidden={
              !result.registrantPhone || result.registrantPhone === "Unknown"
            }
          >
            <InfoText content={`Abuse`} />
          </Row>
          <Row
            name={`联系邮箱:`}
            value={result.registrantEmail}
            hidden={
              !result.registrantEmail || result.registrantEmail === "Unknown"
            }
          />
          <Row
            name={`域名DNS:`}
            value={
              <div className={`flex flex-col`}>
                {result.nameServers.map((ns, index) => (
                  <div
                    key={index}
                    className={`text-secondary hover:text-primary transition duration-500 text-xs border cursor-pointer rounded-md px-1 py-0.5 mt-0.5 w-fit inline-flex flex-row items-center`}
                    onClick={() => copy(ns)}
                  >
                    <CopyIcon className={`w-2.5 h-2.5 mr-1`} />
                    {ns}
                  </div>
                ))}
              </div>
            }
            hidden={result.nameServers.length === 0}
          />
          <Row name={`DNSSEC:`} value={result.dnssec} hidden={!result.dnssec}>
            <Icon
              className={`inline w-3.5 h-3.5 ml-1.5`}
              icon={getDnssecIcon(result.dnssec)}
            />
          </Row>
        </tbody>
      </table>
    )
  );
}

const ResultComp = React.forwardRef<HTMLDivElement, Props>(
  ({ data, target, isCapture }: Props, ref) => {
    const copy = useClipboard();
    const captureObject = React.useRef<HTMLDivElement>(null);
    const capture = useImageCapture(captureObject);

    const { status, result, error, time, price } = data; // 确保 price 包含在 data 中

    return (
      <div
        className={cn(
          "w-full h-fit mt-4",
          isCapture && "flex flex-col items-center m-0 p-4 w-full bg-background"
        )}
      >
        <Card
          ref={ref}
          className={cn("shadow", isCapture && "w-fit max-w-[768px]")}
        >
          <CardHeader>
            {/* 新增的域名价格信息 */}
            <div className="mb-2">
              <h3 className="text-md font-semibold">域名价格信息</h3>
              <p>注册价格: {price?.new} {price?.currency}</p>
              <p>续费价格: {price?.renew} {price?.currency}</p>
              <p>转入价格: {price?.transfer} {price?.currency}</p>
            </div>
            <CardTitle className={`flex flex-row items-center text-lg md:text-xl`}>
              详情如下:
              {!isCapture && (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant={`outline`}
                      size={`icon-sm`}
                      className={`ml-2`}
                      tapEnabled
                    >
                      <Camera className={`w-4 h-4`} />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>域名卡片</DrawerTitle>
                      <DrawerClose />
                    </DrawerHeader>
                    <div className={`my-2`}>
                      <ResultComp
                        data={data}
                        target={target}
                        ref={captureObject}
                        isCapture={true}
                      />
                    </div>
                    <DrawerFooter>
                      <Button
                        variant={`outline`}
                        onClick={() => capture(`whois-${target}`)}
                        className={`flex flex-row items-center w-full max-w-[768px] mx-auto`}
                        tapEnabled
                      >
                        <Camera className={`w-4 h-4 mr-2`} />
                        点击下载
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
              <div className={`flex-grow`} />
              <Clickable className={`w-fit h-fit inline-flex ml-2 mr-1`}>
                <Badge
                  className={cn(
                    `inline-flex max-w-36 md:max-w-64 flex-row items-center space-x-1 cursor-pointer select-none`,
                    isCapture && "max-w-72",
                  )}
                  onClick={() => copy(target)}
                >
                  <div
                    className={cn(
                      "w-2 h-2 shrink-0 rounded-full",
                      status ? "bg-green-500" : "bg-red-500",
                    )}
                  />
                  <p
                    className={cn(
                      `grow`,
                      !isCapture && `text-ellipsis overflow-hidden`,
                    )}
                  >
                    {target}
                  </p>
                </Badge>
              </Clickable>
              <Badge variant={`outline`}>{time.toFixed(2)}s</Badge>
            </CardTitle>
            <CardContent className={`w-full p-0`}>
              {!status ? (
                <ErrorArea error={error} />
              ) : (
                <div className={`flex flex-col h-fit w-full mt-2`}>
                  <ResultTable result={result} target={target} />

                  {!isCapture && (
                    <RichTextarea
                      className={`mt-2`}
                      name={`原始whois数据可复制及下载👉`}
                      value={result?.rawWhoisContent}
                      saveFileName={`${target.replace(/\./g, "-")}-whois.txt`}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    );
  }
);

// src/components/Lookup.tsx
import React, { useEffect } from 'react';
import { fetchWhoisData } from '../api/whois'; // 导入 Whois API 函数
import { fetchDomainPrice } from '../api/nazhumi'; // 假设这是获取域名价格的 API 函数
import { Button, Input as CustomInput, Loader2, Badge, Link, ScrollArea } from './YourComponentLibrary'; // 使用别名导入 Input
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
            <ResultComp data={domainInfo} target={inputDomain} result="This is a placeholder result." /> // 将获取到的域名信息传递给 ResultComp
          )}
          <div className="flex items-center flex-row w-full text-xs mt-1.5 select-none text-secondary transition">
            <div className="flex-grow" />
            <CornerDownRight className="w-3 h-3 mr-1" />
            <p className="px-1 py-0.5 border rounded-md">Enter</p>
          </div>
        </div>
        <div className="mt-12 text-sm flex flex-row items-center font-medium text-muted-foreground select-none">
          © 2024 由{" "}
          <Link
            href="https://nic.bn"
            target="_blank"
            className="text-primary underline underline-offset-2 mx-1"
          >
            NIC.BN
          </Link>
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
