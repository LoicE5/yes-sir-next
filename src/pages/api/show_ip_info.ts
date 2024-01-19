import { fetchIpQualityInfo, isVpnFromIpInfo } from "@/utils/functions"
import { IpQualityScoreResponse } from "@/utils/interfaces"
import { NextApiRequest, NextApiResponse } from "next"
import validator from "validator"

// api/show_ip_info?ip=127.0.0.1

interface Query {
    ip?:string
}

interface Response {
    ip: string,
    is_ipv6: boolean,
    is_vpn: boolean,
    details: IpQualityScoreResponse
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {

    if (!['GET', 'HEAD'].includes(req.method as string))
        return res.status(405).json({message: `The method ${req.method} is not allowed.`})

    const {ip} = req.query as Query
    const client_ip = ip || req.socket.remoteAddress
    const clean_ip = validator.escape(client_ip as string)        

    const data = await fetchIpQualityInfo(clean_ip)

    if (!data)
        return res.status(400).json({ message: "There have been an error processing your request." })

    res.status(302).json({
        ip: clean_ip,
        is_ipv6: isIpv6(clean_ip),
        is_vpn: isVpnFromIpInfo(data),
        details: data
    } as Response)
}

function isIpv6(clean_ip: string): boolean {
    throw new Error("Function not implemented.")
}
