import { useCallback, useEffect, useState, type AnimationEvent as ReactAnimationEvent, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react"
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  CheckCheck,
  Copy,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  Film,
  Layers,
  MessageSquare,
  Search,
  ShieldCheck,
  Sliders,
  type LucideIcon,
} from "lucide-react"
import { GitHubIcon } from "./components/github-icon"

const SHOW_BIBTEX_CITATION = false
const SOURCE_REPOSITORY_URL = "https://github.com/mncuchiinhuttt/aegis-vbs-2027"

interface Author {
  name: string
  affiliations: string[]
  corresponding?: boolean
  email?: string
}

const authors: Author[] = [
  { name: "Long Minh Vo", affiliations: ["1", "2"], corresponding: true, email: "long.vo.minh@rmit.edu.vn" },
  { name: "Gia-Hung Vu", affiliations: ["1"] },
  { name: "Danh Kim Tran", affiliations: ["1"] },
  { name: "Huynh-Minh-Khoa Nguyen", affiliations: ["1"] },
  { name: "Kien Vi Tran", affiliations: ["1"] },
  { name: "Thi-Tuyet-Trang Chau", affiliations: ["1"] },
]

const affiliations = [
  { id: "1", name: "School of Science, Engineering and Technology (SSET), RMIT University Vietnam, Ho Chi Minh City, Vietnam" },
  { id: "2", name: "CBT's Science, Engineering and Technology Club (CSET), Ben Tre High School for Gifted Students, Vinh Long Province, Vietnam" },
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
    date: "19 OCT 2026",
    tag: "ACCEPTED",
    tagColor: "emerald",
    title: "Paper accepted to MMM 2027 (Springer LNCS) / VBS 2027",
    description: "Our paper 'AEGIS: Adaptive, Evidence-Grounded Interactive Search for Video Moment Retrieval' has been accepted for publication in Springer LNCS and demonstration at the Video Browser Showdown 2027 in Siem Reap, Cambodia.",
    link: "#",
    linkLabel: "Camera-ready / arXiv pending",
  },
  {
    date: "21 SEP 2026",
    tag: "SUBMITTED",
    tagColor: "blue",
    title: "Paper submitted to MMM 2027 (Springer LNCS) as VBS 2027 Extended Demo",
    description: "Our paper 'Adaptive, Evidence-Grounded Interactive Search for Video Moment Retrieval' has been submitted for peer review and live competition demonstration in Siem Reap, Cambodia.",
    link: "#",
    linkLabel: "Camera-ready / arXiv pending",
  },
  {
    date: "14 SEP 2026",
    tag: "ARCHIVE",
    tagColor: "amber",
    title: "Archived retrieval diagnostic (historical scope only)",
    description: "Earlier retrieval diagnostic only: Recall@1 70.4%, Recall@5 76.0%, and MRR 0.7289. The linked archive documents source provenance and limitations; these values do not validate the current pipeline, whose production evaluation is unmeasured.",
    link: "/artifacts/archived-retrieval-diagnostics.json",
    linkLabel: "Archived data and limitations",
  },
  {
    date: "15 MAY 2026",
    tag: "FORMATION",
    tagColor: "emerald",
    title: "Team The Gays Lead The World (TGLTW) RMIT officially formed",
    description: "Research team TGLTW-RMIT established at RMIT University Vietnam to develop next-generation multimodal video retrieval architectures for international benchmarks and competitions.",
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
    description: "Tencent WeMM native embeddings with checkpoint-supported optional MRL, plus OCR/ASR and configured visual processing, indexed in Qdrant.",
    icon: Database,
  },
  {
    number: "02",
    title: "Hybrid Retrieval",
    description: "Weighted nested RRF combines dense retrieval with Qdrant MatchText over text_blob; weights default to uniform and SigLIP is optional.",
    icon: Search,
  },
  {
    number: "03",
    title: "KIS-C & Evidence-Linked VQA",
    description: "Conversational query handling and bounded parallel VQA for API clients that declare concurrency support; other clients run serially.",
    icon: MessageSquare,
  },
  {
    number: "04",
    title: "Intra-Video Exploration",
    description: "Intra-video browsing and refinement for inspecting candidate moments; current timing and retrieval outcomes are unmeasured.",
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
    description: "Tencent WeMM-Embedding-4B uses its native output dimensions; MRL truncation is limited to dimensions supported by the configured checkpoint.",
    metric: "Current retrieval latency: not measured",
    icon: Database,
    tone: "cyan",
  },
  {
    number: "02",
    title: "Conversational KIS-C",
    description: "Entity-preserving conversational query handling, ambiguity checks, phrase clarification, and negative feedback support interactive search; current task-family results are unmeasured.",
    metric: "Current benchmark results: not measured",
    icon: MessageSquare,
    tone: "pink",
  },
  {
    number: "03",
    title: "Fail-Closed Grounded VQA",
    description: "VQA responses are linked to resolved candidate-frame evidence and abstain when media or a valid grounded response is unavailable. Evidence linkage is not a guarantee of answer correctness.",
    metric: "Production VQA metrics: not measured",
    icon: ShieldCheck,
    tone: "yellow",
  },
  {
    number: "04",
    title: "Intra-Video Timeline Explorer",
    description: "Lets operators inspect neighboring keyframes and refine a search within a selected video; no current latency or precision result is reported.",
    metric: "Current timing: not measured",
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
  tone: "pink" | "plum" | "emerald" | "cyan" | "yellow"
  icon: LucideIcon
}

const tasks: TaskDefinition[] = [
  {
    code: "KIS-T",
    type: "Textual Known-Item",
    title: "Translate memory into a target frame.",
    description: "Weighted nested RRF combines WeMM dense retrieval and Qdrant MatchText over text_blob; fusion weights default to uniform, with optional SigLIP retrieval.",
    flow: ["Text Query", "WeMM Dense + MatchText", "Nested Weighted RRF", "VLM Rerank"],
    tone: "pink",
    icon: Search,
  },
  {
    code: "KIS-C",
    type: "Conversational Search",
    title: "Disambiguate visual candidate pools.",
    description: "Entity-preserving query handling, ambiguity checks, phrase clarification, and negative feedback support follow-up search.",
    flow: ["Conversation Context", "Query Handling", "Clarification", "Feedback"],
    tone: "plum",
    icon: MessageSquare,
  },
  {
    code: "VQA",
    type: "Grounded Visual QA",
    title: "Answer from linked video evidence or abstain.",
    description: "Each candidate is resolved to its media evidence; missing media or an invalid grounded response yields an abstention. Evidence linkage does not guarantee correctness.",
    flow: ["Question", "Resolved Frame", "Optional Crop", "Answer or Abstain"],
    tone: "emerald",
    icon: ShieldCheck,
  },
  {
    code: "AVS",
    type: "Ad-hoc Video Search",
    title: "Explore a diverse set of candidate moments.",
    description: "Candidate results can be diversified by scene for operator browsing; current AVS retrieval performance has not been measured.",
    flow: ["Broad Query", "Fused Candidates", "Scene Diversification", "Operator Browse"],
    tone: "cyan",
    icon: Layers,
  },
  {
    code: "KIS-V",
    type: "Visual Query Search",
    title: "Search with a visual example.",
    description: "A supplied query image can be embedded with the primary WeMM model and searched against compatible visual vectors.",
    flow: ["Query Image", "WeMM Image Embedding", "Vector Search", "Candidate Browse"],
    tone: "yellow",
    icon: Film,
  },
]





interface SuppTerm {
  term: string
  category: string
  categoryTone?: "emerald" | "plum" | "cyan"
  meaning: string
}

const suppTerms: SuppTerm[] = [
  {
    term: "WeMM-Embedding-4B",
    category: "Multimodal encoder",
    categoryTone: "cyan",
    meaning: "Tencent multimodal embedder using native output dimensions; optional MRL truncation is limited to dimensions supported by the configured checkpoint.",
  },
  {
    term: "SigLIP",
    category: "Vision–language encoder",
    categoryTone: "cyan",
    meaning: "Optional secondary visual encoder. It is used only when enabled and the indexed collection contains the matching named vectors.",
  },
  {
    term: "PP-OCRv6",
    category: "OCR system",
    categoryTone: "plum",
    meaning: "Optical character recognition pipeline that extracts on-screen text and adds it to the searchable payload.",
  },
  {
    term: "Whisper / faster-whisper",
    category: "Speech recognition",
    categoryTone: "plum",
    meaning: "Automatic speech recognition used to produce searchable transcripts from video audio.",
  },
  {
    term: "Qdrant HNSW",
    category: "Vector index",
    categoryTone: "cyan",
    meaning: "Approximate nearest-neighbor index for dense retrieval; this project reports no current HNSW timing or recall measurements.",
  },
  {
    term: "Qdrant MatchText",
    category: "Lexical matching",
    categoryTone: "plum",
    meaning: "Matches query text against the text_blob payload field. This filter does not compute BM25 scores.",
  },
  {
    term: "RRF",
    category: "Rank fusion",
    categoryTone: "plum",
    meaning: "Weighted nested Reciprocal Rank Fusion combines ranked retrieval lists. The configured weights default to uniform.",
  },
  {
    term: "CQR / HyDE",
    category: "Query expansion",
    categoryTone: "plum",
    meaning: "Contextual query rewriting preserves conversational constraints; HyDE can supply a hypothetical-description query for retrieval.",
  },
  {
    term: "MRL",
    category: "Representation technique",
    categoryTone: "cyan",
    meaning: "Matryoshka Representation Learning supports truncation only to output dimensions advertised by the configured checkpoint.",
  },
  {
    term: "Fail-closed VQA",
    category: "Safety policy",
    categoryTone: "emerald",
    meaning: "VQA links candidate answers to resolved media evidence and abstains when evidence or a valid response is unavailable; it does not guarantee factual correctness.",
  },
]

interface SuppMetric {
  metric: string
  level: string
  definition: string
  formula?: string
}

const suppMetrics: SuppMetric[] = [
  {
    metric: "Recall@k",
    level: "Query / retrieval",
    definition: "Fraction of queries whose ground-truth item appears within the first k ranked candidates. This is a metric definition, not a current result.",
  },
  {
    metric: "Mean Reciprocal Rank (MRR)",
    level: "Query / retrieval",
    definition: "Mean of the reciprocal rank of the first relevant result: MRR = (1/N) * Σ (1 / r_i). Rewards early correct candidate hits.",
    formula: "MRR = (1/N) * Σ (1 / r_i)",
  },
  {
    metric: "RRF score",
    level: "Candidate / fusion",
    definition: "Weighted reciprocal-rank fusion combines ranked lists; configured weights default to uniform.",
    formula: "RRF(d) = Σ w_m / (k + rank_m(d))",
  },
  {
    metric: "VQA Exact Match",
    level: "Answer / VQA",
    definition: "Percentage of questions for which the normalized generated answer exactly matches the reference answer string.",
  },
  {
    metric: "VQA Faithfulness",
    level: "Answer / VQA",
    definition: "Percentage of answers supported by the resolved media evidence and the requested visual content.",
  },
  {
    metric: "Hallucination Rate",
    level: "Answer / VQA",
    definition: "Fraction of answers unsupported by valid media evidence or contradicted by that evidence. No current hallucination-rate result is reported.",
  },
  {
    metric: "Ambiguity Score",
    level: "Query / KIS-C",
    definition: "Combined ambiguity signal from Distinct Video Ratio (DVR) and Score Margin Ambiguity (SMA). Lower values indicate stronger convergence.",
    formula: "A = (1 - λ) * DVR + λ * (1.0 - (s_1 - s_2)/s_1)",
  },
  {
    metric: "Ambiguity Reduction",
    level: "Query / KIS-C",
    definition: "Difference between the initial and final ambiguity scores: ΔA = A_initial - A_final. Higher reduction indicates effective disambiguation.",
    formula: "ΔA = A_initial - A_final",
  },
  {
    metric: "Latency (p50 / p95)",
    level: "System / operation",
    definition: "Median or 95th-percentile wall-clock time for the complete measured operation (milliseconds for retrieval, seconds for multi-candidate VLM).",
  },
  {
    metric: "Throughput (QPS)",
    level: "System / concurrency",
    definition: "Completed query or candidate-scoring operations per second under the stated worker count.",
  },
  {
    metric: "Recall vs. Exact",
    level: "Retrieval / precision ladder",
    definition: "Recall of an approximate HNSW mode relative to the exact brute-force ranking over the same collection snapshot.",
  },
  {
    metric: "Overall Multimodal Retrieval Score",
    level: "Benchmark / corpus",
    definition: "An aggregate score may combine declared benchmark metrics under a specified protocol. No current aggregate score is reported.",
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

  const handleSectionNavigation = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault()
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    },
    [],
  )
  const handleCopyCitation = useCallback(async () => {
    const bibtex = `@inproceedings{vo2027aegis,
  author    = {Vo, Long Minh and Vu, Gia-Hung and Tran, Danh Kim and Nguyen, Huynh-Minh-Khoa and Tran, Kien Vi and Chau, Thi-Tuyet-Trang},
  title     = {Adaptive, Evidence-Grounded Interactive Search for Video Moment Retrieval},
  booktitle = {MultiMedia Modeling (MMM 2027)},
  series    = {Lecture Notes in Computer Science},
  publisher = {Springer Nature},
  year      = {2027},
  note      = {Submitted to Video Browser Showdown (VBS 2027) Extended Demo}
}`
    try {
      await navigator.clipboard.writeText(bibtex)
    } catch {
      window.prompt("Copy BibTeX citation:", bibtex)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleAbstractPointerEnter = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const element = event.currentTarget
    if (element.classList.contains("is-scanning")) return
    element.classList.add("is-scanning")
  }, [])

  const handleAbstractAnimationEnd = useCallback((event: ReactAnimationEvent<HTMLElement>) => {
    if (event.animationName !== "abstractHorizontalScan") return
    const element = event.currentTarget
    element.classList.remove("is-scanning")
  }, [])

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  return (
    <div className="site-frame">
      <header className={`topbar-wrapper ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="topbar-container">
          <div className="topbar-inner">
            <a className="brand" href="#top" aria-label="AEGIS home" onClick={(event) => handleSectionNavigation(event, "top")}>
              <span className="brand-mark" aria-hidden="true"><span /></span>
              <span>AEGIS</span>
            </a>

            <nav className="main-nav" aria-label="Primary navigation">
              <a href="#abstract" onClick={(event) => handleSectionNavigation(event, "abstract")}>Abstract</a>
              <a href="#pillars" onClick={(event) => handleSectionNavigation(event, "pillars")}>Pillars</a>
              <a href="#system-flow" onClick={(event) => handleSectionNavigation(event, "system-flow")}>Pipeline</a>
              <a href="#topology" onClick={(event) => handleSectionNavigation(event, "topology")}>Topology</a>
              <a href="#tasks" onClick={(event) => handleSectionNavigation(event, "tasks")}>Task Modes</a>
              <a href="#performance" onClick={(event) => handleSectionNavigation(event, "performance")}>Evaluation</a>
              <a href="#supplementary" onClick={(event) => handleSectionNavigation(event, "supplementary")}>Supplementary</a>
              <a href="#news" onClick={(event) => handleSectionNavigation(event, "news")}>News</a>
            </nav>
            <div className="flex items-center gap-2">
              <span className="nav-action !cursor-default !opacity-70">
                Paper · pending
              </span>
            </div>
          </div>
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
                <span>AEGIS:</span> Adaptive, Evidence-Grounded Interactive Search for Video Moment Retrieval
              </h1>

              <div className="author-block">
                <div className="author-list">
                  {authors.map((author, index) => (
                    <span key={author.name} className="author-name">
                      {author.name}
                      <sup>{author.affiliations.join(",")}</sup>
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
                  Corresponding author: Long Minh Vo (<a href="mailto:long.vo.minh@rmit.edu.vn" className="text-plum hover:underline font-mono">long.vo.minh@rmit.edu.vn</a>)
                </div>
              </div>

              <div className="hero-actions">
                <span className="action-button action-outline !border-plum/30 !cursor-default !opacity-75">
                  <FileText className="icon-small text-plum" /> Paper · preprint pending
                </span>
                <a className="code-release-notice" href={SOURCE_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" title="View AEGIS source code on GitHub">
                  <GitHubIcon className="icon-small" /> GitHub
                </a>
              </div>
            </div>

          </div>
        </section>
        {/* Frozen paper abstract */}
        <section id="abstract" className="section-anchor content-section">
          <div className="container content-layout reveal">
            <div className="section-heading side-heading">
              <span className="eyebrow">PAPER ABSTRACT</span>
              <h2>Abstract</h2>
              <div className="side-rule" />
              <span className="side-caption">AEGIS · TGLTW-RMIT · VBS 2027</span>
            </div>
            <article
              className="paper-panel abstract-panel"
              onAnimationEnd={handleAbstractAnimationEnd}
              onPointerEnter={handleAbstractPointerEnter}
            >
              <p className="abstract-lead">
                Timed interactive video retrieval requires fast candidate exploration under penalties for false submissions. We introduce AEGIS (Adaptive Evidence-Grounded Interactive Search), an interactive video retrieval system for the Video Browser Showdown (VBS 2027).{" "}
                AEGIS combines Tencent WeMM-Embedding-4B with Qdrant HNSW indexing and weighted reciprocal rank fusion; it provides entity-aware conversational refinement, parallel VQA with abstention, and an intra-video timeline explorer.{" "}
                Its workflows retain source/frame identity and link answers to the supplied frame evidence; unavailable evidence or invalid output triggers abstention, not a guarantee of factual correctness.{" "}
                Archived outputs from a 1,000-query V3C suite provide a limited retrieval record, not end-to-end VQA measurements or official DRES scores. Their indexed-text overlap and unverified encoder/index identity limit interpretation.{" "}
                The project page (<a href="https://aegis.mncuchiinhuttt.dev/">https://aegis.mncuchiinhuttt.dev/</a>) provides supplementary specifications and will announce the public code release.
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
              <h2>AEGIS Interactive Retrieval Workflow</h2>
              <p>Four-stage overview of current system components</p>
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
          <div className="container !max-w-[1340px]">
            <div className="section-heading centered reveal">
              <span className="eyebrow">SYSTEM ARCHITECTURE</span>
              <h2>AEGIS Architecture Design Illustration</h2>
              <p>Archived conceptual topology · not a specification of current pipeline behavior or validated performance</p>
            </div>

            <div className="paper-panel reveal overflow-hidden !p-3 sm:!p-6 topology-panel-motion">
              <div className="panel-heading-row mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-plum animate-pulse" />
                  <h3 className="text-base sm:text-lg font-black text-ink">Interactive Topology Canvas</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="status-chip">Archived Design Illustration</span>
                  <a
                    href="/aegis-architecture.html"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-plum hover:text-plum-deep flex items-center gap-1 font-bold transition"
                  >
                    <span>Open Full Screen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              <div className="w-full h-[420px] sm:h-[450px] lg:h-[470px] rounded-2xl overflow-hidden border border-plum/15 shadow-inner bg-[#fff8fb]">
                <iframe
                  src="/aegis-architecture.html?theme=light&embed=1"
                  title="Archived AEGIS architecture design illustration; not a current pipeline specification"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="tasks" className="section-anchor content-section tasks-section">
          <div className="container">
            <div className="section-heading reveal">
              <span className="eyebrow">VBS COMPETITION MODES</span>
              <h2>Five Task Execution Lanes</h2>
              <p>Specialized Execution Pipelines Tailored for Each Competition Task</p>
            </div>

            <div className="task-grid-bento">
              {tasks.map((task, index) => {
                const Icon = task.icon
                const isFeatured = index < 2
                return (
                  <article
                    key={task.code}
                    className={`task-card-v2 task-card-${task.tone} ${isFeatured ? "task-card-featured" : "task-card-standard"} reveal`}
                  >
                    <div className="task-v2-header">
                      <div className="task-v2-badge-group">
                        <span className="task-v2-code">{task.code}</span>
                        <span className="task-v2-type">{task.type}</span>
                      </div>
                      <div className="task-v2-icon-disc">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="task-v2-body">
                      <h3 className="task-v2-title">{task.title}</h3>
                      <p className="task-v2-desc">{task.description}</p>
                    </div>

                    <div className="task-v2-footer">
                      <div className="task-v2-flow-label">Execution Pipeline</div>
                      <div className="task-v2-flow">
                        {task.flow.map((step, sIdx) => (
                          <span key={step} className="task-v2-step">
                            {sIdx > 0 && <span className="task-v2-arrow">→</span>}
                            <span className="task-v2-step-pill">{step}</span>
                          </span>
                        ))}
                      </div>

                    </div>
                  </article>
                )
              })}
            </div>

            {/* Qualitative Demonstrations & Operator Console Showcase */}
            <div className="demo-showcase-panel reveal">
              <div className="panel-heading-row mb-4">
                <div>
                  <span className="eyebrow text-xs text-plum font-mono">INTERFACE / DESIGN ILLUSTRATION</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">AEGIS Operator Console Concept</h3>
                </div>
                <span className="status-chip">Illustration only · no live benchmark telemetry</span>
              </div>
              <div className="demo-image-frame">
                <img
                  src="/figures/system_ui_demo.png"
                  alt="Illustrative operator-console design for VBS task workflows; not evidence of production evaluation results"
                  loading="lazy"
                />
              </div>
              <div className="demo-caption-grid">
                <div className="demo-caption-pill">
                  <strong>KIS-T:</strong> Illustrative textual-retrieval workflow; no current task score is reported.
                </div>
                <div className="demo-caption-pill">
                  <strong>KIS-C:</strong> Illustrative follow-up conversational-search workflow.
                </div>
                <div className="demo-caption-pill">
                  <strong>KIS-V:</strong> Illustrative query-by-example workflow.
                </div>
                <div className="demo-caption-pill">
                  <strong>VQA:</strong> Illustrative evidence-linked answer-or-abstain workflow; evidence linkage is not a correctness guarantee.
                </div>
                <div className="demo-caption-pill">
                  <strong>AVS:</strong> Illustrative candidate-browsing workflow; no current AVS score is reported.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="performance" className="section-anchor content-section performance-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="eyebrow">CURRENT EVALUATION STATUS</span>
              <h2>Production results are not yet measured</h2>
              <p>The current pipeline has no verified production scores. GPU evaluation is blocked by unavailable server access and the absence of a real annotation manifest.</p>
            </div>

            <div className="paper-panel performance-panel reveal">
              <div className="panel-heading-row">
                <div>
                  <span className="eyebrow text-xs text-plum font-mono">EVALUATION TOOLING</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">Model-free production VQA replay and evaluator</h3>
                </div>
                <span className="status-chip">Implemented · results not generated</span>
              </div>
              <p className="supp-desc-text">
                The replay/evaluator scores saved production VQA outcomes against a real annotation manifest without running a model. It has not produced empirical results. Current VQA accuracy, safety rate, hallucination rate, latency, ablations, baseline comparisons, and HNSW timings are unmeasured; no superiority or correctness guarantee is claimed.
              </p>
            </div>
          </div>
        </section>

        {/* Supplementary Material & Technical Appendix */}
        <section id="supplementary" className="section-anchor content-section supplementary-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="eyebrow">SUPPLEMENTARY MATERIAL</span>
              <h2>Supporting Material &amp; Evaluation Notes</h2>
              <p>Terminology and metric definitions are documented for reference. Camera-ready paper and supplementary PDFs will be released alongside the official arXiv / conference publication.</p>
            </div>

            {/* Supporting PDF callout */}
            <div className="download-banner reveal">
              <div className="download-banner-header">
                <div className="download-banner-title">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="status-chip">Preprint / publication pending</span>
                  </div>
                  <h3>
                    <FileCheck2 className="w-5 h-5 text-plum" />
                    AEGIS Supporting Material
                  </h3>
                    The camera-ready paper and supplementary documentation will be linked here once published (e.g. arXiv / conference proceedings).
                </div>
                <div className="download-banner-actions">
                  <span className="btn-download-primary !cursor-default !opacity-75">
                    <Download className="w-4 h-4" />
                    <span>Supplementary PDF · pending</span>
                  </span>
                  <span className="btn-download-secondary !cursor-default !opacity-75">
                    <FileText className="w-4 h-4" />
                    <span>Paper PDF · pending</span>
                  </span>
                </div>
              </div>

              {/* Operational Invariants */}
              <div className="invariants-grid">
                <div className="invariant-card">
                  <div className="invariant-card-title">
                    <Cpu className="w-3.5 h-3.5 text-plum" />
                    <span>Evidence linkage</span>
                  </div>
                  <p className="invariant-card-desc">
                    VQA records the resolved candidate media reference and evidence availability for inspection; this linkage does not establish answer correctness.
                  </p>
                </div>
                <div className="invariant-card">
                  <div className="invariant-card-title">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Model-free replay evaluator</span>
                  </div>
                  <p className="invariant-card-desc">
                    Saved production VQA outcomes can be replayed against a real annotation manifest without running a model; no results have been generated yet.
                  </p>
                </div>
                <div className="invariant-card">
                  <div className="invariant-card-title">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Abstention policy</span>
                  </div>
                  <p className="invariant-card-desc">
                    Missing media or an invalid response defaults to UNKNOWN; abstention is a safeguard, not a guarantee that answered questions are correct.
                  </p>
                </div>
              </div>
            </div>

            {/* Table S1: Terminology and System Techniques */}
            <div className="paper-panel performance-panel reveal mb-8">
              <div className="panel-heading-row">
                <div>
                  <span className="eyebrow text-xs text-plum font-mono">TERMINOLOGY REFERENCE</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">Terminology and Implementation Notes</h3>
                </div>
                <span className="status-chip">Method reference</span>
              </div>
              <div className="table-scroll">
                <table className="paper-table">
                  <thead>
                    <tr>
                      <th style={{ width: "240px" }}>Term / Component</th>
                      <th style={{ width: "190px" }}>Category</th>
                      <th>Meaning and Role in AEGIS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppTerms.map((item) => (
                      <tr key={item.term}>
                        <td className="font-bold text-ink">
                          <code className="supp-term-code">{item.term}</code>
                        </td>
                        <td>
                          <span className={`supp-category-pill ${item.categoryTone ? `supp-category-pill-${item.categoryTone}` : ""}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="supp-desc-text">{item.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table S2: Evaluation Metrics Reference */}
            <div className="paper-panel performance-panel reveal">
              <div className="panel-heading-row">
                <div>
                  <span className="eyebrow text-xs text-plum font-mono">METRIC DEFINITIONS</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">Evaluation Metrics Reference</h3>
                </div>
                <span className="status-chip">Definitions only · no current results</span>
              </div>
              <div className="table-scroll">
                <table className="paper-table">
                  <thead>
                    <tr>
                      <th style={{ width: "240px" }}>Evaluation Metric</th>
                      <th style={{ width: "190px" }}>Measurement Level</th>
                      <th>Formal Definition, Formula &amp; Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppMetrics.map((item) => (
                      <tr key={item.metric}>
                        <td className="font-bold text-ink">
                          <code className="supp-term-code">{item.metric}</code>
                        </td>
                        <td>
                          <span className="supp-category-pill supp-category-pill-plum">
                            {item.level}
                          </span>
                        </td>
                        <td className="supp-desc-text">
                          {item.definition}
                          {item.formula && (
                            <div className="mt-1">
                              <code className="supp-formula-code">{item.formula}</code>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
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
                  <div className="news-card news-card-motion">
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

        {SHOW_BIBTEX_CITATION && (
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
  title     = {Adaptive, Evidence-Grounded Interactive Search for Video Moment Retrieval},
  booktitle = {MultiMedia Modeling (MMM 2027)},
  series    = {Lecture Notes in Computer Science},
  publisher = {Springer Nature},
  year      = {2027},
  note      = {Submitted to Video Browser Showdown (VBS 2027) Extended Demo}
}`}</pre>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <strong>AEGIS · Team TGLTW-RMIT · Video Browser Showdown 2027</strong>
            <span>School of Science, Engineering and Technology · RMIT University Vietnam</span>
          </div>
          <div className="footer-links">
            <a href="https://aegis.mncuchiinhuttt.dev/" target="_blank" rel="noreferrer">Project Page <ExternalLink className="icon-small" /></a>
            <span className="code-release-label !text-muted">Paper PDF · pending</span>
            <a className="code-release-label" href={SOURCE_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" title="View AEGIS source code on GitHub"><GitHubIcon className="icon-small" /> GitHub</a>
            <a href="https://videobrowsershowdown.org/" target="_blank" rel="noreferrer">VBS <ExternalLink className="icon-small" /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
