import '@/styles/style.css'
import '@/styles/oxanium.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <Analytics />
            <SpeedInsights />
        </>
    )

}
