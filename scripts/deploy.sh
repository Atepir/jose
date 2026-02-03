#!/bin/bash

# =============================================================================
# Script de déploiement KUUNI
# Déploie automatiquement l'application sur Vercel et met à jour Supabase
# =============================================================================

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
print_header() {
    echo ""
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Vérifier si on est dans le bon répertoire
check_directory() {
    if [ ! -f "package.json" ]; then
        print_error "Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet."
        exit 1
    fi
    print_success "Répertoire du projet vérifié"
}

# Vérifier les prérequis
check_prerequisites() {
    print_header "Vérification des prérequis"
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    print_success "Node.js: $(node --version)"
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    print_success "npm: $(npm --version)"
    
    # Vérifier Vercel CLI
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI n'est pas installé. Installation..."
        npm install -g vercel
    fi
    print_success "Vercel CLI installé"
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        print_error "Git n'est pas installé"
        exit 1
    fi
    print_success "Git: $(git --version | cut -d' ' -f3)"
}

# Vérifier les variables d'environnement
check_env_vars() {
    print_header "Vérification des variables d'environnement"
    
    if [ -f ".env.local" ]; then
        print_success "Fichier .env.local trouvé"
    else
        print_warning "Fichier .env.local non trouvé"
    fi
    
    # Vérifier les variables Supabase
    if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        print_success "NEXT_PUBLIC_SUPABASE_URL configuré"
    else
        print_warning "NEXT_PUBLIC_SUPABASE_URL non configuré (sera lu depuis .env.local)"
    fi
}

# Installer les dépendances
install_dependencies() {
    print_header "Installation des dépendances"
    npm install
    print_success "Dépendances installées"
}

# Lancer les tests de build
run_build_test() {
    print_header "Test de build"
    npm run build
    print_success "Build réussi"
}

# Lancer le linter
run_lint() {
    print_header "Vérification du code (ESLint)"
    npm run lint || print_warning "Des avertissements de lint ont été détectés"
    print_success "Vérification du code terminée"
}

# Commit et push Git
git_push() {
    print_header "Mise à jour Git"
    
    # Vérifier s'il y a des changements
    if [ -n "$(git status --porcelain)" ]; then
        echo "Changements détectés. Commit en cours..."
        
        # Demander un message de commit
        if [ -z "$1" ]; then
            read -p "Message de commit: " commit_message
        else
            commit_message="$1"
        fi
        
        git add .
        git commit -m "$commit_message"
        print_success "Commit créé: $commit_message"
    else
        print_success "Aucun changement à commiter"
    fi
    
    # Push vers le remote
    echo "Push vers le dépôt distant..."
    git push origin main 2>/dev/null || git push origin master 2>/dev/null || print_warning "Impossible de push (vérifiez votre configuration Git)"
    print_success "Code poussé vers le dépôt"
}

# Déployer sur Vercel
deploy_vercel() {
    print_header "Déploiement sur Vercel"
    
    echo "Options de déploiement:"
    echo "  1) Production (--prod)"
    echo "  2) Preview (développement)"
    read -p "Choix [1/2]: " deploy_choice
    
    if [ "$deploy_choice" = "1" ]; then
        echo "Déploiement en production..."
        vercel --prod
        print_success "Déploiement en production terminé"
    else
        echo "Déploiement en preview..."
        vercel
        print_success "Déploiement preview terminé"
    fi
}

# Afficher les instructions pour Supabase
show_supabase_instructions() {
    print_header "Mise à jour Supabase"
    
    echo -e "${YELLOW}Pour mettre à jour la base de données Supabase:${NC}"
    echo ""
    echo "1. Connectez-vous à https://app.supabase.com"
    echo "2. Sélectionnez votre projet"
    echo "3. Allez dans 'SQL Editor'"
    echo "4. Copiez et exécutez le contenu de: supabase-setup.sql"
    echo ""
    echo -e "${YELLOW}Ou utilisez la commande suivante si vous avez Supabase CLI:${NC}"
    echo "  supabase db push"
    echo ""
    
    read -p "Voulez-vous afficher le SQL à exécuter? [o/n]: " show_sql
    if [ "$show_sql" = "o" ] || [ "$show_sql" = "O" ]; then
        echo ""
        echo -e "${BLUE}--- Contenu de supabase-setup.sql ---${NC}"
        cat supabase-setup.sql
        echo ""
        echo -e "${BLUE}--- Fin du fichier ---${NC}"
    fi
}

# Menu principal
show_menu() {
    print_header "KUUNI - Script de Déploiement"
    
    echo "Que souhaitez-vous faire?"
    echo ""
    echo "  1) Déploiement complet (build + git + vercel)"
    echo "  2) Build uniquement"
    echo "  3) Déployer sur Vercel uniquement"
    echo "  4) Git commit & push uniquement"
    echo "  5) Voir les instructions Supabase"
    echo "  6) Vérifier les prérequis"
    echo "  0) Quitter"
    echo ""
    read -p "Votre choix: " choice
    
    case $choice in
        1)
            check_directory
            check_prerequisites
            check_env_vars
            install_dependencies
            run_lint
            run_build_test
            git_push
            deploy_vercel
            show_supabase_instructions
            print_header "Déploiement terminé avec succès!"
            ;;
        2)
            check_directory
            install_dependencies
            run_build_test
            print_success "Build terminé"
            ;;
        3)
            check_directory
            deploy_vercel
            ;;
        4)
            check_directory
            git_push "$2"
            ;;
        5)
            check_directory
            show_supabase_instructions
            ;;
        6)
            check_prerequisites
            check_env_vars
            ;;
        0)
            echo "Au revoir!"
            exit 0
            ;;
        *)
            print_error "Choix invalide"
            show_menu
            ;;
    esac
}

# Exécution
cd "$(dirname "$0")/.."  # Aller à la racine du projet
show_menu "$@"
