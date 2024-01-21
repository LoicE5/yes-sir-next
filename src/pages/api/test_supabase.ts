import supabase from "@/db/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse):Promise<void> {
    res.json(await supabase.from('attendances').select('*'))
}
