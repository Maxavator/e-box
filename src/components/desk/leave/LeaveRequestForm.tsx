
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { LeaveType } from "./types";

interface LeaveRequestFormProps {
  onSubmitSuccess: () => void;
}

export function LeaveRequestForm({ onSubmitSuccess }: LeaveRequestFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<LeaveType | ''>('');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({ from: new Date() });
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!selectedType || !dateRange.from || !dateRange.to || !reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please login to submit leave requests",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('leave_requests')
      .insert({
        leave_type: selectedType,
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString(),
        reason,
        user_id: user.id,
        status: 'pending'
      });

    if (error) {
      console.error('Error submitting leave request:', error);
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Leave request submitted successfully"
    });

    // Reset form and refresh data
    setSelectedType('');
    setDateRange({ from: new Date() });
    setReason("");
    onSubmitSuccess();
  };

  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">{t('leave.request')}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('leave.form.typeLabel')}
          </label>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as LeaveType)}>
            <SelectTrigger>
              <SelectValue placeholder={t('leave.form.selectType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">{t('leave.types.annual')}</SelectItem>
              <SelectItem value="sick">{t('leave.types.sick')}</SelectItem>
              <SelectItem value="maternity">{t('leave.types.maternity')}</SelectItem>
              <SelectItem value="paternity">{t('leave.types.paternity')}</SelectItem>
              <SelectItem value="unpaid">{t('leave.types.unpaid')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('leave.form.datesLabel')}
          </label>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="rounded-md border"
            disabled={(date) => date < addDays(new Date(), -1)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('leave.form.reasonLabel')}
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('leave.form.reasonPlaceholder')}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          {t('leave.form.submit')}
        </Button>
      </div>
    </Card>
  );
}
