import Head from "next/head";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  ChevronRight,
  CornerDownRight,
  Link2,
  Loader2,
  Search,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";
import React, { useEffect } from "react";
import Link from "next/link";
import { cn, isEnter, toSearchURI } from "@/lib/utils";
import { addHistory, listHistory, removeHistory } from "@/lib/history";
import Icon from "@/components/icon";
import Clickable from "@/components/motion/clickable";
import { Badge } from "@/components/ui/badge"; // 添加Badge组件

export default function Home() {
  const [domain, setDomain] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [history, setHistory] = React.useState<string[]>([]);
  const [trashMode, setTrashMode] = React.useState<boolean>(false);
  const [currentDomainIndex, setCurrentDomainIndex] = React.useState(0);
  const domains = [
    "NIC.BN", "AI.KN", "L.KE", "F.AF", 
    "TOP.VG", "GAME.KG", "DOMAIN.BF", 
    "CXL.NET", "WHOIS.LS", "HELLO.UY", 
    "DEV.UG"
  ]; // 更新域名数组

  useEffect(() => {
    setHistory(listHistory());
    const interval = setInterval(() => {
      setCurrentDomainIndex((prevIndex) => (prevIndex + 1) % domains.length);
    }, 3000); // 每3秒切换域名
    return () => clearInterval(interval);
  }, []);

  const goStage = (target: string) => {
    setLoading(true);
  };

  const handleFocus = () => {
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  };

  const handleBlur = () => {
    document.body.style.position = '';
    document.body.style.width = '';
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <main className={"w-full h-full grid place-items-center p-4 md:p-6"}>
        <div className={"flex flex-col items-center w-full h-fit max-w-[568px]"}>
          <h1
            className={
              "text-lg md:text-2xl lg:text-3xl font-bold flex flex-row items-center select-none"
            }
          >
            <Search
              className={`w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-1.5 shrink-0`}
            />
             WHOIS.LS
          </h1>
          <div
            className={"flex flex-row items-center flex-wrap justify-center mt-1"}
          >
            {/* ... existing check icons ... */}
          </div>
          <div className={"relative flex flex-row items-center w-full mt-2"}>
            <Input
              className={`w-full text-center transition-all duration-300 hover:shadow`}
              placeholder={`domain name (e.g. whois.ls, 8.8.8.8)`}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => {
                if (isEnter(e)) {
                  goStage(domain);
                  window.location.href = toSearchURI(domain);
                }
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <Link
              href={toSearchURI(domain)}
              className={`absolute right-0`}
              onClick={() => domain.length > 0 && goStage(domain)}
            >
              <Button
                size={`icon`}
                variant={`outline`}
                className={`rounded-l-none transition`}
                disabled={domain.length === 0}
              >
                {loading ? (
                  <Loader2 className={`w-4 h-4 animate-spin`} />
                ) : (
                  <Send className={`w-4 h-4`} />
                )}
              </Button>
            </Link>
          </div>
          <div
            className={cn(
              `flex items-center flex-row w-full text-xs mt-1.5 select-none text-secondary transition`,
              loading && "text-primary",
            )}
          >
            <div className={`flex-grow`} />
            <CornerDownRight className={`w-3 h-3 mr-1`} />
            <p className={`px-1 py-0.5 border rounded-md`}>Enter</p>
          </div>
          {/* 新增的动态域名显示部分，居中显示在搜索框下方 */}
          <div className={"flex flex-row items-center justify-center w-full mt-2"}>
            <Badge variant="outline" className="ml-1" style={{ backgroundColor: 'black', color: 'white' }}>
              <span className="text-center">Part of my domain：{domains[currentDomainIndex]}</span>
            </Badge>
          </div>
          {history.length > 0 && (
            <>
              <div
                className={`mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-2 w-full h-fit`}
              >
                {history.map((item, index) => (
                  <Clickable tapScale={0.985} key={index}>
                    <Link
                      className={cn(
                        `text-sm w-full h-full`,
                        `flex flex-row items-center`,
                        `border rounded-md pl-3.5 pr-2.5 py-2 text-secondary`,
                        `group transition duration-500 ease-in-out`,
                        `hover:bg-background hover:text-primary hover:border-hover`,
                      )}
                      href={toSearchURI(item)}
                      onClick={(e) => {
                        if (trashMode) {
                          e.preventDefault();
                          removeHistory(item);
                          setHistory(listHistory());
                          return;
                        } else {
                          goStage(item);
                        }
                      }}
                    >
                      <Icon
                        icon={!trashMode ? <Link2 /> : <Trash2 />}
                        className={cn(
                          "w-4 h-4 mr-1 shrink-0",
                          trashMode && "text-red-600/80",
                        )}
                      />
                      <p className={`grow text-ellipsis overflow-hidden`}>
                        {item}
                      </p>
                      <ChevronRight
                        className={`transition-all shrink-0 w-4 h-4 ml-auto mr-1 group-hover:mr-0`}
                      />
                    </Link>
                  </Clickable>
                ))}
              </div>
              <div className={`flex flex-row items-center w-full mt-2`}>
                <Button
                  variant={`outline`}
                  size={`icon-sm`}
                  onClick={() => setTrashMode(!trashMode)}
                  tapClassName={`ml-auto`}
                >
                  <Icon
                    icon={trashMode ? <Undo2 /> : <Trash2 />}
                    className={`w-3.5 h-3.5`}
                  />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
