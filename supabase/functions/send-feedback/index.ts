
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackEmailRequest {
  to: string;
  subject: string;
  message: string;
}

// Function to send an email using the environment's SMTP settings or a service
const sendEmail = async (to: string, subject: string, message: string) => {
  // This is a placeholder for actual email sending logic
  // In a real implementation, you would use a service like Resend, SendGrid, etc.
  console.log(`Sending email to ${to} with subject: ${subject}`);
  console.log(`Message: ${message}`);
  
  // Return success for now (in a real implementation, you'd return the API response)
  return { success: true };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message }: FeedbackEmailRequest = await req.json();

    if (!to || !subject || !message) {
      throw new Error("Missing required fields: to, subject, or message");
    }

    // Send the email
    const result = await sendEmail(to, subject, message);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-feedback function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
