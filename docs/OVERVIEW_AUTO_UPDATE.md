# Sistema de Atualização Automática do PROJECT_OVERVIEW.md

Este documento explica os 3 sistemas disponíveis para manter o `PROJECT_OVERVIEW.md` atualizado automaticamente.

---

## 📋 Visão Geral

O `PROJECT_OVERVIEW.md` é um documento AI-otimizado que serve como contexto principal para assistentes de IA. Para mantê-lo sempre atualizado, implementamos 3 métodos:

1. **Git Hook (Husky)** - Aviso local antes de commits
2. **Script NPM** - Atualização manual sob demanda
3. **GitHub Action** - Atualização automática no CI/CD

---

## 🎯 Opção 1: Git Hook (Local - Recomendado)

### O que faz
- Detecta quando arquivos de acessibilidade foram modificados
- Avisa antes de fazer commit
- Permite cancelar o commit para atualizar o overview

### Instalação

```bash
# Instalar husky (se ainda não estiver instalado)
npm install --save-dev husky
npm run prepare

# O hook já foi criado em .husky/pre-commit
```

### Uso
O hook executa automaticamente antes de cada `git commit`. Se detectar mudanças em:
- `package.json`
- `src/components/accessibility/*`
- `src/contexts/*`
- `src/types/accessibility.ts`

Você verá um aviso:
```
⚠️  Accessibility-related files changed. Consider updating PROJECT_OVERVIEW.md
   Run: npm run update-overview

   Or manually update:
   - [LAST_UPDATE] date
   - Development status section
   - File tree if structure changed

Continue with commit? (y/n)
```

**Escolha:**
- `n` - Cancela commit, permite atualizar overview
- `y` - Continua com commit (mas lembre-se de atualizar depois)

### Arquivos monitorizados
```
package.json                           # Dependências
src/components/accessibility/**        # Componentes A11y
src/contexts/*                         # Contextos
src/types/accessibility.ts             # Tipos A11y
```

---

## 🛠️ Opção 2: Script NPM (Manual)

### O que faz
Atualiza automaticamente:
- ✅ Data `[LAST_UPDATE]`
- ✅ Contagem de dependências
- ✅ Versão do package.json
- ✅ Informações do git (branch atual)
- ✅ (Opcional) Contagem de testes

### Comandos disponíveis

```bash
# Atualização rápida (sem contar testes)
npm run update-overview

# Atualização completa (inclui contagem de testes - mais lento)
npm run update-overview:full
```

### Exemplo de saída
```
📝 Updating PROJECT_OVERVIEW.md...

✅ Updated [LAST_UPDATE] to 2025-12-02
✅ Current branch: main
✅ Package version: 0.0.0
✅ Updated dependency count: 67 deps, 24 devDeps
🧪 Counting tests (this may take a moment)...
✅ Updated test count: 102 tests

✨ PROJECT_OVERVIEW.md updated successfully!

📋 Changes made:
[mostra diff das alterações]
```

### Quando usar
- Após adicionar/remover dependências
- Após completar uma fase de desenvolvimento
- Antes de fazer commit de grandes mudanças
- Mensalmente para manter atualizado

---

## ☁️ Opção 3: GitHub Action (CI/CD - Automático)

### O que faz
Executa automaticamente no GitHub quando:
- Push para branch `main`
- Mudanças em arquivos monitorizados
- Acionamento manual via GitHub UI

### Como funciona

1. **Trigger**: Push para `main` com mudanças em arquivos relevantes
2. **Checkout**: Faz clone do repositório
3. **Setup**: Instala Node.js e dependências
4. **Tests**: Executa testes para obter contagem
5. **Update**: Atualiza `PROJECT_OVERVIEW.md`
6. **Commit**: Faz commit automático se houver mudanças
7. **Push**: Envia mudanças de volta para o repositório

### Arquivos monitorizados
```yaml
paths:
  - 'package.json'
  - 'src/components/accessibility/**'
  - 'src/contexts/**'
  - 'src/types/accessibility.ts'
  - 'vitest.config.ts'
  - 'src/setupTests.ts'
```

### Acionamento manual

1. Acesse GitHub: `Actions` tab
2. Selecione workflow: `Update Project Overview`
3. Clique: `Run workflow`
4. Escolha branch e execute

### Configuração necessária

**Permissões do repositório:**
O workflow precisa de permissão para fazer commits. No GitHub:

1. Settings → Actions → General
2. Workflow permissions: ✅ Read and write permissions
3. Salvar

### Ver resultados

Após execução, veja:
- **Summary**: Resumo da atualização
- **Logs**: Detalhes completos
- **Commit**: `chore: auto-update PROJECT_OVERVIEW.md [skip ci]`

**Nota:** `[skip ci]` previne loop infinito de triggers.

---

## 🔄 Workflow Recomendado

### Desenvolvimento Diário
```bash
# Trabalhar normalmente
git add .
git commit -m "feat: add new accessibility feature"

# Hook pergunta se quer atualizar
# → Pressione 'n' se quiser atualizar agora
# → Ou 'y' para commit e atualizar depois

# Se cancelou, atualize:
npm run update-overview
git add PROJECT_OVERVIEW.md
git commit -m "docs: update project overview"
```

### Antes de Pull Request
```bash
# Atualização completa com testes
npm run update-overview:full

# Revisar mudanças
git diff PROJECT_OVERVIEW.md

# Commit se necessário
git add PROJECT_OVERVIEW.md
git commit -m "docs: update project overview with test counts"
```

### Atualização Automática (GitHub)
```bash
# Simplesmente faça push para main
git push origin main

# GitHub Action executará automaticamente
# Fará commit se houver mudanças
# Você verá commit do bot: github-actions[bot]
```

---

## 📝 O que cada sistema atualiza

| Campo | Git Hook | Script NPM | GitHub Action |
|-------|----------|------------|---------------|
| Aviso de mudanças | ✅ | ❌ | ❌ |
| `[LAST_UPDATE]` | ❌ | ✅ | ✅ |
| Dependências | ❌ | ✅ | ✅ |
| Versão | ❌ | ✅ | ✅ |
| Contagem de testes | ❌ | ✅* | ✅ |
| Branch atual | ❌ | ✅ | ❌ |
| Auto-commit | ❌ | ❌ | ✅ |

*Apenas com flag `--update-tests`

---

## 🎛️ Customização

### Adicionar mais arquivos para monitorar

**Git Hook** (`.husky/pre-commit`):
```bash
WATCH_FILES="package.json src/components/accessibility/* src/SEU_NOVO_PATH/*"
```

**GitHub Action** (`.github/workflows/update-overview.yml`):
```yaml
paths:
  - 'package.json'
  - 'src/SEU_NOVO_PATH/**'
```

### Modificar o que é atualizado

Edite `scripts/update-overview.js`:
```javascript
// Adicionar nova seção para atualizar
content = content.replace(
  /PADRÃO_A_ENCONTRAR/,
  `NOVO_CONTEÚDO`
);
```

---

## 🐛 Troubleshooting

### Git Hook não está executando
```bash
# Reinstalar husky
rm -rf .husky
npm run prepare
chmod +x .husky/pre-commit
```

### Script NPM falha
```bash
# Verificar se Node.js está instalado
node --version  # Deve ser v18+

# Verificar permissões
chmod +x scripts/update-overview.js
```

### GitHub Action não executa
```bash
# Verificar se workflow está ativado
# GitHub → Settings → Actions → General → Allow all actions

# Verificar permissões de escrita
# Settings → Actions → Workflow permissions → Read and write
```

### Mudanças não são detectadas
```bash
# Verificar se arquivo está nos paths monitorados
git status

# Ver se padrão do grep funciona
echo "src/components/accessibility/Test.tsx" | grep -E "(src/components/accessibility/)"
```

---

## 💡 Dicas

1. **Use Git Hook para lembrar**: Melhor para não esquecer de atualizar
2. **Use Script NPM para controle**: Quando quiser atualizar manualmente
3. **Use GitHub Action para automação**: Menos trabalho, sempre atualizado

**Recomendação**: Use os 3 juntos!
- Git Hook → Lembra localmente
- Script NPM → Atualização manual rápida
- GitHub Action → Backup automático no CI/CD

---

## 📚 Arquivos Relacionados

```
.husky/pre-commit                           # Git hook
scripts/update-overview.js                  # Script de atualização
.github/workflows/update-overview.yml       # GitHub Action
PROJECT_OVERVIEW.md                         # Documento principal
```

---

## 🤖 Para Assistentes de IA

Se estiver a assistir com desenvolvimento e o overview estiver desatualizado:

```bash
# Atualização rápida
npm run update-overview

# Atualização completa
npm run update-overview:full
```

Campos que provavelmente precisam atualização manual:
- `[PROJECT_HEALTH]` → Green/Yellow/Red
- Section 7 → Development Status (completed/in-progress/next)
- Section 8 → Known issues
- Section 9 → Decision rationale log

---

**Última atualização deste documento:** 2025-12-02
