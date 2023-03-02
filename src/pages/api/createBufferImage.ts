import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import sharp from 'sharp';

type Data = {
  buffer: Buffer
}

interface Props {
  prompt: string;
}

async function fetchBuffer (data: Props) {
  const params = {
    "prompt": data.prompt,
    "n": 1,
    "size": "1024x1024",
    "response_format": "b64_json",
    }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+ process.env.OPEN_AI_API_KEY
      },
      body: JSON.stringify(params)
    })
    
    const result = await response.json()
    console.log("data", result.data[0])

    const base64 = Buffer.from(result.data[0].b64_json, "base64").toString("base64");
    const png = await sharp(Buffer.from(base64, "base64")).png().toBuffer();

    return png

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
  const buffer = await fetchBuffer({ prompt: prompt })
  res.status(200).json({ buffer: buffer })
}

export const config = {
  api: {
    responseLimit: false,
  },
}
