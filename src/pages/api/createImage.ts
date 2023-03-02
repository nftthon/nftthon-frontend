import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

type Data = {
  imageUrl: string
}

interface Props {
  prompt: string;
}

async function createImage (data: Props) {
  const params = {
    "prompt": data.prompt,
    "n": 1,
    "size": "1024x1024",
    }

  try {
    const response = await fetch(`https://api.openai.com/v1/images/generations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+ process.env.OPEN_AI_API_KEY
      },
      body: JSON.stringify(params)
    })
    
    const result = await response.json()
    console.log("result: ", result)
    return result.data[0].url

  } catch (error) {
    console.error(error);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prompt = req.query.prompt as string
  console.log("prompt in api: ", prompt)
  const url = await createImage({ prompt: prompt })
  res.status(200).json({ imageUrl: url })
}
