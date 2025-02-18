
import { Shield, Zap, Clock } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="hidden md:flex md:w-1/2 items-center justify-center relative overflow-hidden">
      {/* Base background image layer */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/2bf4f63d-6422-4f37-a6d6-c8d4ec489017.png')] bg-cover bg-center bg-no-repeat object-center"></div>
      
      {/* Orange gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-primary/90"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="max-w-xl space-y-12 relative z-10 p-12 text-white">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-white/80">Welcome to e-Box</h2>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Your Secure Digital Mailbox
            </h1>
          </div>
          <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
            Transform your official communications with a modern, secure, and efficient digital solution
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Enterprise-Grade Features</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Bank-Level Security</h4>
                  <p className="text-white/80 leading-relaxed">
                    End-to-end encryption and advanced security protocols protect your sensitive communications
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Instant Delivery</h4>
                  <p className="text-white/80 leading-relaxed">
                    Real-time document delivery and notifications keep you informed and responsive
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Always Available</h4>
                  <p className="text-white/80 leading-relaxed">
                    Access your documents 24/7 from any device, anywhere in the world
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-white/20">
            <p className="text-sm leading-relaxed opacity-80">
              Trusted by government institutions and leading organizations for secure, reliable, and efficient digital communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
