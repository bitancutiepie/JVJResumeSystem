import React from 'react';

interface WelcomeScreenProps {
  onSelectMode: (mode: 'ai' | 'manual') => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4"> {/* Changed to flat bg-slate-100 */}
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-12 max-w-lg w-full text-center transform transition-all duration-300 scale-100 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 animate-slide-down">
          Welcome to <span className="text-blue-600">JVJ Resume</span> System
        </h1>
        <p className="text-slate-600 text-lg sm:text-xl mb-8 leading-relaxed animate-slide-down delay-100">
          How would you like to create your professional resume today?
        </p>

        <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 justify-center">
          <button
            onClick={() => onSelectMode('ai')}
            className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 animate-fade-in delay-200"
          >
            <i className="fas fa-wand-sparkles"></i> Use AI Function
          </button>
          <button
            onClick={() => onSelectMode('manual')}
            className="w-full sm:w-auto flex-1 bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 animate-fade-in delay-300"
          >
            <i className="fas fa-list-check"></i> Use Form Manually
          </button>
        </div>

        <p className="text-slate-500 text-sm mt-8 animate-fade-in delay-400">
          Choose the AI function for quick, smart generation from raw text, or use the manual form for detailed control.
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.6s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;