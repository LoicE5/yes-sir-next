import { useEffect, useRef, useState } from "react"
import { sessionStorage } from "@/utils/storage"
import { onlyInt, checkMinMax, calculateTimer } from "@/utils/functions"
import TCs from "@/components/TCs"
import supabase from "@/db/supabaseClient"
import React from "react"

interface GetCodeResponse {
    code: number
}

interface NewAttendance {
    code: number,
    id: number,
    ip: string,
    is_already_registered: boolean,
    is_ipv6: boolean,
    is_vpn: boolean,
    name: string
}

export default function Teacher() {
    const classroomNameProps = {
        minLength: 1,
        maxLength: 50
    }
    const timeGivenProps = {
        min: 2,
        max: 180
    }

    const [classroomName, setClassroomName] = useState("")
    const [timeGiven, setTimeGiven] = useState(5)
    const [classroomCode, setClassroomCode] = useState(-1)
    const [timer, setTimer] = useState("")
    const [codeButtonText, setCodeButtonText] = useState('Generate code')
    const [disabledButton, setDisabledButton] = useState(false)
    const [attendances, setAttendances] = useState([] as NewAttendance[])

    const oldCodeIntervalRef = useRef<number | NodeJS.Timeout>()

    function replaceSpacesNumbers(event: KeyboardEvent): void {
        let key = event.keyCode
        if (!((key >= 65 && key <= 90) || key === 8)) {
            event.preventDefault()
        }
    }

    function isValidString(
        str: string,
        minLength: number,
        maxLength: number
    ): boolean {
        if (!str) return false

        const specialCharacters = [" ", "&", "?"]
        if (specialCharacters.some((char) => str.includes(char))) return false

        if (minLength && Number.isInteger(minLength) && str.length < minLength)
            return false

        if (maxLength && Number.isInteger(maxLength) && str.length > maxLength)
            return false

        return true
    }

    async function getCode(): Promise<void> {
        if (!isValidString(classroomName, classroomNameProps.minLength, classroomNameProps.maxLength))
            return console.error(`The given classroom name is not valid. String is : ${classroomName}.`)

        const date = new Date()
        const currentDate = date.getTime()
        const timeGivenInMilliseconds = timeGiven * 60 * 1000
        const limitDate = currentDate + timeGivenInMilliseconds

        const url = `api/generate_code?class_name=${classroomName}&js_time=${currentDate}&js_expiry=${limitDate}`
        const result = await fetch(url, {
            method: 'POST',
        })

        if (!result.ok)
            return alert(`The code generation have failed. Error code : ${result.status}. Error message : ${await result.text()}`)

        const _classroomCode = await result.json() as GetCodeResponse
        sessionStorage.clear()
        sessionStorage.save(String(_classroomCode.code), String(limitDate))
        setClassroomCode(_classroomCode.code)
        setDisabledButton(true)

        // Clear the old interval before setting a new one
        if (oldCodeIntervalRef.current) {
            clearInterval(oldCodeIntervalRef.current)
        }

        // Set the new interval
        oldCodeIntervalRef.current = setInterval(() => {
            setTimer(calculateTimer(limitDate))
        }, 1000)

        setAttendances([])
    }

    function getMostRecentCode(): number {
        let values = Object.entries(sessionStorage.loadAll())
        let max_JS_time = 0
        let code_to_recover = 0

        for (let item of values) {
            let JS_time = Number(item[1])

            if (JS_time > max_JS_time)
                max_JS_time = JS_time
        }

        for (let item of values) {
            let code = Number(item[0])
            let JS_time = Number(item[1])

            if (JS_time == max_JS_time) {
                code_to_recover = code
            }
        }

        return code_to_recover
    }

    useEffect(() => {
        if (sessionStorage.isEmpty())
            return

        const code = getMostRecentCode()
        const limitDate = parseInt(sessionStorage.load(String(code)) as any)
        setClassroomCode(code)
        setCodeButtonText('Generate a new code')

        // Clear the old interval before setting a new one
        if (oldCodeIntervalRef.current) {
            clearInterval(oldCodeIntervalRef.current)
        }

        // Set the new interval
        oldCodeIntervalRef.current = setInterval(() => {
            setTimer(calculateTimer(limitDate))
        }, 1000)

        supabase
            .from('attendances')
            .select('*')
            .eq('code', code)
            .then(({ data, error }) => {
                setAttendances(data as NewAttendance[])
            })
    }, [])

    useEffect(() => {
        if (classroomCode <= 0)
            return

        const channel = supabase
            .channel('attendances_check')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'attendances',
                    filter: `code=eq.${classroomCode}`
                },
                payload => setAttendances(prev => [...prev, payload.new] as NewAttendance[])
            )
            .subscribe()

        return () => {
            channel.unsubscribe()
        }

    }, [classroomCode])

    function attendantsListElements(attendances: NewAttendance[]): React.JSX.Element[] {

        const getSameIpNames = (currentAttendance: NewAttendance): string[] =>
            attendances
                .filter(
                    (otherAttendance) =>
                        otherAttendance.ip === currentAttendance.ip &&
                        otherAttendance.name !== currentAttendance.name
                )
                .map((otherAttendance) => otherAttendance.name)

        const outputElements: React.JSX.Element[] = attendances.map(
            (attendance: NewAttendance, index: number): React.JSX.Element => {
                if (!attendance) return <></>

                const sameIpNames = getSameIpNames(attendance)
                const sameIpNamesString = sameIpNames.join(', ')

                return (
                    <li key={index}>
                        {attendance.name} joined the class
                        {attendance.is_already_registered && (
                            <span style={{ color: 'red', fontStyle: 'italic' }}>
                                ({attendance.name} joined this class with the same IP address than {sameIpNamesString}).
                            </span>
                        )}
                        {attendance.is_vpn && (
                            <span style={{ color: 'blue', fontStyle: 'italic' }}>
                                {attendance.is_already_registered ? ' ' : <>&nbsp</>}
                                ({attendance.name} joined this class using a VPN service).
                            </span>
                        )}
                    </li>
                )
            }
        )

        return outputElements
    }


    return (
        <>
            <h1 className="no-margin-bottom">Create a room</h1>
            <h2 className="no-margin-bottom">Generate a room code to share with your students.</h2>

            <div className="inputs-container">

                <div className="classname-container">
                    <input
                        type="text"
                        placeholder="Name of your class"
                        id="classroom-name"
                        value={classroomName}
                        minLength={classroomNameProps.minLength}
                        maxLength={classroomNameProps.maxLength}
                        onKeyDown={event => replaceSpacesNumbers(event as any)}
                        onChange={event => setClassroomName(event.target.value)}
                    />
                    <br />
                    <label htmlFor="classroom-name">Your class name can only contain letters. No numbers, spaces or special chars.</label>
                </div>

                <div className="timegiven-container">
                    <input
                        type="number"
                        placeholder="Time given (in minutes)"
                        min={timeGivenProps.min}
                        max={timeGivenProps.max}
                        value={timeGiven}
                        id="time-given"
                        onKeyPress={event => onlyInt(event as any)}
                        onKeyUp={event => checkMinMax((event.target as any).value, timeGivenProps.min, timeGivenProps.max, setTimeGiven)}
                        onChange={event => setTimeGiven(parseInt(event.target.value))}
                    />
                    <label htmlFor="time-given">Between 2 min <br />& 180 min.</label>
                </div>
            </div>

            <button onClick={getCode} id="get-code-btn" className="submit-btn" disabled={disabledButton}>{codeButtonText}</button>

            {classroomCode >= 0 ? (<h2 id="code-title">The code is : <span id="code">{classroomCode}</span></h2>) : ''}
            <h2 id="timer">{timer}</h2>
            <ul id="attendants">
                {attendantsListElements(attendances)}
            </ul>

            <TCs />
        </>
    )
}