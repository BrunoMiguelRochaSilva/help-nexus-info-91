# 🚀 Como Iniciar o Help Nexus Info

## Início Rápido (1 Clique)

### ▶️ Iniciar Tudo
Faça duplo-clique em: **`start-all.bat`**

Isto vai abrir 2 janelas:
1. **Website** (Vite) → http://localhost:8080 ou 8081
2. **Chatbot Proxy** → http://localhost:3001

### ⏹️ Parar Tudo
Faça duplo-clique em: **`stop-all.bat`**

---

## Início Manual (Se preferir)

### Terminal 1 - Website:
```bash
cd c:\Users\marti\Documents\help-nexus-info-main
npm run dev
```

### Terminal 2 - Chatbot:
```bash
cd c:\Users\marti\Documents\help-nexus-info-main\proxy
npm start
```

---

## 🎯 O que foi implementado hoje

### ✅ Sistema de Login Anónimo (Mockup)
- Botão "Entrar" na navbar
- Modal com tabs: Login / Criar Conta
- Campos: Username + Password
- Botão mostrar/esconder senha (👁️)
- Menu de utilizador quando logado
- **Bilíngue**: PT/EN automático
- **Acessível**: WCAG 2.1 AA compliant

### 📁 Ficheiros Criados:
- `src/components/auth/LoginDialog.tsx`
- `src/components/auth/LoginButton.tsx`
- `src/components/auth/UserMenu.tsx`
- `src/components/Header.tsx` (modificado)

### 🔧 Scripts Úteis:
- `start-all.bat` - Inicia website + proxy
- `stop-all.bat` - Para todos os servidores

---

## ⚠️ Nota Importante

O login é apenas **mockup visual** (não está ligado a base de dados).
Para implementar autenticação real, consulte: `docs/LOVABLE_LOGIN_PROMPT.md`

---

## 🌐 URLs

- **Website**: http://localhost:8080 ou http://localhost:8081
- **Chatbot Proxy**: http://localhost:3001
- **Base de Dados**: Supabase (cloud)

---

**Última atualização**: 2025-12-02
**Criado por**: Claude Code
