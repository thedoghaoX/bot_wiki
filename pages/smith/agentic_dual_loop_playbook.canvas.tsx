import { useState } from "react";
import {
  Page, Section, Grid, Metrics, Text, Table, Bars, Segmented, Callout,
  Properties, Status, Checklist, Rows, Divider,
} from "grok/canvas";

type LoopKey = "loop1" | "loop2" | "quota";

const LOOPS: Record<LoopKey, {
  label: string; goal: string; rows: { lead: string; title: string; detail: string }[]; tip: string;
}> = {
  loop1: {
    label: "迴圈一：工程確定性閘門",
    goal: "每次改檔前後都由 0-Token 腳本打分數，AI 說了不算，分數說了算。",
    rows: [
      { lead: "前", title: "前置閘門（Pre-Gate）", detail: "改檔前先跑基準測試，記下分數、檔案雜湊與允許修改的檔案清單。" },
      { lead: "改", title: "AI 只動清單內的檔案", detail: "超出允許清單的修改一律退回，避免模型順手亂改。" },
      { lead: "後", title: "後置閘門（Post-Gate）", detail: "改完再跑同一套測試，計算淨成長（新通過數減去退步數）。" },
      { lead: "剝", title: "剝除 AI 自述成績單", detail: "模型自己寫的「全部通過」一律丟掉，只採信外層腳本實際跑出的結果。" },
      { lead: "斷", title: "連續 2 輪無進展自動斷路", detail: "淨成長連兩輪小於等於 0 就停手換策略，不讓模型在原地燒額度。" },
    ],
    tip: "這一圈完全不花 Token：測試、雜湊、計分全是確定性腳本。",
  },
  loop2: {
    label: "迴圈二：跨陣營模型演化",
    goal: "讓不同廠牌的模型互相出題、互相考，避免同一個模型自己考自己。",
    rows: [
      { lead: "出", title: "出題官與考生物理分離", detail: "出題的模型看得到標準答案，考試的模型永遠拿不到；題庫用雜湊鎖死。" },
      { lead: "考", title: "考生多陣營輪流上場", detail: "雲端大模型、免費層模型與本地小模型都考同一份卷，成績可直接比較。" },
      { lead: "審", title: "驗證器內建突變擊殺測試", detail: "故意塞錯的答案（格式錯、連線錯、物理意義錯）驗證器都必須抓得到。" },
      { lead: "演", title: "錯題回流成下一輪教材", detail: "只把「為什麼錯」濃縮成短膠囊，不帶原始長日誌，下一輪 Context 依然精簡。" },
    ],
    tip: "出題、寫手、驗收三權分立，驗證器檔案上唯讀鎖，寫手改不到考卷。",
  },
  quota: {
    label: "指揮官省額度分工",
    goal: "珍貴的頂級模型只做決策，重活交給本地命令列小弟與 0-Token 腳本。",
    rows: [
      { lead: "令", title: "指揮官（高階雲端模型）", detail: "只讀精簡指標檔與當輪摘要，負責拆單、定驗收標準與最終決策。" },
      { lead: "做", title: "推理做事模型（Builder）", detail: "依單子實作，單次只做一個薄片任務，例如一次最多擴 15 題。" },
      { lead: "審", title: "獨立檢視模型（Auditor）", detail: "另開一套不共用 Context 的模型重新審查，專找邊角案例與偽造成績。" },
      { lead: "跑", title: "本地小模型與腳本", detail: "語法預檢、日誌脫敏、批次測試全在本地跑，0 API 成本。" },
    ],
    tip: "指標檔控制在 40 行內，細節由腳本按需注入，長文失憶與 Token 浪費一起解決。",
  },
};

export default function AgenticDualTrackPlaybook() {
  const [loop, setLoop] = useState<LoopKey>("loop1");
  const cur = LOOPS[loop];
  return (
    <Page
      title="AI 時代雙軌協作迴圈 × 0-Token 確定性閘門開發精華"
      summary="一套推理做事、一套獨立檢視；讓腳本當裁判、讓模型當工人，解決雲端 AI 長文失憶與 Token 浪費。"
      width="wide"
    >
      <Metrics
        metrics={[
          { value: "2 套", label: "模型分工", detail: "推理做事＋獨立檢視" },
          { value: "0 Token", label: "閘門成本", detail: "測試與計分全由腳本完成", tone: "success" },
          { value: "2 輪", label: "無進展斷路", detail: "淨成長連兩輪 ≤ 0 即停手", tone: "warning" },
          { value: "≤ 40 行", label: "指標檔長度", detail: "細節按需注入" },
        ]}
      />

      <Section heading="痛點：為什麼雲端 AI 越做越笨？" caption="長任務最常見的三種失控">
        <Grid columns={3}>
          <Callout lead="長文失憶" tone="warning">
            整份專案文件塞進對話，模型讀到後面就忘了前面的規則，還會把舊進度當新進度。
          </Callout>
          <Callout lead="自吹成績" tone="danger">
            模型很容易宣稱「全部通過」，但實際根本沒跑測試，或只跑了最簡單的那幾題。
          </Callout>
          <Callout lead="原地燒額度" tone="warning">
            同一個錯誤反覆嘗試，每一輪都重新讀大檔，額度在沒有進展的情況下快速見底。
          </Callout>
        </Grid>
      </Section>

      <Section heading="三大核心機制" caption="切換查看每一圈的具體做法">
        <Segmented
          options={[
            { value: "loop1", label: "迴圈一" },
            { value: "loop2", label: "迴圈二" },
            { value: "quota", label: "省額度分工" },
          ]}
          value={loop}
          onChange={(v) => setLoop(v as LoopKey)}
        />
        <Callout lead={cur.label} tone="info">{cur.goal}</Callout>
        <Rows rows={cur.rows} />
        <Text>{cur.tip}</Text>
      </Section>

      <Section heading="推理做事 × 獨立檢視：雙模型互審分工表">
        <Table
          columns={["角色", "看得到什麼", "不能做什麼", "產出"]}
          rows={[
            ["推理做事（Builder）", "當輪任務單、允許修改清單", "不能改驗證器與考卷", "程式碼修改與修改理由"],
            ["獨立檢視（Auditor）", "修改差異與測試結果", "不能沿用 Builder 的對話紀錄", "反例清單與通過／退回判定"],
            ["0-Token 閘門腳本", "前後測試分數與檔案雜湊", "不採信任何模型自述", { text: "唯一有效的通過判定", tone: "success" }],
          ]}
        />
      </Section>

      <Section heading="每種工作建議交給誰？" caption="編輯部經驗值，相對分數 1~5，越高越適合">
        <Bars
          bars={[
            { label: "決策與拆單 → 高階雲端模型", value: 5, display: "5" },
            { label: "實作與重構 → 推理做事模型", value: 4, display: "4" },
            { label: "反例審查 → 獨立檢視模型", value: 4, display: "4" },
            { label: "語法預檢與脫敏 → 本地小模型", value: 3, display: "3" },
            { label: "測試計分 → 0-Token 腳本", value: 5, display: "5" },
          ]}
        />
      </Section>

      <Divider />

      <Grid columns={2}>
        <Section heading="導入檢查清單" caption="狀態以本頁撰寫當下為準">
          <Checklist
            items={[
              { text: "專案指標檔壓到 40 行以內", done: true },
              { text: "每個驗證器都有 3 個故意塞錯的突變測試", done: true },
              { text: "驗證器與考卷加上雜湊唯讀鎖", done: true },
              { text: "閘門結果只看外層腳本，不看模型自述", done: true },
              { text: "連續 2 輪無進展自動斷路並換策略", done: true },
            ]}
          />
        </Section>
        <Section heading="一句話重點">
          <Properties
            items={[
              { label: "誰當裁判", value: "確定性腳本" },
              { label: "誰當工人", value: "推理做事模型＋本地小弟" },
              { label: "誰挑毛病", value: "不共用 Context 的獨立檢視模型" },
              { label: "何時喊停", value: "淨成長連兩輪 ≤ 0" },
            ]}
          />
          <Status tone="success">方法論可直接套用到任何程式專案</Status>
        </Section>
      </Grid>
    </Page>
  );
}
