# 🚀 Guia: Como Fazer Push para o GitHub

Este documento explica como configurar e fazer push deste projeto para o GitHub.

## ⚠️ IMPORTANTE: Antes de Começar

### Ficheiros Sensíveis (NÃO vão para o GitHub)

Os seguintes ficheiros contêm informação sensível e **NÃO devem ser commitados**:

```
.env                           # ❌ Backend config (Supabase, Ollama)
help-nexus-info-main/.env      # ❌ Frontend config (Supabase)
node_modules/                  # ❌ Dependências (são reinstaladas)
dist/                          # ❌ Build output (é recriado)
logs/                          # ❌ Logs do servidor
```

### Ficheiros que VAI para o GitHub

```
.env.example                   # ✅ Template para configuração
README.md                      # ✅ Documentação
proxy/                         # ✅ Código do servidor
docker/                        # ✅ Dockerfiles
docker-compose.yml             # ✅ Docker config
.gitignore                     # ✅ Lista de ficheiros a ignorar
LICENSE                        # ✅ Licença MIT
```

---

## 📝 Passo a Passo

### 1. Verificar que `.gitignore` está correto

```bash
cat .gitignore
```

Confirma que contém:
- `.env`
- `node_modules/`
- `dist/`
- `logs/`
- `help-nexus-info-main/` (pasta duplicada)

### 2. Inicializar Repositório Git Local

```bash
# Na pasta raiz do projeto
cd c:\Users\marti\Documents\help-nexus-info-main

# Inicializar Git
git init

# Configurar nome e email (se ainda não configuraste)
git config user.name "Teu Nome"
git config user.email "teu.email@example.com"
```

### 3. Adicionar Ficheiros ao Staging

```bash
# Adicionar todos os ficheiros (exceto os do .gitignore)
git add .

# Verificar o que vai ser commitado
git status
```

**Verifica que NÃO aparecem**:
- `.env` files
- `node_modules/`
- `dist/`
- `logs/`

**Deve aparecer**:
- `proxy/src/`
- `.env.example`
- `README.md`
- `docker-compose.yml`
- etc.

### 4. Fazer o Primeiro Commit

```bash
git commit -m "Initial commit: Help Nexus Info - Ollama + Orphadata integration

- Backend proxy with Ollama integration
- Disease name extraction (NER)
- Orphadata API integration (28,020 rare diseases)
- Fuzzy search with Levenshtein distance
- SSE streaming for real-time responses
- Multi-language support (EN/PT/ES/FR)
- Docker setup with Ollama
- React frontend with Shadcn UI
"
```

### 5. Criar Repositório no GitHub

1. Vai para https://github.com
2. Clica em **"New repository"** (botão verde)
3. Preenche:
   - **Repository name**: `help-nexus-info` (ou outro nome)
   - **Description**: "Sistema de informação sobre doenças raras com IA (Ollama) + Orphadata"
   - **Visibility**:
     - ✅ **Public** (se quiseres partilhar)
     - ✅ **Private** (se quiseres manter privado)
   - ❌ **NÃO seleciones** "Initialize this repository with a README" (já tens um)
4. Clica em **"Create repository"**

### 6. Conectar Local ao GitHub

Depois de criar o repositório, o GitHub vai mostrar comandos. Usa estes:

```bash
# Adicionar remote (substitui USERNAME e REPO pelo teu)
git remote add origin https://github.com/USERNAME/REPO.git

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push
git push -u origin main
```

**Exemplo**:
```bash
git remote add origin https://github.com/martimsousa/help-nexus-info.git
git branch -M main
git push -u origin main
```

### 7. Autenticar no GitHub

Quando fizeres o primeiro push, o Git vai pedir credenciais:

**Opção A: HTTPS (recomendado)**
- Username: teu username do GitHub
- Password: **Personal Access Token** (NÃO a tua password!)

**Como criar Personal Access Token**:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. Nome: "Help Nexus Local Dev"
4. Selecionar: `repo` (full control of private repositories)
5. "Generate token"
6. **COPIAR O TOKEN** (só aparece uma vez!)
7. Usar esse token como password no git push

**Opção B: SSH**
```bash
# Se preferires SSH
git remote set-url origin git@github.com:USERNAME/REPO.git
```

---

## 🔄 Commits Futuros

Depois do primeiro push, para fazer novos commits:

```bash
# Ver mudanças
git status

# Adicionar ficheiros modificados
git add .

# Fazer commit
git commit -m "feat: conectar frontend ao proxy backend

- Adicionar API URL ao frontend
- Implementar SSE streaming no chatbot
- Testar integração completa
"

# Push para GitHub
git push
```

---

## 📋 Checklist Final

Antes do primeiro push, confirma:

- [ ] `.gitignore` tem `.env` e `node_modules/`
- [ ] Ficheiro `.env` **NÃO** aparece no `git status`
- [ ] `.env.example` **APARECE** no `git status`
- [ ] README.md está atualizado
- [ ] Código está a funcionar localmente
- [ ] Tens Personal Access Token pronto (se usares HTTPS)

---

## 🆘 Troubleshooting

### Erro: "Permission denied (publickey)"
```bash
# Configurar SSH key
ssh-keygen -t ed25519 -C "teu.email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copiar e adicionar em GitHub → Settings → SSH keys
```

### Acidentalmente commitaste `.env`
```bash
# Remover do Git mas manter no disco
git rm --cached .env
git commit -m "chore: remove .env from git"
git push

# Adicionar ao .gitignore se não estiver
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: add .env to gitignore"
git push
```

### Ver histórico de commits
```bash
git log --oneline
```

### Desfazer último commit (mantém mudanças)
```bash
git reset --soft HEAD~1
```

---

## 🎯 Próximos Passos

Depois do push para o GitHub:

1. **Configurar GitHub Actions** (CI/CD opcional)
2. **Adicionar badges** ao README (build status, coverage)
3. **Criar GitHub Pages** para docs (opcional)
4. **Configurar branch protection** (para main branch)

---

## 📞 Ajuda

Se tiveres dúvidas:
- GitHub Docs: https://docs.github.com/en/get-started
- Git Docs: https://git-scm.com/doc
- Stack Overflow: https://stackoverflow.com/questions/tagged/git
