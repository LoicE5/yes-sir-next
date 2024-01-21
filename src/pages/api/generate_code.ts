import Codes from "@/db/models/codes.model";
import { randomInt } from "@/utils/functions";
import { BaseResponse } from "@/utils/interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { Model } from "sequelize";
import validator from "validator";

interface Query {
    class_name: string,
    js_time: string,
    js_expiry: string
}

interface Response {
    code: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response|BaseResponse>): Promise<void> {

    if ('POST' !== req.method)
        return res.status(405).json({ message: `The method ${req.method} is not allowed.` })

    try {

        const { class_name, js_time, js_expiry } = req.query as unknown as Query
        
        if (!class_name || !js_time)
            return res.status(400).json({ message: 'Please set a class_name and a js_time in your request' })
        
        const cleanClassName = validator.escape(class_name)
        const cleanJsTime = parseInt(validator.escape(js_time))
        const cleanJsExpiry = js_expiry ? parseInt(validator.escape(js_expiry)) : 0

        if (Number.isNaN(cleanJsTime) || Number.isNaN(cleanJsExpiry))
            return res.status(400).json({message: 'Please set a correct time & expiry'})

        let code:number, existingCode:Model|null
        
        do {
            code = randomInt(1, 999999)
            existingCode = await Codes.findOne({
                where: {
                    code: code
                }
            })
        } while(existingCode)

        await Codes.create({
            code: code,
            class_name: cleanClassName,
            js_time: cleanJsTime,
            js_expiry: cleanJsExpiry
        })

        res.status(201).json({code: code} as Response)

    } catch (error) {
        res.status(500).json({message: 'There have been an error processing your request.'})
    }
}