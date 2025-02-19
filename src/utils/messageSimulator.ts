
import { supabase } from "@/integrations/supabase/client";

const sampleMessages = [
  "Hi, can you review the latest project timeline?",
  "The client meeting went well, I'll share the notes shortly",
  "Have you seen the updated BMC requirements doc?",
  "Let's schedule a team sync for tomorrow",
  "The new system deployment is ready for testing",
  "Please review the compliance documentation",
  "Great work on the presentation yesterday",
  "Can we discuss the resource allocation?",
  "The stakeholder feedback is positive",
  "Need your input on the technical specifications"
];

async function getBMCUsers() {
  try {
    // First get the BMC organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .ilike('domain', '%bmc-group.co.za%')
      .single();

    if (orgError || !org) {
      console.error('Error fetching BMC organization:', orgError);
      return [];
    }

    // Then get the users from that organization
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('organization_id', org.id);

    if (profilesError || !profiles) {
      console.error('Error fetching BMC users:', profilesError);
      return [];
    }

    return profiles;
  } catch (error) {
    console.error('Error in getBMCUsers:', error);
    return [];
  }
}

async function getOrCreateConversation(user1Id: string, user2Id: string) {
  try {
    // First check if conversation exists
    const { data: existingConv, error: fetchError } = await supabase
      .from('conversations')
      .select('id')
      .or(`user1_id.eq.${user1Id},user2_id.eq.${user2Id}`)
      .or(`user1_id.eq.${user2Id},user2_id.eq.${user1Id}`)
      .single();

    if (existingConv) return existingConv.id;
    if (fetchError && fetchError.code !== 'PGRST116') { // Not found error
      console.error('Error fetching conversation:', fetchError);
      return null;
    }

    // Create new conversation if it doesn't exist
    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating conversation:', createError);
      return null;
    }

    return newConv.id;
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    return null;
  }
}

export const startMessageSimulation = async (duration: number = 60000) => {
  const users = await getBMCUsers();

  if (users.length < 2) {
    console.error('Not enough BMC users found for simulation');
    return () => {};
  }

  const startTime = Date.now();
  const interval = setInterval(async () => {
    if (Date.now() - startTime >= duration) {
      clearInterval(interval);
      return;
    }

    // Randomly select two different users
    const sender = users[Math.floor(Math.random() * users.length)];
    let receiver;
    do {
      receiver = users[Math.floor(Math.random() * users.length)];
    } while (receiver.id === sender.id);

    // Get or create conversation
    const conversationId = await getOrCreateConversation(sender.id, receiver.id);
    if (!conversationId) return;

    // Send message
    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    
    try {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: sender.id,
        content: `[${sender.first_name}]: ${randomMessage}`,
        created_at: new Date().toISOString()
      });

      console.log(`Simulated message from ${sender.first_name} to ${receiver.first_name}`);
    } catch (error) {
      console.error('Error sending simulated message:', error);
    }
  }, 3000);

  return () => clearInterval(interval);
};
