import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { bio } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'user',
        content: `
        Use this as a TEMPLATE:
        
        "... Your world needs to be on fire. Multiple remote corporate jobs. Gambling operation on the side. Various women getting mad at you. Funding your brother’s business. Nicotine. Incoherent ramblings on word documents. Long walks ..."
        
        Analyse its rhythmic and syntax structure. Come up with your own PASSAGE structured similarly the TEMPLATE about a different TOPIC specified below.
        
        Some rules for the PASSAGE:
        - Make sure words from the TOPIC are used in the PASSAGE.
        - Make sure the first setence is always "... Your X needs to be on fire", where X is TOPIC summarised.
        - Start the PASSAGE with five spaces.
        - You are allowed to change the structure if it makes it better. You don't have to repeat the words and in the TEMPLATE, you can change them as you like. it should only flow this way in terms of the sentence structure. be creative
        - Use wordplay and puns

        Print only one single PASSAGE.

        TOPIC: ${bio}${
          bio.slice(-1) === '.' ? '' : '.'
        }`,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
