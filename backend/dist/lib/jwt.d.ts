/**
 * JWT Utilities — Shared Lib
 * Uses jose (JOSE standard) for ES256 or HS256 JWT sign/verify.
 *
 * In production: set JWT_ALGORITHM=ES256 and provide JWT_PRIVATE_KEY / JWT_PUBLIC_KEY (PEM)
 * In dev: falls back to HS256 with JWT_SECRET
 */
import { type JWTPayload } from 'jose';
export interface TokenPayload extends JWTPayload {
    sub: string;
    role: string;
    adminRole?: string;
    phone: string;
}
export declare function signAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string>;
export declare function signRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string>;
export declare function verifyToken(token: string): Promise<TokenPayload>;
export declare function extractBearer(authHeader: string | undefined): string;
//# sourceMappingURL=jwt.d.ts.map