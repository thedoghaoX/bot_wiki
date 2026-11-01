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
    label: "第一段：用固定程式打分數",
    goal: "每次改檔前後都由不花模型額度的程式打分數。AI 說了不算，分數說了算。",
    rows: [
      { lead: "前", title: "改之前先測", detail: "改檔前先跑同一套測試，記下分數、檔案有沒有被改過，以及允許修改的檔案清單。" },
      { lead: "改", title: "AI 只動清單內的檔案", detail: "超出允許清單的修改一律退回，避免模型順手亂改。" },
      { lead: "後", title: "改完再測", detail: "改完再跑同一套測試，看實際進步了多少（新通過的減去退步的）。" },
      { lead: "丟", title: "不採信 AI 自己說的成績", detail: "模型自己寫的「全部通過」一律丟掉，只採信外層程式實際跑出的結果。" },
      { lead: "停", title: "連續兩輪沒進步就停", detail: "實際進步連續兩輪小於等於 0 就停手換方法，不讓模型在原地燒額度。" },
    ],
    tip: "這一段完全不花模型額度：測試、比對檔案、計分都是固定程式。",
  },
  loop2: {
    label: "第二段：不同家的模型輪流考",
    goal: "讓不同家的模型互相出題、互相考，避免同一個模型自己考自己。",
    rows: [
      { lead: "出", title: "出題的和作答的分開", detail: "出題的模型看得到標準答案，作答的模型永遠拿不到；題目鎖定，不能改。" },
      { lead: "考", title: "不同家的模型輪流作答", detail: "雲端大模型、免費額度的模型與自己電腦上的小模型都考同一份，成績可以直接比。" },
      { lead: "審", title: "檢查程式要抓得到故意做錯的答案", detail: "故意塞錯的答案（格式錯、連線錯、不合常理）檢查程式都必須抓得到。" },
      { lead: "再", title: "錯題變成下一輪的教材", detail: "只把「為什麼錯」濃縮成短篇備忘，不帶很長的原始紀錄，下一輪的對話仍然精簡。" },
    ],
    tip: "出題、寫、驗收分開。檢查程式鎖成不能改，寫的人改不到考卷。",
  },
  quota: {
    label: "負責指揮的省著用",
    goal: "最貴的模型只做決定，粗重活交給自己電腦上的命令列小弟，以及不花模型額度的程式。",
    rows: [
      { lead: "令", title: "負責指揮的（高階雲端模型）", detail: "只讀精簡的重點紀錄和這一輪摘要，負責把工作拆開、定檢查標準與做最後決定。" },
      { lead: "做", title: "負責做的模型", detail: "照單子做，一次只做一小塊，例如一次最多增加 15 題。" },
      { lead: "審", title: "負責檢查的模型", detail: "另開一套不共用先前對話的模型重新檢查，專門找少見情況和假成績。" },
      { lead: "跑", title: "自己電腦上的小模型與程式", detail: "先看語法、遮掉紀錄裡的私人內容、整批測試都在自己電腦跑，不另花呼叫費用。" },
    ],
    tip: "重點紀錄控制在 40 行內，細節等需要時再補上。這樣比較不會讀到後面就忘了前面，也不浪費額度。",
  },
};

export default function AgenticDualTrackPlaybook() {
  const [loop, setLoop] = useState<LoopKey>("loop1");
  const cur = LOOPS[loop];
  return (
    <Page
      title="做事和檢查分開，檢查不花模型額度"
      summary="一套負責做，一套獨立檢查。讓程式當裁判、讓模型當工人，避免雲端 AI 讀長了就忘，也避免浪費額度。"
      width="wide"
    >
      <Metrics
        metrics={[
          { value: "2 套", label: "模型分工", detail: "負責做＋獨立檢查" },
          { value: "不花額度", label: "檢查成本", detail: "測試與計分全由程式完成", tone: "success" },
          { value: "2 輪", label: "沒進步就停", detail: "連續兩輪沒有進步就停手", tone: "warning" },
          { value: "≤ 40 行", label: "重點紀錄長度", detail: "細節等需要時再補" },
        ]}
      />

      <Section heading="痛點：為什麼雲端 AI 越做越笨？" caption="長任務最常見的三種失控">
        <Grid columns={3}>
          <Callout lead="讀長了就忘" tone="warning">
            整份專案文件塞進對話，模型讀到後面就忘了前面的規則，還會把舊進度當新進度。
          </Callout>
          <Callout lead="自己說自己通過" tone="danger">
            模型很容易宣稱「全部通過」，但實際根本沒跑測試，或只跑了最簡單的那幾題。
          </Callout>
          <Callout lead="原地燒額度" tone="warning">
            同一個錯誤反覆嘗試，每一輪都重新讀大檔，額度在沒有進展的情況下很快用完。
          </Callout>
        </Grid>
      </Section>

      <Section heading="三個核心做法" caption="切換查看每一段怎麼做">
        <Segmented
          options={[
            { value: "loop1", label: "第一段" },
            { value: "loop2", label: "第二段" },
            { value: "quota", label: "省額度" },
          ]}
          value={loop}
          onChange={(v) => setLoop(v as LoopKey)}
        />
        <Callout lead={cur.label} tone="info">{cur.goal}</Callout>
        <Rows rows={cur.rows} />
        <Text>{cur.tip}</Text>
      </Section>

      <Section heading="負責做的和負責檢查的怎麼分工">
        <Table
          columns={["角色", "看得到什麼", "不能做什麼", "產出"]}
          rows={[
            ["負責做的", "這一輪的工作單、允許修改的清單", "不能改檢查程式和考卷", "程式修改與修改理由"],
            ["負責檢查的", "改了什麼、測試結果", "不能沿用負責做的那一段對話", "反例清單與通過或退回"],
            ["不花額度的檢查程式", "改之前和改之後的分數、檔案有沒有被改過", "不採信任何模型自己說的", { text: "唯一算數的通過判定", tone: "success" }],
          ]}
        />
      </Section>

      <Section heading="每種工作建議交給誰？" caption="編輯整理的相對分數，1 到 5，越高越適合">
        <Bars
          bars={[
            { label: "做決定、把工作拆開 → 高階雲端模型", value: 5, display: "5" },
            { label: "實作與重做架構 → 負責做的模型", value: 4, display: "4" },
            { label: "找反例 → 負責檢查的模型", value: 4, display: "4" },
            { label: "先看語法、遮掉私人內容 → 自己電腦上的小模型", value: 3, display: "3" },
            { label: "測試計分 → 不花額度的程式", value: 5, display: "5" },
          ]}
        />
      </Section>

      <Divider />

      <Grid columns={2}>
        <Section heading="開始用之前對一下" caption="狀態以本頁撰寫當下為準">
          <Checklist
            items={[
              { text: "重點紀錄壓到 40 行以內", done: true },
              { text: "每個檢查程式都有 3 個故意做錯的測試", done: true },
              { text: "檢查程式和考卷鎖成不能改", done: true },
              { text: "通過與否只看外層程式，不看模型自己說的", done: true },
              { text: "連續兩輪沒進步就停，並換方法", done: true },
            ]}
          />
        </Section>
        <Section heading="一句話重點">
          <Properties
            items={[
              { label: "誰當裁判", value: "固定程式" },
              { label: "誰當工人", value: "負責做的模型＋自己電腦上的小弟" },
              { label: "誰挑毛病", value: "不共用先前對話的檢查模型" },
              { label: "何時喊停", value: "連續兩輪沒有進步" },
            ]}
          />
          <Status tone="success">這套做法可以直接用在任何程式專案</Status>
        </Section>
      </Grid>
    </Page>
  );
}
