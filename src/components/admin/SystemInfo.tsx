
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Database, Cpu, Memory, AlertTriangle, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const SystemInfo = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [serverMetrics, setServerMetrics] = useState({
    cpuUsage: 42,
    memoryUsage: 58,
    diskUsage: 67,
    uptime: "24 days, 12 hours",
    lastReboot: "2023-12-15 02:30 AM",
    activeServices: 12,
    totalServices: 15
  });

  // Mock data - in a real app, this would come from an API
  const databaseMetrics = {
    connections: 28,
    activeQueries: 13,
    avgQueryTime: "42ms",
    cacheHitRatio: 0.87,
    storageUsed: "1.2 TB",
    backupStatus: "Completed (12 hours ago)"
  };

  const recentIncidents = [
    { id: 1, date: "2024-03-22", title: "Database connectivity issue", severity: "medium", resolved: true },
    { id: 2, date: "2024-03-18", title: "High server load", severity: "low", resolved: true },
    { id: 3, date: "2024-03-10", title: "API gateway timeout", severity: "high", resolved: true },
    { id: 4, date: "2024-02-28", title: "File storage sync failure", severity: "medium", resolved: true }
  ];

  const servicesStatus = [
    { name: "Authentication Service", status: "operational", uptime: "99.98%" },
    { name: "Storage Service", status: "operational", uptime: "99.95%" },
    { name: "Database Service", status: "operational", uptime: "99.99%" },
    { name: "API Gateway", status: "operational", uptime: "99.92%" },
    { name: "Email Service", status: "degraded", uptime: "98.76%" },
    { name: "Scheduled Tasks", status: "operational", uptime: "99.89%" }
  ];

  // Simulate fetching metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setServerMetrics(prev => ({
        ...prev,
        cpuUsage: Math.floor(30 + Math.random() * 30),
        memoryUsage: Math.floor(50 + Math.random() * 20),
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600 hover:bg-red-700";
      case "medium": return "bg-amber-500 hover:bg-amber-600";
      case "low": return "bg-blue-600 hover:bg-blue-700";
      default: return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "bg-green-600 hover:bg-green-700";
      case "degraded": return "bg-amber-500 hover:bg-amber-600";
      case "outage": return "bg-red-600 hover:bg-red-700";
      default: return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Information</h2>
        <p className="text-muted-foreground">
          Monitor server status, database metrics, and system health
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="server" className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Server
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Incidents
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard 
              title="System Status" 
              value="Operational" 
              icon={<Server />}
              variant="success"
            />
            <MetricCard 
              title="CPU Usage" 
              value={`${serverMetrics.cpuUsage}%`} 
              icon={<Cpu />}
              progress={serverMetrics.cpuUsage}
              variant={serverMetrics.cpuUsage > 80 ? "danger" : serverMetrics.cpuUsage > 60 ? "warning" : "normal"}
            />
            <MetricCard 
              title="Memory Usage" 
              value={`${serverMetrics.memoryUsage}%`} 
              icon={<Memory />}
              progress={serverMetrics.memoryUsage}
              variant={serverMetrics.memoryUsage > 80 ? "danger" : serverMetrics.memoryUsage > 60 ? "warning" : "normal"}
            />
            <MetricCard 
              title="Active Services" 
              value={`${serverMetrics.activeServices}/${serverMetrics.totalServices}`} 
              icon={<Cpu />}
            />
            <MetricCard 
              title="Database Connections" 
              value={databaseMetrics.connections.toString()} 
              icon={<Database />}
            />
            <MetricCard 
              title="System Uptime" 
              value={serverMetrics.uptime} 
              icon={<Clock />}
            />
          </div>

          <Separator className="my-6" />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Recent Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIncidents.slice(0, 3).map(incident => (
                  <div key={incident.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-medium">{incident.title}</div>
                      <div className="text-sm text-muted-foreground">{incident.date}</div>
                    </div>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Server Tab */}
        <TabsContent value="server">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  Server Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <MetricWithProgress 
                  label="CPU Usage" 
                  value={`${serverMetrics.cpuUsage}%`} 
                  progress={serverMetrics.cpuUsage}
                />
                <MetricWithProgress 
                  label="Memory Usage" 
                  value={`${serverMetrics.memoryUsage}%`} 
                  progress={serverMetrics.memoryUsage}
                />
                <MetricWithProgress 
                  label="Disk Usage" 
                  value={`${serverMetrics.diskUsage}%`} 
                  progress={serverMetrics.diskUsage}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Reboot:</span>
                  <span className="text-sm">{serverMetrics.lastReboot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">System Uptime:</span>
                  <span className="text-sm">{serverMetrics.uptime}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Services Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servicesStatus.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">Uptime: {service.uptime}</div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Database Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Connections:</span>
                    <span className="text-sm">{databaseMetrics.connections}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Queries:</span>
                    <span className="text-sm">{databaseMetrics.activeQueries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Query Time:</span>
                    <span className="text-sm">{databaseMetrics.avgQueryTime}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cache Hit Ratio:</span>
                    <span className="text-sm">{(databaseMetrics.cacheHitRatio * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Storage Used:</span>
                    <span className="text-sm">{databaseMetrics.storageUsed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Last Backup:</span>
                    <span className="text-sm">{databaseMetrics.backupStatus}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                System Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIncidents.map(incident => (
                  <div key={incident.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="font-medium">{incident.title}</div>
                      <div className="text-sm text-muted-foreground">{incident.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      {incident.resolved && (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          Resolved
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  progress?: number;
  variant?: "normal" | "success" | "warning" | "danger";
}

const MetricCard = ({ title, value, icon, progress, variant = "normal" }: MetricCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "success": return "text-green-600 bg-green-50";
      case "warning": return "text-amber-600 bg-amber-50";
      case "danger": return "text-red-600 bg-red-50";
      default: return "text-primary bg-primary/10";
    }
  };

  const getProgressColor = () => {
    switch (variant) {
      case "success": return "bg-green-600";
      case "warning": return "bg-amber-500";
      case "danger": return "bg-red-600";
      default: return "bg-primary";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getVariantClasses()}`}>
            {icon}
          </div>}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {progress !== undefined && (
          <Progress value={progress} className={`h-1.5 mt-2 ${getProgressColor()}`} />
        )}
      </CardContent>
    </Card>
  );
};

interface MetricWithProgressProps {
  label: string;
  value: string;
  progress: number;
}

const MetricWithProgress = ({ label, value, progress }: MetricWithProgressProps) => {
  const getProgressColor = () => {
    if (progress > 80) return "bg-red-600";
    if (progress > 60) return "bg-amber-500";
    return "bg-primary";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <Progress value={progress} className={`h-1.5 ${getProgressColor()}`} />
    </div>
  );
};

export default SystemInfo;
