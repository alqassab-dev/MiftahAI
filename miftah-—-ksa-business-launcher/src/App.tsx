import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Compass, 
  Languages, 
  Send, 
  ChevronRight, 
  Building2, 
  Globe, 
  Wallet, 
  Briefcase,
  ArrowLeft,
  Download,
  CheckCircle2,
  Info,
  ExternalLink,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Lightbulb,
  Target,
  ShieldCheck,
  Zap,
  Key,
  Newspaper,
  LayoutDashboard,
  FileText,
  TrendingUp,
  MapPin
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { getAI, SYSTEM_INSTRUCTION, roadmapSchema, topicsSchema } from './services/ai';
import { Language, BusinessInfo, Roadmap, SectorInsight, QuickTopic, Resource, NewsItem } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CITIES = [
  { id: 'Riyadh', en: 'Riyadh', ar: 'الرياض' },
  { id: 'Jeddah', en: 'Jeddah', ar: 'جدة' },
  { id: 'Dammam', en: 'Dammam', ar: 'الدمام' },
  { id: 'NEOM', en: 'NEOM', ar: 'نيوم' },
  { id: 'AlUla', en: 'AlUla', ar: 'العلا' },
  { id: 'Khobar', en: 'Khobar', ar: 'الخبر' }
];

const SECTOR_INSIGHTS: Record<string, SectorInsight> = {
  tech: {
    title: "Tech & Digital",
    arabicTitle: "التقنية والرقمنة",
    description: "KSA is a regional leader in digital transformation. Focus on MCIT compliance.",
    arabicDescription: "المملكة رائدة إقليمياً في التحول الرقمي. ركز على امتثال وزارة الاتصالات.",
    keyLicense: "CITC / MCIT",
    saudizationLevel: 'Medium',
    marketTrend: "High growth in SaaS and Fintech"
  },
  food: {
    title: "Food & Beverage",
    arabicTitle: "الأغذية والمشروبات",
    description: "Strict health and safety standards. Location is critical for success.",
    arabicDescription: "معايير صحة وسلامة صارمة. الموقع عامل حاسم للنجاح.",
    keyLicense: "Balady / SFDA",
    saudizationLevel: 'High',
    marketTrend: "Rising demand for healthy/organic options"
  },
  retail: {
    title: "Retail",
    arabicTitle: "التجزئة",
    description: "Strong consumer spending. Omnichannel (online + offline) is the future.",
    arabicDescription: "إنفاق استهلاكي قوي. المستقبل للتجارة المتعددة القنوات.",
    keyLicense: "Municipal License",
    saudizationLevel: 'High',
    marketTrend: "Shift towards experiential retail"
  },
  ecommerce: {
    title: "E-Commerce",
    arabicTitle: "التجارة الإلكترونية",
    description: "Fastest growing sector. Integration with ZATCA for e-invoicing is mandatory.",
    arabicDescription: "القطاع الأسرع نمواً. الربط مع هيئة الزكاة للفاتورة الإلكترونية إلزامي.",
    keyLicense: "Maroof / E-Comm License",
    saudizationLevel: 'Low',
    marketTrend: "Focus on last-mile delivery efficiency"
  },
  consulting: {
    title: "Consulting",
    arabicTitle: "الاستشارات",
    description: "Knowledge-based economy. Professional accreditation may be required.",
    arabicDescription: "اقتصاد قائم على المعرفة. قد يتطلب الأمر اعتماداً مهنياً.",
    keyLicense: "Professional License",
    saudizationLevel: 'Medium',
    marketTrend: "Demand for specialized technical consulting"
  }
};

const STATIC_RESOURCES: Resource[] = [
  { name: "Ministry of Commerce", description: "Official portal for CR registration and company laws.", link: "https://mc.gov.sa", category: 'Government' },
  { name: "MISA", description: "Ministry of Investment for foreign investors.", link: "https://misa.gov.sa", category: 'Government' },
  { name: "Monsha'at", description: "SME General Authority providing support and funding.", link: "https://monshaat.gov.sa", category: 'Support' },
  { name: "ZATCA", description: "Zakat, Tax and Customs Authority for VAT and e-invoicing.", link: "https://zatca.gov.sa", category: 'Government' },
  { name: "Salla", description: "Leading KSA e-commerce platform to launch your store.", link: "https://salla.sa", category: 'Tools' },
  { name: "Foodics", description: "Cloud-based POS and restaurant management system.", link: "https://foodics.com", category: 'Tools' },
];

const GUIDE_TOPICS = [
  { 
    id: 'register', 
    icon: "🏢", 
    title: "Register a Company", 
    arabicTitle: "تسجيل شركة", 
    desc: "Learn everything about register a company in Saudi Arabia.", 
    arabicDesc: "تعلم كل شيء عن تسجيل الشركات في المملكة العربية السعودية.",
    content: `### How to Register a Company in KSA
1. **Choose Business Type**: LLC is most common for expats; Sole Proprietorship for Saudis.
2. **Reserve Trade Name**: Done via Ministry of Commerce (MC) portal.
3. **Articles of Association**: Draft and sign electronically.
4. **Issue CR**: Commercial Registration is issued instantly after payment.
5. **Chamber of Commerce**: Automatic membership upon CR issuance.

**Pro-Tip**: Use the "Meras" service for a unified registration experience.`,
    arabicContent: `### كيفية تسجيل شركة في السعودية
1. **اختيار نوع العمل**: شركة ذات مسؤولية محدودة هي الأكثر شيوعاً للأجانب؛ مؤسسة فردية للسعوديين.
2. **حجز الاسم التجاري**: يتم عبر بوابة وزارة التجارة.
3. **عقد التأسيس**: صياغته وتوقيعه إلكترونياً.
4. **إصدار السجل التجاري**: يصدر فوراً بعد السداد.
5. **الغرفة التجارية**: اشتراك تلقائي عند صدور السجل.

**نصيحة**: استخدم خدمة "مراس" للحصول على تجربة تسجيل موحدة.`
  },
  { 
    id: 'cr', 
    icon: "📄", 
    title: "Get a CR Number", 
    arabicTitle: "الحصول على سجل تجاري", 
    desc: "Learn everything about get a cr number in Saudi Arabia.", 
    arabicDesc: "تعلم كل شيء عن الحصول على السجل التجاري في المملكة العربية السعودية.",
    content: `### Commercial Registration (CR) Guide
The CR is your business's primary identity document.
- **Cost**: 200 SAR/year for main, 100 SAR/year for sub-CR.
- **Validity**: 1 to 5 years.
- **Requirements**: Valid Absher account, national address, and a unique trade name.

**Pro-Tip**: Ensure your business activity matches the ISIC4 codes correctly to avoid licensing issues later.`,
    arabicContent: `### دليل السجل التجاري
السجل التجاري هو وثيقة الهوية الأساسية لعملك.
- **التكلفة**: 200 ريال/سنة للسجل الرئيسي، 100 ريال/سنة للفرعي.
- **الصلاحية**: من سنة إلى 5 سنوات.
- **المتطلبات**: حساب أبشر فعال، عنوان وطني، واسم تجاري فريد.

**نصيحة**: تأكد من مطابقة نشاطك التجاري مع أكواد ISIC4 بشكل صحيح لتجنب مشاكل الترخيص لاحقاً.`
  },
  { 
    id: 'misa', 
    icon: "🌍", 
    title: "MISA License", 
    arabicTitle: "ترخيص ميزا (MISA)", 
    desc: "Learn everything about misa license in Saudi Arabia.", 
    arabicDesc: "تعلم كل شيء عن تراخيص الاستثمار الأجنبي في المملكة العربية السعودية.",
    content: `### MISA (Investment) License
Required for non-GCC investors.
- **Types**: Service, Industrial, Trading, Real Estate, etc.
- **Benefits**: 100% foreign ownership in most sectors.
- **Process**: Apply via MISA portal with your company's financial statements and legal docs.

**Pro-Tip**: Check for "Entrepreneur Licenses" if you are a startup; they have lower capital requirements.`,
    arabicContent: `### ترخيص وزارة الاستثمار (MISA)
مطلوب للمستثمرين من خارج دول مجلس التعاون الخليجي.
- **الأنواع**: خدمي، صناعي، تجاري، عقاري، إلخ.
- **المزايا**: ملكية أجنبية بنسبة 100% في معظم القطاعات.
- **العملية**: التقديم عبر بوابة MISA مع القوائم المالية والوثائق القانونية.

**نصيحة**: ابحث عن "تراخيص رواد الأعمال" إذا كنت شركة ناشئة؛ فلها متطلبات رأس مال أقل.`
  },
  { id: 'food', icon: "🍽️", title: "Food Business License", arabicTitle: "رخصة نشاط غذائي", desc: "Learn everything about food business license in Saudi Arabia.", arabicDesc: "تعلم كل شيء عن تراخيص الأنشطة الغذائية في المملكة العربية السعودية.", content: "Detailed guide for Food & Beverage licensing coming soon...", arabicContent: "دليل مفصل لتراخيص الأغذية والمشروبات قريباً..." },
  { id: 'ecomm', icon: "🛒", title: "E-Commerce Setup", arabicTitle: "إعداد التجارة الإلكترونية", desc: "Learn everything about e-commerce setup in Saudi Arabia.", arabicDesc: "تعلم كل شيء عن إعداد التجارة الإلكترونية في المملكة العربية السعودية.", content: "Detailed guide for E-Commerce setup coming soon...", arabicContent: "دليل مفصل لإعداد التجارة الإلكترونية قريباً..." },
  { id: 'budget', icon: "💰", title: "Minimum Budget", arabicTitle: "الحد الأدنى للميزانية", desc: "Learn everything about minimum budget in Saudi Arabia.", arabicDesc: "تعلم كل شيء عن الحد الأدنى للميزانية المطلوبة في المملكة العربية السعودية.", content: "Detailed budget breakdown coming soon...", arabicContent: "تفاصيل الميزانية قريباً..." },
  { id: 'women', icon: "👩", title: "Women Entrepreneurs", arabicTitle: "سيدات الأعمال", desc: "Learn everything about women entrepreneurs in Saudi Arabia.", arabicDesc: "تعلم كل شيء عن دعم سيدات الأعمال في المملكة العربية السعودية.", content: "Support programs for women entrepreneurs coming soon...", arabicContent: "برامج دعم سيدات الأعمال قريباً..." },
  { id: 'vision', icon: "🇸🇦", title: "Vision 2030 Sectors", arabicTitle: "قطاعات رؤية 2030", desc: "Learn everything about vision 2030 sectors in Saudi Arabia.", arabicDesc: "تعلم كل شيء عن القطاعات المستهدفة في رؤية 2030.", content: "Priority sectors under Vision 2030 coming soon...", arabicContent: "القطاعات ذات الأولوية في رؤية 2030 قريباً..." },
];

const VISION_NEWS: NewsItem[] = [
  {
    id: '1',
    title: "New SME Funding Initiative Launched",
    arabicTitle: "إطلاق مبادرة جديدة لتمويل المنشآت الصغيرة والمتوسطة",
    date: "March 10, 2026",
    category: "Funding",
    arabicCategory: "تمويل",
    summary: "Monsha'at announces a new 2B SAR fund to support tech startups in Riyadh.",
    arabicSummary: "منشآت تعلن عن صندوق جديد بقيمة 2 مليار ريال لدعم الشركات التقنية الناشئة في الرياض.",
    link: "https://monshaat.gov.sa"
  },
  {
    id: '2',
    title: "MISA Simplifies Foreign License Process",
    arabicTitle: "وزارة الاستثمار تبسط إجراءات التراخيص الأجنبية",
    date: "March 5, 2026",
    category: "Regulation",
    arabicCategory: "أنظمة",
    summary: "The time to issue a MISA license has been reduced to 24 hours for qualified applicants.",
    arabicSummary: "تم تقليص وقت إصدار ترخيص MISA إلى 24 ساعة للمتقدمين المؤهلين.",
    link: "https://misa.gov.sa"
  }
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'chat' | 'wizard' | 'topics' | 'resources' | 'about' | 'news'>('about');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Chat state
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    idea: '',
    nationality: 'saudi',
    city: 'Riyadh',
    budget: 'small',
    sector: 'tech'
  });
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const roadmapRef = useRef<HTMLDivElement>(null);

  // Topics state
  const [quickTopics, setQuickTopics] = useState<QuickTopic[]>([]);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isTyping) return;

    const newMessages = [...messages, { role: 'user' as const, content: messageText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const ai = getAI();
      const chat = ai.chats.create({
        model: "gemini-3.1-pro-preview",
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      
      const response = await chat.sendMessage({ message: messageText });
      setMessages([...newMessages, { role: 'ai', content: response.text || '' }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'ai', content: lang === 'en' ? "Sorry, I encountered an error. Please try again." : "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const ai = getAI();
      const prompt = `Generate a detailed KSA business roadmap with PHASES for:
        Idea: ${businessInfo.idea}
        Nationality: ${businessInfo.nationality}
        City: ${businessInfo.city}
        Budget: ${businessInfo.budget}
        Sector: ${businessInfo.sector}
        Provide detailed phases, steps, costs in SAR, and recommended suppliers. Language: ${lang === 'en' ? 'English' : 'Arabic'}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: roadmapSchema as any
        }
      });

      const data = JSON.parse(response.text || '{}');
      setRoadmap(data);
      setWizardStep(3);
      generateQuickTopics();
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const generateQuickTopics = async () => {
    setIsGeneratingTopics(true);
    try {
      const ai = getAI();
      const prompt = `Based on this business idea: "${businessInfo.idea}", generate 5 quick topics/concepts that are critical for success in the Saudi market. Language: ${lang === 'en' ? 'English' : 'Arabic'}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: topicsSchema as any
        }
      });

      setQuickTopics(JSON.parse(response.text || '[]'));
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingTopics(false);
    }
  };

  const generatePitchDeck = async () => {
    // Removed
  };

  const handleDownloadPDF = async () => {
    if (!roadmapRef.current) return;
    
    setIsDownloadingPDF(true);
    try {
      const element = roadmapRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#050505',
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('[data-pdf-content]') as HTMLElement;
          if (el) {
            el.style.padding = '40px';
            el.style.background = '#050505';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Miftah-Roadmap-${businessInfo.city}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const t = {
    en: {
      appName: "Miftah",
      tagline: "KSA Business Launcher",
      chat: "Open Chat",
      wizard: "Launch Plan",
      topics: "Quick Topics",
      resources: "Resources",
      about: "About Us",
      news: "Vision News",
      estimator: "Cost Estimator",
      send: "Send",
      typing: "Miftah is thinking...",
      startWizard: "Start Your Journey",
      next: "Next",
      back: "Back",
      generate: "Generate Roadmap",
      ideaLabel: "What is your business idea?",
      ideaPlaceholder: "e.g. A specialty coffee shop in Riyadh...",
      natLabel: "Nationality",
      cityLabel: "City",
      budgetLabel: "Budget Range",
      sectorLabel: "Sector",
      roadmapTitle: "Your KSA Launch Roadmap",
      phases: "Phases",
      suppliers: "Recommended Suppliers",
      advice: "Expert Advice",
      qrTitle: "Try it on Mobile",
      saudi: "Saudi National",
      gcc: "GCC National",
      expat: "Expat / Foreign Investor",
      micro: "Micro (< 5k SAR)",
      small: "Small (5k - 50k SAR)",
      medium: "Medium (50k - 200k SAR)",
      large: "Large (> 200k SAR)",
      visionTitle: "Supporting Vision 2030",
      visionDesc: "Miftah is designed to empower the next generation of Saudi entrepreneurs, contributing to the Kingdom's goal of increasing SME contribution to GDP to 35% by 2030.",
      aboutApp: "About Miftah",
      aboutAppDesc: "Miftah is your intelligent gateway to the Saudi Arabian business ecosystem. We simplify the complex journey of starting a business through AI-driven roadmaps, real-time advice, and localized insights.",
      trustedData: "Trusted Data",
      trustedDataDesc: "Our AI models are trained on official KSA government portals and local market data to ensure accuracy and compliance.",
      rapidLaunch: "Rapid Launch",
      rapidLaunchDesc: "Reduce your time-to-market from months to weeks by following our optimized, phase-driven roadmaps.",
    },
    ar: {
      appName: "مفتاح",
      tagline: "مطلق الأعمال السعودي",
      chat: "محادثة مفتوحة",
      wizard: "خطة الإطلاق",
      topics: "مواضيع سريعة",
      resources: "الموارد",
      about: "من نحن",
      news: "أخبار الرؤية",
      estimator: "حاسبة التكاليف",
      send: "إرسال",
      typing: "مفتاح يفكر...",
      startWizard: "ابدأ رحلتك",
      next: "التالي",
      back: "رجوع",
      generate: "إنشاء خارطة الطريق",
      generatePitch: "إنشاء العرض التقديمي",
      ideaLabel: "ما هي فكرة مشروعك؟",
      ideaPlaceholder: "مثال: مقهى مختص في الرياض...",
      natLabel: "الجنسية",
      cityLabel: "المدينة",
      budgetLabel: "ميزانية المشروع",
      sectorLabel: "القطاع",
      roadmapTitle: "خارطة طريق إطلاق مشروعك",
      phases: "المراحل",
      suppliers: "الموردين المقترحين",
      advice: "نصيحة الخبير",
      qrTitle: "جربه على الجوال",
      saudi: "مواطن سعودي",
      gcc: "مواطن خليجي",
      expat: "مقيم / مستثمر أجنبي",
      micro: "متناهي الصغر (< 5 آلاف ريال)",
      small: "صغير (5 - 50 ألف ريال)",
      medium: "متوسط (50 - 200 ألف ريال)",
      large: "كبير (> 200 ألف ريال)",
      visionTitle: "دعم رؤية 2030",
      visionDesc: "تم تصميم مفتاح لتمكين الجيل القادم من رواد الأعمال السعوديين، والمساهمة في هدف المملكة المتمثل في زيادة مساهمة المنشآت الصغيرة والمتوسطة في الناتج المحلي الإجمالي إلى 35٪ بحلول عام 2030.",
      aboutApp: "عن مفتاح",
      aboutAppDesc: "مفتاح هو بوابتك الذكية لمنظومة الأعمال في المملكة العربية السعودية. نحن نبسط الرحلة المعقدة لبدء عمل تجاري من خلال خرائط طريق مدفوعة بالذكاء الاصطناعي، ونصائح فورية، ورؤى محلية.",
      trustedData: "بيانات موثوقة",
      trustedDataDesc: "يتم تدريب نماذج الذكاء الاصطناعي لدينا على البوابات الحكومية الرسمية في المملكة وبيانات السوق المحلية لضمان الدقة والامتثال.",
      rapidLaunch: "إطلاق سريع",
      rapidLaunchDesc: "قلل وقت وصولك إلى السوق من شهور إلى أسابيع باتباع خرائط الطريق المحسنة والمدفوعة بالمراحل.",
    }
  }[lang];

  return (
    <div className={cn("flex h-screen overflow-hidden bg-[#0B1220] text-[#EDE8DC]", lang === 'ar' && "font-arabic")} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar Backdrop for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 0, 
          opacity: isSidebarOpen ? 1 : 0,
          x: isSidebarOpen ? 0 : (lang === 'ar' ? 280 : -280)
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed lg:relative z-50 flex-shrink-0 h-full bg-[#111827] border-e border-white/5 overflow-hidden",
          !isSidebarOpen && "pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full p-6 w-[280px]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ksa-gold to-ksa-teal flex items-center justify-center text-white shadow-lg shadow-ksa-gold/20">
              <Key size={24} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-ksa-gold">{t.appName}</h1>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">{t.tagline}</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {[
              { id: 'about', icon: Info, label: t.about },
              { id: 'chat', icon: MessageSquare, label: t.chat },
              { id: 'wizard', icon: LayoutDashboard, label: t.wizard },
              { id: 'topics', icon: Lightbulb, label: t.topics },
              { id: 'news', icon: Newspaper, label: t.news },
              { id: 'resources', icon: BookOpen, label: t.resources },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  activeTab === item.id 
                    ? "bg-ksa-gold/10 text-ksa-gold neon-border" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(activeTab === item.id ? "text-ksa-gold" : "text-white/40 group-hover:text-white/60")} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/5">
              <button 
                onClick={() => setLang('en')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider",
                  lang === 'en' ? "bg-ksa-gold text-black shadow-lg shadow-ksa-gold/20" : "text-white/40 hover:text-white/60"
                )}
              >
                <span>EN</span>
              </button>
              <button 
                onClick={() => setLang('ar')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-xs font-bold font-arabic",
                  lang === 'ar' ? "bg-ksa-teal text-white shadow-lg shadow-ksa-teal/20" : "text-white/40 hover:text-white/60"
                )}
              >
                <span>العربية</span>
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden w-full">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#0B1220]/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 text-white/60 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ksa-gold to-ksa-teal flex items-center justify-center text-white">
                <Key size={18} />
              </div>
              <h1 className="text-lg font-display font-bold text-ksa-gold">{t.appName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">AI Advisor Active</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col max-w-4xl mx-auto w-full"
              >
                <div className="flex-1 p-4 md:p-8 space-y-6">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-10">
                      <div className="space-y-6 opacity-40">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto">
                          <MessageSquare size={32} className="md:size-[40px]" />
                        </div>
                        <div className="px-4">
                          <h2 className="text-xl md:text-2xl font-display font-bold mb-2">{lang === 'en' ? 'Welcome to Miftah' : 'مرحباً بك في مفتاح'}</h2>
                          <p className="max-w-md mx-auto text-sm md:text-base">
                            {lang === 'en' 
                              ? 'Your AI gateway to the Saudi market. Ask me anything about registration, licenses, or local regulations.' 
                              : 'بوابتك الذكية للسوق السعودي. اسألني عن أي شيء يخص التسجيل، التراخيص، أو الأنظمة المحلية.'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-3xl w-full px-4">
                        {GUIDE_TOPICS.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => {
                              setActiveTab('topics');
                              setSelectedTopicId(topic.id);
                            }}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-ksa-gold/30 hover:bg-ksa-gold/5 transition-all text-center space-y-2 group"
                          >
                            <span className="text-2xl block group-hover:scale-110 transition-transform">{topic.icon}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider block text-white/60 group-hover:text-ksa-gold">
                              {lang === 'en' ? topic.title : topic.arabicTitle}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        msg.role === 'user' ? "bg-white/10" : "bg-gradient-to-br from-ksa-gold to-ksa-teal"
                      )}>
                        {msg.role === 'user' ? <Briefcase size={16} /> : <Sparkles size={16} />}
                      </div>
                      <div className={cn(
                        "max-w-[80%] px-5 py-4 rounded-2xl text-sm leading-relaxed",
                        msg.role === 'user' 
                          ? "bg-white/5 border border-white/10 rounded-tr-none" 
                          : "bg-white/5 border border-ksa-gold/20 rounded-tl-none"
                      )}>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ksa-gold to-ksa-teal flex items-center justify-center flex-shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div className="bg-white/5 border border-ksa-gold/20 px-5 py-4 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-ksa-gold animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-ksa-gold animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-ksa-gold animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 md:p-8 pt-0">
                  <div className="relative group">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      placeholder={lang === 'en' ? "Ask Miftah..." : "اسأل مفتاح..."}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 md:px-6 py-4 pr-14 md:pr-16 focus:outline-none focus:border-ksa-gold/50 transition-all resize-none h-14 min-h-[56px] text-sm md:text-base"
                    />
                    <button 
                      onClick={() => handleSendMessage()}
                      disabled={!input.trim() || isTyping}
                      className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-ksa-gold text-black flex items-center justify-center hover:bg-ksa-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'wizard' && (
              <motion.div 
                key="wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 md:p-8 max-w-4xl mx-auto w-full"
              >
                {!roadmap ? (
                  <div className="space-y-6 md:space-y-10">
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-4xl font-display font-bold">{t.wizard}</h2>
                      <p className="text-white/40 text-sm md:text-base">{lang === 'en' ? 'Let\'s build your customized Saudi business launch strategy in 3 simple steps.' : 'لنقم ببناء استراتيجية إطلاق عملك المخصصة في السعودية في 3 خطوات بسيطة.'}</p>
                    </div>

                    <div className="flex gap-2 mb-6 md:mb-10">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", s <= wizardStep ? "bg-ksa-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" : "bg-white/10")} />
                      ))}
                    </div>

                    <div className="p-6 md:p-10 rounded-3xl md:rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                      {wizardStep === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-8">
                          <div className="space-y-4">
                            <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-ksa-gold">{t.ideaLabel}</label>
                            <textarea 
                              value={businessInfo.idea}
                              onChange={(e) => setBusinessInfo({ ...businessInfo, idea: e.target.value })}
                              placeholder={t.ideaPlaceholder}
                              className="w-full h-32 md:h-40 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 focus:border-ksa-gold outline-none transition-all text-base md:text-lg resize-none"
                            />
                          </div>
                          <button 
                            disabled={!businessInfo.idea}
                            onClick={() => setWizardStep(2)}
                            className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-ksa-gold text-black font-bold text-base md:text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                          >
                            <span>{t.next}</span>
                            <ChevronRight size={20} />
                          </button>
                        </motion.div>
                      )}

                      {wizardStep === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 md:space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-4">
                              <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-ksa-gold">{t.natLabel}</label>
                              <div className="space-y-2">
                                {['saudi', 'gcc', 'expat'].map((n) => (
                                  <button
                                    key={n}
                                    onClick={() => setBusinessInfo({ ...businessInfo, nationality: n as any })}
                                    className={cn(
                                      "w-full p-3 md:p-4 rounded-xl border text-left transition-all text-sm md:text-base",
                                      businessInfo.nationality === n ? "bg-ksa-gold/10 border-ksa-gold text-ksa-gold" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                                    )}
                                  >
                                    {t[n as keyof typeof t]}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-ksa-gold">{t.cityLabel}</label>
                              <select 
                                value={businessInfo.city}
                                onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                                className="w-full p-3 md:p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-ksa-gold transition-all text-sm md:text-base"
                              >
                                {CITIES.map(c => (
                                  <option key={c.id} value={c.id} className="bg-neutral-900">
                                    {lang === 'en' ? c.en : c.ar}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <button onClick={() => setWizardStep(1)} className="flex-1 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all text-sm md:text-base">{t.back}</button>
                            <button onClick={() => setWizardStep(3)} className="flex-[2] py-3 md:py-4 rounded-xl bg-ksa-gold text-black font-bold hover:scale-[1.02] transition-all text-sm md:text-base">{t.next}</button>
                          </div>
                        </motion.div>
                      )}

                      {wizardStep === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 md:space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-4">
                              <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-ksa-gold">{t.budgetLabel}</label>
                              <div className="grid grid-cols-1 gap-2">
                                {['micro', 'small', 'medium', 'large'].map((b) => (
                                  <button
                                    key={b}
                                    onClick={() => setBusinessInfo({ ...businessInfo, budget: b as any })}
                                    className={cn(
                                      "w-full p-3 md:p-4 rounded-xl border text-left transition-all text-sm md:text-base",
                                      businessInfo.budget === b ? "bg-ksa-gold/10 border-ksa-gold text-ksa-gold" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                                    )}
                                  >
                                    {t[b as keyof typeof t]}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-ksa-gold">{t.sectorLabel}</label>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(SECTOR_INSIGHTS).map(([key, sector]) => (
                                  <button
                                    key={key}
                                    onClick={() => setBusinessInfo({ ...businessInfo, sector: key as any })}
                                    className={cn(
                                      "p-3 md:p-4 rounded-xl border text-center transition-all text-xs md:text-sm font-bold",
                                      businessInfo.sector === key ? "bg-ksa-gold/10 border-ksa-gold text-ksa-gold" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                                    )}
                                  >
                                    {lang === 'en' ? sector.title : sector.arabicTitle}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <button onClick={() => setWizardStep(2)} className="flex-1 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all text-sm md:text-base">{t.back}</button>
                            <button 
                              onClick={generateRoadmap}
                              disabled={isGeneratingRoadmap}
                              className="flex-[2] py-3 md:py-4 rounded-xl bg-ksa-gold text-black font-bold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                              {isGeneratingRoadmap ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                              ) : (
                                <Sparkles size={20} />
                              )}
                              <span>{t.generate}</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <button onClick={() => setRoadmap(null)} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                          <ArrowLeft size={16} />
                          <span>{t.back}</span>
                        </button>
                        <h2 className="text-3xl font-display font-bold text-ksa-gold">{t.roadmapTitle}</h2>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={handleDownloadPDF}
                          disabled={isDownloadingPDF}
                          className="px-6 py-3 rounded-xl bg-ksa-gold text-black text-sm font-bold hover:scale-[1.05] transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                        >
                          {isDownloadingPDF ? (
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          ) : (
                            <Download size={18} />
                          )}
                          <span>{lang === 'en' ? (isDownloadingPDF ? 'Generating...' : 'Download PDF') : (isDownloadingPDF ? 'جاري التحميل...' : 'تحميل PDF')}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8" ref={roadmapRef} data-pdf-content>
                      <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        {roadmap.phases.map((phase, i) => (
                          <div key={i} className="p-6 md:p-8 rounded-3xl md:rounded-[32px] bg-white/5 border border-white/10 space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                              <span className="text-6xl md:text-8xl font-display font-black">{i + 1}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-ksa-gold/10 text-ksa-gold flex items-center justify-center font-display font-bold text-lg md:text-xl">
                                  {i + 1}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold">{phase.name}</h3>
                              </div>
                              <div className="self-start sm:self-auto px-4 py-2 rounded-xl bg-ksa-gold/10 border border-ksa-gold/20 text-ksa-gold font-bold text-sm">
                                {phase.estimatedCost}
                              </div>
                            </div>
                            <p className="text-sm text-white/40 max-w-xl">{phase.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {phase.steps.map((step, j) => (
                                <div key={j} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <CheckCircle2 size={18} className="text-ksa-teal mt-0.5 shrink-0" />
                                  <div className="space-y-1">
                                    <span className="text-sm font-bold text-white/80 block">{step.title}</span>
                                    <span className="text-xs text-white/40 block">{step.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-6 md:space-y-8">
                        {/* Integrated Cost Estimator */}
                        <div className="p-6 md:p-8 rounded-3xl md:rounded-[32px] bg-gradient-to-br from-[#111827] to-[#0B1220] border border-ksa-gold/20 space-y-6 md:space-y-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-ksa-gold/5 blur-3xl rounded-full" />
                          <div className="relative flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-ksa-gold/10 text-ksa-gold">
                              <Wallet size={24} />
                            </div>
                            <h3 className="text-xl font-bold">{t.estimator}</h3>
                          </div>
                          <div className="relative space-y-4 md:space-y-6">
                            {roadmap.phases.map((phase, idx) => (
                              <div key={idx} className="flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-ksa-gold transition-colors">
                                    <CheckCircle2 size={16} />
                                  </div>
                                  <span className="text-white/60 text-sm truncate max-w-[120px] md:max-w-[150px]">{phase.name}</span>
                                </div>
                                <span className="font-bold text-sm">{phase.estimatedCost}</span>
                              </div>
                            ))}
                            
                            <div className="pt-6 border-t border-white/10">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-ksa-gold uppercase tracking-widest text-xs">{lang === 'en' ? 'Total Estimate' : 'الإجمالي التقديري'}</span>
                                <span className="text-xl md:text-2xl font-display font-bold text-white">{roadmap.totalEstimatedCost}</span>
                              </div>
                            </div>
                          </div>
                          <p className="relative text-[10px] text-white/20 italic text-center">
                            * {lang === 'en' ? 'Estimates tailored to your specific budget and business type.' : 'تقديرات مخصصة لميزانيتك ونوع عملك المحدد.'}
                          </p>
                        </div>

                        <div className="p-6 md:p-8 rounded-3xl md:rounded-[32px] bg-white/5 border border-white/10 space-y-6">
                          <div className="flex items-center gap-3">
                            <Briefcase className="text-ksa-teal" />
                            <h3 className="text-xl font-bold">{t.suppliers}</h3>
                          </div>
                          <div className="space-y-3">
                            {roadmap.suppliers.map((s, i) => (
                              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-ksa-teal/30 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-sm group-hover:text-ksa-teal transition-colors">{s.name}</span>
                                  <ChevronRight size={14} className="text-white/20 group-hover:text-ksa-teal transition-all" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-6 md:p-8 rounded-3xl md:rounded-[32px] bg-ksa-gold/5 border border-ksa-gold/10 space-y-4">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="text-ksa-gold" />
                            <h3 className="text-lg font-bold">{t.advice}</h3>
                          </div>
                          <p className="text-sm text-white/70 leading-relaxed italic">"{roadmap.advice}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'topics' && (
              <motion.div 
                key="topics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 max-w-5xl mx-auto w-full space-y-10"
              >
                {selectedTopicId ? (
                  <div className="space-y-8">
                    <button 
                      onClick={() => setSelectedTopicId(null)}
                      className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={16} />
                      <span>{t.back}</span>
                    </button>
                    
                    {(() => {
                      const topic = GUIDE_TOPICS.find(t => t.id === selectedTopicId);
                      if (!topic) return null;
                      return (
                        <div className="space-y-6 md:space-y-8">
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 text-center sm:text-left">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/5 flex items-center justify-center text-4xl md:text-5xl shrink-0">
                              {topic.icon}
                            </div>
                            <div className="space-y-2">
                              <h2 className="text-2xl md:text-4xl font-display font-bold text-ksa-gold">{lang === 'en' ? topic.title : topic.arabicTitle}</h2>
                              <p className="text-sm md:text-base text-white/40">{lang === 'en' ? topic.desc : topic.arabicDesc}</p>
                            </div>
                          </div>
                          
                          <div className="p-6 md:p-10 rounded-3xl md:rounded-[40px] bg-white/5 border border-white/10 prose prose-invert prose-sm md:prose-lg max-w-none">
                            <ReactMarkdown>
                              {lang === 'en' ? topic.content : topic.arabicContent}
                            </ReactMarkdown>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-display font-bold flex items-center gap-3">
                        <Lightbulb className="text-ksa-gold" />
                        <span>{t.topics}</span>
                      </h2>
                      <p className="text-white/40 max-w-2xl">
                        {lang === 'en' 
                          ? "Deep dives into essential Saudi business requirements. Explore our comprehensive guides to navigate the Kingdom's regulatory landscape."
                          : "تعمق في متطلبات الأعمال الأساسية في السعودية. استكشف أدلتنا الشاملة للتنقل في المشهد التنظيمي للمملكة."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {GUIDE_TOPICS.map((topic, i) => (
                        <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-ksa-gold/20 transition-all space-y-6 flex flex-col group">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                            {topic.icon}
                          </div>
                          <div className="space-y-3 flex-1">
                            <h3 className="text-xl font-bold text-ksa-gold">{lang === 'en' ? topic.title : topic.arabicTitle}</h3>
                            <p className="text-sm text-white/60 leading-relaxed">
                              {lang === 'en' ? topic.desc : topic.arabicDesc}
                            </p>
                          </div>
                          <button 
                            onClick={() => setSelectedTopicId(topic.id)}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-ksa-gold hover:text-black hover:border-ksa-gold transition-all"
                          >
                            {lang === 'en' ? 'Read Guide' : 'اقرأ الدليل'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* AI Generated Topics Section */}
                {quickTopics.length > 0 && (
                  <div className="pt-10 space-y-8 border-t border-white/5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold flex items-center gap-3">
                        <Sparkles className="text-ksa-teal" size={20} />
                        <span>{lang === 'en' ? 'AI Generated Insights' : 'رؤى مولدة بالذكاء الاصطناعي'}</span>
                      </h3>
                      <p className="text-sm text-white/40">Tailored specifically to your business idea.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {quickTopics.map((topic, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-ksa-teal/5 border border-ksa-teal/10 space-y-3">
                          <h4 className="font-bold text-ksa-teal">{topic.title}</h4>
                          <p className="text-sm text-white/60">{topic.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div 
                key="resources"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-6 md:space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
                    <BookOpen className="text-ksa-teal" />
                    <span>{t.resources}</span>
                  </h2>
                  <p className="text-sm md:text-base text-white/40">Essential tools, portals, and organizations to support your launch.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {STATIC_RESOURCES.map((res, i) => (
                    <a 
                      key={i} 
                      href={res.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-ksa-teal/30 hover:bg-ksa-teal/5 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                          {res.category}
                        </div>
                        <ExternalLink size={16} className="text-white/20 group-hover:text-ksa-teal transition-colors" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{res.name}</h3>
                      <p className="text-sm text-white/60 leading-relaxed">{res.description}</p>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div 
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-8 md:space-y-12"
              >
                <div className="space-y-4 md:space-y-6 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-ksa-gold to-ksa-teal flex items-center justify-center text-white mx-auto shadow-2xl shadow-ksa-gold/20">
                    <Key size={32} className="md:size-[40px]" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-display font-bold">{t.aboutApp}</h2>
                  <p className="text-base md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
                    {t.aboutAppDesc}
                  </p>
                </div>

                <div className="p-6 md:p-10 rounded-3xl md:rounded-[40px] bg-gradient-to-br from-[#111827] to-[#0B1220] border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-ksa-gold/10 blur-[100px] rounded-full" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-ksa-teal/10 blur-[100px] rounded-full" />
                  
                  <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
                    <div className="flex-1 space-y-6 md:space-y-8">
                      <div className="flex items-center gap-4">
                        <Target className="text-ksa-gold md:size-[32px]" size={24} />
                        <h3 className="text-xl md:text-3xl font-display font-bold">{t.visionTitle}</h3>
                      </div>
                      <p className="text-base md:text-lg text-white/70 leading-relaxed">
                        {t.visionDesc}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 md:pt-6">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                          <div className="text-xl md:text-2xl font-display font-bold text-ksa-gold">35%</div>
                          <div className="text-[8px] uppercase tracking-widest text-white/40">SME GDP Contribution</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                          <div className="text-xl md:text-2xl font-display font-bold text-ksa-teal">1M+</div>
                          <div className="text-[8px] uppercase tracking-widest text-white/40">New Jobs Target</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                          <div className="text-xl md:text-2xl font-display font-bold text-ksa-gold">#1</div>
                          <div className="text-[8px] uppercase tracking-widest text-white/40">Regional Tech Hub</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                    <ShieldCheck className="text-ksa-teal" size={24} />
                    <h4 className="text-lg md:text-xl font-bold">{t.trustedData}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {t.trustedDataDesc}
                    </p>
                  </div>
                  <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                    <Zap className="text-ksa-gold" size={24} />
                    <h4 className="text-lg md:text-xl font-bold">{t.rapidLaunch}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {t.rapidLaunchDesc}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'news' && (
              <motion.div 
                key="news"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-6 md:space-y-10"
              >
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
                    <Newspaper className="text-ksa-teal" />
                    <span>{t.news}</span>
                  </h2>
                  <p className="text-sm md:text-base text-white/40">{lang === 'en' ? 'Stay updated on the latest business initiatives and regulatory changes in the Kingdom.' : 'ابق على اطلاع بآخر مبادرات الأعمال والتغييرات التنظيمية في المملكة.'}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {VISION_NEWS.map((news) => (
                    <a 
                      key={news.id} 
                      href={news.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5 hover:border-ksa-teal/30 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-ksa-teal/10 text-ksa-teal text-[10px] font-bold uppercase tracking-wider">
                            {lang === 'en' ? news.category : news.arabicCategory}
                          </span>
                          <span className="text-xs text-white/20">{news.date}</span>
                        </div>
                        <ExternalLink size={16} className="text-white/20 group-hover:text-ksa-teal transition-colors" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-ksa-teal transition-colors">
                        {lang === 'en' ? news.title : news.arabicTitle}
                      </h3>
                      <p className="text-sm md:text-base text-white/60 leading-relaxed">
                        {lang === 'en' ? news.summary : news.arabicSummary}
                      </p>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Footer */}
        <footer className="p-4 border-t border-white/5 bg-[#0B1220]/50 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/20 font-medium">
            <span>&copy; 2026 Miftah AI</span>
            <span className="hidden sm:inline">•</span>
            <span>Vision 2030 Partner</span>
          </div>
          
          <div className="flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/5 lg:hidden">
            <button 
              onClick={() => setLang('en')}
              className={cn(
                "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                lang === 'en' ? "bg-ksa-gold text-black" : "text-white/40"
              )}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('ar')}
              className={cn(
                "px-3 py-1 rounded-md text-[10px] font-bold font-arabic transition-all",
                lang === 'ar' ? "bg-ksa-teal text-white" : "text-white/40"
              )}
            >
              العربية
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
