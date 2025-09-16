import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message } = await req.json();

    // For demo purposes, we'll simulate email sending
    // In production, you would integrate with Resend, SendGrid, or similar service
    console.log(`Email Alert sent to ${to}: ${subject} - ${message}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email sent successfully',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-email function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});