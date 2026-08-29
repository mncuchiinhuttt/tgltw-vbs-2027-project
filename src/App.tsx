import { useCallback, useEffect, useState } from "react"
import {
  FileText,
  PlayCircle,
  ShieldCheck,
  Database,
  Sliders,
  Check,
  Copy,
  CheckCheck,
  ArrowUpRight,
  ExternalLink,
  Activity,
  Award,
  BookOpen,
  Code2,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const VBS_REPO = "https://github.com/mncuchiinhuttt/tgltw-vbs-2027"
const PROJECT_REPO = "https://github.com/mncuchiinhuttt/tgltw-vbs-2027-project"
const PAPER_SOURCE = `${VBS_REPO}/blob/main/paper/main.tex`
const PAPER_PDF = `${VBS_REPO}/blob/main/paper/main.pdf`
const LIVE_DEMO = "http://localhost:5173"

interface Author {
  name: string
  url?: string
  affiliations: string[]
  equalContrib?: boolean
  corresponding?: boolean
}

const authors: Author[] = [
  { name: "Long Minh Vo", affiliations: ["1", "2"], equalContrib: true },
  { name: "Hung Gia Vu", affiliations: ["1"], equalContrib: true },
  { name: "Danh Kim Tran", affiliations: ["1"] },
  { name: "Khoa Huynh Minh Nguyen", affiliations: ["1"] },
  { name: "Kien Vi Tran", affiliations: ["1"] },
  { name: "Thi-Tuyet-Trang Chau", affiliations: ["1"], corresponding: true },
]

const affiliations = [
  { id: "1", name: "School of Science, Engineering and Technology, RMIT University Vietnam" },
  { id: "2", name: "CBT's Science, Engineering and Technology Club, Ben Tre High School for Gifted Students, Vietnam" },
]

interface NewsItem {
  date: string
  tag: string
  tagColor: "emerald" | "blue" | "amber"
  title: string
  description: string
  link?: string
  linkLabel?: string
}

const newsList: NewsItem[] = [
  {
    date: "29 AUG 2026",
    tag: "ACCEPTED",
    tagColor: "emerald",
    title: "Paper accepted to MMM 2027 (Springer LNCS) as VBS 2027 Extended Demo!",
    description: "Our paper 'AEGIS: Adaptive Evidence-Grounded Interactive Search for Timed Video Retrieval' has been accepted for presentation and live competition in Siem Reap, Cambodia.",
    link: PAPER_PDF,
    linkLabel: "Read Paper PDF",
  },
  {
    date: "29 AUG 2026",
    tag: "RELEASE",
    tagColor: "blue",
    title: "4-Pillar Decoupled Multimodal Video RAG Benchmark Suite released.",
    description: "Automated test suite and interactive dashboard released, evaluating Retriever Accuracy, VLM Grounding, Conversational KIS-C Dynamics, and Telemetry.",
    link: `${VBS_REPO}/blob/main/evaluation/run_rag_benchmark.py`,
    linkLabel: "View Benchmark Suite",
  },
  {
    date: "28 AUG 2026",
    tag: "SYSTEM",
    tagColor: "amber",
    title: "Peak KIS-C Conversational Engine & WeMM-Embedding-4B integrated.",
    description: "Achieved multi-turn Recall@1 = 100.0% and MRR = 1.000 using compound n-gram boosting, dynamic ambiguity detection, and conversational negative filtering.",
    link: `${VBS_REPO}/commit/22f3129`,
    linkLabel: "View Commit",
  },
]
interface TaskDefinition {
  code: string
  type: string
  title: string
  description: string
  flow: string[]
  highlight?: string
}

const tasks: TaskDefinition[] = [
  {
    code: "KIS-T",
    type: "Textual Known-Item",
    title: "Translate memory into a target frame.",
    description: "4-Way RRF fusion over Tencent WeMM-Embedding-4B dense vectors and BM25 payload text, followed by parallelized VLM verification.",
    flow: ["Text Query", "WeMM Dense + BM25", "4-Way RRF", "VLM Rerank"],
    highlight: "Recall@5 100%",
  },
  {
    code: "KIS-C",
    type: "Conversational Search",
    title: "Disambiguate visual candidate pools.",
    description: "Entity-preserving CQR paired with dynamic ambiguity detection (DVR + SMA), compound n-gram boosting, and negative feedback filtering.",
    flow: ["Multi-turn CQR", "Ambiguity Check", "N-gram Boost", "Negative Filter"],
    highlight: "Turn 2 R@1: 100%",
  },
  {
    code: "VQA",
    type: "Grounded Visual QA",
    title: "Answer strictly from physical video evidence.",
    description: "Real keyframe resolution inside dataset root, YOLOE-26 bounding-box cropping, and a strict fail-closed contract that yields UNKNOWN on missing media.",
    flow: ["Question", "Evidence Frame", "YOLOE Crop", "Fail-Closed VLM"],
    highlight: "0% Hallucination",
  },
  {
    code: "AVS",
    type: "Ad-hoc Video Search",
    title: "Maximize semantic diversity across videos.",
    description: "Broad multimodal retrieval combined with soft duplicate-video guards to prevent repetitive single-video submissions to DRES judges.",
    flow: ["Broad Concept", "Cross-Video Diversity", "Timeline Browse", "DRES Batch"],
    highlight: "Cross-Video Coverage",
  },
  {
    code: "KIS-V",
    type: "Visual Query Search",
    title: "Match targets from visual video prompts.",
    description: "Representative multi-point clip sampling (up to 8 frames) embedded via WeMM-4B and parallel-searched across Qdrant point indices.",
    flow: ["Visual Clip", "8-Frame Sampling", "WeMM-4B Search", "Point Merge"],
    highlight: "Multi-Point Sampling",
  },
]

function useRevealOnScroll() {
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
      { threshold: 0.1 },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])
}

export function App() {
  const [copied, setCopied] = useState(false)
  useRevealOnScroll()

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
    <div className="min-h-screen bg-paper text-ink selection:bg-blue selection:text-white font-sans">
      
      {/* TOP ACADEMIC HEADER & HERO */}
      <header className="shell pt-14 pb-12 max-w-5xl text-center space-y-7">
        
        {/* Conference Acceptance Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-600/20 text-emerald-800 text-xs font-bold tracking-wide shadow-sm animate-pulse">
          <Award className="size-4 text-emerald-600" />
          <span>Accepted to MultiMedia Modeling (MMM 2027) · Video Browser Showdown Extended Demo</span>
        </div>

        {/* Paper Title (Wide Container, 2-3 Lines Max) */}
        <h1 className="display-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-ink leading-[1.05] max-w-5xl mx-auto m-0">
          <span className="text-blue">AEGIS:</span> Adaptive Evidence-Grounded Interactive Search for Timed Video Retrieval
        </h1>

        {/* Authors List */}
        <div className="space-y-2 max-w-4xl mx-auto pt-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-base md:text-lg font-semibold text-slate-800">
            {authors.map((author, i) => (
              <span key={author.name} className="inline-flex items-center whitespace-nowrap">
                {author.name}
                <sup className="text-xs font-bold text-blue-dark ml-0.5">
                  {author.affiliations.join(",")}
                  {author.equalContrib && "*"}
                  {author.corresponding && "†"}
                </sup>
                {i < authors.length - 1 && <span className="text-slate-300 ml-4 font-normal">·</span>}
              </span>
            ))}
          </div>

          {/* Affiliations */}
          <div className="text-xs md:text-sm text-slate-500 space-y-0.5 pt-1 font-medium">
            {affiliations.map((aff) => (
              <p key={aff.id} className="m-0">
                <sup className="font-bold text-blue-dark">{aff.id}</sup> {aff.name}
              </p>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 font-mono pt-1">
            * Equal contribution &nbsp;&nbsp; † Corresponding author
          </div>
        </div>

        {/* Primary Academic Links & Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Button asChild size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md gap-2 px-6">
            <a href={PAPER_PDF} target="_blank" rel="noreferrer">
              <FileText className="size-4" />
              Paper PDF
            </a>
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-full bg-white hover:bg-slate-50 border-slate-300 text-slate-800 font-bold shadow-sm gap-2 px-6">
            <a href={VBS_REPO} target="_blank" rel="noreferrer">
              <Code2 className="size-4" />
              Code (GitHub)
            </a>
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-full bg-white hover:bg-slate-50 border-slate-300 text-slate-800 font-bold shadow-sm gap-2 px-6">
            <a href={PAPER_SOURCE} target="_blank" rel="noreferrer">
              <BookOpen className="size-4" />
              LaTeX Source
            </a>
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 font-bold shadow-sm gap-2 px-6">
            <a href={LIVE_DEMO} target="_blank" rel="noreferrer">
              <PlayCircle className="size-4 text-blue" />
              Live System UI
            </a>
          </Button>
        </div>
      </header>

      {/* TEASER PIPELINE SHOWCASE */}
      <section className="shell max-w-5xl py-6">
        <div className="reveal relative overflow-hidden bg-ink text-paper rounded-3xl p-6 sm:p-8 shadow-2xl border border-line">
          <div className="grid-fade pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(144,184,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(144,184,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-soft flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              AEGIS Live Interactive Architecture Overview
            </span>
            <Badge variant="outline" className="text-[10px] font-mono text-orange-soft border-orange/40 bg-orange/10">
              VBS 2027 Competition System
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-[10px] font-bold font-mono text-orange-soft uppercase">Stage 01</div>
              <strong className="text-sm font-bold text-white block">Offline Ingestion</strong>
              <p className="text-xs text-blue-soft/80 leading-relaxed">
                Tencent WeMM-Embedding-4B (2048d MRL), PP-OCRv6, faster-whisper ASR, YOLOE-26 BBoxes into Qdrant HNSW.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-[10px] font-bold font-mono text-orange-soft uppercase">Stage 02</div>
              <strong className="text-sm font-bold text-white block">Hybrid Fast Search</strong>
              <p className="text-xs text-blue-soft/80 leading-relaxed">
                4-Way Weighted RRF fusion over WeMM dense vectors, payload text BM25, and temporal coherence boost.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-[10px] font-bold font-mono text-orange-soft uppercase">Stage 03</div>
              <strong className="text-sm font-bold text-white block">Peak KIS-C & VQA</strong>
              <p className="text-xs text-blue-soft/80 leading-relaxed">
                Multi-turn entity CQR, N-gram phrase boosting, negative feedback filter, and 8x parallel fail-closed VQA.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-[10px] font-bold font-mono text-orange-soft uppercase">Stage 04</div>
              <strong className="text-sm font-bold text-white block">Intra-Video Exploration</strong>
              <p className="text-xs text-blue-soft/80 leading-relaxed">
                Sub-shot reranker and +-30s timeline drill-down enabling instant 1-click DRES server submission.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
            <span>CORPUS: V3C (3,800 HOURS, 4.14M SEGMENTS) + MVK + LAPGYNLHE</span>
            <span className="text-emerald-400 font-bold">100% EVIDENCE PROVENANCE PRESERVED</span>
          </div>
        </div>
      </section>

      {/* NEWS & ACCEPTED ANNOUNCEMENTS SECTION */}
      <section className="shell max-w-5xl py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-line shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <Activity className="size-5 text-orange" />
              <h2 className="display-heading text-2xl font-bold text-ink m-0">Latest Research & System News</h2>
            </div>
            <span className="text-xs font-mono text-muted">Chronological Log</span>
          </div>

          <div className="space-y-4">
            {newsList.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl border border-line bg-paper/30 hover:bg-paper/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <Badge
                      className={cn(
                        "text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded",
                        item.tagColor === "emerald" && "bg-emerald-100 text-emerald-800 border-emerald-200",
                        item.tagColor === "blue" && "bg-blue-100 text-blue-800 border-blue-200",
                        item.tagColor === "amber" && "bg-amber-100 text-amber-800 border-amber-200"
                      )}
                    >
                      {item.tag}
                    </Badge>
                    <span className="text-xs font-mono text-muted">{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-ink">{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed max-w-3xl">{item.description}</p>
                </div>

                {item.link && (
                  <Button asChild variant="outline" size="sm" className="shrink-0 gap-1 rounded-xl font-semibold bg-white border-slate-300">
                    <a href={item.link} target="_blank" rel="noreferrer">
                      {item.linkLabel || "Details"} <ArrowUpRight className="size-3.5" />
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABSTRACT SECTION */}
      <section className="shell max-w-5xl py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-line shadow-sm space-y-4">
          <span className="mono-label text-blue-dark font-bold">EXECUTIVE SUMMARY</span>
          <h2 className="display-heading text-3xl font-bold text-ink m-0">Abstract</h2>
          <p className="text-base md:text-lg text-ink-soft leading-relaxed pt-2">
            Interactive video retrieval in timed competition environments presents severe trade-offs between retrieval latency, semantic coverage, and answer faithfulness. In this paper, we present <strong>AEGIS</strong> (<strong>A</strong>daptive <strong>E</strong>vidence-<strong>G</strong>rounded <strong>I</strong>nteractive <strong>S</strong>earch), a live-first multimodal video retrieval system developed by team <strong>TGLTW-RMIT</strong> for the Video Browser Showdown (VBS 2027). 
          </p>
          <p className="text-sm md:text-base text-muted leading-relaxed">
            AEGIS is built around high-capacity multimodal representations (Tencent WeMM-Embedding-4B with Matryoshka Representation Learning), parallelized vision-language reranking, strict fail-closed Visual Question Answering (VQA), and a peak Conversational Known-Item Search (KIS-C) engine. By unifying dense vector search over Hierarchical Navigable Small World (HNSW) graphs with payload text lexical gates, multi-turn entity tracking, compound $n$-gram clarification boosting, and conversational negative feedback filtering, the system resolves complex visual ambiguities in real time. Comprehensive empirical ablations on the multi-thousand-hour V3C corpus demonstrate sub-2s parallelized VLM scoring, 100% fail-closed safety rate without hallucinations, and 100% multi-turn KIS-C Recall@1 (MRR 1.000).
          </p>
        </div>
      </section>

      {/* 4 ARCHITECTURAL PILLARS (BENTO GRID) */}
      <section className="shell max-w-5xl py-10">
        <div className="mb-8">
          <span className="mono-label text-blue-dark font-bold">SYSTEM ARCHITECTURE</span>
          <h2 className="display-heading text-3xl md:text-4xl font-bold text-ink mt-1">Core Methodological Pillars</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-7 bg-white border-line shadow-sm rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono text-xs font-bold text-blue bg-blue-soft/30 border-blue/20">PILLAR 01</Badge>
              <Database className="size-5 text-blue" />
            </div>
            <CardTitle className="text-2xl font-bold text-ink pt-2">Tencent WeMM-Embedding-4B</CardTitle>
            <CardDescription className="text-sm text-muted leading-relaxed">
              4-billion-parameter foundation multimodal embedder providing unified representations for text and keyframes. Matryoshka Representation Learning (MRL) standardizes vectors to 2,048 dimensions for Qdrant HNSW indexing.
            </CardDescription>
            <div className="pt-3 text-xs font-mono text-slate-500 border-t border-line/60">
              Dimensionality: 2048d · Approximate HNSW ~12ms
            </div>
          </Card>

          <Card className="p-7 bg-ink text-white border-ink shadow-sm rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono text-xs font-bold text-orange-soft bg-orange/20 border-orange/40">PILLAR 02</Badge>
              <MessageSquare className="size-5 text-orange" />
            </div>
            <CardTitle className="text-2xl font-bold text-white pt-2">Peak Conversational KIS-C</CardTitle>
            <CardDescription className="text-sm text-blue-soft/90 leading-relaxed">
              Entity-preserving CQR paired with dynamic ambiguity detection ($DVR + SMA$), compound n-gram phrase boosting, and negative feedback filtering. Converts ambiguous pools to Rank #1 hits.
            </CardDescription>
            <div className="pt-3 text-xs font-mono text-blue-soft border-t border-white/10">
              Recall@1: 100.0% · MRR: 1.000 · Delta Ambiguity: -0.58
            </div>
          </Card>

          <Card className="p-7 bg-white border-line shadow-sm rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono text-xs font-bold text-red bg-red-soft/40 border-red/20">PILLAR 03</Badge>
              <ShieldCheck className="size-5 text-red" />
            </div>
            <CardTitle className="text-2xl font-bold text-ink pt-2">Fail-Closed Grounded VQA</CardTitle>
            <CardDescription className="text-sm text-muted leading-relaxed">
              Physical keyframe resolution with YOLOE-26 bounding-box crops. An 8x parallel ThreadPool evaluates candidates in 1.85s with a strict fail-closed contract ensuring zero hallucination.
            </CardDescription>
            <div className="pt-3 text-xs font-mono text-slate-500 border-t border-line/60">
              Safety Rate: 100.0% · Hallucination: 0.0% · Speedup: 8.03x
            </div>
          </Card>

          <Card className="p-7 bg-white border-line shadow-sm rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border-emerald-200">PILLAR 04</Badge>
              <Sliders className="size-5 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-ink pt-2">Intra-Video Timeline Explorer</CardTitle>
            <CardDescription className="text-sm text-muted leading-relaxed">
              Enables operators to inspect surrounding keyframes (+-30s) and execute sub-shot text reranking directly inside a confirmed video, pinpointing target frames in seconds.
            </CardDescription>
            <div className="pt-3 text-xs font-mono text-slate-500 border-t border-line/60">
              Sub-shot Reranker API · 1-Click DRES Submit
            </div>
          </Card>
        </div>
      </section>

      {/* 5 TASK EXECUTION LANES */}
      <section className="shell max-w-5xl py-10">
        <div className="mb-8">
          <span className="mono-label text-blue-dark font-bold">VBS COMPETITION MODES</span>
          <h2 className="display-heading text-3xl md:text-4xl font-bold text-ink mt-1">Five Task Execution Lanes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task.code} className="p-6 bg-white border-line rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs font-bold text-blue-dark bg-blue-soft/40 border-blue/20">
                    {task.code}
                  </Badge>
                  <span className="text-[10px] uppercase font-bold text-muted">{task.type}</span>
                </div>
                <h3 className="text-xl font-bold text-ink">{task.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{task.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-line/60 space-y-2">
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-ink-soft overflow-x-auto pb-1">
                  {task.flow.map((s, idx) => (
                    <span key={s} className="flex items-center gap-1 shrink-0">
                      {idx > 0 && <span className="text-orange">→</span>}
                      <span className="bg-paper-deep px-1.5 py-0.5 rounded">{s}</span>
                    </span>
                  ))}
                </div>
                {task.highlight && (
                  <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="size-3" />
                    {task.highlight}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* EMPIRICAL RESULTS & ABLATION STUDY TABLE */}
      <section className="shell max-w-5xl py-10">
        <div className="mb-8">
          <span className="mono-label text-blue-dark font-bold">EMPIRICAL ABLATION RESULTS</span>
          <h2 className="display-heading text-3xl md:text-4xl font-bold text-ink mt-1">Experimental Performance</h2>
        </div>

        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
          <div className="p-6 border-b border-line bg-paper/40 flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink m-0">Ablation Studies on Multi-Thousand-Hour V3C Archive</h3>
            <Badge variant="outline" className="font-mono text-xs font-bold bg-white">100% Grounded Telemetry</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper-deep text-xs font-mono uppercase font-bold text-muted border-b border-line">
                <tr>
                  <th className="py-3 px-6">Pipeline Component / Axis</th>
                  <th className="py-3 px-6">Baseline Setting</th>
                  <th className="py-3 px-6 font-bold text-ink">AEGIS (TGLTW-RMIT)</th>
                  <th className="py-3 px-6 text-right">Scientific Lift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 font-medium text-xs md:text-sm">
                <tr className="hover:bg-paper/30 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-ink">Multimodal 4-Way RRF Fusion</td>
                  <td className="py-3.5 px-6 text-muted font-mono">Dense-only: R@5 = 50.0%</td>
                  <td className="py-3.5 px-6 text-blue-dark font-bold font-mono">Full RRF: R@5 = 100.0%, MRR = 0.885</td>
                  <td className="py-3.5 px-6 text-right font-bold text-emerald-700">+50.0% Recall@5</td>
                </tr>
                <tr className="hover:bg-paper/30 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-ink">Conversational KIS-C Multi-turn</td>
                  <td className="py-3.5 px-6 text-muted font-mono">Turn 1: R@1 = 0.0%, Amb = 0.82</td>
                  <td className="py-3.5 px-6 text-blue-dark font-bold font-mono">Turn 2: R@1 = 100.0%, MRR = 1.000</td>
                  <td className="py-3.5 px-6 text-right font-bold text-emerald-700">Rank #1 Convergence</td>
                </tr>
                <tr className="hover:bg-paper/30 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-ink">Grounded VQA & Fail-Closed</td>
                  <td className="py-3.5 px-6 text-muted font-mono">Ungrounded VLM: 38.0% Hallucination</td>
                  <td className="py-3.5 px-6 text-blue-dark font-bold font-mono">Fail-Closed Contract: 0.0% Error</td>
                  <td className="py-3.5 px-6 text-right font-bold text-emerald-700">100% Safe Refusal</td>
                </tr>
                <tr className="hover:bg-paper/30 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-ink">Multi-threaded VLM Concurrency</td>
                  <td className="py-3.5 px-6 text-muted font-mono">Sequential (N=1): 14.85s</td>
                  <td className="py-3.5 px-6 text-blue-dark font-bold font-mono">Parallel ThreadPool (N=8): 1.85s</td>
                  <td className="py-3.5 px-6 text-right font-bold text-emerald-700">8.03x Speedup</td>
                </tr>
                <tr className="hover:bg-paper/30 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-ink">Budgeted Precision Ladder</td>
                  <td className="py-3.5 px-6 text-muted font-mono">Exact Brute-Force: 118.5ms</td>
                  <td className="py-3.5 px-6 text-blue-dark font-bold font-mono">Fast HNSW (ef=64): 12.4ms (97.8% R)</td>
                  <td className="py-3.5 px-6 text-right font-bold text-emerald-700">10x Lower Latency</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* BIBTEX CITATION BOX */}
      <section className="shell max-w-5xl py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-line shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-blue" />
              <h3 className="display-heading text-2xl font-bold text-ink m-0">BibTeX Citation</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCitation}
              className="gap-1.5 rounded-full font-bold border-slate-300 text-slate-700 active:scale-[0.98]"
            >
              {copied ? <CheckCheck className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
              {copied ? "Copied to Clipboard!" : "Copy BibTeX"}
            </Button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`@inproceedings{vo2027aegis,
  author    = {Vo, Long Minh and Vu, Hung Gia and Tran, Danh Kim and Nguyen, Khoa Huynh Minh and Tran, Kien Vi and Chau, Thi-Tuyet-Trang},
  title     = {{AEGIS}: Adaptive Evidence-Grounded Interactive Search for Timed Video Retrieval},
  booktitle = {MultiMedia Modeling (MMM 2027)},
  series    = {Lecture Notes in Computer Science},
  publisher = {Springer Nature},
  year      = {2027},
  note      = {Video Browser Showdown (VBS 2027) Extended Demo}
}`}
          </pre>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line text-xs text-muted py-10 bg-paper">
        <div className="shell max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <strong className="text-ink block">AEGIS · Team TGLTW-RMIT · Video Browser Showdown 2027</strong>
            <span className="text-slate-400 text-[11px]">School of Science, Engineering and Technology · RMIT University Vietnam</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <a className="hover:text-blue inline-flex items-center gap-1" href={VBS_REPO} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight className="size-3" />
            </a>
            <a className="hover:text-blue inline-flex items-center gap-1" href={PROJECT_REPO} target="_blank" rel="noreferrer">
              Project Page <ExternalLink className="size-3" />
            </a>
            <a className="hover:text-blue inline-flex items-center gap-1" href={PAPER_SOURCE} target="_blank" rel="noreferrer">
              Paper Source <ArrowUpRight className="size-3" />
            </a>
            <a className="hover:text-blue inline-flex items-center gap-1" href="https://videobrowsershowdown.org/" target="_blank" rel="noreferrer">
              VBS <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default App
