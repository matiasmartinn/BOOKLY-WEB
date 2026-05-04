# BOOKLY WEB

Frontend de BOOKLY, una aplicación web para operar un sistema de turnos multi-tenant desde la perspectiva de owners, secretarios, administradores y clientes finales. Está pensada como interfaz principal del sistema y como contraparte pública del backend de la tesis.

## Descripción breve

BOOKLY WEB consume la API de BOOKLY y materializa los flujos principales del sistema: autenticación, administración del servicio, agenda, disponibilidad, turnos, suscripción, panel administrativo y reserva pública.

## Objetivo del sistema

El objetivo del frontend es ofrecer una experiencia clara y mantenible para operar un negocio basado en turnos, respetando roles, permisos por servicio y distintos contextos de uso: dashboard autenticado, onboarding e interfaz pública de reserva.

## Funcionalidades principales

- Login, registro, confirmación de email, recuperación de cuenta y reseteo de contraseña.
- Onboarding por invitación para secretarios y administradores.
- Dashboard owner con resumen operativo, agenda, historial, métricas y accesos rápidos.
- Gestión del servicio: datos base, slug público, estado, secretarios y configuración general.
- Gestión de turnos: alta, edición, cancelación, reprogramación, asistencia y no-show.
- Configuración de horarios e inhabilitaciones.
- Gestión de suscripción y plan desde la cuenta del owner.
- Perfil y configuración de usuario autenticado.
- Booking público para clientes finales mediante `/book/:slug/:code`.
- Panel administrativo para monitorear owners, servicios, tipos de servicio y métricas globales.

## Pantallas principales

| Área | Pantallas / rutas destacadas |
| --- | --- |
| Autenticación | `/auth/login`, `/auth/register`, `/auth/confirm-email`, `/auth/forgot-password`, `/auth/reset-password` |
| Onboarding | `/auth/admin-invitation`, `/auth/secretary-invitation` |
| Dashboard owner | `/dashboard`, `/dashboard/business`, `/dashboard/appointments`, `/dashboard/schedules`, `/dashboard/unavailability`, `/dashboard/team`, `/dashboard/account` |
| Analítica | `/dashboard/history`, `/dashboard/metrics` |
| Administración | `/dashboard/admin`, `/dashboard/admin/owners`, `/dashboard/admin/services`, `/dashboard/admin/service-types` |
| Reserva pública | `/book/:slug/:code` |

## Stack tecnológico

- React 19
- TypeScript
- Vite
- Mantine UI
- React Router
- TanStack React Query
- React Hook Form + Zod
- Axios
- Zustand
- Recharts

## Arquitectura / estructura del proyecto

La base del frontend está organizada por capas de UI y módulos de negocio:

```text
src/
|- app/      # bootstrap, router, providers, layouts y cliente HTTP
|- features/ # módulos funcionales: auth, business, appointments, schedules, admin, subscriptions, etc.
|- shared/   # componentes reutilizables, layout, DTOs, utils, theme y adaptadores comunes
`- store/    # estado global de autenticación y servicio seleccionado
```

### Organización práctica

- `app/`: concentra el router, los guards, los layouts y la inicialización del cliente de API.
- `features/`: encapsula lógica por dominio de interfaz, incluyendo hooks, servicios, componentes, esquemas y contenedores.
- `shared/`: contiene primitivas reutilizables como `Page`, `PageShell`, `PageCard`, `GenericModal`, `GenericTable`, `FormSection` y utilidades transversales.
- `store/`: usa Zustand para persistir sesión, restaurar autenticación y manejar el servicio activo según el rol.

## Decisiones técnicas destacadas

- Cliente Axios centralizado en `src/app/api/api-client.ts`, con inyección automática de JWT, refresh token ante `401` y normalización de errores `ProblemDetails`.
- Separación explícita entre estado de servidor y estado de UI: React Query para consultas/mutaciones y Zustand para sesión autenticada y contexto de servicio seleccionado.
- Organización por features para mantener juntos componentes, hooks, servicios, schemas, adapters y containers de cada flujo.
- Uso de aliases (`app/*`, `features/*`, `shared/*`, `store/*`) para evitar imports frágiles.
- Formularios con React Hook Form + Zod para validación declarativa y tipada.
- Adaptadores y normalizadores para transformar DTOs del backend a modelos consumibles por la UI, por ejemplo en servicios, suscripciones, inhabilitaciones y turnos.
- Guards de rutas y navegación condicionada por rol (`owner`, `secretary`, `admin`) y por permisos del servicio seleccionado.
- Biblioteca de componentes reutilizables para mantener consistencia visual y acelerar nuevas pantallas.
- Tema centralizado con Mantine y tokens visuales propios para dashboard, modales, formularios y tablas.

## Valor técnico del proyecto

Como proyecto de tesis y portfolio, el frontend aporta valor por su organización modular, el manejo consistente de datos remotos, el modelado de permisos por rol y servicio, y la separación clara entre dashboard interno y experiencia pública de reserva. No es solo una capa visual sobre la API: resuelve autenticación persistente, guards, adapters, formularios complejos y reutilización de UI a escala de producto.

## Configuración local

### Requisitos

- Node.js 20 o superior recomendado
- pnpm
- La API de BOOKLY corriendo localmente

### Variable de entorno

La aplicación necesita la URL base de la API. Se recomienda crear un archivo `.env.local`:

```env
VITE_API_URL=http://localhost:5057/api
```

Si prefieres trabajar contra HTTPS local de la API:

```env
VITE_API_URL=https://localhost:7176/api
```

## Comandos útiles

Desde la raíz de este repositorio:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
```

En desarrollo, Vite levanta la app en `http://localhost:5173`.

## Estado del proyecto

Proyecto de tesis entregado y actualmente en etapa final de evaluación/rendida.

## Autor

Matias Martin
