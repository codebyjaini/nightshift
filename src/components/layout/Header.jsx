import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = ({ showOnHomepage = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isHomepage = location.pathname === '/';

  // Don't show header on homepage unless explicitly requested
  if (isHomepage && !showOnHomepage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-primary-card/90 backdrop-blur-xl border-b border-primary-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-accent-cyan to-accent-purple p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-blue bg-clip-text text-transparent">
                NightShift MD
              </h1>
              <p className="text-xs text-text-dim">Emergency Triage</p>
            </div>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/')
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-primary-card-hover'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/patient/triage')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/patient/triage')
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-primary-card-hover'
              }`}
            >
              Patient Page
            </button>
            <button
              onClick={() => navigate('/doctor/dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/doctor/dashboard')
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-primary-card-hover'
              }`}
            >
              Doctor Dashboard
            </button>
          </nav>

          {/* Right: CTA Button + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* CTA Button */}
            <button
              onClick={() => navigate('/patient/triage')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-teal text-white font-medium rounded-lg hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New Patient</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-primary-card-hover transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-all ${
                  isActive('/')
                    ? 'bg-accent-cyan/10 text-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-primary-card-hover'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate('/patient/triage');
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-all ${
                  isActive('/patient/triage')
                    ? 'bg-accent-cyan/10 text-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-primary-card-hover'
                }`}
              >
                Patient Page
              </button>
              <button
                onClick={() => {
                  navigate('/doctor/dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-all ${
                  isActive('/doctor/dashboard')
                    ? 'bg-accent-cyan/10 text-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-primary-card-hover'
                }`}
              >
                Doctor Dashboard
              </button>
              <button
                onClick={() => {
                  navigate('/patient/triage');
                  setMobileMenuOpen(false);
                }}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-accent-cyan to-accent-teal text-white font-medium rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>New Patient</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
