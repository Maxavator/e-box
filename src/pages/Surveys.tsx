
import { withMainLayout } from '@/layouts/MainLayout';
import { SurveyPage } from '@/components/survey/SurveyPage';

function Surveys() {
  return <SurveyPage />;
}

export default withMainLayout(Surveys);
