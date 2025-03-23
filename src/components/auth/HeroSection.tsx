
import { Shield, Users, MessageSquare, Scale, FileText, Sparkles } from "lucide-react";

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
              <span className="text-sm font-medium text-amber-300">South Africa's Trusted Platform</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Your Complete Workplace Solution
            </h1>
            <p className="text-lg lg:text-xl opacity-90 leading-relaxed">
              Connect your entire organization with our all-in-one communication platform. From executives to frontline staff, we keep everyone informed and engaged.
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
                  <h4 className="font-medium text-lg">Enterprise Security</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Bank-level encryption with full POPI Act compliance
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group transition-all duration-300 hover:translate-y-[-2px]">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Users className="w-6 h-6 text-amber-200" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Leave Management</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Streamlined leave requests in multiple languages
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group transition-all duration-300 hover:translate-y-[-2px]">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <MessageSquare className="w-6 h-6 text-amber-200" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Instant Messaging</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Real-time communication across your entire organization
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group transition-all duration-300 hover:translate-y-[-2px]">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Scale className="w-6 h-6 text-amber-200" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Local Compliance</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Built specifically for South African regulations
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group transition-all duration-300 hover:translate-y-[-2px] col-span-2">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <FileText className="w-6 h-6 text-amber-200" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Digital Documents</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Secure payslip delivery and document management
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-white/20">
            <p className="text-sm leading-relaxed text-white/70">
              Copyright Afrovation 2025. Proudly South African.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
