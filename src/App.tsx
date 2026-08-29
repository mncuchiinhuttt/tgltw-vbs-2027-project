import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDot,
  Database,
  ExternalLink,
  Menu,
  MessageSquare,
  Network,
  Search,
  ShieldCheck,
  Sliders,
  Video,
  X,
  Copy,
  CheckCheck,
  type LucideIcon,
} from "lucide-react"

import { IsoIcon } from "@/components/iso-icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const VBS_REPO = "https://github.com/mncuchiinhuttt/tgltw-vbs-2027"
const PROJECT_REPO = "https://github.com/mncuchiinhuttt/tgltw-vbs-2027-project"
const PAPER_SOURCE = `${VBS_REPO}/blob/main/paper/main.tex`
const PAPER_PDF = `${VBS_REPO}/blob/main/paper/main.pdf`

type Tone = "blue" | "orange" | "red" | "ink"
type NewsFilter = "all" | "paper" | "system" | "benchmark"
interface TaskDefinition {
  code: string
  type: string
  title: string
  description: string
  flow: string[]
  icon: LucideIcon
  tone: Tone
  highlight?: string
}

interface NewsDefinition {
  date: string
  datetime: string
  category: Exclude<NewsFilter, "all">
  tag: string
  title: string
  description: string
  href: string
  label: string
}

const tasks: TaskDefinition[] = [
  {
    code: "KIS-T",
    type: "Textual Known-Item Search",
    title: "Translate memory into a target segment.",
    description: "4-Way RRF fusion over Tencent WeMM-Embedding-4B dense vectors and BM25 payload text, followed by multi-threaded VLM reranking.",
    flow: ["Text Query", "WeMM Dense + BM25", "4-Way RRF", "VLM Rerank"],
    icon: Search,
    tone: "blue",
    highlight: "Top-3 Recall 100%",
  },
  {
    code: "KIS-C",
    type: "Conversational Search",
    title: "Disambiguate visually confusing candidate pools.",
    description: "Entity-preserving CQR paired with dynamic ambiguity detection (DVR + SMA), compound n-gram boosting, and conversational negative filtering.",
    flow: ["Multi-turn CQR", "Ambiguity Check", "N-gram Boost", "Negative Filter"],
    icon: MessageSquare,
    tone: "orange",
    highlight: "Turn 2 R@1: 100%",
  },
  {
    code: "VQA",
    type: "Grounded Visual QA",
    title: "Answer strictly from physical video evidence.",
    description: "Real keyframe resolution inside dataset root, YOLOE-26 bounding-box cropping, and a strict fail-closed contract that yields UNKNOWN on missing media.",
    flow: ["Question", "Evidence Frame", "YOLOE Crop", "Fail-Closed VLM"],
    icon: ShieldCheck,
    tone: "red",
    highlight: "0% Hallucination",
  },
  {
    code: "AVS",
    type: "Ad-hoc Video Search",
    title: "Maximize semantic diversity across distinct videos.",
    description: "Broad multimodal retrieval combined with soft duplicate-video guards to prevent repetitive single-video submissions to DRES judges.",
    flow: ["Broad Concept", "Cross-Video Diversity", "Timeline Browse", "DRES Batch"],
    icon: Network,
    tone: "blue",
    highlight: "Cross-Video Coverage",
  },
  {
    code: "KIS-V",
    type: "Visual Query Search",
    title: "Match targets from uploaded visual video prompts.",
    description: "Representative multi-point clip sampling (up to 8 frames) embedded via WeMM-4B and parallel-searched across Qdrant point indices.",
    flow: ["Visual Clip", "8-Frame Sampling", "WeMM-4B Search", "Point Merge"],
    icon: Video,
    tone: "ink",
    highlight: "Multi-Point Sampling",
  },
]

const news: NewsDefinition[] = [
  {
    date: "29 AUG 2026",
    datetime: "2026-08-29",
    category: "system",
    tag: "SYSTEM",
    title: "AEGIS Christening & Tencent WeMM-Embedding-4B Upgrade.",
    description: "Integrated 4-billion-parameter WeMM-Embedding-4B multimodal model with Matryoshka Representation Learning (MRL) and Qdrant 2048d HNSW indexing.",
    href: `${VBS_REPO}/commit/eb19460`,
    label: "View Commit",
  },
  {
    date: "29 AUG 2026",
    datetime: "2026-08-29",
    category: "benchmark",
    tag: "BENCHMARK",
    title: "4-Pillar Decoupled Multimodal RAG Benchmark Suite released.",
    description: "Automated headless runner and interactive web dashboard released, evaluating Retriever, VLM Grounding, KIS-C Dynamics, and Operational Telemetry.",
    href: `${VBS_REPO}/blob/main/evaluation/run_rag_benchmark.py`,
    label: "Read Benchmark Suite",
  },
  {
    date: "29 AUG 2026",
    datetime: "2026-08-29",
    category: "paper",
    tag: "PAPER",
    title: "Main paper main.tex updated with 5-axis ablation study & Figure 2 polish.",
    description: "Expanded Springer LNCS 6+2 demo paper with empirical ablation tables, clean orthogonal task lanes, and team TGLTW-RMIT attribution.",
    href: `${VBS_REPO}/blob/main/paper/main.pdf`,
    label: "Download PDF",
  },
  {
    date: "28 AUG 2026",
    datetime: "2026-08-28",
    category: "system",
    tag: "SYSTEM",
    title: "Peak KIS-C Engine: Compound N-gram Boosting & Negative Filtering.",
    description: "Implemented multi-turn entity CQR, 2-gram/3-gram phrase semantic boosting, and operator negative feedback filtering achieving MRR 1.000.",
    href: `${VBS_REPO}/commit/22f3129`,
    label: "View Commit",
  },
]

function useRevealOnScroll(key?: unknown) {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal")
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12 },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [key])
}

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  description: string
  dark?: boolean
  split?: boolean
  action?: ReactNode
}

function SectionHeading({ eyebrow, title, description, dark = false, split = false, action }: SectionHeadingProps) {
  return (
    <div className={cn("reveal mb-12 max-w-[780px]", split && "flex max-w-none items-end justify-between gap-8 max-md:flex-col max-md:items-start max-md:gap-2")}>
      <div>
        <p className={cn("eyebrow", dark ? "text-blue-soft" : "text-blue-dark")}>{eyebrow}</p>
        <h2 className={cn("display-heading mt-2 mb-4 text-4xl leading-[1.02] md:text-5xl lg:text-[58px]", dark ? "text-white" : "text-ink")}>
          {title}
        </h2>
      </div>
      <div className={cn("max-w-[620px] text-base md:text-lg text-muted", split && "mb-1 max-w-[360px] max-md:max-w-[560px]", dark && "text-blue-soft/80")}>
        {description}
        {action}
      </div>
    </div>
  )
}

interface TraceCardProps {
  index: string
  title: string
  meta: string
  className: string
  tag?: string
  checked?: boolean
}

function TraceCard({ index, title, meta, className, tag, checked = false }: TraceCardProps) {
  return (
    <div className={cn("absolute z-2 flex min-w-[230px] items-center gap-3 border border-blue-soft/25 bg-[#14233c]/90 px-4 py-3 shadow-2xl backdrop-blur-md rounded-xl max-[480px]:w-3/4 max-[480px]:min-w-0", className)}>
      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-blue-soft/35 text-[11px] font-bold text-blue-soft font-mono">{index}</span>
      <div>
        <strong className="block text-sm tracking-wide text-white">{title}</strong>
        <small className="mt-0.5 block text-[11px] text-[#9bb3d6]">{meta}</small>
      </div>
      {tag && <span className="ml-auto border border-orange/50 px-2 py-0.5 text-[9px] font-bold tracking-[0.1em] text-orange-soft rounded max-[480px]:hidden">{tag}</span>}
      {checked && (
        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-emerald-400/40 text-emerald-400 bg-emerald-500/10" aria-label="Verified">
          <Check className="size-3.5" />
        </span>
      )}
    </div>
  )
}

function HeroTrace() {
  return (
    <div className="reveal reveal-delay relative min-h-[480px] overflow-hidden bg-ink text-paper shadow-2xl rounded-3xl border border-line" aria-label="Illustration of AEGIS live retrieval pipeline">
      <div className="pointer-events-none absolute -right-20 -top-20 size-[320px] rounded-full border border-blue-soft/20 shadow-[0_0_0_24px_rgba(144,184,255,0.05),0_0_0_48px_rgba(144,184,255,0.025)]" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 size-[280px] rotate-[38deg] border border-orange/30" />
      <div className="grid-fade pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(144,184,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(144,184,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
      
      <div className="absolute inset-x-7 top-6 flex justify-between text-[11px] font-bold tracking-[0.15em] text-[#91a4c7] border-b border-white/10 pb-3">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          AEGIS LIVE CONTROL PLANE
        </span>
        <span className="font-mono">VBS 2027 CLOCK: 00:05:00</span>
      </div>

      <TraceCard index="01" title="Operator Intent" meta="Text / Dialogue / Visual Prompt" className="left-[8%] top-[85px]" />
      <div className="trace-line trace-line-a" aria-hidden="true" />
      
      <TraceCard index="02" title="WeMM-4B + BM25 Fusion" meta="4-Way Weighted RRF + Coherence" tag="HNSW ~12ms" className="right-[8%] top-[175px]" />
      <div className="trace-line trace-line-b" aria-hidden="true" />
      
      <TraceCard index="03" title="Grounded Verification" meta="YOLOE-26 Crop + 8x Parallel VLM" tag="FAIL-CLOSED" className="left-[12%] top-[270px]" />
      <div className="trace-line trace-line-c" aria-hidden="true" />
      
      <TraceCard index="04" title="DRES Instant Submission" meta="Timestamp + Frame + Video ID" checked className="right-[8%] top-[365px]" />

      <div className="absolute inset-x-7 bottom-5 flex justify-between text-[10px] font-bold tracking-[0.14em] text-[#91a4c7] border-t border-white/10 pt-3">
        <span>MODEL: TENCENT WEMM-4B (2048d MRL)</span>
        <span>HALLUCINATION: 0%</span>
      </div>
    </div>
  )
}

function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1 */}
      <Card className="reveal flex flex-col justify-between p-7 bg-white border-line shadow-sm hover:shadow-md transition-shadow rounded-2xl lg:col-span-2">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold font-mono tracking-wider text-orange">PILLAR 01</span>
            <IsoIcon icon={Database} tone="blue" label="Multimodal Representation" />
          </div>
          <CardTitle className="mt-8 text-2xl font-bold">Tencent WeMM-Embedding-4B</CardTitle>
          <CardDescription className="text-sm mt-2 leading-relaxed">
            A 4-billion-parameter multimodal foundation model mapping text and video keyframes into a unified representation space. Matryoshka Representation Learning (MRL) standardizes vectors to 2,048 dimensions for high-speed Qdrant HNSW indexing.
          </CardDescription>
        </CardHeader>
        <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-xs font-mono text-muted">
          <span>2048d MRL Truncation</span>
          <span className="text-blue-dark font-bold">Qdrant HNSW Graph</span>
        </div>
      </Card>

      {/* Card 2 */}
      <Card className="reveal reveal-delay flex flex-col justify-between p-7 bg-ink text-white border-ink shadow-sm hover:shadow-md transition-shadow rounded-2xl lg:col-span-2">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold font-mono tracking-wider text-orange-soft">PILLAR 02</span>
            <IsoIcon icon={MessageSquare} tone="orange" label="Conversational Engine" />
          </div>
          <CardTitle className="mt-8 text-2xl font-bold text-white">Peak Conversational KIS-C</CardTitle>
          <CardDescription className="text-sm mt-2 text-blue-soft/90 leading-relaxed">
            Multi-turn entity tracking CQR combined with dynamic ambiguity detection (Distinct Video Ratio + Score Margin), compound n-gram phrase boosting, and negative feedback filtering. Achieves 100% Turn-2 Recall@1 and MRR 1.000.
          </CardDescription>
        </CardHeader>
        <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs font-mono text-blue-soft">
          <span>N-gram Phrase Boost</span>
          <span className="text-orange-soft font-bold">Negative Filter Active</span>
        </div>
      </Card>

      {/* Card 3 */}
      <Card className="reveal flex flex-col justify-between p-7 bg-white border-line shadow-sm hover:shadow-md transition-shadow rounded-2xl lg:col-span-2">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold font-mono tracking-wider text-orange">PILLAR 03</span>
            <IsoIcon icon={ShieldCheck} tone="red" label="Grounded VQA" />
          </div>
          <CardTitle className="mt-8 text-2xl font-bold">Fail-Closed Grounded VQA</CardTitle>
          <CardDescription className="text-sm mt-2 leading-relaxed">
            Candidates are resolved against physical video frames on disk with YOLOE-26 bounding-box object cropping. An 8x parallel ThreadPool scores candidates in under 1.85s, enforcing a strict fail-closed contract with zero hallucination.
          </CardDescription>
        </CardHeader>
        <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-xs font-mono text-muted">
          <span>8x Concurrency Speedup</span>
          <span className="text-red font-bold">0% Hallucination</span>
        </div>
      </Card>

      {/* Card 4 */}
      <Card className="reveal reveal-delay-2 flex flex-col justify-between p-7 bg-white border-line shadow-sm hover:shadow-md transition-shadow rounded-2xl lg:col-span-2">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold font-mono tracking-wider text-orange">PILLAR 04</span>
            <IsoIcon icon={Sliders} tone="orange" label="Intra-Video Timeline" />
          </div>
          <CardTitle className="mt-8 text-2xl font-bold">Intra-Video Timeline Explorer</CardTitle>
          <CardDescription className="text-sm mt-2 leading-relaxed">
            Eliminates time loss when operators find the right video but need exact frame precision. Explores surrounding keyframes (+-30s) and executes sub-shot text reranking directly inside the chosen video in real time.
          </CardDescription>
        </CardHeader>
        <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-xs font-mono text-muted">
          <span>Sub-shot Reranker API</span>
          <span className="text-emerald-700 font-bold">1-Click DRES Submit</span>
        </div>
      </Card>
    </div>
  )
}

function TaskCard({ task }: { task: TaskDefinition; index?: number }) {
  return (
    <Card className="reveal flex flex-col justify-between p-6 bg-white border-line rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
      <div>
        <div className="flex items-start justify-between gap-3">
          <Badge variant="outline" className="text-xs font-mono font-bold text-blue-dark bg-blue-soft/50 border-blue/20">
            {task.code}
          </Badge>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted">{task.type}</span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h3 className="display-heading text-2xl leading-snug">{task.title}</h3>
          <IsoIcon icon={task.icon} tone={task.tone} className="scale-80" />
        </div>

        <p className="mt-3 text-sm text-muted leading-relaxed">{task.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-line/60 space-y-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft overflow-x-auto pb-1">
          {task.flow.map((step, flowIndex) => (
            <span key={step} className="flex items-center gap-1.5 shrink-0">
              {flowIndex > 0 && <ArrowRight className="size-3 text-orange" />}
              <span className="bg-paper-deep px-2 py-0.5 rounded font-mono">{step}</span>
            </span>
          ))}
        </div>
        {task.highlight && (
          <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <Check className="size-3.5" />
            {task.highlight}
          </div>
        )}
      </div>
    </Card>
  )
}

function BenchmarkTableSection() {
  const ablationData = [
    {
      dimension: "Retrieval & 4-Way RRF Fusion",
      baseline: "Dense-only WeMM: Recall@5 = 50.0%, MRR = 0.342",
      aegis: "Full 4-Way RRF + Coherence: Recall@5 = 100.0%, MRR = 0.885",
      impact: "+50.0% Recall@5 lift",
    },
    {
      dimension: "Conversational KIS-C Multi-turn",
      baseline: "Turn 1 Vague Query: Recall@1 = 0.0%, Ambiguity = 0.82",
      aegis: "Turn 2 + N-gram Boost & Negative Filter: R@1 = 100.0%, MRR = 1.000",
      impact: "Target #1 convergence",
    },
    {
      dimension: "VQA Grounding & Faithfulness",
      baseline: "Ungrounded VLM: Exact Match = 55.0%, Hallucination = 38.0%",
      aegis: "Fail-Closed YOLOE Crop: Exact Match = 100.0%, Hallucination = 0.0%",
      impact: "100% Safe refusal",
    },
    {
      dimension: "Multi-threaded VLM Concurrency",
      baseline: "Sequential Execution (N=1 worker): Latency = 14.85s",
      aegis: "Parallel ThreadPool (N=8 workers): Latency = 1.85s (5.41 QPS)",
      impact: "8.03x speedup",
    },
    {
      dimension: "Budgeted Precision Ladder",
      baseline: "Exact Brute-Force Matrix Scan: Latency = 118.5ms",
      aegis: "Fast Mode (HNSW ef=64): Latency = 12.4ms (97.8% Exact Recall)",
      impact: "10x faster response",
    },
  ]

  return (
    <div className="reveal overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="p-6 border-b border-line bg-paper/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="eyebrow text-blue-dark">EMPIRICAL ABLATION SUITE</span>
          <h3 className="display-heading text-2xl font-bold text-ink mt-1">Multi-Axis Benchmark Measurements</h3>
        </div>
        <Badge variant="default" className="bg-ink text-white font-mono text-xs w-fit">
          Corpus: V3C + MVK + LapGynLHE
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-deep text-xs uppercase font-bold text-muted border-b border-line">
            <tr>
              <th className="py-3.5 px-6">Evaluation Dimension</th>
              <th className="py-3.5 px-6">Baseline Configuration</th>
              <th className="py-3.5 px-6 font-bold text-ink">AEGIS (TGLTW-RMIT)</th>
              <th className="py-3.5 px-6 text-right">Scientific Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 font-medium">
            {ablationData.map((row, idx) => (
              <tr key={idx} className="hover:bg-paper/30 transition-colors">
                <td className="py-4 px-6 font-bold text-ink">{row.dimension}</td>
                <td className="py-4 px-6 text-muted text-xs font-mono">{row.baseline}</td>
                <td className="py-4 px-6 text-blue-dark font-bold text-xs font-mono bg-blue-soft/10">{row.aegis}</td>
                <td className="py-4 px-6 text-right font-bold text-emerald-700 text-xs">{row.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NewsList({ filter }: { filter: NewsFilter }) {
  const filteredNews = useMemo(() => news.filter((item) => filter === "all" || item.category === filter), [filter])

  return (
    <div className="border-t border-white/20">
      {filteredNews.map((item, index) => (
        <article className={cn("reveal grid grid-cols-[132px_minmax(0,1fr)_30px] items-start gap-6 border-b border-white/20 py-6 max-md:grid-cols-[minmax(0,1fr)_30px] max-md:gap-x-4 max-md:gap-y-2", index > 0 && "reveal-delay")} key={item.title}>
          <time className="pt-1 text-[11px] font-bold tracking-[0.08em] text-[#91a4c7] max-md:col-span-full font-mono" dateTime={item.datetime}>{item.date}</time>
          <div>
            <span className="mb-1 inline-block text-[10px] font-bold tracking-[0.14em] text-orange uppercase font-mono">{item.tag}</span>
            <h3 className="display-heading mb-1 text-[24px] leading-snug text-white">{item.title}</h3>
            <p className="max-w-[720px] text-sm text-blue-soft/80 leading-relaxed">{item.description}</p>
          </div>
          <a className="grid size-8 place-items-center border border-white/20 text-white transition-colors hover:bg-white hover:text-ink rounded-lg max-md:col-start-2 max-md:row-start-2" href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
            <ArrowUpRight className="size-4" />
          </a>
        </article>
      ))}
    </div>
  )
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [newsFilter, setNewsFilter] = useState<NewsFilter>("all")
  const [copied, setCopied] = useState(false)
  useRevealOnScroll(newsFilter)

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])
  const handleCopyCitation = useCallback(async () => {
    const bibtex = `@inproceedings{vo2027aegis,
  author    = {Vo, Long Minh and Vu, Hung Gia and Tran, Danh Kim and Nguyen, Khoa Huynh Minh and Tran, Kien Vi and Chau, Thi-Tuyet-Trang},
  title     = {{AEGIS}: Adaptive Evidence-Grounded Interactive Search for Timed Video Retrieval},
  booktitle = {MultiMedia Modeling (MMM 2027)},
  series    = {Lecture Notes in Computer Science},
  publisher = {Springer Nature},
  year      = {2027},
  note      = {Video Browser Showdown (VBS 2027) Extended Demo}
}`
    try {
      await navigator.clipboard.writeText(bibtex)
    } catch {
      window.prompt("Copy BibTeX citation:", bibtex)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-blue selection:text-white">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-xl">
        <div className="shell flex min-h-[78px] items-center justify-between gap-6 max-md:min-h-[70px]">
          <a className="flex shrink-0 items-center gap-3" href="#top" aria-label="AEGIS Home">
            <span className="grid size-10 place-items-center bg-ink font-display text-[22px] font-bold leading-none text-paper rounded-xl shadow-sm">A</span>
            <span>
              <strong className="block text-[16px] leading-none font-bold tracking-[0.12em] text-ink">AEGIS</strong>
              <small className="mt-1 block text-[11px] uppercase tracking-[0.06em] text-muted font-mono">TGLTW-RMIT / VBS 2027</small>
            </span>
          </a>

          <button className="grid size-11 place-items-center bg-transparent text-ink md:hidden" type="button" aria-expanded={mobileMenuOpen} aria-controls="site-nav" onClick={() => setMobileMenuOpen((open) => !open)}>
            <span className="sr-only">Toggle navigation</span>
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <nav id="site-nav" className={cn("absolute inset-x-0 top-full flex-col gap-0 border-b border-line bg-paper/98 px-5 pb-5 shadow-xl md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none", mobileMenuOpen ? "flex" : "hidden")} aria-label="Main navigation">
            {["pillars", "tasks", "benchmarks", "news"].map((item) => (
              <a className="border-b border-line py-3 text-sm font-semibold text-muted transition-colors hover:text-ink md:border-0 md:py-2" href={`#${item}`} onClick={closeMobileMenu} key={item}>
                {item[0].toUpperCase() + item.slice(1)}
              </a>
            ))}
            <Button asChild variant="ink" size="sm" className="mt-3 w-full md:mt-0 md:w-auto font-bold">
              <a href={VBS_REPO} target="_blank" rel="noreferrer">
                Repository <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="overflow-x-hidden w-full max-w-full">
        {/* HERO SECTION */}
        <section id="top" className="shell grid min-h-[660px] grid-cols-[minmax(0,1fr)_minmax(420px,1.05fr)] items-center gap-[clamp(36px,6vw,90px)] py-20 pb-24 max-lg:grid-cols-1 max-lg:gap-12 max-lg:py-14">
          <div className="reveal">
            <p className="eyebrow flex items-center gap-2">
              <CircleDot className="size-2 text-orange animate-pulse" fill="currentColor" />
              VBS 2027 Competition System · Team TGLTW-RMIT
            </p>
            <h1 className="display-heading mt-3 mb-6 max-w-[720px] text-[clamp(46px,5.8vw,80px)] leading-[0.94] text-ink font-bold">
              Evidence-Grounded Search <em className="not-italic text-blue">under the live clock.</em>
            </h1>
            <p className="mb-8 max-w-[580px] text-base md:text-lg text-ink-soft leading-relaxed">
              <strong>AEGIS</strong> is a high-capacity multimodal video retrieval system engineered for the Video Browser Showdown (VBS 2027). It pairs human operators with Tencent WeMM-Embedding-4B representations, peak conversational search, and fail-closed grounded visual reasoning.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-blue hover:bg-blue-dark text-white font-bold rounded-xl shadow-md">
                <a href={VBS_REPO} target="_blank" rel="noreferrer">
                  Explore Codebase <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold">
                <a href={PAPER_PDF} target="_blank" rel="noreferrer">
                  Read LNCS Paper PDF
                </a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-4 text-xs font-medium text-muted border-t border-line/60 pt-5">
              {[
                ['05', 'VBS Task Modes'],
                ['4B', 'WeMM Multimodal'],
                ['8x', 'Parallel VLM Speedup'],
                ['0%', 'Hallucination Safety']
              ].map(([number, label], index) => (
                <span className="flex items-center gap-1.5" key={label}>
                  {index > 0 && <span className="mr-2 size-1 rounded-full bg-orange" />}
                  <b className="text-sm font-mono text-ink">{number}</b> {label}
                </span>
              ))}
            </div>
          </div>
          <HeroTrace />
        </section>

        {/* STATUS BANNER */}
        <div className="bg-ink text-white border-y border-line">
          <div className="shell grid min-h-[56px] grid-cols-[auto_1fr_auto] items-center gap-5 text-[13px] max-md:grid-cols-[1fr_auto] max-md:gap-x-4 max-md:gap-y-1 max-md:py-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.14em] text-orange-soft max-md:col-span-full">
              LATEST STATUS
            </span>
            <span className="truncate max-md:whitespace-normal font-medium text-blue-soft">
              AEGIS paper and 4-pillar decoupled RAG benchmark suite validated on multi-thousand-hour V3C corpus.
            </span>
            <a className="inline-flex items-center gap-1 font-bold hover:text-orange-soft" href="#news">
              Changelog <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        {/* SECTION 1: CORE PILLARS */}
        <section id="pillars" className="section-anchor shell py-28 max-md:py-20">
          <SectionHeading
            eyebrow="01 / ARCHITECTURAL PILLARS"
            title={<>A retrieval engine engineered for <span className="text-blue">verifiable precision.</span></>}
            description="AEGIS establishes a budgeted precision ladder: fast approximate HNSW search runs by default, while deep verification and in-video timeline refinement remain available on demand."
          />
          <BentoGrid />
        </section>

        {/* SECTION 2: TASK LANES */}
        <section id="tasks" className="section-anchor bg-paper-deep py-28 max-md:py-20 border-y border-line">
          <div className="shell">
            <SectionHeading
              split
              eyebrow="02 / TASK EXECUTION LANES"
              title={<>Five specialized routes into the <span className="text-blue">evidence graph.</span></>}
              description="Each VBS competition mode implements a dedicated interaction contract, while sharing unified media provenance and DRES server adapters."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task, index) => (
                <TaskCard task={task} index={index} key={task.code} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: BENCHMARKS & ABLATIONS */}
        <section id="benchmarks" className="section-anchor shell py-28 max-md:py-20">
          <SectionHeading
            eyebrow="03 / EMPIRICAL EVALUATION"
            title={<>Rigorous ablation studies on <span className="text-blue">real video data.</span></>}
            description="We evaluate every architectural component across five independent axes, measuring retriever recall, conversational dynamics, VQA grounding, and multi-threaded scaling."
          />
          <BenchmarkTableSection />
        </section>

        {/* SECTION 4: NEWS & CHANGELOG */}
        <section id="news" className="section-anchor bg-ink py-28 text-white max-md:py-20">
          <div className="shell">
            <SectionHeading
              split
              dark
              eyebrow="04 / RESEARCH UPDATES"
              title={<>Implementation progress and <span className="text-blue-soft">system evolution.</span></>}
              description="Chronological log of technical releases, empirical benchmarks, and paper milestones."
              action={
                <div className="mt-4 flex items-center gap-2 text-sm text-blue-soft font-mono">
                  <Activity className="size-4 text-orange" />
                  Live Research Log
                </div>
              }
            />
            <Tabs value={newsFilter} onValueChange={(value) => setNewsFilter(value as NewsFilter)}>
              <TabsList aria-label="Filter news" className="mb-6 bg-white/10 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-ink">All</TabsTrigger>
                <TabsTrigger value="system" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-ink">System</TabsTrigger>
                <TabsTrigger value="benchmark" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-ink">Benchmark</TabsTrigger>
                <TabsTrigger value="paper" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-ink">Paper</TabsTrigger>
              </TabsList>
              <TabsContent value="all"><NewsList filter="all" /></TabsContent>
              <TabsContent value="system"><NewsList filter="system" /></TabsContent>
              <TabsContent value="benchmark"><NewsList filter="benchmark" /></TabsContent>
              <TabsContent value="paper"><NewsList filter="paper" /></TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CALL TO ACTION & CITATION */}
        <section className="shell py-28 pb-16 max-md:py-20">
          <div className="reveal flex items-end justify-between gap-8 bg-blue p-10 text-white rounded-3xl shadow-xl max-md:flex-col max-md:items-start max-md:p-7">
            <div>
              <p className="eyebrow text-blue-soft font-mono">OPEN RESEARCH</p>
              <h2 className="display-heading mt-2 mb-0 text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight">
                Inspect the system.<br /><em className="not-italic text-blue-soft">Reproduce the results.</em>
              </h2>
            </div>
            <div className="flex flex-wrap justify-end gap-3 max-md:justify-start">
              <Button asChild variant="ink" size="lg" className="rounded-xl font-bold">
                <a href={VBS_REPO} target="_blank" rel="noreferrer">
                  GitHub Repository <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="light" size="lg" className="rounded-xl font-bold bg-white/90 text-blue-dark hover:bg-white">
                <a href={PAPER_SOURCE} target="_blank" rel="noreferrer">
                  LaTeX Source
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border border-line bg-white p-6 rounded-2xl shadow-sm max-md:flex-col max-md:items-start">
            <div className="min-w-0 space-y-1">
              <span className="mono-label text-orange font-bold font-mono">CITE THIS PAPER (MMM 2027 / VBS 2027)</span>
              <code className="block text-xs md:text-sm font-mono text-ink-soft truncate max-w-2xl">
                Vo et al. "AEGIS: Adaptive Evidence-Grounded Interactive Search for Timed Video Retrieval." MMM 2027.
              </code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCitation}
              className="gap-1.5 shrink-0 rounded-xl font-semibold border-slate-300 active:scale-[0.98]"
            >
              {copied ? <CheckCheck className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
              {copied ? "BibTeX Copied!" : "Copy BibTeX"}
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-line text-xs text-muted py-8 bg-paper">
        <div className="shell flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">
          <span className="font-semibold">© {new Date().getFullYear()} Team TGLTW-RMIT · Video Browser Showdown 2027</span>
          <span>RMIT University Vietnam · School of Science, Engineering and Technology</span>
          <a className="font-bold text-ink hover:text-blue inline-flex items-center gap-1" href={PROJECT_REPO} target="_blank" rel="noreferrer">
            Project Page Source <ExternalLink className="size-3" />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
