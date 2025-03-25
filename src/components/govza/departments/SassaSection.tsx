
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SassaHeader } from "./sassa/SassaHeader";
import { SassaNotification } from "./sassa/SassaNotification";
import { GrantsTab } from "./sassa/tabs/GrantsTab";
import { ApplicationsTab } from "./sassa/tabs/ApplicationsTab";
import { EligibilityTab } from "./sassa/tabs/EligibilityTab";
import { FAQsTab } from "./sassa/tabs/FAQsTab";
import { ContactTab } from "./sassa/tabs/ContactTab";

export const SassaSection = () => {
  return (
    <div>
      <SassaHeader />
      <SassaNotification />

      <Tabs defaultValue="grants" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grants">
          <GrantsTab />
        </TabsContent>
        
        <TabsContent value="applications">
          <ApplicationsTab />
        </TabsContent>
        
        <TabsContent value="eligibility">
          <EligibilityTab />
        </TabsContent>
        
        <TabsContent value="faqs">
          <FAQsTab />
        </TabsContent>
        
        <TabsContent value="contact">
          <ContactTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
