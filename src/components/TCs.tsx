import Link from "next/link"

interface TCsProps {
    color?: string
}

export default function TCs({ color }: TCsProps) {
    const tcsUrl = 'https://simple-plow-ae8.notion.site/Terms-Conditions-3cc6c864b8d54ad0a8b3cbf4f2e358f0'

    return (
        <Link href={tcsUrl} id="terms-and-conditions" className={color ? color : 'white'}>T&Cs</Link>
    )
}