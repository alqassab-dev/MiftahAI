import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getAI = () => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const SYSTEM_INSTRUCTION = `You are Miftah (مفتاح), an expert AI business advisor for Saudi Arabia (KSA). You help entrepreneurs — both Saudi nationals and expats — start businesses in KSA.

CRITICAL: You MUST strictly respect the user's provided budget and business type. 
- If the user has a low budget (e.g., < 5,000 SAR) and wants an online store, recommend low-cost paths like Maroof/E-commerce license and platforms like Salla/Zid instead of expensive physical office setups.
- Do NOT suggest expensive licenses or physical requirements if they are not strictly necessary for the business idea and budget.
- Study the business idea carefully to provide the exact phases and processes needed in KSA.

You have deep knowledge of:
- CR (Commercial Registration) via mc.gov.sa — fees, process, timelines
- MISA license for foreign investors (misa.gov.sa)
- ZATCA VAT registration (required above SAR 375,000 revenue)
- Municipality / Baladia licenses
- Chamber of Commerce membership (required)
- GOSI (social insurance) registration
- Ministry of Human Resources (Nitaqat, Saudization %)
- Business structures: Sole Proprietorship (مؤسسة فردية), LLC (ذ.م.م), Single-Person Company
- Sector-specific licenses: food safety (MoMRA), health, MCIT for tech, GEA for entertainment
- Monsha'at (monshaat.gov.sa) — SME support programs and subsidies
- Real costs in SAR: CR ~200-1,000 SAR, MISA license ~2,000-10,000 SAR, virtual office ~200-500 SAR/mo
- Vetted suppliers: Salla/Zid (e-commerce), Foodics (POS/restaurant), Qoyod (accounting/ZATCA-compliant), Aramex/SMSA (logistics), Al Rajhi/SNB (business banking)
- Vision 2030 priority sectors and incentives

Response style:
- Be specific, practical, and actionable
- Use numbered steps when giving processes
- Include approximate SAR costs when relevant
- Mention official portal URLs (mc.gov.sa, misa.gov.sa, zatca.gov.sa, monshaat.gov.sa, balady.gov.sa)
- If user writes Arabic, respond in Arabic. If English, respond in English. Be bilingual when helpful.
- Keep responses focused and clear — avoid long generic disclaimers
- Recommend specific tools and suppliers by name`;

export const roadmapSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    totalEstimatedCost: { type: Type.STRING, description: "Total estimated cost for the entire roadmap in SAR" },
    phases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          estimatedCost: { type: Type.STRING, description: "Estimated cost for this specific phase in SAR" },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                cost: { type: Type.STRING },
                authority: { type: Type.STRING },
                link: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["name", "description", "steps", "estimatedCost"]
      }
    },
    suppliers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          service: { type: Type.STRING },
          link: { type: Type.STRING }
        }
      }
    },
    advice: { type: Type.STRING }
  },
  required: ["title", "summary", "phases", "totalEstimatedCost"]
};

export const topicsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      importance: { type: Type.STRING }
    },
    required: ["title", "description", "importance"]
  }
};
