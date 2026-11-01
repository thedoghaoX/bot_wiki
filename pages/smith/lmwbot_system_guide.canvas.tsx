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
    name: "基礎版：作業系統一鍵只看不改的檢查",
    who: "一般電腦使用者、家人長輩、剛接觸命令列的新手",
    promise: "電腦怪怪的，按一下就知道哪裡出問題，而且保證不亂改你的系統。",
    features: [
      { lead: "診", title: "一鍵只讀檢查", detail: "磁碟滿了、連線被佔住、風扇狂轉、網址打不開等常見問題，只看狀態，不改設定。" },
      { lead: "譯", title: "白話翻譯", detail: "把系統吐出的英文錯誤訊息與指令結果，翻成看得懂的繁體中文與下一步建議。" },
      { lead: "防", title: "危險指令先攔下來", detail: "遇到「貼上這行指令就能領獎」這類騙人話術，或刪除、格式化這類危險指令，先攔下並說明風險。" },
    ],
    props: [
      { label: "支援平台", value: "Windows / macOS / Linux" },
      { label: "預設模式", value: "唯讀預覽，不自動修改" },
      { label: "語言", value: "繁體中文白話說明" },
    ],
  },
  smart: {
    name: "智慧版：長對話自動變短，並換成合適的模型",
    who: "每天和 AI 長時間協作的工程師、研究人員與內容創作者",
    promise: "聊得再久也不失憶，額度用在最難的地方。",
    features: [
      { lead: "縮", title: "自動把對話變短", detail: "對話變長時自動整理重點，保留決定與待辦，丟掉冗長過程。" },
      { lead: "憶", title: "做成短篇備忘", detail: "把每輪工作濃縮成短短十幾行，下次開新對話直接接續。" },
      { lead: "反", title: "卡關就提醒換方法", detail: "發現重複犯錯或卡關時，主動提醒換方法，而不是一直重試同一招。" },
      { lead: "路", title: "換成合適的模型", detail: "簡單問題交給自己電腦上的小模型，困難推理才呼叫雲端大模型，自動省下額度。" },
    ],
    props: [
      { label: "怎麼記住", value: "只留短篇備忘，不留很長的原始紀錄" },
      { label: "怎麼選擇", value: "看任務難不難、額度還剩多少" },
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
      title="LMWBOT 跨平台外層保護公開指南"
      summary="在大型語言模型外面加一層保護：看得懂系統、記得住對話、擋得住危險指令。"
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

      <Section heading="什麼是外層保護？">
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
            ["作業系統只看不改的檢查", { text: "有", tone: "success" }, { text: "有", tone: "success" }, { text: "有", tone: "success" }],
            ["白話翻譯與防呆攔截", { text: "有", tone: "success" }, { text: "有", tone: "success" }, { text: "有", tone: "success" }],
            ["自動把對話變短，並留下短篇備忘", "—", { text: "有", tone: "success" }, { text: "有", tone: "success" }],
            ["依難度換成合適的模型", "—", { text: "有", tone: "success" }, { text: "有", tone: "success" }],
            ["工程圖自動化審查", "—", "—", { text: "有", tone: "success" }],
          ]}
        />
      </Section>

      <Section heading="基礎版常見攔截情境" caption="示意比重，依使用情境變動">
        <Bars
          bars={[
            { label: "來路不明的「貼上即修復」指令", value: 5, display: "高" },
            { label: "整批刪除與磁碟格式化", value: 5, display: "高" },
            { label: "關閉系統防護或防火牆", value: 4, display: "中高" },
            { label: "下載並直接執行遠端腳本", value: 4, display: "中高" },
            { label: "權限全開的檔案設定", value: 3, display: "中" },
          ]}
        />
      </Section>

      <Section heading="智慧版亮點：自動把工作拆開來做" caption="總工頭帶著小弟，拿掉重複並檢查，再由另一個模型獨立檢查">
        <Callout lead="一句話看懂" tone="info">
          一個總工頭帶著三位不同專長的小弟同時開工，最後還有獨立的人檢查。
        </Callout>
        <Checklist
          items={[
            { text: "總工頭自動拆開：複雜需求拆成小工作，同時交給三位專長不同的小弟", done: true },
            { text: "做完先檢查：自動拿掉重複、確認範圍完整、擋下危險指令，不靠 AI 自己說完成", done: true },
            { text: "獨立檢查：做和查由兩個互不相干的模型負責，雙方都過才交付", done: true },
            { text: "白話進度回報：請了幾位小弟、檢查是否通過、檢查者是否放行，一看就懂", done: true },
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
            先用只看不改的檢查熟悉介面，再依需求升級到智慧版或工程圖版。
          </Callout>
          <Status tone="accent">三個版本共用同一套保護</Status>
        </Section>
      </Grid>
    </Page>
  );
}
