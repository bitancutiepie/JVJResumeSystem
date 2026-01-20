import React, { useState, useRef } from 'react';

interface PhotoUploadProps {
  photo?: string; // Base64 string of the image
  onUpload: (base64Image: string) => void;
  onRemove: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ photo, onUpload, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Profile Photo (Optional)</h3>
      <div
        className={`relative w-40 h-40 mx-auto rounded-full flex items-center justify-center border-2 border-dashed transition-all duration-200
          ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-slate-300 bg-white shadow-inner'}
          ${photo ? 'border-solid border-slate-200' : 'hover:border-blue-400 hover:bg-slate-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {photo ? (
          <>
            <img src={photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
            <div className="absolute inset-0 bg-slate-900 rounded-full flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity space-y-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
              >
                <i className="fas fa-camera"></i> Change
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
              >
                <i className="fas fa-trash-can"></i> Remove
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-slate-400">
            <i className={`fas fa-cloud-arrow-up text-4xl mb-2 ${isDragging ? 'text-blue-600' : 'text-slate-300'}`}></i>
            <p className="text-[10px] font-bold uppercase tracking-tight">{isDragging ? 'Drop here' : 'Select Photo'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;