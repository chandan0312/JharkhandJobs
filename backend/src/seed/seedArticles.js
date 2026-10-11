// ---------------------------------------------------------------------------
// Seed Articles & Career Blog Guides
// ---------------------------------------------------------------------------

import { initDb, Article } from '../models/index.js'
import { closeDatabase } from '../config/db.js'

export const SEED_ARTICLES = [
  {
    id: 'art-how-to-apply-jssc-ssc-2026',
    title: 'How to Apply Online for JSSC & SSC CGL 2026: Step-by-Step Application Guide',
    slug: 'how-to-apply-jssc-ssc-cgl-2026-step-by-step',
    category: 'how-to-apply',
    excerpt: 'Avoid common rejection reasons! Learn the complete step-by-step procedure for one-time registration (OTR), photograph specifications, fee payment, and final submission.',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
    author: 'Er. Sandeep Kumar',
    authorRole: 'Senior Recruitment Analyst',
    readTime: '6 min read',
    tags: ['JSSC', 'SSC CGL', 'How To Apply', 'OTR Registration', 'Govt Jobs Guide'],
    status: 'published',
    featured: true,
    views: 1420,
    metaTitle: 'How to Apply Online for JSSC & SSC CGL 2026: Step-by-Step Guide',
    metaDescription: 'Complete step-by-step tutorial on applying online for JSSC & SSC CGL 2026. Includes photo size, signature guidelines, document upload, and fee payment instructions.',
    content: `<h2>Mastering the Online Application Process for Govt Exams</h2>
<p>Filling out government recruitment forms can often feel daunting. A single mistake in your name spelling, date of birth, category selection, or photograph dimensions can lead to immediate rejection during scrutiny or document verification.</p>

<div class="rjt-callout" style="border-left: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.08); padding: 14px 18px; border-radius: 8px; margin: 16px 0;">
  <strong>⚠️ Caution Before You Begin:</strong> Ensure you have an active mobile number and email ID that you will maintain accessible for at least the next 2 years throughout the recruitment cycle.
</div>

<h3>Step 1: One-Time Registration (OTR)</h3>
<p>Both state commissions (like JSSC / JPSC) and central commissions (like SSC / UPSC) require candidates to complete a One-Time Registration before applying for any active advertisement.</p>
<ul>
  <li>Visit the official commission portal (e.g. <code>jssc.jharkhand.gov.in</code> or <code>ssc.gov.in</code>).</li>
  <li>Click on <strong>"Register Now"</strong> / <strong>"New Candidate Registration"</strong>.</li>
  <li>Enter your basic details: Aadhaar Number, Matriculation (10th) Roll Number, Year of Passing, and Board Name.</li>
  <li>Verify your mobile number and email address with OTP.</li>
</ul>

<h3>Step 2: Uploading Photo & Signature with Exact Specifications</h3>
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; text-align: left;">
  <thead>
    <tr style="border-bottom: 2px solid #cbd5e1; background: rgba(100, 116, 139, 0.1);">
      <th style="padding: 10px;">Document</th>
      <th style="padding: 10px;">Format</th>
      <th style="padding: 10px;">File Size</th>
      <th style="padding: 10px;">Key Requirements</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px;">Passport Photograph</td>
      <td style="padding: 10px;">JPEG / JPG</td>
      <td style="padding: 10px;">20 KB to 50 KB</td>
      <td style="padding: 10px;">Plain white backdrop, no spectacles, no caps, both ears clearly visible.</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px;">Candidate Signature</td>
      <td style="padding: 10px;">JPEG / JPG</td>
      <td style="padding: 10px;">10 KB to 20 KB</td>
      <td style="padding: 10px;">Black ink on white unruled paper. Do not write in capital letters!</td>
    </tr>
  </tbody>
</table>

<h3>Step 3: Post & Exam Center Preferences</h3>
<p>Carefully choose post preferences based on your physical standards, educational qualifications, and departmental vacancies. Double-check your chosen exam city centers in order of proximity.</p>

<h3>Step 4: Fee Payment & Confirmation Slip</h3>
<p>Pay the prescribed application fee via Net Banking, UPI, or Credit/Debit card. Note down the transaction reference number. Always download and store a copy of the final submitted Application Form PDF.</p>`,
  },
  {
    id: 'art-how-to-download-admit-card-guide',
    title: 'How to Download Govt Exam Admit Card & Exam City Slip Online',
    slug: 'how-to-download-govt-exam-admit-card-city-slip',
    category: 'how-to-download',
    excerpt: 'Lost your registration number or unable to find the login portal? Follow our comprehensive checklist to retrieve login credentials and download call letters without errors.',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
    author: 'Pooja Verma',
    authorRole: 'Examination Coordinator',
    readTime: '5 min read',
    tags: ['Admit Card', 'Call Letter', 'Exam City Slip', 'Hall Ticket', 'Troubleshooting'],
    status: 'published',
    featured: true,
    views: 980,
    metaTitle: 'How to Download Govt Exam Admit Card & Exam City Slip Online',
    metaDescription: 'Step-by-step guide to downloading admit cards, city intimation slips, and retrieving forgotten registration numbers for competitive examinations.',
    content: `<h2>Everything You Need to Know About Downloading Hall Tickets</h2>
<p>Admit cards (also known as Hall Tickets or E-Call Letters) are typically released 3 to 10 days before the scheduled exam date, while preliminary Exam City Intimation slips are released 10 to 14 days in advance so candidates can arrange travel.</p>

<h3>Prerequisites for Downloading Your Admit Card</h3>
<ul>
  <li><strong>Application / Registration Number</strong> (Check your registration SMS or email search keyword <em>"Registration"</em>).</li>
  <li><strong>Date of Birth (DOB)</strong> or Candidate Password.</li>
  <li>Security Captcha Code displayed on screen.</li>
</ul>

<h3>What to Do If You Forgot Your Registration Number?</h3>
<ol>
  <li>Navigate to the official portal login page and click <strong>"Forgot Registration ID"</strong>.</li>
  <li>Enter your registered email address or mobile number along with your 10th class roll number.</li>
  <li>A reset link or your registration number will be dispatched to your phone and email instantly.</li>
</ol>

<div class="rjt-callout" style="border-left: 4px solid #10b981; background: rgba(16, 185, 129, 0.08); padding: 14px 18px; border-radius: 8px; margin: 16px 0;">
  <strong>💡 Pro Tip:</strong> Always print at least <strong>2 color copies</strong> of your admit card. Ensure the barcode and your photograph are crisp and legible.
</div>

<h3>Critical Checklist on Your Admit Card</h3>
<p>Once downloaded, inspect these details immediately:</p>
<ul>
  <li>Correct spelling of your name and father's name.</li>
  <li>Roll Number & Registration ID match your application.</li>
  <li>Exact examination center venue code and reporting time.</li>
  <li>Mandatory photo ID required (Original Aadhaar Card, PAN Card, or Voter ID).</li>
</ul>`,
  },
  {
    id: 'art-document-verification-master-checklist',
    title: 'Document Verification (DV) Master Checklist for State & Central Govt Jobs',
    slug: 'document-verification-checklist-govt-jobs',
    category: 'documentation',
    excerpt: 'Detailed checklist of mandatory original certificates, caste/EWS affidavits, NOCs, and character certificates required during final stage document verification.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',
    author: 'Job Alert X Editorial Team',
    authorRole: 'Legal & Verification Cell',
    readTime: '7 min read',
    tags: ['Document Verification', 'Caste Certificate', 'EWS', 'OBC NCL', 'Govt Jobs'],
    status: 'published',
    featured: false,
    views: 1250,
    metaTitle: 'Govt Job Document Verification Checklist: Original Certificates & Affidavits',
    metaDescription: 'Complete checklist for govt job document verification (DV). Formats for OBC-NCL, EWS, SC/ST, domicile, character certificate, and name discrepancy affidavits.',
    content: `<h2>Surviving Document Verification: Common Pitfalls & Complete Checklist</h2>
<p>Reaching the Document Verification (DV) round represents the culmination of months or years of intense preparation. Do not let minor paperwork inconsistencies jeopardize your appointment.</p>

<h3>1. Essential Academic Credentials (Originals + 3 Self-Attested Photocopies)</h3>
<ul>
  <li><strong>Matriculation (10th) Certificate & Marksheet:</strong> Serves as primary proof of date of birth and father's name.</li>
  <li><strong>Intermediate (10+2) Certificate & Marksheet.</strong></li>
  <li><strong>Graduation / Degree Certificate & Consolidated Marksheet:</strong> Provisional degree certificate is accepted if original degree has not been convocation-issued.</li>
</ul>

<h3>2. Category & Reservation Certificates</h3>
<p>Ensure your certificates are issued in the prescribed format by a competent authority (CO, SDO, or DC):</p>
<ul>
  <li><strong>OBC (Non-Creamy Layer):</strong> Must have been issued within the financial year specified in the recruitment advertisement.</li>
  <li><strong>EWS (Economically Weaker Section):</strong> Valid for the recruitment year based on gross annual family income.</li>
  <li><strong>SC / ST Certificate:</strong> Caste validity certificate as recognized in the state list.</li>
  <li><strong>Local Domicile / Residential Certificate:</strong> Mandatory for state reservation benefits (e.g. Jharkhand State Residents).</li>
</ul>

<h3>3. Affidavits for Name Spelling Discrepancies</h3>
<p>If your name has a minor spelling discrepancy (e.g. space variations like "Kumar" vs "Kr") across your Aadhaar and 10th certificate, obtain a <strong>First Class Executive Magistrate Affidavit</strong> declaring that both names pertain to the same individual.</p>`,
  },
  {
    id: 'art-jpsc-prelims-strategy-study-plan',
    title: 'JPSC Combined Civil Services Prelims: 6-Month Subject-wise Study Plan & Strategy',
    slug: 'jpsc-civil-services-prelims-6-month-strategy',
    category: 'strategy',
    excerpt: 'Comprehensive roadmap for cracking JPSC Prelims Paper 1 (General Studies) and Paper 2 (Jharkhand Specific GS). Books, mock strategy, and revision schedules.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80',
    author: 'Rajesh Mukherjee',
    authorRole: 'Ex-Civil Services Educator',
    readTime: '8 min read',
    tags: ['JPSC', 'Civil Services', 'Strategy', 'Jharkhand GS', 'Exam Preparation'],
    status: 'published',
    featured: true,
    views: 2100,
    metaTitle: 'JPSC Civil Services Prelims Strategy: 6-Month Subject-wise Plan',
    metaDescription: 'Detailed preparation plan for JPSC Civil Services Prelims. Master Paper 1 and Jharkhand General Studies Paper 2 with proven subject-wise strategy.',
    content: `<h2>Cracking the JPSC Civil Services Prelims Examination</h2>
<p>The Jharkhand Public Service Commission (JPSC) Combined Civil Services Prelims consists of two papers of 200 marks each, with <strong>Paper 2 dedicated entirely to Jharkhand General Knowledge</strong> (100 questions, 200 marks). This makes Jharkhand GS the ultimate decider for prelims qualification.</p>

<h3>Exam Pattern Breakdown</h3>
<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
  <thead>
    <tr style="border-bottom: 2px solid #cbd5e1; background: rgba(100, 116, 139, 0.1);">
      <th style="padding: 10px;">Paper</th>
      <th style="padding: 10px;">Subject</th>
      <th style="padding: 10px;">Questions</th>
      <th style="padding: 10px;">Marks</th>
      <th style="padding: 10px;">Duration</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px;">Paper 1</td>
      <td style="padding: 10px;">General Studies (Indian History, Polity, Economy, Geography, Science)</td>
      <td style="padding: 10px;">100 Qs</td>
      <td style="padding: 10px;">200 Marks</td>
      <td style="padding: 10px;">2 Hours</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px;">Paper 2</td>
      <td style="padding: 10px;">Jharkhand Specific General Studies (History, CNT/SPT Acts, Tribes, Geography)</td>
      <td style="padding: 10px;">100 Qs</td>
      <td style="padding: 10px;">200 Marks</td>
      <td style="padding: 10px;">2 Hours</td>
    </tr>
  </tbody>
</table>

<h3>Mastering Paper 2: High-Yield Topics</h3>
<ol>
  <li><strong>Chota Nagpur Tenancy Act (CNT Act 1908) & Santhal Pargana Tenancy Act (SPT Act 1949):</strong> Guarantees 12 questions (24 marks). Study basic chapters, restrictions on tribal land alienation, and recent amendments.</li>
  <li><strong>Tribal Movements & Jharkhand Freedom Fighters:</strong> Birsa Munda, Tilka Manjhi, Sidho-Kanho, and Jatra Bhagat.</li>
  <li><strong>Jharkhand Government Policies & Welfare Schemes:</strong> Guruji Student Credit Card, Abua Awas Yojana, and industrial promotion policies.</li>
</ol>

<h3>Mock Test & Revision Architecture</h3>
<p>Attempt at least 25 full-length mock tests during the final 60 days before the exam. Focus specifically on analyzing negative markings and time allocation.</p>`,
  },
  {
    id: 'art-understanding-normalization-cutoffs',
    title: 'Decoding Normalization, Percentile & Cut-Off Marks in Competitive Exams',
    slug: 'understanding-normalization-percentile-cutoff-calculation',
    category: 'result',
    excerpt: 'Ever wondered why your raw score differed from your normalized marks? Here is a simple, transparent explanation of how multi-shift exam normalization formulas operate.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    author: 'Job Alert X Editorial Team',
    authorRole: 'Statistical Analysis Desk',
    readTime: '5 min read',
    tags: ['Normalization', 'Cut-off Marks', 'Exam Analysis', 'Percentile Score'],
    status: 'published',
    featured: false,
    views: 890,
    metaTitle: 'How Normalization and Cut-Off Marks are Calculated in Govt Exams',
    metaDescription: 'Understand how normalization formulas, standard deviation, and mean shift scores work in multi-session exams like SSC, Railway, and Banking.',
    content: `<h2>Why Is Normalization Necessary?</h2>
<p>When millions of applicants compete for government vacancies, exams cannot be conducted in a single sitting. Over multiple days and shifts, minor variations in difficulty level across question paper sets are inevitable.</p>
<p>Normalization ensures that a candidate who faced a tougher paper is not penalized relative to someone who took an easier paper.</p>

<h3>How the Standard Normalization Formula Works</h3>
<p>Most premier testing agencies (including SSC, NTA, and RRB) utilize a formula grounded in standard deviation and mean shift scores:</p>

<div class="rjt-callout" style="background: rgba(59, 130, 246, 0.08); border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 8px; margin: 16px 0;">
  <strong>Key Principle:</strong> Your normalized score reflects how well you performed relative to the top 0.1% performers in your specific shift compared to all other shifts combined.
</div>

<h3>Factors That Do NOT Affect Normalization</h3>
<ul>
  <li><strong>Individual Accuracy Percentage:</strong> Normalization does not reward or penalize based on your personal ratio of correct vs incorrect attempts. It evaluates your raw net mark.</li>
  <li><strong>Time Spent per Question:</strong> Time telemetry is not incorporated in standard normalization formulas.</li>
</ul>`,
  },
]

export async function seedArticles() {
  console.log('🔄 Initializing database and syncing Article table...')
  await initDb({ sync: true, alter: true })

  console.log(`📝 Seeding ${SEED_ARTICLES.length} career guide articles...`)
  for (const articleData of SEED_ARTICLES) {
    await Article.upsert(articleData)
  }

  console.log('✅ Articles seeded successfully!')
}

// Allow direct execution: `node backend/src/seed/seedArticles.js`
if (process.argv[1]?.endsWith('seedArticles.js')) {
  seedArticles()
    .then(async () => {
      await closeDatabase()
      process.exit(0)
    })
    .catch(async (err) => {
      console.error('❌ Failed to seed articles:', err)
      await closeDatabase()
      process.exit(1)
    })
}
