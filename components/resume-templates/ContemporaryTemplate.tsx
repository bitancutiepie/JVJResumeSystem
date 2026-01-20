import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

const ContemporaryTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-slate-800 w-[210mm] min-h-[297mm] mx-auto shadow-2xl print:shadow-none print:w-full relative overflow-hidden flex flex-col p-8 sm:p-12">
      
      {/* Header with name and photo */}
      <header className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8 pb-4 border-b-2 border-blue-100 text-center md:text-left">
        {data.personalInfo.photo && (
          <div className="flex-shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-md">
              <img 
                src={data.personalInfo.photo} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-1 sm:mb-2">
            {data.personalInfo.name || "Your Name"}
          </h1>
          {data.objective && (
            <p className="text-blue-700 text-lg sm:text-xl font-medium italic">
              {data.objective}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-10 flex-grow">
        
        {/* Left Column - Experience & Education */}
        <div className="col-span-full md:col-span-8 space-y-8">
          
          {/* Contact Info (Inline for Contemporary) */}
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700 mb-3 border-b border-slate-100 pb-1">Contact Details</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
              {data.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-phone text-blue-400"></i>
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-envelope text-blue-400"></i>
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.address && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-blue-400"></i>
                  <span>{data.personalInfo.address}</span>
                </div>
              )}
            </div>
          </section>

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-800 mb-4 border-b border-blue-200 pb-1">
                Work Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">{exp.title}</h3>
                        <div className="text-[13px] font-medium text-blue-600">
                          {exp.company}{exp.location ? `, ${exp.location}` : ''}
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter mt-1 sm:mt-0 ml-0 sm:ml-4">
                        {exp.dates}
                      </span>
                    </div>
                    {exp.description && (
                      <ul className="list-disc list-inside text-[13px] text-slate-600 leading-relaxed mt-1 sm:mt-2">
                         {exp.description.split('\n').map((line, idx) => line.trim() !== '' && (
                            <li key={idx}>{line.trim()}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-800 mb-4 border-b border-blue-200 pb-1">
                Education
              </h2>
              <div className="space-y-5">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                      <div>
                        <div className="font-bold text-slate-800 text-[13px] leading-snug">
                          {edu.degree}
                        </div>
                        <div className="text-[12px] text-blue-600 font-medium">
                          {edu.school}, {edu.location}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 italic mt-1 sm:mt-0 ml-0 sm:ml-4">
                        {edu.dates}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Skills & References */}
        <div className="col-span-full md:col-span-4 space-y-8">
          
          {/* Skills / Qualifications */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-800 mb-4 border-b border-blue-200 pb-1">
                Skills & Qualifications
              </h2>
              <ul className="space-y-2">
                {data.skills.map((skill, index) => (
                  <li key={index} className="relative pl-6 text-[13px] text-slate-700 leading-snug flex items-start">
                    <i className="fas fa-check-circle text-blue-500 absolute left-0 top-0.5"></i>
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* References */}
          {data.references && data.references.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-800 mb-4 border-b border-blue-200 pb-1">
                Character References
              </h2>
              <div className="space-y-4">
                {data.references.map((ref) => (
                  <div key={ref.id} className="text-[13px] p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="font-bold text-slate-800 mb-0.5">{ref.name}</div>
                    <div className="text-blue-700 font-medium text-xs mb-0.5">{ref.relation}</div>
                    <div className="text-slate-600">{ref.contact}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContemporaryTemplate;