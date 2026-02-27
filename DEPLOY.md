# Deploy para Vercel

## Opção 1: Deploy Automático com Git (Recomendado)

1. Faz push do código para o GitHub
2. Vai a https://vercel.com
3. Importa o repositório
4. Deploy automático em cada push

## Opção 2: CLI (Clique no script)

### Windows
Clique em: **`deploy-vercel.ps1`**

Se der erro de execução,右-clica e selecciona "Executar com PowerShell"

### Primeiro deploy
Na primeira vez, pode pedir:
```bash
vercel login  # Associate com tua conta
```

## URLs

- **Demo dos novos componentes:** `https://teu-projeto.vercel.app/demo`
- **App principal:** `https://teu-projeto.vercel.app/`

---

## Notas

- O projeto já está configurado para Vercel (ver `vercel.json`)
- Supabase funciona automaticamente com as variáveis de ambiente configuradas
