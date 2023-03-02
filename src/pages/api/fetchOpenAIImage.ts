// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

type Data = {
  fileData: Blob
}

async function fetchData (openAIUrl) {
  const response = await fetch(openAIUrl)
  const fileData = await response.blob()
  return fileData

}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  fetchData(req.body).then((fileData) => {
    res.status(200).json({ fileData: fileData })

  }
    
  ) 
}
