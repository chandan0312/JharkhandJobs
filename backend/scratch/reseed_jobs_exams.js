import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🧹 Clearing old seeded jobs and exams from PostgreSQL database...');
    await pool.query('DELETE FROM jobs');
    await pool.query('DELETE FROM exams');
    console.log('✅ Tables cleared.');

    console.log('🌱 Seeding 7 actual government jobs in Jharkhand...');
    const jobs = [
      [
        'job-1', 'Combined Civil Services (Deputy Collector, DSP, etc.)', 'Jharkhand Public Service Commission (JPSC)', 'JPSC', '#005691', 
        'Jharkhand, India', 'Full Time', 56100, 177500, '₹', 'monthly', 'Fresher / Experienced', 'Graduate', 'Recruitment Ongoing', 'Govt Jobs', 'Public Service',
        'Jharkhand Public Service Commission (JPSC) invites applications for the Combined Civil Services Examination to recruit Deputy Collectors, DSPs, and other executive officers.',
        ['Prelims Exam: Objective type questions on General Studies (Paper I & II).', 'Mains Exam: Written descriptive papers on core subjects and local languages.', 'Interview: Personality test and viva-voce.'],
        ['Must hold a Bachelor\'s degree in any discipline from a recognized university.', 'Age must meet JPSC Civil Services eligibility guidelines.', 'Must satisfy physical standards eligibility for DSP and other uniformed services.'],
        'active', '2026-05-28', '2026-12-31', 103, 'mock-user-admin-id'
      ],
      [
        'job-2', 'JTGLCCE (Assistant, Inspector & Others)', 'Jharkhand Staff Selection Commission (JSSC)', 'JSSC', '#1B8C0A', 
        'Jharkhand, India', 'Full Time', 35400, 112400, '₹', 'monthly', 'Fresher / Experienced', 'B.Sc / M.Sc / B.Pharm / Graduate (Post-wise)', 'Apply Online', 'Govt Jobs', 'Public Service',
        'Jharkhand Staff Selection Commission (JSSC) invites online applications for JTGLCCE to recruit Assistants, Inspectors, and other technical graduate posts.',
        ['Perform administrative and technical supervisory duties in designated state departments.', 'Implement government schemes, checks, and regulations at block levels.', 'Review and maintain records/files for technical and general audits.'],
        ['Graduation or Post-Graduation in B.Sc, M.Sc, B.Pharm, or specific streams matching the post details.', 'Age must fit the JSSC JTGLCCE regulations.', 'Knowledge of local customs and languages of Jharkhand is required.'],
        'active', '2026-05-27', '2026-06-30', 611, 'mock-user-admin-id'
      ],
      [
        'job-3', 'Polytechnic Lecturer', 'Jharkhand Public Service Commission (JPSC)', 'JPSC', '#005691', 
        'Jharkhand, India', 'Full Time', 56100, 79800, '₹', 'monthly', 'Fresher / Experienced', 'B.E. / B.Tech / M.Tech', 'New', 'Govt Jobs', 'Education / Teaching',
        'Recruitment of Lecturers in government polytechnic institutes across Jharkhand state.',
        ['Deliver technical curriculum and instructions in engineering/science disciplines.', 'Manage laboratory equipment and supervise practical experiment sessions.', 'Assess student performance, assignments, and participate in academic mentoring.'],
        ['B.E. / B.Tech / M.Tech in relevant engineering discipline with first class or equivalent.', 'Strong subject matter expertise and academic teaching capabilities.'],
        'active', '2026-05-26', null, 349, 'mock-user-admin-id'
      ],
      [
        'job-4', 'Home Guard', 'Jharkhand Home Guard Department', 'JHGD', '#059669', 
        'Jharkhand, India', 'Full Time', 15000, 25000, '₹', 'monthly', 'Fresher', '10th / 12th Pass', 'Ending Soon', 'Govt Jobs', 'Security / Defense',
        'Jharkhand Home Guard Department recruits volunteers to assist in maintaining local law and order and community protection.',
        ['Assist local police force in active duties, patrols, crowd management, and public safety.', 'Be available for emergency duty and rescue coordination tasks in the state.'],
        ['Minimum 10th or 12th pass from a recognized education board.', 'Physical fitness and measurements as per standard department guidelines (height, chest).', 'Must be a permanent resident of Jharkhand state.'],
        'active', '2026-05-25', '2026-06-04', 284, 'mock-user-admin-id'
      ],
      [
        'job-5', 'Teacher Eligibility Test (JTET)', 'Jharkhand Academic Council (JAC)', 'JAC', '#7C3AED', 
        'Jharkhand, India', 'Full Time', 0, 0, '₹', 'monthly', 'Fresher / Experienced', 'D.El.Ed / B.Ed', 'Eligibility Exam', 'Govt Jobs', 'Education / Teaching',
        'Jharkhand Academic Council conducts the Teacher Eligibility Test (JTET) to certify primary and middle school teachers in the state.',
        ['Qualifying exam to assess eligibility of primary (Class I-V) and middle (Class VI-VIII) school teachers.', 'Demonstrate proper teaching quality standards as per NCTE rules.'],
        ['D.El.Ed or B.Ed qualification from a recognized NCTE college.', 'Passed secondary or senior secondary with minimum aggregate marks.'],
        'active', '2026-05-24', null, 0, 'mock-user-admin-id'
      ],
      [
        'job-6', 'Assistant Professor (Engineering)', 'Jharkhand Public Service Commission (JPSC)', 'JPSC', '#005691', 
        'Jharkhand, India', 'Full Time', 57700, 182400, '₹', 'monthly', 'Fresher / Experienced', 'M.Tech / PhD', 'JPSC Faculty', 'Govt Jobs', 'Education / Teaching',
        'Jharkhand Public Service Commission invites applications for Assistant Professor vacancies in Government Engineering Colleges.',
        ['Engage in academic lectures, curriculum development, and laboratory guidance.', 'Mentor undergraduate students and publish technical papers in indexed journals.', 'Participate in college department committees and accreditation tasks.'],
        ['M.Tech or PhD in relevant engineering stream from a recognized university.', 'Cleared national-level eligibility certifications (NET/SLET) where applicable.'],
        'active', '2026-05-23', null, 45, 'mock-user-admin-id'
      ],
      [
        'job-7', 'Lecturer (Govt Polytechnic)', 'Jharkhand Public Service Commission (JPSC)', 'JPSC', '#005691', 
        'Jharkhand, India', 'Full Time', 56100, 177500, '₹', 'monthly', 'Fresher / Experienced', 'Engineering Degree', 'Ongoing', 'Govt Jobs', 'Education / Teaching',
        'Recruitment for engineering and non-engineering lecturers in state government polytechnics under JPSC.',
        ['Deliver technical curriculum lectures and supervise practical lab experiments.', 'Assist in college administrative tasks, semester examinations, and quality assurance.'],
        ['Bachelor\'s Degree in Engineering/Technology in relevant branch with First Class.', 'Age limits and relaxations as per government directives.'],
        'active', '2026-05-22', null, 50, 'mock-user-admin-id'
      ],
      [
        'job-8', 'Group B & C Posts', 'Staff Selection Commission (SSC)', 'SSC', '#1A73E8', 
        'All India', 'Full Time', 35400, 112400, '₹', 'monthly', 'Fresher / Experienced', 'Graduate', 'Apply Online', 'Govt Jobs', 'Public Service',
        'Staff Selection Commission (SSC) conducts recruitment for various Group B & C posts across ministries and departments of the Government of India.',
        ['Assist in administrative duties in ministries.', 'Maintain files and reports.', 'Implement government policies under senior supervision.'],
        ['Must hold a Bachelor\'s degree in any discipline from a recognized university.', 'Age must be between 18-30 years as per post requirements.', 'Indian citizenship is mandatory.'],
        'active', '2026-05-21', '2026-06-22', 12256, 'mock-user-admin-id'
      ],
      [
        'job-9', 'Assistant Loco Pilot', 'Railway Recruitment Board (RRB)', 'Railway', '#D97706', 
        'All India', 'Full Time', 19900, 35000, '₹', 'monthly', 'Fresher', 'ITI / Diploma', 'Apply Online', 'Govt Jobs', 'Railways',
        'Railway Recruitment Board (RRB) invites applications for the recruitment of Assistant Loco Pilots (ALP) in Indian Railways.',
        ['Assist in operating trains under the supervision of Loco Pilots.', 'Check the mechanical/electrical condition of locomotives.', 'Follow safety directives and rail signals carefully.'],
        ['10th Pass + ITI or Diploma in Engineering streams.', 'Must meet strict medical standard (A1 visual standards).'],
        'active', '2026-05-20', '2026-06-14', 11127, 'mock-user-admin-id'
      ],
      [
        'job-10', 'Combined Defence Services', 'Union Public Service Commission (UPSC)', 'UPSC', '#9333EA', 
        'All India', 'Full Time', 56100, 177500, '₹', 'monthly', 'Fresher', 'Graduate', 'Apply Online', 'Govt Jobs', 'Defense / Security',
        'Union Public Service Commission (UPSC) conducts Combined Defence Services (CDS) Exam for admission into IMA, INA, AFA, and OTA.',
        ['Undergo military officer training program.', 'Serve as a commissioned officer in the Indian Armed Forces.'],
        ['Graduation degree in relevant streams (Engineering for Navy/Air Force, any discipline for Army).', 'Unmarried males/females matching UPSC age specifications.'],
        'active', '2026-05-19', '2026-06-09', 451, 'mock-user-admin-id'
      ],
      [
        'job-11', 'National Defence Academy', 'Union Public Service Commission (UPSC)', 'UPSC', '#9333EA', 
        'All India', 'Full Time', 56100, 177500, '₹', 'monthly', 'Fresher', '12th Pass', 'Apply Online', 'Govt Jobs', 'Defense / Security',
        'Union Public Service Commission (UPSC) conducts NDA & NA Exam for entry into Army, Navy and Air Force wings of National Defence Academy.',
        ['Undergo basic defense and academic education training.', 'Serve in Indian Army, Navy, or Air Force.'],
        ['12th Class Pass (with Physics and Mathematics for Air Force and Navy).', 'Unmarried male/female candidates.'],
        'active', '2026-05-18', '2026-06-09', 394, 'mock-user-admin-id'
      ],
      [
        'job-12', 'Flying & Ground Duty', 'Indian Air Force (IAF)', 'IAF', '#2563EB', 
        'All India', 'Full Time', 56100, 110000, '₹', 'monthly', 'Fresher', 'Graduate / BE', 'Apply Online', 'Govt Jobs', 'Defense / Security',
        'Indian Air Force (IAF) invites applications for Flying Branch and Ground Duty (Technical and Non-Technical) branches through AFCAT entry.',
        ['Fulfill flying operations or supervise aeronautical technical/non-technical operations.', 'Manage command systems and ground logistics.'],
        ['Bachelor Degree in any stream with Physics & Math at 10+2, or B.E./B.Tech.', 'Age limits: 20-24 years for Flying, 20-26 years for Ground Duty.'],
        'active', '2026-05-17', '2026-06-19', 379, 'mock-user-admin-id'
      ],
      [
        'job-13', 'Graduate/Diploma/Trade Apprentice', 'Northern Coalfields Limited (NCL)', 'NCL', '#059669', 
        'Singrauli, MP/UP', 'Full Time', 8000, 10000, '₹', 'monthly', 'Fresher', 'ITI / Diploma / Degree', 'Ongoing', 'Govt Jobs', 'Mining / Public Enterprise',
        'Northern Coalfields Limited (NCL) invites online applications for Graduate, Diploma, and Trade Apprentice training positions.',
        ['Undergo technical training in designated engineering trades.', 'Assist in site mining operational units.'],
        ['ITI in relevant trade, Diploma, or Degree in Engineering.', 'Must register on NATS/NAPS portal.'],
        'active', '2026-05-16', null, 1607, 'mock-user-admin-id'
      ],
      [
        'job-14', 'Group B & C Posts', 'Delhi Subordinate Services Selection Board (DSSSB)', 'DSSSB', '#DC2626', 
        'Delhi, India', 'Full Time', 21700, 81100, '₹', 'monthly', 'Fresher / Experienced', '10th / 12th / Graduate', 'Starting June 16', 'Govt Jobs', 'Public Service',
        'DSSSB releases advertisement No. 03/2026 for various Group B & C vacancies in departments of GNCTD. Applications start from June 16.',
        ['Perform general administration, checking, and files clerical work.', 'Execute department field operations.'],
        ['10th/12th pass or Graduate from a recognized Board/University (Post-wise criteria).'],
        'active', '2026-05-15', '2026-07-16', 1979, 'mock-user-admin-id'
      ],
      [
        'job-15', 'Management Trainee', 'Coal India Limited (CIL)', 'CIL', '#059669', 
        'Kolkata, India', 'Full Time', 50000, 160000, '₹', 'monthly', 'Fresher', 'Engineering / MBA', 'Apply Online', 'Govt Jobs', 'Public Sector Undertaking (PSU)',
        'Coal India Limited (CIL) recruits Management Trainees in disciplines of Mining, Civil, Mechanical, System, HR, Marketing, etc.',
        ['Executive supervisory duties in designated disciplines.', 'Ensure project compliance, safety norms, and field efficiency.'],
        ['B.E./B.Tech/B.Sc Engineering, or MBA/PG Diploma with minimum 60% marks.'],
        'active', '2026-05-14', '2026-06-11', 660, 'mock-user-admin-id'
      ],
      [
        'job-16', 'Agniveer GD/Technical/Clerk', 'Indian Army', 'Army', '#1B8C0A', 
        'All India', 'Full Time', 30000, 40000, '₹', 'monthly', 'Fresher', '10th / 12th / ITI', 'Exam Ongoing', 'Govt Jobs', 'Defense / Security',
        'Indian Army conducts online common entrance exam (CEE) for recruiting Agniveers in General Duty, Technical, Clerk/Store Keeper, and Tradesmen categories.',
        ['Serve in primary field/combat/trades duties under the Agniveer scheme.', 'Maintain high physical training and security discipline.'],
        ['10th Pass (GD), 12th Pass (Technical/Clerk), 8th/10th Pass (Tradesmen).', 'Age: 17.5 to 21 years.'],
        'active', '2026-05-13', null, 25000, 'mock-user-admin-id'
      ]
    ];

    for (const j of jobs) {
      await pool.query(
        `INSERT INTO jobs (id, title, company, company_initial, company_color, location, type, salary_min, salary_max, salary_currency, salary_period, experience, qualification, badge_text, category, industry, description, responsibilities, requirements, status, posted_date, last_date, vacancies, posted_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)`,
        j
      );
    }
    console.log('✅ 7 jobs successfully seeded.');

    console.log('🌱 Seeding 7 actual government exams...');
    const exams = [
      ['e1', 'Combined Civil Services (Deputy Collector, DSP, etc.)', 'Jharkhand Public Service Commission', 'JPSC', 'Upcoming Exams', 'Recruitment Ongoing', '103 Posts', 'Apply Now', 'Selection Process: Prelims + Mains + Interview. Open to graduates. Source: JPSC (https://www.jpsc.gov.in)', true],
      ['e2', 'JTGLCCE (Assistant, Inspector & Others)', 'Jharkhand Staff Selection Commission', 'JSSC', 'Upcoming Exams', '30 Jun 2026', '611 Posts', 'Apply Now', 'Selection Process: Written Exam. B.Sc / M.Sc / B.Pharm / Graduate (Post-wise). Source: FreeJobAlert (https://www.freejobalert.com)', true],
      ['e3', 'Polytechnic Lecturer', 'Jharkhand Public Service Commission', 'JPSC', 'Upcoming Exams', 'As per Notification', '349+ Posts', 'Apply Now', 'Selection Process: Written + Interview. B.E./B.Tech / M.Tech. Source: The Times of India (https://timesofindia.indiatimes.com)', true],
      ['e4', 'Home Guard', 'Jharkhand Home Guard Department', 'JHGD', 'Upcoming Exams', '4 Jun 2026', '284 Posts', 'Apply Now', 'Selection Process: Physical + Written. 10th/12th Pass. Source: Careers360 (https://competition.careers360.com)', true],
      ['e5', 'Teacher Eligibility Test (JTET)', 'Jharkhand Academic Council', 'JAC', 'Upcoming Exams', 'Registration Closing', 'Eligibility Exam', 'Apply Now', 'Selection Process: Written Exam. D.El.Ed/B.Ed. Source: The Times of India (https://timesofindia.indiatimes.com)', true],
      ['e6', 'Assistant Professor (Engineering)', 'Jharkhand Public Service Commission', 'JPSC', 'Admit Card', 'Ongoing', 'Multiple Posts', 'Apply Now', 'Selection Process: Interview/Written. M.Tech/PhD. Source: JPSC (https://www.jpsc.gov.in)', false],
      ['e7', 'Lecturer (Govt Polytechnic)', 'Jharkhand Public Service Commission', 'JPSC', 'Admit Card', 'Ongoing', 'Multiple Posts', 'Apply Now', 'Selection Process: Written + Interview. Engineering Degree. Source: JPSC (https://www.jpsc.gov.in)', false],
      ['e8', 'Group B & C Posts', 'Staff Selection Commission', 'SSC', 'Upcoming Exams', '22 Jun 2026', '12,256 Posts', 'Apply Now', 'Selection Process: Tier 1 + Tier 2 Computer Based Exams. Open to graduates. Source: Navbharat Times (https://navbharattimes.indiatimes.com)', true],
      ['e9', 'Assistant Loco Pilot', 'Railway Recruitment Board', 'Railway', 'Admit Card', '14 Jun 2026', '11,127 Posts', 'Apply Now', 'Selection Process: CBT 1 & 2 + CBAT + Document Verification. ITI/Diploma. Source: Navbharat Times (https://navbharattimes.indiatimes.com)', true],
      ['e10', 'Combined Defence Services', 'Union Public Service Commission', 'UPSC', 'Results', '9 Jun 2026', '451 Posts', 'Apply Now', 'Selection Process: Written Exam + SSB Interview. Open to graduates. Source: Navbharat Times (https://navbharattimes.indiatimes.com)', true],
      ['e11', 'National Defence Academy', 'Union Public Service Commission', 'UPSC', 'Admit Card', '9 Jun 2026', '394 Posts', 'Apply Now', 'Selection Process: Written Exam + SSB Interview. Open to 12th pass. Source: Navbharat Times (https://navbharattimes.indiatimes.com)', true],
      ['e12', 'Flying & Ground Duty', 'Indian Air Force', 'IAF', 'Results', '19 Jun 2026', '379 Posts', 'Apply Now', 'Selection Process: Written Exam + AFSB Testing. Open to graduates/BE. Source: Navbharat Times (https://navbharattimes.indiatimes.com)', true],
      ['e13', 'Graduate/Diploma/Trade Apprentice', 'Northern Coalfields Limited', 'NCL', 'Results', 'Ongoing', '1,607 Posts', 'Apply Now', 'Selection Process: Merit List based on Marks. ITI/Diploma/Degree. Source: The Times of India (https://timesofindia.indiatimes.com)', true],
      ['e14', 'Group B & C Posts', 'Delhi Subordinate Services Selection Board', 'DSSSB', 'Results', 'Applications Start 16 Jun', '1,979 Posts', 'Notification Out', 'Selection Process: Written Examination. Open to 10th/12th/Graduates. Source: The Times of India (https://timesofindia.indiatimes.com)', true],
      ['e15', 'Management Trainee', 'Coal India Limited', 'CIL', 'Results', '11 Jun 2026', '660 Posts', 'Apply Now', 'Selection Process: GATE Score / CBT + Interview. Engineering/MBA. Source: Career Power (https://www.careerpower.in)', true],
      ['e16', 'Agniveer GD/Technical/Clerk', 'Indian Army', 'Army', 'Admit Card', 'Exam Ongoing', 'Thousands', 'Admit Card Out', 'Selection Process: Online CEE + Physical Fitness Test. Open to 10th/12th/ITI. Source: The Times of India (https://timesofindia.indiatimes.com)', true]
    ];

    for (const e of exams) {
      await pool.query(
        `INSERT INTO exams (id, title, organization, org_short, category, last_date, posts, status, description, is_new) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        e
      );
    }
    console.log('✅ 7 exams successfully seeded.');
  } catch (err) {
    console.error('❌ Error during reseeding:', err.message);
  } finally {
    await pool.end();
  }
};

run();
