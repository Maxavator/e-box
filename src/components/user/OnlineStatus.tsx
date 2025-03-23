
import { Circle } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export type OnlineStatus = 'online' | 'away' | 'offline' | 'busy';

interface OnlineStatusProps {
  initialStatus?: OnlineStatus;
  children?: React.ReactNode;
}

export function OnlineStatus({ initialStatus = 'online', children }: OnlineStatusProps) {
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>(initialStatus);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  useEffect(() => {
    const updateLastActivity = () => {
      setLastActivity(new Date());
      if (onlineStatus === 'away') {
        setOnlineStatus('online');
        toast.success("Welcome back! You're now online");
      }
    };

    const events = ['mousedown', 'keydown', 'mousemove', 'wheel', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDiff = now.getTime() - lastActivity.getTime();
      const minutesDiff = Math.floor(timeDiff / 1000 / 60);

      if (minutesDiff >= 30 && onlineStatus === 'online') {
        setOnlineStatus('away');
        toast.info("You're now away due to inactivity");
      }
    }, 1800000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(intervalId);
    };
  }, [lastActivity, onlineStatus]);

  const getStatusColor = (status: OnlineStatus) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'away':
        return 'text-yellow-500';
      case 'busy':
        return 'text-red-500';
      case 'offline':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleStatusChange = (newStatus: OnlineStatus) => {
    setOnlineStatus(newStatus);
    if (newStatus === 'online') {
      setLastActivity(new Date());
    }
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <Circle className={`h-2 w-2 ${getStatusColor(onlineStatus)}`} />
          <span className="capitalize">{onlineStatus}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuItem onClick={() => handleStatusChange('online')}>
            <Circle className="h-2 w-2 text-green-500 mr-2" />
            Online
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('away')}>
            <Circle className="h-2 w-2 text-yellow-500 mr-2" />
            Away
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('busy')}>
            <Circle className="h-2 w-2 text-red-500 mr-2" />
            Busy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('offline')}>
            <Circle className="h-2 w-2 text-gray-500 mr-2" />
            Appear Offline
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {children}
    </div>
  );
}
