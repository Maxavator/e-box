import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationCards, AdminView } from '@/components/admin/dashboard/NavigationCards';
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { UserTable } from '@/components/admin/UserTable';
import { OrganizationsList } from '@/components/admin/organization/OrganizationsList';
import { AdminReporting } from '@/components/admin/dashboard/AdminReporting';
import { LookupTools } from '@/components/admin/dashboard/LookupTools';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { SystemInfo } from '@/components/admin/SystemInfo';
import { DocumentationPortal } from '@/components/admin/documentation/DocumentationPortal';
import { SalesKit } from '@/components/admin/documentation/SalesKit';
import { Award, AlertCircle, FileText, Users, BarChart4 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function AdminPortal() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [activeTab, setActiveTab] = useState('overview');
  const [docTab, setDocTab] = useState<'documentation' | 'saleskit'>('documentation');
  const [sassaTab, setSassaTab] = useState<'grants' | 'applications' | 'verification'>('grants');
  const { isMobile } = useMediaQuery();
  const { user } = useUserProfile();
  
  const username = user?.username || user?.email || "Admin";

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Administration Portal for {username}</h2>
          <p className="text-muted-foreground">
            Manage your organization, users, and system settings.
          </p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsCards />
          <NavigationCards activeView={activeView} onNavigate={setActiveView} />
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage your users, permissions, and access control.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage users for your organization and system.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mock props for UserTable until we connect to real data */}
          <UserTable 
            users={[]} 
            isLoading={false} 
            onEditUser={() => {}} 
            isAdmin={true} 
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderOrganizations = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organization Management</h2>
          <p className="text-muted-foreground">
            Manage organizations, departments, and teams.
          </p>
        </div>
      </div>

      <OrganizationsList />
    </div>
  );

  const renderReporting = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Reporting</h2>
          <p className="text-muted-foreground">
            View reports, analytics, and usage statistics.
          </p>
        </div>
      </div>

      <AdminReporting />
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground">
            Configure system-wide settings and parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SystemSettings />
        <SystemInfo />
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documentation Portal</h2>
          <p className="text-muted-foreground">
            Access documentation, guides, and resources.
          </p>
        </div>
      </div>

      <Tabs value={docTab} onValueChange={(value) => setDocTab(value as 'documentation' | 'saleskit')}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="saleskit">Sales Kit</TabsTrigger>
        </TabsList>

        <TabsContent value="documentation" className="space-y-6">
          <DocumentationPortal />
        </TabsContent>

        <TabsContent value="saleskit" className="space-y-6">
          <SalesKit />
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderSassa = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SASSA Management</h2>
          <p className="text-muted-foreground">
            Manage South African Social Security Agency grants, applications, and verification processes.
          </p>
        </div>
      </div>

      <Tabs value={sassaTab} onValueChange={(value) => setSassaTab(value as 'grants' | 'applications' | 'verification')}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="grants">Grants Management</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="grants" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    Child Support
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <CardDescription>R500 per child per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">154,237</div>
                <p className="text-sm text-muted-foreground">Total recipients</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    Older Persons
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <CardDescription>R2,080 - R2,100 per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87,546</div>
                <p className="text-sm text-muted-foreground">Total recipients</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-600" />
                    Disability
                  </CardTitle>
                  <Badge className="bg-amber-100 text-amber-800">Active</Badge>
                </div>
                <CardDescription>R2,080 per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">62,814</div>
                <p className="text-sm text-muted-foreground">Total recipients</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Grant Distribution Dashboard</CardTitle>
              <CardDescription>
                Monitor and manage social grant distribution across South Africa
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-center p-6 border-t">
                <div className="text-center">
                  <BarChart4 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Grant distribution visualization will appear here. Configure the data sources in system settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Process and approve new grant applications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reference</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID Number</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Grant Type</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle">SASSA-2023-1289</td>
                      <td className="p-4 align-middle">Thabo Mbeki</td>
                      <td className="p-4 align-middle">7801015566088</td>
                      <td className="p-4 align-middle">Child Support</td>
                      <td className="p-4 align-middle">2023-06-15</td>
                      <td className="p-4 align-middle"><Badge className="bg-yellow-100 text-yellow-800">Pending</Badge></td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle">SASSA-2023-1290</td>
                      <td className="p-4 align-middle">Nkosazana Dlamini</td>
                      <td className="p-4 align-middle">6905125829087</td>
                      <td className="p-4 align-middle">Older Persons</td>
                      <td className="p-4 align-middle">2023-06-14</td>
                      <td className="p-4 align-middle"><Badge className="bg-green-100 text-green-800">Approved</Badge></td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle">SASSA-2023-1291</td>
                      <td className="p-4 align-middle">Sipho Mthembu</td>
                      <td className="p-4 align-middle">8512265487085</td>
                      <td className="p-4 align-middle">Disability</td>
                      <td className="p-4 align-middle">2023-06-14</td>
                      <td className="p-4 align-middle"><Badge className="bg-red-100 text-red-800">More Info Required</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Center</CardTitle>
              <CardDescription>
                Verify applicant identities and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <AlertCircle className="h-8 w-8 text-amber-600 mr-4" />
                  <div>
                    <h3 className="font-medium">Verification Queue Status</h3>
                    <p className="text-sm text-muted-foreground">42 applications waiting for verification</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600 mr-4" />
                  <div>
                    <h3 className="font-medium">Document Verification</h3>
                    <p className="text-sm text-muted-foreground">78 documents pending verification</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mr-4" />
                  <div>
                    <h3 className="font-medium">Home Visit Verifications</h3>
                    <p className="text-sm text-muted-foreground">12 visits scheduled for next week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'organizations':
        return renderOrganizations();
      case 'reporting':
        return renderReporting();
      case 'system':
        return renderSystemSettings();
      case 'documentation':
        return renderDocumentation();
      case 'sassa':
        return renderSassa();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-8 pb-16">
      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
}
