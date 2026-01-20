import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

const HarvardTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-slate-800 w-[210mm] min-h-[297mm] p-8 sm:p-12 mx-auto shadow-2xl print:shadow-none print:w-full print:p-12 flex flex-col font-serif">
      {/* Header - Name and Contact Info */}
      <header className="mb-6 sm:mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold uppercase text-slate-900 tracking-wide mb-1 sm:mb-2">
          {data.personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-y-1 sm:gap-y-0 gap-x-4 text-sm text-slate-700">
          {data.personalInfo.address && (
            <span>{data.personalInfo.address}</span>
          )}
          {data.personalInfo.phone && (
            <span>{data.personalInfo.phone}</span>
          )}
          {data.personalInfo.email && (
            <a href={`mailto:${data.personalInfo.email}`} className="text-blue-700 hover:underline">
              {data.personalInfo.email}
            </a>
          )}
        </div>
      </header>

      {/* Objective */}
      {data.objective && (
        <section className="mb-5 sm:mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-300 pb-1 mb-2 sm:mb-3">
            Objective
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed text-justify">
            {data.objective}
          </p>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5 sm:mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-300 pb-1 mb-2 sm:mb-3">
            Education
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                  <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                  <span className="text-slate-600 mt-1 sm:mt-0">{edu.dates}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                  <span className="italic text-slate-700">{edu.school}</span>
                  <span className="text-slate-600">{edu.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-5 sm:mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-300 pb-1 mb-2 sm:mb-3">
            Experience
          </h2>
          <div className="space-y-4 sm:space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="text-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                  <h3 className="font-bold text-slate-800">{exp.title}</h3>
                  <span className="text-slate-600 mt-1 sm:mt-0">{exp.dates}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-1">
                  <span className="italic text-slate-700">{exp.company}</span>
                  <span className="text-slate-600">{exp.location}</span>
                </div>
                {exp.description && (
                  <ul className="list-disc list-inside text-slate-700 leading-relaxed mt-1">
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

      {/* Skills / Qualifications */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-5 sm:mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-300 pb-1 mb-2 sm:mb-3">
            Skills & Qualifications
          </h2>
          <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-slate-700">
            {data.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {/* References */}
      {data.references && data.references.length > 0 && (
        <section className="mb-0">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-300 pb-1 mb-2 sm:mb-3">
            References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {data.references.map((ref) => (
              <div key={ref.id} className="text-slate-700">
                <div className="font-bold">{ref.name}</div>
                <div className="text-slate-600 italic">{ref.relation}</div>
                <div className="text-slate-600">{ref.contact}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HarvardTemplate;