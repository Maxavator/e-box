
export type SurveyStatus = 'draft' | 'published' | 'closed';
export type QuestionType = 'single_choice' | 'multiple_choice' | 'text' | 'rating';

export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: SurveyStatus;
  creatorId: string;
  anonymous: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyQuestion {
  id: string;
  surveyId: string;
  question: string;
  questionType: QuestionType;
  required: boolean;
  options?: any;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  answers?: SurveyAnswer[];
}

export interface SurveyAnswer {
  id: string;
  responseId: string;
  questionId: string;
  answer: any;
  createdAt: string;
  updatedAt: string;
}
