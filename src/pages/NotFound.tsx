import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
// @ts-ignore - JSX component without types
import Header from '../components/layout/Header';
// @ts-ignore - JSX component without types
import BackButton from '../components/ui/BackButton';
import { Home } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary flex flex-col">
      <Header />
      <div className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton />
          </div>
          
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6 max-w-lg">
          {/* 404 with gradient */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-radial from-accent-cyan/20 to-transparent blur-3xl" />
            <h1 className="relative text-8xl md:text-9xl font-bold bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-teal bg-clip-text text-transparent">
              404
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Page Not Found
          </h2>
          
          <p className="text-lg text-text-secondary">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="pt-4">
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              className="min-w-[200px]"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </Button>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
