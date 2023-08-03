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
    stream: false,
    messages: [
      {
        role: 'user',
        content: `
        Use this as a TEMPLATE:
        
        "Your world needs to be on fire. Multiple remote corporate jobs. Gambling operation on the side.
        Various women getting mad at you. Funding your brother’s business. Nicotine. Incoherent ramblings on word documents. Long walks"
        
        Analyse its rhythmic and syntax structure. Come up with your own PASSAGE like the TEMPLATE about a different TOPIC.
        Make sure words from the TOPIC are used in the PASSAGE. Be creative.

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
