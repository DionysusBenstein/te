export function getCurrentTimestamp() {
    return new Date(Date.now()).toISOString();
}

export function getMilliseconds(datetime: any) {
    return (new Date(datetime)).getTime();
}