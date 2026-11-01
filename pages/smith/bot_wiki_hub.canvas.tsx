import {
  Page, Section, Grid, Metrics, Table,
  Rows, Properties,
} from "grok/canvas";

export default function BotWikiHub() {
  return (
    <Page
      title="知識庫總覽"
      summary="頁面索引，以及五大模型陣營的特性摘要。支援 Windows、macOS、Linux。"
      width="wide"
    >
      <Metrics
        metrics={[
          { value: "2", label: "已收錄頁面", detail: "見下方索引" },
          { value: "5", label: "模型陣營", detail: "Claude / Codex / Gemini / Grok / 本地" },
        ]}
      />

      <Section heading="知識庫索引" caption="以下面的清單為準">
        <Table
          columns={["頁面", "分類", "作者", "誰可以看", "形式"]}
          rows={[
            ["五大 AI 模型陣營命令列實機評測與 7 大職位黃金組合指南", "模型評測", "smith", { text: "公開", tone: "success" }, "網頁"],
            ["知識庫總覽", "知識庫索引", "smith", { text: "內部", tone: "warning" }, "互動頁"],
          ]}
        />
        <Grid columns={2}>
          <Properties items={[{ label: "公開文章", value: "給讀者看的頁面" }]} />
          <Properties items={[{ label: "共用資料", value: "各頁一起用的說明" }]} />
        </Grid>
      </Section>

      <Section heading="五大模型的特性摘要">
        <Rows
          rows={[
            { title: "Anthropic Claude", detail: "能做的步驟最完整", status: { label: "適合架構與檢查", tone: "success" } },
            { title: "OpenAI GPT Codex", detail: "可在保護環境裡自動執行", status: { label: "適合拆規格、找邊界", tone: "success" } },
            { title: "Google Gemini", detail: "有免費額度，可以讀很長的內容", status: { label: "請求太多要等待再試", tone: "warning" } },
            { title: "xAI Grok", detail: "看得到 X 上的最新討論；額度要省", status: { label: "負責指揮，省著用", tone: "warning" } },
            { title: "本地開源模型", detail: "不另花錢、可離線", status: { label: "適合先看一遍", tone: "success" } },
          ]}
        />
      </Section>
    </Page>
  );
}
