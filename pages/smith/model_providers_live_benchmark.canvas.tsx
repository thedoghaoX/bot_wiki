import { useState } from "react";
import {
  Page, Section, Grid, Metrics, Text, Table, Bars, Segmented, Callout,
  Properties, Status, Rows, Steps, Divider,
} from "grok/canvas";

type ProviderKey = "claude" | "codex" | "gemini" | "grok" | "local";
type RoleKey = "arch" | "algo" | "pm" | "itops" | "redteam" | "indie" | "creator";

const PROVIDERS: Record<ProviderKey, {
  name: string; models: string; latency: string; strength: string; bestFor: string; caution: string;
}> = {
  claude: {
    name: "Anthropic Claude",
    models: "claude-opus-5-5 / claude-sonnet-4-6",
    latency: "單輪純推理約 8s~23s；多輪工具調用約 45s~120s",
    strength: "CLI 工具鏈完整度最高：--output-format json、--max-turns、原生檔案讀寫與 Bash 閉環",
    bestFor: "架構重構、長篇嚴謹推理、Builder + Auditor 雙 Claude 互審",
    caution: "多輪任務耗時長，務必設 --max-turns 與外層逾時；額度以滾動視窗計算",
  },
  codex: {
    name: "OpenAI GPT Codex",
    models: "gpt-5.4 / codex exec",
    latency: "實測回應約 15s~68s",
    strength: "支援 --full-auto 與沙箱執行；結構化規格拆解、演算法邊界推導、JSON 結構規格稽核極強",
    bestFor: "規格拆解、邊界條件推導、紅隊突變體設計與格式稽核",
    caution: "沙箱預設可能為唯讀，需寫檔任務要先確認沙箱模式；非 Git 目錄需加 --skip-git-repo-check",
  },
  gemini: {
    name: "Google Gemini CLI",
    models: "gemini-2.5-pro / gemini-2.5-flash / gemini-3-pro-preview",
    latency: "實測回應約 12s~25s",
    strength: "免費層級配額、百萬級超大 Context Window、內建 Google Search 雙向查證",
    bestFor: "跨檔案廣度掃描、外部技術情報檢索、長文件比對",
    caution: "高併發易觸發 429，需指數退避；呼叫前預檢 API Key 環境變數，純 OAuth 登入在非互動模式可能受限",
  },
  grok: {
    name: "xAI Grok",
    models: "grok（即時 X 情報流）",
    latency: "依任務而定，短問答通常為秒級",
    strength: "唯一具備 X (Twitter) 即時社群情報流、開源專案首發動態與高時效輿情雷達",
    bestFor: "頂層指揮官（Orchestrator）與即時情報偵察",
    caution: "配額珍貴，採「指揮官省額度、苦力交小弟」：只做決策與情報，重活外包給其他模型",
  },
  local: {
    name: "本地開源模型",
    models: "Ollama / qwen2.5-coder / deepseek-r1 / llama3",
    latency: "秒級回應，約 1s~5s",
    strength: "0 API 成本、100% 離線隱私",
    bestFor: "L0/L1 高頻語法預檢、敏感日誌脫敏、離線幕僚長防呆路由",
    caution: "深度推理與作業系統底層 API 細節較弱，關鍵判斷仍需雲端模型或確定性腳本複核",
  },
};

const ROLES: Record<RoleKey, {
  label: string; lead: string; second: string; gate: string; why: string; steps: { title: string; detail: string }[];
}> = {
  arch: {
    label: "軟體架構與全端工程師",
    lead: "主帥 Claude Opus", second: "副將 Codex", gate: "本地模型做 L0 語法預檢",
    why: "Claude 負責架構決策與大範圍重構，Codex 補強規格拆解與邊界案例，本地模型以 0 成本攔下低級錯誤。",
    steps: [
      { title: "本地模型預檢", detail: "語法、格式、匯入路徑先跑一輪，0 API 成本" },
      { title: "Claude Opus 設計與實作", detail: "--max-turns 限制回合，--output-format json 取回結構化結果" },
      { title: "Codex 邊界審查", detail: "codex exec 針對介面契約與例外路徑補測試" },
    ],
  },
  algo: {
    label: "演算法與自動化驗證工程師",
    lead: "Builder：Claude Opus", second: "獨立 Auditor：另一個 Claude Opus 工作階段", gate: "0-Token Python 確定性驗證閘門",
    why: "出題、實作、驗收三方隔離：Builder 不能改考卷，Auditor 不看 Builder 自述，只認 Python 腳本跑出的結果。",
    steps: [
      { title: "Builder 實作", detail: "只能改允許清單內的檔案" },
      { title: "Auditor 獨立審查", detail: "全新工作階段，不帶 Builder 的推理脈絡" },
      { title: "確定性腳本判定", detail: "驗證器以 SHA-256 鎖定，並內建故意塞錯的突變測試確認有牙齒" },
    ],
  },
  pm: {
    label: "產品經理與技術情報分析師",
    lead: "Grok X 即時情報", second: "Gemini 廣度檢索", gate: "Claude 報告收斂",
    why: "Grok 抓即時社群與開源首發動態，Gemini 以搜尋雙向查證與長 Context 擴大廣度，最後交 Claude 收斂成決策報告。",
    steps: [
      { title: "Grok 情報雷達", detail: "只問「最近發生什麼」，不做重度整理以省額度" },
      { title: "Gemini 查證與補完", detail: "內建 Google Search 交叉比對來源" },
      { title: "Claude 收斂", detail: "輸出結論先行的白話決策報告" },
    ],
  },
  itops: {
    label: "系統維運與 IT 救機幕僚長",
    lead: "本地 Ollama 離線路由", second: "Claude 唯讀防呆腳本生成", gate: "唯讀指令白名單",
    why: "故障現場常常斷網或涉及隱私日誌，本地模型離線分流；需要腳本時才請 Claude 產生「只讀不寫」的診斷指令。",
    steps: [
      { title: "本地分流", detail: "依症狀路由到對應題型與處置卡" },
      { title: "日誌脫敏", detail: "敏感欄位在本地先遮蔽再外送" },
      { title: "Claude 產生唯讀腳本", detail: "預設只蒐集資訊、不改設定" },
    ],
  },
  redteam: {
    label: "資安紅隊與合規稽核人員",
    lead: "Claude 規則合成", second: "Codex 突變體攻擊測試", gate: "本地離線掃描",
    why: "Claude 把合規條文轉成可執行規則，Codex 專門造突變體去打穿規則，本地離線掃描確保敏感資料不出機器。",
    steps: [
      { title: "規則合成", detail: "Claude 產出檢查規則與正反例" },
      { title: "突變攻擊", detail: "Codex 產生欄位、結構、語意三層突變體" },
      { title: "離線複掃", detail: "本地掃描器做最終把關" },
    ],
  },
  indie: {
    label: "獨立開發者 / 預算最佳化團隊",
    lead: "Gemini 免費層廣度探索", second: "本地模型日常輔助", gate: "Claude 關鍵刀口攻堅",
    why: "免費與本地資源吃掉 80% 日常工作，付費額度只花在架構決策與疑難雜症這種「刀口」上。",
    steps: [
      { title: "Gemini 免費層探索", detail: "讀文件、比方案、廣度搜尋" },
      { title: "本地模型日常輔助", detail: "補全、改寫、格式整理" },
      { title: "Claude 攻堅", detail: "只在關鍵難題出手，設回合上限控額度" },
    ],
  },
  creator: {
    label: "影音與短影音創作者（YouTube / Reels / Shorts / 動畫）",
    lead: "Claude 分鏡總導演 ＋ Grok / Meta 社群話題雷達",
    second: "本地 Flux / Playwright 首尾幀 ＋ 互動式 AI 局部改圖 ＋ Whisper / Edge-TTS 語音字幕 ＋ Veo / Sora 刀口點火",
    gate: "FFmpeg 0 成本音畫同步、-14 LUFS 響度與繁體字幕守門員",
    why: "生影片點數比文字貴 10~50 倍：先用免費工具定稿分鏡與首尾幀，首尾幀有瑕疵就用互動式局部改圖只修圈選區、圈選外像素一個都不動，繁中標題無痕改字零亂碼；守門員過關才點火，連續兩輪不及格就斷路重寫，最後 16:9 與 9:16 一鍵雙出。",
    steps: [
      { title: "話題雷達與分鏡拆單", detail: "Grok 與 Meta 抓爆款話題，Claude 拆成台詞、首尾幀、配音字幕分鏡表" },
      { title: "首尾幀定稿與互動式局部改圖", detail: "框選或塗抹只改局部、去背換底、繁中無痕改字、橫圖一鍵擴成直圖，全部本地 0 成本" },
      { title: "0 成本守門員", detail: "秒數、音畫對齊、繁體字型檢查，連續兩輪不及格斷路重寫" },
      { title: "刀口點火與雙出", detail: "過關才呼叫付費影片模型，-14 LUFS 響度正規化後 16:9 與 9:16 一鍵雙出" },
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
      title="五大 AI 模型陣營 CLI 實機評測與 7 大職位黃金組合指南"
      summary="以實機 CLI 呼叫紀錄整理五大模型陣營的速度、工具鏈與適用場景，並給出 7 種工作職位的最佳搭配（新增影音與短影音創作者）。"
      sources={["實機 CLI 呼叫紀錄（去識別化彙整）", "各模型商官方 CLI 說明文件"]}
      width="wide"
    >
      <Metrics
        metrics={[
          { value: "5", label: "模型陣營", detail: "Claude / Codex / Gemini / Grok / 本地" },
          { value: "1s~5s", label: "最快回應", detail: "本地開源模型", tone: "success" },
          { value: "45s~120s", label: "最長回應", detail: "Claude 多輪工具調用", tone: "warning" },
          { value: "7", label: "職位黃金組合", detail: "可互動切換（新增影音創作者）" },
        ]}
      />

      <Section heading="一、五大模型陣營實機 CLI 綜合表現總覽" caption="點選陣營查看詳細特性">
        <Segmented
          options={[
            { value: "claude", label: "Claude" },
            { value: "codex", label: "Codex" },
            { value: "gemini", label: "Gemini" },
            { value: "grok", label: "Grok" },
            { value: "local", label: "本地模型" },
          ]}
          value={provider}
          onChange={setProvider}
        />
        <Properties
          items={[
            { label: "陣營", value: p.name },
            { label: "實測模型", value: p.models },
            { label: "實測回應時間", value: p.latency },
            { label: "核心強項", value: p.strength },
            { label: "最適合", value: <Status tone="success">{p.bestFor}</Status> },
            { label: "注意事項", value: <Status tone="warning">{p.caution}</Status> },
          ]}
        />
        <Divider />
        <Table
          columns={["陣營", "實測模型", "回應時間", "最適合"]}
          rows={(Object.keys(PROVIDERS) as ProviderKey[]).map((k) => [
            PROVIDERS[k].name, PROVIDERS[k].models, PROVIDERS[k].latency, PROVIDERS[k].bestFor,
          ])}
        />
      </Section>

      <Section heading="典型回應時間上限（秒）" caption="取各陣營實測區間上限；Grok 依任務長短差異大，不列入比較">
        <Bars
          bars={[
            { label: "Claude 多輪工具調用", value: 120, display: "45s~120s" },
            { label: "Codex exec", value: 68, display: "15s~68s" },
            { label: "Gemini CLI", value: 25, display: "12s~25s" },
            { label: "Claude 單輪純推理", value: 23, display: "8s~23s" },
            { label: "本地開源模型", value: 5, display: "1s~5s" },
          ]}
          emphasis={4}
        />
      </Section>

      <Section heading="二、實機掃描發現的 CLI 參數與相容性避坑指南">
        <Table
          columns={["工具", "坑", "建議做法"]}
          rows={[
            ["Claude", "非互動模式長任務卡住或被逾時切斷", "用 -p 搭配 --output-format json 與 --max-turns；背景呼叫把 stdin 導向 /dev/null"],
            ["Claude", "多輪任務中途被安全分類器擋下，檔案未建立", "回報前一律檢查檔案是否真的存在，不採信模型自述"],
            ["Codex", "在非 Git 目錄執行 codex exec 直接拒跑", "加上 --skip-git-repo-check"],
            ["Codex", "沙箱為唯讀時寫檔任務靜默失敗", "先確認沙箱模式；需要寫檔才用 --full-auto"],
            ["Gemini", "高併發觸發 429 配額錯誤", "指數退避重試，並限制同時請求數"],
            ["Gemini", "純 OAuth 登入在非互動模式受限", "改用 API Key 環境變數並在呼叫前預檢；不同專案用獨立環境變數隔離"],
            ["Grok", "指揮官額度被重活吃光", "以 Q1~Q6 額度保護閘門分級：先問能否用本地腳本、再問能否交給其他模型"],
            ["本地模型", "作業系統底層 API 細節答錯", "只做預檢與分流，關鍵結論交確定性腳本或雲端模型複核"],
          ]}
        />
        <Callout lead="通用原則" tone="info">
          任何 CLI 的「成功」以外層腳本的實際結果為準：檢查結束碼、檔案是否存在與測試輸出，而不是模型自己說完成了。
        </Callout>
      </Section>

      <Section heading="三、7 大職位黃金組合" caption="切換職位查看推薦陣容與工作流">
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

      <Section heading="七大職位一覽" collapsible defaultOpen={false}>
        <Rows
          rows={(Object.keys(ROLES) as RoleKey[]).map((k) => ({
            title: ROLES[k].label,
            detail: `${ROLES[k].lead} ＋ ${ROLES[k].second} ＋ ${ROLES[k].gate}`,
          }))}
        />
      </Section>

      <Callout lead="數據說明" tone="warning">
        回應時間為實機呼叫紀錄的典型區間，會隨模型版本、網路狀況、任務長度與帳號層級變動，僅供選型參考。
      </Callout>
    </Page>
  );
}
