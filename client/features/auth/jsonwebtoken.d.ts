declare module 'jsonwebtoken' {
    export interface JwtPayload {
        [key: string]: any;
        userId?: string;
        username?: string;
        photoUrl?: string;
    }

    export function decode(token: string, options?: any): JwtPayload | string | null;
    export function verify(token: string, secret: string): JwtPayload | string;
}

