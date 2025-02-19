
import { supabase } from "@/integrations/supabase/client";

const sampleMessages = [
  "Hey, how's it going?",
  "Just checking in on the project status",
  "Can we schedule a meeting for tomorrow?",
  "Have you seen the latest updates?",
  "Great work on the presentation!",
  "Let's discuss this in our next sync",
  "Don't forget about the deadline",
  "Thanks for your help!",
];

export const startMessageSimulation = (duration: number = 60000) => {
  const startTime = Date.now();
  const interval = setInterval(async () => {
    if (Date.now() - startTime >= duration) {
      clearInterval(interval);
      return;
    }

    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const randomConversationId = Math.random() < 0.5 ? '1' : '2'; // Simulate messages in two conversations

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('messages').insert({
        conversation_id: randomConversationId,
        content: randomMessage,
        sender_id: Math.random() < 0.5 ? user.id : 'other-user-id', // Simulate messages from different users
        created_at: new Date().toISOString(),
      });

      console.log('Simulated message sent:', randomMessage);
    } catch (error) {
      console.error('Error sending simulated message:', error);
    }
  }, 3000); // Send a new message every 3 seconds

  return () => clearInterval(interval);
};
