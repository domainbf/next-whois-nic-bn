import React from 'react';
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
import Head from "next/head";
import Link from "next/link";
import { cn, isEnter, toSearchURI } from "@/lib/utils";
import { addHistory, listHistory, removeHistory } from "@/lib/history";
import ResultComp from './ResultComp';
import { VERSION } from "@/lib/env";

interface FixedInputProps {
  inputDomain: string;
  setInputDomain: (value: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const FixedInput: React.FC<FixedInputProps> = ({ inputDomain, setInputDomain, loading, setLoading }) => {
  const goStage = (target: string) => {
    setLoading(true);
    window.location.href = toSearchURI(inputDomain);
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
            <div
              className={
                "flex mx-1 my-0.5 flex-row items-center text-md text-secondary transition hover:text-primary cursor-pointer"
              }
            >
              <CheckIcon className={`w-4 h-4 mr-1 shrink-0`} />
              <p>Domain</p>
            </div>
            <div
              className={
                "flex mx-1 my-0.5 flex-row items-center text-md text-secondary transition hover:text-primary cursor-pointer"
              }
            >
              <CheckIcon className={`w-4 h-4 mr-1 shrink-0`} />
              <p>IPv4</p>
            </div>
            <div
              className={
                "flex mx-1 my-0.5 flex-row items-center text-md text-secondary transition hover:text-primary cursor-pointer"
              }
            >
              <CheckIcon className={`w-4 h-4 mr-1 shrink-0`} />
              <p>IPv6</p>
            </div>
            <div
              className={
                "flex mx-1 my-0.5 flex-row items-center text-md text-secondary transition hover:text-primary cursor-pointer"
              }
            >
              <CheckIcon className={`w-4 h-4 mr-1 shrink-0`} />
              <p>ASN</p>
            </div>
            <div
              className={
                "flex mx-1 my-0.5 flex-row items-center text-md text-secondary transition hover:text-primary cursor-pointer"
              }
            >
              <CheckIcon className={`w-4 h-4 mr-1 shrink-0`} />
              <p>CIDR</p>
            </div>
          </div>
          <div className={"relative flex flex-row items-center w-full mt-2"}>
            <Input
              className={`w-full text-center transition-all duration-300 hover:shadow`}
              placeholder={`domain name (e.g. whois.ls, 8.8.8.8)`}
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
              onKeyDown={(e) => {
                if (isEnter(e)) {
                  goStage(inputDomain);
                }
              }}
              style={{ touchAction: 'manipulation', userSelect: 'none' }} // 禁止页面缩放
            />
            <Link
              href={toSearchURI(inputDomain)}
              className={`absolute right-0`}
              onClick={() => inputDomain.length > 0 && goStage(inputDomain)}
            >
              <Button
                size={`icon`}
                variant={`outline`}
                className={`rounded-l-none transition`}
                disabled={inputDomain.length === 0}
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
          <ResultComp result="This is a placeholder result." />
        </div>
      </main>
    </>
  );
};

export default FixedInput;
