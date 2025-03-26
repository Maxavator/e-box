
import { useState, useEffect } from 'react';
import { useSurveys } from '@/hooks/useSurveys';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Survey, SurveyStatus } from '@/types/survey';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export function SurveyPage() {
  const { 
    surveys, 
    isLoading, 
    isSurveyModerator,
    createSurvey, 
    updateSurvey, 
    deleteSurvey,
    publishSurvey,
    closeSurvey
  } = useSurveys();
  const navigate = useNavigate();

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    anonymous: false
  });
  const [activeTab, setActiveTab] = useState('all');

  const filteredSurveys = surveys.filter(survey => {
    if (activeTab === 'all') return true;
    if (activeTab === 'draft') return survey.status === 'draft';
    if (activeTab === 'published') return survey.status === 'published';
    if (activeTab === 'closed') return survey.status === 'closed';
    return true;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCreateSurvey = async () => {
    try {
      if (!formData.title.trim()) {
        alert('Please enter a title for the survey');
        return;
      }
      
      const newSurvey = await createSurvey({
        title: formData.title,
        description: formData.description,
        anonymous: formData.anonymous
      });
      
      setIsCreating(false);
      setFormData({
        title: '',
        description: '',
        anonymous: false
      });
      
      // Navigate to edit the new survey
      navigate(`/surveys/${newSurvey.id}/edit`);
    } catch (error) {
      console.error('Error creating survey:', error);
    }
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    if (!window.confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteSurvey(surveyId);
    } catch (error) {
      console.error('Error deleting survey:', error);
    }
  };

  const handlePublishSurvey = async (surveyId: string) => {
    try {
      await publishSurvey(surveyId);
    } catch (error) {
      console.error('Error publishing survey:', error);
    }
  };

  const handleCloseSurvey = async (surveyId: string) => {
    try {
      await closeSurvey(surveyId);
    } catch (error) {
      console.error('Error closing survey:', error);
    }
  };

  const getSurveyStatusBadge = (status: SurveyStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Draft</Badge>;
      case 'published':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Published</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-300">Closed</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading surveys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Surveys</h1>
          <p className="text-muted-foreground">
            {isSurveyModerator 
              ? 'Create and manage surveys or respond to existing ones' 
              : 'Respond to available surveys'}
          </p>
        </div>
        
        {isSurveyModerator && (
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Survey
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Survey</DialogTitle>
                <DialogDescription>
                  Enter details for your new survey. You'll be able to add questions after creating it.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Survey Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter survey title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter survey description"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="anonymous" className="text-sm">
                    Anonymous responses (don't collect respondent information)
                  </label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSurvey}>
                  Create Survey
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Surveys</TabsTrigger>
          {isSurveyModerator && (
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          )}
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filteredSurveys.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-background">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No surveys found</h3>
          <p className="mt-2 text-muted-foreground">
            {isSurveyModerator 
              ? 'Create a new survey to get started' 
              : 'There are no available surveys at the moment'}
          </p>
          {isSurveyModerator && (
            <Button 
              className="mt-4" 
              onClick={() => setIsCreating(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Survey
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => (
            <Card key={survey.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{survey.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {survey.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  {getSurveyStatusBadge(survey.status)}
                </div>
              </CardHeader>
              
              <CardContent className="pb-0">
                <div className="text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Created: {format(new Date(survey.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  {survey.anonymous && (
                    <Badge variant="outline" className="mt-2">
                      Anonymous
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-3">
                {survey.status === 'published' && (
                  <Button 
                    variant="default"
                    onClick={() => navigate(`/surveys/${survey.id}`)}
                  >
                    Take Survey
                  </Button>
                )}
                
                {survey.status === 'closed' && (
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/surveys/${survey.id}/results`)}
                  >
                    View Results
                  </Button>
                )}
                
                {isSurveyModerator && (
                  <div className="flex items-center gap-2">
                    {survey.status === 'draft' && (
                      <>
                        <Button 
                          variant="default"
                          size="sm"
                          onClick={() => navigate(`/surveys/${survey.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handlePublishSurvey(survey.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {survey.status === 'published' && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleCloseSurvey(survey.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteSurvey(survey.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
