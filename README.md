# CPC Tracker · Guia de Deploy no Vercel

Tracker de progresso de projeto com painel admin e vista de cliente.  
Dados persistidos via **Vercel KV** (Redis gratuito — até 30 MB, 10.000 req/dia).

---

## 🚀 Deploy em 3 passos

### 1. Sobe o projeto para o GitHub
```bash
git init
git add .
git commit -m "cpc-tracker inicial"
git remote add origin https://github.com/SEU_USUARIO/cpc-tracker.git
git push -u origin main
```

### 2. Liga ao Vercel
1. Acede a [vercel.com](https://vercel.com) → **Add New Project**
2. Importa o repositório GitHub que acabaste de criar
3. Clica **Deploy** (sem alterar nada — o `vercel.json` já configura tudo)

### 3. Cria a base de dados KV (Redis gratuito)
1. No painel do Vercel, vai ao teu projeto → separador **Storage**
2. Clica **Create Database** → escolhe **KV**
3. Dá um nome (ex: `cpc-tracker-kv`) → confirma
4. Clica **Connect to Project** para ligar ao teu projeto
5. As variáveis de ambiente (`KV_URL`, `KV_REST_API_URL`, etc.) são injetadas automaticamente
6. Vai a **Deployments** → **Redeploy** para o servidor ler as novas variáveis

✅ Pronto. O site já persiste dados entre sessões.

---

## 📁 Estrutura
```
cpc-tracker/
├── index.html        ← App completa (HTML + CSS + JS)
├── api/
│   └── data.js       ← Serverless function (GET/POST dados)
├── package.json
├── vercel.json
└── README.md
```

---

## ⚙️ API

| Método | Endpoint    | Descrição              |
|--------|-------------|------------------------|
| GET    | `/api/data` | Devolve todos os dados |
| POST   | `/api/data` | Guarda dados (JSON)    |

**Payload esperado (POST):**
```json
{
  "sections": [
    {
      "id": "abc123",
      "label": "Nome da Categoria",
      "sub": "Descrição curta",
      "icon": "🎓",
      "color": "#1a5c42",
      "progress": 60,
      "notes": "Nota visível ao cliente",
      "updatedAt": "2026-03-13T10:00:00.000Z",
      "tasks": [
        { "id": "t1", "label": "Nome da subcategoria", "s": "done" }
      ]
    }
  ]
}
```

**Status das tarefas:** `todo` | `in_progress` | `done` | `blocked`

---

## 🔒 Proteger o modo admin (opcional)

Para proteger o modo "Editar" com password, adiciona esta variável de ambiente no Vercel:

```
ADMIN_PASSWORD=a_tua_password_aqui
```

E modifica `api/data.js` para verificar um header `x-admin-key` nos POSTs.

---

## 📊 Limites do Vercel KV gratuito

| Recurso        | Limite gratuito |
|----------------|-----------------|
| Armazenamento  | 30 MB           |
| Pedidos/dia    | 10.000          |
| Largura de banda | 1 GB/mês      |

Para um tracker de projeto, 30 MB é mais do que suficiente para anos de uso.
