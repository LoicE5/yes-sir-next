import { ReactElement } from 'react';

export default function Student() {

    let insertedElements: ReactElement[] = []

    function insertDOM(element: ReactElement | any) {
        insertedElements.push(element)
    }

    function removeDOM(element: ReactElement | any) {
        insertedElements = arrayRemove(insertedElements, element)
    }

    function arrayRemove(arr: any[], value: any) {

        return arr.filter(function (ele) {
            return ele != value;
        });
    }


    return (
        <main>
            <h1 className="no-margin-bottom">Prove your attendance</h1>
            <h2>Please enter the code you received below :</h2>
            <form className="student-form" /*onsubmit="handleForm(event)"*/ >
                <input type="text" placeholder="Your name" id="name-input" maxLength={50} required />
                <input type="number" placeholder="_  _  _  _  _  _" id="code-input" min="0" max="999999" /*onkeypress="onlyInt(event)" onkeyup="checkMinMax(this,0,999999)"*/ required />
                <button type="submit" id="code-submit" className="submit-btn">Submit</button>
            </form>
            {insertedElements}
        </main>
    )
}