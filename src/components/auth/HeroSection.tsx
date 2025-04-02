
import { Shield, Users, MessageSquare, Sparkles, Clock, Building, Mail, Lock, Smartphone, UsersRound, FileText } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Background with gradient overlay and people working image */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70 before:content-[''] before:absolute before:inset-0 before:bg-[url('/lovable-uploads/23758d75-6a83-4a79-bba6-ba0d82eec4cf.png')] before:bg-cover before:bg-center before:opacity-40 before:mix-blend-overlay"></div>
      
      {/* Animated gradient blobs for modern design */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-500/20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full bg-gradient-to-l from-amber-300/20 to-rose-400/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      {/* Content with glass effect - more compact version */}
      <div className="max-w-lg relative z-10 p-8 text-white backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 shadow-xl">
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/dbb30299-d801-4939-9dd4-ef26c4cc55cd.png" 
              alt="e-Box Logo" 
              className="h-12"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-medium text-amber-300">Trusted by 500+ South African Enterprises</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              The All-In-One Enterprise Communication Hub
            </h1>
            <p className="text-base opacity-90 leading-relaxed">
              e-Box unifies business communications, document delivery, and HR processes in a secure platform for South African enterprises.
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          {/* Features list - reduced to two key items per row */}
          <div className="space-y-4">
            <ul className="grid grid-cols-2 gap-4">
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Shield className="w-4 h-4 text-amber-200" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">POPIA Compliant</h4>
                  <p className="text-white/80 text-xs leading-relaxed">
                    End-to-end encryption with full compliance
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <FileText className="w-4 h-4 text-amber-200" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Paperless HR</h4>
                  <p className="text-white/80 text-xs leading-relaxed">
                    Digital payslips and document delivery
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Multi-channel communication section */}
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-300/10 p-3 rounded-xl border border-blue-300/30 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/30">
                <MessageSquare className="w-4 h-4 text-blue-200" />
              </div>
              <h3 className="text-base font-semibold">Multi-Channel Communication</h3>
            </div>
            <p className="text-white/90 text-xs leading-relaxed mb-2">
              Connect via <span className="text-blue-200 font-medium">SMS, chat, voice,</span> and <span className="text-blue-200 font-medium">email</span> in a single secure platform with guaranteed message delivery.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-blue-200" />
                <span className="text-xs text-white/80">Email support</span>
              </div>
              <div className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-blue-200" />
                <span className="text-xs text-white/80">24/7 availability</span>
              </div>
            </div>
          </div>

          {/* Workforce inclusion section - more compact */}
          <div className="bg-gradient-to-r from-amber-500/20 to-amber-300/10 p-3 rounded-xl border border-amber-300/30 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/30">
                <UsersRound className="w-4 h-4 text-amber-200" />
              </div>
              <h3 className="text-base font-semibold">Complete Workforce Inclusion</h3>
            </div>
            <p className="text-white/90 text-xs leading-relaxed mb-2">
              Connect your <span className="text-amber-200 font-medium">entire workforce</span>, including deskless employees in manufacturing, retail, and field operations.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-amber-200" />
                <span className="text-xs text-white/80">Mobile-first</span>
              </div>
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3 text-amber-200" />
                <span className="text-xs text-white/80">On-site integration</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/20 text-center">
            <p className="text-xs text-white/70">
              powered by
            </p>
            <img 
              src="/lovable-uploads/7366015f-cd77-4ca3-94bb-3848e07b8868.png" 
              alt="Afrovation" 
              className="h-4 mt-1 mx-auto"
            />
            <p className="text-xs mt-1 text-white/70">
              © 2025 Afrovation. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
