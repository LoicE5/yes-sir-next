import { BaseResponse } from "@/utils/interfaces"
import { NextApiRequest, NextApiResponse } from "next"

interface Response {
    
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response | BaseResponse>): Promise<void> {
    
}