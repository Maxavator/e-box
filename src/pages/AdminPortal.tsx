
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationCards } from '@/components/admin/dashboard/NavigationCards';
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { AdminMenu } from '@/components/admin/AdminMenu';
import { UserTable } from '@/components/admin/UserTable';
import { OrganizationsList } from '@/components/admin/organization/OrganizationsList';
import { AdminReporting } from '@/components/admin/dashboard/AdminReporting';
import { LookupTools } from '@/components/admin/dashboard/LookupTools';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { SystemInfo } from '@/components/admin/SystemInfo';
import { DocumentationPortal } from '@/components/admin/documentation/DocumentationPortal';
import { SalesKit } from '@/components/admin/documentation/SalesKit';

// Define all possible view types for type safety
type ActiveView = 'dashboard' | 'users' | 'organizations' | 'settings' | 'system' | 'reporting' | 'documentation';

export default function AdminPortal() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [activeTab, setActiveTab] = useState('overview');
  const [docTab, setDocTab] = useState<'documentation' | 'saleskit'>('documentation');

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your organization, users, and system settings.
          </p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tools">Admin Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsCards />
          <NavigationCards onNavigate={setActiveView} />
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <LookupTools />
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
          <UserTable />
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
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-8 pb-16">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <AdminMenu activeView={activeView} setActiveView={setActiveView} />
        </div>
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
