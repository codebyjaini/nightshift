import { ArrowLeft } from 'lucide-react';

const BackButton = ({ className = '' }) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className={`group inline-flex items-center gap-2 px-3 text-sm text-text-secondary hover:text-accent-cyan transition-all duration-300 rounded-lg hover:bg-primary-card/30 ${className}`}
      aria-label="Go back to previous page"
      style={{ paddingTop: '6px', paddingBottom: '6px' }}
    >
      <ArrowLeft className="w-4 h-4 text-accent-cyan group-hover:translate-x-[-2px] transition-transform" />
      <span className="font-medium">Back</span>
    </button>
  );
};

export default BackButton;
