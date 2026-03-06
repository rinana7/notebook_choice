
import { GoogleGenAI, Type } from "@google/genai";
import { Book, GradeLevel } from "../types";

const SYSTEM_PROMPT = `あなたは「受験生の参考書整理」を専門にする学習コーチAIです。
目的は、参考書が多すぎて迷っている受験生に対して、「今やるべき1冊」だけを明確に決めることです。

以下の判断ルールを厳守してください：
- 参考書の中から「今週やるべき1冊」を必ず1つ選ぶ。
- 他の参考書は「今はやらない」と断定的に判断する。
- 判断理由は最大3行、断定的に書く。
- 迷わせる表現（「場合によっては」「〜もあり得る」など）は絶対に使わない。
- 受験対策では、問題演習型を優先する。
- 「全部大事」「どれも必要」とは絶対に言わない。
- 学年、志望校、学部・学位、および重点的に強化したい教科を考慮し、最適な1冊を選出する。
- 同じ内容が重複していそうな参考書は1冊に絞る。

出力形式は必ず以下に従うこと：

【今やる1冊】
書名（教科）

【理由】
・理由1
・理由2
・理由3（必要な場合のみ）

【今はやらない】
- 書名：一言理由
- 書名：一言理由`;

export const getCoachAdvice = async (
  books: Book[],
  targetCollege: string,
  targetDegree: string,
  gradeLevel: GradeLevel,
  subjectsToImprove: string[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const gradeText = {
    hs1: '高校1年生',
    hs2: '高校2年生',
    hs3: '高校3年生',
    other: '既卒・その他'
  }[gradeLevel];

  const booksList = books
    .map((b) => `- ${b.title} (${b.subject})`)
    .join('\n');

  const prompt = `
志望校：${targetCollege}
志望学部・学位：${targetDegree}
現在の学年：${gradeText}
重点的に強化したい教科：${subjectsToImprove.length > 0 ? subjectsToImprove.join('、') : '特に指定なし'}
参考書の一覧：
${booksList}

上記の情報を元に、受験生の志望や弱点を踏まえ、「今週やるべき1冊」を厳選し、他の参考書を切り捨ててください。
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    return response.text || "申し訳ありません。判定できませんでした。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AIコーチとの通信に失敗しました。時間をおいて再度お試しください。");
  }
};

export const extractBooksFromImage = async (base64Data: string, mimeType: string): Promise<{ title: string; subject: string }[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "この写真に写っている学習参考書をすべて特定し、その「書名」と「教科（英語、数学、国語、物理、化学、生物、日本史、世界史、地理、公共、情報、その他）」を抽出してください。",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            books: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subject: { type: Type.STRING },
                },
                required: ["title", "subject"],
              },
            },
          },
          required: ["books"],
        },
      },
    });

    const json = JSON.parse(response.text || '{"books":[]}');
    return json.books || [];
  } catch (error) {
    console.error("Image Analysis Error:", error);
    throw new Error("画像の解析に失敗しました。明るい場所で撮り直すか、手動で入力してください。");
  }
};
