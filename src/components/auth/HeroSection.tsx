
import { Building2, Shield, Users, Globe } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary animate-fadeIn">
          e-Box by Afrovation
        </h1>
        <p className="text-xl text-gray-600 animate-fadeIn delay-100">
          Secure, scalable, and efficient communication platform enabling seamless collaboration from executives to remote staff and everyone in between
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary/5 transition-colors animate-fadeIn delay-200">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Enterprise Security</h3>
            <p className="text-sm text-gray-600">
              Advanced encryption and compliance features to protect your data
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary/5 transition-colors animate-fadeIn delay-300">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Team Collaboration</h3>
            <p className="text-sm text-gray-600">
              Seamless communication across departments and organizations
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary/5 transition-colors animate-fadeIn delay-400">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Multi-Org Support</h3>
            <p className="text-sm text-gray-600">
              Manage multiple organizations with advanced admin controls
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary/5 transition-colors animate-fadeIn delay-500">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Global Accessibility</h3>
            <p className="text-sm text-gray-600">
              Access your workspace from anywhere, on any device
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 animate-fadeIn delay-600">
        <img 
          src="/lovable-uploads/cea5cf65-708e-42c4-9a6c-6073f42a3471.png" 
          alt="e-Box Preview" 
          className="rounded-lg shadow-xl max-w-md mx-auto hover:shadow-2xl transition-shadow duration-300"
        />
      </div>
    </div>
  );
};

export default HeroSection;
