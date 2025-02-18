
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const metadata = JSON.parse(formData.get('metadata') as string)

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const fileName = file.name.replace(/[^\x00-\x7F]/g, '')
    const fileExt = fileName.split('.').pop()
    const filePath = `${metadata.category.toLowerCase()}/${crypto.randomUUID()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        name: metadata.name,
        file_path: filePath,
        category: metadata.category,
        description: metadata.description,
        version: metadata.version,
        size: `${Math.round(file.size / 1024)} KB`,
        content_type: file.type,
        is_verified: metadata.isVerified,
        requires_otp: metadata.requiresOtp,
        last_modified_by: metadata.lastModifiedBy
      })
      .select()
      .single()

    if (documentError) {
      throw documentError
    }

    return new Response(
      JSON.stringify(documentData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
