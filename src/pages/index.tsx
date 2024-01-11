import TCs from '@/components/TCs'
import Link from 'next/link'

export default function Home() {

    return (
        <main className="body-homepage">
            <h1 className="white">YES SIR</h1>
            <p className="centered white">
                Get your class ready for the <br />
                challenges of tomorrow
            </p>
            <p className="centered white">Build trust.<br />
                Save Time.<br />
                Do more.<br />
            </p>
            <div className="button-container">
                <Link className="homepage-button" href="teacher">I am a teacher</Link>
                <Link className="homepage-button" href="student">I am a student</Link>
            </div>
            <TCs />
        </main>

    )

}