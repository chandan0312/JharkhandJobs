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

  // ── 6 New Jharkhand-Specific High-Value Articles ────────────────────────────
  {
    id: 'art-jssc-cgl-online-form-guide-2026',
    title: 'How to Apply for JSSC CGL (JGGLCCE) Online Form 2026: Complete Step-by-Step Registration Guide',
    slug: 'jssc-cgl-jgglcce-online-form-apply-step-by-step-guide-2026',
    category: 'how-to-apply',
    excerpt: 'Detailed step-by-step guide for filling the JSSC CGL (JGGLCCE) 2026 online application form — from OTR registration and document uploads to fee payment and final submission on jssc.jharkhand.gov.in.',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
    author: 'Jharkhand JobAlert X Editorial Team',
    authorRole: 'Jharkhand Recruitment Specialist',
    readTime: '8 min read',
    tags: ['JSSC CGL', 'JGGLCCE 2026', 'How to Apply', 'Jharkhand Jobs', 'JSSC Registration', 'Online Form'],
    status: 'published',
    featured: true,
    views: 3200,
    metaTitle: 'JSSC CGL 2026 Online Form: Step-by-Step Application Guide | Jharkhand JobAlert X',
    metaDescription: 'Complete guide to applying for JSSC CGL (JGGLCCE) 2026 online form. Covers OTR registration, photo/signature upload specifications, post preferences, fee payment, and form submission on jssc.jharkhand.gov.in.',
    content: `<h2>JSSC CGL 2026 (JGGLCCE): Complete Online Application Guide</h2>
<p>The Jharkhand Staff Selection Commission Combined Graduate Level Combined Competitive Examination (JGGLCCE), commonly known as JSSC CGL, is one of the most sought-after competitive examinations for graduate-level government jobs in Jharkhand. This guide walks you through every step of the online application process on the official JSSC portal: <strong>jssc.jharkhand.gov.in</strong>.</p>

<div style="border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08); padding: 14px 18px; border-radius: 8px; margin: 16px 0;">
  <strong>⚠️ Important:</strong> Always refer to the official JSSC notification PDF for the most current eligibility criteria, fee structure, and application dates. This guide reflects the general JGGLCCE application process; specific cycles may have minor variations.
</div>

<h3>Step 1: Check Eligibility Before Applying</h3>
<p>Before starting your application, confirm you meet these basic requirements:</p>
<ul>
  <li><strong>Educational Qualification:</strong> Bachelor's Degree (any stream) from a UGC-recognized university.</li>
  <li><strong>Age Limit:</strong> Generally 21 to 35 years (as on the cutoff date). Age relaxation applies: SC/ST: 5 years; OBC: 3 years; PwD: 10 years; Ex-Servicemen as per rules.</li>
  <li><strong>Jharkhand Domicile:</strong> Jharkhand State Residential Certificate (domicile) is mandatory for Jharkhand Local Reservation benefits (BC-I, BC-II, SC, ST reservations).</li>
  <li><strong>Knowledge of Hindi:</strong> Candidates must have studied Hindi up to Matriculation (10th) level.</li>
</ul>

<h3>Step 2: One-Time Registration (OTR) on JSSC Portal</h3>
<ol>
  <li>Open the official JSSC portal: <strong>jssc.jharkhand.gov.in</strong>.</li>
  <li>Click on <strong>"Candidate Registration"</strong> or <strong>"New User? Register Here"</strong>.</li>
  <li>Enter your <strong>Name, Father's Name, Date of Birth</strong> (exactly as in your Matriculation certificate), Aadhaar number, and 10th class Roll Number.</li>
  <li>Enter your <strong>mobile number</strong> (active for OTP) and <strong>email address</strong>.</li>
  <li>Verify both via OTPs sent to your phone and email.</li>
  <li>Note your <strong>Registration ID</strong> and set a strong password. Store both securely.</li>
</ol>

<h3>Step 3: Photo and Signature Upload Specifications</h3>
<table style="width:100%; border-collapse:collapse; margin:16px 0; text-align:left;">
  <thead>
    <tr style="border-bottom:2px solid #cbd5e1; background:rgba(100,116,139,0.1);">
      <th style="padding:10px;">Document</th>
      <th style="padding:10px;">Format</th>
      <th style="padding:10px;">Max Size</th>
      <th style="padding:10px;">Dimensions</th>
      <th style="padding:10px;">Key Rules</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">Passport Photograph</td>
      <td style="padding:10px;">JPEG</td>
      <td style="padding:10px;">50 KB</td>
      <td style="padding:10px;">200×230 pixels</td>
      <td style="padding:10px;">White background, face clearly visible, no spectacles, recent (within 3 months)</td>
    </tr>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">Signature</td>
      <td style="padding:10px;">JPEG</td>
      <td style="padding:10px;">20 KB</td>
      <td style="padding:10px;">140×60 pixels</td>
      <td style="padding:10px;">Black ink on white unruled paper, no capital letters, not scribbly</td>
    </tr>
    <tr>
      <td style="padding:10px;">Left Thumb Impression</td>
      <td style="padding:10px;">JPEG</td>
      <td style="padding:10px;">20 KB</td>
      <td style="padding:10px;">140×60 pixels</td>
      <td style="padding:10px;">Clear impression in blue ink; no smudging</td>
    </tr>
  </tbody>
</table>

<h3>Step 4: Filling the Application Form — Post Preferences</h3>
<p>After logging in with your registration credentials, click <strong>"Apply for JGGLCCE"</strong> in the active advertisement section. Fill in:</p>
<ul>
  <li>Personal Details: Name, DOB, gender, category (SC/ST/OBC-I/OBC-II/EWS/Unreserved).</li>
  <li>Residential/Domicile Status: Jharkhand state resident with district of residence.</li>
  <li>Educational Qualification: University name, degree, year of passing, division/CGPA.</li>
  <li>Post Preferences: Choose your preferred posts in order of preference.</li>
  <li>Exam Center Preferences: Choose up to 3 exam centers from the available districts.</li>
</ul>

<h3>Step 5: Application Fee Payment</h3>
<p>Pay the prescribed application fee via the online payment gateway:</p>
<ul>
  <li><strong>General / OBC / EWS:</strong> ₹100 per post (typical; verify in official notification).</li>
  <li><strong>SC / ST of Jharkhand:</strong> ₹25 per post.</li>
  <li><strong>PwD Candidates:</strong> Fee waiver applies (check notification).</li>
  <li>Payment modes: Net Banking, UPI (GPay, PhonePe), Debit/Credit Card.</li>
</ul>
<p>After successful payment, you will receive a <strong>Transaction ID</strong>. Note it down immediately.</p>

<h3>Step 6: Review, Submit & Print</h3>
<ol>
  <li>Carefully review your entire form — once submitted, no edits are typically allowed.</li>
  <li>Click <strong>"Final Submit"</strong> to lock in your application.</li>
  <li>Download and print your <strong>Application Confirmation Page</strong> — keep it safely until final selection.</li>
</ol>

<div style="border-left:4px solid #10b981; background:rgba(16,185,129,0.08); padding:14px 18px; border-radius:8px; margin:16px 0;">
  <strong>✅ Pro Tip from Our Editorial Team:</strong> Save your application form PDF and take a screenshot of the payment confirmation screen. Many candidates lose their details after the portal session expires.
</div>

<h3>Important Documents to Keep Ready</h3>
<ul>
  <li>10th (Matriculation) Certificate & Marksheet (proof of DOB, name spelling)</li>
  <li>12th / Intermediate Certificate</li>
  <li>Bachelor's Degree Certificate & Consolidated Marksheet</li>
  <li>Jharkhand Residential / Domicile Certificate</li>
  <li>Caste Certificate (SC/ST/OBC) — format as prescribed by Jharkhand Government</li>
  <li>EWS Certificate (if applicable) for the current financial year</li>
  <li>Aadhaar Card</li>
  <li>Recent Passport-size Photographs (min. 6 copies)</li>
</ul>

<h3>Official JSSC Links</h3>
<ul>
  <li>JSSC Official Website: <a href="https://jssc.jharkhand.gov.in" target="_blank" rel="noopener noreferrer">jssc.jharkhand.gov.in</a></li>
  <li>JSSC Candidate Registration Portal: <a href="https://jssc.jharkhand.gov.in" target="_blank" rel="noopener noreferrer">Login/Register Here</a></li>
</ul>
<p><em>Source: Verified from official JSSC portal and past JGGLCCE recruitment notifications. Last reviewed by Jharkhand JobAlert X Editorial Team.</em></p>`,
  },

  {
    id: 'art-jpsc-cce-syllabus-breakdown-2026',
    title: 'JPSC Combined Civil Services Prelims & Mains Syllabus Breakdown 2026: Paper-wise Topic Analysis',
    slug: 'jpsc-combined-civil-services-prelims-mains-syllabus-breakdown-2026',
    category: 'syllabus',
    excerpt: 'Complete topic-wise breakdown of the JPSC Civil Services Prelims (Paper I & II) and Mains (Paper I to VI) syllabus with high-weightage topics, recommended books, and preparation strategy.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80',
    author: 'Jharkhand JobAlert X Editorial Team',
    authorRole: 'Civil Services Exam Analyst',
    readTime: '10 min read',
    tags: ['JPSC Syllabus', 'JPSC Prelims', 'JPSC Mains', 'Civil Services Jharkhand', 'JPSC 2026', 'Jharkhand GS'],
    status: 'published',
    featured: true,
    views: 4100,
    metaTitle: 'JPSC Civil Services Prelims & Mains Syllabus 2026 — Paper-wise Topic Analysis',
    metaDescription: 'Full syllabus breakdown for JPSC Combined Civil Services (Prelims Paper I & II, Mains Paper I–VI). Includes Jharkhand-specific GS topics, high-weightage areas, and recommended books.',
    content: `<h2>JPSC Combined Civil Services Examination: Syllabus Deep Dive</h2>
<p>The Jharkhand Public Service Commission (JPSC) Combined Civil Services Examination (CCE) is the state's premier competitive exam for IAS-equivalent state civil services posts including Deputy Collector, SDPO, Block Development Officer (BDO), Treasury Officer, and more. Understanding the exact syllabus is the single most critical factor in building an effective preparation strategy.</p>

<div style="border-left:4px solid #3b82f6; background:rgba(59,130,246,0.08); padding:14px 18px; border-radius:8px; margin:16px 0;">
  <strong>📋 Exam Structure:</strong> Prelims (Screening) → Mains (Written) → Interview (Personality Test) → Document Verification → Medical Exam.
</div>

<h3>Prelims Examination Pattern</h3>
<table style="width:100%; border-collapse:collapse; margin:16px 0; text-align:left;">
  <thead>
    <tr style="border-bottom:2px solid #cbd5e1; background:rgba(100,116,139,0.1);">
      <th style="padding:10px;">Paper</th>
      <th style="padding:10px;">Subject</th>
      <th style="padding:10px;">Questions</th>
      <th style="padding:10px;">Marks</th>
      <th style="padding:10px;">Duration</th>
      <th style="padding:10px;">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">Paper I</td>
      <td style="padding:10px;">General Studies (GS)</td>
      <td style="padding:10px;">100</td>
      <td style="padding:10px;">200</td>
      <td style="padding:10px;">2 Hrs</td>
      <td style="padding:10px;">MCQ (Negative Marking: -0.25)</td>
    </tr>
    <tr>
      <td style="padding:10px;">Paper II</td>
      <td style="padding:10px;">Jharkhand Specific General Studies</td>
      <td style="padding:10px;">100</td>
      <td style="padding:10px;">200</td>
      <td style="padding:10px;">2 Hrs</td>
      <td style="padding:10px;">MCQ (Negative Marking: -0.25)</td>
    </tr>
  </tbody>
</table>

<h3>Prelims Paper I — General Studies (High-Weightage Topics)</h3>
<ul>
  <li><strong>Indian History:</strong> Ancient (Vedic, Maurya, Gupta), Medieval (Sultans, Mughals), Modern (1857 revolt, Freedom Movement, Gandhi, Ambedkar).</li>
  <li><strong>Indian Polity:</strong> Constitution, Fundamental Rights, DPSPs, Parliament, Judiciary, Panchayati Raj, Emergency provisions.</li>
  <li><strong>Indian Economy:</strong> Budget, GDP, Monetary Policy (RBI), Five Year Plans, schemes (PM Awas, Jan Dhan, MGNREGA).</li>
  <li><strong>Indian Geography:</strong> Rivers, mountains, soil types, agriculture, mineral resources, climate.</li>
  <li><strong>Science & Technology:</strong> Basic Physics, Chemistry, Biology, Space (ISRO missions), Defence.</li>
  <li><strong>Current Affairs:</strong> Last 12 months' national and international events.</li>
</ul>

<h3>Prelims Paper II — Jharkhand Specific GS (Most Critical for Jharkhand Candidates)</h3>
<ul>
  <li><strong>History of Jharkhand:</strong> Tribal rebellions (Santhal Hul 1855, Birsa Munda 1900), colonial-era land laws, Jharkhand statehood movement (2000).</li>
  <li><strong>Jharkhand Geography:</strong> Districts (24), rivers (Damodar, Subarnarekha, Koel, Sankh), mineral districts (coal, iron ore, mica, copper), forests, climate zones.</li>
  <li><strong>CNT & SPT Acts:</strong> Chota Nagpur Tenancy Act (1908) and Santhal Pargana Tenancy Act (1949) — provisions on land alienation, raiyat rights, tribal protection.</li>
  <li><strong>Jharkhand Tribes:</strong> Scheduled Tribes — Santhal, Ho, Munda, Oraon, Kharia, Gond, Bhumij. Culture, dances, festivals (Sarhul, Karma, Tusu).</li>
  <li><strong>Jharkhand Economy & Industries:</strong> Steel plants (TISCO Jamshedpur), coal mines, MNREGA work, JSLPS missions.</li>
  <li><strong>State Government Schemes:</strong> Abua Awas Yojana, Guruji Credit Card, Mukhyamantri Maiya Samman Yojana, Sona Sohrai.</li>
</ul>

<h3>Mains Examination — Paper-wise Syllabus Overview</h3>
<p>Only candidates who qualify the JPSC Prelims (merit-based cutoff) are called for Mains. Mains consists of 6 written papers:</p>
<ul>
  <li><strong>Paper I (200 marks):</strong> General Hindi & General English — Essay, Comprehension, Grammar, Letter/Report writing.</li>
  <li><strong>Paper II (300 marks):</strong> Social Science — Indian History (detailed), Indian Polity, Indian Economy, Sociology basics.</li>
  <li><strong>Paper III (300 marks):</strong> Science & Technology — Physics, Chemistry, Biology, Environment, Current S&T developments.</li>
  <li><strong>Paper IV (300 marks):</strong> Applied Science — Geography (Indian & World), Disaster Management, Environment, Ecology.</li>
  <li><strong>Paper V (300 marks):</strong> Jharkhand-specific paper — History, Geography, Polity (state), Economy, Society, CNT/SPT Acts (detailed).</li>
  <li><strong>Paper VI (200 marks):</strong> Compulsory Regional Language — Santhali, Bengali, Hindi, Odia, Urdu (candidate's choice).</li>
</ul>

<h3>Recommended Books for JPSC Preparation</h3>
<ul>
  <li>Modern India — Bipin Chandra</li>
  <li>Indian Polity — M. Laxmikanth</li>
  <li>Certificate Physical & Human Geography — G.C. Leong</li>
  <li>Indian Economy — Ramesh Singh</li>
  <li>Jharkhand General Knowledge — Shree Publication (Jharkhand-specific)</li>
  <li>CNT & SPT Act — Bare Text with commentary</li>
</ul>

<p><em>Source: Official JPSC Advertisement and Syllabus PDF. Verified by Jharkhand JobAlert X Editorial Team on 27 Oct 2026.</em></p>`,
  },

  {
    id: 'art-jharkhand-police-constable-pet-pmt-criteria',
    title: 'Jharkhand Police Constable Physical Efficiency Test (PET) & PMT Benchmarks — Complete Criteria 2026',
    slug: 'jharkhand-police-constable-pet-pmt-physical-criteria-2026',
    category: 'job-guide',
    excerpt: 'Detailed guide to Jharkhand Police Constable PET (running, long jump, high jump) and PMT (height, chest, weight) physical standards for male and female candidates from General, SC, ST, and OBC categories.',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop&q=80',
    author: 'Jharkhand JobAlert X Editorial Team',
    authorRole: 'Jharkhand Police Bharti Expert',
    readTime: '7 min read',
    tags: ['Jharkhand Police', 'PET', 'PMT', 'Physical Test', 'Police Constable 2026', 'Jharkhand Police Bharti'],
    status: 'published',
    featured: true,
    views: 5500,
    metaTitle: 'Jharkhand Police Constable PET & PMT Physical Standards 2026 — Category-wise Criteria',
    metaDescription: 'Complete physical eligibility standards for Jharkhand Police Constable PET (Physical Efficiency Test) and PMT (Physical Measurement Test) for male and female candidates across all categories.',
    content: `<h2>Jharkhand Police Constable: Physical Test Standards 2026</h2>
<p>Clearing the Physical Efficiency Test (PET) and Physical Measurement Test (PMT) is the most physically demanding stage of the Jharkhand Police Constable (Sipahi) recruitment process. This guide provides verified, category-wise physical standards as notified by the Jharkhand Police Recruitment Board (JPRB).</p>

<div style="border-left:4px solid #f59e0b; background:rgba(245,158,11,0.08); padding:14px 18px; border-radius:8px; margin:16px 0;">
  <strong>⚠️ Official Source:</strong> These standards are based on official JPRB notifications published on jhpolice.gov.in. Always download the official recruitment advertisement PDF to confirm the exact standards for your specific advertisement cycle.
</div>

<h3>Physical Measurement Test (PMT) — Eligibility Standards</h3>
<table style="width:100%; border-collapse:collapse; margin:16px 0; text-align:left;">
  <thead>
    <tr style="border-bottom:2px solid #cbd5e1; background:rgba(100,116,139,0.1);">
      <th style="padding:10px;">Criterion</th>
      <th style="padding:10px;">Male — General/OBC/EWS</th>
      <th style="padding:10px;">Male — SC/ST</th>
      <th style="padding:10px;">Female — General/OBC/EWS</th>
      <th style="padding:10px;">Female — SC/ST</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">Height</td>
      <td style="padding:10px;">160 cm</td>
      <td style="padding:10px;">155 cm</td>
      <td style="padding:10px;">148 cm</td>
      <td style="padding:10px;">145 cm</td>
    </tr>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">Chest (Unexpanded)</td>
      <td style="padding:10px;">81 cm</td>
      <td style="padding:10px;">79 cm</td>
      <td style="padding:10px;">—</td>
      <td style="padding:10px;">—</td>
    </tr>
    <tr>
      <td style="padding:10px;">Chest (Expanded, minimum)</td>
      <td style="padding:10px;">86 cm (+5 cm min)</td>
      <td style="padding:10px;">84 cm (+5 cm min)</td>
      <td style="padding:10px;">—</td>
      <td style="padding:10px;">—</td>
    </tr>
  </tbody>
</table>

<h3>Physical Efficiency Test (PET) — Performance Standards</h3>
<table style="width:100%; border-collapse:collapse; margin:16px 0; text-align:left;">
  <thead>
    <tr style="border-bottom:2px solid #cbd5e1; background:rgba(100,116,139,0.1);">
      <th style="padding:10px;">Event</th>
      <th style="padding:10px;">Male (Qualifying)</th>
      <th style="padding:10px;">Female (Qualifying)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">1 Mile (1600m) Run</td>
      <td style="padding:10px;">6 minutes 30 seconds</td>
      <td style="padding:10px;">8 minutes 30 seconds</td>
    </tr>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">Long Jump</td>
      <td style="padding:10px;">4 metres (3 chances)</td>
      <td style="padding:10px;">2.5 metres (3 chances)</td>
    </tr>
    <tr>
      <td style="padding:10px;">High Jump</td>
      <td style="padding:10px;">1.2 metres (3 chances)</td>
      <td style="padding:10px;">0.9 metres (3 chances)</td>
    </tr>
  </tbody>
</table>

<div style="border-left:4px solid #10b981; background:rgba(16,185,129,0.08); padding:14px 18px; border-radius:8px; margin:16px 0;">
  <strong>✅ Note on ST Candidates:</strong> Scheduled Tribe (ST) candidates from Jharkhand may receive relaxation in PET standards. Check the official JPRB notification for exact ST relaxation benchmarks in your specific recruitment cycle.
</div>

<h3>PET Training Tips — 60-Day Programme</h3>
<ol>
  <li><strong>Weeks 1–2:</strong> Build aerobic base — slow 2–3 km jog daily. Focus on breathing rhythm and posture.</li>
  <li><strong>Weeks 3–4:</strong> Increase distance to 5–6 km per session. Add sprint intervals: 100m × 10 reps.</li>
  <li><strong>Weeks 5–6:</strong> Practice timed 1600m runs. Target 6:00 for males, 8:00 for females. Practice jumps 3×/week.</li>
  <li><strong>Weeks 7–8:</strong> Final race-pace simulations. Rest 2 days before your actual PET.</li>
</ol>

<h3>Documents Required at PET/PMT Venue</h3>
<ul>
  <li>Original Admit Card (printed, with photograph)</li>
  <li>Original Photo ID (Aadhaar / Voter ID / PAN)</li>
  <li>2 Passport-size photographs</li>
  <li>Category Certificate (SC/ST/OBC) — original</li>
  <li>Jharkhand Domicile Certificate — original</li>
</ul>
<p><em>Verified from official Jharkhand Police Recruitment Board notifications. Last reviewed by Jharkhand JobAlert X — 27 Oct 2026.</em></p>`,
  },

  {
    id: 'art-jharkhand-domicile-residential-certificate-guide',
    title: 'Jharkhand Residential & Local Domicile Certificate: How to Get It, Rules & Govt Job Eligibility',
    slug: 'jharkhand-residential-domicile-certificate-rules-government-jobs',
    category: 'documentation',
    excerpt: 'Complete guide to obtaining a Jharkhand State Residential Certificate (domicile) — required for state reservation benefits in JPSC, JSSC, and Jharkhand Police. Covers eligibility, application process, renewal, and official authority.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',
    author: 'Jharkhand JobAlert X Editorial Team',
    authorRole: 'Documentation & Legal Cell',
    readTime: '7 min read',
    tags: ['Jharkhand Domicile Certificate', 'Residential Certificate', 'Jharkhand Jobs', 'State Reservation', 'JPSC', 'JSSC Eligibility'],
    status: 'published',
    featured: false,
    views: 2800,
    metaTitle: 'Jharkhand Domicile Certificate: Eligibility, Application & Govt Job Rules 2026',
    metaDescription: 'How to get a Jharkhand Residential Certificate (domicile) for state government job reservations. Covers eligibility criteria, required documents, application process, and issuing authority.',
    content: `<h2>Jharkhand Residential Certificate (Domicile): Everything You Need to Know</h2>
<p>A Jharkhand State Residential Certificate — commonly called a <strong>Domicile Certificate</strong> — is a mandatory document for claiming Jharkhand state reservation benefits (SC, ST, BC-I, BC-II, EWS categories) in recruitments conducted by JPSC, JSSC, Jharkhand Police, JAC Board, and other state PSUs. Without this certificate, even eligible candidates may be rejected during Document Verification.</p>

<h3>Who is Eligible for a Jharkhand Residential Certificate?</h3>
<p>As per Jharkhand government rules, the following candidates are eligible to obtain a Jharkhand State Residential Certificate:</p>
<ul>
  <li>Persons who have lived in Jharkhand continuously for <strong>at least 5 years</strong> as a permanent resident.</li>
  <li>Candidates born in Jharkhand to parents who are permanent residents of the state.</li>
  <li>Scheduled Tribe (ST) and Scheduled Caste (SC) candidates whose tribe/caste is listed in the Jharkhand State Schedule and whose family has traditional roots in the state.</li>
  <li>Descendants of original land holders (raiyats) under the Chota Nagpur Tenancy Act or Santhal Pargana Tenancy Act.</li>
</ul>

<div style="border-left:4px solid #ef4444; background:rgba(239,68,68,0.08); padding:14px 18px; border-radius:8px; margin:16px 0;">
  <strong>🚫 Who is NOT eligible:</strong> Candidates who have migrated to Jharkhand for employment or education from another state (e.g., Bihar, UP, West Bengal) are typically not eligible for a Jharkhand domicile unless they meet the 5-year continuous residency requirement. Admission to university in Jharkhand alone does NOT establish domicile.
</div>

<h3>Documents Required to Apply</h3>
<ul>
  <li>Application Form (from Block/Circle Office or e-Portal)</li>
  <li>Self-declaration affidavit (on stamp paper of ₹10 or ₹20)</li>
  <li>Parent's Aadhaar Card or Voter ID</li>
  <li>Candidate's Aadhaar Card</li>
  <li>10th Certificate with DOB (Matriculation Certificate)</li>
  <li>Land ownership documents (for original residents) — e.g., LPC (Land Possession Certificate), Khatian</li>
  <li>Ration Card / Electricity Bill / Water Bill (as address proof)</li>
  <li>Voter ID of family member registered in Jharkhand voter rolls</li>
</ul>

<h3>Where & How to Apply</h3>
<ol>
  <li>Visit your local <strong>Circle Office (CO)</strong>, <strong>Block Development Office (BDO)</strong>, or <strong>Sub-Divisional Office (SDO)</strong> — whichever has jurisdiction over your home address.</li>
  <li>Alternatively, apply online through the <strong>Jharkhand e-District Portal</strong> (jharkhand.gov.in/eDistrict) for certain districts.</li>
  <li>Submit duly filled application form along with all self-attested documents and the declaration affidavit.</li>
  <li>The issuing authority will conduct a field enquiry (patwari or BDO verification).</li>
  <li>Approved certificates are signed by the <strong>Circle Officer (CO)</strong> or equivalent competent authority.</li>
</ol>

<h3>Validity & Renewal</h3>
<p>A Jharkhand Residential Certificate, once issued, is generally valid for the candidate's lifetime (no expiry). However, some recruitment bodies may require the certificate to be issued within a specified period (e.g., within 3 years of the advertisement). Always check the specific recruitment notification's date requirements.</p>

<h3>Important Points for Govt Job Applicants</h3>
<ul>
  <li>Ensure your name on the domicile certificate matches exactly with your Matriculation Certificate and Aadhaar.</li>
  <li>For ST candidates, a separate <strong>Caste Certificate issued by the Jharkhand Government</strong> is also required (not just the residential certificate).</li>
  <li>Women married to Jharkhand residents may be eligible; consult the district office for exact rules.</li>
  <li>False domicile certificates can lead to criminal prosecution under the Indian Penal Code.</li>
</ul>
<p><em>Source: Jharkhand Government Revenue & Land Reforms Department circular and JPSC/JSSC notification guidelines. Verified by Jharkhand JobAlert X Editorial Team — 27 Oct 2026.</em></p>`,
  },

  {
    id: 'art-jharkhand-reservation-category-certificate-2026',
    title: 'Jharkhand Category Reservation Guide: BC-I, BC-II, EWS, SC, ST Certificate Rules & Validity for Govt Jobs',
    slug: 'jharkhand-category-reservation-bc1-bc2-ews-sc-st-certificate-validity-guide',
    category: 'documentation',
    excerpt: 'Comprehensive guide on Jharkhand state reservation categories — BC-I, BC-II, EWS, SC, ST — including certificate format, issuing authority, validity for JPSC/JSSC, Non-Creamy Layer rules, and frequently made mistakes.',
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    author: 'Jharkhand JobAlert X Editorial Team',
    authorRole: 'Legal & Reservation Policy Desk',
    readTime: '9 min read',
    tags: ['Jharkhand Reservation', 'BC-I BC-II Certificate', 'EWS Certificate', 'SC ST Certificate', 'OBC NCL Jharkhand', 'Caste Certificate'],
    status: 'published',
    featured: false,
    views: 3600,
    metaTitle: 'Jharkhand BC-I, BC-II, EWS, SC, ST Reservation & Certificate Guide for Govt Jobs 2026',
    metaDescription: 'Complete explanation of Jharkhand state reservation categories BC-I, BC-II, EWS, SC, ST with certificate requirements, Non-Creamy Layer income limits, issuing authority, and validity rules for JPSC, JSSC and police jobs.',
    content: `<h2>Understanding Jharkhand's Reservation System for Government Jobs</h2>
<p>Jharkhand follows a state-specific reservation policy that differs from the central government scheme in several important ways. Getting your category certificate right — in the correct format, issued by the correct authority, with the correct validity date — can make the difference between selection and rejection during Document Verification.</p>

<h3>Jharkhand Reservation Categories — Overview</h3>
<table style="width:100%; border-collapse:collapse; margin:16px 0; text-align:left;">
  <thead>
    <tr style="border-bottom:2px solid #cbd5e1; background:rgba(100,116,139,0.1);">
      <th style="padding:10px;">Category</th>
      <th style="padding:10px;">Full Name</th>
      <th style="padding:10px;">Reservation % (State Jobs)</th>
      <th style="padding:10px;">Certificate Validity</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">ST</td>
      <td style="padding:10px;">Scheduled Tribe (Jharkhand Schedule)</td>
      <td style="padding:10px;">26%</td>
      <td style="padding:10px;">Lifelong (once issued)</td>
    </tr>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">SC</td>
      <td style="padding:10px;">Scheduled Caste</td>
      <td style="padding:10px;">10%</td>
      <td style="padding:10px;">Lifelong</td>
    </tr>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">BC-I</td>
      <td style="padding:10px;">Backward Class Category I (Extremely Backward)</td>
      <td style="padding:10px;">12%</td>
      <td style="padding:10px;">Check NCL annually</td>
    </tr>
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;">BC-II</td>
      <td style="padding:10px;">Backward Class Category II</td>
      <td style="padding:10px;">8%</td>
      <td style="padding:10px;">Check NCL annually</td>
    </tr>
    <tr>
      <td style="padding:10px;">EWS</td>
      <td style="padding:10px;">Economically Weaker Section (Unreserved)</td>
      <td style="padding:10px;">10%</td>
      <td style="padding:10px;">Current financial year</td>
    </tr>
  </tbody>
</table>

<h3>BC-I and BC-II: Non-Creamy Layer (NCL) Rules</h3>
<p>Unlike SC/ST categories, BC-I and BC-II candidates must satisfy a <strong>Non-Creamy Layer (NCL) income criterion</strong> to avail state reservation benefits:</p>
<ul>
  <li><strong>Annual Family Income Limit:</strong> ₹8,00,000 per annum (gross annual income of both parents combined). This is the standard Jharkhand state limit — verify with the current notification as it is subject to periodic revision.</li>
  <li><strong>Exclusions (Creamy Layer — NOT eligible for OBC/BC reservation):</strong>
    <ul>
      <li>Constitutional posts (President, Vice President, Governors, Judges of Supreme Court/High Courts).</li>
      <li>Group A / Class I Officers of All India Services (IAS, IPS, IFS) and Central Services.</li>
      <li>Officers in Grade A / Group-1 posts of State Services.</li>
      <li>Children of persons holding Army / Navy / Air Force ranks of Colonel and above.</li>
    </ul>
  </li>
  <li>The NCL certificate must be <strong>issued in the current financial year</strong> (April–March) unless the recruitment notification specifies a cutoff date.</li>
</ul>

<h3>EWS Certificate Requirements</h3>
<p>The <strong>Economically Weaker Section (EWS)</strong> certificate is for candidates from the General (Unreserved) category whose family's gross annual income is <strong>below ₹8 lakh</strong>. Key rules:</p>
<ul>
  <li>Cannot belong to SC, ST, BC-I, or BC-II category (EWS is exclusively for General category).</li>
  <li>Family should not own more than 5 acres of agricultural land, or a residential flat of 1000 sq ft or above, or a residential plot of 100 sq yards or above in notified municipalities.</li>
  <li>The EWS certificate must be issued in the <strong>current financial year</strong> of the recruitment.</li>
  <li>Issuing authority: <strong>Circle Officer (CO) / Sub-Divisional Officer (SDO) / District Collector (DC)</strong>.</li>
</ul>

<h3>SC/ST Certificate Rules — Jharkhand State List</h3>
<p>Only tribes and castes listed in the <strong>Jharkhand State Schedule</strong> are eligible for SC/ST reservation in state jobs. Key Scheduled Tribes in Jharkhand include: Santhal, Ho, Munda, Oraon (Kurukh), Kharia, Gond, Bhumij, Chero, Lohra, and others.</p>
<ul>
  <li>SC/ST certificates are valid for a lifetime once issued.</li>
  <li>Caste must be <strong>specifically listed in the Jharkhand state Schedule</strong> — a caste that is SC/ST in Bihar or West Bengal may not be recognized as SC/ST in Jharkhand.</li>
  <li>For inter-state recruits applying for central government jobs, the <strong>central list</strong> applies (not state list).</li>
</ul>

<h3>Common Mistakes That Lead to Rejection</h3>
<ul>
  <li>Using an <strong>expired NCL certificate</strong> for BC-I/BC-II (issued in a previous financial year).</li>
  <li>Certificate issued by an <strong>unauthorized officer</strong> (e.g., village sarpanch or talati instead of CO/SDO).</li>
  <li>Name <strong>mismatch</strong> between the caste certificate and the Aadhaar / 10th certificate.</li>
  <li>Applying as BC-II when your family income exceeds ₹8 lakh (creamy layer).</li>
  <li>EWS certificate dated in a <strong>previous financial year</strong> for a recruitment whose last date falls in the new financial year.</li>
</ul>
<p><em>Verified from the Jharkhand Social Welfare Department orders and JPSC/JSSC reservation guidelines. Last reviewed by Jharkhand JobAlert X Editorial Team — 27 Oct 2026.</em></p>`,
  },

  {
    id: 'art-top-jharkhand-govt-jobs-for-graduates-2026',
    title: 'Top High-Paying Jharkhand State Government Jobs for Graduates in 2026',
    slug: 'top-high-paying-jharkhand-state-government-jobs-for-graduates-2026',
    category: 'job-guide',
    excerpt: 'Comprehensive ranking of the best-paying Jharkhand state government jobs open to graduate candidates — from JPSC Civil Services and JSSC CGL to Jharkhand Police SI and High Court posts — with salary structure, selection process, and application tips.',
    coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&auto=format&fit=crop&q=80',
    author: 'Jharkhand JobAlert X Editorial Team',
    authorRole: 'Career Opportunities Desk',
    readTime: '9 min read',
    tags: ['Jharkhand Govt Jobs', 'Best Government Jobs Jharkhand', 'Graduate Jobs Jharkhand', 'JPSC Jobs', 'JSSC CGL', 'Sarkari Naukri 2026'],
    status: 'published',
    featured: true,
    views: 6200,
    metaTitle: 'Top 8 High-Paying Jharkhand Govt Jobs for Graduates 2026 — Salary & Selection Guide',
    metaDescription: 'Discover the top high-paying Jharkhand state government jobs available for graduates in 2026. Includes JPSC Civil Services, JSSC CGL, Jharkhand Police SI, High Court, and more with complete salary and eligibility details.',
    content: `<h2>Best Jharkhand State Government Jobs for Graduates in 2026</h2>
<p>Jharkhand's state government offers numerous lucrative career opportunities for graduate candidates through JPSC, JSSC, and various autonomous recruitment boards. Here is a detailed ranking of the most prestigious and well-paying government jobs for graduates in Jharkhand in 2026, verified from official pay commission orders and recruitment notifications.</p>

<h3>1. JPSC Civil Services (Deputy Collector / BDO / SDPO)</h3>
<ul>
  <li><strong>Recruiting Body:</strong> Jharkhand Public Service Commission (JPSC)</li>
  <li><strong>Posts:</strong> Deputy Collector, Sub-Divisional Police Officer (SDPO), Block Development Officer (BDO), Treasury Officer, Supply Officer</li>
  <li><strong>Pay Level:</strong> Level-11 (₹67,700 – ₹2,08,700/month) + DA + HRA + TA</li>
  <li><strong>Qualification:</strong> Any Bachelor's Degree from a recognized university</li>
  <li><strong>Selection Process:</strong> Prelims → Mains (6 papers) → Personality Test (Interview)</li>
  <li><strong>Why Apply:</strong> Highest prestige among state government jobs; equivalent to IAS-cadre power and status at district level.</li>
</ul>

<h3>2. JSSC CGL — Jharkhand Graduate Level Combined Competitive Exam</h3>
<ul>
  <li><strong>Recruiting Body:</strong> Jharkhand Staff Selection Commission (JSSC)</li>
  <li><strong>Posts:</strong> State Tax Inspector, Forest Guard, Block Supply Officer, Accounts Assistant, Junior Secretariat Assistant</li>
  <li><strong>Pay Level:</strong> Level-6 to Level-8 (₹35,400 – ₹1,12,400/month)</li>
  <li><strong>Qualification:</strong> Bachelor's Degree + knowledge of Hindi up to 10th standard</li>
  <li><strong>Selection Process:</strong> Written Exam (CBT) in 3 phases → Document Verification → Medical Examination</li>
  <li><strong>Why Apply:</strong> One exam, multiple posts across departments. High vacancy volume (typically 2,000–3,000+ vacancies per cycle).</li>
</ul>

<h3>3. Jharkhand Police Sub-Inspector (SI) / Daroga</h3>
<ul>
  <li><strong>Recruiting Body:</strong> Jharkhand Police Recruitment Board (JPRB)</li>
  <li><strong>Posts:</strong> Sub-Inspector (Executive), Sub-Inspector (CID/Special Branch)</li>
  <li><strong>Pay Level:</strong> Level-6 (₹35,400 – ₹1,12,400/month)</li>
  <li><strong>Qualification:</strong> Bachelor's Degree in any stream</li>
  <li><strong>Selection Process:</strong> Written Exam → Physical Test (PET/PMT) → Document Verification → Medical</li>
  <li><strong>Why Apply:</strong> Law enforcement career with fast promotion to Inspector and DSP levels.</li>
</ul>

<h3>4. Jharkhand High Court (District Court) — Clerk & Judicial Posts</h3>
<ul>
  <li><strong>Recruiting Body:</strong> Jharkhand High Court / District Courts</li>
  <li><strong>Posts:</strong> Clerk, Stenographer, Computer Operator, Personal Assistant</li>
  <li><strong>Pay Level:</strong> Level-4 to Level-7 (₹25,500 – ₹63,200/month)</li>
  <li><strong>Qualification:</strong> Bachelor's Degree + typing speed (English/Hindi) for certain posts</li>
  <li><strong>Selection Process:</strong> Written Test → Typing/Stenography Test → Document Verification</li>
  <li><strong>Why Apply:</strong> Stable office-based government job with judiciary environment benefits.</li>
</ul>

<h3>5. JPSC Combined Medical Exam (Assistant Surgeon)</h3>
<ul>
  <li><strong>Recruiting Body:</strong> JPSC</li>
  <li><strong>Posts:</strong> Assistant Surgeon (Medical Officer Grade II)</li>
  <li><strong>Pay Level:</strong> Level-10 (₹56,100 – ₹1,77,500/month)</li>
  <li><strong>Qualification:</strong> MBBS Degree from MCI/NMC-recognized institution</li>
  <li><strong>Why Apply:</strong> Highest entry-level pay among state government health cadre. Rural service incentives (+30% of basic pay in rural postings).</li>
</ul>

<h3>6. Jharkhand Police Constable (Sipahi)</h3>
<ul>
  <li><strong>Recruiting Body:</strong> JPRB</li>
  <li><strong>Pay Level:</strong> Level-3 (₹21,700 – ₹69,100/month)</li>
  <li><strong>Qualification:</strong> Intermediate (10+2); graduates preferred</li>
  <li><strong>Selection Process:</strong> Written Test → PET/PMT → Medical → DV</li>
  <li><strong>Why Apply:</strong> Largest volume of vacancies; immediate permanent government employment with pension benefits.</li>
</ul>

<h3>7. Jharkhand Teacher (TGT/PGT) via JPSC/JAC</h3>
<ul>
  <li><strong>Pay Level:</strong> Level-7 to Level-9 (₹44,900 – ₹1,42,400/month) for PGT</li>
  <li><strong>Qualification:</strong> Bachelor's/Master's Degree in relevant subject + B.Ed.</li>
  <li><strong>Why Apply:</strong> Job security, summer/winter vacation, no field postings in remote areas for secondary teachers.</li>
</ul>

<h3>8. JSLPS / DRDA (Rural Development) — Block Programme Officer</h3>
<ul>
  <li><strong>Pay Level:</strong> Level-6 (₹35,400+)</li>
  <li><strong>Qualification:</strong> Bachelor's Degree (Social Work, Rural Development, Commerce)</li>
  <li><strong>Why Apply:</strong> Grassroots development work with stable government salary and community impact.</li>
</ul>

<h3>How to Get Started</h3>
<ol>
  <li>Complete your OTR (One-Time Registration) on both <strong>JPSC portal (jpsc.gov.in)</strong> and <strong>JSSC portal (jssc.jharkhand.gov.in)</strong>.</li>
  <li>Gather your core documents: 10th/12th/Degree certificates, domicile certificate, caste certificate.</li>
  <li>Follow Jharkhand JobAlert X for instant notifications whenever new vacancies open.</li>
  <li>Start dedicated preparation for JPSC Prelims Paper II (Jharkhand GS) — the unique differentiator for Jharkhand state jobs.</li>
</ol>
<p><em>Pay scales as per Jharkhand Pay Commission (7th CPC) orders. Verified by Jharkhand JobAlert X Editorial Team — 27 Oct 2026.</em></p>`,
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
