// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseCookies(cookieString: string | undefined): Array<any>{
    if(cookieString){
        const rawCookieArray = cookieString.split(';');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cookieObject: any = [];

        rawCookieArray.forEach(rawCookie => {
            const [key, value] = rawCookie.split('=');
            cookieObject[key.trim()] = value.trim();
        });

        return cookieObject;
    } else {
        return [];
    }    
}