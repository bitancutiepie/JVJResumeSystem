import React from 'react';
import { ResumeData } from '../types';
import ClassicTemplate from './resume-templates/ClassicTemplate';
import ModernTemplate from './resume-templates/ModernTemplate';
import ContemporaryTemplate from './resume-templates/ContemporaryTemplate';
import HarvardTemplate from './resume-templates/HarvardTemplate'; // Import new Harvard template

interface ResumePreviewProps {
  data: ResumeData;
  templateName: string; // New prop to select template
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, templateName }) => {
  const getTemplateComponent = () => {
    switch (templateName) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'contemporary':
        return <ContemporaryTemplate data={data} />;
      case 'harvard': // New case for Harvard template
        return <HarvardTemplate data={data} />;
      case 'classic':
      default:
        return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div id="resume-preview-content" className="resume-page print:scale-100 print:shadow-none print:m-0 max-w-full">
      {getTemplateComponent()}
    </div>
  );
};

export default ResumePreview;