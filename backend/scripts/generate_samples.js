import fs from 'fs'
import path from 'path'
import * as XLSX from 'xlsx'

const rows = [
  {
    id: 'ssc-cgl-2026',
    title: 'SSC CGL 2026 Online Application Form',
    org: 'Staff Selection Commission',
    orgShort: 'SSC',
    category: 'ssc',
    kind: 'job',
    vacancies: 17727,
    postedOn: '24 Aug 2026',
    tagline: 'Combined Graduate Level (Group B & C Posts)',
    shortInfo: 'Staff Selection Commission has released the official recruitment notification for SSC Combined Graduate Level (CGL) 2026 for 17,727 vacancies across Government Ministries.',
    eligibility: "Bachelor's Degree in any discipline from a recognized University in India.",
    ageLimit: '18-32 Years as on 01 Aug 2026 (Age relaxation as per rules)',
    importantDates: 'Application Begin: 11 Jun 2026 | Last Date: 10 Jul 2026 | Tier-1 Exam: Sep-Oct 2026',
    applicationFee: 'General / OBC / EWS: ₹100 | SC / ST / PwD / Female: ₹0 (Exempted)',
    postDetails: 'Assistant Audit Officer (512) | Inspector (3439) | Sub Inspector (1204) | Auditor (6506) | Tax Assistant (6066)',
    applyLink: 'https://ssc.gov.in',
    notificationPdfLink: 'https://ssc.gov.in/notice_cgl_2026.pdf',
    officialWebsite: 'https://ssc.gov.in',
    featured: 'TRUE'
  },
  {
    id: 'rrb-technician-2026-admit',
    title: 'RRB Technician Grade 1 & 3 Exam City & Admit Card 2026',
    org: 'Railway Recruitment Board',
    orgShort: 'RRB',
    category: 'railway',
    kind: 'admit-card',
    vacancies: 14298,
    postedOn: '24 Aug 2026',
    tagline: 'CBT Exam City Slip & Hall Ticket Download',
    shortInfo: 'Railway Recruitment Board (RRB) has activated the Exam City Intimation slip and CBT Admit Card download link for Technician Grade 1 and Grade 3 posts.',
    eligibility: '10th Pass with ITI or Diploma / Degree in relevant Engineering trade.',
    ageLimit: '18-33 Years',
    importantDates: 'Exam City Released: 20 Nov 2026 | Admit Card: 4 Days Before Exam | Exam Date: Dec 2026',
    applicationFee: 'N/A (Admit Card Download)',
    postDetails: 'Technician Grade 1 Signal (1092) | Technician Grade 3 (13206)',
    applyLink: 'https://rrbcdg.gov.in',
    notificationPdfLink: 'https://rrbcdg.gov.in/admit_card_notice.pdf',
    officialWebsite: 'https://indianrailways.gov.in',
    featured: 'TRUE'
  },
  {
    id: 'up-police-constable-2026-result',
    title: 'UP Police Constable 60,244 Posts Written Exam Result 2026',
    org: 'UP Police Recruitment & Promotion Board',
    orgShort: 'UPPRPB',
    category: 'police',
    kind: 'result',
    vacancies: 60244,
    postedOn: '23 Aug 2026',
    tagline: 'Direct Recruitment Written Exam Merit List & Cutoff Marks',
    shortInfo: 'Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB) has declared the written examination results and cutoff marks for 60,244 Constable posts.',
    eligibility: '10+2 (Intermediate) Exam Passed from any recognized Board.',
    ageLimit: '18-25 Years (Male) | 18-28 Years (Female)',
    importantDates: 'Exam Conducted: 23-31 Aug 2026 | Result Announced: 24 Sep 2026 | DV/PST Date: Oct 2026',
    applicationFee: 'N/A (Result)',
    postDetails: 'Constable Civil Police (60244)',
    applyLink: 'https://uppbpb.gov.in',
    notificationPdfLink: 'https://uppbpb.gov.in/result_cutoff_notice.pdf',
    officialWebsite: 'https://uppbpb.gov.in',
    featured: 'TRUE'
  },
  {
    id: 'ibps-po-2026-answerkey',
    title: 'IBPS PO / MT XIV Prelims Exam Official Answer Key 2026',
    org: 'Institute of Banking Personnel Selection',
    orgShort: 'IBPS',
    category: 'banking',
    kind: 'answer-key',
    vacancies: 4455,
    postedOn: '22 Aug 2026',
    tagline: 'Preliminary Exam Response Sheet & Objection Window',
    shortInfo: 'IBPS has released the official candidate response sheets and provisional answer keys for Probationary Officer / Management Trainee (PO/MT-XIV) Prelims examination.',
    eligibility: "Bachelor's Degree in any stream from recognized University.",
    ageLimit: '20-30 Years as on 01 Aug 2026',
    importantDates: 'Prelims Exam: 19-20 Oct 2026 | Answer Key Out: 25 Oct 2026 | Last Date Objection: 29 Oct 2026',
    applicationFee: 'Objection Fee: ₹100 per question challenged',
    postDetails: 'Probationary Officer / Management Trainee (4455 in 11 Public Sector Banks)',
    applyLink: 'https://ibps.in',
    notificationPdfLink: 'https://ibps.in/po_answer_key_notice.pdf',
    officialWebsite: 'https://ibps.in',
    featured: 'FALSE'
  },
  {
    id: 'upsc-cse-2026-syllabus',
    title: 'UPSC Civil Services (IAS / IPS) 2026 Detailed Syllabus & Exam Pattern',
    org: 'Union Public Service Commission',
    orgShort: 'UPSC',
    category: 'upsc',
    kind: 'syllabus',
    vacancies: 1056,
    postedOn: '20 Aug 2026',
    tagline: 'Prelims GS 1 & CSAT + Mains 9 Papers Complete Scheme',
    shortInfo: 'Download the comprehensive UPSC Civil Services Examination (CSE) syllabus including Prelims GS Paper-I, CSAT Paper-II, and Mains Essay, GS I-IV, and Optional subjects.',
    eligibility: 'Graduate in any discipline.',
    ageLimit: '21-32 Years as on 01 Aug 2026',
    importantDates: 'Prelims Notification: 14 Feb 2026 | Prelims Exam: 26 May 2026 | Mains Exam: Sep 2026',
    applicationFee: 'N/A (Syllabus Download)',
    postDetails: 'IAS | IPS | IFS | IRS | Central Services Group A & B',
    applyLink: 'https://upsc.gov.in',
    notificationPdfLink: 'https://upsc.gov.in/syllabus_cse_2026.pdf',
    officialWebsite: 'https://upsc.gov.in',
    featured: 'FALSE'
  },
  {
    id: 'indian-airforce-agniveer-2026',
    title: 'Indian Airforce Agniveer Vayu Intake 01/2026 Online Form',
    org: 'Indian Airforce (IAF)',
    orgShort: 'IAF',
    category: 'defence',
    kind: 'job',
    vacancies: 3500,
    postedOn: '18 Aug 2026',
    tagline: 'Agniveer Vayu Science & Non-Science Subjects',
    shortInfo: 'Indian Airforce invites online applications from unmarried Indian male and female candidates for Agniveer Vayu Intake 01/2026 recruitment.',
    eligibility: '10+2 Intermediate with Mathematics, Physics and English (Min 50% marks) OR 3 Yrs Diploma in Engineering.',
    ageLimit: '17.5 to 21 Years (Born between 02 Jan 2004 and 02 Jul 2007)',
    importantDates: 'Apply Begin: 08 Jul 2026 | Last Date: 28 Jul 2026 | Exam Date: 18 Oct 2026',
    applicationFee: 'All Candidates: ₹550 + GST',
    postDetails: 'Agniveervayu (Science Subjects & Other than Science Subjects)',
    applyLink: 'https://agnipathvayu.cdac.in',
    notificationPdfLink: 'https://agnipathvayu.cdac.in/notice.pdf',
    officialWebsite: 'https://careerindianairforce.cdac.in',
    featured: 'FALSE'
  },
  {
    id: 'ctet-dec-2026-form',
    title: 'CTET December 2026 Central Teacher Eligibility Test Online Form',
    org: 'Central Board of Secondary Education',
    orgShort: 'CBSE',
    category: 'teaching',
    kind: 'job',
    vacancies: 0,
    postedOn: '15 Aug 2026',
    tagline: 'Primary (Paper I) & Junior (Paper II) Eligibility Certificate',
    shortInfo: 'Central Board of Secondary Education (CBSE) will conduct the 20th edition of CTET examination for teacher eligibility across India.',
    eligibility: 'D.El.Ed / B.Ed / B.El.Ed or appearing in final year.',
    ageLimit: 'No Age Limit for CTET Exam',
    importantDates: 'Apply Begin: 17 Sep 2026 | Last Date: 16 Oct 2026 | Exam Date: 15 Dec 2026',
    applicationFee: 'Single Paper: Gen/OBC ₹1000, SC/ST/PwD ₹500 | Both Papers: Gen/OBC ₹1200, SC/ST/PwD ₹600',
    postDetails: 'Primary Stage (Classes I to V) | Elementary Stage (Classes VI to VIII)',
    applyLink: 'https://ctet.nic.in',
    notificationPdfLink: 'https://ctet.nic.in/information_bulletin_2026.pdf',
    officialWebsite: 'https://ctet.nic.in',
    featured: 'FALSE'
  }
]

// 1. Create CSV file
const headers = Object.keys(rows[0])
const csvRows = [
  headers.join(','),
  ...rows.map((row) =>
    headers
      .map((fieldName) => {
        const val = row[fieldName] === undefined || row[fieldName] === null ? '' : String(row[fieldName])
        return `"${val.replace(/"/g, '""')}"`
      })
      .join(',')
  )
]

const csvContent = csvRows.join('\r\n')

// Output paths
const rootDir = 'c:\\Users\\LENOVO\\Desktop\\All India Job'
const csvPath1 = path.join(rootDir, 'job_alert_x_sample_data.csv')
const xlsxPath1 = path.join(rootDir, 'job_alert_x_sample_data.xlsx')

const dataDir = path.join(rootDir, 'SarkariFynx', 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const csvPath2 = path.join(dataDir, 'job_alert_x_sample_data.csv')
const xlsxPath2 = path.join(dataDir, 'job_alert_x_sample_data.xlsx')

// Write CSV
fs.writeFileSync(csvPath1, csvContent, 'utf8')
fs.writeFileSync(csvPath2, csvContent, 'utf8')
console.log('CSV created at:', csvPath1)

// 2. Create XLSX file
const worksheet = XLSX.utils.json_to_sheet(rows)

// Set column widths for optimal reading in Microsoft Excel
const colWidths = [
  { wch: 26 }, // id
  { wch: 45 }, // title
  { wch: 38 }, // org
  { wch: 12 }, // orgShort
  { wch: 14 }, // category
  { wch: 14 }, // kind
  { wch: 12 }, // vacancies
  { wch: 16 }, // postedOn
  { wch: 38 }, // tagline
  { wch: 60 }, // shortInfo
  { wch: 50 }, // eligibility
  { wch: 35 }, // ageLimit
  { wch: 55 }, // importantDates
  { wch: 50 }, // applicationFee
  { wch: 55 }, // postDetails
  { wch: 35 }, // applyLink
  { wch: 40 }, // notificationPdfLink
  { wch: 30 }, // officialWebsite
  { wch: 10 }, // featured
]
worksheet['!cols'] = colWidths

const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Alert X - Sample Data')

XLSX.writeFile(workbook, xlsxPath1)
XLSX.writeFile(workbook, xlsxPath2)
console.log('XLSX created at:', xlsxPath1)
