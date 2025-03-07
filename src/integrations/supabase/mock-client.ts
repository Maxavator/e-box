
// This file provides a mock implementation of the Supabase client
// It's used when the real Supabase schema isn't properly set up yet

const createMockQueryBuilder = () => {
  const builder = {
    select: () => builder,
    insert: () => builder,
    upsert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    lt: () => builder,
    gte: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    in: () => builder,
    contains: () => builder,
    containedBy: () => builder,
    rangeGt: () => builder,
    rangeLt: () => builder,
    rangeGte: () => builder,
    rangeLte: () => builder,
    textSearch: () => builder,
    filter: () => builder,
    or: () => builder,
    and: () => builder,
    not: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    single: () => ({ data: null, error: null }),
    maybeSingle: () => ({ data: null, error: null }),
    then: () => Promise.resolve({ data: [], error: null }),
  };
  return builder;
};

export const mockSupabaseClient = {
  from: () => createMockQueryBuilder(),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
    resetPasswordForEmail: () => Promise.resolve({ error: null }),
    admin: {
      getUserById: () => Promise.resolve({ data: { user: null }, error: null }),
      createUser: () => Promise.resolve({ data: { user: null }, error: null }),
    }
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  functions: {
    invoke: () => Promise.resolve({ data: null, error: null }),
  },
  channel: () => ({
    on: () => ({ subscribe: () => {} }),
  }),
  removeChannel: () => {},
};
