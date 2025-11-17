import { Activity, Phone, Mail, MapPin, Shield, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-primary-navy to-primary-dark border-t border-primary-border/50 mt-auto">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent-cyan/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg blur-md opacity-50" />
                <div className="relative bg-gradient-to-r from-accent-cyan to-accent-purple p-2.5 rounded-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple bg-clip-text text-transparent">
                  NightShift MD
                </h3>
                <p className="text-xs text-text-muted">AI-Powered Emergency Triage</p>
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-6 max-w-md">
              Intelligent emergency triage system designed to streamline patient care and improve outcomes through AI-powered risk assessment.
            </p>
            
            {/* Emergency Notice */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-risk-critical/10 border border-risk-critical/30 rounded-xl backdrop-blur-sm">
              <Phone className="w-4 h-4 text-risk-critical animate-pulse" />
              <span className="text-sm text-text-secondary">
                <span className="font-semibold text-risk-critical">Emergency:</span> Call 911
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/" 
                  className="text-sm text-text-muted hover:text-accent-cyan transition-colors inline-flex items-center group"
                >
                  <span className="w-1 h-1 bg-accent-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/patient/triage" 
                  className="text-sm text-text-muted hover:text-accent-cyan transition-colors inline-flex items-center group"
                >
                  <span className="w-1 h-1 bg-accent-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Patient Triage
                </a>
              </li>
              <li>
                <a 
                  href="/doctor/dashboard" 
                  className="text-sm text-text-muted hover:text-accent-cyan transition-colors inline-flex items-center group"
                >
                  <span className="w-1 h-1 bg-accent-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Doctor Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-sm text-text-muted hover:text-accent-cyan transition-colors inline-flex items-center group"
                >
                  <span className="w-1 h-1 bg-accent-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-text-muted hover:text-accent-cyan transition-colors inline-flex items-center group"
                >
                  <span className="w-1 h-1 bg-accent-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Support
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-text-muted hover:text-accent-cyan transition-colors inline-flex items-center group"
                >
                  <span className="w-1 h-1 bg-accent-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-text-muted group">
                <Mail className="w-4 h-4 text-accent-cyan mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:support@nightshiftmd.com" className="hover:text-accent-cyan transition-colors">
                  support@nightshiftmd.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-muted group">
                <Phone className="w-4 h-4 text-accent-cyan mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:1-800-NIGHTMD" className="hover:text-accent-cyan transition-colors">
                  1-800-NIGHTMD
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-muted group">
                <Clock className="w-4 h-4 text-accent-cyan mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>24/7 Support Available</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance & Security Badge */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-6 mb-6 border-y border-primary-border/50">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-card/30 rounded-lg border border-primary-border/50">
            <Shield className="w-4 h-4 text-accent-teal" />
            <span className="text-xs text-text-muted">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-card/30 rounded-lg border border-primary-border/50">
            <Shield className="w-4 h-4 text-accent-purple" />
            <span className="text-xs text-text-muted">SOC 2 Certified</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-card/30 rounded-lg border border-primary-border/50">
            <Shield className="w-4 h-4 text-accent-cyan" />
            <span className="text-xs text-text-muted">256-bit Encryption</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-sm text-text-dim">
            © {currentYear} NightShift MD. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-sm text-text-dim hover:text-accent-cyan transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-sm text-text-dim hover:text-accent-cyan transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-sm text-text-dim hover:text-accent-cyan transition-colors"
            >
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
