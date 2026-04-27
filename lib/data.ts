import { BriefcaseBusiness, Handshake, Users } from "lucide-react";

export type ProgramCategory = "IT" | "Business" | "Media" | "Engineering" | "General";

export type Program = {
  title: string;
  nqfLevel: number | null;
  nqfLabel?: string;
  category: ProgramCategory;
  image?: string;
  imageAlt?: string;
};

export type PartnerLogo = {
  name: string;
  src: string;
  alt: string;
};

export type ServiceGroup = {
  title: string;
  intro: string;
  items: readonly string[];
};

export type GalleryItem = {
  title: string;
  src: string;
  alt: string;
  category: ProgramCategory;
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programmes", label: "Programmes" },
  { href: "/gallery", label: "Gallery" },
  { href: "/services", label: "Services" },
  { href: "/apply", label: "Apply" },
  { href: "/contact", label: "Contact" },
];

export const trustItems = [
  { title: "Accredited training provider", description: "Structured learning delivery aligned to recognised standards and measurable outcomes." },
  { title: "Government and corporate partnerships", description: "Trusted collaboration across municipalities, SETAs, corporates, and public institutions." },
  { title: "100% BEE company", description: "Transformation-aligned implementation that supports national development priorities." },
  { title: "Proven skills delivery", description: "Two decades of programme coordination, learner support, and workforce development execution." },
  { title: "Workplace placement success", description: "Practical pathways that connect training to workplace readiness and employer demand." },
];

export const services = [
  "Turnkey Training Solutions",
  "Project Management",
  "Skills Audit",
  "Workplace Skills Plan & Annual Training Report",
  "Quality Management Systems",
  "Workplace Placements",
  "Performance Assessments",
  "Staff Recruitment",
  "Skills Development Facilitation",
  "Management Consulting",
  "Internships",
  "Learnerships",
  "Work Integrated Learning (WIL)",
  "University & TVET Placements",
  "Skills Programmes Training",
] as const;

export const serviceGroups: ServiceGroup[] = [
  {
    title: "Training & Development",
    intro: "Accredited programme delivery focused on practical learning, capability building, and employability outcomes.",
    items: [
      "Turnkey Training Solutions",
      "Internships",
      "Learnerships",
      "Skills Programmes Training",
      "Performance Assessments",
    ],
  },
  {
    title: "Consulting & Compliance",
    intro: "Strategic planning and governance support that keeps workforce development initiatives aligned and execution-ready.",
    items: [
      "Project Management",
      "Skills Audit",
      "Workplace Skills Plan & Annual Training Report",
      "Quality Management Systems",
      "Skills Development Facilitation",
      "Management Consulting",
    ],
  },
  {
    title: "Recruitment & Placement",
    intro: "End-to-end placement support connecting learners, graduates, and institutions to meaningful workplace pathways.",
    items: [
      "Workplace Placements",
      "Staff Recruitment",
      "University & TVET Placements",
      "Work Integrated Learning (WIL)",
    ],
  },
] as const;

export const programs: Program[] = [
  { title: "End User Computing", nqfLevel: 3, category: "IT", image: "/programs/24.jpg", imageAlt: "End User Computing programme" },
  { title: "Technical Support", nqfLevel: 4, category: "IT", image: "/programs/30.jpeg", imageAlt: "Technical Support programme" },
  { title: "Systems Support", nqfLevel: 5, category: "IT", image: "/programs/10.jpg", imageAlt: "Systems Support programme" },
  { title: "Systems Development", nqfLevel: 4, nqfLabel: "NQF 4 & 5", category: "IT", image: "/programs/41.jpeg", imageAlt: "Systems Development programme" },
  { title: "Software Engineer", nqfLevel: 6, category: "IT", image: "/programs/47.jpeg", imageAlt: "Software Engineer programme" },
  { title: "Software Developer", nqfLevel: 5, category: "IT", image: "/programs/48.jpeg", imageAlt: "Software Developer programme" },
  { title: "Cloud Administrator", nqfLevel: 4, category: "IT", image: "/programs/49.jpeg", imageAlt: "Cloud Administrator programme" },
  { title: "Cybersecurity Analyst", nqfLevel: 5, category: "IT", image: "/programs/IMG_2288.jpg", imageAlt: "Cybersecurity Analyst programme" },
  { title: "Computer Technician", nqfLevel: 5, category: "Engineering", image: "/programs/9.jpg", imageAlt: "Computer Technician programme" },
  { title: "Internet of Things Developer", nqfLevel: 4, category: "Engineering", image: "/programs/12.jpg", imageAlt: "Internet of Things Developer programme" },
  { title: "Artificial Intelligence Software Developer", nqfLevel: 6, category: "IT", image: "/programs/13.jpg", imageAlt: "Artificial Intelligence Software Developer programme" },
  { title: "Data Science Practitioner", nqfLevel: 5, category: "IT", image: "/programs/14.jpg", imageAlt: "Data Science Practitioner programme" },
  { title: "Business Administration Services", nqfLevel: 4, category: "Business", image: "/programs/17.jpg", imageAlt: "Business Administration Services programme" },
  { title: "New Venture Creation", nqfLevel: 2, nqfLabel: "NQF 2 & 4", category: "Business", image: "/programs/18.jpg", imageAlt: "New Venture Creation programme" },
  { title: "Contact Centre Support", nqfLevel: 2, category: "Business", image: "/programs/21.jpg", imageAlt: "Contact Centre Support programme" },
  { title: "Generic Management", nqfLevel: 4, nqfLabel: "NQF 4 & 5", category: "Business", image: "/programs/IMG_3130.jpg", imageAlt: "Generic Management programme" },
  { title: "Project Management", nqfLevel: 4, category: "Business", image: "/programs/22.jpg", imageAlt: "Project Management programme" },
  { title: "Film & Television Production", nqfLevel: 4, nqfLabel: "NQF 4 & 5", category: "Media", image: "/programs/IMG_1953.jpg", imageAlt: "Film and Television Production programme" },
  { title: "Microsoft Office Suite", nqfLevel: null, category: "IT", image: "/programs/23.jpg", imageAlt: "Short courses and Microsoft Office Suite training" },
  { title: "CompTIA A+", nqfLevel: null, category: "IT", image: "/programs/23.jpg", imageAlt: "CompTIA A plus short course" },
  { title: "CompTIA N+", nqfLevel: null, category: "IT", image: "/programs/23.jpg", imageAlt: "CompTIA Network plus short course" },
  { title: "ICT Networks", nqfLevel: null, category: "IT", image: "/programs/23.jpg", imageAlt: "ICT Networks short course" },
  { title: "Report Writing", nqfLevel: null, category: "Business", image: "/programs/23.jpg", imageAlt: "Report Writing short course" },
  { title: "Business Plan Development", nqfLevel: null, category: "Business", image: "/programs/23.jpg", imageAlt: "Business Plan Development short course" },
  { title: "Tender Writing", nqfLevel: null, category: "Business", image: "/programs/23.jpg", imageAlt: "Tender Writing short course" },
  { title: "Finance for Non-Financial Managers", nqfLevel: null, category: "Business", image: "/programs/23.jpg", imageAlt: "Finance for Non-Financial Managers short course" },
  { title: "Time Management", nqfLevel: null, category: "General", image: "/programs/23.jpg", imageAlt: "Time Management short course" },
];

export const programGroups: { title: string; description: string; items: Program[] }[] = [
  {
    title: "Information Technology",
    description: "Digital capability programmes covering end-user, infrastructure, development, cloud, cyber, and data pathways.",
    items: programs.filter((program) => program.category === "IT"),
  },
  {
    title: "Business and Management",
    description: "Operational, service, entrepreneurial, and management programmes designed for administration and business growth.",
    items: programs.filter((program) => program.category === "Business" || program.category === "General"),
  },
  {
    title: "Engineering and Technical",
    description: "Hands-on technical training that supports equipment, networks, and applied workplace competence.",
    items: programs.filter((program) => program.category === "Engineering"),
  },
  {
    title: "Media and Creative Delivery",
    description: "Production-focused learning for broadcast, communication, and screen-based workplace environments.",
    items: programs.filter((program) => program.category === "Media"),
  },
];

export const partners: PartnerLogo[] = [
  { name: "MTN", src: "/partners/MTN.png", alt: "MTN logo" },
  { name: "Cue Incident", src: "/partners/CUEINCIDENT.jfif", alt: "Cue Incident logo" },
  { name: "Gauteng Provincial Government", src: "/partners/GAUTENG-PROVINCIAL-GOVERNMENT.png", alt: "Gauteng Provincial Government logo" },
  { name: "MultiChoice", src: "/partners/multichoice-logo.png", alt: "MultiChoice logo" },
  { name: "Cell C", src: "/partners/CELL-C.png", alt: "Cell C logo" },
  { name: "Nuctech", src: "/partners/NUCTECH.png", alt: "Nuctech logo" },
  { name: "SABC", src: "/partners/SABC.png", alt: "SABC logo" },
  { name: "Vuma", src: "/partners/Vuma-new-logo.jpg", alt: "Vuma logo" },
  { name: "Mpumalanga Provincial Government", src: "/partners/MPUMALANGA.png", alt: "Mpumalanga Provincial Government logo" },
  { name: "Nkangala District Municipality", src: "/partners/nkangala-district-municipality_2_orig.png", alt: "Nkangala District Municipality logo" },
  { name: "eThekwini Municipality", src: "/partners/ethekwini-municipality.png", alt: "eThekwini Municipality logo" },
  { name: "Victor Khanye Local Municipality", src: "/partners/VICTOR.jfif", alt: "Victor Khanye Local Municipality logo" },
  { name: "Services SETA", src: "/partners/SERVICES-SETA.jfif", alt: "Services SETA logo" },
  { name: "QCTO", src: "/partners/QCTO.jpg", alt: "Quality Council for Trades and Occupations logo" },
  { name: "CompTIA", src: "/partners/Comptia-partner.png", alt: "CompTIA Authorized Partner logo" },
] as const;

export const featuredPartners = partners.slice(0, 6);

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/p/Limco-Consulting-and-Management-Pty-Ltd-100054248601859/",
  },
] as const;

export const capabilityHighlights = [
  "Accredited learnership and occupational programme delivery",
  "Corporate training aligned to organisational performance goals",
  "Recruitment, placement, and learner support administration",
  "Project implementation for large-scale skills initiatives and short courses",
];

export const aboutPoints = [
  "Limco Consulting and Management is a South African skills development organisation focused on building employability, improving workforce readiness, and supporting inclusive growth.",
  "We partner with employers, institutions, and implementation stakeholders to deliver accredited programmes, practical workplace exposure, and consulting solutions that respond to national development priorities.",
];

export const contactDetails = {
  address: "Johannesburg, South Africa",
  phone: "084 425 6998 / 011 945 4065",
  email: "info@limcoconsulting.co.za",
};

export const applicationSteps = [
  {
    title: "Submit your interest",
    description: "Complete the application form with your personal details, preferred programme, and current status.",
  },
  {
    title: "Screening and review",
    description: "Our team reviews applications against programme criteria and employer or partner requirements.",
  },
  {
    title: "Onboarding and placement",
    description: "Successful candidates receive guidance for enrolment, induction, and workplace readiness.",
  },
];

export const values = [
  {
    title: "Credibility",
    description: "Institutional delivery standards shaped by compliance, accountability, and measurable outcomes.",
    icon: Handshake,
  },
  {
    title: "Inclusion",
    description: "Skills pathways that expand access to opportunity for youth, graduates, and job seekers.",
    icon: Users,
  },
  {
    title: "Workforce Impact",
    description: "Training and consulting designed to strengthen organisations and national capability.",
    icon: BriefcaseBusiness,
  },
];

const galleryTitles = [
  "Graduation Celebration",
  "Learner Recognition",
  "Training Cohort",
  "Workshop Session",
  "Skills Development Event",
  "Programme Showcase",
  "Industry Engagement",
  "Practical Learning Moment",
  "Career Pathway Highlight",
  "Institutional Partnership Event",
];

export const galleryItems: GalleryItem[] = Array.from(
  new Map(
    programs
      .filter((program) => program.image)
      .map((program) => [program.image as string, program]),
  ).values(),
).map((program, index) => ({
  title: `${galleryTitles[index % galleryTitles.length]} ${String(index + 1).padStart(2, "0")}`,
  src: program.image as string,
  alt: program.imageAlt ?? `${program.title} gallery image`,
  category: program.category,
}));
