import {
  Page, Section, Grid, Metrics, Table,
  Rows, Properties,
} from "grok/canvas";

export default function BotWikiHub() {
  return (
    <Page
      title="知識庫總覽"
      summary="頁面索引，以及五家 AI 的特性。支援 Windows、macOS、Linux。"
      width="wide"
    >
      <Metrics
        metrics={[
          { value: "2", label: "已收錄頁面", detail: "見下方索引" },
          { value: "5", label: "五家 AI", detail: "Claude、ChatGPT、Gemini、Grok、本機小模型" },
        ]}
      />

      <Section heading="知識庫索引" caption="以下面的清單為準">
        <Table
          columns={["頁面", "分類", "作者", "誰可以看", "形式"]}
          rows={[
            ["五大 AI 比一比，以及七種工作怎麼配", "模型評測", "smith", { text: "公開", tone: "success" }, "網頁"],
            ["知識庫總覽", "知識庫索引", "smith", { text: "內部", tone: "warning" }, "互動頁"],
          ]}
        />
        <Grid columns={2}>
          <Properties items={[{ label: "公開文章", value: "給讀者看的頁面" }]} />
          <Properties items={[{ label: "共用資料", value: "各頁一起用的說明" }]} />
        </Grid>
      </Section>

      <Section heading="五家 AI">
        <Rows
          rows={[
            { title: "Claude", detail: "能改檔，也能跑測試", status: { label: "適合大結構和檢查", tone: "success" } },
            { title: "ChatGPT", detail: "可在保護環境裡自動執行", status: { label: "適合拆規格、找邊界", tone: "success" } },
            { title: "Gemini", detail: "有免費額度，可以讀很長的內容", status: { label: "問太多要等一下再試", tone: "warning" } },
            { title: "Grok", detail: "看得到 Twitter 上的最新討論。額度要省。", status: { label: "負責做決定", tone: "warning" } },
            { title: "本機小模型", detail: "不另花錢，可離線", status: { label: "適合先看一遍", tone: "success" } },
          ]}
        />
      </Section>
    </Page>
  );
}
