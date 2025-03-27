
import { Button } from "@/components/ui/button";
import { getChangelog } from "@/utils/changelog";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APP_VERSION } from "@/utils/version";

export default function Changelog() {
  const navigate = useNavigate();
  const changelog = getChangelog();

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Changelog</h1>
        <span className="ml-3 text-sm text-muted-foreground self-end">
          Current: {APP_VERSION}
        </span>
      </div>
      
      <div className="space-y-10">
        {changelog.map((entry, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-baseline justify-between border-b pb-1">
              <h2 className="text-xl font-semibold">{entry.version}</h2>
              <span className="text-sm text-muted-foreground">{entry.date}</span>
            </div>
            <ul className="space-y-1 pl-5 list-disc">
              {entry.changes.map((change, i) => (
                <li key={i} className="text-sm">{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <footer className="mt-16 pt-4 border-t border-muted/20 text-center text-sm text-muted-foreground">
        <p>© 2025 Afrovation Technology Solutions (Pty) Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
