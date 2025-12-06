# 🔧 Instruções para Reorganizar Projeto para Lovable

## Problema Atual
O Lovable não consegue encontrar os ficheiros porque estão numa subpasta:
```
/ (root do repo)
└── help-nexus-info-main/     ← Tudo está aqui
    ├── package.json
    ├── src/
    └── ...
```

## Solução

### Opção A: Manual via Windows Explorer (MAIS FÁCIL)

1. **Abrir File Explorer**
   - Navegar para: `C:\Users\marti\Documents\help-nexus-info-main\`

2. **Selecionar TODOS os ficheiros dentro de `help-nexus-info-main/`**
   - Entrar na pasta `help-nexus-info-main\`
   - Pressionar `Ctrl + A` (selecionar tudo)
   - **EXCETO a pasta `.git`** (não mover esta!)

3. **Cortar os ficheiros**
   - Pressionar `Ctrl + X`

4. **Voltar um nível acima**
   - Clicar na seta "voltar" ou pressionar `Alt + ↑`
   - Deve estar em: `C:\Users\marti\Documents\help-nexus-info-main\`

5. **Colar os ficheiros**
   - Pressionar `Ctrl + V`
   - Confirmar sobrescrever se perguntar

6. **Apagar pasta vazia**
   - Apagar a pasta `help-nexus-info-main\` que ficou vazia

---

### Opção B: Via Git Bash (TÉCNICO)

```bash
cd /c/Users/marti/Documents/help-nexus-info-main

# Mover ficheiros principais
for file in help-nexus-info-main/*; do
  if [ "$(basename "$file")" != ".git" ] && [ "$(basename "$file")" != "node_modules" ]; then
    git mv "$file" ./ 2>/dev/null || mv "$file" ./
  fi
done

# Mover ficheiros ocultos (exceto .git)
for file in help-nexus-info-main/.*; do
  if [ "$(basename "$file")" != "." ] && [ "$(basename "$file")" != ".." ] && [ "$(basename "$file")" != ".git" ]; then
    git mv "$file" ./ 2>/dev/null || mv "$file" ./
  fi
done

# Remover pasta vazia
rmdir help-nexus-info-main 2>/dev/null || rm -rf help-nexus-info-main

# Commit
git add -A
git commit -m "refactor: flatten project structure for Lovable compatibility"
git push origin main
```

---

### Opção C: PowerShell Script (AUTOMÁTICO)

Execute este comando no PowerShell (como administrador):

```powershell
cd C:\Users\marti\Documents\help-nexus-info-main

# Mover tudo exceto .git e node_modules
Get-ChildItem "help-nexus-info-main" -Exclude ".git","node_modules" | ForEach-Object {
    Move-Item -Path $_.FullName -Destination "." -Force
}

# Remover pasta vazia
Remove-Item "help-nexus-info-main" -Recurse -Force -ErrorAction SilentlyContinue

# Git commit
git add -A
git commit -m "refactor: flatten project structure for Lovable"
git push origin main
```

---

## Após Reorganizar

### Estrutura Final Esperada:
```
/ (root)
├── .github/
├── .husky/
├── docs/
├── public/
├── scripts/
├── src/
├── components.json
├── index.html
├── package.json
├── PROJECT_OVERVIEW.md
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── ... (outros ficheiros)
```

### Verificar se funcionou:

```bash
cd C:\Users\marti\Documents\help-nexus-info-main
ls package.json    # Deve estar na raiz
ls src/            # Deve estar na raiz
```

### Push para GitHub:

```bash
git push origin main
```

---

## Depois no Lovable

1. **Reconectar o projeto no Lovable**
   - O Lovable vai detectar a nova estrutura automaticamente

2. **Colar o prompt novamente**
   - Copiar o conteúdo de `docs/LOVABLE_LOGIN_PROMPT.md`
   - Colar no chat do Lovable
   - Agora deve funcionar!

---

## Se Algo Correr Mal

**Backup está em:**
- GitHub (versão anterior)
- Branch `main` do commit anterior

**Desfazer:**
```bash
git reset --hard HEAD~1  # Volta ao commit anterior
git push origin main --force  # CUIDADO: só se necessário
```

---

## Porquê Esta Mudança?

O Lovable espera que a estrutura do projeto esteja na **raiz do repositório**. Com a estrutura aninhada atual, ele não consegue:
- Encontrar `package.json`
- Instalar dependências
- Construir o projeto
- Implementar novas features

Após esta reorganização, o Lovable funcionará perfeitamente! 🚀

---

**Última atualização:** 2025-12-02
**Tempo estimado:** 5 minutos (Opção A) | 2 minutos (Opção B/C)
