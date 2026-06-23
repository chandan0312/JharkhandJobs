import { useState, Fragment } from 'react';
import api from '../services/api';
import { 
  Sparkles, Link as LinkIcon, Calendar, Briefcase, Award, 
  FileText, CheckCircle, BookOpen, Bell, ChevronRight, ChevronDown, 
  RefreshCw, Edit, Save, ArrowRight, Check, Trash2, Plus, ChevronUp 
} from 'lucide-react';

const AiImporter = () => {
  // Wizard Stepper State
  const [currentStep, setCurrentStep] = useState(1); // 1: Form, 2: AI processing, 3: Tabular Preview/Edit, 4: Publish Success

  // Form Fields
  const [contentType, setContentType] = useState('Job');
  const [examTitle, setExamTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // AI Extraction & Preview states
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [activeRefTab, setActiveRefTab] = useState('Full Description');

  const [extractedItems, setExtractedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [expandedItemIds, setExpandedItemIds] = useState([]);
  const [globalFields, setGlobalFields] = useState({
    organization: '',
    orgShort: '',
    applyLink: '',
    pdfUrl: '',
    examDate: ''
  });

  const contentTypes = [
    { name: 'Job', icon: Briefcase, color: '#10B981', bg: '#EFF6FF', desc: 'AI will extract job related information like vacancy, dates, eligibility, salary, etc.' },
    { name: 'Admit Card', icon: FileText, color: '#6366F1', bg: '#EEF2FF', desc: 'AI will extract exam roll numbers release date, links, and admit card download dates.' },
    { name: 'Result', icon: Award, color: '#06B6D4', bg: '#ECFEFF', desc: 'AI will parse final selections lists, cut-off percentages, and exam roll results.' },
    { name: 'Answer Key', icon: CheckCircle, color: '#8B5CF6', bg: '#F5F3FF', desc: 'AI will fetch objection links, download sheets, and key release dates.' },
    { name: 'Admission', icon: BookOpen, color: '#F59E0B', bg: '#FEF3C7', desc: 'AI will scrape college intake criteria, seat matrix, fees, and course lists.' },
    { name: 'Syllabus', icon: FileText, color: '#EC4899', bg: '#FDF2F8', desc: 'AI will extract subject details, physical criteria, and test syllabus schemes.' },
    { name: 'Notification', icon: Bell, color: '#EAB308', bg: '#FEF9C3', desc: 'AI will extract general news alerts, guidelines, and press notes.' }
  ];

  const activeTypeConfig = contentTypes.find(t => t.name === contentType) || contentTypes[0];

  // Helper to parse salary range min/max
  const parseSalary = (salaryStr) => {
    if (!salaryStr) return { min: 21700, max: 69100 };
    const clean = salaryStr.replace(/,/g, '');
    const matches = clean.match(/\d+/g);
    if (matches && matches.length >= 2) {
      return { min: Number(matches[0]), max: Number(matches[1]) };
    } else if (matches && matches.length === 1) {
      return { min: Number(matches[0]), max: Number(matches[0]) * 3 };
    }
    return { min: 21700, max: 69100 };
  };

  // Handler: trigger AI Scraper API
  const handleStartExtraction = async () => {
    if (!sourceUrl) {
      alert('Please enter a valid Source URL.');
      return;
    }
    if (!examTitle) {
      alert('Please enter the Exam/Job Title.');
      return;
    }

    setIsExtracting(true);
    setCurrentStep(2);

    try {
      const response = await api.post('/admin/scrape-url', {
        url: sourceUrl,
        category: contentType,
        examName: examTitle
      });

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setExtractedData(data);
        
        // Initialize global fields
        const orgName = data.organization || data.overview?.organization || 'Government Department';
        const orgAbbr = data.orgShort || (orgName !== 'Government Department' ? orgName.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase() : 'GOVT');
        setGlobalFields({
          organization: orgName,
          orgShort: orgAbbr,
          applyLink: data.applyLink || data.importantLinks?.[0]?.linkUrl || sourceUrl || '',
          pdfUrl: data.pdfUrl || data.importantLinks?.[0]?.linkUrl || sourceUrl || '',
          examDate: data.examDate || data.importantDates?.examDate || ''
        });

        // Initialize editable tabular items matching requested layout
        let itemsList = [];
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          itemsList = data.items.map((item, idx) => ({
            id: idx + 1,
            jobPosition: item.jobPosition || data.overview?.postName || examTitle || '',
            category: item.category || (contentType === 'Job' ? 'Jharkhand' : 'Upcoming Exams'),
            eligibility: item.eligibility || data.eligibility || 'See details',
            location: item.location || data.overview?.location || 'Jharkhand',
            lastDate: item.lastDate || data.importantDates?.applicationLast || '',
            vacancies: item.vacancies || data.overview?.vacancies || 'See Notice',
            status: item.status || (contentType === 'Admit Card' ? 'Admit Card Out' : (contentType === 'Result' ? 'Result Out' : 'Notice Released')),
            salary: item.salary || data.overview?.salary || '',
            description: item.description || data.summary || data.fullDescription?.substring(0, 200) || '',
            applyLink: item.applyLink || data.importantLinks?.[0]?.linkUrl || sourceUrl || '',
            pdfUrl: item.pdfUrl || data.importantLinks?.[0]?.linkUrl || sourceUrl || '',
            isPublished: false,
            isPublishing: false,
            publishError: null
          }));
        } else {
          // Fallback: create a single item
          const salaryStr = data.overview?.salary || '';
          itemsList = [{
            id: 1,
            jobPosition: data.overview?.postName || examTitle || '',
            category: contentType === 'Job' ? 'Jharkhand' : 'Upcoming Exams',
            eligibility: data.eligibility || 'See details',
            location: data.overview?.location || 'Jharkhand',
            lastDate: data.importantDates?.applicationLast || '',
            vacancies: data.overview?.vacancies || 'See Notice',
            status: contentType === 'Admit Card' ? 'Admit Card Out' : (contentType === 'Result' ? 'Result Out' : 'Notice Released'),
            salary: salaryStr,
            description: data.summary || data.fullDescription?.substring(0, 200) || '',
            applyLink: data.importantLinks?.[0]?.linkUrl || sourceUrl || '',
            pdfUrl: data.importantLinks?.[0]?.linkUrl || sourceUrl || '',
            isPublished: false,
            isPublishing: false,
            publishError: null
          }];
        }
        setExtractedItems(itemsList);
        setSelectedItemIds(itemsList.map(item => item.id));
        setExpandedItemIds([]);
        setCurrentStep(3); // Go to Preview
      } else {
        throw new Error('No data received from scraper.');
      }
    } catch (err) {
      console.error(err);
      alert(`AI Extraction failed: ${err.response?.data?.message || err.message}`);
      setCurrentStep(1);
    } finally {
      setIsExtracting(false);
    }
  };

  // Handler: Save and Publish
  const handlePublishItems = async (idsToPublish) => {
    if (idsToPublish.length === 0) {
      alert('Please select at least one item to publish.');
      return;
    }

    setIsExtracting(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of idsToPublish) {
      const item = extractedItems.find(i => i.id === id);
      if (!item || item.isPublished) continue;

      setExtractedItems(prev => prev.map(i => i.id === id ? { ...i, isPublishing: true, publishError: null } : i));

      try {
        if (contentType === 'Job') {
          const salaryObj = parseSalary(item.salary);
          const jobPayload = {
            title: item.jobPosition,
            company: globalFields.organization,
            location: item.location,
            type: 'Full Time',
            salary: { min: Number(salaryObj.min), max: Number(salaryObj.max), currency: '₹', period: 'monthly' },
            experience: 'Fresher / Experienced',
            qualification: item.eligibility,
            category: item.category,
            industry: 'Govt Jobs',
            description: item.description || `${item.jobPosition} vacancy details.`,
            vacancies: Number(item.vacancies) || 45,
            responsibilities: extractedData?.importantInstructions ? [extractedData.importantInstructions] : ['Execute shift operations.', 'Maintain daily logs.'],
            requirements: [item.eligibility],
            applyLink: item.applyLink || globalFields.applyLink || sourceUrl,
            pdfUrl: item.pdfUrl || globalFields.pdfUrl || sourceUrl,
            lastDate: item.lastDate ? new Date(item.lastDate).toISOString().slice(0, 10) : null
          };
          await api.post('/jobs', jobPayload);
        } else {
          const examPayload = {
            title: item.jobPosition,
            organization: globalFields.organization,
            orgShort: globalFields.orgShort,
            category: item.category,
            lastDate: item.lastDate,
            posts: item.vacancies,
            status: item.status,
            description: item.description || `${item.jobPosition} notice details.`,
            applyLink: item.applyLink || globalFields.applyLink || sourceUrl,
            pdfUrl: item.pdfUrl || globalFields.pdfUrl || sourceUrl,
            examDate: globalFields.examDate
          };
          await api.post('/exams', examPayload);
        }

        setExtractedItems(prev => prev.map(i => i.id === id ? { ...i, isPublishing: false, isPublished: true } : i));
        successCount++;
      } catch (err) {
        console.error(err);
        const errMsg = err.response?.data?.message || err.message;
        setExtractedItems(prev => prev.map(i => i.id === id ? { ...i, isPublishing: false, publishError: errMsg } : i));
        failCount++;
      }
    }

    setIsExtracting(false);

    if (failCount === 0) {
      const allDone = extractedItems.every(i => idsToPublish.includes(i.id) ? true : i.isPublished);
      if (allDone) {
        setCurrentStep(4);
      } else {
        alert(`Successfully published ${successCount} item(s)!`);
      }
    } else {
      alert(`Published ${successCount} item(s) successfully. Failed to publish ${failCount} item(s). Check row-level errors.`);
    }
  };

  const handleItemFieldChange = (id, fieldName, val) => {
    setExtractedItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [fieldName]: val };
      }
      return item;
    }));
  };

  const handleToggleRowExpansion = (id) => {
    setExpandedItemIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleDeleteRow = (id) => {
    setExtractedItems(prev => prev.filter(item => item.id !== id));
    setSelectedItemIds(prev => prev.filter(rowId => rowId !== id));
  };

  const handleAddCustomRow = () => {
    const newId = extractedItems.length > 0 ? Math.max(...extractedItems.map(item => item.id)) + 1 : 1;
    const newRow = {
      id: newId,
      jobPosition: 'New Position',
      category: contentType === 'Job' ? 'Jharkhand' : 'Upcoming Exams',
      eligibility: '10th / 12th / Graduate',
      location: 'Jharkhand, India',
      lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      vacancies: '50',
      status: contentType === 'Job' ? 'Active' : (contentType === 'Admit Card' ? 'Admit Card Out' : 'Notice Released'),
      salary: '',
      description: '',
      applyLink: globalFields.applyLink || sourceUrl,
      pdfUrl: globalFields.pdfUrl || sourceUrl,
      isPublished: false,
      isPublishing: false,
      publishError: null
    };
    setExtractedItems(prev => [...prev, newRow]);
    setSelectedItemIds(prev => [...prev, newId]);
  };

  const getCategoryOptions = () => {
    if (contentType === 'Job') {
      return [
        { value: 'Jharkhand', label: 'Jharkhand Board (JSSC/JPSC)' },
        { value: 'SSC', label: 'SSC (Central)' },
        { value: 'Railway', label: 'Railways (RRB)' },
        { value: 'Bank', label: 'Banking Sector' },
        { value: 'Defence', label: 'Defence' },
        { value: 'Other', label: 'Other Govt' },
        { value: 'Private', label: 'Private Jobs' }
      ];
    } else {
      return [
        { value: 'Upcoming Exams', label: 'Upcoming Exams / Notices' },
        { value: 'Admit Card', label: 'Admit Cards Download' },
        { value: 'Results', label: 'Exam Results' },
        { value: 'Answer Key', label: 'Official Answer Keys' }
      ];
    }
  };



  return (
    <div style={{ padding: '0px 0px 30px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. Header and Breadcrumbs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>AI Content Importer</h1>
            <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Beta</span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Automatically fetch and create job posts using AI</p>
        </div>
        <button style={styles.howItWorksBtn}>
          <Sparkles size={14} />
          <span>How it works</span>
        </button>
      </div>

      {/* 2. Horizontal Stepper Wizard */}
      <div style={styles.stepperContainer}>
        {[
          { label: 'Select Type', desc: 'Choose content type' },
          { label: 'Add Source', desc: 'Paste URL' },
          { label: 'AI Processing', desc: 'Extracting information' },
          { label: 'Preview Data', desc: 'Review extracted data' },
          { label: 'Publish', desc: 'Save and publish' }
        ].map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '13px',
                  backgroundColor: isCompleted ? '#D1FAE5' : (isActive ? '#059669' : '#FFFFFF'),
                  color: isCompleted ? '#065F46' : (isActive ? '#FFFFFF' : '#94A3B8'),
                  border: isCompleted ? '1px solid #A7F3D0' : (isActive ? '1px solid #059669' : '1px solid #CBD5E1'),
                  transition: 'all 0.3s ease'
                }}>
                  {isCompleted ? <Check size={16} /> : stepNum}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: isActive ? '700' : '600', color: isActive ? '#0F172A' : '#64748B' }}>{step.label}</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>{step.desc}</span>
                </div>
              </div>
              {idx < 4 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: stepNum < currentStep ? '#10B981' : '#E2E8F0',
                  margin: '0 16px',
                  minWidth: '20px'
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Steps Rendering */}
      {currentStep === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '430px 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Enter Source Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
                <Sparkles size={18} style={{ color: '#059669' }} />
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Enter Source Details</h3>
              </div>

              {/* A. Select Content Type */}
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Select Content Type *</label>
                <select 
                  value={contentType} 
                  onChange={(e) => setContentType(e.target.value)} 
                  style={styles.select}
                >
                  <option value="Job">💼 Job</option>
                  <option value="Admit Card">📄 Admit Card</option>
                  <option value="Result">🏆 Result</option>
                  <option value="Answer Key">✔️ Answer Key</option>
                  <option value="Admission">📖 Admission</option>
                  <option value="Syllabus">📝 Syllabus</option>
                  <option value="Notification">🔔 Notification</option>
                </select>
              </div>

              {/* Banner / Tip Alert box */}
              <div style={{ ...styles.alertBox, backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46' }}>
                {activeTypeConfig.desc}
              </div>

              {/* B. Exam Name / Job Title */}
              <div style={{ marginBottom: '16px', marginTop: '16px' }}>
                <label style={styles.label}>Select Exam / Job Title *</label>
                <input 
                  type="text" 
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Jharkhand Police Constable Recruitment 2026"
                  style={styles.input}
                />
              </div>

              {/* C. Source URL */}
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Source URL *</label>
                <div style={{ position: 'relative' }}>
                  <LinkIcon size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input 
                    type="text" 
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://jssc.nic.in/notification/..."
                    style={{ ...styles.input, paddingLeft: '34px' }}
                  />
                </div>
              </div>

              {/* Banner / Tip Alert box */}
              <div style={{ ...styles.alertBox, backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', marginBottom: '20px' }}>
                Please provide official website URL only. AI works best with government/official websites.
              </div>

              {/* D. Advanced Options Accordion */}
              <div style={{ marginBottom: '24px' }}>
                <button 
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  style={styles.accordionHeader}
                >
                  <span>Advanced Options</span>
                  <ChevronDown size={14} style={{ transform: advancedOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {advancedOpen && (
                  <div style={styles.accordionContent}>
                    <label style={styles.label}>Custom Extraction Rules (Optional Prompt Override)</label>
                    <textarea 
                      rows="3" 
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g. Focus on physical criteria parameters and exclude medical standard tables."
                      style={styles.textarea}
                    />
                  </div>
                )}
              </div>

              {/* E. Submit Button */}
              <button 
                onClick={handleStartExtraction}
                style={styles.primaryBtn}
              >
                <Sparkles size={16} />
                <span>Start AI Extraction</span>
              </button>
            </div>

            {/* Supported Content Types visual block */}
            <div style={styles.card}>
              <h4 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.5px', marginBottom: '12px' }}>Supported Content Types</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {contentTypes.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: t.bg, color: t.color, border: `1px solid ${t.color}25`, padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                      <Icon size={12} />
                      {t.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Extracted Preview (Empty State) */}
          <div style={{ ...styles.card, minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
            <Sparkles size={48} style={{ color: '#E2E8F0', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#64748B', marginBottom: '4px' }}>Awaiting Source URL</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', maxWidth: '300px', margin: 0 }}>
              Once you trigger the extraction, the AI will download the page and present structured details in this preview panel.
            </p>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div style={{ ...styles.card, minHeight: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={styles.spinnerContainer}>
            <RefreshCw size={40} style={styles.spinner} />
            <Sparkles size={18} style={{ position: 'absolute', top: '11px', left: '11px', color: '#059669' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', marginTop: '20px' }}>AI Reading & Extracting Data...</h3>
          <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6', margin: 0 }}>
            Gemini AI is analyzing the page contents from <strong>{sourceUrl}</strong>, removing ads/footers, and converting tabular lists and official schedules into structured records.
          </p>
        </div>
      )}

      {currentStep === 3 && extractedData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Global Settings & Direct Inline Edit Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* A. Global Metadata / Reference Parameters */}
            <div style={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                <Edit size={16} style={{ color: '#059669' }} />
                <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Global Notification Settings</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={styles.label}>Conducting Organization</label>
                  <input 
                    type="text" 
                    value={globalFields.organization} 
                    onChange={(e) => setGlobalFields(prev => ({ ...prev, organization: e.target.value }))}
                    style={styles.editInputInline}
                    placeholder="e.g. JSSC"
                  />
                </div>
                <div>
                  <label style={styles.label}>Org Abbreviation</label>
                  <input 
                    type="text" 
                    value={globalFields.orgShort} 
                    onChange={(e) => setGlobalFields(prev => ({ ...prev, orgShort: e.target.value }))}
                    style={styles.editInputInline}
                    placeholder="e.g. JSSC"
                  />
                </div>
                <div>
                  <label style={styles.label}>Default Exam Date</label>
                  <input 
                    type="text" 
                    value={globalFields.examDate} 
                    onChange={(e) => setGlobalFields(prev => ({ ...prev, examDate: e.target.value }))}
                    style={styles.editInputInline}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                <div>
                  <label style={styles.label}>Default Apply URL</label>
                  <input 
                    type="text" 
                    value={globalFields.applyLink} 
                    onChange={(e) => setGlobalFields(prev => ({ ...prev, applyLink: e.target.value }))}
                    style={styles.editInputInline}
                  />
                </div>
                <div>
                  <label style={styles.label}>Default PDF Document URL</label>
                  <input 
                    type="text" 
                    value={globalFields.pdfUrl} 
                    onChange={(e) => setGlobalFields(prev => ({ ...prev, pdfUrl: e.target.value }))}
                    style={styles.editInputInline}
                  />
                </div>
              </div>
            </div>

            {/* B. Table of Extracted Items */}
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} style={{ color: '#059669' }} />
                  <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Extracted Positions / Vacancies List</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px' }}>
                    {extractedItems.length} Position(s) found
                  </span>
                </div>
              </div>

              {/* TABULAR FORMAT */}
              <div style={{ overflowX: 'auto', margin: '0 -24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                      <th style={{ padding: '12px 16px', width: '40px', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={extractedItems.length > 0 && selectedItemIds.length === extractedItems.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItemIds(extractedItems.map(item => item.id));
                            } else {
                              setSelectedItemIds([]);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ ...styles.th, width: '220px' }}>Job Position</th>
                      <th style={{ ...styles.th, width: '130px' }}>Category</th>
                      <th style={{ ...styles.th, width: '160px' }}>Eligibility</th>
                      <th style={{ ...styles.th, width: '110px' }}>Location</th>
                      <th style={{ ...styles.th, width: '100px' }}>Last Date</th>
                      <th style={{ ...styles.th, width: '80px' }}>Vacancies</th>
                      <th style={{ ...styles.th, width: '100px' }}>Status</th>
                      <th style={{ ...styles.th, width: '100px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedItems.map((item) => {
                      const isExpanded = expandedItemIds.includes(item.id);
                      const isSelected = selectedItemIds.includes(item.id);
                      
                      return (
                        <Fragment key={item.id}>
                          <tr style={{ 
                            ...styles.tableRow, 
                            backgroundColor: item.isPublished ? '#F0FDF4' : (isSelected ? '#F8FAFC' : '#FFFFFF'),
                            opacity: item.isPublishing ? 0.7 : 1,
                            transition: 'background-color 0.2s ease'
                          }}>
                            {/* Checkbox cell */}
                            <td style={{ padding: '8px 16px', textAlign: 'center', borderBottom: '1px solid #E2E8F0' }}>
                              <input 
                                type="checkbox"
                                checked={isSelected}
                                disabled={item.isPublished || item.isPublishing}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedItemIds(prev => [...prev, item.id]);
                                  } else {
                                    setSelectedItemIds(prev => prev.filter(id => id !== item.id));
                                  }
                                }}
                                style={{ cursor: 'pointer' }}
                              />
                            </td>

                            {/* Job Position cell */}
                            <td style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <input 
                                  type="text" 
                                  value={item.jobPosition || ''} 
                                  onChange={(e) => handleItemFieldChange(item.id, 'jobPosition', e.target.value)}
                                  disabled={item.isPublished}
                                  className="inline-table-input"
                                  style={styles.inlineTableInput}
                                  placeholder="e.g. Constable"
                                />
                              </div>
                            </td>

                            {/* Category cell */}
                            <td style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0' }}>
                              <select 
                                value={item.category} 
                                onChange={(e) => handleItemFieldChange(item.id, 'category', e.target.value)}
                                disabled={item.isPublished}
                                style={styles.inlineTableSelect}
                              >
                                {getCategoryOptions().map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </td>

                            {/* Eligibility cell */}
                            <td style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0' }}>
                              <input 
                                type="text" 
                                value={item.eligibility || ''} 
                                onChange={(e) => handleItemFieldChange(item.id, 'eligibility', e.target.value)}
                                disabled={item.isPublished}
                                className="inline-table-input"
                                style={styles.inlineTableInput}
                              />
                            </td>

                            {/* Location cell */}
                            <td style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0' }}>
                              <input 
                                type="text" 
                                value={item.location || ''} 
                                onChange={(e) => handleItemFieldChange(item.id, 'location', e.target.value)}
                                disabled={item.isPublished}
                                className="inline-table-input"
                                style={styles.inlineTableInput}
                              />
                            </td>

                            {/* Last Date cell */}
                            <td style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0' }}>
                              <input 
                                type="text" 
                                value={item.lastDate || ''} 
                                onChange={(e) => handleItemFieldChange(item.id, 'lastDate', e.target.value)}
                                disabled={item.isPublished}
                                placeholder="YYYY-MM-DD"
                                className="inline-table-input"
                                style={styles.inlineTableInput}
                              />
                            </td>

                            {/* Vacancies cell */}
                            <td style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0' }}>
                              <input 
                                type="text" 
                                value={item.vacancies || ''} 
                                onChange={(e) => handleItemFieldChange(item.id, 'vacancies', e.target.value)}
                                disabled={item.isPublished}
                                className="inline-table-input"
                                style={styles.inlineTableInput}
                              />
                            </td>

                            {/* Status cell */}
                            <td style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0' }}>
                              <input 
                                type="text" 
                                value={item.status || ''} 
                                onChange={(e) => handleItemFieldChange(item.id, 'status', e.target.value)}
                                disabled={item.isPublished}
                                className="inline-table-input"
                                style={styles.inlineTableInput}
                              />
                            </td>

                            {/* Actions cell */}
                            <td style={{ padding: '8px 16px', textAlign: 'center', borderBottom: '1px solid #E2E8F0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <button
                                  onClick={() => handleToggleRowExpansion(item.id)}
                                  title="Toggle details"
                                  style={styles.actionIconButton}
                                >
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                                
                                {item.isPublished ? (
                                  <span style={{ color: '#10B981', display: 'flex', alignItems: 'center' }} title="Published successfully">
                                    <CheckCircle size={16} />
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handlePublishItems([item.id])}
                                    disabled={item.isPublishing}
                                    style={{
                                      ...styles.publishRowBtn,
                                      backgroundColor: item.publishError ? '#EF4444' : '#059669'
                                    }}
                                    title={item.publishError ? `Error: ${item.publishError}. Click to retry.` : "Publish this position"}
                                  >
                                    {item.isPublishing ? (
                                      <RefreshCw size={11} className="spin-animation" style={{ animation: 'spin 1.2s linear infinite' }} />
                                    ) : (
                                      'Publish'
                                    )}
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteRow(item.id)}
                                  disabled={item.isPublished || item.isPublishing}
                                  title="Remove row"
                                  style={{
                                    ...styles.actionIconButton,
                                    color: '#EF4444',
                                    opacity: item.isPublished ? 0.3 : 1
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expansion Details Row */}
                          {isExpanded && (
                            <tr style={{ backgroundColor: '#F8FAFC' }}>
                              <td colSpan="9" style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
                                  <div>
                                    <label style={styles.label}>Salary Scale / Package</label>
                                    <input 
                                      type="text" 
                                      value={item.salary || ''} 
                                      onChange={(e) => handleItemFieldChange(item.id, 'salary', e.target.value)}
                                      disabled={item.isPublished}
                                      style={styles.editInputInline}
                                      placeholder="e.g. 21700 - 69100"
                                    />
                                    
                                    <div style={{ marginTop: '10px' }}>
                                      <label style={styles.label}>Apply URL (if specific)</label>
                                      <input 
                                        type="text" 
                                        value={item.applyLink || ''} 
                                        onChange={(e) => handleItemFieldChange(item.id, 'applyLink', e.target.value)}
                                        disabled={item.isPublished}
                                        style={styles.editInputInline}
                                      />
                                    </div>
                                    
                                    <div style={{ marginTop: '10px' }}>
                                      <label style={styles.label}>PDF URL (if specific)</label>
                                      <input 
                                        type="text" 
                                        value={item.pdfUrl || ''} 
                                        onChange={(e) => handleItemFieldChange(item.id, 'pdfUrl', e.target.value)}
                                        disabled={item.isPublished}
                                        style={styles.editInputInline}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label style={styles.label}>Description summary for this post</label>
                                    <textarea 
                                      rows="5" 
                                      value={item.description || ''} 
                                      onChange={(e) => handleItemFieldChange(item.id, 'description', e.target.value)}
                                      disabled={item.isPublished}
                                      style={styles.editTextareaInline}
                                      placeholder="Provide custom instructions, syllabus info, or criteria details..."
                                    />
                                    {item.publishError && (
                                      <div style={{ marginTop: '8px', color: '#EF4444', fontSize: '11px', fontWeight: '600' }}>
                                        ⚠️ Error publishing: {item.publishError}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleStartExtraction} 
                  style={styles.outlineBtn}
                >
                  <RefreshCw size={14} />
                  <span>Re-Extract URL</span>
                </button>
                <button 
                  onClick={handleAddCustomRow} 
                  style={styles.outlineBtn}
                >
                  <Plus size={14} />
                  <span>Add Custom Row</span>
                </button>
              </div>

              <button 
                onClick={() => handlePublishItems(selectedItemIds)}
                disabled={selectedItemIds.length === 0}
                style={{
                  ...styles.successBtn,
                  opacity: selectedItemIds.length === 0 ? 0.5 : 1,
                  cursor: selectedItemIds.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <span>Publish Selected ({selectedItemIds.filter(id => !extractedItems.find(i=>i.id===id)?.isPublished).length})</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Document Highlights (Reference Tabs) */}
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
              <Sparkles size={16} style={{ color: '#059669' }} />
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#1E293B', margin: 0 }}>AI Extracted Reference Info</h3>
            </div>

            {/* Document Highlight Selector buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {['Full Description', 'Eligibility Criteria', 'Vacancy Details', 'Application Fees', 'Selection Process', 'SEO Meta'].map((refTab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveRefTab(refTab)}
                  style={{
                    ...styles.refTabBtn,
                    backgroundColor: activeRefTab === refTab ? '#0B2017' : '#F1F5F9',
                    color: activeRefTab === refTab ? '#FFFFFF' : '#475569'
                  }}
                >
                  {refTab}
                </button>
              ))}
            </div>

            {/* Ref Panel Content */}
            <div style={styles.refContent}>
              {activeRefTab === 'Full Description' && (
                <div style={{ fontSize: '12.5px', color: '#4B5563', lineHeight: '1.6' }}>
                  {extractedData.fullDescription || extractedData.summary || 'N/A'}
                </div>
              )}
              {activeRefTab === 'Eligibility Criteria' && (
                <div style={{ fontSize: '12.5px', color: '#4B5563', lineHeight: '1.6' }}>
                  <strong>Age Limit:</strong> {extractedData.ageLimit || 'N/A'}<br /><br />
                  <strong>Qualification:</strong> {extractedData.eligibility || 'N/A'}
                </div>
              )}
              {activeRefTab === 'Vacancy Details' && (
                <div style={{ fontSize: '12.5px', color: '#4B5563', lineHeight: '1.6' }}>
                  {extractedData.vacancyDetails && extractedData.vacancyDetails.length > 0 ? (
                    extractedData.vacancyDetails.map((v, i) => (
                      <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid #F1F5F9' }}>
                        👉 {v.postName}: <strong>{v.vacancies} vacancies</strong>
                      </div>
                    ))
                  ) : 'N/A'}
                </div>
              )}
              {activeRefTab === 'Application Fees' && (
                <div style={{ fontSize: '12.5px', color: '#4B5563', lineHeight: '1.6' }}>
                  {extractedData.applicationFee || 'N/A'}
                </div>
              )}
              {activeRefTab === 'Selection Process' && (
                <div style={{ fontSize: '12.5px', color: '#4B5563', lineHeight: '1.6' }}>
                  {extractedData.selectionProcess || 'N/A'}
                </div>
              )}
              {activeRefTab === 'SEO Meta' && (
                <div style={{ fontSize: '12.5px', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Meta Title:</strong> {extractedData.seo?.metaTitle || 'N/A'}</div>
                  <div><strong>Meta Description:</strong> {extractedData.seo?.metaDescription || 'N/A'}</div>
                  <div><strong>Keywords:</strong> {extractedData.seo?.keywords?.join(', ') || 'N/A'}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div style={{ ...styles.card, minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
          }}>
            <CheckCircle size={36} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>Content Published Successfully!</h3>
          <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '420px', lineHeight: '1.6', marginBottom: '24px' }}>
            The extracted official information for <strong>{globalFields.organization}</strong> has been saved directly to the database and synced with the portal layout! Live users can now search and apply.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => {
                setExamTitle('');
                setSourceUrl('');
                setExtractedData(null);
                setExtractedItems([]);
                setSelectedItemIds([]);
                setExpandedItemIds([]);
                setGlobalFields({ organization: '', orgShort: '', applyLink: '', pdfUrl: '', examDate: '' });
                setCurrentStep(1);
              }}
              style={styles.primaryBtn}
            >
              Import Another URL
            </button>
            <button 
              onClick={() => window.location.reload()} 
              style={styles.secondaryBtn}
            >
              Return to Console
            </button>
          </div>
        </div>
      )}

      {/* 3. Steps Info Footer */}
      <div style={{ ...styles.card, marginTop: '32px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1E293B', marginBottom: '16px' }}>How AI Importer Works?</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          {[
            { step: '1. Add URL', desc: 'Paste official website URL' },
            { step: '2. AI Extracts', desc: 'AI reads and extracts data' },
            { step: '3. Review', desc: 'Preview extracted information' },
            { step: '4. Edit (Optional)', desc: 'Make corrections if needed' },
            { step: '5. Publish', desc: 'Save and publish on website' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '11px',
                border: '1px solid #BFDBFE'
              }}>
                {idx + 1}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>{item.step}</span>
                <span style={{ fontSize: '10px', color: '#64748B' }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// Custom styles object supporting HSL / premium palette
const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  stepperContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflowX: 'auto'
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#475569',
    display: 'block',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  editInputInline: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
    transition: 'border-color 0.15s ease'
  },
  editSelectInline: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '6px',
    outline: 'none',
    cursor: 'pointer'
  },
  editTextareaInline: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '6px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  inlineTableInput: {
    width: '100%',
    padding: '6px 10px',
    fontSize: '12.5px',
    color: '#1E293B',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '4px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease'
  },
  inlineTableSelect: {
    width: '100%',
    padding: '4px 6px',
    fontSize: '12.5px',
    color: '#1E293B',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease'
  },
  actionIconButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  publishRowBtn: {
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '26px',
    minWidth: '60px',
    transition: 'all 0.15s ease'
  },

  alertBox: {
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '500',
    lineHeight: '1.4'
  },
  accordionHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    cursor: 'pointer',
  },
  accordionContent: {
    border: '1px solid #E2E8F0',
    borderTop: 'none',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    padding: '14px',
    backgroundColor: '#FFFFFF',
  },
  howItWorksBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  primaryBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#059669',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(5,150,105,0.15)',
    transition: 'all 0.2s ease',
  },
  successBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#059669',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(5,150,105,0.15)',
    transition: 'all 0.2s ease',
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  outlineBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#4B5563',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tableRow: {
    borderBottom: '1px solid #E2E8F0'
  },

  th: {
    padding: '12px 16px',
    textAlign: 'left',
    color: '#475569',
    fontWeight: '800',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  spinnerContainer: {
    position: 'relative',
    width: '40px',
    height: '40px'
  },
  spinner: {
    color: '#059669',
    animation: 'spin 1.2s linear infinite'
  },
  refTabBtn: {
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: '700',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  refContent: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '16px',
    maxHeight: '440px',
    overflowY: 'auto'
  }
};

// Add input focus effects to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .spin-animation {
      animation: spin 1.2s linear infinite;
    }
    input:focus, select:focus, textarea:focus {
      border-color: #10B981 !important;
      box-shadow: 0 0 0 3px rgba(16,185,129,0.15) !important;
    }
    .inline-table-input:hover, select:hover {
      border-color: #CBD5E1 !important;
      background-color: #FFFFFF !important;
    }
    .inline-table-input:focus, select:focus {
      border-color: #10B981 !important;
      background-color: #FFFFFF !important;
      box-shadow: 0 0 0 2px rgba(16,185,129,0.15) !important;
    }
  `;
  document.head.appendChild(style);
}

export default AiImporter;
