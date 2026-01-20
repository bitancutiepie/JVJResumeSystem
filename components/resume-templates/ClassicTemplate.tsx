import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-slate-800 w-[210mm] min-h-[297mm] p-8 sm:p-12 md:p-16 mx-auto shadow-2xl print:shadow-none print:w-full print:p-12 relative overflow-hidden flex flex-col">
      
      {/* Decorative Header Bar */}
      <div className="absolute top-0 left-0 w-full h-3 bg-slate-800 print:bg-slate-800"></div>

      {/* Header */}
      <header className="border-b-2 border-slate-100 pb-6 mb-6 flex flex-col sm:flex-row justify-between items-center sm:items-start">
        <div className="flex-grow text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 uppercase tracking-tight mb-2">
            {data.personalInfo.name || "Your Name"}
          </h1>
          <div className="flex flex-col sm:flex-row flex-wrap gap-y-1 sm:gap-y-0 gap-x-3 text-[13px] text-slate-600 font-medium justify-center sm:justify-start">
            {data.personalInfo.address && (
              <div className="flex items-center justify-center sm:justify-start gap-1">
                <i className="fas fa-map-marker-alt text-slate-400 w-4 text-center"></i>
                <span>{data.personalInfo.address}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center justify-center sm:justify-start gap-1">
                <i className="fas fa-phone text-slate-400 w-4 text-center"></i>
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.email && (
              <div className="flex items-center justify-center sm:justify-start gap-1">
                <i className="fas fa-envelope text-slate-400 w-4 text-center"></i>
                <span>{data.personalInfo.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Optional Profile Photo */}
        {data.personalInfo.photo && (
          <div className="sm:ml-8 flex-shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-slate-50 shadow-sm rounded-lg overflow-hidden bg-slate-50">
              <img 
                src={data.personalInfo.photo} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-10 flex-grow">
        
        {/* Main Column (Left) */}
        <div className="col-span-full md:col-span-8 space-y-8">
          
          {/* Objective */}
          {data.objective && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-800 mb-3 border-b border-slate-100 pb-1">
                Professional Profile
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed text-justify">
                {data.objective}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-800 mb-4 border-b border-slate-100 pb-1">
                Work History
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-1">
                      <h3 className="font-bold text-slate-800 text-base">{exp.title}</h3>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1 sm:mt-0">
                        {exp.dates}
                      </span>
                    </div>
                    <div className="text-[13px] font-semibold text-blue-600 mb-2">
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </div>
                    {exp.description && (
                      <ul className="list-disc list-inside text-[13px] text-slate-600 leading-relaxed">
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

           {/* References */}
           {data.references && data.references.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-800 mb-4 border-b border-slate-100 pb-1">
                Character References
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {data.references.map((ref) => (
                  <div key={ref.id} className="text-sm">
                    <div className="font-bold text-slate-800">{ref.name}</div>
                    <div className="text-blue-600 font-medium text-xs">{ref.relation}</div>
                    <div className="text-slate-500 mt-0.5">{ref.contact}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column (Right) */}
        <div className="col-span-full md:col-span-4 space-y-8 md:border-l md:border-slate-50 md:pl-6">
          
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-800 mb-4 border-b border-slate-100 pb-1">
                Education
              </h2>
              <div className="space-y-6">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-800 text-[13.5px] leading-snug mb-0.5">
                      {edu.degree}
                    </div>
                    <div className="text-[12px] text-blue-600 font-medium mb-0.5">
                      {edu.school}
                    </div>
                     <div className="text-[11px] text-slate-500 mb-0.5 font-medium">
                      {edu.location}
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      {edu.dates}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills / Qualifications */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-800 mb-4 border-b border-slate-100 pb-1">
                Qualifications
              </h2>
              <ul className="space-y-2">
                {data.skills.map((skill, index) => (
                  <li key={index} className="relative pl-4 text-sm text-slate-700 leading-snug">
                    <span className="absolute left-0 top-[6px] w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;