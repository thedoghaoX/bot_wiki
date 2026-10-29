import { useState } from "react";
import {
  Page, Section, Grid, Metrics, Text, Table, Bars, Segmented, Callout,
  Properties, Status, Checklist, Rows,
} from "grok/canvas";

type EditionKey = "basic" | "smart" | "drawing";

const EDITIONS: Record<EditionKey, {
  name: string; who: string; promise: string;
  features: { lead: string; title: string; detail: string }[];
  props: { label: string; value: string }[];
}> = {
  basic: {
    name: "基礎版：作業系統一鍵唯讀診斷",
    who: "一般電腦使用者、家人長輩、剛接觸終端機的新手",
    promise: "電腦怪怪的，按一下就知道哪裡出問題，而且保證不亂改你的系統。",
    features: [
      { lead: "診", title: "一鍵唯讀診斷", detail: "磁碟爆滿、連接埠被佔用、風扇狂轉、網路解析失敗等常見問題，只讀取狀態不修改設定。" },
      { lead: "譯", title: "白話翻譯", detail: "把系統吐出的英文錯誤訊息與指令結果，翻成看得懂的繁體中文與下一步建議。" },
      { lead: "防", title: "高風險指令防呆攔截", detail: "遇到「貼上這行指令就能領獎」這類社交工程話術，或刪除、格式化等高風險指令，先攔下並說明風險。" },
    ],
    props: [
      { label: "支援平台", value: "Windows / macOS / Linux" },
      { label: "預設模式", value: "唯讀預覽，不自動修改" },
      { label: "語言", value: "繁體中文白話說明" },
    ],
  },
  smart: {
    name: "智慧版：無感長對話與多模型路由",
    who: "每天和 AI 長時間協作的工程師、研究人員與內容創作者",
    promise: "聊得再久也不失憶，額度用在刀口上。",
    features: [
      { lead: "縮", title: "背後無感自動壓縮對話", detail: "對話變長時自動整理重點，保留決策與待辦，丟掉冗長過程。" },
      { lead: "憶", title: "記憶膠囊提煉", detail: "把每輪工作濃縮成短短十幾行的記憶膠囊，下次開新對話直接接續。" },
      { lead: "反", title: "夥伴反射", detail: "偵測到重複犯錯或卡關時，主動提醒換方法，而不是一直重試同一招。" },
      { lead: "路", title: "多模型自動路由", detail: "簡單問題交給本地小模型，困難推理才呼叫雲端大模型，自動省下額度。" },
    ],
    props: [
      { label: "記憶方式", value: "精簡膠囊，不保存原始長日誌" },
      { label: "路由依據", value: "任務難度與剩餘額度" },
      { label: "隱私", value: "敏感內容優先留在本地處理" },
    ],
  },
  drawing: {
    name: "工程圖版：即開即用的自動化審查",
    who: "需要大量看圖、審圖的工程團隊與學生",
    promise: "打開就能用，把工程圖丟進來，先幫你做第一輪檢查。",
    features: [
      { lead: "開", title: "即開即用", detail: "不需要自己架環境或調參數，安裝後直接拖入圖檔即可開始。" },
      { lead: "域", title: "支援多種工程圖領域", detail: "電路圖、管線儀表圖、單線圖與室內配置圖等常見工程圖類型。" },
      { lead: "審", title: "自動化審查報告", detail: "產出可閱讀的審查清單與需要人工複核的項目，讓工程師把時間花在判斷上。" },
    ],
    props: [
      { label: "使用方式", value: "拖入圖檔，自動產出審查清單" },
      { label: "定位", value: "第一輪自動審查，關鍵決策仍由工程師複核" },
      { label: "技術細節", value: "屬產品核心，不對外公開" },
    ],
  },
};

export default function LmwbotSystemGuide() {
  const [ed, setEd] = useState<EditionKey>("basic");
  const cur = EDITIONS[ed];
  return (
    <Page
      title="LMWBOT 跨平台 LLM 外裝甲系統公開指南"
      summary="幫大型語言模型穿上一層外裝甲：看得懂系統、記得住對話、擋得住危險指令。"
      width="wide"
    >
      <Metrics
        metrics={[
          { value: "3 版", label: "產品版本", detail: "基礎版／智慧版／工程圖版" },
          { value: "3 大", label: "作業系統", detail: "Windows／macOS／Linux" },
          { value: "唯讀", label: "預設診斷模式", detail: "不自動修改系統", tone: "success" },
          { value: "繁中", label: "介面語言", detail: "白話說明" },
        ]}
      />

      <Section heading="什麼是「LLM 外裝甲」？">
        <Text>
          大型語言模型很聰明，但直接拿來操作電腦會有三個問題：看不懂你的系統狀態、聊久了會失憶、
          被人一騙就可能執行危險指令。LMWBOT 在模型外面加一層防護與輔助，讓 AI 先看清楚、再說清楚、最後才動手。
        </Text>
      </Section>

      <Section heading="三大版本" caption="切換查看各版本功能">
        <Segmented
          options={[
            { value: "basic", label: "基礎版" },
            { value: "smart", label: "智慧版" },
            { value: "drawing", label: "工程圖版" },
          ]}
          value={ed}
          onChange={(v) => setEd(v as EditionKey)}
        />
        <Callout lead={cur.name} tone="info">{cur.promise}</Callout>
        <Text>適合對象：{cur.who}</Text>
        <Grid columns={2}>
          <Rows rows={cur.features} />
          <Properties items={cur.props} />
        </Grid>
      </Section>

      <Section heading="版本比較">
        <Table
          columns={["能力", "基礎版", "智慧版", "工程圖版"]}
          rows={[
            ["作業系統唯讀診斷", { text: "有", tone: "success" }, { text: "有", tone: "success" }, { text: "有", tone: "success" }],
            ["白話翻譯與防呆攔截", { text: "有", tone: "success" }, { text: "有", tone: "success" }, { text: "有", tone: "success" }],
            ["自動壓縮對話與記憶膠囊", "—", { text: "有", tone: "success" }, { text: "有", tone: "success" }],
            ["多模型自動路由", "—", { text: "有", tone: "success" }, { text: "有", tone: "success" }],
            ["工程圖自動化審查", "—", "—", { text: "有", tone: "success" }],
          ]}
        />
      </Section>

      <Section heading="基礎版常見攔截情境" caption="示意比重，依使用情境變動">
        <Bars
          bars={[
            { label: "來路不明的「貼上即修復」指令", value: 5, display: "高" },
            { label: "遞迴刪除與磁碟格式化", value: 5, display: "高" },
            { label: "關閉系統防護或防火牆", value: 4, display: "中高" },
            { label: "下載並直接執行遠端腳本", value: 4, display: "中高" },
            { label: "權限全開的檔案設定", value: 3, display: "中" },
          ]}
        />
      </Section>

      <Section heading="智慧版亮點：三層智慧派工引擎" caption="主將自動帶小弟 + 去重守門 + 雙模型獨立互審">
        <Callout lead="一句話秒懂" tone="info">
          一個總工頭帶著三位不同專長的小弟同時開工，最後還有獨立監工驗收。
        </Callout>
        <Checklist
          items={[
            { text: "總工頭自動拆單：複雜需求拆成小工作，同時派給三位專長不同的小弟", done: true },
            { text: "守門員把關：自動剔除重複、確認範圍完整、擋下危險指令，不靠 AI 自稱完成", done: true },
            { text: "獨立監工驗收：實作與審查由兩個互不相干的模型負責，雙方過關才交付", done: true },
            { text: "白話進度回報：派了幾位小弟、檢查是否通過、審查官是否放行，一看就懂", done: true },
          ]}
        />
      </Section>

      <Grid columns={2}>
        <Section heading="安全承諾" caption="狀態以本頁撰寫當下為準">
          <Checklist
            items={[
              { text: "診斷預設唯讀，修改前一定先問", done: true },
              { text: "高風險指令先攔截並白話說明", done: true },
              { text: "介面全繁體中文", done: true },
              { text: "敏感資料優先在本地處理", done: true },
            ]}
          />
        </Section>
        <Section heading="上手建議">
          <Callout lead="先從基礎版開始" tone="info">
            先用唯讀診斷熟悉介面，再依需求升級到智慧版或工程圖版。
          </Callout>
          <Status tone="accent">三版本共用同一套外裝甲核心</Status>
        </Section>
      </Grid>
    </Page>
  );
}
