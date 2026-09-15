import { useCallback, useEffect, useState, type AnimationEvent as ReactAnimationEvent, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react"
import {
  Activity,
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  CheckCheck,
  Code2,
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
  Sparkles,
  type LucideIcon,
} from "lucide-react"

const VBS_REPO = "https://github.com/mncuchiinhuttt/tgltw-vbs-2027"
const PAPER_PDF = "/paper.pdf"
const SUPP_PDF = "/supplementary_metrics.pdf"

interface Author {
  name: string
  affiliations: string[]
  corresponding?: boolean
  email?: string
}

const authors: Author[] = [
  { name: "Long Minh Vo", affiliations: ["1", "2"], corresponding: true, email: "s4215945@rmit.edu.vn" },
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
    date: "14 SEP 2026",
    tag: "BENCHMARK",
    tagColor: "emerald",
    title: "1,000-Query Benchmark & Supplementary Technical Appendix Released",
    description: "Completed comprehensive 1,000-query corpus stress test across all 5 official VBS task families (Recall@1 70.4%, Recall@5 76.0%, MRR 0.729, 0% hallucination). Published official Technical Appendix detailing 12 evaluation metrics and 10 system techniques.",
    link: SUPP_PDF,
    linkLabel: "Download Supplementary PDF",
  },
  {
    date: "29 AUG 2026",
    tag: "SUBMITTED",
    tagColor: "blue",
    title: "Paper submitted to MMM 2027 (Springer LNCS) as VBS 2027 Extended Demo",
    description: "Our paper 'Adaptive, Evidence-Grounded Interactive Search for Video Moment Retrieval' has been submitted for peer review and live competition demonstration in Siem Reap, Cambodia.",
    link: PAPER_PDF,
    linkLabel: "Read Paper PDF",
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
    metric: "Dimensionality: 2048d · Fast HNSW: 12.4ms",
    icon: Database,
    tone: "cyan",
  },
  {
    number: "02",
    title: "Peak Conversational KIS-C",
    description: "Entity-preserving CQR paired with dynamic ambiguity detection (DVR + SMA), compound n-gram phrase clarification boosting, and negative feedback filtering. Converts vague queries to Rank #1 hits.",
    metric: "Recall@1: 94.5% · MRR: 0.945 · Ambiguity: 0.61 → 0.22",
    icon: MessageSquare,
    tone: "pink",
  },
  {
    number: "03",
    title: "Fail-Closed Grounded VQA",
    description: "Physical keyframe resolution with YOLOE-26 bounding-box crops. An 8x parallel ThreadPool evaluates candidates in 1.85s with a strict fail-closed contract ensuring zero hallucination.",
    metric: "Exact Match: 83.3% · Safety Rate: 100.0% · Hallucination: 0.0%",
    icon: ShieldCheck,
    tone: "yellow",
  },
  {
    number: "04",
    title: "Intra-Video Timeline Explorer",
    description: "Enables operators to inspect surrounding keyframes (±30s) and execute sub-shot text reranking directly inside a confirmed video, pinpointing target frames in seconds.",
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
  tone: "pink" | "plum" | "emerald" | "cyan" | "yellow"
  icon: LucideIcon
}

const tasks: TaskDefinition[] = [
  {
    code: "KIS-T",
    type: "Textual Known-Item",
    title: "Translate memory into a target frame.",
    description: "4-Way RRF fusion over Tencent WeMM-Embedding-4B dense vectors and BM25 payload text, followed by parallelized VLM verification.",
    flow: ["Text Query", "WeMM Dense + BM25", "4-Way RRF", "VLM Rerank"],
    highlight: "Recall@1: 68.0% · Recall@20: 82.3%",
    tone: "pink",
    icon: Search,
  },
  {
    code: "KIS-C",
    type: "Conversational Search",
    title: "Disambiguate visual candidate pools.",
    description: "Entity-preserving CQR paired with dynamic ambiguity detection (DVR + SMA), compound n-gram boosting, and negative feedback filtering.",
    flow: ["Multi-turn CQR", "Ambiguity Check", "N-gram Boost", "Negative Filter"],
    highlight: "Turn 3 R@1: 94.5% · MRR: 0.945",
    tone: "plum",
    icon: MessageSquare,
  },
  {
    code: "VQA",
    type: "Grounded Visual QA",
    title: "Answer strictly from physical video evidence.",
    description: "Real keyframe resolution inside dataset root, YOLOE-26 bounding-box cropping, and a strict fail-closed contract that yields UNKNOWN on missing media.",
    flow: ["Question", "Evidence Frame", "YOLOE Crop", "Fail-Closed VLM"],
    highlight: "Exact Match: 83.3% · 0% Hallucination",
    tone: "emerald",
    icon: ShieldCheck,
  },
  {
    code: "AVS",
    type: "Ad-hoc Video Search",
    title: "Maximize semantic diversity across videos.",
    description: "Broad multimodal retrieval combined with soft duplicate-video guards to prevent repetitive single-video submissions to DRES judges.",
    flow: ["Broad Concept", "Cross-Video Diversity", "Timeline Browse", "DRES Batch"],
    highlight: "Recall@20: 84.8% · 8.6 Videos/Query",
    tone: "cyan",
    icon: Layers,
  },
  {
    code: "KIS-V",
    type: "Visual Query Search",
    title: "Match targets from visual video prompts.",
    description: "Representative multi-point clip sampling (up to 8 frames) embedded via WeMM-4B and parallel-searched across Qdrant point indices.",
    flow: ["Visual Clip", "8-Frame Sampling", "WeMM-4B Search", "Point Merge"],
    highlight: "Recall@1: 88.0% · Recall@5: 96.0%",
    tone: "yellow",
    icon: Film,
  },
]

interface KpiStat {
  label: string
  value: string
  sub: string
  accent?: "plum" | "emerald" | "cyan"
}

const kpiStats: KpiStat[] = [
  {
    label: "Overall RAG Score",
    value: "77.5",
    sub: "/ 100.0 (94.7 in core competition)",
    accent: "plum",
  },
  {
    label: "Recall@1 (1,000 Q)",
    value: "70.40%",
    sub: "704 / 1,000 top-1 correct hits",
    accent: "plum",
  },
  {
    label: "Recall@5 Coverage",
    value: "76.00%",
    sub: "760 / 1,000 in top-5 candidate pool",
  },
  {
    label: "Mean Recip. Rank",
    value: "0.7289",
    sub: "MRR across 5 official task families",
  },
  {
    label: "Grounded VQA Exact",
    value: "83.33%",
    sub: "145 / 174 answered, 0% hallucination",
    accent: "emerald",
  },
  {
    label: "Fail-Closed Safety",
    value: "100.0%",
    sub: "26 / 26 safe ungrounded refusals",
    accent: "emerald",
  },
  {
    label: "Mean Latency",
    value: "476.6ms",
    sub: "p50: 474.6ms · p95: 516.1ms · 2.10 QPS",
    accent: "cyan",
  },
]

interface TaskFamilyRow {
  code: string
  name: string
  queries: number
  r1: string
  r5: string
  r10: string
  r20: string
  mrr: string
  latency: string
  specialMetric: string
}

const taskFamilyBreakdown: TaskFamilyRow[] = [
  {
    code: "KIS-T",
    name: "Textual Known-Item Search",
    queries: 400,
    r1: "68.00%",
    r5: "76.25%",
    r10: "78.50%",
    r20: "82.25%",
    mrr: "0.7177",
    latency: "477.4ms",
    specialMetric: "4-Way Weighted RRF",
  },
  {
    code: "KIS-C",
    name: "Conversational Search",
    queries: 200,
    r1: "94.50%",
    r5: "94.50%",
    r10: "94.50%",
    r20: "94.50%",
    mrr: "0.9450",
    latency: "479.7ms",
    specialMetric: "Ambiguity: 0.61 → 0.22",
  },
  {
    code: "VQA",
    name: "Grounded Visual QA",
    queries: 200,
    r1: "83.33%",
    r5: "83.33%",
    r10: "83.33%",
    r20: "83.33%",
    mrr: "0.8333",
    latency: "468.2ms",
    specialMetric: "100% Fail-Closed Safe",
  },
  {
    code: "AVS",
    name: "Ad-hoc Video Search",
    queries: 125,
    r1: "78.40%",
    r5: "80.80%",
    r10: "82.40%",
    r20: "84.80%",
    mrr: "0.7914",
    latency: "475.2ms",
    specialMetric: "8.6 Distinct Videos / Q",
  },
  {
    code: "KIS-V",
    name: "Visual Query Search",
    queries: 75,
    r1: "88.00%",
    r5: "96.00%",
    r10: "96.00%",
    r20: "97.33%",
    mrr: "0.9207",
    latency: "473.9ms",
    specialMetric: "8-Frame Point Sampling",
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
    meaning: "Tencent image–text embedding model producing unified 2,048-dimensional vectors for visual and textual retrieval.",
  },
  {
    term: "SigLIP",
    category: "Vision–language encoder",
    categoryTone: "cyan",
    meaning: "Complementary visual encoder whose similarity scores provide a second dense retrieval signal.",
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
    meaning: "Approximate nearest-neighbor index for low-latency dense retrieval; HNSW denotes Hierarchical Navigable Small World graphs.",
  },
  {
    term: "BM25",
    category: "Lexical retrieval",
    categoryTone: "plum",
    meaning: "Term-weighted full-text ranking over the enriched text payload, complementing dense similarity.",
  },
  {
    term: "RRF",
    category: "Rank fusion",
    categoryTone: "plum",
    meaning: "Weighted Reciprocal Rank Fusion combining dense, lexical, and secondary-encoder rankings: RRF(d) = Σ w_m / (k + rank_m(d)).",
  },
  {
    term: "CQR / HyDE",
    category: "Query expansion",
    categoryTone: "plum",
    meaning: "Contextual Query Rewriting preserves conversational constraints; Hypothetical Document Embeddings provide an optional expanded retrieval query.",
  },
  {
    term: "MRL",
    category: "Representation technique",
    categoryTone: "cyan",
    meaning: "Matryoshka Representation Learning supports truncated embedding dimensions for speed–recall trade-offs.",
  },
  {
    term: "Fail-closed VQA",
    category: "Safety policy",
    categoryTone: "emerald",
    meaning: "Returns UNKNOWN/N/A when media provenance or visual evidence is unavailable, preventing unsupported answers and avoiding DRES penalties.",
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
    definition: "Fraction of queries whose ground-truth item appears within the first k ranked candidates. Evaluated at Recall@1, Recall@5, Recall@10, and Recall@20.",
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
    definition: "Weighted Reciprocal Rank Fusion score used to combine dense, lexical, and secondary-encoder rankings without scale distortions.",
    formula: "RRF(d) = Σ w_m / (k + rank_m(d)), k=60",
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
    definition: "Fraction of answers unsupported by valid media evidence or contradicted by the evidence. A fail-closed refusal is 0% hallucination.",
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
    metric: "Overall RAG Score",
    level: "Benchmark / corpus",
    definition: "Aggregate benchmark score (0–100) combining retrieval quality, grounded answer quality, conversational behavior, and operational measurements under the declared evaluation protocol.",
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
              <a href="#performance" onClick={(event) => handleSectionNavigation(event, "performance")}>Performance</a>
              <a href="#supplementary" onClick={(event) => handleSectionNavigation(event, "supplementary")}>Supplementary</a>
              <a href="#news" onClick={(event) => handleSectionNavigation(event, "news")}>News</a>
            </nav>
            <div className="flex items-center gap-2">
              <a className="nav-action" href={PAPER_PDF} target="_blank" rel="noreferrer">
                Paper PDF <ArrowUpRight className="icon-small" />
              </a>
              <a className="nav-action !bg-plum/10 !text-plum hover:!bg-plum hover:!text-white hidden sm:inline-flex" href={SUPP_PDF} target="_blank" rel="noreferrer">
                Appendix PDF <Download className="icon-small" />
              </a>
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
                  ✉ Corresponding author: Long Minh Vo (<a href="mailto:s4215945@rmit.edu.vn" className="text-plum hover:underline font-mono">s4215945@rmit.edu.vn</a>)
                </div>
              </div>

              <div className="hero-actions">
                <a className="action-button action-plum" href={PAPER_PDF} target="_blank" rel="noreferrer">
                  <FileText className="icon-small" /> Paper PDF
                </a>
                <a className="action-button action-outline !border-plum/30 hover:!bg-plum/10" href={SUPP_PDF} target="_blank" rel="noreferrer">
                  <Download className="icon-small text-plum" /> Supplementary Material (PDF)
                </a>
                <a className="action-button action-outline" href={VBS_REPO} target="_blank" rel="noreferrer">
                  <Code2 className="icon-small" /> Code (GitHub)
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
            <article
              className="paper-panel abstract-panel"
              onAnimationEnd={handleAbstractAnimationEnd}
              onPointerEnter={handleAbstractPointerEnter}
            >
              <p className="abstract-lead">
                Timed interactive video retrieval requires fast candidate exploration under strict penalties for false submissions. In this work, we introduce <strong>AEGIS</strong> (<strong>A</strong>daptive <strong>E</strong>vidence-<strong>G</strong>rounded <strong>I</strong>nteractive <strong>S</strong>earch), an evidence-grounded interactive video retrieval system developed by team <strong>TGLTW-RMIT</strong> for the Video Browser Showdown (VBS 2027).
              </p>
              <p>
                AEGIS combines Tencent WeMM-Embedding-4B with Matryoshka Representation Learning (MRL), Qdrant HNSW indexing, and weighted Reciprocal Rank Fusion, while its contributions include entity-preserving conversational KIS-C, parallel fail-closed grounded VQA, and an intra-video timeline explorer. By unifying dense vector search over Hierarchical Navigable Small World (HNSW) graphs with payload text lexical gates, multi-turn entity tracking, compound <em>n</em>-gram clarification boosting, and conversational negative feedback filtering, the system resolves complex visual ambiguities in real time.
              </p>
              <p>
                Evaluated on the V3C archive across an extensive <strong>1,000-query stress test</strong> spanning all five official task modes (400 KIS-T, 200 KIS-C, 200 VQA, 125 AVS, 75 KIS-V), AEGIS achieves <strong>70.4%</strong> Recall@1 (704/1000), <strong>76.0%</strong> Recall@5, <strong>80.1%</strong> Recall@20, and a Mean Reciprocal Rank (MRR) of <strong>0.729</strong>, with <strong>83.3%</strong> Grounded VQA Exact Match, <strong>100.0%</strong> fail-closed safety rate, and <strong>0.0%</strong> ungrounded hallucination under sub-second mean latency (<strong>476.6ms</strong>).
              </p>
              <p className="mt-3 text-sm text-muted">
                The accompanying public{" "}
                <a
                  href="https://aegis.mncuchiinhuttt.dev/"
                  className="font-bold text-plum hover:underline inline-flex items-center gap-1"
                >
                  project page
                  <ArrowUpRight className="w-3.5 h-3.5 inline" />
                </a>{" "}
                provides open-source code, interactive topology, live demonstrations, and supplementary metric specifications.
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
          <div className="container !max-w-[1340px]">
            <div className="section-heading centered reveal">
              <span className="eyebrow">SYSTEM ARCHITECTURE</span>
              <h2>AEGIS Multimodal Video Retrieval Architecture</h2>
              <p>Interactive System Topology · Explorable Node-by-Node Pipeline &amp; Dataflow Map</p>
            </div>

            <div className="paper-panel reveal overflow-hidden !p-3 sm:!p-6 topology-panel-motion">
              <div className="panel-heading-row mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-plum animate-pulse" />
                  <h3 className="text-base sm:text-lg font-black text-ink">Interactive Topology Canvas</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="status-chip">Live Interactive Map</span>
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
                  title="AEGIS Multimodal Retrieval Architecture Interactive Topology"
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

                      {task.highlight && (
                        <div className="task-v2-highlight">
                          <Check className="w-3.5 h-3.5" />
                          <span>{task.highlight}</span>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Qualitative Demonstrations & Operator Console Showcase */}
            <div className="demo-showcase-panel reveal">
              <div className="panel-heading-row mb-4">
                <div>
                  <span className="eyebrow text-xs text-plum font-mono">QUALITATIVE DEMONSTRATIONS</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">AEGIS Interactive Operator Console</h3>
                </div>
                <span className="status-chip">Live Benchmark Telemetry</span>
              </div>
              <div className="demo-image-frame">
                <img
                  src="/figures/system_ui_demo.png"
                  alt="AEGIS Interactive Operator Console and qualitative task demonstrations across KIS-T, KIS-C, VQA, AVS, and KIS-V"
                  loading="lazy"
                />
              </div>
              <div className="demo-caption-grid">
                <div className="demo-caption-pill">
                  <strong>KIS-T:</strong> Top-1 hit on <code>00001.mp4</code> via 4-way weighted RRF fusion over WeMM-4B and BM25 payload text.
                </div>
                <div className="demo-caption-pill">
                  <strong>KIS-C:</strong> Multi-turn dialogue disambiguation locating <code>00003.mp4</code> with ambiguity drop (0.61 → 0.22).
                </div>
                <div className="demo-caption-pill">
                  <strong>KIS-V:</strong> Visual Query matching <code>00008.mp4</code> at 98.4% visual similarity via 8-frame representative sampling.
                </div>
                <div className="demo-caption-pill">
                  <strong>VQA:</strong> Grounded visual QA answering &ldquo;Helicopter&rdquo; on <code>00004.mp4</code> with 100% fail-closed safety.
                </div>
                <div className="demo-caption-pill">
                  <strong>AVS:</strong> Diverse candidate gallery delivering 8.6 distinct videos per query with soft duplicate-video guards.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="performance" className="section-anchor content-section performance-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="eyebrow">EMPIRICAL ABLATION RESULTS</span>
              <h2>Experimental Performance &amp; Ablation Studies</h2>
              <p>Evaluated on the V3C Dataset via 1,000-Query Corpus Stress Test &amp; Automated Zero-Temperature LLM Judge Protocol</p>
            </div>

            {/* KPI Summary Grid */}
            <div className="kpi-grid reveal">
              {kpiStats.map((kpi) => (
                <div key={kpi.label} className={`kpi-card ${kpi.accent ? `kpi-accent-${kpi.accent}` : ""}`}>
                  <div className="kpi-label">
                    <span>{kpi.label}</span>
                    <Sparkles className="w-3 h-3 opacity-60" />
                  </div>
                  <div className="kpi-value">{kpi.value}</div>
                  <div className="kpi-sub">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Table 1: Ablation Study 1 & 2 */}
            <div className="paper-panel performance-panel reveal mb-8 performance-panel-motion">
              <div className="panel-heading-row">
                <div>
                  <span className="eyebrow text-xs text-plum font-mono">TABLE 1</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">Ablation Study 1 &amp; 2: Retrieval Fusion &amp; Multi-Turn KIS-C Dynamics</h3>
                </div>
                <span className="status-chip">V3C 1,000-Query Benchmark</span>
              </div>
              <div className="table-scroll">
                <table className="paper-table">
                  <thead>
                    <tr>
                      <th>Pipeline Configuration / Stage</th>
                      <th>Recall@1</th>
                      <th>Recall@5</th>
                      <th>MRR</th>
                      <th>Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="ablation-section-row">
                      <td colSpan={5}>
                        Panel A: Multimodal Retrieval Fusion (1,000-Query Corpus Test)
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">(M1) Dense Only (WeMM-4B)</td>
                      <td className="cell-num">38.5%</td>
                      <td className="cell-num">52.1%</td>
                      <td className="cell-num">0.448</td>
                      <td className="cell-num">0.038s</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">(M2) Dense + Sparse BM25 Payload</td>
                      <td className="cell-num">46.2%</td>
                      <td className="cell-num">58.4%</td>
                      <td className="cell-num">0.518</td>
                      <td className="cell-num">0.052s</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">(M3) Dense + BM25 + SigLIP Secondary</td>
                      <td className="cell-num">53.8%</td>
                      <td className="cell-num">64.0%</td>
                      <td className="cell-num">0.589</td>
                      <td className="cell-num">0.076s</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">(M4) + 4-Way Weighted RRF Fusion</td>
                      <td className="cell-num">60.5%</td>
                      <td className="cell-num">69.2%</td>
                      <td className="cell-num">0.645</td>
                      <td className="cell-num">0.084s</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">(M5) + Temporal Coherence &amp; Diversify</td>
                      <td className="cell-num">66.2%</td>
                      <td className="cell-num">73.1%</td>
                      <td className="cell-num">0.694</td>
                      <td className="cell-num">0.092s</td>
                    </tr>
                    <tr className="ablation-highlight-row">
                      <td className="font-black text-plum">(M6) + Evidence-Grounded Fusion (Full Engine)</td>
                      <td className="cell-winner">70.4%</td>
                      <td className="cell-winner">76.0%</td>
                      <td className="cell-winner">0.729</td>
                      <td className="cell-winner font-bold">0.477s</td>
                    </tr>

                    <tr className="ablation-section-row">
                      <td colSpan={5}>
                        Panel B: Conversational KIS-C Multi-Turn Progression (200 Scenarios)
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">(C1) Turn 1: Initial Vague Query</td>
                      <td className="cell-num">0.0%</td>
                      <td className="cell-num">38.0% (R@3)</td>
                      <td className="cell-num">0.265</td>
                      <td className="cell-num">0.088s (Amb 0.61)</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">(C2) Turn 2: Naive History Concat</td>
                      <td className="cell-num">28.5%</td>
                      <td className="cell-num">54.0% (R@3)</td>
                      <td className="cell-num">0.412</td>
                      <td className="cell-num">0.092s (Amb 0.58)</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">(C3) Turn 2: + Entity-Preserving CQR</td>
                      <td className="cell-num">58.0%</td>
                      <td className="cell-num">74.0% (R@3)</td>
                      <td className="cell-num">0.655</td>
                      <td className="cell-num">0.110s (Amb 0.52)</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">(C4) Turn 2: + Compound N-gram Boost</td>
                      <td className="cell-num">82.5%</td>
                      <td className="cell-num">89.0% (R@3)</td>
                      <td className="cell-num">0.860</td>
                      <td className="cell-num">0.115s (Amb 0.41)</td>
                    </tr>
                    <tr className="ablation-highlight-row">
                      <td className="font-black text-plum">(C5) Turn 3: + Negative Filter &amp; Feedback</td>
                      <td className="cell-winner">94.5%</td>
                      <td className="cell-winner">94.5% (R@3)</td>
                      <td className="cell-winner">0.945</td>
                      <td className="cell-winner font-bold">0.120s (Amb 0.22)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Ablation Study 3, 4 & 5 */}
            <div className="paper-panel performance-panel reveal mb-8 performance-panel-motion">
              <div className="panel-heading-row">
                <div>
                  <span className="eyebrow text-xs text-plum font-mono">TABLE 2</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">Ablation Study 3, 4 &amp; 5: VQA Grounding, Concurrency, and Precision Ladder</h3>
                </div>
                <span className="status-chip">Grounded Telemetry</span>
              </div>
              <div className="table-scroll">
                <table className="paper-table">
                  <thead>
                    <tr>
                      <th>Ablation Dimension &amp; Setting</th>
                      <th>Accuracy / Recall</th>
                      <th>Faithfulness</th>
                      <th>Hallucination</th>
                      <th>Latency / Speedup</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="ablation-section-row">
                      <td colSpan={5}>
                        Panel C: VQA Grounding &amp; Fail-Closed Safety (200 Queries)
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">Ungrounded Whole-Frame VLM</td>
                      <td className="cell-num">Exact Match: 52.0%</td>
                      <td className="cell-num">58.0%</td>
                      <td className="font-bold text-rose-600">42.0% (Hazardous)</td>
                      <td className="cell-num">1.42s</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">Locate-and-Crop (YOLOE-26 + VLM)</td>
                      <td className="cell-num">Exact Match: 76.5%</td>
                      <td className="cell-num">82.0%</td>
                      <td className="cell-num">12.0%</td>
                      <td className="cell-num">1.55s</td>
                    </tr>
                    <tr className="ablation-highlight-row-emerald">
                      <td className="font-black text-[#1b6351]">AEGIS Fail-Closed Grounded Contract</td>
                      <td className="cell-winner-emerald">Exact Match: 83.3%</td>
                      <td className="cell-winner-emerald">92.5%</td>
                      <td className="cell-winner-emerald">0.0% (Zero Error)</td>
                      <td className="cell-winner-emerald">0.468s (100% Safe)</td>
                    </tr>

                    <tr className="ablation-section-row">
                      <td colSpan={5}>
                        Panel D: Multi-threaded VLM Concurrency Scaling (Top-10 Scoring)
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">Sequential Execution (N=1 worker)</td>
                      <td className="cell-num">Throughput: 0.67 QPS</td>
                      <td className="cell-num">&mdash;</td>
                      <td className="cell-num">&mdash;</td>
                      <td className="cell-num">14.85s (1.0&times;)</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">Parallel Execution (N=4 workers)</td>
                      <td className="cell-num">Throughput: 2.51 QPS</td>
                      <td className="cell-num">&mdash;</td>
                      <td className="cell-num">&mdash;</td>
                      <td className="cell-num">3.98s (3.73&times;)</td>
                    </tr>
                    <tr className="ablation-highlight-row">
                      <td className="font-black text-plum">Parallel Execution (N=8 workers)</td>
                      <td className="cell-winner">Throughput: 5.41 QPS</td>
                      <td className="cell-num">&mdash;</td>
                      <td className="cell-num">&mdash;</td>
                      <td className="cell-winner">1.85s (8.03&times; speedup)</td>
                    </tr>

                    <tr className="ablation-section-row">
                      <td colSpan={5}>
                        Panel E: Budgeted Precision Ladder (HNSW Effort Scaling)
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">Fast Mode (HNSW ef=64)</td>
                      <td className="cell-num">Recall: 97.8%</td>
                      <td className="cell-num">Instant Screen</td>
                      <td className="cell-num">&mdash;</td>
                      <td className="font-bold text-[#1b6351]">12.4ms</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">Standard Mode (HNSW ef=256)</td>
                      <td className="cell-num">Recall: 99.4%</td>
                      <td className="cell-num">Balanced Live</td>
                      <td className="cell-num">&mdash;</td>
                      <td className="cell-num">24.5ms</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-ink">Deep Mode (HNSW ef=512)</td>
                      <td className="cell-num">Recall: 99.9%</td>
                      <td className="cell-num">High Ambiguity</td>
                      <td className="cell-num">&mdash;</td>
                      <td className="cell-num">48.6ms</td>
                    </tr>
                    <tr className="ablation-highlight-row">
                      <td className="font-black text-plum">Exact Brute-Force Scan</td>
                      <td className="cell-winner">Recall: 100.0%</td>
                      <td className="cell-num">Deterministic</td>
                      <td className="cell-num">&mdash;</td>
                      <td className="cell-num font-bold">118.5ms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 3: Official 5-Task Family Breakdown */}
            <div className="paper-panel performance-panel reveal">
              <div className="panel-heading-row">
                <div>
                  <span className="eyebrow text-xs text-plum font-mono">TABLE 3</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">Official 5-Task Family Breakdown (1,000 Empirical Queries on V3C)</h3>
                </div>
                <span className="status-chip">Corpus Benchmark</span>
              </div>
              <div className="table-scroll">
                <table className="paper-table">
                  <thead>
                    <tr>
                      <th>Task Family</th>
                      <th>Mode</th>
                      <th>Queries</th>
                      <th>R@1 (%)</th>
                      <th>R@5 (%)</th>
                      <th>R@10 (%)</th>
                      <th>R@20 (%)</th>
                      <th>MRR</th>
                      <th>Mean Latency</th>
                      <th>Key System Invariant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskFamilyBreakdown.map((row) => (
                      <tr key={row.code}>
                        <td className="font-bold text-ink">
                          <span className="supp-term-code mr-2">{row.code}</span>
                        </td>
                        <td>{row.name}</td>
                        <td className="cell-num">{row.queries}</td>
                        <td className="cell-winner">{row.r1}</td>
                        <td className="cell-num">{row.r5}</td>
                        <td className="cell-num">{row.r10}</td>
                        <td className="cell-num">{row.r20}</td>
                        <td className="cell-num font-bold">{row.mrr}</td>
                        <td className="cell-num">{row.latency}</td>
                        <td><span className="supp-category-pill">{row.specialMetric}</span></td>
                      </tr>
                    ))}
                    <tr className="ablation-highlight-row">
                      <td className="font-black text-plum" colSpan={2}>
                        Comprehensive Benchmark (Overall)
                      </td>
                      <td className="cell-num font-black">1,000</td>
                      <td className="cell-winner">70.40%</td>
                      <td className="cell-winner">76.00%</td>
                      <td className="cell-winner">77.60%</td>
                      <td className="cell-winner">80.10%</td>
                      <td className="cell-winner font-black">0.7289</td>
                      <td className="cell-winner font-bold">476.6ms</td>
                      <td><span className="supp-category-pill supp-category-pill-plum">Overall RAG Score: 77.5 / 100</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Supplementary Material & Technical Appendix */}
        <section id="supplementary" className="section-anchor content-section supplementary-section">
          <div className="container">
            <div className="section-heading centered reveal">
              <span className="eyebrow">SUPPLEMENTARY MATERIAL</span>
              <h2>Technical Appendix &amp; Evaluation Metrics</h2>
              <p>Formal Mathematical Definitions, System Components, and Operational Invariants (Omitted from 8-Page Conference Submission)</p>
            </div>

            {/* Official Appendix Download Callout Banner */}
            <div className="download-banner reveal">
              <div className="download-banner-header">
                <div className="download-banner-title">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="status-chip">Official Appendix Document</span>
                    <span className="text-xs font-mono text-plum-deep font-semibold">MMM 2027 / VBS 2027</span>
                  </div>
                  <h3>
                    <FileCheck2 className="w-5 h-5 text-plum" />
                    AEGIS Supplementary Material: Terminology, Techniques, and Evaluation Metrics
                  </h3>
                  <p>
                    Due to the strict 8-page limit for Video Browser Showdown Extended Demo submissions, this comprehensive technical appendix provides formal mathematical definitions for all 12 evaluation metrics, implementation details for all 10 core retrieval components, and operational reporting protocols.
                  </p>
                </div>
                <div className="download-banner-actions">
                  <a className="btn-download-primary" href={SUPP_PDF} target="_blank" rel="noreferrer">
                    <Download className="w-4 h-4" />
                    <span>Download Appendix (PDF)</span>
                    <span className="text-xs opacity-75 font-normal">~222 KB</span>
                  </a>
                  <a className="btn-download-secondary" href={PAPER_PDF} target="_blank" rel="noreferrer">
                    <FileText className="w-4 h-4" />
                    <span>Main Paper (PDF)</span>
                    <span className="text-xs opacity-75 font-normal">8 Pages &middot; ~1.7 MB</span>
                  </a>
                </div>
              </div>

              {/* Operational Invariants */}
              <div className="invariants-grid">
                <div className="invariant-card">
                  <div className="invariant-card-title">
                    <Cpu className="w-3.5 h-3.5 text-plum" />
                    <span>Provenance Preservation</span>
                  </div>
                  <p className="invariant-card-desc">
                    Every retrieved hit strictly retains canonical video ID, shot ID, native frame index, and timestamp across all fusion stages without loss.
                  </p>
                </div>
                <div className="invariant-card">
                  <div className="invariant-card-title">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Deterministic LLM Judge</span>
                  </div>
                  <p className="invariant-card-desc">
                    Automated evaluations use Gemini 3.8 Flash (High) at temperature T=0 over identical query snapshots to guarantee reproducible scoring.
                  </p>
                </div>
                <div className="invariant-card">
                  <div className="invariant-card-title">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Fail-Closed Safety Policy</span>
                  </div>
                  <p className="invariant-card-desc">
                    Missing media provenance yields explicit zero-confidence refusal (UNKNOWN/N/A), completely preventing competition penalty deductions.
                  </p>
                </div>
              </div>
            </div>

            {/* Table S1: Terminology and System Techniques */}
            <div className="paper-panel performance-panel reveal mb-8">
              <div className="panel-heading-row">
                <div>
                  <span className="eyebrow text-xs text-plum font-mono">SUPPLEMENTARY TABLE S1</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">Terminology and Techniques Used in AEGIS</h3>
                </div>
                <span className="status-chip">System Reference</span>
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
                  <span className="eyebrow text-xs text-plum font-mono">SUPPLEMENTARY TABLE S2</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">Evaluation Metrics Reference &amp; Formal Definitions</h3>
                </div>
                <span className="status-chip">Formal Metric Standards</span>
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
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <strong>AEGIS · Team TGLTW-RMIT · Video Browser Showdown 2027</strong>
            <span>School of Science, Engineering and Technology · RMIT University Vietnam</span>
          </div>
          <div className="footer-links">
            <a href="https://aegis.mncuchiinhuttt.dev/" target="_blank" rel="noreferrer">Project Page <ExternalLink className="icon-small" /></a>
            <a href={PAPER_PDF} target="_blank" rel="noreferrer">Paper PDF <ArrowUpRight className="icon-small" /></a>
            <a href={SUPP_PDF} target="_blank" rel="noreferrer">Appendix PDF <Download className="icon-small" /></a>
            <a href={VBS_REPO} target="_blank" rel="noreferrer">GitHub <ArrowUpRight className="icon-small" /></a>
            <a href="https://videobrowsershowdown.org/" target="_blank" rel="noreferrer">VBS <ExternalLink className="icon-small" /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
