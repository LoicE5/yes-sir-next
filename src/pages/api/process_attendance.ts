import Attendances from "@/db/models/attendances.model"
import Codes from "@/db/models/codes.model"
import { casualHash, fetchIpQualityInfo, isIpv6, isVpnFromIpInfo } from "@/utils/functions"
import { BaseResponse, IpQualityScoreResponse } from "@/utils/interfaces"
import { NextApiRequest, NextApiResponse } from "next"
import validator from "validator"

interface Query {
    code: string,
    name: string
}

interface Response {
    empty: boolean,
    denied: boolean,
    hashed: boolean,
    ip: string,
    is_ipv6: boolean,
    is_vpn: boolean,
    is_already_registered: boolean,
    js_expiry: number
}

interface DbCodesModel {
    code_id: number,
    code: number,
    class_name: string,
    js_time: number,
    js_expiry: number
}

async function isIpAlreadyRegistered(ip: string, code: number): Promise<boolean>{
    const result = await Attendances.findAll({
        where: {
            ip: ip,
            code: code
        }
    })
    return result.length > 0
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response|BaseResponse>): Promise<void> {

    if ('POST' !== req.method)
        return res.status(405).json({ message: `The method ${req.method} is not allowed.` })
    
    try {
        const { code, name } = req.query as unknown as Query

        if (!code || !name)
            return res.status(400).json({ message: "Please input a valid code and a valid name" })
    
        const cleanCode = parseInt(validator.escape(code))
        const cleanName = validator.escape(name)

        const existingCode = await Codes.findOne({
            where: {
                code: cleanCode
            }
        }) as unknown as DbCodesModel


        if (!existingCode)
            return res.status(404).json({
                empty: true,
                denied: false,
                hashed: false,
                ip: '',
                is_ipv6: false,
                is_vpn: false,
                is_already_registered: false,
                js_expiry: 0
            } as Response)
            
        const ip = req.socket.remoteAddress as string
        const ipInfo = await fetchIpQualityInfo(ip) as IpQualityScoreResponse
        const _isIpAlreadyRegistered = await isIpAlreadyRegistered(ip, existingCode.code)
        const _isIpv6 = isIpv6(ip)
        const _isVpn = isVpnFromIpInfo(ipInfo)
    
        if (
            (_isIpv6 && _isIpAlreadyRegistered)
            || (
                existingCode.js_expiry > 0 && 
                Date.now() > existingCode.js_expiry
            )
        )
            return res.status(403).json({
                empty: false,
                denied: true,
                hashed: true,
                ip: casualHash(ip),
                is_ipv6: _isIpv6,
                is_vpn: _isVpn,
                is_already_registered: _isIpAlreadyRegistered,
                js_expiry: existingCode.js_expiry
            } as Response)
    
        await Attendances.create({
            name: cleanName,
            code: cleanCode,
            ip: ip,
            is_ipv6: _isIpv6,
            is_vpn: _isVpn,
            is_already_registered: _isIpAlreadyRegistered
        })

        res.status(201).json({
            empty: false,
            denied: false,
            hashed: true,
            ip: casualHash(ip),
            is_ipv6: _isIpv6,
            is_vpn: _isVpn,
            is_already_registered: _isIpAlreadyRegistered,
            js_expiry: existingCode.js_expiry
        } as Response)

    } catch (error) {
        res.status(500).json({ message: 'There have been an error processing your request.' })
    }
}