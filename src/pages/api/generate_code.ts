import { randomInt } from "@/utils/functions"
import { BaseResponse } from "@/utils/interfaces"
import { NextApiRequest, NextApiResponse } from "next"
import validator from "validator"
import supabaseApi from "@/db/supabaseServer"

interface Query {
    class_name: string,
    time_given: string
}

interface Response {
    code: number,
    js_time: number,
    js_expiry: number
}

async function checkIfCodeAlreadyExists(code: number): Promise<boolean> {
    return (await supabaseApi.from('codes').select('*').in('code', [code])).data!.length > 0
}

function getJsTimeAndExpiry(timeGiven: number): number[] {
    const jsTime = Date.now()
    const timeGivenInMilliseconds = timeGiven * 60 * 1000
    const jsExpiry = jsTime + timeGivenInMilliseconds
    return [jsTime, jsExpiry]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response|BaseResponse>): Promise<void> {

    if ('POST' !== req.method)
        return res.status(405).json({ message: `The method ${req.method} is not allowed.` })

    try {

        const { class_name, time_given } = req.query as unknown as Query
        
        if (!class_name)
            return res.status(400).json({ message: 'Please set a class_name in your request' })
        
        const cleanClassName = validator.escape(class_name)
        const cleanTimeGiven = parseInt(validator.escape(time_given))

        if (Number.isNaN(cleanTimeGiven))
            return res.status(400).json({message: 'Please set a correct time given'})

        let code:number, existingCode:boolean
        
        do {
            code = randomInt(1, 999999)
            existingCode = await checkIfCodeAlreadyExists(code)
        } while (existingCode)
        
        const [jsTime, jsExpiry] = getJsTimeAndExpiry(cleanTimeGiven)

        const { error } = await supabaseApi.from('codes').insert([{
            code: code,
            class_name: cleanClassName,
            js_time: jsTime,
            js_expiry: jsExpiry
        }])

        if (error)
            return res.status(500).json({message: 'There have been an error processing your request.'})

        res.status(201).json({
            code: code,
            js_time: jsTime,
            js_expiry: jsExpiry
        } as Response)

    } catch (error) {
        res.status(500).json({message: 'There have been an error processing your request.'})
    }
}