import { useState } from "react";
import {
  Page, Section, Grid, Metrics, Text, Table, Bars, Segmented, Callout,
  Heatmap, Rows, Status, Properties,
} from "grok/canvas";

type MatrixView = "os" | "depth";

const SUBSYSTEMS: string[] = ["01 安裝程式簽章詳細資訊", "02 下載來源隔離標記", "03 剪貼簿內容先預覽再說", "04 版本控制設定來源", "05 專案目前修改狀態", "06 剪貼簿可疑關鍵字掃描", "07 映像元件存放區健康度快查", "08 子系統與輕量虛擬機清單", "09 Chrome 被組織管理的政策", "10 誰在阻止電腦睡眠", "11 資料夾存取控制清單", "12 啟用中的排程工作"];
const OS_COLUMNS: string[] = ["Windows", "macOS", "Linux"];
const DEPTH_COLUMNS: string[] = ["深度 1", "深度 2", "深度 3", "深度 4", "深度 5", "深度 6", "深度 7", "深度 8"];
const BY_OS: number[][] = [[25, 19, 22], [17, 16, 17], [9, 13, 12], [19, 19, 17], [15, 15, 10], [8, 9, 10], [20, 20, 14], [11, 11, 10], [19, 18, 17], [23, 18, 13], [17, 19, 11], [37, 34, 18]];
const BY_DEPTH: number[][] = [[12, 11, 8, 8, 7, 7, 7, 6], [9, 9, 6, 6, 6, 6, 5, 3], [7, 3, 3, 3, 3, 5, 5, 5], [9, 9, 9, 6, 6, 6, 5, 5], [8, 6, 3, 3, 5, 5, 5, 5], [3, 3, 3, 3, 3, 3, 5, 4], [11, 11, 6, 6, 5, 5, 5, 5], [8, 6, 3, 3, 3, 3, 3, 3], [10, 9, 6, 6, 6, 6, 6, 5], [10, 10, 7, 6, 6, 5, 5, 5], [10, 8, 5, 5, 5, 5, 5, 4], [14, 14, 13, 10, 10, 10, 10, 8]];

export default function BotWikiHub() {
  const [view, setView] = useState<MatrixView>("os");

  return (
    <Page
      title="bot_wiki 雙機共用知識庫總覽中控台"
      summary="Smith 與分身共同維護的互動 Pages 索引、五大模型商實測摘要，以及本地幕僚長題庫去重與作業系統涵蓋度成果。"
      sources={["bot_wiki/manifest.json", "bot_wiki/shared/model_providers_benchmark.json", "bot_wiki/shared/os_coverage_summary.json"]}
      width="wide"
    >
      <Metrics
        metrics={[
          { value: "2", label: "已收錄 Pages", detail: "Smith 2 份 / 分身 0 份" },
          { value: "5", label: "模型陣營實測", detail: "Claude / Codex / Gemini / Grok / 本地" },
          { value: "362", label: "去重後唯一標準題", detail: "自 720 題實際掃描結果收斂", tone: "success" },
          { value: "288", label: "涵蓋度矩陣格數", detail: "12 子系統 × 3 作業系統 × 8 深度" },
        ]}
      />

      <Section heading="知識庫索引" caption="以 manifest.json 為準">
        <Table
          columns={["Page", "分類", "作者", "公開等級", "格式"]}
          rows={[
            ["五大 AI 模型陣營 CLI 實機評測與 6 大職位黃金組合指南", "模型評測", "smith", { text: "public", tone: "success" }, "Canvas ＋ HTML"],
            ["bot_wiki 雙機共用知識庫總覽中控台", "知識庫索引", "smith", { text: "internal_sanitized", tone: "warning" }, "Canvas"],
          ]}
        />
        <Grid columns={3}>
          <Properties items={[{ label: "pages/smith/", value: "Smith 的 Canvas 與公開 HTML" }]} />
          <Properties items={[{ label: "pages/clone/", value: "分身的前端 Pages 與 UI 展廳" }]} />
          <Properties items={[{ label: "shared/", value: "去識別化基準 JSON 與設計規範" }]} />
        </Grid>
      </Section>

      <Section heading="五大模型商實測報告摘要">
        <Rows
          rows={[
            { title: "Anthropic Claude", detail: "工具鏈最完整；單輪 8s~23s、多輪工具 45s~120s", status: { label: "架構與審查首選", tone: "success" } },
            { title: "OpenAI GPT Codex", detail: "沙箱與 --full-auto；15s~68s", status: { label: "規格與邊界推導", tone: "success" } },
            { title: "Google Gemini CLI", detail: "免費層、百萬級 Context；12s~25s", status: { label: "注意 429 退避", tone: "warning" } },
            { title: "xAI Grok", detail: "X 即時情報流；配額珍貴", status: { label: "指揮官省額度", tone: "warning" } },
            { title: "本地開源模型", detail: "0 成本、離線；1s~5s", status: { label: "高頻預檢", tone: "success" } },
          ]}
        />
      </Section>

      <Section heading="本地幕僚長題庫去重成果" caption="原始題庫檔案前後 SHA-256 不變，去重只產出新檔">
        <Grid columns={2}>
          <Metrics
            metrics={[
              { value: "978", label: "帳面宣告題數" },
              { value: "720", label: "實際掃描到的題數", detail: "差額 258 題為宣告但未落地的種子擴充", tone: "warning" },
              { value: "362", label: "保留的唯一標準題", tone: "success" },
            ]}
          />
          <Bars bars={[{"label": "同題分級變體", "value": 216, "display": "216 題"}, {"label": "早期題組內部重疊", "value": 51, "display": "51 題"}, {"label": "跨代題庫重疊", "value": 48, "display": "48 題"}, {"label": "新題組內部重疊", "value": 43, "display": "43 題"}]} emphasis="none" />
        </Grid>
        <Callout lead="治理原則" tone="info">原始題永久留存、等價題合併、唯一標準題計分，涵蓋度與難度分開驗證。</Callout>
      </Section>

      <Section heading="二維作業系統涵蓋度矩陣" caption="歷史標準題 ＋ 新一輪補盲題，每格為題數">
        <Segmented
          options={[{ value: "os", label: "依作業系統" }, { value: "depth", label: "依排障深度" }]}
          value={view}
          onChange={setView}
        />
        {view === "os"
          ? <Heatmap rows={SUBSYSTEMS} columns={OS_COLUMNS} values={BY_OS} />
          : <Heatmap rows={SUBSYSTEMS} columns={DEPTH_COLUMNS} values={BY_DEPTH} />}
        <Text>
          矩陣共 288 格（子系統 × 作業系統 × 深度），歷史標準題 362 題、新一輪補盲 240 題；仍為 0 的格數：0。
        </Text>
        <Status tone="success">所有格子皆至少 1 題</Status>
      </Section>
    </Page>
  );
}
