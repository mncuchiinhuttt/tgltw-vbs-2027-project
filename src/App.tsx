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
  MessagesSquare,
  Network,
  Search,
  ShieldCheck,
  Video,
  X,
  Zap,
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
const VBS_CALL = "https://videobrowsershowdown.org/call-for-papers/"

type Tone = "blue" | "orange" | "red" | "ink"
type NewsFilter = "all" | "paper" | "system"

interface TaskDefinition {
  code: string
  type: string
  title: string
  description: string
  flow: string[]
  icon: LucideIcon
  tone: Tone
  inverted?: boolean
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
    code: "KIS-V",
    type: "visual known-item",
    title: "Show the system what you saw.",
    description: "A short visual clip is sampled, embedded, searched, merged, and returned with source identity attached.",
    flow: ["clip", "frames", "hits"],
    icon: Video,
    tone: "blue",
  },
  {
    code: "KIS-T",
    type: "text known-item",
    title: "Translate memory into a target.",
    description: "CQR, HyDE, dense/sparse retrieval, RRF, and bounded reranking search for one known segment.",
    flow: ["text", "fusion", "target"],
    icon: Search,
    tone: "orange",
  },
  {
    code: "KIS-C",
    type: "conversational",
    title: "Ask one better question.",
    description: "Clarification and feedback update a bounded session instead of launching an unbounded agent loop.",
    flow: ["query", "clarify", "focus"],
    icon: MessagesSquare,
    tone: "ink",
    inverted: true,
  },
  {
    code: "AVS",
    type: "ad-hoc search",
    title: "Find breadth without spam.",
    description: "Scene diversification and manual browsing favor useful shots from distinct source videos.",
    flow: ["concept", "diversify", "submit"],
    icon: Network,
    tone: "ink",
  },
  {
    code: "VQA",
    type: "grounded answer",
    title: "Answer from the frame you can prove.",
    description: "Candidate resolution, real media loading, strict JSON, and evidence parity keep the answer auditable.",
    flow: ["question", "frame", "answer"],
    icon: ShieldCheck,
    tone: "red",
  },
]

const news: NewsDefinition[] = [
  {
    date: "21 AUG 2026",
    datetime: "2026-08-21",
    category: "paper",
    tag: "PAPER",
    title: "Official VBS datasets and evaluation contract added.",
    description: "V3C shards, MVK, GynSurg, DRES, live-vs-replay metrics, and the 6+2 submission note are now documented.",
    href: `${VBS_REPO}/pull/30`,
    label: "Read PR 30",
  },
  {
    date: "21 AUG 2026",
    datetime: "2026-08-21",
    category: "system",
    tag: "SYSTEM",
    title: "Replay VQA now fails closed on missing evidence.",
    description: "The evaluator decodes real image/video evidence using canonical frame identity and never asks the VLM to answer blind.",
    href: `${VBS_REPO}/blob/main/evaluation/run_eval.py`,
    label: "Read evaluation runner",
  },
  {
    date: "21 AUG 2026",
    datetime: "2026-08-21",
    category: "paper",
    tag: "PAPER",
    title: "Task-specific flowcharts and red screenshot notes are in place.",
    description: "KIS-V, KIS-T, KIS-C, AVS, and grounded VQA each have an explicit pipeline contract.",
    href: PAPER_SOURCE,
    label: "Read paper source",
  },
  {
    date: "10 AUG 2026",
    datetime: "2026-08-10",
    category: "system",
    tag: "SYSTEM",
    title: "Grounded media provenance survives the full UI path.",
    description: "Canonical media, frame, timestamp, API payload, and displayed preview stay aligned for VQA inspection.",
    href: VBS_REPO,
    label: "Open project repository",
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
    <div className={cn("reveal mb-12 max-w-[710px]", split && "flex max-w-none items-end justify-between gap-8 max-md:flex-col max-md:items-start max-md:gap-2")}>
      <div>
        <p className={cn("eyebrow", dark && "text-blue-soft")}>{eyebrow}</p>
        <h2 className={cn("display-heading mt-2 mb-4 text-5xl leading-[0.96] md:text-[68px]", dark ? "text-white" : "text-ink")}>
          {title}
        </h2>
      </div>
      <div className={cn("max-w-[590px] text-lg text-muted", split && "mb-1 max-w-[330px] max-md:max-w-[560px]", dark && "text-blue-soft/80")}>
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
    <div className={cn("absolute z-2 flex min-w-[220px] items-center gap-3 border border-blue-soft/25 bg-[#1e3153]/85 px-4 py-3 shadow-xl backdrop-blur-md max-[480px]:w-3/4 max-[480px]:min-w-0", className)}>
      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-blue-soft/35 text-[11px] font-bold text-blue-soft">{index}</span>
      <div>
        <strong className="block text-sm tracking-wide">{title}</strong>
        <small className="mt-0.5 block text-[11px] text-[#a8b7d0]">{meta}</small>
      </div>
      {tag && <span className="ml-auto border border-orange/50 px-1.5 py-1 text-[9px] font-bold tracking-[0.1em] text-orange-soft max-[480px]:hidden">{tag}</span>}
      {checked && (
        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-emerald-200/45 text-emerald-200" aria-label="Ready">
          <Check className="size-3.5" />
        </span>
      )}
    </div>
  )
}

function HeroTrace() {
  return (
    <div className="reveal reveal-delay relative min-h-[465px] overflow-hidden bg-ink text-paper shadow-soft" aria-label="Illustration of the live retrieval pipeline">
      <div className="pointer-events-none absolute -right-20 -top-20 size-[300px] rounded-full border border-blue-soft/25 shadow-[0_0_0_24px_rgba(144,184,255,0.06),0_0_0_48px_rgba(144,184,255,0.035)]" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 size-[270px] rotate-[38deg] border border-orange/40" />
      <div className="grid-fade pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(144,184,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(144,184,255,0.09)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute inset-x-7 top-6 flex justify-between text-[10px] font-bold tracking-[0.15em] text-[#91a4c7]">
        <span>LIVE QUERY TRACE</span>
        <span>00:05:00</span>
      </div>
      <TraceCard index="01" title="operator prompt" meta="text / clip / question" className="left-[12%] top-[90px] max-[480px]:left-[7%]" />
      <div className="trace-line trace-line-a" aria-hidden="true" />
      <TraceCard index="02" title="evidence fusion" meta="dense + sparse + RRF" tag="FAST PATH" className="right-[8%] top-[178px]" />
      <div className="trace-line trace-line-b" aria-hidden="true" />
      <TraceCard index="03" title="grounded evidence" meta="video / frame / timestamp" className="left-[17%] top-[268px] max-[480px]:left-[10%]" />
      <div className="trace-line trace-line-c" aria-hidden="true" />
      <TraceCard index="04" title="DRES submission" meta="inspect → decide → submit" checked className="right-[7%] top-[360px]" />
      <div className="absolute inset-x-7 bottom-5 flex justify-between text-[10px] font-bold tracking-[0.15em] text-[#91a4c7]">
        <span>INDEX: FROZEN SNAPSHOT</span>
        <span>PROVENANCE: ON</span>
      </div>
    </div>
  )
}

function SystemCards() {
  return (
    <div className="grid grid-cols-3 gap-3.5 max-lg:grid-cols-1">
      <Card className="reveal flex min-h-[284px] flex-col justify-between p-7">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold tracking-[0.1em] text-orange">01</span>
            <IsoIcon icon={Database} tone="blue" label="Offline evidence index" />
          </div>
          <CardTitle className="mt-12">Build evidence offline.</CardTitle>
          <CardDescription>Keyframes, speech, OCR, metadata, ambient audio, and provenance are prepared before the task arrives.</CardDescription>
        </CardHeader>
        <span className="mono-label mt-5">V3C / MVK / GYNSURG</span>
      </Card>
      <Card className="reveal reveal-delay flex min-h-[284px] flex-col justify-between border-blue bg-blue p-7 text-white">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold tracking-[0.1em] text-orange-soft">02</span>
            <IsoIcon icon={Zap} tone="orange" label="Fast retrieval path" />
          </div>
          <CardTitle className="mt-12">Search the fast path first.</CardTitle>
          <CardDescription className="text-blue-soft">Dense and payload full-text retrieval meet in reciprocal-rank fusion, with temporal coherence and scene diversification keeping the result grid useful.</CardDescription>
        </CardHeader>
        <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase">
          <span>dense</span><i className="h-px flex-1 bg-white/50" /><span>sparse</span><i className="h-px flex-1 bg-white/50" /><span>RRF</span>
        </div>
      </Card>
      <Card className="reveal reveal-delay-2 flex min-h-[284px] flex-col justify-between p-7">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold tracking-[0.1em] text-orange">03</span>
            <IsoIcon icon={ShieldCheck} tone="red" label="Grounded evidence contract" />
          </div>
          <CardTitle className="mt-12">Answer only on real media.</CardTitle>
          <CardDescription>Grounded VQA preserves candidate, video, frame, and timestamp identity. Missing evidence fails closed instead of becoming a confident guess.</CardDescription>
        </CardHeader>
        <Badge variant="red" className="mt-5 w-fit">GROUNDING CONTRACT / ON</Badge>
      </Card>
    </div>
  )
}

function TaskCard({ task, index }: { task: TaskDefinition; index: number }) {
  const toneClasses: Record<Tone, string> = {
    blue: "border-t-blue",
    orange: "border-t-orange",
    red: "border-t-red",
    ink: task.inverted ? "border-t-[#8297bd] border-ink bg-ink text-white" : "border-t-[#8297bd] bg-white/70",
  }
  const textClasses = task.inverted ? "text-blue-soft" : "text-muted"

  return (
    <Card className={cn("reveal min-h-[289px] border-t-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_13px_28px_rgba(16,28,51,0.13)] lg:col-span-2", toneClasses[task.tone], index === 3 && "lg:col-start-2", index === 4 && "lg:col-start-4")}>
      <div className="flex items-start justify-between gap-3">
        <div className={cn("text-xs font-bold tracking-[0.13em]", task.inverted ? "text-blue-soft" : "text-blue-dark")}>{task.code}</div>
        <div className={cn("text-right text-[10px] uppercase tracking-wider", textClasses)}>{task.type}</div>
      </div>
      <div className="mt-7 flex items-center justify-between">
        <h3 className="display-heading max-w-[230px] text-[28px] leading-[0.97]">{task.title}</h3>
        <IsoIcon icon={task.icon} tone={task.tone} className="scale-75" />
      </div>
      <p className={cn("mt-3 min-h-[73px] text-sm", textClasses)}>{task.description}</p>
      <div className={cn("flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide", task.inverted ? "text-blue-soft" : "text-ink-soft")}>
        {task.flow.map((step, flowIndex) => (
          <span key={step} className="flex items-center gap-2">
            {flowIndex > 0 && <ArrowRight className="size-3.5 text-orange" />}
            {step}
          </span>
        ))}
      </div>
    </Card>
  )
}

function EvaluationCards() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <Card className="reveal min-h-[344px] border-ink bg-ink p-7 text-white">
          <div className="flex items-center justify-between">
            <span className="grid size-8 place-items-center rounded-full border border-current font-display text-xl">A</span>
            <Badge variant="orange">LIVE DRES</Badge>
          </div>
          <h3 className="display-heading mt-11 mb-4 text-4xl leading-[0.96]">What happened in the room?</h3>
          <ul className="mb-6 grid gap-2 text-sm text-blue-soft">
            {[
              "Official score and rank per task/session",
              "Time-to-first and time-to-correct",
              "Correct / false submissions and judge outcomes",
              "Ordered query, clarification, and interaction trace",
            ].map((item) => (
              <li className="relative pl-5" key={item}><span className="absolute left-0 top-[0.65em] size-1.5 rounded-full bg-orange" />{item}</li>
            ))}
          </ul>
          <a className="inline-flex items-center gap-1 text-sm font-bold text-white hover:text-orange" href="https://videobrowsershowdown.org/about-vbs/communication-with-dres/" target="_blank" rel="noreferrer">DRES communication guide <ArrowUpRight className="size-4" /></a>
        </Card>
        <Card className="reveal reveal-delay min-h-[344px] border-paper-deep bg-paper-deep p-7">
          <div className="flex items-center justify-between">
            <span className="grid size-8 place-items-center rounded-full border border-current font-display text-xl">B</span>
            <Badge variant="default">OFFLINE REPLAY</Badge>
          </div>
          <h3 className="display-heading mt-11 mb-4 text-4xl leading-[0.96]">What did the engine contribute?</h3>
          <ul className="mb-6 grid gap-2 text-sm text-ink-soft">
            {[
              "Frozen manifest, index, model, and config",
              "Recall@K, MRR, nDCG, hit rate",
              "VQA grounding and evidence parity",
              "Warm/cold p50 and p95 latency",
            ].map((item) => (
              <li className="relative pl-5" key={item}><span className="absolute left-0 top-[0.65em] size-1.5 rounded-full bg-orange" />{item}</li>
            ))}
          </ul>
          <a className="inline-flex items-center gap-1 text-sm font-bold text-blue-dark hover:text-orange" href="https://doi.org/10.1145/3678881" target="_blank" rel="noreferrer">Evaluation infrastructure paper <ArrowUpRight className="size-4" /></a>
        </Card>
      </div>
      <div className="reveal mt-4 grid grid-cols-[minmax(0,1.7fr)_repeat(3,1fr)] items-center gap-5 border border-line bg-white/35 px-6 py-5 max-lg:grid-cols-3 max-lg:gap-4 max-lg:[&>div:first-child]:col-span-full max-md:grid-cols-2 max-md:[&>div:first-child]:col-span-full max-[480px]:grid-cols-1 max-[480px]:[&>div:not(:first-child)]:border-l-0 max-[480px]:[&>div:not(:first-child)]:border-t max-[480px]:[&>div:not(:first-child)]:pl-0 max-[480px]:[&>div:not(:first-child)]:pt-3">
        <div>
          <span className="mono-label">KNOWN AHEAD OF TIME</span>
          <strong className="mt-1 block font-display text-[22px] font-semibold">V3C · MVK · GynSurg / LapGynLHE</strong>
        </div>
        {[
          ["28,450", "V3C videos"],
          ["~3,800 h", "video collection"],
          ["4.14M", "predefined segments"],
        ].map(([number, label]) => (
          <div className="border-l border-line pl-5 max-lg:first-of-type:border-l-0 max-lg:first-of-type:pl-0" key={label}>
            <strong className="display-heading block text-[28px] leading-none">{number}</strong>
            <span className="mt-1 block text-xs text-muted">{label}</span>
          </div>
        ))}
      </div>
    </>
  )
}

function NewsList({ filter }: { filter: NewsFilter }) {
  const filteredNews = useMemo(() => news.filter((item) => filter === "all" || item.category === filter), [filter])

  return (
    <div className="border-t border-white/20">
      {filteredNews.map((item, index) => (
        <article className={cn("reveal grid grid-cols-[132px_minmax(0,1fr)_30px] items-start gap-6 border-b border-white/20 py-6 max-md:grid-cols-[minmax(0,1fr)_30px] max-md:gap-x-4 max-md:gap-y-2", index > 0 && "reveal-delay")} key={item.title}>
          <time className="pt-1 text-[11px] font-bold tracking-[0.08em] text-[#91a4c7] max-md:col-span-full" dateTime={item.datetime}>{item.date}</time>
          <div>
            <span className="mb-1 inline-block text-[10px] font-bold tracking-[0.14em] text-orange">{item.tag}</span>
            <h3 className="display-heading mb-1 text-[26px] leading-none text-white">{item.title}</h3>
            <p className="max-w-[690px] text-sm text-blue-soft/80">{item.description}</p>
          </div>
          <a className="grid size-8 place-items-center border border-white/20 text-white transition-colors hover:bg-white hover:text-ink max-md:col-start-2 max-md:row-start-2" href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
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
    const citation = "TGLTW: A Live-First Multimodal Video Retrieval System for VBS 2027"
    try {
      await navigator.clipboard.writeText(citation)
    } catch {
      window.prompt("Copy this project title:", citation)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }, [])

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-xl">
        <div className="shell flex min-h-[78px] items-center justify-between gap-6 max-md:min-h-[70px]">
          <a className="flex shrink-0 items-center gap-3" href="#top" aria-label="TGLTW home">
            <span className="grid size-10 place-items-center bg-ink font-display text-[25px] font-bold leading-none text-paper">T</span>
            <span>
              <strong className="block text-[15px] leading-none tracking-[0.16em]">TGLTW</strong>
              <small className="mt-1 block text-[11px] uppercase tracking-[0.06em] text-muted">VBS 2027 / project page</small>
            </span>
          </a>
          <button className="grid size-11 place-items-center bg-transparent text-ink md:hidden" type="button" aria-expanded={mobileMenuOpen} aria-controls="site-nav" onClick={() => setMobileMenuOpen((open) => !open)}>
            <span className="sr-only">Toggle navigation</span>
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <nav id="site-nav" className={cn("absolute inset-x-0 top-full flex-col gap-0 border-b border-line bg-paper/98 px-[17px] pb-[17px] shadow-xl md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none", mobileMenuOpen ? "flex" : "hidden")} aria-label="Main navigation">
            {["system", "tasks", "evaluation", "news"].map((item) => (
              <a className="border-b border-line py-3 text-sm text-muted transition-colors hover:text-ink md:border-0 md:py-2" href={`#${item}`} onClick={closeMobileMenu} key={item}>{item[0].toUpperCase() + item.slice(1)}</a>
            ))}
            <Button asChild variant="ink" size="sm" className="mt-3 w-full md:mt-0 md:w-auto">
              <a href={VBS_REPO} target="_blank" rel="noreferrer">View repository <ArrowUpRight className="size-4" /></a>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section id="top" className="shell grid min-h-[650px] grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] items-center gap-[clamp(42px,8vw,110px)] py-20 pb-[104px] max-lg:grid-cols-1 max-lg:gap-12 max-lg:py-16 max-lg:pb-[75px]">
          <div className="reveal">
            <p className="eyebrow flex items-center gap-2"><CircleDot className="size-2 text-orange" fill="currentColor" />Field note 01 · Siem Reap 2027</p>
            <h1 className="display-heading mb-6 max-w-[680px] text-[clamp(55px,6.5vw,91px)] leading-[0.91]">Search the archive<br /><em className="not-italic text-blue">while the clock is running.</em></h1>
            <p className="mb-7 max-w-[555px] text-lg text-ink-soft">TGLTW is a live-first multimodal video retrieval system for the Video Browser Showdown. It pairs a human operator with fast evidence retrieval, grounded visual reasoning, and an auditable DRES handoff.</p>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild size="lg"><a href={VBS_REPO} target="_blank" rel="noreferrer">Explore the code <ArrowRight className="size-4" /></a></Button>
              <Button asChild variant="outline" size="lg"><a href={VBS_CALL} target="_blank" rel="noreferrer">Read the VBS call</a></Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-4 text-[13px] text-muted">
              {[['05', 'official task modes'], ['01', 'operator loop'], ['0', 'invented results']].map(([number, label], index) => (
                <span className="flex items-center gap-1.5" key={label}>{index > 0 && <span className="mr-2 size-[3px] rounded-full bg-orange" />}<b className="text-base text-ink">{number}</b>{label}</span>
              ))}
            </div>
          </div>
          <HeroTrace />
        </section>

        <div className="bg-blue text-white">
          <div className="shell grid min-h-[54px] grid-cols-[auto_1fr_auto] items-center gap-5 text-[13px] max-md:grid-cols-[1fr_auto] max-md:gap-x-4 max-md:gap-y-1 max-md:py-3">
            <span className="text-[10px] font-bold tracking-[0.13em] text-blue-soft max-md:col-span-full">STATUS / 2026-08-21</span>
            <span className="truncate max-md:whitespace-normal">PR #30 merged · official VBS datasets and evaluation contract documented</span>
            <a className="inline-flex items-center gap-1 font-bold hover:text-orange-soft" href="#news">See the changelog <ArrowUpRight className="size-4" /></a>
          </div>
        </div>

        <section id="system" className="section-anchor shell py-28 max-md:py-20">
          <SectionHeading eyebrow="01 / system" title={<>A retrieval system shaped by the <span className="text-blue">live room.</span></>} description="The default path is intentionally bounded. Expensive precision steps remain available, but only when the operator decides the extra latency is worth it." />
          <SystemCards />
        </section>

        <section id="tasks" className="section-anchor bg-blue-soft py-28 max-md:py-20">
          <div className="shell">
            <SectionHeading split eyebrow="02 / task map" title={<>Five doors into the same <span className="text-blue">evidence graph.</span></>} description="Each mode gets its own interaction contract; the shared result still resolves to media an operator can inspect." />
            <div className="grid grid-cols-6 gap-3.5 max-lg:grid-cols-2 max-md:grid-cols-1">
              {tasks.map((task, index) => <TaskCard task={task} index={index} key={task.code} />)}
            </div>
          </div>
        </section>

        <section id="evaluation" className="section-anchor shell py-28 max-md:py-20">
          <SectionHeading eyebrow="03 / evaluation" title={<>Two tracks. <span className="text-blue">One honest claim.</span></>} description="Official DRES outcomes and offline replay diagnostics answer different questions. We keep them separate." />
          <EvaluationCards />
        </section>

        <section id="news" className="section-anchor bg-ink py-28 text-white max-md:py-20">
          <div className="shell">
            <SectionHeading split dark eyebrow="04 / news" title={<>Small releases, <span className="text-[#8fb3ff]">visible reasoning.</span></>} description="The project page keeps implementation progress close to the evidence and paper source." action={<div className="mt-4 flex items-center gap-2 text-sm text-blue-soft"><Activity className="size-4 text-orange" />Live-first changelog</div>} />
            <Tabs value={newsFilter} onValueChange={(value) => setNewsFilter(value as NewsFilter)}>
              <TabsList aria-label="Filter news" className="mb-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paper">Paper</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              <TabsContent value="all"><NewsList filter="all" /></TabsContent>
              <TabsContent value="paper"><NewsList filter="paper" /></TabsContent>
              <TabsContent value="system"><NewsList filter="system" /></TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="shell py-28 pb-16 max-md:py-20">
          <div className="reveal flex items-end justify-between gap-8 bg-blue p-11 text-white max-md:flex-col max-md:items-start max-md:p-7">
            <div>
              <p className="eyebrow text-blue-soft">Start here</p>
              <h2 className="display-heading mt-2 mb-0 text-5xl leading-[0.96] md:text-[68px]">Follow the evidence<br /><em className="not-italic text-white">back to the code.</em></h2>
            </div>
            <div className="flex flex-wrap justify-end gap-2.5 max-md:justify-start">
              <Button asChild variant="ink"><a href={VBS_REPO} target="_blank" rel="noreferrer">Open the VBS repository <ArrowUpRight className="size-4" /></a></Button>
              <Button asChild variant="light"><a href={PAPER_SOURCE} target="_blank" rel="noreferrer">Read the paper source</a></Button>
              <Button asChild variant="light"><a href="https://videobrowsershowdown.org/" target="_blank" rel="noreferrer">Visit VBS</a></Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-line pt-6 max-md:flex-col max-md:items-start">
            <div>
              <span className="mono-label mb-1">CITE THIS PROJECT</span>
              <code className="block text-[13px] text-ink-soft">TGLTW: A Live-First Multimodal Video Retrieval System for VBS 2027</code>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyCitation}>{copied ? "Copied" : "Copy title"}</Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-line text-xs text-muted">
        <div className="shell flex min-h-20 items-center justify-between gap-6 max-md:flex-col max-md:items-start max-md:justify-center max-md:py-6">
          <span>© {new Date().getFullYear()} TGLTW / VBS 2027</span>
          <span>Built for a live system, documented for a future paper.</span>
          <a className="font-bold text-ink hover:text-blue" href={PROJECT_REPO} target="_blank" rel="noreferrer">Project page source <ExternalLink className="ml-1 inline size-3.5" /></a>
        </div>
      </footer>
    </div>
  )
}

export default App
