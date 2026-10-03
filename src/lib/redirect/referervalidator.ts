// block any request not orginiate from my side domain
import process from "node:process";

const ALLOWED_DOMAIN = (process.env.ALLOWED_REFERER_DOMAIN || '')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
interface RefererResult{
    valid: boolean;
    reason?: string;
}

export function validateReferer(refererHeader: string | null): RefererResult{
    // reject if referere hearder is completely absent
    if (!refererHeader || refererHeader.trim() === ''){
        return{ valid: false, reason: 'Missing referer hearder'};
    }

    try{
        
        const refererurl = new URL(refererHeader);
        const refererhost= refererurl.hostname.toLowerCase();
        
        //checl if referer host matches ant allowed domain
        const isAllowed = ALLOWED_DOMAIN.some(
        (domain) => refererhost === domain || refererhost.endsWith(`.${domain}`)
    );

    if(!isAllowed){
        return{
            valid: false,
            reason:`Referer domain '${refererhost}' not in allowed list `,
        };
    }
        return{ valid: true }
    }catch{
        return{ valid: false, reason: 'Malformed Referer header'};
    } 
}