
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LeaveRequestFormProps {
  selectedDates: Date[];
  leaveType: string;
  reason: string;
  onDatesChange: (dates: Date[] | undefined) => void;
  onLeaveTypeChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onSubmit: () => void;
}

export const LeaveRequestForm = ({
  selectedDates,
  leaveType,
  reason,
  onDatesChange,
  onLeaveTypeChange,
  onReasonChange,
  onSubmit
}: LeaveRequestFormProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {t('leave.request')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('leave.form.typeLabel')}</Label>
          <Select value={leaveType} onValueChange={onLeaveTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('leave.form.selectType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">{t('leave.types.annual')} (21 days per year)</SelectItem>
              <SelectItem value="sick">{t('leave.types.sick')} (30 days per 36 months)</SelectItem>
              <SelectItem value="family">{t('leave.types.family')} (3 days per year)</SelectItem>
              <SelectItem value="maternity">{t('leave.types.maternity')} (4 months)</SelectItem>
              <SelectItem value="study">{t('leave.types.study')} (10 days per year)</SelectItem>
              <SelectItem value="unpaid">{t('leave.types.unpaid')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>{t('leave.form.datesLabel')}</Label>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={onDatesChange}
            className="rounded-md border"
            numberOfMonths={2}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('leave.form.reasonLabel')}</Label>
          <Textarea
            placeholder={t('leave.form.reasonPlaceholder')}
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t('leave.form.selectedDays')}: {selectedDates.length} days
          </p>
          <Button className="w-full" onClick={onSubmit}>
            {t('leave.form.submit')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
