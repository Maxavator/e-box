
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export const LegalReference = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('leave.legal.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <div className="text-muted-foreground">
            <p className="font-medium mb-2">{t('leave.legal.disclaimer')}</p>
            
            <h4 className="text-sm font-semibold mt-4 mb-2">{t('leave.legal.laws')}</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="font-medium">{t('leave.legal.bcea')}:</span>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• {t('leave.types.annual')}: 21 days per year</li>
                  <li>• {t('leave.types.sick')}: 30 days per 36 months</li>
                  <li>• {t('leave.types.family')}: 3 days per year</li>
                  <li>• {t('leave.types.maternity')}: 4 months</li>
                </ul>
              </li>
              <li className="mt-2"><span className="font-medium">{t('leave.legal.lra')}:</span>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Protection against unfair dismissal relating to pregnancy and leave</li>
                  <li>• Rights during leave periods</li>
                </ul>
              </li>
              <li className="mt-2"><span className="font-medium">{t('leave.legal.companyBenefits')}:</span>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• {t('leave.types.study')}: 10 days per year</li>
                  <li>• {t('leave.types.unpaid')}: Subject to approval</li>
                </ul>
              </li>
            </ul>

            <p className="mt-4 text-sm font-medium text-yellow-600">
              {t('leave.legal.important')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
