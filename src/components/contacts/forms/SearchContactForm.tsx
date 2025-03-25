
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Mail, Smartphone, UserRound } from "lucide-react";
import { InviteContactDialog } from "../dialogs/InviteContactDialog";
import { isSaId } from "@/utils/saIdValidation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SearchContactFormProps {
  onInviteSuccess: () => void;
}

const searchSchema = z.object({
  searchValue: z
    .string()
    .min(3, { message: "Search term must be at least 3 characters" })
});

export const SearchContactForm = ({ onInviteSuccess }: SearchContactFormProps) => {
  const [searchType, setSearchType] = useState<"email" | "mobile" | "saId">("email");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notFoundValue, setNotFoundValue] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchValue: ""
    }
  });

  const handleSearch = async (data: z.infer<typeof searchSchema>) => {
    setIsSearching(true);
    setSearchResults([]);
    setNotFoundValue("");
    
    try {
      let query;
      const searchValue = data.searchValue.trim();
      
      if (searchType === "email") {
        // Search by email in profiles
        query = supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, mobile_phone_number, organization_id')
          .ilike('email', `%${searchValue}%`)
          .limit(10);
      } else if (searchType === "mobile") {
        // Search by mobile number
        query = supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, mobile_phone_number, organization_id')
          .ilike('mobile_phone_number', `%${searchValue}%`)
          .limit(10);
      } else if (searchType === "saId") {
        // Validate SA ID format first
        if (!isSaId(searchValue)) {
          toast.error("Invalid SA ID format. Please enter a 13-digit SA ID number");
          setIsSearching(false);
          return;
        }
        
        // Search by SA ID (would need a field for this in your database)
        // This is a placeholder - adjust based on your actual schema
        query = supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, mobile_phone_number, organization_id')
          .eq('sa_id', searchValue)
          .limit(10);
      }
      
      const { data: results, error } = await query;
      
      if (error) {
        console.error("Search error:", error);
        toast.error("Error searching for contacts");
      } else if (results && results.length > 0) {
        setSearchResults(results);
      } else {
        setNotFoundValue(searchValue);
        toast.info("No contacts found with that information");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error during search");
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleInvite = () => {
    setShowInviteDialog(true);
  };
  
  const handleInviteComplete = () => {
    setShowInviteDialog(false);
    setNotFoundValue("");
    onInviteSuccess();
  };
  
  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-4">
              <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>By Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>By Mobile</span>
                  </TabsTrigger>
                  <TabsTrigger value="saId" className="flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    <span>By SA ID</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <FormField
                    control={form.control}
                    name="searchValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="example@email.com" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="mobile">
                  <FormField
                    control={form.control}
                    name="searchValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="0123456789" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="saId">
                  <FormField
                    control={form.control}
                    name="searchValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SA ID Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="1234567890123" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between">
                <Button type="submit" disabled={isSearching} className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
                
                {notFoundValue && (
                  <Button type="button" variant="outline" onClick={handleInvite}>
                    Invite User
                  </Button>
                )}
              </div>
            </form>
          </Form>
          
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Search Results</h3>
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <div 
                    key={result.id} 
                    className="p-3 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{result.first_name} {result.last_name}</p>
                      <p className="text-sm text-muted-foreground">{result.mobile_phone_number || "No mobile number"}</p>
                    </div>
                    <Button size="sm">Add Contact</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {showInviteDialog && (
        <InviteContactDialog 
          isOpen={showInviteDialog}
          initialValue={notFoundValue}
          searchType={searchType} 
          onClose={() => setShowInviteDialog(false)}
          onInviteSent={handleInviteComplete}
        />
      )}
    </div>
  );
};
