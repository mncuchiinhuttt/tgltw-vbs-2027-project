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
    <div className="site-frame">
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="brand" href="#top" aria-label="AEGIS home">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>AEGIS</span>
          </a>

          <nav className="main-nav" aria-label="Primary navigation">
            <a href="#abstract">Abstract</a>
            <a href="#system-flow">System Flow</a>
            <a href="#performance">Performance</a>
            <a href="#pillars">Architecture</a>
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
                <span>Accepted to MultiMedia Modeling (MMM 2027) · Video Browser Showdown Extended Demo</span>
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
                        {author.equalContrib && "*"}
                        {author.corresponding && "†"}
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
                <div className="author-note">* Equal contribution &nbsp;&nbsp; † Corresponding author</div>
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

        <section id="system-flow" className="section-anchor flow-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="eyebrow">SYSTEM ARCHITECTURE</span>
              <h2>AEGIS Live Interactive Architecture Overview</h2>
              <p>VBS 2027 Competition System Architecture &amp; Execution Pipeline</p>
            </div>

            {/* Interactive Archify Architecture Diagram */}
            <div className="architecture-diagram-container reveal mb-10">
              <div className="diagram-card border border-slate-800 rounded-2xl overflow-hidden bg-[#0A0F1A] shadow-2xl">
                <div className="diagram-header px-4 py-2.5 bg-[#090D16] border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rmit-red animate-pulse" />
                    <span className="font-mono text-xs font-bold text-slate-200">INTERACTIVE TOPOLOGY DIAGRAM</span>
                  </div>
                  <a
                    href="/aegis-architecture.html"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                  >
                    <span>Open Fullscreen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="w-full h-[580px] bg-[#070A11]">
                  <iframe
                    src="/aegis-architecture.html"
                    title="AEGIS Architecture Diagram"
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
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
                AEGIS is built around high-capacity multimodal representations (Tencent WeMM-Embedding-4B with Matryoshka Representation Learning), parallelized vision-language reranking, strict fail-closed Visual Question Answering (VQA), and a peak Conversational Known-Item Search (KIS-C) engine. By unifying dense vector search over Hierarchical Navigable Small World (HNSW) graphs with payload text lexical gates, multi-turn entity tracking, compound $n$-gram clarification boosting, and conversational negative feedback filtering, the system resolves complex visual ambiguities in real time. Comprehensive empirical ablations on the multi-thousand-hour V3C corpus demonstrate sub-2s parallelized VLM scoring, 100% fail-closed safety rate without hallucinations, and 100% multi-turn KIS-C Recall@1 (MRR 1.000).
              </p>
            </article>
          </div>
        </section>

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
              <h2>Experimental Performance</h2>
            </div>
            <div className="paper-panel performance-panel reveal">
              <div className="panel-heading-row">
                <h3>Ablation Studies on Multi-Thousand-Hour V3C Archive</h3>
                <span className="status-chip">100% Grounded Telemetry</span>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Pipeline Component / Axis</th>
                      <th>Baseline Setting</th>
                      <th>AEGIS (TGLTW-RMIT)</th>
                      <th>Scientific Lift</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Multimodal 4-Way RRF Fusion</td>
                      <td>Dense-only: R@5 = 50.0%</td>
                      <td>Full RRF: R@5 = 100.0%, MRR = 0.885</td>
                      <td>+50.0% Recall@5</td>
                    </tr>
                    <tr>
                      <td>Conversational KIS-C Multi-turn</td>
                      <td>Turn 1: R@1 = 0.0%, Amb = 0.82</td>
                      <td>Turn 2: R@1 = 100.0%, MRR = 1.000</td>
                      <td>Rank #1 Convergence</td>
                    </tr>
                    <tr>
                      <td>Grounded VQA &amp; Fail-Closed</td>
                      <td>Ungrounded VLM: 38.0% Hallucination</td>
                      <td>Fail-Closed Contract: 0.0% Error</td>
                      <td>100% Safe Refusal</td>
                    </tr>
                    <tr>
                      <td>Multi-threaded VLM Concurrency</td>
                      <td>Sequential (N=1): 14.85s</td>
                      <td>Parallel ThreadPool (N=8): 1.85s</td>
                      <td>8.03x Speedup</td>
                    </tr>
                    <tr>
                      <td>Budgeted Precision Ladder</td>
                      <td>Exact Brute-Force: 118.5ms</td>
                      <td>Fast HNSW (ef=64): 12.4ms (97.8% R)</td>
                      <td>10x Lower Latency</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="section-anchor content-section news-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="eyebrow">RESEARCH LOG</span>
              <h2>Latest Research &amp; System News</h2>
              <p>Chronological Log</p>
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
  author    = {Vo, Long Minh and Vu, Hung Gia and Tran, Danh Kim and Nguyen, Khoa Huynh Minh and Tran, Kien Vi and Chau, Thi-Tuyet-Trang},
  title     = {{AEGIS}: Adaptive Evidence-Grounded Interactive Search for Timed Video Retrieval},
  booktitle = {MultiMedia Modeling (MMM 2027)},
  series    = {Lecture Notes in Computer Science},
  publisher = {Springer Nature},
  year      = {2027},
  note      = {Video Browser Showdown (VBS 2027) Extended Demo}
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
