import moment from "moment";

import { getDomainRegex } from "@/lib/whois/lib";
import { DomainStatusProps, WhoisAnalyzeResult } from "@/lib/whois/types";
import { analyzeWhois } from "@/lib/whois/common_parser";

export function parseWhoisData(rawData: string, domain: string) {
  // preflight check
  if (!rawData) {
    throw new Error("未收到 Whois 数据");
  } else if (rawData.length <= 10) {
    throw new Error(`收到错误的 Whois 数据: ${rawData}`);
  }

  const filterRegex = getDomainRegex(domain.toLowerCase());

// notFound Match
const rawContent = rawData.toLowerCase();
if (
  rawContent.match(filterRegex.notFound) ||
  rawContent.includes("no match") ||
  rawContent.includes("this query returned 0 objects") ||
  rawContent.includes("not found") ||
  rawContent.includes("no entries found") ||
  rawContent.includes("no data found")
) {
  if (rawContent.includes("no match")) {
    throw new Error("该域名未注册或不支持此后缀。");
  } else if (rawContent.includes("this query returned 0 objects")) {
    throw new Error("未找到与该域名相关的任何信息。");
  } else if (rawContent.includes("not found")) {
    throw new Error("未找到该域名的TLD服务器。");
  } else if (rawContent.includes("no entries found")) {
    throw new Error("该域名没有任何条目。");
  } else if (rawContent.includes("no data found")) {
    throw new Error("未找到相关数据，请检查域名是否正确。");
  } else {
    throw new Error("未找到域名或TLD。");
  }
}

// invalid request Match
if (
  rawContent.includes("invalid query") ||
  rawContent.includes("invalid request") ||
  rawContent.includes("invalid domain name") ||
  rawContent.includes("invalid input") ||
  rawContent.includes("invalid object") ||
  rawContent.includes("invalid syntax") ||
  rawContent.includes("invalid character") ||
  rawContent.includes("invalid data") ||
  rawContent.includes("malformed query") ||
  rawContent.includes("malformed request")
) {
  if (rawContent.includes("invalid query")) {
    throw new Error("查询无效，请检查您的输入。");
  } else if (rawContent.includes("invalid request")) {
    throw new Error("请求无效，请确保格式正确。");
  } else if (rawContent.includes("invalid domain name")) {
    throw new Error("域名无效，请检查域名格式。");
  } else if (rawContent.includes("invalid input")) {
    throw new Error("输入无效，请提供有效的查询内容。");
  } else if (rawContent.includes("invalid object")) {
    throw new Error("对象无效，请检查请求内容。");
  } else if (rawContent.includes("invalid syntax")) {
    throw new Error("语法无效，请检查您的查询语法。");
  } else if (rawContent.includes("invalid character")) {
    throw new Error("包含无效字符，请检查输入。");
  } else if (rawContent.includes("invalid data")) {
    throw new Error("数据无效，请确保输入正确。");
  } else if (rawContent.includes("malformed query")) {
    throw new Error("查询格式错误，请检查您的输入。");
  } else if (rawContent.includes("malformed request")) {
    throw new Error("请求格式错误，请确保输入的内容符合要求。");
  } else {
    throw new Error("请求无效，请检查您的输入。");
  }
}

  // rateLimited Match
  if (
    filterRegex.rateLimited &&
    (rawData.match(filterRegex.rateLimited) ||
      rawContent.includes("rate limit") ||
      rawContent.includes("server too busy"))
  ) {
    throw new Error("慢一点，太快了受不了。");
  }

  // pre set result
  const result: WhoisAnalyzeResult = analyzeWhois(rawData);

  // domainName Match
  if (filterRegex.domainName) {
    const regex = new RegExp(filterRegex.domainName);
    const match = rawData.match(regex);
    if (match) {
      result.domain = match[1].toUpperCase();
    }
  }

  // registrar Match
  if (filterRegex.registrar) {
    const regex = new RegExp(filterRegex.registrar);
    const match = rawData.match(regex);
    if (match) {
      result.registrar = match[1];
    }
  }

  // status Match
  if (filterRegex.status) {
    // using while and exec
    const statusRegex = new RegExp(filterRegex.status, "g");
    let match;

    let newStatus: DomainStatusProps[] = [];
    while ((match = statusRegex.exec(rawData)) !== null) {
      let [status, url] = match[1].split(" ");
      url = url ?? "";
      url = url.startsWith("(") && url.endsWith(")") ? url.slice(1, -1) : url;
      newStatus.push({ status, url });
    }

    newStatus.length && (result.status = newStatus);
  }

  // nameServers Match
  if (filterRegex.nameServers) {
    const regex = new RegExp(filterRegex.nameServers, "g");

    let match;
    let newNS: string[] = [];

    while ((match = regex.exec(rawData)) !== null) {
      newNS.push(match[1]);
    }

    newNS.length && (result.nameServers = newNS);
  }

  // expirationDate Match
  if (filterRegex.expirationDate) {
    const regex = new RegExp(filterRegex.expirationDate);
    const match = rawData.match(regex);
    if (match) {
      const expirationDate = moment(match[1], filterRegex.dateFormat).toJSON();
      expirationDate && (result.expirationDate = expirationDate);
    }
  }

  // creationDate Match
  if (filterRegex.creationDate) {
    const regex = new RegExp(filterRegex.creationDate);
    const match = rawData.match(regex);
    if (match) {
      const creationDate = moment(match[1], filterRegex.dateFormat).toJSON();
      creationDate && (result.creationDate = creationDate);
    }
  }

  // updatedDate Match
  if (filterRegex.updatedDate) {
    const regex = new RegExp(filterRegex.updatedDate);
    const match = rawData.match(regex);
    if (match) {
      const updatedDate = moment(match[1], filterRegex.dateFormat).toJSON();
      updatedDate && (result.updatedDate = updatedDate);
    }
  }

  return result;
}
