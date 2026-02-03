#!/bin/bash

# =============================================================================
# Script rapide de déploiement KUUNI
# Déploie automatiquement sur Vercel en production
# Usage: ./scripts/quick-deploy.sh "message de commit"
# =============================================================================

set -e

cd "$(dirname "$0")/.."

echo "🚀 Déploiement rapide KUUNI"
echo "=========================="

# Message de commit
if [ -z "$1" ]; then
    COMMIT_MSG="Update $(date '+%Y-%m-%d %H:%M')"
else
    COMMIT_MSG="$1"
fi

# Vérifier s'il y a des changements
if [ -n "$(git status --porcelain)" ]; then
    echo "📦 Commit des changements..."
    git add .
    git commit -m "$COMMIT_MSG"
    echo "✓ Commit: $COMMIT_MSG"
fi

# Push
echo "📤 Push vers Git..."
git push origin main 2>/dev/null || git push origin master 2>/dev/null || echo "⚠ Push Git échoué"

# Build test
echo "🔨 Test de build..."
npm run build

# Déploiement Vercel
echo "🌐 Déploiement sur Vercel..."
vercel --prod

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "📝 N'oubliez pas de mettre à jour Supabase si nécessaire:"
echo "   https://app.supabase.com → SQL Editor → supabase-setup.sql"
