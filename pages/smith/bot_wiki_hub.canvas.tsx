import {
  Page, Section, Grid, Metrics, Table,
  Rows, Properties,
} from "grok/canvas";

export default function BotWikiHub() {
  return (
    <Page
      title="bot_wiki 雙機共用知識庫總覽中控台"
      summary="互動頁面索引，以及五大模型陣營的特性摘要。支援 Windows、macOS、Linux。"
      sources={["bot_wiki/manifest.json", "bot_wiki/shared/model_providers_benchmark.json", "bot_wiki/shared/os_coverage_summary.json"]}
      width="wide"
    >
      <Metrics
        metrics={[
          { value: "2", label: "已收錄 Pages", detail: "見下方索引" },
          { value: "5", label: "模型陣營", detail: "Claude / Codex / Gemini / Grok / 本地" },
        ]}
      />

      <Section heading="知識庫索引" caption="以 manifest.json 為準">
        <Table
          columns={["Page", "分類", "作者", "公開等級", "格式"]}
          rows={[
            ["五大 AI 模型陣營 CLI 實機評測與 7 大職位黃金組合指南", "模型評測", "smith", { text: "public", tone: "success" }, "Canvas ＋ HTML"],
            ["bot_wiki 雙機共用知識庫總覽中控台", "知識庫索引", "smith", { text: "internal_sanitized", tone: "warning" }, "Canvas"],
          ]}
        />
        <Grid columns={2}>
          <Properties items={[{ label: "pages/smith/", value: "Smith 的 Canvas 與公開 HTML" }]} />
          <Properties items={[{ label: "shared/", value: "去識別化基準 JSON 與設計規範" }]} />
        </Grid>
      </Section>

      <Section heading="五大模型商特性摘要">
        <Rows
          rows={[
            { title: "Anthropic Claude", detail: "工具鏈最完整", status: { label: "架構與審查首選", tone: "success" } },
            { title: "OpenAI GPT Codex", detail: "沙箱與 --full-auto", status: { label: "規格與邊界推導", tone: "success" } },
            { title: "Google Gemini CLI", detail: "免費層、百萬級 Context", status: { label: "注意 429 退避", tone: "warning" } },
            { title: "xAI Grok", detail: "X 即時情報流；配額珍貴", status: { label: "指揮官省額度", tone: "warning" } },
            { title: "本地開源模型", detail: "0 成本、離線", status: { label: "高頻預檢", tone: "success" } },
          ]}
        />
      </Section>
    </Page>
  );
}
