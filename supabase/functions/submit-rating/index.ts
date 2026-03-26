import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseService = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // Verify user
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { companyName, linkedinUrl, overallScore, responseType, gotInterview, comment } = await req.json()

    if (!companyName || !overallScore || !responseType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Find or create company
    let { data: company } = await supabaseService
      .from('companies')
      .select('id')
      .ilike('name', companyName)
      .maybeSingle()

    if (!company) {
      const { data: newCompany, error: createError } = await supabaseService
        .from('companies')
        .insert({ name: companyName, linkedin_url: linkedinUrl })
        .select('id')
        .single()
      if (createError) throw createError
      company = newCompany
    }

    // Upsert rating
    const { data: rating, error: ratingError } = await supabaseService
      .from('ratings')
      .upsert({
        company_id: company.id,
        user_id: user.id,
        overall_score: overallScore,
        response_type: responseType,
        got_interview: gotInterview || false,
        comment: comment || null,
      }, { onConflict: 'user_id,company_id' })
      .select()
      .single()

    if (ratingError) throw ratingError

    // Fetch updated company
    const { data: updatedCompany } = await supabaseService
      .from('companies')
      .select('*')
      .eq('id', company.id)
      .single()

    return new Response(JSON.stringify({ rating, company: updatedCompany }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
