import { useState } from "react";
import { Header } from "@shared/components/Header";
import { Footer } from "@shared/components/Footer";
import {
  ChevronRight, Download, ExternalLink, FileText, TrendingUp, Shield, Users, Globe,
  BarChart2, Award, ArrowRight, Calendar, Linkedin, Mail, Phone, ChevronDown,
  Building, Star, Leaf, BookOpen, Briefcase, AlertCircle, CheckCircle
} from "lucide-react";

interface InvestorRelationsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

type IRPage =
  | "home"
  | "announcements"
  | "financials"
  | "governance"
  | "impact"
  | "resources"
  | "board"
  | "ipo"
  | "board-varun-khaitan"
  | "board-raghav-chandra"
  | "board-shyamal-mukherjee"
  | "board-ashish-gupta"
  | "board-ireena-vittal"
  | "board-rajesh-gopinathan"
  | "board-priya-nair"
  | "board-suresh-narayanan";

const boardMembers = [
  {
    id: "varun-khaitan",
    name: "Varun Khaitan",
    title: "Executive Director & Co-Founder",
    role: "Executive Director",
    slug: "board-varun-khaitan",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format",
    bio: "Varun Khaitan is the Co-Founder and Executive Director of VisvasaHome. With a deep passion for technology and local entrepreneurship, Varun has led the platform's growth from a Jaipur-based startup to a multi-city services ecosystem serving 20+ cities across India.",
    background: "Prior to VisvasaHome, Varun worked extensively in operations and growth strategy for consumer-facing businesses. He brings expertise in scaling marketplace platforms, building operations infrastructure, and managing technology-driven service businesses.",
    education: ["B.Tech, IIT Bombay", "Executive Program in Business Management, IIM Ahmedabad"],
    expertise: ["Platform Operations", "Growth Strategy", "Technology Innovation", "Team Leadership"],
    committee: [],
    linkedin: "#",
    tenure: "Co-Founder, 2022–Present",
  },
  {
    id: "raghav-chandra",
    name: "Raghav Chandra",
    title: "Executive Director & Chief Product & Technology Officer",
    role: "Executive Director",
    slug: "board-raghav-chandra",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
    bio: "Raghav Chandra serves as the Executive Director and Chief Product & Technology Officer of VisvasaHome. He leads the company's product vision and engineering organization, driving the development of the platform's marketplace technology, mobile apps, and service delivery infrastructure.",
    background: "Raghav has over 12 years of experience in product management and software engineering. Before VisvasaHome, he led product teams at leading Indian tech startups, where he built consumer-facing marketplace products at scale.",
    education: ["B.Tech in Computer Science, IIT Delhi", "MBA, London Business School"],
    expertise: ["Product Strategy", "Engineering Leadership", "Mobile & Web Platforms", "Data & AI"],
    committee: [],
    linkedin: "#",
    tenure: "Executive Director & CPTO, 2022–Present",
  },
  {
    id: "shyamal-mukherjee",
    name: "Shyamal Mukherjee",
    title: "Independent Director",
    role: "Independent Director",
    slug: "board-shyamal-mukherjee",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&auto=format",
    bio: "Shyamal Mukherjee is an Independent Director on the Board of VisvasaHome. He is a seasoned business leader with over 30 years of experience in financial services, corporate governance, and business transformation across Indian and global markets.",
    background: "Shyamal spent nearly three decades at PricewaterhouseCoopers India, where he served as Chairman. He has advised boards of major Indian corporations on risk management, regulatory compliance, and strategic governance.",
    education: ["Chartered Accountant, ICAI", "Fellow Member, Institute of Chartered Accountants of India"],
    expertise: ["Corporate Governance", "Risk Management", "Financial Auditing", "Regulatory Compliance"],
    committee: ["Audit Committee (Chairman)", "Risk Management Committee"],
    linkedin: "#",
    tenure: "Independent Director, 2023–Present",
  },
  {
    id: "ashish-gupta",
    name: "Dr. Ashish Gupta",
    title: "Independent Director",
    role: "Independent Director",
    slug: "board-ashish-gupta",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
    bio: "Dr. Ashish Gupta serves as an Independent Director at VisvasaHome. He is a distinguished venture capitalist, entrepreneur, and technology innovator who has been instrumental in shaping India's startup and technology ecosystem for over two decades.",
    background: "Dr. Gupta is a founding partner at Helion Venture Partners and has invested in and mentored over 50 Indian tech startups. He co-founded Junglee, one of the world's first internet comparison shopping engines, which was acquired by Amazon in 1998.",
    education: ["PhD in Computer Science, Stanford University", "B.Tech, IIT Delhi"],
    expertise: ["Venture Capital", "Technology Strategy", "Startup Ecosystems", "Digital Commerce"],
    committee: ["Audit Committee", "Nomination & Remuneration Committee (Chairman)"],
    linkedin: "#",
    tenure: "Independent Director, 2023–Present",
  },
  {
    id: "ireena-vittal",
    name: "Ireena Vittal",
    title: "Independent Director",
    role: "Independent Director",
    slug: "board-ireena-vittal",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format",
    bio: "Ireena Vittal is an Independent Director on the Board of VisvasaHome. She is one of India's foremost business strategists and corporate board members, bringing deep expertise in consumer markets, rural economy, and sustainable business models.",
    background: "Ireena spent 23 years at McKinsey & Company, where she was a Senior Partner and led the Consumer Goods and Retail Practice in India. She serves on the boards of Titan, Wipro, Godrej Consumer Products, and other leading Indian corporations.",
    education: ["MBA, IIM Calcutta", "Bachelor of Engineering, NIT Surathkal"],
    expertise: ["Consumer Markets", "Rural Economy", "Strategy Consulting", "ESG & Sustainability"],
    committee: ["CSR & ESG Committee (Chairperson)", "Nomination & Remuneration Committee"],
    linkedin: "#",
    tenure: "Independent Director, 2023–Present",
  },
  {
    id: "rajesh-gopinathan",
    name: "Rajesh Gopinathan",
    title: "Independent Director",
    role: "Independent Director",
    slug: "board-rajesh-gopinathan",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
    bio: "Rajesh Gopinathan serves as an Independent Director at VisvasaHome. He is the former CEO and Managing Director of Tata Consultancy Services (TCS), one of the world's largest IT services companies, where he led the company's transformation into a USD 25 billion global enterprise.",
    background: "During his tenure as CEO of TCS (2017–2023), Rajesh drove significant expansion in cloud computing, AI, and digital services. Under his leadership, TCS became the first Indian IT company to achieve a $200 billion market cap. He brings unparalleled experience in scaling technology organizations globally.",
    education: ["MBA, IIM Ahmedabad", "B.Tech in Electronics Engineering, NIT Trichy"],
    expertise: ["Technology Leadership", "Global Operations", "Digital Transformation", "Corporate Strategy"],
    committee: ["Audit Committee", "Risk Management Committee (Chairman)"],
    linkedin: "#",
    tenure: "Independent Director, 2024–Present",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    title: "Independent Director",
    role: "Independent Director",
    slug: "board-priya-nair",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
    bio: "Priya Nair is an Independent Director at VisvasaHome and one of India's most accomplished consumer marketing and brand leaders. She brings deep expertise in building household and personal care brands at global scale, with a strong track record in India and Southeast Asia.",
    background: "Priya served as Executive Vice President and Head of Home Care at Hindustan Unilever Limited (HUL) before becoming a board member and independent advisor to several consumer and technology companies. She championed inclusive growth and rural market penetration strategies at HUL that reached over 200 million households.",
    education: ["MBA (Marketing), IIM Bangalore", "B.Sc. in Economics, St. Xavier's College, Mumbai"],
    expertise: ["Consumer Marketing", "Brand Strategy", "Rural Market Penetration", "Women Leadership"],
    committee: ["CSR & ESG Committee", "Nomination & Remuneration Committee"],
    linkedin: "#",
    tenure: "Independent Director, 2024–Present",
  },
  {
    id: "suresh-narayanan",
    name: "Suresh Narayanan",
    title: "Independent Director",
    role: "Independent Director",
    slug: "board-suresh-narayanan",
    photo: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=400&h=400&fit=crop&auto=format",
    bio: "Suresh Narayanan serves as an Independent Director at VisvasaHome. He is the Chairman and Managing Director of Nestlé India, a position he has held since 2015, leading one of India's largest FMCG companies through a period of significant growth and digital transformation.",
    background: "With over three decades of experience across Nestlé operations in India, Southeast Asia, and global markets, Suresh has built a reputation as a leader who combines strategic vision with strong operational execution. He is widely respected for rebuilding consumer trust during the Maggi crisis (2015) and doubling Nestlé India's revenues thereafter.",
    education: ["MBA, IIM Calcutta", "Bachelor of Economics, Loyola College, Chennai"],
    expertise: ["FMCG Leadership", "Crisis Management", "Supply Chain Excellence", "Stakeholder Relations"],
    committee: ["Audit Committee", "Risk Management Committee"],
    linkedin: "#",
    tenure: "Independent Director, 2025–Present",
  },
];

const announcements = [
  { date: "May 15, 2026", title: "VisvasaHome Raises Series A Funding of ₹120 Crore", type: "Funding", tag: "MATERIAL" },
  { date: "April 2, 2026", title: "Board Meeting Notice — Q4 FY2025-26 Financial Results", type: "Board Meeting", tag: "NOTICE" },
  { date: "March 18, 2026", title: "Annual General Meeting Scheduled for June 28, 2026", type: "AGM", tag: "NOTICE" },
  { date: "February 10, 2026", title: "Appointment of Rajesh Gopinathan as Independent Director", type: "Board Change", tag: "MATERIAL" },
  { date: "January 22, 2026", title: "VisvasaHome Expands to 5 New Cities in FY2025-26", type: "Business Update", tag: "UPDATE" },
  { date: "December 5, 2025", title: "Q3 FY2025-26 Financial Results and Investor Update", type: "Financials", tag: "FINANCIAL" },
  { date: "October 30, 2025", title: "VisvasaHome Wins National Startup Award 2025", type: "Recognition", tag: "UPDATE" },
  { date: "September 12, 2025", title: "Launch of Enterprise AMC Plans for Hospitality Sector", type: "Business Update", tag: "UPDATE" },
];

const financials = [
  {
    period: "Q4 FY2025-26",
    gmv: "₹48.2 Cr",
    revenue: "₹14.7 Cr",
    growth: "+62%",
    orders: "52,400",
    cities: "24",
    professionals: "820+",
  },
  {
    period: "Q3 FY2025-26",
    gmv: "₹41.6 Cr",
    revenue: "₹12.8 Cr",
    growth: "+55%",
    orders: "44,100",
    cities: "22",
    professionals: "740+",
  },
  {
    period: "Q2 FY2025-26",
    gmv: "₹35.4 Cr",
    revenue: "₹10.9 Cr",
    growth: "+48%",
    orders: "37,800",
    cities: "20",
    professionals: "640+",
  },
  {
    period: "Q1 FY2025-26",
    gmv: "₹28.9 Cr",
    revenue: "₹8.8 Cr",
    growth: "+41%",
    orders: "30,200",
    cities: "18",
    professionals: "560+",
  },
];

const documents = [
  { title: "Annual Report FY2024-25", date: "June 2025", type: "Annual Report", size: "4.2 MB", format: "PDF" },
  { title: "Annual Report FY2023-24", date: "June 2024", type: "Annual Report", size: "3.8 MB", format: "PDF" },
  { title: "Q4 FY2025-26 Investor Presentation", date: "May 2026", type: "Investor Presentation", size: "2.1 MB", format: "PDF" },
  { title: "Q3 FY2025-26 Investor Presentation", date: "Feb 2026", type: "Investor Presentation", size: "1.9 MB", format: "PDF" },
  { title: "VisvasaHome Corporate Governance Policy", date: "March 2025", type: "Governance", size: "0.8 MB", format: "PDF" },
  { title: "Code of Business Conduct & Ethics", date: "March 2025", type: "Governance", size: "0.6 MB", format: "PDF" },
  { title: "Environmental & Social Impact Report 2024", date: "April 2025", type: "ESG", size: "3.2 MB", format: "PDF" },
  { title: "Related Party Transaction Policy", date: "March 2025", type: "Governance", size: "0.4 MB", format: "PDF" },
];

function IRNav({ currentPage, onNavigate }: { currentPage: IRPage; onNavigate: (p: IRPage) => void }) {
  const navItems: { label: string; page: IRPage }[] = [
    { label: "Overview", page: "home" },
    { label: "Announcements", page: "announcements" },
    { label: "Financials", page: "financials" },
    { label: "Governance", page: "governance" },
    { label: "Impact (ESG)", page: "impact" },
    { label: "Resources", page: "resources" },
    { label: "Board", page: "board" },
    { label: "IPO Disclosures", page: "ipo" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[106px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                currentPage === item.page || (item.page === "board" && currentPage.startsWith("board-"))
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function IRHome({ onNavigate }: { onNavigate: (p: IRPage) => void }) {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gray-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#2563EB] text-sm font-semibold uppercase tracking-widest mb-3">Investor Relations</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl leading-tight">
            Building India's most trusted local services ecosystem
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed">
            VisvasaHome (Visvasa Pvt. Ltd.) connects communities with verified local professionals across 20+ cities. Our platform drives economic opportunity for skilled professionals while delivering reliable, transparent service experiences for customers.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate("financials")}
              className="px-6 py-3 text-white rounded-lg font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#2563EB" }}
            >
              View Financials <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("announcements")}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/15 transition-colors"
            >
              Latest Announcements
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
            {[
              { label: "GMV (FY2025-26)", value: "₹154 Cr", sub: "+52% YoY" },
              { label: "Verified Professionals", value: "820+", sub: "Across 24 cities" },
              { label: "Services Completed", value: "1.6L+", sub: "Cumulative" },
              { label: "Customer Rating", value: "4.8 / 5", sub: "50,000+ reviews" },
            ].map((m, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{m.value}</div>
                <div className="text-sm text-gray-500 mb-0.5">{m.label}</div>
                <div className="text-xs font-semibold" style={{ color: "#2563EB" }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Investor Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: FileText, label: "Announcements", desc: "Material disclosures, board meetings, AGM notices", page: "announcements" as IRPage },
              { icon: BarChart2, label: "Financials", desc: "Quarterly results, GMV metrics, investor presentations", page: "financials" as IRPage },
              { icon: Shield, label: "Governance", desc: "Board committees, policies, compliance documents", page: "governance" as IRPage },
              { icon: Leaf, label: "Impact (ESG)", desc: "Environmental, social, and governance initiatives", page: "impact" as IRPage },
              { icon: BookOpen, label: "Resources", desc: "Annual reports, presentations, and policy documents", page: "resources" as IRPage },
              { icon: Users, label: "Board of Directors", desc: "Leadership, experience, and committee memberships", page: "board" as IRPage },
              { icon: Briefcase, label: "IPO Disclosures", desc: "DRHP, offer documents, regulatory filings, and risk factors", page: "ipo" as IRPage },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all text-left group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <item.icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{item.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-[#2563EB] text-sm font-medium">
                  View <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Announcements Preview */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Announcements</h2>
            <button onClick={() => onNavigate("announcements")} className="text-[#2563EB] text-sm font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {announcements.slice(0, 4).map((a, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors cursor-pointer">
                <div className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-600 whitespace-nowrap mt-0.5">{a.tag}</div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium text-sm">{a.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{a.date} · {a.type}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact IR */}
      <div className="py-16 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-4">Investor Contact</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              For investor inquiries, analyst meetings, or information requests, please reach out to our Investor Relations team.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-[#2563EB]" />
                investors@visvasahome.com
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-[#2563EB]" />
                +91 905 7567 160
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Building className="w-4 h-4 text-[#2563EB]" />
                Visvasa Pvt. Ltd., Jaipur, Rajasthan 302001
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IRAnnouncements() {
  const [filter, setFilter] = useState("All");
  const types = ["All", "Funding", "Board Meeting", "AGM", "Business Update", "Financials", "Board Change", "Recognition"];
  const filtered = filter === "All" ? announcements : announcements.filter((a) => a.type === filter);

  const tagColor = (tag: string) => {
    if (tag === "MATERIAL") return "bg-red-50 text-red-700 border border-red-200";
    if (tag === "FINANCIAL") return "bg-blue-50 text-blue-700 border border-blue-200";
    if (tag === "NOTICE") return "bg-blue-50 text-blue-700 border border-blue-200";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
      <p className="text-gray-500 mb-8 text-sm">Material disclosures, board meeting notices, and corporate updates</p>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === t ? "text-white border-[#2563EB]" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
            style={filter === t ? { backgroundColor: "#2563EB" } : {}}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.map((a, i) => (
          <div key={i} className={`flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer ${i > 0 ? "border-t border-gray-100" : ""}`}>
            <div className="text-sm text-gray-400 whitespace-nowrap pt-0.5 w-28 flex-shrink-0">{a.date}</div>
            <div className="flex-1">
              <p className="text-gray-900 font-medium mb-1">{a.title}</p>
              <p className="text-gray-500 text-xs">{a.type}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${tagColor(a.tag)}`}>{a.tag}</span>
              <button className="flex items-center gap-1 text-xs text-[#2563EB] font-medium hover:underline whitespace-nowrap">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IRFinancials() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Financials</h1>
      <p className="text-gray-500 mb-10 text-sm">Quarterly performance metrics, GMV data, and investor presentations</p>

      {/* Quarterly Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-10">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Quarterly Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Period</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">GMV</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Revenue</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">YoY Growth</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Orders</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cities</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Professionals</th>
              </tr>
            </thead>
            <tbody>
              {financials.map((q, i) => (
                <tr key={i} className={`border-t border-gray-100 ${i === 0 ? "bg-blue-50/30" : ""}`}>
                  <td className="px-6 py-4 font-medium text-gray-900">{q.period}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">{q.gmv}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{q.revenue}</td>
                  <td className="px-6 py-4 text-right font-semibold" style={{ color: "#2563EB" }}>{q.growth}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{q.orders}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{q.cities}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{q.professionals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 mb-10">
        <AlertCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
        <p>All financial data is unaudited and for informational purposes only. Audited financials are available in the Annual Reports. GMV represents total value of services transacted on the platform.</p>
      </div>

      {/* Annual Reports */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">Investor Presentations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.filter((d) => d.type === "Investor Presentation" || d.type === "Annual Report").map((doc, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start justify-between hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{doc.date} · {doc.format} · {doc.size}</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs text-[#2563EB] font-medium hover:underline flex-shrink-0">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function IRGovernance() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Corporate Governance</h1>
      <p className="text-gray-500 mb-10 text-sm">Board structure, committees, policies, and compliance framework</p>

      {/* Board Committees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[
          {
            name: "Audit Committee",
            members: ["Shyamal Mukherjee (Chairman)", "Dr. Ashish Gupta", "Rajesh Gopinathan"],
            role: "Oversees financial reporting, audit processes, internal controls, and risk management.",
          },
          {
            name: "Nomination & Remuneration Committee",
            members: ["Dr. Ashish Gupta (Chairman)", "Ireena Vittal", "Shyamal Mukherjee"],
            role: "Reviews board composition, director nominations, and executive compensation policies.",
          },
          {
            name: "CSR & ESG Committee",
            members: ["Ireena Vittal (Chairperson)", "Varun Khaitan", "Raghav Chandra"],
            role: "Oversees CSR spending, ESG commitments, and social impact programs.",
          },
          {
            name: "Risk Management Committee",
            members: ["Rajesh Gopinathan (Chairman)", "Raghav Chandra", "Shyamal Mukherjee"],
            role: "Identifies, assesses, and mitigates enterprise-level risks including cybersecurity and operational risks.",
          },
        ].map((c, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">{c.name}</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{c.role}</p>
            <div className="space-y-1.5">
              {c.members.map((m, j) => (
                <div key={j} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                  {m}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Governance Policies */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">Governance Documents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.filter((d) => d.type === "Governance").map((doc, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start justify-between hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{doc.date} · {doc.format} · {doc.size}</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs text-[#2563EB] font-medium hover:underline flex-shrink-0">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function IRImpact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact & ESG</h1>
      <p className="text-gray-500 mb-12 text-sm">Environmental, social, and governance commitments and outcomes</p>

      {/* Impact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
        {[
          { value: "820+", label: "Livelihoods Created", icon: Users },
          { value: "24", label: "Cities Covered", icon: Globe },
          { value: "₹38 Cr", label: "Professional Earnings (FY26)", icon: TrendingUp },
          { value: "68%", label: "Professionals from Tier 2/3 Cities", icon: Building },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <s.icon className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ESG Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Leaf,
            title: "Environmental",
            items: [
              "Digital-first operations — minimal paper usage",
              "Route optimization to reduce professional travel",
              "Eco-friendly product mandates for cleaning services",
              "Carbon footprint tracking initiative (2026)",
            ],
          },
          {
            icon: Users,
            title: "Social",
            items: [
              "Free skill training for 500+ professionals annually",
              "Anti-discrimination & fair wage policies",
              "Women professional onboarding program",
              "Community welfare program in Jaipur & Jodhpur",
            ],
          },
          {
            icon: Shield,
            title: "Governance",
            items: [
              "50% independent directors on board",
              "Whistleblower policy with anonymous reporting",
              "Annual external audit by Big 4 firm",
              "Published conflict-of-interest disclosure policy",
            ],
          },
        ].map((pillar, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <pillar.icon className="w-5 h-5 text-[#2563EB]" />
            </div>
            <h3 className="font-bold text-gray-900 mb-4">{pillar.title}</h3>
            <ul className="space-y-2.5">
              {pillar.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Social Programs */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-4">Flagship Social Programs</h2>
      <p className="text-gray-500 text-sm mb-8">VisvasaHome's three cornerstone initiatives that drive inclusive growth and community impact</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            name: "Udaan",
            tagline: "Skilling India's Service Professionals",
            color: "bg-blue-50 border-blue-100",
            accentColor: "text-blue-700",
            iconBg: "bg-blue-100",
            description: "Udaan is VisvasaHome's flagship vocational training and certification program for service professionals. It provides free skill development courses, technical certifications, and digital literacy training to help professionals improve their earning potential and service quality.",
            stats: [
              { label: "Professionals Trained", value: "2,800+" },
              { label: "Skill Modules", value: "24" },
              { label: "Avg. Income Increase", value: "+34%" },
              { label: "Cities Covered", value: "16" },
            ],
            highlights: [
              "12-week intensive training in electrical, plumbing, carpentry, and HVAC",
              "Digital literacy and app-based service management training",
              "Safety certification for professionals working in hazardous conditions",
              "Partnerships with ITIs and state skill development missions",
            ],
          },
          {
            name: "Nidar",
            tagline: "Safety & Security for Every Professional",
            color: "bg-green-50 border-green-100",
            accentColor: "text-green-700",
            iconBg: "bg-green-100",
            description: "Nidar (meaning 'fearless' in Hindi) is VisvasaHome's comprehensive safety and insurance program for service professionals. It ensures that every professional on the platform has access to accident insurance, safety gear, and emergency support while on the job.",
            stats: [
              { label: "Professionals Covered", value: "820+" },
              { label: "Insurance Cover", value: "₹5 Lakh" },
              { label: "Claims Processed", value: "47" },
              { label: "Emergency Response", value: "< 4 Hours" },
            ],
            highlights: [
              "Personal accident insurance cover of ₹5 lakhs per professional",
              "Free safety equipment provisioning — helmets, gloves, safety shoes",
              "24×7 emergency helpline for professionals in distress",
              "Mental health support and counselling services",
            ],
          },
          {
            name: "Scholarship",
            tagline: "Educating the Next Generation",
            color: "bg-purple-50 border-purple-100",
            accentColor: "text-purple-700",
            iconBg: "bg-purple-100",
            description: "The VisvasaHome Scholarship Program supports the education of children of service professionals on the platform. Funded through a 0.5% allocation of GMV, the program provides merit-cum-need scholarships to students from Class 6 through undergraduate level.",
            stats: [
              { label: "Scholarships Awarded", value: "340+" },
              { label: "Annual Scholarship Value", value: "₹38 Lakh" },
              { label: "Girls Beneficiaries", value: "58%" },
              { label: "States Covered", value: "8" },
            ],
            highlights: [
              "Merit-cum-need scholarships for Class 6 to undergraduate students",
              "Full tuition coverage for 50 students at engineering/medical colleges",
              "Digital devices provided to scholarship holders in rural areas",
              "Mentorship program pairing scholars with Visvasa volunteers",
            ],
          },
        ].map((program) => (
          <div key={program.name} className={`bg-white border rounded-xl overflow-hidden`}>
            <div className={`${program.color} border-b px-6 py-5`}>
              <div className={`w-10 h-10 ${program.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                <Star className={`w-5 h-5 ${program.accentColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
              <p className={`text-sm font-medium ${program.accentColor} mt-0.5`}>{program.tagline}</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{program.description}</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {program.stats.map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
              <ul className="space-y-2">
                {program.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-gray-700">
        <FileText className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-gray-900 mb-1">Environmental & Social Impact Report 2024</p>
          <p className="text-gray-500 mb-3">A detailed account of VisvasaHome's ESG commitments, outcomes, and FY2025 targets including Udaan, Nidar, and Scholarship program results.</p>
          <button className="flex items-center gap-2 text-[#2563EB] font-medium hover:underline text-sm">
            <Download className="w-4 h-4" /> Download Report (3.2 MB PDF)
          </button>
        </div>
      </div>
    </div>
  );
}

function IRResources() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
      <p className="text-gray-500 mb-10 text-sm">Annual reports, investor presentations, policy documents, and archived materials</p>

      {[
        { category: "Annual Reports", type: "Annual Report" },
        { category: "Investor Presentations", type: "Investor Presentation" },
        { category: "Governance Documents", type: "Governance" },
        { category: "ESG Reports", type: "ESG" },
      ].map((section) => {
        const sectionDocs = documents.filter((d) => d.type === section.type);
        if (!sectionDocs.length) return null;
        return (
          <div key={section.category} className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{section.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sectionDocs.map((doc, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start justify-between hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{doc.date} · {doc.format} · {doc.size}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-[#2563EB] font-medium hover:underline flex-shrink-0 ml-4">
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IRBoard({ onNavigate }: { onNavigate: (p: IRPage) => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Board of Directors</h1>
      <p className="text-gray-500 mb-10 text-sm">Independent and experienced leaders guiding VisvasaHome's strategy and governance</p>

      {/* Executive Directors */}
      <h2 className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-5">Executive Directors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {boardMembers.filter((b) => b.role === "Executive Director").map((member) => (
          <button
            key={member.id}
            onClick={() => onNavigate(member.slug as IRPage)}
            className="bg-white border border-gray-200 rounded-xl p-6 flex items-start gap-4 hover:border-blue-200 hover:shadow-md transition-all text-left group"
          >
            <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">{member.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5 leading-snug">{member.title}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB] transition-colors flex-shrink-0 mt-1" />
          </button>
        ))}
      </div>

      {/* Independent Directors */}
      <h2 className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-5">Independent Directors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {boardMembers.filter((b) => b.role === "Independent Director").map((member) => (
          <button
            key={member.id}
            onClick={() => onNavigate(member.slug as IRPage)}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-md transition-all text-left group"
          >
            <img src={member.photo} alt={member.name} className="w-14 h-14 rounded-full object-cover mb-4" />
            <h3 className="font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">{member.name}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-snug">{member.title}</p>
            {member.committee.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {member.committee.map((c, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function IRBoardMember({ member, onBack }: { member: (typeof boardMembers)[0]; onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-8 transition-colors">
        ← Back to Board of Directors
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 flex items-start gap-6 border-b border-gray-100">
          <img src={member.photo} alt={member.name} className="w-24 h-24 rounded-full object-cover flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
            <p className="text-gray-500 mt-1">{member.title}</p>
            <p className="text-sm text-gray-400 mt-2">{member.tenure}</p>
            <div className="flex items-center gap-3 mt-4">
              <a href={member.linkedin} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#2563EB] transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="p-8 space-y-8">
          <div>
            <h2 className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">Biography</h2>
            <p className="text-gray-700 leading-relaxed">{member.bio}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">Background</h2>
            <p className="text-gray-700 leading-relaxed">{member.background}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">Education</h2>
              <ul className="space-y-2">
                {member.education.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <Award className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((e, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-[#2563EB] border border-blue-100 px-3 py-1.5 rounded-full">{e}</span>
                ))}
              </div>
            </div>
          </div>

          {member.committee.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">Board Committee Memberships</h2>
              <div className="space-y-2">
                {member.committee.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-[#2563EB]" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IRIPO() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold bg-blue-50 text-[#2563EB] border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wide">IPO Disclosures</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">IPO & Public Offering Disclosures</h1>
      <p className="text-gray-500 mb-10 text-sm">Statutory disclosures, DRHP, offer documents, and regulatory filings related to VisvasaHome's proposed Initial Public Offering</p>

      {/* IPO Status Banner */}
      <div className="bg-gray-950 text-white rounded-2xl p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[#2563EB] text-xs font-semibold uppercase tracking-widest mb-2">Current Status</p>
          <h2 className="text-xl font-bold mb-2">Pre-IPO Stage — DRHP Filing in Progress</h2>
          <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
            VisvasaHome is currently in the pre-IPO stage. The Draft Red Herring Prospectus (DRHP) is being prepared and is expected to be filed with SEBI in Q2 FY2026-27. All updates will be published in this section as they become available.
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="bg-blue-500/10 border border-blue-500/30 text-[#2563EB] px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap">
            Expected Filing: Q2 FY2026-27
          </div>
        </div>
      </div>

      {/* Key Disclosures */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">Regulatory Filings & Documents</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-10">
        {[
          { title: "Draft Red Herring Prospectus (DRHP)", status: "In Preparation", date: "Expected Q2 FY2026-27", desc: "The primary offer document containing disclosures about the company, risks, financials, and offer structure." },
          { title: "SEBI Observations Letter", status: "Pending", date: "Post DRHP Filing", desc: "SEBI's letter containing observations and objections (if any) on the draft prospectus." },
          { title: "Red Herring Prospectus (RHP)", status: "Pending", date: "Post SEBI Clearance", desc: "The final prospectus filed after incorporation of SEBI observations, containing offer price band." },
          { title: "Basis of Allotment", status: "Pending", date: "Post IPO Subscription", desc: "Document detailing the allotment methodology and final allocation to applicants." },
          { title: "Listing Application — BSE/NSE", status: "Pending", date: "Post Allotment", desc: "Applications submitted to stock exchanges for listing of equity shares." },
        ].map((item, i) => (
          <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 ${i > 0 ? "border-t border-gray-100" : ""}`}>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-gray-400">{item.date}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                item.status === "In Preparation" ? "bg-blue-50 text-[#2563EB] border-blue-200" : "bg-gray-100 text-gray-500 border-gray-200"
              }`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Offer Structure */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">Proposed Offer Structure</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Offer Type", value: "Book-Built Issue", sub: "IPO with price band" },
          { label: "Proposed Listing", value: "BSE & NSE", sub: "India's primary exchanges" },
          { label: "Lead Managers", value: "To be appointed", sub: "Post DRHP preparation" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Risk Factors Summary */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">Key Risk Factors (Summary)</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">The following are summarized risk factors. Detailed risk disclosures will be published in the DRHP. Prospective investors are advised to read all risk factors carefully before investing.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Competition from established platforms and unorganized local service providers",
            "Dependence on the quality and availability of service professionals on the platform",
            "Regulatory changes affecting gig worker classification and benefits obligations",
            "Technology and cybersecurity risks including data breaches and platform downtime",
            "Geographic concentration risk — significant revenue from top 5 cities",
            "Market adoption risks in Tier 2 and Tier 3 cities",
            "Retention of key management personnel and co-founders",
            "Working capital requirements and future capital raising needs",
          ].map((risk, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              {risk}
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Disclaimer */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-xs text-gray-600 leading-relaxed">
        <p className="font-semibold text-gray-800 mb-2">Statutory Disclaimer</p>
        <p>
          This page is for informational purposes only and does not constitute an offer or invitation to purchase or subscribe to securities. The information presented herein is subject to change without notice and does not constitute any form of commitment by Visvasa Pvt. Ltd. Prospective investors should not rely on this information for making investment decisions. Any public offering of securities will be made only pursuant to a prospectus/offer document that has received regulatory clearance from SEBI. Investment in securities involves risks and investors should read all risk disclosures carefully before investing.
        </p>
      </div>
    </div>
  );
}

export function InvestorRelationsPage({ onBack, onNavigate }: InvestorRelationsPageProps) {
  const [irPage, setIRPage] = useState<IRPage>("home");

  const member = boardMembers.find((b) => `board-${b.id}` === irPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onRegisterContractor={() => onNavigate("register-contractor")}
        onBookService={() => onNavigate("get-started-customer")}
        selectedLocation={null}
        onLocationSelect={() => {}}
        onAMCOffice={() => onNavigate("amc-office")}
        onAMCHome={() => onNavigate("amc-home")}
        onAMCCommercial={() => onNavigate("amc-commercial")}
        onAMCIndustrial={() => onNavigate("amc-industrial")}
        onAMCHealthcare={() => onNavigate("amc-healthcare")}
        onAMCEducational={() => onNavigate("amc-educational")}
        onAMCHospitality={() => onNavigate("amc-hospitality")}
        onAMCSociety={() => onNavigate("amc-society")}
        onHome={onBack}
        onNavigate={onNavigate}
      />

      <IRNav currentPage={irPage} onNavigate={setIRPage} />

      <main className="min-h-[60vh]">
        {irPage === "home" && <IRHome onNavigate={setIRPage} />}
        {irPage === "announcements" && <IRAnnouncements />}
        {irPage === "financials" && <IRFinancials />}
        {irPage === "governance" && <IRGovernance />}
        {irPage === "impact" && <IRImpact />}
        {irPage === "resources" && <IRResources />}
        {irPage === "board" && <IRBoard onNavigate={setIRPage} />}
        {irPage === "ipo" && <IRIPO />}
        {member && <IRBoardMember member={member} onBack={() => setIRPage("board")} />}
      </main>

      <Footer onNavigate={onNavigate} onRegisterContractor={() => onNavigate("register-contractor")} />
    </div>
  );
}
