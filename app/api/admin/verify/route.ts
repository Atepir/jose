import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AUTH_SECRET = process.env.AUTH_SECRET || 'kuuni-secret-key-change-in-production';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Token manquant' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        
        // Décoder et vérifier le token
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            const [payloadStr, secret] = decoded.split('.' + AUTH_SECRET);
            
            if (secret !== '') {
                return NextResponse.json(
                    { success: false, error: 'Token invalide' },
                    { status: 401 }
                );
            }

            const payload = JSON.parse(payloadStr);
            
            // Vérifier l'expiration
            if (payload.exp < Date.now()) {
                return NextResponse.json(
                    { success: false, error: 'Token expiré' },
                    { status: 401 }
                );
            }

            return NextResponse.json({ 
                success: true, 
                username: payload.username 
            });
        } catch {
            return NextResponse.json(
                { success: false, error: 'Token invalide' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur de vérification' },
            { status: 500 }
        );
    }
}
