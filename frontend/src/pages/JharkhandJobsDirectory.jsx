// ---------------------------------------------------------------------------
// Jharkhand Jobs Directory — 2026 Comprehensive Government Job Portal
// Detailed state-specific job listings with jurisdiction information
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react'
import SEOHead from '../components/SEOHead.jsx'
import { getJobs, getJobsByCategory } from '../services/api.js'
import { isJobExpired } from '../utils/dateHelper.js'
import { MapPin, Calendar, Briefcase, Shield, Award, Users, Clock } from 'lucide-react'

const DISTRICTS = [
  { name: 'Ranchi', code: 'ranchi', keyJobs: ['JPSC', 'JSSC', 'Police', 'HC'] },
  { name: 'Jamshedpur', code: 'jamshedpur', keyJobs: ['Tata Steel', 'Jindal', 'Coal India'] },
  { name: 'Dhanbad', code: 'dhanbad', keyJobs: ['Coal Mining', 'HPC', 'Railways'] },
  { name: 'Bokaro', code: 'bokaro', keyJobs: ['Hindustan Zinc', 'Steel', 'Mining'] },
  { name: 'East Singhbhum', code: 'east-singhbhum', keyJobs: ['Industrial Jobs', 'Private Sector'] },
  { name: 'West Singhbhum', code: 'west-singhbhum', keyJobs: ['Jamshedpur Jobs', 'Tata', 'Steel'] },
  { name: 'Dhanbad District', code: 'dhanbad-dist', keyJobs: ['Coal Sector', 'Power'] },
  { name: 'Bokaro Steel', code: 'bokaro-steel', keyJobs: ['Steel Plant', 'Mining'] },
  { name: 'Godda', code: 'godda', keyJobs: ['Textile', 'Small Industries'] },
  { name: 'Gumla', code: 'gumla', keyJobs: ['Forest Dept', 'Tribal Areas'] },
  { name: 'Garhwa', code: 'garhwa', keyJobs: ['District Council', 'NGO Jobs'] },
  { name: 'Palamau', code: 'palamau', keyJobs: ['Forest', 'Agriculture', 'Minorities'] },
  { name: 'Singhdih', code: 'singhdih', keyJobs: ['Border Area', 'Security'] },
  { name: 'Hazaribagh', code: 'hazaribagh', keyJobs: ['Mining', 'Power', 'Coal'] },
  { name: 'Koderma', code: 'koderma', keyJobs: ['District Admin', 'Forest'] },
  { name: 'Fazilka', code: 'fazilka', keyJobs: ['Agriculture', 'Small Industry'] },
  { name: 'Chatra', code: 'chatra', keyJobs: ['Agriculture', 'Forest', 'Mining'] },
  { name: 'Mainaguri', code: 'mainaguri', keyJobs: ['Cross-border', 'Trade'] },
  { name: 'Deoghar', code: 'deoghar', keyJobs: ['Industrial', 'Service'] },
  { name: 'Jamtara', code: 'jamtara', keyJobs: ['Armed Forces', 'Mining'] },
  { name: 'Saraikela', code: 'saraikela', keyJobs: ['Tribal Areas', 'Handloom'] },
  { name: 'Phusro', code: 'phusro', keyJobs: ['Industrial', 'Mining'] },
  { name: 'Chirkunda', code: 'chirkunda', keyJobs: ['Coal Mining', 'Power'] },
  { name: 'Jagjeetpur', code: 'jagjeetpur', keyJobs: ['Agricultural', 'Forest'] },
  { name: 'Mandar', code: 'mandar', keyJobs: ['Forest', 'Tribal', 'Conservation'] },
]

const RECRUITMENT_BOARDS = [
  {
    name: 'Jharkhand Public Service Commission (JPSC)',
    url: 'https://www.jpsc.gov.in',
    codes: ['jpsc'],
    description: 'State civil services, judicial and police services examinations',
    keyExams: ['Combined Civil Services', 'State Police Service', 'Judicial Service'],
  },
  {
    name: 'Jharkhand Staff Selection Commission (JSSC)',
    url: 'https://jssc.nic.in',
    codes: ['jssc'],
    description: 'State-level staff selection for clerk, assistant, and technical posts',
    keyExams: ['CGL', 'Stenographer', 'Assistant', 'Constable'],
  },
  {
    name: 'Jharkhand Police Recruitment Board (JPRB)',
    url: 'https://www.jhpolice.gov.in',
    codes: ['police'],
    description: 'Police force recruitment for constable, SI, and specialized ranks',
    keyExams: ['Constable Bharti', 'Police SI', 'Commando Battalion'],
  },
  {
    name: 'Jharkhand High Court',
    url: 'https://jharkhandhighcourt.nic.in',
    codes: ['hc'],
    description: 'Judicial services and court staff recruitment',
    keyExams: ['Judicial Officer', 'Court Clerk', 'Stenographer'],
  },
  {
    name: 'Jharkhand State Disaster Risk Reduction Agency (JhSDRRA)',
    url: 'https://jharkhand.gov.in',
    codes: ['disaster'],
    description: 'Disaster management and climate resilience roles',
    keyExams: ['Disaster Management', 'Response Coordinator'],
  },
  {
    name: 'District Administration Offices',
    url: 'https://districts.jharkhand.gov.in',
    codes: ['district'],
    description: 'District collector, revenue, and administrative services',
    keyExams: ['District Officer', 'Revenue Officer', 'Counselor'],
  },
]

export default function JharkhandJobsDirectory() {
  const [jobsByDistrict, setJobsByDistrict] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedDistrict, setSelectedDistrict] = useState('ranchi')

  useEffect(() => {
    let active = true
    setLoading(true)

    // Fetch jobs for each district category
    const fetchDistrictJobs = async () => {
      const results = {}
      for (const district of DISTRICTS.slice(0, 8)) {
        try {
          const data = await getJobs({ category: district.code, limit: 5 })
          const validJobs = data?.jobs?.filter(j => !isJobExpired(j)) || []
          results[district.code] = validJobs
        } catch {
          results[district.code] = []
        }
      }
      if (active) {
        setJobsByDistrict(results)
        setLoading(false)
      }
    }

    fetchDistrictJobs()

    return () => { active = false }
  }, [])

  const handleDistrictSelect = async (code) => {
    setSelectedDistrict(code)
    if (!jobsByDistrict[code]) {
      try {
        const data = await getJobs({ category: code, limit: 10 })
        const validJobs = data?.jobs?.filter(j => !isJobExpired(j)) || []
        setJobsByDistrict(prev => ({
          ...prev,
          [code]: validJobs
        }))
      } catch {
        setJobsByDistrict(prev => ({
          ...prev,
          [code]: []
        }))
      }
    }
  }

  const currentJobs = jobsByDistrict[selectedDistrict] || []
  const selectedDistrictData = DISTRICTS.find(d => d.code === selectedDistrict)

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
      <SEOHead
        title="Jharkhand Jobs Directory 2026 | District-wise Govt Jobs by Sector"
        description="Comprehensive directory of Jharkhand government jobs organized by district. Find JPSC, JSSC, Police, Rozgar Mela, Private Sector and central government jobs in Ranchi, Jamshedpur, Dhanbad and all 24 districts."
        canonical="https://jharkhand.jobalertx.com/jobs-directory"
        keywords="Jharkhand jobs by district, Ranchi jobs, Jamshedpur jobs, Dhanbad government jobs, Jharkhand state govt jobs, district-wise job alerts"
      />

      <header className="card p-6">
        <h1 className="text-2xl font-bold text-ink mb-2">Jharkhand Jobs Directory 2026</h1>
        <p className="text-ink-soft">
          District-wise organized job listings for Jharkhand government recruitment. Covers JPSC, JSSC, Police, High Court, Rozgar Mela, and private sector opportunities.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-teal-500" />
            <span>All 24 Districts Covered</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-orange-400" />
            <span>Updated Daily</span>
          </span>
          <span className="flex items-center gap-1">
            <Shield size={12} className="text-emerald-400" />
            <span>Verified Sources Only</span>
          </span>
        </div>
      </header>

      {/* Recruitment Boards Section */}
      <section className="card p-6">
        <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <Briefcase size={18} className="text-teal-500" />
          Jharkhand Recruitment Authorities
        </h2>
        <p className="text-ink-soft text-sm mb-4">
          All official recruitment portals and key departments for Jharkhand government jobs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECRUITMENT_BOARDS.map((board) => (
            <div key={board.name} className="border border-hairline rounded-xl p-4 hover:border-teal-500/30 transition-all">
              <h3 className="font-bold text-ink mb-2">
                <a
                  href={board.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-600 transition-colors"
                >
                  {board.name}
                </a>
              </h3>
              <p className="text-xs text-ink-soft mb-2">{board.description}</p>
              <div className="flex flex-wrap gap-1 text-[11px]">
                {board.keyExams.map(exam => (
                  <span key={exam} className="bg-subtle px-2 py-0.5 rounded text-ink-muted">{exam}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* District Filter */}
      <section className="card p-6">
        <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-teal-500" />
          Browse Jobs by District
        </h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {DISTRICTS.slice(0, 12).map((district) => (
            <button
              key={district.code}
              onClick={() => handleDistrictSelect(district.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${selectedDistrict === district.code
                  ? 'bg-teal-500 text-white'
                  : 'bg-surface border border-hairline text-ink-soft hover:bg-subtle'
                }`}
            >
              {district.name}
            </button>
          ))}
        </div>

        <div className="bg-surface/50 rounded-lg p-4">
          <p className="text-sm text-ink-soft mb-3">
            <strong>{selectedDistrictData?.name || 'Selected District'}:</strong> {selectedDistrictData?.keyJobs.join(', ')}
          </p>

          {loading ? (
            <div className="flex items-center gap-3 text-ink-muted">
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Loading jobs for this district...</span>
            </div>
          ) : currentJobs.length === 0 ? (
            <p className="text-sm text-ink-muted">
              No active jobs found in this district at the moment. Check back for updates or view all jobs.
            </p>
          ) : (
            <div className="space-y-3">
              {currentJobs.map((job) => (
                <div key={job.id} className="border border-hairline rounded-lg p-3 hover:border-teal-500/30 transition-all">
                  <h3 className="font-bold text-ink text-sm">{job.title}</h3>
                  <p className="text-xs text-ink-muted mt-1 line-clamp-2">
                    {job.tagline || job.shortInfo || 'Govt job notification'}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-ink-muted">
                    {job.postedOn && <span>{job.postedOn}</span>}
                    {job.org && <span className="flex items-center gap-1">
                      <Award size={10} />
                      {job.org}
                    </span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Jharkhand Govt Structure */}
      <section className="card p-6">
        <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <Users size={18} className="text-teal-500" />
          Jharkhand Government Department Structure
        </h2>
        <p className="text-ink-soft text-sm mb-4">
          Understanding the organizational structure helps identify career opportunities across departments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-ink-muted">
          <div>
            <h3 className="font-semibold text-ink mb-2">Administrative Departments</h3>
            <ul className="space-y-1">
              <li><strong>Revenue Department</strong> - Tahsil, District Collector offices</li>
              <li><strong>Home Department</strong> - Police, Fire services, Security</li>
              <li><strong>Forest & Environment</strong> - Forest Dept, Wildlife, Conservation</li>
              <li><strong>Education Department</strong> - Schools, Colleges, Teachers</li>
              <li><strong>Health & Family Welfare</strong> - PHCs, District Hospitals</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-ink mb-2">Specialized Services</h3>
            <ul className="space-y-1">
              <li><strong>JharkhandPolice</strong> - State Police, Armed Reserve, Commandos</li>
              <li><strong>JSSC</strong> - Staff Selection, Clerical, Technical posts</li>
              <li><strong>JPSC</strong> - Civil Services, Joint Secretary level</li>
              <li><strong>Public Works Department</strong> - Engineering, Construction</li>
              <li><strong>Agriculture Department</strong> - Extension, Farming, Horticulture</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Important Dates Section */}
      <section className="card p-6 bg-teal-500/5 border border-teal-500/20">
        <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <Clock size={18} className="text-teal-600" />
          Typical Recruitment Timeline 2026
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/30 rounded-lg p-3">
            <h3 className="font-semibold text-ink mb-2">Jan-Mar</h3>
            <ul className="space-y-1 text-ink-muted">
              <li>JPSC Main Exam Results</li>
              <li>JSSC CGL Prelims</li>
              <li>Police PET Completion</li>
            </ul>
          </div>
          <div className="bg-white/30 rounded-lg p-3">
            <h3 className="font-semibold text-ink mb-2">Apr-Jun</h3>
            <ul className="space-y-1 text-ink-muted">
              <li>Admit Card Releases</li>
              <li>Result Declaration</li>
              <li>Interview Schedule</li>
            </ul>
          </div>
          <div className="bg-white/30 rounded-lg p-3">
            <h3 className="font-semibold text-ink mb-2">Jul-Sep</h3>
            <ul className="space-y-1 text-ink-muted">
              <li>Document Verification</li>
              <li>Medical Examination</li>
              <li>Training Registration</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="card p-6 text-center">
        <h2 className="text-xl font-bold text-ink mb-3">Need Help Finding Jobs?</h2>
        <p className="text-ink-soft text-sm mb-4">
          Have questions about a specific recruitment or need help with your application? Contact our editorial team.
        </p>
        <a
          href="mailto:support@jobalertx.com"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:brightness-110 transition-all"
        >
          Email Us at support@jobalertx.com
        </a>
      </section>
    </div>
  )
}