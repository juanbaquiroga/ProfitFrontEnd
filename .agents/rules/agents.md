# Profit Frontend - Documentación para Agentes de IA

Este archivo contiene el contexto vital del proyecto "Profit", sus reglas, convenciones de diseño y estructura arquitectónica principal. **Cualquier agente de IA que trabaje en este proyecto debe leer esto antes de proponer cambios estructurales o añadir nuevas librerías.**

## 1. Stack Tecnológico Principal

- **Framework Core:** Next.js (App Router) version 15+
- **Librería de UI:** React 19
- **Lenguaje:** TypeScript estricto.
- **Estilos:** Tailwind CSS v4 (Las variables se manejan en `globals.css` a través del sistema base de `@theme inline`, no en un `tailwind.config.ts`).
- **Iconografía:** `lucide-react`.
- **Animaciones:** GSAP.

## 2. Gestión de Estado y Carga de Datos

- **Estado Global (Cliente):** `zustand`. Se utilizan stores separados por dominio (ej. `useCartStore`, `useAppStore`) ubicados en `src/store/`.
- **Fetching y Caché (Servidor a Cliente):** `@tanstack/react-query`. Las integraciones se hacen a través de custom hooks ubicados en `src/hooks/`.
- **Cliente HTTP:** `axios`. Las configuraciones genericas (como inyectores de token) están en `src/lib/axios.ts` y las llamadas se hacen desde `src/services/`.

## 3. Arquitectura de Carpetas (`src/`)

- `app/`: Contiene las rutas usando el sistema de carpetas de Next.js. El layout principal protegido está en `/(main)/*` y las de autenticación separadas en `/(auth)/*`.
- `components/ui/`: Componentes base (Botones, Inputs, Tablas) generados mediante Shadcn UI y manipulables libremente. Se exportan generalmente como UI pura aislada.
- `components/shared/`: Componentes complejos compuestos (*Smart o Dummy*) que mezclan UI base y logica especifica del dominio del negocio (ej. `ProductsTable.tsx`, `SearchBar.tsx`, o componentes del carrito dentro de `cart/`).
- `hooks/`: Custom hooks para el manejo de queries e interactividad (ej. `useProducts.ts`, `useCategorias.ts`).
- `store/`: Manejo de stores globales de Zustand.
- `services/`: Puntos de contacto directos vía de API para abstracción externa.
- `types/`: Archivos `.types.ts` con definiciones estrictas de las entidades. (ej. `product.types.ts`).
- `lib/`: Utilidades genéricas. Destaca `utils.ts` para fusionar clases de Tailwind con clsx (`cn`).

## 4. Convenciones de Estilo (Tailwind v4)

Todo el proyecto utiliza el sistema de variables de CSS centralizadas en `src/styles/globals.css`. Cuando apliques clases, prefiere los tokens definidos en el theme en vez de hardcodear colores:

- En `globals.css` existen tokens cruciales: `--profit` (verde corporativo), `--contrast` (contraste verde), `--primary` (texto fuerte oscuro), `--background` (fondo papel general del layout), `--card` (fondo de tarjetas, generalemente blanco puro).
- En Tailwind esto se llama usando clases normales: `bg-profit`, `text-primary`, `border-border`, `bg-card`, etc.
- No añadas directivas `@apply` salvo que sea estrictamente necesario para crear utilidades que faltan (ej. `no-scrollbar`).

## 5. Componentes Dinámicos Relevantes

- **Cart:** El componente del carrito (`src/components/shared/cart/Cart.tsx`) usa `transition-all` de tailwind para simular aperturas fluidas, ligado globalmente mediante su respectivo `useCartStore`.
- **Tablas:** La tabla de productos se controla nativamente con la abstracción `@tanstack/react-table`, usando los subcomponentes de tabla presentacionales en `components/ui/table.tsx`. Es crucial mantener un contenedor `overflow-hidden` con esquinas redondeadas en componentes donde se quieran fusionar bordes de `<Table>` y Tailwind CSS.

## 6. Reglas Generales de Desarrollo

1. **Uso de `.ts` vs `.tsx`:** La lógica estricta debe ser `.ts`. Sólo lo que retorna JSX debe usar `.tsx`.
2. **Client Components:** Puesto que en el App Router de Next.js las rutas pueden ser *Server Components*, recuerda utilizar `"use client"` como directiva superior en archivos de componentes donde uses directivas de ciclo de vida (`useState`, `useEffect`) o conectes con stores de `zustand`.
3. **Restricciones de Cross-Origin (CORS) en Local:** Si en un momento se usan entornos compartidos, Next.js expone la propiedad `allowedDevOrigins: ["*"]` dentro de `next.config.ts` para evitar alertas al recargar websockects desde redes locales compartidas (ej. 192.168.x.x).
4. **Reutilización de Componentes:** Diseña y construye los componentes de manera modular para que sean lo más reutilizables posibles en diferentes vistas o partes de la aplicación (extrayendo lógica a hooks o stores y manteniendo la UI pura).
5. **Consistencia de Idioma en el Código (Inglés):** Todo el código debe estar en **inglés** sin excepción: nombres de archivos, carpetas, variables, funciones, interfaces, tipos, constantes, props, stores, hooks, servicios y comentarios técnicos. La única excepción es el **contenido visible al usuario final en la interfaz** (textos, labels, mensajes, etc.), que debe estar en español.
6. **Corrección Proactiva de Optimizaciones:** Siempre que se detecte un punto de mejora en el código (rendimiento, legibilidad, reutilización, deuda técnica, accesibilidad, etc.) durante el desarrollo de cualquier tarea, se debe **corregir en el momento** sin esperar a que sea solicitado explícitamente, pero dandole aviso al usuario. No dejar pendientes técnicos innecesarios.
