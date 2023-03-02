// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import sharp from 'sharp';

type Data = {
  fileData: Buffer
}

interface Props {
  buffer: Buffer;
}

async function fetchData (data: Props) {
  try {
    console.log("openAIBuffer", data.buffer)
    // const res = await fetch(data.buffer)
    // const json = await res.json()
    // const buf = Buffer.from(JSON.stringify(json));
    const response = await sharp(data.buffer)
    .toFormat("png").toBuffer()
    return response
  } catch  (error) {
    console.error(error);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = req.body as Buffer
  console.log("req.body", body)
  const buffer = await fetchData({buffer: body}) 
  res.status(200).json({ fileData: buffer })

  }

