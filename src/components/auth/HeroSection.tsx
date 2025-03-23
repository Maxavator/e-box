
import { Shield, Users, MessageSquare, FileText, Sparkles, Clock, Building, Mail, Lock } from "lucide-react";

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
      
      {/* Content with glass effect */}
      <div className="max-w-xl relative z-10 p-12 text-white backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 shadow-xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-sm font-medium text-amber-300">Trusted by 500+ South African Enterprises</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              The All-In-One Enterprise Communication Hub
            </h1>
            <p className="text-lg lg:text-xl opacity-90 leading-relaxed">
              e-Box unifies your business communications, document delivery, and HR processes in a secure, compliant platform designed specifically for South African enterprises.
            </p>
          </div>
        </div>

        <div className="space-y-8 mt-10">
          <div className="space-y-6">
            <ul className="grid grid-cols-2 gap-6">
              <li className="flex items-start gap-4 group transition-all duration-300 hover:translate-y-[-2px]">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Shield className="w-6 h-6 text-amber-200" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">POPIA Compliant</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    End-to-end encryption with full South African regulatory compliance
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group transition-all duration-300 hover:translate-y-[-2px]">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Users className="w-6 h-6 text-amber-200" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Multilingual Support</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Full support for all 11 official South African languages
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group transition-all duration-300 hover:translate-y-[-2px]">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Clock className="w-6 h-6 text-amber-200" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">99.9% Uptime</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Enterprise-grade reliability with local data centers and 24/7 support
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group transition-all duration-300 hover:translate-y-[-2px]">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Building className="w-6 h-6 text-amber-200" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">B-BBEE Level 1</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Proudly South African with highest B-BBEE contributor status
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Two new marketing subsections */}
          <div className="space-y-6">
            <div className="bg-white/10 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Mail className="w-6 h-6 text-amber-200" />
                </div>
                <h3 className="text-xl font-semibold">Unified Communications</h3>
              </div>
              <p className="text-white/90 leading-relaxed">
                Streamline all your business communications in one secure platform. Integrate email, messaging, and document delivery with automated workflows that save time and reduce errors.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Lock className="w-6 h-6 text-amber-200" />
                </div>
                <h3 className="text-xl font-semibold">Enterprise Security</h3>
              </div>
              <p className="text-white/90 leading-relaxed">
                Bank-grade encryption and South African data sovereignty ensure your sensitive information never leaves the country. Multi-factor authentication and detailed audit trails keep your data protected.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20">
            <p className="text-sm leading-relaxed text-white/70">
              © 2025 Afrovation Technology Solutions (Pty) Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
