# Como Atualizar o PROJECT_OVERVIEW.md

## ✅ Implementação Atual

Foram criados **3 sistemas** para atualizar automaticamente o `PROJECT_OVERVIEW.md`:

---

## 🎯 Sistema 1: Script NPM (Recomendado - Mais Simples)

### Comandos

```bash
# Atualização rápida (recomendado)
npm run update-overview

# Atualização completa com testes (mais lento)
npm run update-overview:full
```

### O que atualiza automaticamente:
- ✅ Data `[LAST_UPDATE]`
- ✅ Número de dependências
- ✅ Versão do projeto
- ✅ Branch git atual
- ✅ Contagem de testes (apenas com `--full`)

### Quando usar:
- Depois de adicionar/remover dependências npm
- Depois de completar uma funcionalidade
- Antes de fazer commit importante
- Mensalmente para manter atualizado

---

## ☁️ Sistema 2: GitHub Action (Automático na Cloud)

### Como funciona:
Executa **automaticamente** quando fizer push para o GitHub com mudanças em:
- `package.json`
- `src/components/accessibility/**`
- `src/contexts/**`
- `src/types/accessibility.ts`

### Setup necessário:

**1. Ativar permissões de escrita no GitHub:**
1. Ir para: **Settings** → **Actions** → **General**
2. Em "Workflow permissions" selecionar: **Read and write permissions**
3. Salvar

**2. Ficheiro já criado:**
`.github/workflows/update-overview.yml` ✅

### Uso:
```bash
# Simplesmente fazer push normal
git push origin main

# O GitHub Action executará automaticamente
# Verá um commit do bot: "chore: auto-update PROJECT_OVERVIEW.md"
```

### Acionamento manual:
1. GitHub → **Actions**
2. Workflow: **Update Project Overview**
3. **Run workflow** → Escolher branch → **Run**

---

## 🔧 Sistema 3: Git Hook (Local - Opcional)

**Nota:** Este sistema tem problemas com a estrutura atual do repositório (git está na pasta pai). Use os sistemas 1 ou 2.

~~Ficheiro criado: `.husky/pre-commit`~~
Status: ⚠️ Não funcional na estrutura atual

---

## 📝 Workflow Recomendado

### Desenvolvimento diário:

```bash
# 1. Trabalhar normalmente
# ... editar código ...

# 2. Antes de commit, atualizar overview
npm run update-overview

# 3. Verificar mudanças
git diff PROJECT_OVERVIEW.md

# 4. Commit tudo junto
git add .
git commit -m "feat: minha nova funcionalidade"

# 5. Push (GitHub Action executará também)
git push
```

### Após mudanças importantes:

```bash
# Atualização completa (inclui contagem de testes)
npm run update-overview:full

git add PROJECT_OVERVIEW.md
git commit -m "docs: update project overview"
```

---

## 🎨 O que precisa ser atualizado manualmente

Alguns campos precisam de atualização manual (decisões humanas):

### 1. Project Health
```markdown
[PROJECT_HEALTH]: Green/Yellow/Red
```
- **Green** = Tudo funcionando
- **Yellow** = Problemas menores
- **Red** = Bloqueadores críticos

### 2. Development Status (Seção 7)
```markdown
### ✅ COMPLETED
- [Nova funcionalidade]: Descrição

### 🚧 IN PROGRESS
- [Trabalho atual]: Status atual

### 📋 NEXT PRIORITIES
- [Próximo]: Porquê importante
```

### 3. Known Issues (Seção 7)
```markdown
### KNOWN ISSUES
- [Issue nova]: Descrição e workaround
```

### 4. Decision Rationale Log (Seção 9)
Adicionar novas decisões arquiteturais importantes:
```markdown
**Why [decisão]?**
Explicação do porquê escolhemos esta abordagem
```

---

## 📊 Comparação dos Sistemas

| Funcionalidade | Script NPM | GitHub Action | Git Hook |
|----------------|------------|---------------|----------|
| **Fácil de usar** | ⭐⭐⭐ | ⭐⭐⭐ | ⚠️ |
| **Automático** | ❌ | ✅ | ⚠️ |
| **Atualiza data** | ✅ | ✅ | ❌ |
| **Conta testes** | ✅* | ✅ | ❌ |
| **Funciona offline** | ✅ | ❌ | ⚠️ |
| **Sem configuração** | ✅ | ⚠️** | ❌ |

*Apenas com `--full`
**Requer permissões no GitHub

---

## 🚀 Começar Agora

### Setup inicial (já feito):
- ✅ Scripts criados
- ✅ GitHub Action configurada
- ✅ Documentação completa

### Para usar:
```bash
# Testar agora
npm run update-overview

# Ver o que mudou
git diff PROJECT_OVERVIEW.md
```

---

## 📚 Ficheiros Criados

```
scripts/
  └── update-overview.js              # Script de atualização

.github/workflows/
  └── update-overview.yml             # GitHub Action

.husky/
  └── pre-commit                      # Git hook (não funcional)

docs/
  ├── OVERVIEW_AUTO_UPDATE.md         # Documentação completa
  └── OVERVIEW_UPDATE_SIMPLE.md       # Este ficheiro (resumo)
```

---

## 💡 Dica Rápida

**Use sempre que mudar:**
- package.json (dependências)
- Estrutura de ficheiros em src/
- Funcionalidades de acessibilidade
- Testes

**Comando:**
```bash
npm run update-overview && git add PROJECT_OVERVIEW.md
```

---

## ❓ Problemas Comuns

### Script não funciona
```bash
# Verificar Node.js
node --version  # Deve ser v18+

# Dar permissões (Linux/Mac)
chmod +x scripts/update-overview.js
```

### GitHub Action não executa
1. Verificar permissões: Settings → Actions → Workflow permissions
2. Selecionar: "Read and write permissions"
3. Push novamente

### Mudanças não aparecem
```bash
# Ver ficheiros modificados
git status

# Ver diferenças
git diff PROJECT_OVERVIEW.md
```

---

**Última atualização:** 2025-12-02
**Status:** ✅ Funcional (Script NPM + GitHub Action)
