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
            const memberSilver = '6i1KhupeyzDxLrWCMeoXVea8dcyYwKi87nFpi7H9sdFr'
            const memberGold = '4upkqK25SwcCtBhMjnm1U3hfT4tWDBUGSh1g82n81mhj'
            const memberPlatinum = '7n7U38sPfDDSNnYufFsmYTPYN5SWc5pmnTLJoz9h9fBv'
            const nfts = await getParsedNftAccountsByOwner({
                publicAddress: ownerToken,
                connection: connect,
            });
            let isHolder = false
            let type = ''
            for (let i = 0; i < nfts.length; i++) {
              const nft = nfts[i];
              const creator = nft.data.creators[0]
              if (creator.address === memberPlatinum) {
                isHolder =true
                type = 'platinum'
                break
              }else if(creator.address === memberGold){
                  isHolder =true
                  if (type === '' || type === 'silver') {
                    type = 'gold'
                  }
                    
              }else if (creator.address === memberSilver) {
                  isHolder =true
                  if (type === '') {
                    type = 'silver'
                  }
              }
            }
           
            if(!isHolder) return res.json({ isHolder:false});
            else return res.json({ isHolder:true,type});
                
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