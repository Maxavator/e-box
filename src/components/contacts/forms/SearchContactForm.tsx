
import { useState } from "react";
import { Search, Mail, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InviteContactDialog } from "../dialogs/InviteContactDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  searchValue: z.string().min(3, {
    message: "Search term must be at least 3 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface SearchContactFormProps {
  onInviteSuccess: () => void;
}

export const SearchContactForm = ({ onInviteSuccess }: SearchContactFormProps) => {
  const [searchType, setSearchType] = useState<"email" | "saId" | "mobile">("email");
  const [searchResult, setSearchResult] = useState<"found" | "not_found" | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchValue: "",
    },
  });
  
  const handleSearch = (values: FormValues) => {
    setSearchValue(values.searchValue);
    
    // Simulate an API search that doesn't find the contact
    // In a real app, this would query your backend or Supabase
    setTimeout(() => {
      // For demo purposes, let's say email searches find contacts, others don't
      if (searchType === "email" && values.searchValue.includes("@")) {
        setSearchResult("found");
      } else {
        setSearchResult("not_found");
      }
    }, 500);
  };
  
  const handleTypeChange = (value: "email" | "saId" | "mobile") => {
    setSearchType(value);
    form.setValue("searchValue", "");
    setSearchResult(null);
  };
  
  const handleInviteClick = () => {
    setShowInviteDialog(true);
  };
  
  const handleInviteDialogClose = () => {
    setShowInviteDialog(false);
  };
  
  const handleInviteSent = () => {
    setShowInviteDialog(false);
    setSearchResult(null);
    form.reset();
    onInviteSuccess();
  };
  
  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full md:w-1/3">
              <Tabs 
                value={searchType} 
                onValueChange={(v) => handleTypeChange(v as "email" | "saId" | "mobile")}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="saId">SA ID Number</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="searchValue"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder={
                              searchType === "email" 
                                ? "Enter email address" 
                                : searchType === "saId"
                                ? "Enter 13-digit SA ID number"
                                : "Enter mobile number"
                            }
                            className="pl-8" 
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit">Search</Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
      
      {searchResult === "not_found" && (
        <Alert className="bg-muted">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Contact not found</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>
              We couldn't find a contact with the provided {searchType === "email" ? "email address" : 
                searchType === "saId" ? "SA ID number" : "mobile number"}.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="self-start"
              onClick={handleInviteClick}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send invitation
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {searchResult === "found" && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Contact found</AlertTitle>
          <AlertDescription>
            The contact has been found and added to your contacts list.
          </AlertDescription>
        </Alert>
      )}
      
      {showInviteDialog && (
        <InviteContactDialog 
          initialValue={searchValue}
          searchType={searchType}
          onClose={handleInviteDialogClose}
          onInviteSent={handleInviteSent}
          onInviteSuccess={onInviteSuccess}
        />
      )}
    </div>
  );
};
