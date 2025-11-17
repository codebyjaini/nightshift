import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoadingSpinner } from './components/ui'

// Lazy load route components
const Landing = lazy(() => import('./pages/Landing'))
const PatientTriage = lazy(() => import('./pages/PatientTriage'))
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <Router>
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      
      <Suspense 
        fallback={
          <div className="min-h-screen bg-primary-bg flex items-center justify-center" role="status" aria-live="polite">
            <LoadingSpinner size="lg" />
            <span className="sr-only">Loading page...</span>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/patient/triage" element={<PatientTriage />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
