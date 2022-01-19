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
            const connect = createConnectionConfig(clusterApiUrl("devnet"));
            const ownerToken =String(req.query.wallet_address)
            const memberSilver = 'EdrKEeJNN7fSMunhRyjFuwHnKyw3zvLyfZzKbyofwWWD'
            const result = isValidSolanaAddress(ownerToken);
            const nfts = await getParsedNftAccountsByOwner({
                publicAddress: ownerToken,
                connection: connect,
            });
            let isHolder = false
            nfts.forEach(nft => {
                nft.data.creators.forEach(creator => {
                    if (creator.address === memberSilver) {
                        isHolder =true
                        return res.json({ isHolder:true,nft});
                    }
                })
            })
            if(!isHolder) return res.json({ isHolder:false});
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