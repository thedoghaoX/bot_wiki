import { useState } from "react";
import {
  Page, Section, Grid, Metrics, Text, Table, Segmented, Callout,
  Properties, Status, Rows, Steps, Divider,
} from "grok/canvas";

type ProviderKey = "claude" | "codex" | "gemini" | "grok" | "local";
type RoleKey = "arch" | "algo" | "pm" | "itops" | "redteam" | "indie" | "creator";

const PROVIDERS: Record<ProviderKey, {
  name: string; models: string; strength: string; bestFor: string; caution: string;
}> = {
  claude: {
    name: "Claude",
    models: "Claude",
    strength: "能做的步驟最完整：可以規定輸出格式、限制來回次數、直接改檔，並執行命令看結果",
    bestFor: "重做大結構、長篇推理。一個 Claude 做，另一個 Claude 檢查。",
    caution: "多輪任務比較久，務必設來回次數上限與外層逾時；額度按一段時間計算",
  },
  codex: {
    name: "ChatGPT",
    models: "ChatGPT",
    strength: "可以自動跑，也可以在受限的保護環境裡執行；拆規格、找邊界、檢查格式是否符合都很強",
    bestFor: "拆規格、找邊界問題、設計故意出錯的測試、檢查格式",
    caution: "保護環境預設可能只能看、不能改，要改檔要先確認；資料夾沒有版本紀錄時，要另外允許它執行",
  },
  gemini: {
    name: "Gemini",
    models: "Gemini",
    strength: "有免費額度、可以讀很長的內容、內建 Google 搜尋兩邊對一下",
    bestFor: "一次看很多檔案、查外面的技術資料、長文件比對",
    caution: "同時問太多次會被暫時拒絕，要一次比一次等更久再試；呼叫前先確認登入金鑰。只靠網頁登入時，沒有人看著會受限制",
  },
  grok: {
    name: "Grok",
    models: "Grok",
    strength: "唯一能看到 X (Twitter) 的即時討論、新開源專案的消息，以及當下的社群風向",
    bestFor: "當頂層負責指揮的，並抓即時情報",
    caution: "額度珍貴：負責指揮的要省著用，粗重活交給其他模型。只做決定和情報",
  },
  local: {
    name: "本機小模型",
    models: "本機小模型",
    strength: "不另花呼叫費用，資料留在自己電腦",
    bestFor: "常常先看語法、遮掉紀錄裡的私人內容、離線時先把問題分到合適的做法",
    caution: "深度推理與作業系統底層細節較弱，重要判斷仍要雲端模型或固定程式再看一次",
  },
};

const ROLES: Record<RoleKey, {
  label: string; lead: string; second: string; gate: string; why: string; steps: { title: string; detail: string }[];
}> = {
  arch: {
    label: "做網站和系統的工程師",
    lead: "主力 Claude", second: "搭配 ChatGPT", gate: "本機小模型先看語法",
    why: "Claude 看大結構。ChatGPT 找邊界。本機小模型不另花錢，先擋下明顯的錯誤。",
    steps: [
      { title: "本機小模型先看一遍", detail: "語法、格式、引用的檔案先跑一輪，不另花呼叫費用" },
      { title: "Claude 設計與實作", detail: "限制來回次數，並取回整理好的結果" },
      { title: "ChatGPT 看邊界", detail: "針對介面約定與出錯時的情況補測試" },
    ],
  },
  algo: {
    label: "演算法與自動檢查工程師",
    lead: "負責做的：Claude", second: "負責檢查的：另一個 Claude，另外開",     gate: "不花額度的檢查程式",
    why: "出題、實作、驗收分開。負責做的不能改考卷。負責檢查的不看對方自己說的。只認檢查程式跑出的結果。",
    steps: [
      { title: "負責做的來改", detail: "只能改允許清單內的檔案" },
      { title: "負責檢查的另開", detail: "全新的一輪，不帶負責做的那段推理" },
      { title: "固定程式判定", detail: "檢查程式鎖住不能改，並故意塞錯，確認它真的抓得到" },
    ],
  },
  pm: {
    label: "產品經理與技術情報分析師",
    lead: "Grok X 即時情報", second: "Gemini 廣度檢索",     gate: "Claude 把報告整理好",
    why: "Grok 抓即時社群與新開源專案的消息，Gemini 用搜尋兩邊對一下，並靠很長的閱讀補廣度，最後交 Claude 整理成決策報告。",
    steps: [
      { title: "Grok 只問最近發生什麼", detail: "只問「最近發生什麼」，不做重度整理，以省額度" },
      { title: "Gemini 查證與補完", detail: "內建 Google Search 交叉比對來源" },
      { title: "Claude 整理", detail: "輸出先講結論的白話決策報告" },
    ],
  },
  itops: {
    label: "系統維運與電腦救援",
    lead: "本機小模型 離線時先分開處理", second: "Claude 產生只看不改的檢查步驟", gate: "只允許看、不允許改的指令清單",
    why: "故障現場常常斷網或涉及私人紀錄，本機小模型先在離線時分開處理；需要步驟時才請 Claude 產生「只看不改」的檢查指令。",
    steps: [
      { title: "先在自己電腦分開處理", detail: "依症狀分到對應的問題類型與處理方式" },
      { title: "遮掉私人內容", detail: "敏感欄位在自己電腦先遮掉，再送出去" },
      { title: "Claude 產生唯讀腳本", detail: "預設只蒐集資訊、不改設定" },
    ],
  },
  redteam: {
    label: "資安檢查與合規人員",
    lead: "Claude 把規範寫成規則", second: "ChatGPT 用故意做錯的例子來試",     gate: "在自己電腦掃描",
    why: "Claude 把規範寫成可以執行的規則。ChatGPT 做故意改錯的例子來試規則。在自己電腦掃描，敏感資料不出這台電腦。",
    steps: [
      { title: "寫成規則", detail: "Claude 產出檢查規則，以及對的例子和錯的例子" },
      { title: "故意改錯來試", detail: "ChatGPT 從欄位、結構、意思三層做出故意改錯的例子" },
      { title: "再離線掃一次", detail: "自己電腦上的掃描做最後檢查" },
    ],
  },
  indie: {
    label: "獨立開發者 / 省預算團隊",
    lead: "Gemini 免費層廣度探索", second: "本機小模型日常輔助",     gate: "Claude 攻最難的地方",
    why: "免費額度和本機處理日常工作。付費額度只花在最難的地方。",
    steps: [
      { title: "Gemini 免費層探索", detail: "讀文件、比方案、廣度搜尋" },
      { title: "本機小模型日常輔助", detail: "補全、改寫、格式整理" },
      { title: "Claude 攻堅", detail: "只在關鍵難題出手，設回合上限控額度" },
    ],
  },
  creator: {
    label: "YouTube、短片和動畫",
    lead: "Claude 負責拆鏡頭。Grok 抓社群話題。",
    second: "本機畫開頭和結尾。只改選到的地方。繁中改字。自動字幕和配音。付費影片留到最後。",
    gate: "不另花錢。對好聲音和畫面。檢查音量和繁體字幕。",
    why: "做影片比寫字貴。先用免費工具把鏡頭定下來。畫面有問題，只改圈到的地方，其他地方不動。繁中標題不要亂碼。橫圖可以變成直圖。檢查過了才做影片。連續兩次不合格，就停下來重寫。16:9 和 9:16 一起輸出。",
    steps: [
      { title: "找話題並拆開", detail: "Grok 抓熱門話題。Claude 拆成台詞、開頭和結尾、配音和字幕。" },
      { title: "開頭結尾與局部改圖", detail: "只改選到的地方。可以去背、換底、改繁中。橫圖可以變成直圖。都在自己電腦，不另花錢。也可以一句話改三處、把圖拆開。先出草稿，檢查通過才花一次高清。重畫幅度鎖住。" },
      { title: "不另花錢的檢查", detail: "看長度、聲音和畫面齊不齊、繁體字型。連續兩次不合格就停下來重寫。" },
      { title: "通過才做影片", detail: "通過才用付費影片。整理音量後，16:9 和 9:16 一起輸出。" },
    ],
  },
};

export default function ModelProvidersLiveBenchmark() {
  const [provider, setProvider] = useState<ProviderKey>("claude");
  const [role, setRole] = useState<RoleKey>("arch");
  const p = PROVIDERS[provider];
  const r = ROLES[role];

  return (
    <Page
      title="五大 AI 比一比，以及七種工作怎麼配"
      summary="五家 AI 能做什麼、適合什麼。七種工作怎麼配，包含做影片的人。"
      sources={["各家官方說明"]}
      width="wide"
    >
      <Metrics
        metrics={[
          { value: "5", label: "五家 AI", detail: "Claude、ChatGPT、Gemini、Grok、本機小模型" },
          { value: "7", label: "七種工作", detail: "可以切換，含做影片" },
        ]}
      />

      <Section heading="一、五家 AI" caption="點一家看細節">
        <Segmented
          options={[
            { value: "claude", label: "Claude" },
            { value: "codex", label: "ChatGPT" },
            { value: "gemini", label: "Gemini" },
            { value: "grok", label: "Grok" },
            { value: "local", label: "本機小模型" },
          ]}
          value={provider}
          onChange={setProvider}
        />
        <Properties
          items={[
            { label: "AI", value: p.name },
            { label: "代表", value: p.models },
            { label: "核心強項", value: p.strength },
            { label: "最適合", value: <Status tone="success">{p.bestFor}</Status> },
            { label: "注意事項", value: <Status tone="warning">{p.caution}</Status> },
          ]}
        />
        <Divider />
        <Table
          columns={["AI", "代表", "最適合"]}
          rows={(Object.keys(PROVIDERS) as ProviderKey[]).map((k) => [
            PROVIDERS[k].name, PROVIDERS[k].models, PROVIDERS[k].bestFor,
          ])}
        />
      </Section>

      <Section heading="二、使用時要注意">
        <Table
          columns={["工具", "坑", "建議做法"]}
          rows={[
            ["Claude", "沒有人看著時，長任務卡住或被逾時切斷", "限定來回次數，並要它交出整理好的結果；放在背景跑時不要等鍵盤輸入"],
            ["Claude", "做到一半被安全檢查擋下，檔案沒有生出來", "回報前一律檢查檔案是否真的存在，不採信模型自己說的"],
            ["ChatGPT", "資料夾沒有版本紀錄的時候，直接拒絕執行", "另外允許它在這種資料夾執行"],
            ["ChatGPT", "保護環境只能看、不能改時，寫檔會悄悄失敗", "先確認保護環境；需要寫檔才打開自動執行"],
            ["Gemini", "同時問太多次，被暫時拒絕", "一次比一次等更久再試，並限制同時請求的數量"],
            ["Gemini", "只靠網頁登入時，沒有人看著會受限制", "改用登入金鑰，呼叫前先確認；不同專案用各自的金鑰分開"],
            ["Grok", "負責指揮的額度被粗重活用光", "先問能否用自己電腦上的程式，再問能否交給其他模型"],
            ["本機小模型", "作業系統底層細節容易答錯", "只做先看一遍和分開處理，重要結論交給固定程式或雲端模型再看一次"],
          ]}
        />
        <Callout lead="通用原則" tone="info">
          算不算成功，看實際結果。程式有沒有跑完、檔案在不在、測試結果是什麼。不聽 AI 自己說完成了。
        </Callout>
      </Section>

      <Section heading="三、七種工作怎麼配" caption="切換一種工作，看怎麼配">
        <Segmented
          options={(Object.keys(ROLES) as RoleKey[]).map((k) => ({ value: k, label: ROLES[k].label }))}
          value={role}
          onChange={setRole}
        />
        <Grid columns={3}>
          <Properties items={[{ label: "主力", value: r.lead }]} />
          <Properties items={[{ label: "搭配", value: r.second }]} />
          <Properties items={[{ label: "把關", value: r.gate }]} />
        </Grid>
        <Text>{r.why}</Text>
        <Steps steps={r.steps} />
      </Section>

      <Section heading="七種工作" collapsible defaultOpen={false}>
        <Rows
          rows={(Object.keys(ROLES) as RoleKey[]).map((k) => ({
            title: ROLES[k].label,
            detail: `${ROLES[k].lead} ＋ ${ROLES[k].second} ＋ ${ROLES[k].gate}`,
          }))}
        />
      </Section>
    </Page>
  );
}
