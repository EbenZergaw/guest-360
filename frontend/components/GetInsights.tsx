import React, { useState } from 'react';
import Groq from "groq-sdk";
import { Preferences } from '@/context/GuestContext';
import { Button } from '@/components/ui/button';

interface GetInsightsProps {
  preferences: Preferences;
  setInsights: (insights: any) => void;
  insights: any;
}

function GetInsights({ preferences, setInsights, insights }: GetInsightsProps) {
//   const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create the Groq instance here with the API key
      const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });

      const request = JSON.stringify(preferences);
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
                You are an assistant for hotel associates. You give them insights based on guest preferences. 
                You return actionable insights in JSON on how to improve a guest's stay based on their preferences.
                Your response should be in JSON format with a key called "insight". In "insight", you will give a sumamry of the
                preferences in natural langauge, and 2 sentences on what the hotel staff should do to improve the guest's stay.
                `
          },
          {
            role: "user",
            content: request
          },
        ],
        model: "gemma-7b-it",
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        response_format: {
          type: "json_object"
        },
        stop: null
      });

    //   console.log(chatCompletion.choices[0].message.content);

      setInsights(chatCompletion.choices[0].message.content);

    //   const item = JSON.parse(chatCompletion.choices[0].message.content ?? '{"items":[]}').items?.[0];
    //   setInsights(item?.insight ?? 'No insights available.');
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights("Error generating insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button variant='outline' className='border w-full border-blue-300 bg-gradient-to-t from-blue-500 to-sky-300 rounded text-gray-800' onClick={handleSubmit} disabled={loading}>
        {loading ? 'Generating Insights...' : 'Get Insights'}
      </Button>
    </div>
  );
}

export default GetInsights;
