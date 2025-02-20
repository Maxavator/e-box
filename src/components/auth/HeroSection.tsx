
import { Shield, Users, MessageSquare, Scale, FileText } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="hidden md:flex md:w-1/2 items-center justify-center relative overflow-hidden">
      {/* Base background image layer */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/23758d75-6a83-4a79-bba6-ba0d82eec4cf.png')] bg-cover bg-center bg-no-repeat"></div>
      
      {/* Dark gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/85"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="max-w-xl space-y-12 relative z-10 p-12 text-white">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
              Transform Your Stakeholder Engagement
            </h1>
            <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
              South Africa's premier enterprise communication platform. Built for businesses, designed for growth... Executives to Desk-less Staff, All Staff.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <ul className="grid grid-cols-2 gap-6">
              <li className="flex items-start gap-4 group">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Enterprise Security</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Secure encryption with SA POPI Act compliance
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Leave Manager</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Comprehensive leave management with multi-language support
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Messaging</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Real-time messaging for all staff throughout the organization
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Local Compliance</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Built for South African business regulations
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group col-span-2">
                <div className="mt-1 p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">Payslip Distribution</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Secure electronic payslip delivery and management
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-white/20">
            <p className="text-sm leading-relaxed opacity-80">
              Copyright Afrovation 2025. Another Innovation by Afrovation.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
