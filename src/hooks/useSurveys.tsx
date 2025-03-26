
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Survey, SurveyQuestion, SurveyResponse, SurveyStatus } from '@/types/survey';
import { toast } from 'sonner';
import { useUserRole } from '@/components/admin/hooks/useUserRole';

export function useSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAdmin, userRole } = useUserRole();
  
  const isSurveyModerator = 
    isAdmin || 
    userRole === 'survey_moderator' || 
    userRole === 'global_admin' || 
    userRole === 'org_admin';

  useEffect(() => {
    fetchSurveys();
  }, [isSurveyModerator]);

  const fetchSurveys = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase.from('surveys').select('*');
      
      // If user is not an admin or moderator, only show published surveys
      if (!isSurveyModerator) {
        query = query.eq('status', 'published');
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      // Transform the data to match our Survey type
      const transformedSurveys: Survey[] = data.map(survey => ({
        id: survey.id,
        title: survey.title,
        description: survey.description || '',
        status: survey.status as SurveyStatus,
        creatorId: survey.creator_id,
        anonymous: survey.anonymous,
        startDate: survey.start_date,
        endDate: survey.end_date,
        createdAt: survey.created_at,
        updatedAt: survey.updated_at
      }));
      
      setSurveys(transformedSurveys);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast.error('Failed to load surveys');
    } finally {
      setIsLoading(false);
    }
  };

  const createSurvey = async (surveyData: Partial<Survey>): Promise<Survey> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      if (!isSurveyModerator) {
        throw new Error('Only survey moderators can create surveys');
      }
      
      const { data, error } = await supabase
        .from('surveys')
        .insert({
          title: surveyData.title || 'Untitled Survey',
          description: surveyData.description || '',
          status: 'draft',
          anonymous: surveyData.anonymous || false,
          creator_id: user.id,
          start_date: surveyData.startDate,
          end_date: surveyData.endDate
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newSurvey: Survey = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        creatorId: data.creator_id,
        anonymous: data.anonymous,
        startDate: data.start_date,
        endDate: data.end_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setSurveys(prevSurveys => [newSurvey, ...prevSurveys]);
      
      toast.success('Survey created successfully');
      return newSurvey;
    } catch (error) {
      console.error('Error creating survey:', error);
      toast.error('Failed to create survey');
      throw error;
    }
  };

  const updateSurvey = async (surveyData: Partial<Survey> & { id: string }): Promise<Survey> => {
    try {
      if (!isSurveyModerator) {
        throw new Error('Only survey moderators can update surveys');
      }
      
      const { data, error } = await supabase
        .from('surveys')
        .update({
          title: surveyData.title,
          description: surveyData.description,
          status: surveyData.status,
          anonymous: surveyData.anonymous,
          start_date: surveyData.startDate,
          end_date: surveyData.endDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', surveyData.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const updatedSurvey: Survey = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        status: data.status,
        creatorId: data.creator_id,
        anonymous: data.anonymous,
        startDate: data.start_date,
        endDate: data.end_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setSurveys(prevSurveys => 
        prevSurveys.map(survey => 
          survey.id === updatedSurvey.id ? updatedSurvey : survey
        )
      );
      
      toast.success('Survey updated successfully');
      return updatedSurvey;
    } catch (error) {
      console.error('Error updating survey:', error);
      toast.error('Failed to update survey');
      throw error;
    }
  };

  const deleteSurvey = async (surveyId: string): Promise<void> => {
    try {
      if (!isSurveyModerator) {
        throw new Error('Only survey moderators can delete surveys');
      }
      
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);
      
      if (error) {
        throw error;
      }
      
      setSurveys(prevSurveys => 
        prevSurveys.filter(survey => survey.id !== surveyId)
      );
      
      toast.success('Survey deleted successfully');
    } catch (error) {
      console.error('Error deleting survey:', error);
      toast.error('Failed to delete survey');
      throw error;
    }
  };

  const publishSurvey = async (surveyId: string): Promise<Survey> => {
    try {
      if (!isSurveyModerator) {
        throw new Error('Only survey moderators can publish surveys');
      }
      
      const { data, error } = await supabase
        .from('surveys')
        .update({
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', surveyId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const publishedSurvey: Survey = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        status: data.status,
        creatorId: data.creator_id,
        anonymous: data.anonymous,
        startDate: data.start_date,
        endDate: data.end_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setSurveys(prevSurveys => 
        prevSurveys.map(survey => 
          survey.id === publishedSurvey.id ? publishedSurvey : survey
        )
      );
      
      toast.success('Survey published successfully');
      return publishedSurvey;
    } catch (error) {
      console.error('Error publishing survey:', error);
      toast.error('Failed to publish survey');
      throw error;
    }
  };

  const closeSurvey = async (surveyId: string): Promise<Survey> => {
    try {
      if (!isSurveyModerator) {
        throw new Error('Only survey moderators can close surveys');
      }
      
      const { data, error } = await supabase
        .from('surveys')
        .update({
          status: 'closed',
          updated_at: new Date().toISOString()
        })
        .eq('id', surveyId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const closedSurvey: Survey = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        status: data.status,
        creatorId: data.creator_id,
        anonymous: data.anonymous,
        startDate: data.start_date,
        endDate: data.end_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setSurveys(prevSurveys => 
        prevSurveys.map(survey => 
          survey.id === closedSurvey.id ? closedSurvey : survey
        )
      );
      
      toast.success('Survey closed successfully');
      return closedSurvey;
    } catch (error) {
      console.error('Error closing survey:', error);
      toast.error('Failed to close survey');
      throw error;
    }
  };

  const getSurveyQuestions = async (surveyId: string): Promise<SurveyQuestion[]> => {
    try {
      const { data, error } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', surveyId)
        .order('order_index', { ascending: true });
      
      if (error) {
        throw error;
      }

      return data.map(question => ({
        id: question.id,
        surveyId: question.survey_id,
        question: question.question,
        questionType: question.question_type,
        required: question.required,
        options: question.options,
        orderIndex: question.order_index,
        createdAt: question.created_at,
        updatedAt: question.updated_at
      }));
    } catch (error) {
      console.error('Error fetching survey questions:', error);
      toast.error('Failed to load survey questions');
      throw error;
    }
  };

  const createQuestion = async (question: Partial<SurveyQuestion>): Promise<SurveyQuestion> => {
    try {
      if (!isSurveyModerator) {
        throw new Error('Only survey moderators can create questions');
      }
      
      const { data, error } = await supabase
        .from('survey_questions')
        .insert({
          survey_id: question.surveyId,
          question: question.question || 'New Question',
          question_type: question.questionType || 'single_choice',
          required: question.required ?? true,
          options: question.options || { choices: ['Option 1', 'Option 2'] },
          order_index: question.orderIndex || 0
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        surveyId: data.survey_id,
        question: data.question,
        questionType: data.question_type,
        required: data.required,
        options: data.options,
        orderIndex: data.order_index,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Failed to create question');
      throw error;
    }
  };

  const submitSurveyResponse = async (
    surveyId: string, 
    answers: { questionId: string; answer: any }[]
  ): Promise<SurveyResponse> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // First create the response
      const { data: responseData, error: responseError } = await supabase
        .from('survey_responses')
        .insert({
          survey_id: surveyId,
          respondent_id: user.id
        })
        .select()
        .single();
      
      if (responseError) {
        throw responseError;
      }
      
      // Then create all the answers
      const answersToInsert = answers.map(answer => ({
        response_id: responseData.id,
        question_id: answer.questionId,
        answer: answer.answer
      }));
      
      const { data: answersData, error: answersError } = await supabase
        .from('survey_answers')
        .insert(answersToInsert)
        .select();
      
      if (answersError) {
        throw answersError;
      }
      
      toast.success('Survey submitted successfully');
      
      return {
        id: responseData.id,
        surveyId: responseData.survey_id,
        respondentId: responseData.respondent_id,
        submittedAt: responseData.submitted_at,
        createdAt: responseData.created_at,
        updatedAt: responseData.updated_at
      };
    } catch (error) {
      console.error('Error submitting survey response:', error);
      toast.error('Failed to submit survey response');
      throw error;
    }
  };

  const getSurveyResponses = async (surveyId: string): Promise<SurveyResponse[]> => {
    try {
      if (!isSurveyModerator) {
        throw new Error('Only survey moderators can view responses');
      }
      
      const { data, error } = await supabase
        .from('survey_responses')
        .select(`
          *,
          survey_answers (*)
        `)
        .eq('survey_id', surveyId);
      
      if (error) {
        throw error;
      }

      return data.map(response => ({
        id: response.id,
        surveyId: response.survey_id,
        respondentId: response.respondent_id,
        submittedAt: response.submitted_at,
        createdAt: response.created_at,
        updatedAt: response.updated_at,
        answers: response.survey_answers?.map((answer: any) => ({
          id: answer.id,
          responseId: answer.response_id,
          questionId: answer.question_id,
          answer: answer.answer,
          createdAt: answer.created_at,
          updatedAt: answer.updated_at
        }))
      }));
    } catch (error) {
      console.error('Error fetching survey responses:', error);
      toast.error('Failed to load survey responses');
      throw error;
    }
  };

  return {
    surveys,
    isLoading,
    isSurveyModerator,
    fetchSurveys,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    publishSurvey,
    closeSurvey,
    getSurveyQuestions,
    createQuestion,
    submitSurveyResponse,
    getSurveyResponses
  };
}
