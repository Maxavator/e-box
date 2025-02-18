
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface LeaveBalanceProps {
  getLeaveBalance: (type: string) => number;
  isLoading: boolean;
}

export function LeaveBalance({ getLeaveBalance, isLoading }: LeaveBalanceProps) {
  const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F'];

  const leaveTypes = [
    { name: 'Annual Leave', id: 'annual' },
    { name: 'Sick Leave', id: 'sick' },
    { name: 'Maternity Leave', id: 'maternity' },
    { name: 'Paternity Leave', id: 'paternity' }
  ];

  const data = leaveTypes.map(type => ({
    name: type.name,
    value: getLeaveBalance(type.id)
  }));

  const totalDays = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Leave Balance</h2>
      </div>
      {!isLoading ? (
        <div className="space-y-6">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} days`, '']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    padding: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {data.map((item, index) => (
              <div 
                key={item.name}
                className="flex flex-col p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-lg font-semibold text-primary">{item.value} days</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-100 rounded-lg text-center">
            <span className="text-sm text-gray-600">Total Available Leave</span>
            <p className="text-2xl font-bold text-primary">{totalDays} days</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Loading leave balance...</p>
        </div>
      )}
    </Card>
  );
}
