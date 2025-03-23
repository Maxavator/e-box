
import { Shield, Users, MessageSquare, Scale, FileText, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-1.5 bg-amber-300 rounded-full"></div>
              <span className="text-sm font-medium uppercase tracking-wider text-amber-300">South Africa's Leading Platform</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Transform Your <span className="bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">Workplace</span> Communication
            </h1>
            <p className="text-lg opacity-90 leading-relaxed">
              Connect your entire organization with our all-in-one platform designed specifically for South African businesses. From executives to frontline staff, we keep everyone informed and engaged.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button className="bg-white text-primary hover:bg-amber-200 hover:text-primary-foreground transition-all duration-300 px-6 py-5 rounded-xl group">
                Schedule Demo
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" className="bg-transparent border-white/30 hover:border-white text-white hover:bg-white/10 transition-all duration-300 px-6 py-5 rounded-xl">
                Learn More
              </Button>
            </div>
          </div>

          {/* Feature list section */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/20">
            <div className="feature-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white/10">
                  <Shield className="w-5 h-5 text-amber-200" />
                </div>
                <h3 className="font-medium">Enterprise Security</h3>
              </div>
              <p className="text-sm text-white/80 ml-11">POPI Act compliant with bank-level data encryption</p>
            </div>
            
            <div className="feature-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white/10">
                  <Users className="w-5 h-5 text-amber-200" />
                </div>
                <h3 className="font-medium">HR Management</h3>
              </div>
              <p className="text-sm text-white/80 ml-11">Streamlined leave management in all languages</p>
            </div>
            
            <div className="feature-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white/10">
                  <MessageSquare className="w-5 h-5 text-amber-200" />
                </div>
                <h3 className="font-medium">Instant Messaging</h3>
              </div>
              <p className="text-sm text-white/80 ml-11">Real-time communication across your organization</p>
            </div>
            
            <div className="feature-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white/10">
                  <FileText className="w-5 h-5 text-amber-200" />
                </div>
                <h3 className="font-medium">Document Delivery</h3>
              </div>
              <p className="text-sm text-white/80 ml-11">Secure payslip delivery and digital signatures</p>
            </div>
          </div>

          {/* Testimonial or trust banner */}
          <div className="flex items-center justify-between pt-6 border-t border-white/20">
            <p className="text-xs font-medium text-white/70">
              Trusted by 500+ South African companies
            </p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-300 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
