
const HeroSection = () => {
  return (
    <div className="hidden md:flex md:w-1/2 items-center justify-center relative overflow-hidden">
      {/* Base background image layer */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/2bf4f63d-6422-4f37-a6d6-c8d4ec489017.png')] bg-cover bg-center bg-no-repeat object-center"></div>
      
      {/* Orange gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-primary/90"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="max-w-xl space-y-10 relative z-10 p-12 text-white">
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Your Digital Mailbox
          </h1>
          <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
            A secure and efficient way to manage your official communications
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Key Benefits</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-lg">Secure document delivery and storage</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-lg">Instant access to official communications</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg">24/7 availability of your documents</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-white/20">
            <p className="text-sm opacity-80">
              Your official mailbox for secure communication with government institutions and organizations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
