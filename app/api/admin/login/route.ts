import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Identifiants admin (à configurer dans les variables d'environnement)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kuuni2024';
const AUTH_SECRET = process.env.AUTH_SECRET || 'kuuni-secret-key-change-in-production';

// Fonction simple pour créer un token
function createToken(username: string): string {
    const payload = {
        username,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 heures
    };
    // Encodage simple en base64 (pour production, utilisez JWT)
    return Buffer.from(JSON.stringify(payload) + '.' + AUTH_SECRET).toString('base64');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Vérifier les identifiants
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const token = createToken(username);
            return NextResponse.json({
                success: true,
                token,
                message: 'Connexion réussie'
            });
        }

        return NextResponse.json(
            { success: false, error: 'Identifiants incorrects' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur de connexion' },
            { status: 500 }
        );
    }
}
