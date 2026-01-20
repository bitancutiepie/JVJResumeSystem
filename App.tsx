import React, { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_RESUME_STATE, DEFAULT_RAW_INPUT, ResumeData, Experience, Education, Reference } from './types';
import { parseAndEnhanceResume } from './services/geminiService';
import ResumePreview from './components/ResumePreview';
import PhotoUpload from './components/PhotoUpload';
import WelcomeScreen from './components/WelcomeScreen';

declare global {
  interface Window {
    html2pdf: any;
    pdfjsLib: any;
    mammoth: any;
  }
}

const formSteps = [
  { title: 'Personal Details', key: 'personalInfo' },
  { title: 'Profile Photo', key: 'photo' },
  { title: 'Professional Summary', key: 'objective' },
  { title: 'Work Experience', key: 'experience' },
  { title: 'Education', key: 'education' },
  { title: 'Skills & Qualifications', key: 'skills' },
  { title: 'References', key: 'references' },
];

const App: React.FC = () => {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
  const [selectedInputMethod, setSelectedInputMethod] = useState<'ai' | 'manual' | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [currentSidebarTab, setCurrentSidebarTab] = useState<'content' | 'design'>('content');

  const [rawInput, setRawInput] = useState<string>(DEFAULT_RAW_INPUT);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_STATE);
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleResetAppAndMode = useCallback(() => {
    setShowWelcomeScreen(true);
    setSelectedInputMethod(null);
    setRawInput(DEFAULT_RAW_INPUT);
    setResumeData(INITIAL_RESUME_STATE);
    setUserPhoto(undefined);
    setIsGenerating(false);
    setError(null);
    setIsDownloading(false);
    setCurrentFormStep(0);
    setSelectedTemplate('classic');
    setCurrentSidebarTab('content');
    setActiveTab('edit');
  }, []);

  useEffect(() => {
    if (selectedInputMethod === 'ai' && showWelcomeScreen === false) {
      handleGenerate();
    }
  }, [selectedInputMethod, showWelcomeScreen]);

  useEffect(() => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, photo: userPhoto }
    }));
  }, [userPhoto]);

  const handleWelcomeSelection = (mode: 'ai' | 'manual') => {
    setSelectedInputMethod(mode);
    setShowWelcomeScreen(false);
  };

  const handleGenerate = async (overriddenText?: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const textToUse = overriddenText !== undefined ? overriddenText : rawInput;
      const enhancedData = await parseAndEnhanceResume(textToUse);

      setResumeData({
        ...enhancedData,
        personalInfo: {
          ...enhancedData.personalInfo,
          photo: userPhoto
        }
      });

      if (textToUse.toLowerCase().includes('harvard') || textToUse.toLowerCase().includes('academic')) {
        setSelectedTemplate('harvard');
      } else if (textToUse.toLowerCase().includes('modern') || textToUse.toLowerCase().includes('design')) {
        setSelectedTemplate('modern');
      }

      if (window.innerWidth < 768) setActiveTab('preview');
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setError(`Failed to generate resume: ${err.message || "An unknown error occurred."}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type;

    if (fileType === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
      }
      return fullText;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else {
      throw new Error("Unsupported file type. Please upload a PDF or DOCX.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setError(null);

    try {
      const extractedText = await extractTextFromFile(file);
      setRawInput(extractedText);
      await handleGenerate(extractedText);
    } catch (err: any) {
      console.error("Extraction Error:", err);
      setError(`File processing failed: ${err.message}`);
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handlePhotoUpload = (base64Image: string) => {
    setUserPhoto(base64Image);
  };

  const handleRemovePhoto = () => {
    setUserPhoto(undefined);
  };

  const addItem = (type: 'experience' | 'education' | 'references') => {
    const id = `${type}-${Date.now()}`;
    if (type === 'experience') {
      const newItem: Experience = { id, title: '', company: '', location: '', dates: '', description: '' };
      setResumeData(prev => ({ ...prev, experience: [...prev.experience, newItem] }));
    } else if (type === 'education') {
      const newItem: Education = { id, school: '', degree: '', dates: '', location: '' };
      setResumeData(prev => ({ ...prev, education: [...prev.education, newItem] }));
    } else {
      const newItem: Reference = { id, name: '', contact: '', relation: '' };
      setResumeData(prev => ({ ...prev, references: [...prev.references, newItem] }));
    }
  };

  const updateItem = (type: 'experience' | 'education' | 'references', id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      [type]: (prev[type] as any[]).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (type: 'experience' | 'education' | 'references', id: string) => {
    setResumeData(prev => ({
      ...prev,
      [type]: (prev[type] as any[]).filter(item => item.id !== id)
    }));
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('resume-preview-content');
    if (!element) return;
    setIsDownloading(true);
    const fileName = `${(resumeData.personalInfo.name || 'resume').replace(/\s+/g, '_')}_Resume.pdf`;
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save().then(() => setIsDownloading(false)).catch(() => setIsDownloading(false));
    } else {
      setIsDownloading(false);
      window.print();
    }
  };

  const handleDownloadDocx = async () => {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, SectionType } = await import('docx');
    const { saveAs } = await import('file-saver');

    const doc = new Document({
      sections: [{
        properties: { type: SectionType.CONTINUOUS },
        children: [
          // Header / Personal Info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: resumeData.personalInfo.name || "YOUR NAME", bold: true, size: 32 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}`, size: 20 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: resumeData.personalInfo.address, size: 20 }),
            ],
          }),

          // Objective
          new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_2, spacing: { before: 400 } }),
          new Paragraph({ children: [new TextRun({ text: resumeData.objective })] }),

          // Experience
          new Paragraph({ text: "WORK EXPERIENCE", heading: HeadingLevel.HEADING_2, spacing: { before: 400 } }),
          ...resumeData.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.title, bold: true }),
                new TextRun({ text: ` - ${exp.company}`, italized: true }),
              ]
            }),
            new Paragraph({
              children: [new TextRun({ text: `${exp.dates} | ${exp.location}`, size: 18, color: "666666" })]
            }),
            new Paragraph({
              children: [new TextRun({ text: exp.description })],
              spacing: { after: 200 }
            })
          ]),

          // Education
          new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2, spacing: { before: 400 } }),
          ...resumeData.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true }),
                new TextRun({ text: ` - ${edu.school}`, italized: true }),
              ]
            }),
            new Paragraph({
              children: [new TextRun({ text: `${edu.dates} | ${edu.location}`, size: 18, color: "666666" })]
            }),
          ]),

          // Skills
          new Paragraph({ text: "SKILLS & QUALIFICATIONS", heading: HeadingLevel.HEADING_2, spacing: { before: 400 } }),
          new Paragraph({ text: resumeData.skills.join(", ") }),

          // References
          new Paragraph({ text: "REFERENCES", heading: HeadingLevel.HEADING_2, spacing: { before: 400 } }),
          ...resumeData.references.flatMap(ref => [
            new Paragraph({ children: [new TextRun({ text: ref.name, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: `${ref.relation} | ${ref.contact}`, size: 18 })] }),
          ]),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${(resumeData.personalInfo.name || 'resume').replace(/\s+/g, '_')}_Resume.docx`);
  };

  const handleNextFormStep = () => {
    setCurrentFormStep(prev => Math.min(prev + 1, formSteps.length - 1));
  };

  const handlePreviousFormStep = () => {
    setCurrentFormStep(prev => Math.max(prev - 1, 0));
  };

  const renderCurrentFormStep = () => {
    const stepKey = formSteps[currentFormStep].key;

    switch (stepKey) {
      case 'personalInfo':
        return (
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">Personal Details</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Full Name" value={resumeData.personalInfo.name} onChange={e => updatePersonalInfo('name', e.target.value)} className="form-input" />
              <input type="text" placeholder="Address" value={resumeData.personalInfo.address} onChange={e => updatePersonalInfo('address', e.target.value)} className="form-input" />
              <input type="email" placeholder="Email Address" value={resumeData.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} className="form-input" />
              <input type="tel" placeholder="Phone Number" value={resumeData.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} className="form-input" />
            </div>
          </section>
        );
      case 'photo':
        return <PhotoUpload photo={userPhoto} onUpload={handlePhotoUpload} onRemove={handleRemovePhoto} />;
      case 'objective':
        return (
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">Professional Summary</h3>
            <textarea value={resumeData.objective} onChange={e => setResumeData(prev => ({ ...prev, objective: e.target.value }))} className="form-input min-h-[180px]" placeholder="Briefly describe your career goals and what makes you a great candidate..."></textarea>
          </section>
        );
      case 'experience':
        return (
          <section className="space-y-4">
            <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-slate-800 tracking-tight">Work Experience</h3><button onClick={() => addItem('experience')} className="text-blue-600 font-bold hover:text-blue-700 transition-colors">+ Add Entry</button></div>
            <div className="space-y-4">
              {resumeData.experience.map(exp => (
                <div key={exp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative group transition-colors hover:border-slate-300">
                  <button onClick={() => removeItem('experience', exp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"><i className="fas fa-trash-can"></i></button>
                  <input placeholder="Job Title" value={exp.title} onChange={e => updateItem('experience', exp.id, 'title', e.target.value)} className="form-input mb-2 font-semibold" />
                  <input placeholder="Company / Employer" value={exp.company} onChange={e => updateItem('experience', exp.id, 'company', e.target.value)} className="form-input mb-2" />
                  <input placeholder="Employment Dates" value={exp.dates} onChange={e => updateItem('experience', exp.id, 'dates', e.target.value)} className="form-input mb-2" />
                  <textarea placeholder="Job Description (use new lines for bullet points)" value={exp.description} onChange={e => updateItem('experience', exp.id, 'description', e.target.value)} className="form-input min-h-[100px]" />
                </div>
              ))}
              {resumeData.experience.length === 0 && <p className="text-slate-500 text-sm text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">No work history added yet.</p>}
            </div>
          </section>
        );
      case 'education':
        return (
          <section className="space-y-4">
            <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-slate-800 tracking-tight">Education</h3><button onClick={() => addItem('education')} className="text-blue-600 font-bold hover:text-blue-700 transition-colors">+ Add Entry</button></div>
            <div className="space-y-4">
              {resumeData.education.map(edu => (
                <div key={edu.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative group transition-colors hover:border-slate-300">
                  <button onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"><i className="fas fa-trash-can"></i></button>
                  <input placeholder="Degree / Certification" value={edu.degree} onChange={e => updateItem('education', edu.id, 'degree', e.target.value)} className="form-input mb-2 font-semibold" />
                  <input placeholder="School / Institution" value={edu.school} onChange={e => updateItem('education', edu.id, 'school', e.target.value)} className="form-input mb-2" />
                  <input placeholder="Dates Attended" value={edu.dates} onChange={e => updateItem('education', edu.id, 'dates', e.target.value)} className="form-input" />
                </div>
              ))}
              {resumeData.education.length === 0 && <p className="text-slate-500 text-sm text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">No education entries added yet.</p>}
            </div>
          </section>
        );
      case 'skills':
        return (
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Skills & Qualifications</h3>
            <p className="text-sm text-slate-600 mb-2">Enter your skills or certifications, one per line.</p>
            <textarea value={resumeData.skills.join('\n')} onChange={e => setResumeData(prev => ({ ...prev, skills: e.target.value.split('\n').filter(s => s.trim()) }))} className="form-input min-h-[200px]" placeholder="E.g. Housekeeping&#10;First Aid Certified&#10;Fast Learner"></textarea>
          </section>
        );
      case 'references':
        return (
          <section className="space-y-4">
            <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-slate-800 tracking-tight">Character References</h3><button onClick={() => addItem('references')} className="text-blue-600 font-bold hover:text-blue-700 transition-colors">+ Add Entry</button></div>
            <div className="space-y-4">
              {resumeData.references.map(ref => (
                <div key={ref.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative group transition-colors hover:border-slate-300">
                  <button onClick={() => removeItem('references', ref.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"><i className="fas fa-trash-can"></i></button>
                  <input placeholder="Full Name" value={ref.name} onChange={e => updateItem('references', ref.id, 'name', e.target.value)} className="form-input mb-2 font-semibold" />
                  <input placeholder="Contact Information" value={ref.contact} onChange={e => updateItem('references', ref.id, 'contact', e.target.value)} className="form-input mb-2" />
                  <input placeholder="Relationship" value={ref.relation} onChange={e => updateItem('references', ref.id, 'relation', e.target.value)} className="form-input" />
                </div>
              ))}
              {resumeData.references.length === 0 && <p className="text-slate-500 text-sm text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">No references added yet.</p>}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  if (showWelcomeScreen) {
    return <WelcomeScreen onSelectMode={handleWelcomeSelection} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-100">
      <nav className="bg-slate-900 text-white shadow-md no-print sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <i className="fas fa-file-invoice text-blue-500 text-xl"></i>
              <span className="font-bold text-xl tracking-tight">JVJ Resume <span className="text-blue-500">System</span></span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDownloadPdf} disabled={isDownloading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-sm">
                {isDownloading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-download"></i>}
                <span className="hidden sm:inline">Export PDF</span>
              </button>
              <button onClick={handleDownloadDocx} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-sm">
                <i className="fas fa-file-word"></i>
                <span className="hidden sm:inline">Export DOCX</span>
              </button>
              <button onClick={handleResetAppAndMode} className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-sm">
                <i className="fas fa-rotate-left"></i>
                <span className="hidden sm:inline">Switch Mode</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        <div className="md:hidden no-print bg-white border-b border-slate-200 flex justify-around p-2">
          <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'edit' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Edit</button>
          <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'preview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Preview</button>
        </div>

        <div className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r border-slate-200 flex flex-col no-print transition-all ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-200 bg-slate-50 grid grid-cols-2 gap-1">
            <button onClick={() => setCurrentSidebarTab('content')} className={`py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${currentSidebarTab === 'content' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>
              <i className="fas fa-edit mr-1"></i>Content
            </button>
            <button onClick={() => setCurrentSidebarTab('design')} className={`py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${currentSidebarTab === 'design' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>
              <i className="fas fa-palette mr-1"></i>Styles
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm font-medium">
                <strong className="font-bold">Error: </strong>
                <span>{error}</span>
              </div>
            )}

            {currentSidebarTab === 'content' && selectedInputMethod === 'ai' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                  <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">Document Import</h3>
                  <p className="text-xs text-blue-800 mb-4 leading-relaxed font-medium">Upload a previous resume file (PDF/DOCX) or paste your information. AI will refine the text and suggest a style.</p>

                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx" className="hidden" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isExtracting}
                    className="w-full py-2.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2 mb-2 shadow-sm"
                  >
                    {isExtracting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-arrow-up"></i>}
                    {isExtracting ? 'Analyzing Document...' : 'Upload Existing Resume'}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Paste Raw Text</label>
                  <textarea
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    className="w-full h-[250px] p-4 border border-slate-300 rounded-xl focus:ring-0 focus:border-blue-500 text-sm font-mono bg-slate-50 resize-none shadow-inner text-slate-900"
                    placeholder="Enter names, dates, schools, and job titles here..."
                  ></textarea>
                </div>

                <PhotoUpload photo={userPhoto} onUpload={handlePhotoUpload} onRemove={handleRemovePhoto} />

                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className={`w-full py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${isGenerating ? 'bg-slate-400 text-slate-100 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'}`}
                >
                  {isGenerating ? <><i className="fas fa-circle-notch fa-spin"></i> Refining with AI...</> : <><i className="fas fa-bolt-lightning"></i> Generate Professional Resume</>}
                </button>
              </div>
            )}

            {currentSidebarTab === 'content' && selectedInputMethod === 'manual' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-widest">
                  <span>Progress: {currentFormStep + 1} / {formSteps.length}</span>
                  <span className="text-blue-600">{formSteps[currentFormStep].title}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentFormStep + 1) / formSteps.length) * 100}%` }}></div>
                </div>

                <div className="bg-white">{renderCurrentFormStep()}</div>

                <div className="flex justify-between mt-6 pt-6 border-t border-slate-100">
                  <button onClick={handlePreviousFormStep} disabled={currentFormStep === 0} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${currentFormStep === 0 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95'}`}>
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  <button onClick={handleNextFormStep} disabled={currentFormStep === formSteps.length - 1} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${currentFormStep === formSteps.length - 1 ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'}`}>
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}

            {currentSidebarTab === 'design' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">Professional Styles</h2>
                <div className="grid grid-cols-1 gap-3">
                  {['classic', 'modern', 'contemporary', 'harvard'].map((template) => (
                    <button key={template} onClick={() => setSelectedTemplate(template)} className={`block w-full p-4 rounded-xl border-2 transition-all text-left group ${selectedTemplate === template ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedTemplate === template ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                          <i className="fas fa-file-invoice"></i>
                        </div>
                        <span className="font-bold capitalize text-lg">{template}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`flex-grow bg-slate-200 overflow-y-auto p-4 md:p-12 flex justify-center items-start print:p-0 print:bg-white ${activeTab === 'edit' ? 'hidden md:flex' : 'flex'}`}>
          <div className="scale-[0.5] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top shadow-2xl transition-transform print:scale-100 print:shadow-none print:m-0">
            <ResumePreview data={resumeData} templateName={selectedTemplate} />
          </div>
        </div>
      </main>

      <style>{`
        .form-input { 
          width: 100%; 
          padding: 0.85rem 1.15rem; 
          border: 1px solid #e2e8f0; 
          border-radius: 0.75rem; 
          font-size: 0.95rem; 
          color: #1e293b; 
          background-color: #ffffff; 
          transition: border-color 0.2s, background-color 0.2s; 
        }
        .form-input:focus { 
          outline: none; 
          border: 2px solid #2563eb; 
          background-color: #f8fafc; 
        }
        @media print { .no-print { display: none !important; } }
      `}</style>
    </div>
  );
};

export default App;