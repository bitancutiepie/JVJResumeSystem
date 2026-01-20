import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-slate-800 w-[210mm] min-h-[297mm] mx-auto shadow-2xl print:shadow-none print:w-full relative overflow-hidden grid grid-cols-1 md:grid-cols-12">
      
      {/* Left Sidebar (Modern Style) */}
      <div className="col-span-full md:col-span-4 bg-slate-800 text-white p-6 sm:p-8 space-y-6 sm:space-y-8">
        {data.personalInfo.photo && (
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-white rounded-full overflow-hidden bg-slate-700">
              <img 
                src={data.personalInfo.photo} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Contact Info */}
        <section className="text-sm space-y-2 sm:space-y-3">
          <h2 className="text-base font-bold uppercase tracking-wider border-b-2 border-blue-500 pb-1.5 mb-3">Contact</h2>
          {data.personalInfo.phone && (
            <div className="flex items-center gap-3">
              <i className="fas fa-phone text-blue-400 w-5 text-center"></i>
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.email && (
            <div className="flex items-center gap-3">
              <i className="fas fa-envelope text-blue-400 w-5 text-center"></i>
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.address && (
            <div className="flex items-center gap-3">
              <i className="fas fa-map-marker-alt text-blue-400 w-5 text-center"></i>
              <span>{data.personalInfo.address}</span>
            </div>
          )}
        </section>

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="text-sm space-y-2 sm:space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider border-b-2 border-blue-500 pb-1.5 mb-3">Education</h2>
            <div className="space-y-3 sm:space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-slate-100 text-[13px] sm:text-[13.5px] leading-snug mb-0.5">
                    {edu.degree}
                  </div>
                  <div className="text-[12px] text-blue-300 font-medium mb-0.5">
                    {edu.school}
                  </div>
                  <div className="text-[11px] text-slate-300 mb-0.5">
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
          <section className="text-sm space-y-2 sm:space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider border-b-2 border-blue-500 pb-1.5 mb-3">Skills & Qualifications</h2>
            <ul className="space-y-1.5 sm:space-y-2">
              {data.skills.map((skill, index) => (
                <li key={index} className="relative pl-5 text-[13px] text-slate-200 leading-snug flex items-start">
                  <span className="absolute left-0 top-1 w-2 h-2 bg-blue-400 rounded-full"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Right Content Column */}
      <div className="col-span-full md:col-span-8 p-6 sm:p-10 md:p-12 space-y-8 sm:space-y-10">
        <header className="pb-4 sm:pb-6 border-b border-slate-200">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 mb-1 sm:mb-2">
            {data.personalInfo.name || "Your Name"}
          </h1>
          {data.objective && (
            <p className="text-slate-600 text-base sm:text-lg italic leading-relaxed">
              {data.objective}
            </p>
          )}
        </header>

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-widest text-blue-800 mb-5 relative">
              Work Experience
              <span className="absolute left-0 -bottom-2 w-16 h-0.5 bg-blue-600"></span>
            </h2>
            <div className="space-y-7 sm:space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-1">
                    <h3 className="font-bold text-slate-800 text-base">{exp.title}</h3>
                    <span className="text-[12px] font-bold text-slate-500 uppercase mt-1 sm:mt-0">
                      {exp.dates}
                    </span>
                  </div>
                  <div className="text-[13px] sm:text-[14px] font-semibold text-blue-700 mb-2">
                    {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  </div>
                  {exp.description && (
                      <ul className="list-disc list-inside text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed">
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
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-widest text-blue-800 mb-5 relative">
              References
              <span className="absolute left-0 -bottom-2 w-16 h-0.5 bg-blue-600"></span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4 sm:gap-y-6">
              {data.references.map((ref) => (
                <div key={ref.id} className="text-[13px] sm:text-[13.5px]">
                  <div className="font-bold text-slate-800">{ref.name}</div>
                  <div className="text-blue-600 font-medium text-xs">{ref.relation}</div>
                  <div className="text-slate-500 mt-0.5">{ref.contact}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;