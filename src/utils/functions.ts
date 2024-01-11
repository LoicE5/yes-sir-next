export function redirect(url:string):void {
    window.location.href = url;
}

export function hasNumber(myString:string):boolean {
    return /\d/.test(myString);
}

