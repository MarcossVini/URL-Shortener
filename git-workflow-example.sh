#!/bin/bash

# Exemplo de uso do Git com Conventional Commits
# Este script demonstra como fazer commits seguindo as convenções

echo "🚀 Exemplo de Git Workflow com Conventional Commits"
echo ""

echo "1. Verificando status do repositório:"
git status --short

echo ""
echo "2. Adicionando arquivos alterados:"
echo "   git add ."

echo ""
echo "3. Exemplos de commits válidos:"
echo ""
echo "   📦 Nova funcionalidade:"
echo "   git commit -m \"feat(auth): adiciona middleware de autenticação JWT\""
echo ""
echo "   🐛 Correção de bug:"
echo "   git commit -m \"fix(shorten): corrige validação de URL inválida\""
echo ""
echo "   📚 Documentação:"
echo "   git commit -m \"docs(readme): atualiza guia de instalação\""
echo ""
echo "   🎨 Estilo/formatação:"
echo "   git commit -m \"style: aplica formatação prettier em todos os arquivos\""
echo ""
echo "   ♻️ Refatoração:"
echo "   git commit -m \"refactor(user): extrai lógica de validação para service\""
echo ""
echo "   🔧 Configuração:"
echo "   git commit -m \"chore: configura husky e conventional commits\""

echo ""
echo "4. O Husky irá executar automaticamente:"
echo "   - lint-staged (formatação + lint)"
echo "   - testes unitários"
echo "   - validação da mensagem de commit"

echo ""
echo "5. Antes do push, executará:"
echo "   - todos os testes"
echo "   - build da aplicação"
