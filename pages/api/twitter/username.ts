import {  clusterApiUrl } from "@solana/web3.js";
import { getParsedNftAccountsByOwner,isValidSolanaAddress, createConnectionConfig,} from "@nfteyez/sol-rayz";
import type { NextApiRequest, NextApiResponse } from 'next';
import uploadFiles from '@/modules/ipfs/client';
import { IncomingForm } from 'formidable';
import { ApiError, FormData } from '@/modules/utils';
import NextCors from 'nextjs-cors';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'OPTIONS'],
    origin: '*',
  });
  try {
      switch (req.method) {
        case "GET":{
            const response = await fetch(`https://api.twitter.com/2/users?ids=${req.query.ids}`, {
                //@ts-ignore
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN || ''}`,
                },
              });
              const json = await response.json();
            if (!json.ok) return res.json({username:json[0].username})
            else return res.status(500).end();
        }
        default:
            res.setHeader('Allow', ['POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    } catch (e) {
        if (e instanceof ApiError) {
            return res.status(e.status).json(e.json);
        } else {
            console.error(e);
            return res.status(500).end();
        }
    }
}