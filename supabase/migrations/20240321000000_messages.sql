
create table messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table messages enable row level security;

-- Allow users to insert their own messages
create policy "Users can insert their own messages"
on messages for insert
to authenticated
with check (
  sender_id = auth.uid()
);

-- Allow users to read messages in their conversations
create policy "Users can read messages in their conversations"
on messages for select
to authenticated
using (
  exists (
    select 1 from conversations c
    where c.id = messages.conversation_id
    and (c.user1_id = auth.uid() or c.user2_id = auth.uid())
  )
);

-- Enable realtime
alter publication supabase_realtime add table messages;
