import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Clock, Shield } from 'lucide-react';
// @ts-ignore - JSX component without types
import Header from '../components/layout/Header';
// @ts-ignore - JSX component without types
import Footer from '../components/layout/Footer';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header showOnHomepage={true} />
      
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Animated Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent-purple/30 via-accent-cyan/15 to-transparent rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-gradient-radial from-accent-blue/20 to-transparent rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full mb-8 animate-fade-in">
              <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
              <span className="text-sm font-medium text-accent-cyan">AI-Powered Emergency Triage</span>
            </div>

            {/* Title with Gradient */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple bg-clip-text text-transparent">
                NightShift
              </span>{' '}
              <span className="bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan bg-clip-text text-transparent">
                MD
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl sm:text-3xl text-text-primary font-semibold mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Intelligent Emergency Triage System
            </p>
            
            <p className="text-base sm:text-lg text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
              AI-powered symptom analysis and risk assessment for night clinic emergencies. Get instant triage recommendations and connect with on-call doctors.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => navigate('/patient/triage')}
                className="group relative px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-teal text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105 min-w-[260px]"
                aria-label="Start emergency checkup as a patient"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start Emergency Checkup
                </span>
              </button>
              
              <button
                onClick={() => navigate('/doctor/dashboard')}
                className="group px-8 py-4 bg-primary-card/50 backdrop-blur-sm border border-primary-border text-text-primary font-semibold rounded-xl hover:border-accent-cyan/50 hover:bg-primary-card transition-all duration-300 min-w-[260px]"
                aria-label="Access doctor dashboard"
              >
                <span className="flex items-center justify-center gap-2">
                  Doctor Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-navy/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-lg text-text-muted max-w-2xl mx-auto">
                Three simple steps to streamline emergency care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group bg-primary-card border border-primary-border rounded-2xl p-8 hover:border-accent-cyan/50 hover:shadow-card-hover transition-all duration-300">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/20 to-accent-teal/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-accent-cyan to-accent-teal rounded-xl flex items-center justify-center">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  Patient Check-In
                </h3>
                <p className="text-text-muted leading-relaxed">
                  Quick and easy patient information collection with intelligent risk assessment
                </p>
              </div>

              {/* Card 2 */}
              <div className="group bg-primary-card border border-primary-border rounded-2xl p-8 hover:border-accent-purple/50 hover:shadow-card-hover transition-all duration-300">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 to-accent-blue/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  Real-Time Monitoring
                </h3>
                <p className="text-text-muted leading-relaxed">
                  Doctors receive instant updates with priority-based patient sorting
                </p>
              </div>

              {/* Card 3 */}
              <div className="group bg-primary-card border border-primary-border rounded-2xl p-8 hover:border-accent-teal/50 hover:shadow-card-hover transition-all duration-300">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-teal/20 to-accent-cyan/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-16 h-16 bg-gradient-to-r from-accent-teal to-accent-cyan rounded-xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  Secure & Compliant
                </h3>
                <p className="text-text-muted leading-relaxed">
                  HIPAA-ready infrastructure with encrypted data storage and transmission
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Get Started CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-card/80 to-primary-navy/50 backdrop-blur-sm border border-primary-border rounded-3xl p-12 text-center shadow-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
                Begin your emergency triage assessment now or access the doctor dashboard
              </p>
              <button
                onClick={() => navigate('/patient/triage')}
                className="group relative px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-teal text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                aria-label="Start emergency assessment"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Emergency Assessment
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Landing;
