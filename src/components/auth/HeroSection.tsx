
const HeroSection = () => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/90 to-primary p-8 text-white items-center justify-center">
      <div className="max-w-xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold">
            Welcome to e-Box
          </h1>
          <p className="text-xl lg:text-2xl opacity-90">
            Your comprehensive solution for secure communication and document management
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Key Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure messaging and file sharing</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Integrated calendar for event management</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Document storage and organization</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Policy management and compliance</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Why Choose e-Box?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Enterprise-grade security</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Real-time collaboration</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Scalable solution for teams of all sizes</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-white/20">
          <p className="text-sm opacity-80">
            © 2025 Afrovation. All rights reserved. Our platform helps organizations streamline their communication, document management, and compliance processes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
