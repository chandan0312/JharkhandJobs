import https from 'https';
import http from 'http';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Clean HTML to save tokens
const cleanHtmlForAi = (html) => {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Fetch page contents with redirect support
export const fetchUrlContent = (url) => {
  return new Promise((resolve, reject) => {
    try {
      const client = url.startsWith('https') ? https : http;
      client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
      }, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectUrl = res.headers.location;
          if (!redirectUrl.startsWith('http')) {
            const urlObj = new URL(url);
            redirectUrl = `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
          }
          return fetchUrlContent(redirectUrl).then(resolve).catch(reject);
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Failed to load page: HTTP ${res.statusCode}`));
          return;
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      }).on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const extractContentWithAi = async (url, category, examName) => {
  const html = await fetchUrlContent(url);
  const cleanedHtml = cleanHtmlForAi(html);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `
You are an AI assistant for a Government Job Portal. Your task is to extract only useful information from the webpage HTML provided and structure it.

Context:
- Selected Category: "${category}"
- Selected Exam / Job Title: "${examName}"
- Webpage HTML Content (cleaned):
---
${cleanedHtml}
---

Your responsibilities:
1. Read the complete webpage.
2. Ignore: advertisements, navigation menu, footer, related posts, comments, social links, unnecessary HTML elements.
3. Extract only official information.
4. Extract each job position, vacancy class, exam post, or individual notice entry as a separate item in the "items" array. If only one job/post/notice is discussed on the page, the "items" array should contain exactly one item.
5. Never hallucinate. If information is unavailable, return null.
6. Dates must always be converted into 'YYYY-MM-DD' format. If only month/day/year is found, format it strictly as 'YYYY-MM-DD'.
7. Generate a clean SEO friendly description of 300-600 words summarizing this update. Keep it highly professional and rich in details.
8. Generate a short summary of 100-150 words.
9. Generate SEO Meta Title.
10. Generate Meta Description under 160 characters.
11. Generate relevant keywords as a flat list.
12. Extract every important date (Application Start, Application Last, Exam, Admit Card, Result, Answer Key, etc.).
13. Extract every important link.
14. Extract eligibility criteria, vacancy count, and status for each position/notice.
15. Preserve official wording whenever possible.
16. Never create fake data.

Return ONLY a valid JSON object matching this schema. Do not write any markdown wrappers (like \`\`\`json) or extra text.

JSON Schema to return:
{
  "organization": "string or null (e.g. JSSC, JPSC, RRB, SSC, etc.)",
  "orgShort": "string or null (abbreviation, e.g. JSSC, JPSC)",
  "contentType": "string (e.g. Job, Admit Card, Result, Answer Key, Admission, Notification)",
  "items": [
    {
      "jobPosition": "string or null (Specific post name, e.g. Constable, Sub-Inspector, Junior Clerk, etc.)",
      "category": "string (Allowed values: 'Jharkhand Board', 'SSC', 'Bank', 'Railway', 'Defence', 'Admit Card', 'Results', 'Answer Key', 'Upcoming Exams', 'Admission', 'Notification', 'Other')",
      "eligibility": "string or null (Educational, physical, or general eligibility details)",
      "location": "string or null (e.g. Jharkhand, India)",
      "lastDate": "YYYY-MM-DD or null (Last date for application or submission)",
      "vacancies": "string/number or null (Count of vacancies/posts, e.g. 4919)",
      "status": "string or null (Status badge label, e.g. Active, Apply Online, Admit Card Out, Result Out, Notice Out)",
      "salary": "string or null (Salary range/level details)",
      "description": "string or null (Brief detail / summary specific to this position)"
    }
  ],
  "importantDates": {
    "applicationStart": "YYYY-MM-DD or null",
    "applicationLast": "YYYY-MM-DD or null",
    "examDate": "YYYY-MM-DD or null",
    "admitCardDate": "YYYY-MM-DD or null",
    "resultDate": "YYYY-MM-DD or null",
    "answerKeyDate": "YYYY-MM-DD or null",
    "otherDates": [
      { "dateLabel": "string", "dateValue": "YYYY-MM-DD" }
    ]
  },
  "importantLinks": [
    { "linkName": "string", "linkUrl": "string" }
  ],
  "fullDescription": "string (300-600 words)",
  "summary": "string (100-150 words)",
  "seo": {
    "metaTitle": "string or null",
    "metaDescription": "string (under 160 characters) or null",
    "keywords": ["string"]
  }
}
`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  let responseText = result.response.text().trim();
  if (responseText.startsWith('```')) {
    responseText = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/g, '').trim();
  }

  return JSON.parse(responseText);
};
