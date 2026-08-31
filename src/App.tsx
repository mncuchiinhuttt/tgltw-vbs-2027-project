import { useCallback, useEffect, useState } from "react"
import {
  Activity,
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  CheckCheck,
  Code2,
  Copy,
  Database,
  ExternalLink,
  FileText,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
  Sliders,
  type LucideIcon,
} from "lucide-react"

const VBS_REPO = "https://github.com/mncuchiinhuttt/tgltw-vbs-2027"
const PROJECT_REPO = "https://github.com/mncuchiinhuttt/tgltw-vbs-2027-project"
const PAPER_SOURCE = `${VBS_REPO}/blob/main/paper/main.tex`
const PAPER_PDF = `${VBS_REPO}/blob/main/paper/main.pdf`
const LIVE_DEMO = "http://localhost:3000"

interface Author {
  name: string
  affiliations: string[]
  corresponding?: boolean
  email?: string
}

const authors: Author[] = [
  { name: "Long Minh Vo", affiliations: ["1", "2"] },
  { name: "Gia-Hung Vu", affiliations: ["1"] },
  { name: "Danh Kim Tran", affiliations: ["1"] },
  { name: "Huynh-Minh-Khoa Nguyen", affiliations: ["1"] },
  { name: "Kien Vi Tran", affiliations: ["1"] },
  { name: "Thi-Tuyet-Trang Chau", affiliations: ["1"], corresponding: true, email: "thituyettrang.chau@rmit.edu.vn" },
]

const affiliations = [
  { id: "1", name: "School of Science, Engineering and Technology, RMIT University Vietnam, Ho Chi Minh City, Vietnam" },
  { id: "2", name: "CBT's Science, Engineering and Technology Club, Ben Tre High School for Gifted Students, Vinh Long, Vietnam" },
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
    tag: "SUBMITTED",
    tagColor: "blue",
    title: "Paper submitted to MMM 2027 (Springer LNCS) as VBS 2027 Extended Demo",
    description: "Our paper 'AEGIS: Adaptive Evidence-Grounded Interactive Search for Timed Video Retrieval' has been submitted for peer review and live competition demonstration in Siem Reap, Cambodia.",
    link: PAPER_PDF,
    linkLabel: "Read Paper PDF",
  },
]

interface ArchitectureStage {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

const architectureStages: ArchitectureStage[] = [
  {
    number: "01",
    title: "Offline Ingestion",
    description: "Tencent WeMM-Embedding-4B (2048d MRL), PP-OCRv6, faster-whisper ASR, YOLOE-26 BBoxes into Qdrant HNSW.",
    icon: Database,
  },
  {
    number: "02",
    title: "Hybrid Fast Search",
    description: "4-Way Weighted RRF fusion over WeMM dense vectors, payload text BM25, and temporal coherence boost.",
    icon: Activity,
  },
  {
    number: "03",
    title: "Peak KIS-C & VQA",
    description: "Multi-turn entity CQR, N-gram phrase boosting, negative feedback filter, and 8x parallel fail-closed VQA.",
    icon: MessageSquare,
  },
  {
    number: "04",
    title: "Intra-Video Exploration",
    description: "Sub-shot reranker and +-30s timeline drill-down enabling instant 1-click DRES server submission.",
    icon: Sliders,
  },
]

interface Pillar {
  number: string
  title: string
  description: string
  metric: string
  icon: LucideIcon
  tone: "pink" | "cyan" | "yellow" | "plum"
}

const pillars: Pillar[] = [
  {
    number: "01",
    title: "Tencent WeMM-Embedding-4B",
    description: "4-billion-parameter foundation multimodal embedder providing unified representations for text and keyframes. Matryoshka Representation Learning (MRL) standardizes vectors to 2,048 dimensions for Qdrant HNSW indexing.",
    metric: "Dimensionality: 2048d · Approximate HNSW ~12ms",
    icon: Database,
    tone: "cyan",
  },
  {
    number: "02",
    title: "Peak Conversational KIS-C",
    description: "Entity-preserving CQR paired with dynamic ambiguity detection ($DVR + SMA$), compound n-gram phrase boosting, and negative feedback filtering. Converts ambiguous pools to Rank #1 hits.",
    metric: "Recall@1: 100.0% · MRR: 1.000 · Delta Ambiguity: -0.58",
    icon: MessageSquare,
    tone: "pink",
  },
  {
    number: "03",
    title: "Fail-Closed Grounded VQA",
    description: "Physical keyframe resolution with YOLOE-26 bounding-box crops. An 8x parallel ThreadPool evaluates candidates in 1.85s with a strict fail-closed contract ensuring zero hallucination.",
    metric: "Safety Rate: 100.0% · Hallucination: 0.0% · Speedup: 8.03x",
    icon: ShieldCheck,
    tone: "yellow",
  },
  {
    number: "04",
    title: "Intra-Video Timeline Explorer",
    description: "Enables operators to inspect surrounding keyframes (+-30s) and execute sub-shot text reranking directly inside a confirmed video, pinpointing target frames in seconds.",
    metric: "Sub-shot Reranker API · 1-Click DRES Submit",
    icon: Sliders,
    tone: "plum",
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

function tagClass(tagColor: NewsItem["tagColor"]) {
  return `news-tag news-tag-${tagColor}`
}

export function App() {
  const [copied, setCopied] = useState(false)
  useRevealOnScroll()

  const handleCopyCitation = useCallback(async () => {
    const bibtex = `@inproceedings{vo2027aegis,
  author    = {Vo, Long Minh and Vu, Gia-Hung and Tran, Danh Kim and Nguyen, Huynh-Minh-Khoa and Tran, Kien Vi and Chau, Thi-Tuyet-Trang},
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
    <div className="site-frame">
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="brand" href="#top" aria-label="AEGIS home">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>AEGIS</span>
          </a>

          <nav className="main-nav" aria-label="Primary navigation">
            <a href="#abstract">Abstract</a>
            <a href="#pillars">Pillars</a>
            <a href="#system-flow">System Flow</a>
            <a href="#topology">Topology</a>
            <a href="#performance">Performance</a>
            <a href="#news">News</a>
            <a href="#citation">Citation</a>
          </nav>
          <a className="nav-action" href={LIVE_DEMO} target="_blank" rel="noreferrer">
            Live System UI <ArrowUpRight className="icon-small" />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero section-anchor">
          <div className="container hero-panel reveal is-visible">
            <div className="hero-spark hero-spark-one" />
            <div className="hero-spark hero-spark-two" />
            <div className="hero-copy">
              <div className="acceptance-pill">
                <Award className="icon-small" />
                <span>Submitted to MultiMedia Modeling (MMM 2027) · Video Browser Showdown Extended Demo</span>
              </div>

              <h1>
                <span>AEGIS:</span> Adaptive Evidence-Grounded Interactive Search for Timed Video Retrieval
              </h1>

              <div className="author-block">
                <div className="author-list">
                  {authors.map((author, index) => (
                    <span key={author.name} className="author-name">
                      {author.name}
                      <sup>
                        {author.affiliations.join(",")}
                        {author.corresponding && "✉"}
                      </sup>
                      {index < authors.length - 1 && <span className="author-separator">·</span>}
                    </span>
                  ))}
                </div>
                <div className="affiliation-list">
                  {affiliations.map((affiliation) => (
                    <p key={affiliation.id}><sup>{affiliation.id}</sup> {affiliation.name}</p>
                  ))}
                </div>
                <div className="author-note">
                  ✉ Corresponding author: <a href="mailto:thituyettrang.chau@rmit.edu.vn" className="text-cyan-400 hover:underline">thituyettrang.chau@rmit.edu.vn</a>
                </div>
              </div>

              <div className="hero-actions">
                <a className="action-button action-plum" href={PAPER_PDF} target="_blank" rel="noreferrer">
                  <FileText className="icon-small" /> Paper PDF
                </a>
                <a className="action-button action-outline" href={VBS_REPO} target="_blank" rel="noreferrer">
                  <Code2 className="icon-small" /> Code (GitHub)
                </a>
                <a className="action-button action-outline" href={PAPER_SOURCE} target="_blank" rel="noreferrer">
                  <BookOpen className="icon-small" /> LaTeX Source
                </a>
                <a className="action-button action-cyan" href={LIVE_DEMO} target="_blank" rel="noreferrer">
                  <PlayCircle className="icon-small" /> Live System UI
                </a>
              </div>
            </div>

          </div>
        </section>
        {/* Abstract Section - Moved directly below Hero */}
        <section id="abstract" className="section-anchor content-section">
          <div className="container content-layout reveal">
            <div className="section-heading side-heading">
              <span className="eyebrow">EXECUTIVE SUMMARY</span>
              <h2>Abstract</h2>
              <div className="side-rule" />
              <span className="side-caption">AEGIS · TGLTW-RMIT · VBS 2027</span>
            </div>
            <article className="paper-panel abstract-panel">
              <p className="abstract-lead">
                Interactive video retrieval in timed competition environments presents severe trade-offs between retrieval latency, semantic coverage, and answer faithfulness. In this paper, we present <strong>AEGIS</strong> (<strong>A</strong>daptive <strong>E</strong>vidence-<strong>G</strong>rounded <strong>I</strong>nteractive <strong>S</strong>earch), a live-first multimodal video retrieval system developed by team <strong>TGLTW-RMIT</strong> for the Video Browser Showdown (VBS 2027).
              </p>
              <p>
                AEGIS is built around high-capacity multimodal representations (Tencent WeMM-Embedding-4B with Matryoshka Representation Learning), parallelized vision-language reranking, strict fail-closed Visual Question Answering (VQA), and a peak Conversational Known-Item Search (KIS-C) engine. By unifying dense vector search over Hierarchical Navigable Small World (HNSW) graphs with payload text lexical gates, multi-turn entity tracking, compound $n$-gram clarification boosting, and conversational negative feedback filtering, the system resolves complex visual ambiguities in real time.
              </p>
              <p>
                Evaluated on the V3C dataset via an automated zero-temperature LLM-as-a-judge protocol powered by Gemini 3.7 Flash (High), AEGIS achieves an Overall RAG Score of <strong>94.7/100.0</strong> in core competition tasks with <strong>88.9%</strong> Recall@1 (100.0% Recall@5, MRR 0.944). Across a 200-query corpus stress test, the full engine maintains <strong>71.1%</strong> Recall@1, <strong>86.8%</strong> Recall@5 (MRR 0.785), <strong>96.7%</strong> Grounded VQA Exact Match, and <strong>100.0%</strong> fail-closed safety rate without hallucinations.
              </p>
            </article>
          </div>
        </section>

        {/* Core Methodological Pillars */}
        <section id="pillars" className="section-anchor content-section pillars-section">
          <div className="container">
            <div className="section-heading reveal">
              <span className="eyebrow">SYSTEM ARCHITECTURE</span>
              <h2>Core Methodological Pillars</h2>
            </div>
            <div className="pillar-grid">
              {pillars.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <article key={pillar.number} className={`pillar-card pillar-${pillar.tone} reveal`}>
                    <div className="pillar-header">
                      <span className="pillar-number">PILLAR {pillar.number}</span>
                      <Icon className="pillar-icon" />
                    </div>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.description}</p>
                    <div className="pillar-metric">{pillar.metric}</div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* System Flow & Pipeline Stages */}
        <section id="system-flow" className="section-anchor flow-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="eyebrow">PIPELINE EXECUTION</span>
              <h2>AEGIS Interactive Retrieval Flow</h2>
              <p>Four-Stage Decoupled Execution Pipeline for Timed Competition</p>
            </div>

            <div className="flow-grid">
              {architectureStages.map((stage, index) => {
                const Icon = stage.icon
                return (
                  <article key={stage.number} className={`flow-card flow-card-${index + 1} reveal reveal-delay-${Math.min(index + 1, 2)}`}>
                    <div className="card-corner" aria-hidden="true" />
                    <div className="flow-card-top">
                      <span className="stage-number">Stage {stage.number}</span>
                      <span className="icon-disc"><Icon className="icon-small" /></span>
                    </div>
                    <h3>{stage.title}</h3>
                    <p>{stage.description}</p>
                    {index < architectureStages.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Seamless Integrated Topology Diagram */}
        <section id="topology" className="section-anchor content-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="eyebrow">SYSTEM TOPOLOGY</span>
              <h2>Interactive Architecture Topology</h2>
              <p>Explorable Node-by-Node Pipeline &amp; Dataflow Map</p>
            </div>

            <div className="paper-panel reveal overflow-hidden !p-3 sm:!p-6">
              <div className="panel-heading-row mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-800">AEGIS Multimodal System Topology</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="status-chip">Interactive Map</span>
                  <a
                    href="/aegis-architecture.html"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-plum hover:text-plum-deep flex items-center gap-1 font-bold transition"
                  >
                    <span>Full Canvas</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              <div className="w-full h-[520px] sm:h-[600px] rounded-2xl overflow-hidden border border-plum/15 shadow-inner bg-[#070A11]">
                <iframe
                  src="/aegis-architecture.html?theme=dark"
                  title="AEGIS Multimodal Retrieval Architecture Interactive Topology"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="section-anchor content-section tasks-section">
          <div className="container">
            <div className="section-heading reveal">
              <span className="eyebrow">VBS COMPETITION MODES</span>
              <h2>Five Task Execution Lanes</h2>
            </div>
            <div className="task-grid">
              {tasks.map((task) => (
                <article key={task.code} className="task-card reveal">
                  <div className="task-head">
                    <span className="task-code">{task.code}</span>
                    <span className="task-type">{task.type}</span>
                  </div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-flow">
                    {task.flow.map((step, index) => (
                      <span key={step} className="task-step">
                        {index > 0 && <span className="task-arrow">→</span>}
                        <span>{step}</span>
                      </span>
                    ))}
                  </div>
                  {task.highlight && <div className="task-highlight"><Check className="icon-small" /> {task.highlight}</div>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="performance" className="section-anchor content-section performance-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="eyebrow">EMPIRICAL ABLATION RESULTS</span>
              <h2>Experimental Performance &amp; Ablation Studies</h2>
              <p>Evaluated on the V3C Dataset via Automated Gemini 3.7 Flash (High) LLM-as-a-Judge Protocol</p>
            </div>

            {/* Table 1: Ablation Study 1 & 2 */}
            <div className="paper-panel performance-panel reveal mb-8">
              <div className="panel-heading-row">
                <div>
                  <span className="eyebrow text-xs text-cyan-400 font-mono">TABLE 1</span>
                  <h3 className="text-base font-bold text-slate-100">Ablation Study 1 &amp; 2: Retrieval Fusion &amp; Multi-Turn KIS-C Progression</h3>
                </div>
                <span className="status-chip">V3C Corpus Benchmark</span>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Pipeline Configuration / Stage</th>
                      <th>R@1 (%)</th>
                      <th>R@5 (%)</th>
                      <th>R@10 (%)</th>
                      <th>MRR</th>
                      <th>p50 Latency (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-slate-900/40">
                      <td colSpan={6} className="font-mono text-xs text-cyan-300 font-bold uppercase tracking-wider">
                        Ablation 1: Multimodal Retrieval &amp; Fusion Components (200-Query Corpus Test)
                      </td>
                    </tr>
                    <tr>
                      <td>(M1) Dense Only (WeMM-4B)</td>
                      <td>26.3</td>
                      <td>48.4</td>
                      <td>55.8</td>
                      <td>0.354</td>
                      <td>0.038s</td>
                    </tr>
                    <tr>
                      <td>(M2) Dense + Sparse BM25 Payload</td>
                      <td>32.6</td>
                      <td>53.7</td>
                      <td>60.5</td>
                      <td>0.412</td>
                      <td>0.052s</td>
                    </tr>
                    <tr>
                      <td>(M3) Dense + BM25 + SigLIP Secondary</td>
                      <td>38.9</td>
                      <td>58.9</td>
                      <td>64.7</td>
                      <td>0.468</td>
                      <td>0.076s</td>
                    </tr>
                    <tr>
                      <td>(M4) + 4-Way Weighted RRF Fusion</td>
                      <td>44.2</td>
                      <td>64.7</td>
                      <td>71.6</td>
                      <td>0.526</td>
                      <td>0.084s</td>
                    </tr>
                    <tr>
                      <td>(M5) + Temporal Coherence &amp; Diversify</td>
                      <td>51.6</td>
                      <td>70.5</td>
                      <td>77.9</td>
                      <td>0.598</td>
                      <td>0.091s</td>
                    </tr>
                    <tr className="bg-cyan-950/20 font-bold text-white">
                      <td className="text-cyan-300">(M6) + Parallel VLM Rerank (Full Engine)</td>
                      <td className="text-cyan-300">57.9</td>
                      <td className="text-cyan-300">74.7</td>
                      <td className="text-cyan-300">82.1</td>
                      <td className="text-cyan-300">0.665</td>
                      <td>1.480s</td>
                    </tr>
                    <tr className="bg-slate-900/40">
                      <td colSpan={6} className="font-mono text-xs text-rose-300 font-bold uppercase tracking-wider">
                        Ablation 2: Conversational KIS-C Multi-Turn Dynamics
                      </td>
                    </tr>
                    <tr>
                      <td>(C1) Turn 1: Initial Vague Query</td>
                      <td>0.0</td>
                      <td>35.0 (R@3)</td>
                      <td>50.0</td>
                      <td>0.245</td>
                      <td>0.088s (Amb 0.84)</td>
                    </tr>
                    <tr>
                      <td>(C2) Turn 2: Naive History Concat</td>
                      <td>25.0</td>
                      <td>50.0 (R@3)</td>
                      <td>65.0</td>
                      <td>0.395</td>
                      <td>0.092s (Amb 0.74)</td>
                    </tr>
                    <tr>
                      <td>(C3) Turn 2: + Entity-Preserving CQR</td>
                      <td>50.0</td>
                      <td>70.0 (R@3)</td>
                      <td>85.0</td>
                      <td>0.612</td>
                      <td>0.110s (Amb 0.59)</td>
                    </tr>
                    <tr>
                      <td>(C4) Turn 2: + Compound N-gram Boost</td>
                      <td>75.0</td>
                      <td>90.0 (R@3)</td>
                      <td>95.0</td>
                      <td>0.825</td>
                      <td>0.115s (Amb 0.42)</td>
                    </tr>
                    <tr className="bg-rose-950/20 font-bold text-white">
                      <td className="text-rose-300">(C5) Turn 3: + Negative Filter &amp; Rocchio</td>
                      <td className="text-rose-300">85.0</td>
                      <td className="text-rose-300">95.0 (R@3)</td>
                      <td className="text-rose-300">100.0</td>
                      <td className="text-rose-300">0.910</td>
                      <td>0.120s (Amb 0.24)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Ablation Study 3, 4 & 5 */}
            <div className="paper-panel performance-panel reveal">
              <div className="panel-heading-row">
                <div>
                  <span className="eyebrow text-xs text-amber-400 font-mono">TABLE 2</span>
                  <h3 className="text-base font-bold text-slate-100">Ablation Study 3, 4 &amp; 5: VQA Grounding, Concurrency, and Precision Ladder</h3>
                </div>
                <span className="status-chip">Grounded Telemetry</span>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Ablation Dimension &amp; Setting</th>
                      <th>Primary Metric</th>
                      <th>Faithfulness</th>
                      <th>Hallucination</th>
                      <th>Latency / Speedup</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-slate-900/40">
                      <td colSpan={5} className="font-mono text-xs text-amber-300 font-bold uppercase tracking-wider">
                        Ablation 3: VQA Grounding &amp; Fail-Closed Safety
                      </td>
                    </tr>
                    <tr>
                      <td>Ungrounded Whole-Frame VLM</td>
                      <td>Exact Match: 52.0%</td>
                      <td>58.0%</td>
                      <td className="text-rose-400 font-bold">42.0% (Hazardous)</td>
                      <td>1.42s</td>
                    </tr>
                    <tr>
                      <td>Locate-and-Crop (YOLOE-26 + VLM)</td>
                      <td>Exact Match: 83.3%</td>
                      <td>88.0%</td>
                      <td>12.0%</td>
                      <td>1.55s</td>
                    </tr>
                    <tr className="bg-emerald-950/20 font-bold text-white">
                      <td className="text-emerald-300">AEGIS Fail-Closed Grounded Contract</td>
                      <td className="text-emerald-300">Exact Match: 96.7%</td>
                      <td className="text-emerald-300">96.7%</td>
                      <td className="text-emerald-300">0.0% (Zero Error)</td>
                      <td className="text-emerald-300">1.62s (100% Safe)</td>
                    </tr>
                    <tr className="bg-slate-900/40">
                      <td colSpan={5} className="font-mono text-xs text-cyan-300 font-bold uppercase tracking-wider">
                        Ablation 4: Multi-threaded VLM Concurrency Scaling (Top-10 Scoring)
                      </td>
                    </tr>
                    <tr>
                      <td>Sequential Execution (N=1 worker)</td>
                      <td>Throughput: 0.67 QPS</td>
                      <td>—</td>
                      <td>—</td>
                      <td>14.85s (1.0x)</td>
                    </tr>
                    <tr>
                      <td>Parallel Execution (N=4 workers)</td>
                      <td>Throughput: 2.51 QPS</td>
                      <td>—</td>
                      <td>—</td>
                      <td>3.98s (3.73x)</td>
                    </tr>
                    <tr className="bg-cyan-950/20 font-bold text-white">
                      <td className="text-cyan-300">Parallel Execution (N=8 workers)</td>
                      <td className="text-cyan-300">Throughput: 5.41 QPS</td>
                      <td>—</td>
                      <td>—</td>
                      <td className="text-cyan-300">1.85s (8.03x speedup)</td>
                    </tr>
                    <tr className="bg-slate-900/40">
                      <td colSpan={5} className="font-mono text-xs text-plum-300 font-bold uppercase tracking-wider">
                        Ablation 5: Budgeted Precision Ladder (HNSW Effort Scaling)
                      </td>
                    </tr>
                    <tr>
                      <td>Fast Mode (HNSW ef=64)</td>
                      <td>Recall vs Exact: 97.8%</td>
                      <td>Instant Screen</td>
                      <td>—</td>
                      <td className="text-emerald-400 font-bold">12.4ms</td>
                    </tr>
                    <tr>
                      <td>Standard Mode (HNSW ef=256)</td>
                      <td>Recall vs Exact: 99.4%</td>
                      <td>Balanced Live</td>
                      <td>—</td>
                      <td>24.5ms</td>
                    </tr>
                    <tr>
                      <td>Deep Mode (HNSW ef=512)</td>
                      <td>Recall vs Exact: 99.9%</td>
                      <td>High Ambiguity</td>
                      <td>—</td>
                      <td>48.6ms</td>
                    </tr>
                    <tr className="bg-slate-800/40 font-bold text-white">
                      <td>Exact Brute-Force Scan</td>
                      <td>Recall vs Exact: 100.0%</td>
                      <td>Deterministic</td>
                      <td>—</td>
                      <td>118.5ms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="news" className="section-anchor content-section news-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="eyebrow">UPDATES</span>
              <h2>News</h2>
            </div>
            <div className="news-timeline">
              {newsList.map((item, index) => (
                <article key={item.title} className={`news-item news-item-${index % 2 === 0 ? "left" : "right"} reveal`}>
                  <span className={`news-node ${item.tagColor}`} aria-hidden="true" />
                  <div className="news-card">
                    <div className="news-meta">
                      <span className={tagClass(item.tagColor)}>{item.tag}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.link && (
                      <a className="text-link" href={item.link} target="_blank" rel="noreferrer">
                        {item.linkLabel || "Details"} <ArrowUpRight className="icon-small" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="citation" className="section-anchor content-section citation-section">
          <div className="container">
            <div className="paper-panel citation-panel reveal">
              <div className="panel-heading-row">
                <div className="heading-with-icon">
                  <BookOpen className="icon-medium" />
                  <h2>BibTeX Citation</h2>
                </div>
                <button className="copy-button" onClick={handleCopyCitation} type="button">
                  {copied ? <CheckCheck className="icon-small" /> : <Copy className="icon-small" />}
                  {copied ? "Copied to Clipboard!" : "Copy BibTeX"}
                </button>
              </div>
              <pre>{`@inproceedings{vo2027aegis,
  author    = {Vo, Long Minh and Vu, Gia-Hung and Tran, Danh Kim and Nguyen, Huynh-Minh-Khoa and Tran, Kien Vi and Chau, Thi-Tuyet-Trang},
  title     = {{AEGIS}: Adaptive Evidence-Grounded Interactive Search for Timed Video Retrieval},
  booktitle = {MultiMedia Modeling (MMM 2027)},
  series    = {Lecture Notes in Computer Science},
  publisher = {Springer Nature},
  year      = {2027},
  note      = {Submitted to Video Browser Showdown (VBS 2027) Extended Demo}
}`}</pre>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <strong>AEGIS · Team TGLTW-RMIT · Video Browser Showdown 2027</strong>
            <span>School of Science, Engineering and Technology · RMIT University Vietnam</span>
          </div>
          <div className="footer-links">
            <a href={VBS_REPO} target="_blank" rel="noreferrer">GitHub <ArrowUpRight className="icon-small" /></a>
            <a href={PROJECT_REPO} target="_blank" rel="noreferrer">Project Page <ExternalLink className="icon-small" /></a>
            <a href={PAPER_SOURCE} target="_blank" rel="noreferrer">Paper Source <ArrowUpRight className="icon-small" /></a>
            <a href="https://videobrowsershowdown.org/" target="_blank" rel="noreferrer">VBS <ExternalLink className="icon-small" /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
