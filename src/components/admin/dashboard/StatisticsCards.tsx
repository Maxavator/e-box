
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Building2, Shield, BarChart, ArrowUpRight } from "lucide-react";

export const StatisticsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          <UserPlus className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">2,834</div>
            <div className="flex items-center text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              12%
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">+180 this month</p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Active Organizations</CardTitle>
          <Building2 className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">147</div>
            <div className="flex items-center text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              8%
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">+12 this month</p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">System Health</CardTitle>
          <Shield className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">99.9%</div>
            <div className="flex items-center text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              0.1%
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Last 30 days uptime</p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Active Sessions</CardTitle>
          <BarChart className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">1,284</div>
            <div className="flex items-center text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              15%
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Current active users</p>
        </CardContent>
      </Card>
    </div>
  );
};
