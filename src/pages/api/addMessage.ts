// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

import redis from '../../../redis';

type Data = {
  message: Message
}

type ErrorData = {
  body: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {

  if (req.method !== 'POST') {
    res.status(405).json({
      body: "invalid method"
    });
    return
  }

  const { message } = req.body;
  console.log(message)

  const newMessage: Message = {
    ...message,
    createdAt: Date.now()
  }
  await redis.hset(message.messageId, JSON.stringify(newMessage));

  res.status(200).json({ message: newMessage })
}
