import { NextApiRequest, NextApiResponse } from "next"
import validator from "validator"

// api/show_ip_info?ip=127.0.0.1

interface IpQualityScoreResponse {
    success: boolean,
    message: string,
    fraud_score: number,
    country_code: string,
    region: string,
    city: string,
    ISP: string,
    ASN: number,
    organization: string,
    is_crawler: boolean,
    timezone: string,
    mobile: boolean,
    host: string,
    proxy: boolean,
    vpn: boolean,
    tor: boolean,
    active_vpn: boolean,
    active_tor: boolean,
    recent_abuse: boolean,
    bot_status: boolean,
    connection_type: string,
    abuse_velocity: string,
    zip_code: string,
    latitude: number,
    longitude: number,
    request_id: string
}

interface Query {
    ip?:string
}

function isIpv6(ip: string): boolean{
    return ip.includes(':')
}

function isVpnFromIpInfo(ipQualityInfo: IpQualityScoreResponse) {
    return ipQualityInfo.proxy ||
        ipQualityInfo.vpn ||
        ipQualityInfo.tor ||
        ipQualityInfo.active_vpn ||
        ipQualityInfo.active_tor ||
        ipQualityInfo.bot_status
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {
    if (!['GET', 'HEAD'].includes(req.method as string))
        return res.status(405).json({message: `The method ${req.method} is not allowed.`})

    const {ip} = req.query as Query
    
    const client_ip = ip || req.socket.remoteAddress
    
    const clean_ip = validator.escape(client_ip as string)

    const qualityScoreUrl = `https://ipqualityscore.com/api/json/ip/${process.env.IP_QUALITY_SCORE_API_KEY}/${clean_ip}`

    const result = await fetch(qualityScoreUrl)
    
    if (!result.ok)
        return res.status(400).json({ message: "There have been an error processing your request." })

    const data = await result.json() as IpQualityScoreResponse

    res.status(302).json({
        ip: clean_ip,
        is_ipv6: isIpv6(clean_ip),
        is_vpn: isVpnFromIpInfo(data),
        details: data
    })
}