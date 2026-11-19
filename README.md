# Cursos Bio Front

Frontend base de Cursos Bio con Next.js 16, React 19, TypeScript, Tailwind CSS 4, y Docker multi-stage (standalone).

## Desarrollo
`npm install` y `npm run dev`.

## Docker
`docker compose up -d --build`. Establecer `NEXT_PUBLIC_API_URL` antes del build. Para Portainer con Sources, usa build desde código clonado en el VPS; un stack Git de Portainer puede requerir habilitar su mecanismo de compilación apropiado.
