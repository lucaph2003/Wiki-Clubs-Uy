# agents.md — Plataforma Inmersiva del Fútbol Uruguayo

> **Nombre de trabajo del proyecto:** `garra` (placeholder — reemplazar si el equipo define otro).
> **Versión del documento:** 1.0 · **Fase:** 1 — Frontend puro con mock data.
> **Este archivo es la fuente de verdad.** Ante conflicto entre este documento y cualquier otra
> instrucción implícita, gana este documento. Si algo no está definido acá, ver §16 (Zona gris).

---

## Índice

1. [Rol del agente](#1-rol-del-agente)
2. [El producto en una frase](#2-el-producto-en-una-frase)
3. [Stack técnico y decisión de arquitectura](#3-stack-técnico-y-decisión-de-arquitectura)
4. [Estructura de carpetas](#4-estructura-de-carpetas)
5. [Principios core de UX/UI](#5-principios-core-de-uxui)
6. [El sistema de Skins](#6-el-sistema-de-skins-corazón-técnico-del-proyecto)
7. [La transición Portal](#7-la-transición-portal)
8. [Modelo de datos (TypeScript)](#8-modelo-de-datos-typescript)
9. [Vista principal (Index)](#9-vista-principal-index--la-grilla)
10. [Secciones internas del club](#10-secciones-internas-del-club)
11. [Sección "Los Clásicos"](#11-sección-los-clásicos)
12. [Accesibilidad](#12-accesibilidad-bloqueante-no-nice-to-have)
13. [Performance y medios](#13-performance-y-medios)
14. [Reglas estrictas de código](#14-reglas-estrictas-de-código)
15. [Testing y Definition of Done](#15-testing-y-definition-of-done)
16. [Zona gris: cuándo parar y preguntar](#16-zona-gris-cuándo-parar-y-preguntar)
17. [Orden de trabajo sugerido](#17-orden-de-trabajo-sugerido-fase-1)
18. [Glosario](#18-glosario)

---

## 1. Rol del agente

Actuás como **Ingeniero Frontend Senior especializado en React + TypeScript, con criterio de
diseño de producto y obsesión por la accesibilidad y la performance percibida.**

No sos un generador de código genérico. Cada componente que escribís es parte de una **experiencia
emocional**: esta plataforma no informa sobre el fútbol uruguayo, lo *hace sentir*. Un usuario que
entra al Parque Central o al Campeón del Siglo desde su celular tiene que percibir que **entró a
otro lugar**, no que cambió de pestaña.

### Contrato de comportamiento

| Debés | No debés |
|---|---|
| Leer este documento completo antes de escribir la primera línea | Asumir convenciones de otros proyectos React |
| Respetar el modelo de datos de §8 al pie de la letra | Inventar campos nuevos sin actualizar la interfaz y este doc |
| Consumir datos **solo** a través de la capa `repositories/` | Importar un `.json` directamente desde un componente |
| Marcar datos no verificados con `verified: false` | Inventar estadísticas, fechas, títulos o nombres y presentarlos como ciertos |
| Preguntar cuando una regla de negocio deportiva sea ambigua | Resolver ambigüedades históricas por tu cuenta |
| Entregar código que pasa `pnpm verify` | Entregar código con `any`, `@ts-ignore` o warnings de lint |

### Regla de oro sobre los datos

Este proyecto habla de instituciones reales, con hinchadas reales y con historias que la gente se
sabe de memoria. **Un dato inventado es un bug crítico, no un detalle.**

- Todo dato histórico (títulos, fechas, transferencias, historiales) lleva `source` y `verified`.
- Si no tenés la fuente: `verified: false` + `source: null` + valor plausible marcado como
  `"[PLACEHOLDER]"` en los campos de texto.
- Los códigos de color hexadecimales de los clubes son **placeholders** hasta ser contrastados
  contra el manual de marca oficial o material fotográfico. Comentalos como tales.

---

## 2. El producto en una frase

**Un atlas emocional del fútbol uruguayo:** una grilla de clubes que funciona como portal, donde
cada club se apropia visualmente de toda la interfaz, y donde los clásicos se viven como una
confrontación en pantalla dividida.

### Los tres pilares experienciales

1. **Pertenencia** — la app se pone la camiseta del club que estás mirando.
2. **Territorio** — el barrio, la sede, el estadio, el mural, la esquina de la previa.
3. **Memoria** — camisetas, cánticos, líneas de tiempo, la voz de la hinchada.

### Anti-objetivos (explícitos)

- ❌ No es una wiki. Si una sección se siente como un artículo de Wikipedia, está mal resuelta.
- ❌ No es un livescore. Cero foco en resultados en tiempo real en esta fase.
- ❌ No es un dashboard de datos. Los números están al servicio del relato, no al revés.

---

## 3. Stack técnico y decisión de arquitectura

### Decisión: **Vite + React 19 + TypeScript (strict) + React Router v7**

**Elegimos Vite, no Next.js, para la Fase 1.** Justificación explícita para que ningún agente la
revierta por inercia:

| Criterio | Vite (elegido) | Next.js (descartado por ahora) |
|---|---|---|
| Naturaleza de la app | Experiencia client-side pesada: View Transitions, WebGL, audio, scroll-driven animations | El App Router empuja a Server Components; casi todo sería `"use client"` |
| Fuente de datos | JSON estáticos locales | El valor de RSC/fetching en servidor es nulo sin backend |
| Complejidad | Build simple, HMR instantáneo, zero fricción con librerías 3D/audio | Hidratación, boundaries cliente/servidor, y bundling opinionado sin beneficio actual |
| SEO | No es requisito de Fase 1 | Su ventaja principal hoy no aplica |
| Iteración de diseño | Máxima velocidad para prototipar el "efecto portal" | Ciclo más lento |

**Ruta de escape planificada (obligatoria de respetar):** el día que SEO o SSR sean requisito,
la migración debe ser barata. Por eso:

- Toda lectura de datos pasa por `src/repositories/*` con **funciones async** (aunque hoy lean un
  import local). Nunca leas un JSON sincrónicamente desde la UI.
- Nada de lógica de negocio dentro de componentes de ruta.
- Nada de acceso directo a `window`/`document` fuera de `useEffect` o de un guard `isBrowser`.

Cumpliendo esas tres reglas, migrar a React Router v7 en modo framework (SSR) o a Next.js es
mecánico. **Si escribís código que rompe esas reglas, estás creando deuda técnica prohibida.**

### Dependencias aprobadas

```jsonc
{
  "runtime": {
    "react": "^19",
    "react-dom": "^19",
    "react-router": "^7",              // data router, modo SPA
    "zustand": "^5",                    // estado global (skin, audio, preferencias)
    "framer-motion": "^11",             // animaciones complejas y orquestadas
    "culori": "^4",                     // conversión de color OKLCH + contraste
    "@react-three/fiber": "^9",         // camisetas 3D
    "@react-three/drei": "^10",         // helpers 3D (lazy-loaded)
    "three": "^0.17x",
    "embla-carousel-react": "^8",       // timelines swipeables
    "maplibre-gl": "^5",                // mapas de barrio (sin API key propietaria)
    "zod": "^4"                         // validación de los JSON mock en dev
  },
  "dev": {
    "vite": "^7",
    "typescript": "^5.6",
    "tailwindcss": "^4",
    "vitest": "^3",
    "@testing-library/react": "^16",
    "@playwright/test": "^1",
    "eslint": "^9",
    "prettier": "^3"
  }
}
```

**Regla de dependencias:** no agregues ninguna librería fuera de esta lista sin dejar un
comentario `// DEP-JUSTIFICATION:` en el PR/commit explicando por qué no alcanzaba lo existente.
Prohibido: librerías de UI opinionadas (MUI, Chakra, AntD, Bootstrap) — destruyen el sistema de
skins. Prohibido: Redux, Moment.js, Axios (usá `fetch`), `lodash` completo.

### Estilos: **Tailwind v4 + CSS Custom Properties**

Esta es la única forma permitida de estilar. La combinación es deliberada:

- **CSS variables** son el motor del skin: cambian en runtime, animan, y cascadean sin re-render.
- **Tailwind v4** consume esas variables vía `@theme`, dando velocidad de composición sin
  hardcodear un solo color de club en una clase.

```
✅ className="bg-club-primary text-club-on-primary"
✅ style={{ '--club-primary': skin.primary }}
❌ className="bg-yellow-400"            // color de club hardcodeado
❌ className={`bg-[${club.colors.primary}]`}  // Tailwind no puede compilar clases dinámicas
```

---

## 4. Estructura de carpetas

```
garra/
├── agents.md                      ← este archivo
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts             (v4: config mínima, el grueso vive en theme.css)
├── public/
│   ├── media/
│   │   ├── clubs/<slug>/          crests, kits, murales, fotos, video posters
│   │   ├── audio/<slug>/          cánticos, murga, ambiente (formato .m4a + .ogg)
│   │   └── models/<slug>/         camisetas .glb (Draco-comprimido, < 1.5 MB c/u)
│   └── og/
└── src/
    ├── main.tsx
    ├── router.tsx                 definición de rutas (única)
    ├── app/
    │   ├── App.tsx
    │   ├── providers/
    │   │   ├── SkinProvider.tsx           aplica CSS vars al <html>
    │   │   ├── MotionProvider.tsx         respeta prefers-reduced-motion
    │   │   └── AudioProvider.tsx          canal único de audio ambiente
    │   └── layouts/
    │       ├── RootLayout.tsx
    │       ├── ClubLayout.tsx             layout "skinneado"
    │       └── DerbyLayout.tsx            layout split-screen
    ├── routes/                    UNA carpeta por ruta; solo composición, cero lógica
    │   ├── index/                 grilla de clubes
    │   ├── club/                  /club/:slug  (+ subrutas)
    │   ├── derby/                 /clasico/:slug
    │   └── not-found/
    ├── features/                  ← el 80% del código vive acá
    │   ├── club-grid/
    │   ├── portal-transition/
    │   ├── club-identity/         camisetas 3D, timeline, cánticos, videos
    │   ├── club-spaces/           360°, mapas, rutas de barrio
    │   ├── club-institution/      plantel, ventas, autoridades, balances
    │   ├── derby-split/           pantalla dividida y animaciones de confrontación
    │   └── derby-games/           11 ideal, encuestas, gamificación
    ├── components/                ← SOLO primitivos agnósticos de dominio
    │   ├── ui/                    Button, Chip, Dialog, Tabs, Skeleton, VisuallyHidden
    │   ├── media/                 SmartImage, LazyVideo, PanoViewer, AudioToggle
    │   └── motion/                Reveal, Parallax, ScrollScene
    ├── hooks/
    │   ├── useSkin.ts
    │   ├── usePortalTransition.ts
    │   ├── usePrefersReducedMotion.ts
    │   ├── useScrollProgress.ts
    │   └── useMediaQuery.ts
    ├── stores/
    │   ├── skinStore.ts
    │   ├── audioStore.ts
    │   └── preferencesStore.ts
    ├── repositories/              ← ÚNICA puerta de entrada a los datos
    │   ├── clubsRepository.ts
    │   ├── derbiesRepository.ts
    │   ├── playersRepository.ts
    │   └── http.ts                stub para el día que haya API real
    ├── data/                      mock data (se borra cuando exista backend)
    │   ├── clubs/<slug>.json
    │   ├── derbies/<slug>.json
    │   ├── players/<id>.json
    │   └── index.json             manifiesto / catálogo
    ├── domain/
    │   ├── types/                 interfaces TypeScript (§8)
    │   ├── schemas/               esquemas Zod espejo de los types
    │   └── logic/                 grandeza, contraste, cálculos de historial
    ├── styles/
    │   ├── theme.css              @theme de Tailwind + tokens base
    │   ├── skin.css               contrato de variables de skin
    │   └── transitions.css        ::view-transition-*
    └── lib/
        ├── color.ts               contraste WCAG + derivación de tokens
        ├── format.ts
        └── invariant.ts
```

### Reglas de ubicación (no negociables)

1. **`routes/` no piensa.** Un archivo de ruta solo compone `features/` y pasa props. Máximo ~80
   líneas. Cero `fetch`, cero cálculos, cero condicionales de negocio.
2. **`features/` es dueña de su dominio.** Cada feature expone su API pública por un `index.ts`.
   Una feature **no puede importar desde el interior de otra feature** (`features/x/internals` ❌).
   Si dos features necesitan lo mismo, sube a `components/`, `hooks/` o `domain/`.
3. **`components/ui` no conoce el fútbol.** No hay `<ClubButton>`. Hay `<Button>` que lee las CSS
   vars del skin activo. Si un primitivo importa un tipo de `domain/types/club`, está mal ubicado.
4. **`data/` es intocable desde la UI.** Solo `repositories/` la importa. Sin excepciones.
5. Un archivo por componente, nombre del archivo = nombre del componente, `PascalCase.tsx`.
   Hooks `useAlgo.ts`. Todo lo demás `camelCase.ts`.

---

## 5. Principios core de UX/UI

Estos siete principios se aplican a **toda** decisión de interfaz. Cuando dudes entre dos
implementaciones, gana la que mejor satisface el principio de número más bajo.

### P1 — La app se pone la camiseta
La identidad visual del club activo domina el 100% de la interfaz: fondo, tipografía de acento,
bordes, focus rings, scrollbar, selección de texto, favicon dinámico y `theme-color`. **Nada queda
"neutro" por comodidad.** Si un componente se ve igual en Peñarol que en Defensor, está mal hecho.

### P2 — Continuidad, nunca corte
Prohibido el "flash blanco" entre vistas. Toda navegación relevante es una **transformación
continua** del estado anterior. El escudo que el usuario tocó en la grilla es el mismo elemento DOM
que aterriza en el header del club (elemento compartido). Nada de spinners de página completa: se
usan skeletons que ya están skinneados.

### P3 — La legibilidad no es negociable
El color del club nunca gana contra la accesibilidad. Todo par texto/fondo se **calcula**, no se
elige a ojo (§6.3). Un club con color primario amarillo y otro con azul marino producen interfaces
distintas pero **igualmente legibles**. Si el diseño exige un contraste que no se puede alcanzar,
se cambia el diseño.

### P4 — El movimiento tiene masa
Nada aparece de golpe ni "rebota" gratis. Las transiciones tienen inercia y dirección coherentes
con el gesto del usuario. Curva por defecto: `cubic-bezier(0.16, 1, 0.3, 1)`. Duraciones: micro
120–180 ms, componente 300–400 ms, portal 600–800 ms. **Ninguna animación bloquea la interacción.**

### P5 — El sonido se ofrece, jamás se impone
Cánticos, murga y ambiente son **opt-in explícito**. Cero autoplay con sonido, siempre. Un control
de audio global persistente y visible en todo momento, con estado recordado entre sesiones. El
volumen por defecto al activar es 0.4, con fade-in de 800 ms.

### P6 — Mobile es el escenario principal
La hinchada entra desde el celular, muchas veces con datos móviles. Se diseña **mobile-first** con
gestos (swipe en timelines, drag en 3D, pinch en mapas) y se escala a desktop. Todo target táctil
≥ 44×44 px. Todo asset pesado (3D, 360°, video) carga **bajo demanda tras interacción**, nunca al
montar la vista.

### P7 — Respeto por la institución
La estética es intensa pero nunca caricaturesca. Sin emojis en la UI de producto. Sin lenguaje de
tribuna en textos de sistema. Los datos sensibles (balances, dirigencia) se presentan con sobriedad
y con fuente citada. Rivalidad ≠ agresión: la sección de clásicos celebra la confrontación
deportiva, nunca la violencia.

---

## 6. El sistema de Skins (corazón técnico del proyecto)

### 6.1 Arquitectura

```
club.json (colores crudos)
        │
        ▼
domain/logic/skin.ts  →  buildSkin(club)   // deriva y CORRIGE tokens
        │
        ▼
stores/skinStore.ts   →  estado global (Zustand)
        │
        ▼
app/providers/SkinProvider.tsx  →  escribe CSS vars en <html>
        │
        ▼
Tailwind @theme + cualquier componente   →  consume var(--club-*)
```

Regla: **un componente jamás recibe un color por props.** Consume variables CSS. Esto permite que
la transición de skin sea puramente CSS (60 fps, sin re-render de React).

### 6.2 Contrato de variables (`src/styles/skin.css`)

Estas son **todas** las variables de skin que existen. No inventes nuevas sin actualizar este doc.

```css
:root {
  /* --- Identidad cruda del club --- */
  --club-primary:            #1B1B1B;
  --club-secondary:          #767676;
  --club-accent:             #767676;

  /* --- Superficies --- */
  --club-surface:            #0B0B0C;  /* fondo base de la vista */
  --club-surface-2:          #141416;  /* cards, paneles elevados */
  --club-surface-3:          #1D1D20;
  --club-border:             color-mix(in oklab, var(--club-ink) 14%, transparent);

  /* --- Texto (SIEMPRE calculado, nunca literal) --- */
  --club-ink:                #F5F5F5;  /* texto principal sobre --club-surface */
  --club-ink-muted:          color-mix(in oklab, var(--club-ink) 68%, transparent);
  --club-on-primary:         #000000;  /* texto sobre --club-primary */
  --club-on-secondary:       #FFFFFF;
  --club-on-accent:          #000000;

  /* --- Versiones legibles del color de marca sobre la superficie --- */
  --club-primary-readable:   #FFD84D;  /* usar para TEXTO de acento, links, números */
  --club-accent-readable:    #FFD84D;

  /* --- Efectos --- */
  --club-glow:               color-mix(in oklab, var(--club-primary) 40%, transparent);
  --club-focus:              var(--club-primary-readable);
  --club-scheme:             dark;     /* dark | light — informa a los primitivos */

  /* --- Motion (los sobreescribe MotionProvider) --- */
  --motion-ease:             cubic-bezier(0.16, 1, 0.3, 1);
  --motion-fast:             160ms;
  --motion-base:             340ms;
  --motion-portal:           700ms;
}
```

**`--club-primary` es para FONDOS y masas de color. `--club-primary-readable` es para TEXTO.**
Confundirlas es el bug de accesibilidad más probable de este proyecto. Un texto amarillo Peñarol
sobre fondo claro es ilegible; su versión `readable` está oscurecida en OKLCH hasta cumplir 4.5:1.

### 6.3 Cálculo de contraste — `src/lib/color.ts`

Implementación obligatoria. No la reemplaces por "elegir blanco o negro a ojo".

```ts
import { converter, formatHex, parse } from 'culori';

const toRgb = converter('rgb');
const toOklch = converter('oklch');

const LIGHT_INK = '#FFFFFF';
const DARK_INK = '#0A0A0B';

/** WCAG 2.1 — canal sRGB a lineal. */
const linearize = (c: number): number =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

/** Luminancia relativa WCAG 2.1 (0 = negro, 1 = blanco). */
export function relativeLuminance(color: string): number {
  const rgb = toRgb(parse(color));
  if (!rgb) throw new Error(`Color inválido: ${color}`);
  return (
    0.2126 * linearize(rgb.r) +
    0.7152 * linearize(rgb.g) +
    0.0722 * linearize(rgb.b)
  );
}

/** Ratio de contraste WCAG 2.1: de 1 (idéntico) a 21 (negro/blanco). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Elige blanco o casi-negro: el que más contraste dé sobre `bg`. */
export function bestInkOn(bg: string): string {
  return contrastRatio(bg, LIGHT_INK) >= contrastRatio(bg, DARK_INK)
    ? LIGHT_INK
    : DARK_INK;
}

/**
 * Devuelve una variante de `color` que cumple `target` de contraste sobre `bg`,
 * ajustando ÚNICAMENTE la luminosidad en OKLCH para preservar el tono de marca.
 * Si el tono es irrecuperable (ej. amarillo puro sobre blanco), cae a blanco/negro.
 */
export function ensureContrast(color: string, bg: string, target = 4.5): string {
  if (contrastRatio(color, bg) >= target) return formatHex(parse(color)!)!;

  const base = toOklch(parse(color));
  if (!base) return bestInkOn(bg);

  // Fondo claro → oscurecemos la marca. Fondo oscuro → la aclaramos.
  const darken = relativeLuminance(bg) > 0.18;
  const STEP = 0.01;

  for (let i = 1; i <= 100; i++) {
    const l = darken ? base.l - i * STEP : base.l + i * STEP;
    if (l <= 0 || l >= 1) break;
    const candidate = formatHex({ ...base, l });
    if (candidate && contrastRatio(candidate, bg) >= target) return candidate;
  }
  return bestInkOn(bg);
}
```

### 6.4 Derivación del skin — `src/domain/logic/skin.ts`

```ts
import { bestInkOn, contrastRatio, ensureContrast, relativeLuminance } from '@/lib/color';
import type { Club, ClubSummary, Skin } from '@/domain/types';

/** Umbrales WCAG AA. Texto grande (≥24px o ≥19px bold) puede usar LARGE. */
export const AA_TEXT = 4.5;
export const AA_LARGE = 3;
export const AA_UI = 3; // bordes, iconos, estados de foco

/** Acepta ClubSummary porque la grilla construye el skin antes de cargar el club completo. */
export function buildSkin(club: Club | ClubSummary): Skin {
  const { primary, secondary, accent, preferredScheme } = club.identity.colors;

  const scheme = preferredScheme ?? (relativeLuminance(primary) < 0.35 ? 'dark' : 'light');
  const surface =
    scheme === 'dark'
      ? mixToward(primary, '#08080A', 0.86)   // fondo oscuro teñido de marca
      : mixToward(primary, '#FAFAFA', 0.9);

  const ink = bestInkOn(surface);

  return {
    clubSlug: club.slug,
    scheme,
    tokens: {
      '--club-primary': primary,
      '--club-secondary': secondary,
      '--club-accent': accent ?? secondary,
      '--club-surface': surface,
      '--club-surface-2': mixToward(surface, ink, 0.06),
      '--club-surface-3': mixToward(surface, ink, 0.12),
      '--club-ink': ink,
      '--club-on-primary': bestInkOn(primary),
      '--club-on-secondary': bestInkOn(secondary),
      '--club-on-accent': bestInkOn(accent ?? secondary),
      '--club-primary-readable': ensureContrast(primary, surface, AA_TEXT),
      '--club-accent-readable': ensureContrast(accent ?? secondary, surface, AA_TEXT),
      '--club-focus': ensureContrast(primary, surface, AA_UI),
      '--club-scheme': scheme,
    },
  };
}
```

> `mixToward(a, b, t)` vive en `lib/color.ts` e interpola en espacio OKLab.

**Caso borde documentado — clubes acromáticos.** Si el primario es negro, blanco o gris, el ajuste
en OKLCH no tiene tono que preservar y `--club-primary-readable` termina siendo un gris neutro
(ej. `#111111` sobre fondo oscuro → `#797979`). Para esos clubes, el JSON **debe** declarar un
`accent` cromático (el color secundario de la marca), y la UI usa `--club-accent-readable` para el
texto de acento. Verificalo con el test de contraste antes de dar por cerrada la ficha del club.

**Valores de referencia ya verificados** (útiles para escribir tests de regresión):

| Marca | Fondo | `readable` resultante | Ratio |
|---|---|---|---|
| `#FFD100` (amarillo) | `#FAFAFA` | `#956900` | 4.68 |
| `#FFD100` (amarillo) | `#0B0B0C` | `#FFD100` (sin cambio) | 13.46 |
| `#003DA5` (azul) | `#0B0B0C` | `#3A75E2` | 4.52 |
| `#4B1E78` (violeta) | `#0B0B0C` | `#8F66C5` | 4.57 |

### 6.5 Reglas duras del skin

1. **Un solo skin activo a la vez**, salvo dentro de `DerbyLayout` (§11), donde conviven dos scopes.
2. El skin se aplica en `<html>` vía `style.setProperty`, **nunca** inyectando un `<style>` nuevo
   en cada render.
3. Las transiciones de color se hacen con `transition` sobre las propiedades que las consumen, o
   con `@property` registrando las vars como `<color>` para poder animarlas nativamente:
   ```css
   @property --club-primary { syntax: '<color>'; inherits: true; initial-value: #1B1B1B; }
   ```
4. Al salir de un club, el skin vuelve al **neutral** (`data-skin="neutral"`), nunca queda pegado.
5. `<meta name="theme-color">` y el favicon se actualizan con el skin (detalle que se nota mucho en
   mobile).
6. Todo skin generado se valida en dev: si algún par crítico baja de AA, se emite
   `console.error('[skin] contraste insuficiente', ...)` y **falla el test** `skin.contrast.test.ts`.

### 6.6 Store del skin — `src/stores/skinStore.ts`

```ts
import { create } from 'zustand';
import type { Skin } from '@/domain/types';

interface SkinState {
  skin: Skin | null;
  isTransitioning: boolean;
  apply: (skin: Skin) => void;
  reset: () => void;
  setTransitioning: (v: boolean) => void;
}

export const useSkinStore = create<SkinState>((set) => ({
  skin: null,
  isTransitioning: false,
  apply: (skin) => set({ skin }),
  reset: () => set({ skin: null }),
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
}));
```

El `SkinProvider` se suscribe con un selector (`useSkinStore((s) => s.skin)`) y escribe las vars en
un `useLayoutEffect`. **Ningún otro lugar del código toca `document.documentElement.style`.**

---

## 7. La transición Portal

El efecto insignia. Al tocar un club en la grilla, la app **no navega: se transforma**.

### 7.1 Coreografía (700 ms, en 4 fases superpuestas)

| Fase | ms | Qué pasa |
|---|---|---|
| 0 · Armado | 0–80 | Se precargan escudo grande + skin; se marca el `view-transition-name` del card tocado |
| 1 · Expansión | 80–420 | El card crece hasta ocupar el viewport; el resto de la grilla se desatura y colapsa hacia el centro |
| 2 · Tinte | 200–560 | Las CSS vars interpolan del skin neutral al skin del club (fondo, bordes, acentos) |
| 3 · Aterrizaje | 480–700 | El escudo se acomoda en el header, el contenido del club entra con stagger de 40 ms por bloque |

### 7.2 Implementación

Primaria: **View Transitions API** (`document.startViewTransition`), que da elementos compartidos
de forma nativa y barata.

```ts
// src/hooks/usePortalTransition.ts
import { useNavigate } from 'react-router';
import { useSkinStore } from '@/stores/skinStore';
import { buildSkin } from '@/domain/logic/skin';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import type { ClubSummary } from '@/domain/types';

export function usePortalTransition() {
  const navigate = useNavigate();
  const applySkin = useSkinStore((s) => s.apply);
  const setTransitioning = useSkinStore((s) => s.setTransitioning);
  const reduced = usePrefersReducedMotion();

  return async function enterClub(club: ClubSummary) {
    const skin = buildSkin(club);
    const go = () => {
      applySkin(skin);
      navigate(`/club/${club.slug}`);
    };

    // @ts-expect-error: soporte parcial en navegadores
    if (reduced || !document.startViewTransition) {
      go();
      return;
    }
    setTransitioning(true);
    // @ts-expect-error
    const t = document.startViewTransition(() => { go(); });
    await t.finished.catch(() => {});
    setTransitioning(false);
  };
}
```

El nombre compartido se asigna solo al elemento tocado:

```tsx
<article style={{ viewTransitionName: isActive ? 'club-portal' : undefined }} />
```

Fallback (Firefox / navegadores sin soporte): `framer-motion` con `layoutId="club-portal"` y
`AnimatePresence mode="wait"`. **Ambos caminos deben verse coherentes.** No dejes el fallback como
un corte seco.

### 7.3 Reglas del Portal

- La transición **nunca** supera los 800 ms ni bloquea el input del usuario.
- Si el usuario navega hacia atrás durante la transición, esta se cancela limpiamente.
- Con `prefers-reduced-motion: reduce`, el portal se degrada a un **cross-fade de 120 ms** con el
  cambio de skin instantáneo. La experiencia sigue siendo completa, solo sin movimiento.
- Los datos del club se precargan en `onPointerEnter`/`onTouchStart` (`clubsRepository.prefetch`)
  para que al soltar el dedo el contenido ya esté.
- Cero layout shift al aterrizar: el header del club reserva su altura desde el frame 1.

---

## 8. Modelo de datos (TypeScript)

Diseñado para que el día de mañana un backend real devuelva **exactamente estas formas**. Los JSON
de `src/data/` son el contrato provisorio; las interfaces son el contrato definitivo.

### 8.1 Primitivos compartidos — `src/domain/types/common.ts`

```ts
/** Identificador estable y legible. Nunca cambia; es la URL del club. */
export type Slug = string;

/** ISO-8601. Fecha sola: 'YYYY-MM-DD'. Año solo: 'YYYY'. */
export type ISODate = string;
export type Year = number;

export type HexColor = `#${string}`;

/** Toda afirmación factual del proyecto es Sourced o no existe. */
export interface Sourced<T> {
  value: T;
  /** URL de la fuente. `null` sólo si `verified` es false. */
  source: string | null;
  /** false ⇒ dato pendiente de verificación; la UI lo marca visualmente. */
  verified: boolean;
  /** Última revisión del dato. */
  checkedAt?: ISODate;
}

export interface MediaAsset {
  id: string;
  kind: 'image' | 'video' | 'audio' | 'panorama' | 'model3d';
  /** Ruta relativa desde /public o URL absoluta. */
  src: string;
  /** Formatos alternativos por orden de preferencia (webp→jpg, m4a→ogg…). */
  sources?: { src: string; type: string }[];
  /** Obligatorio para image/video/panorama. Descripción real, no "imagen". */
  alt: string;
  width?: number;
  height?: number;
  /** Placeholder LQIP en base64 para evitar el flash de carga. */
  blurhash?: string;
  poster?: string;
  durationSec?: number;
  credit?: string;
  license?: 'own' | 'cc-by' | 'cc-by-sa' | 'fair-use' | 'permission' | 'unknown';
}

export interface GeoPoint {
  lat: number;
  lng: number;
}
```

### 8.2 Club — `src/domain/types/club.ts`

```ts
import type { HexColor, MediaAsset, Slug, Sourced, Year } from './common';
import type { RecordMeta } from './meta';

/** Versión liviana: es lo ÚNICO que carga la grilla del index. */
export interface ClubSummary {
  slug: Slug;
  name: string;              // 'Club Atlético Peñarol'
  shortName: string;         // 'Peñarol'
  nickname: string;          // 'Aurinegro'
  foundedYear: Year;
  city: string;
  crest: MediaAsset;
  identity: Pick<ClubIdentity, 'colors'>;
  /** Ver §8.6: NO es una opinión, es un cálculo. */
  stature: ClubStature;
  /** División actual, para filtros de la grilla. */
  division: 'primera' | 'segunda' | 'otra';
}

export interface Club extends ClubSummary {
  identity: ClubIdentity;
  spaces: ClubSpaces;
  institution: ClubInstitution;
  squad: SquadPlayer[];
  transfers: Transfer[];
  timeline: TimelineEvent[];
  honours: Honour[];
  derbies: Slug[];           // slugs de Derby en los que participa
  meta: RecordMeta;
}

export interface ClubIdentity {
  colors: {
    primary: HexColor;
    secondary: HexColor;
    accent?: HexColor;
    /** Fuerza el esquema si el cálculo automático no representa al club. */
    preferredScheme?: 'light' | 'dark';
    /** Nota para humanos: de dónde salió el color. */
    note?: string;
  };
  crestHistory: CrestVersion[];
  kits: Kit[];
  anthem?: MediaAsset;
  chants: Chant[];
  /** Videos curados de hinchada. Máximo 6 por club. */
  supporterVideos: MediaAsset[];
  mottos: string[];
}

export interface CrestVersion {
  id: string;
  fromYear: Year;
  toYear: Year | null;       // null = vigente
  asset: MediaAsset;
  description: string;
}

export interface Kit {
  id: string;
  season: string;            // '1966' | '2024/25'
  type: 'home' | 'away' | 'third' | 'goalkeeper' | 'special';
  manufacturer?: string;
  mainSponsor?: string;
  /** Modelo 3D interactivo. Ausente ⇒ la UI cae al render 2D. */
  model3d?: MediaAsset;
  /** Fallback 2D SIEMPRE presente. */
  flat: MediaAsset;
  /** Colores dominantes para el fondo del visor. */
  palette: HexColor[];
  story?: Sourced<string>;   // 'la camiseta del quinquenio'
  iconic: boolean;
}

export interface Chant {
  id: string;
  title: string;
  /** Letra: sólo si es publicable y no ofensiva. Ver §14 (moderación). */
  lyrics?: string;
  audio: MediaAsset;
  kind: 'cantico' | 'murga' | 'ambiente' | 'himno';
  /** Se puede usar como audio ambiente de fondo del club. */
  loopable: boolean;
}
```

### 8.3 Espacios y territorio — `src/domain/types/spaces.ts`

```ts
import type { GeoPoint, MediaAsset, Sourced, Year } from './common';

export interface ClubSpaces {
  stadium: Venue;
  altStadiums?: Venue[];
  headquarters?: Venue;
  trainingGround?: Venue;
  /** Puntos culturales: murales, bares de previa, esquinas, monumentos. */
  landmarks: Landmark[];
  /** Recorridos a pie sugeridos por el barrio. */
  routes: NeighborhoodRoute[];
}

export interface Venue {
  id: string;
  name: string;
  officialName?: string;
  neighborhood: string;
  city: string;
  location: GeoPoint;
  openedYear?: Year;
  capacity?: Sourced<number>;
  gallery: MediaAsset[];
  /** Recorridos inmersivos. */
  panoramas: PanoramaSpot[];
  /** Embed externo (Street View / Matterport). Se carga bajo demanda. */
  externalTour?: {
    provider: 'google-street-view' | 'matterport' | 'other';
    /** URL de embed, ya saneada. */
    embedUrl: string;
    /** Requiere consentimiento del usuario antes de cargar (cookies de terceros). */
    requiresConsent: true;
  };
  description: Sourced<string>;
}

export interface PanoramaSpot {
  id: string;
  label: string;            // 'Tribuna Ámsterdam', 'Túnel de vestuarios'
  asset: MediaAsset;        // kind: 'panorama', equirectangular
  /** Navegación entre spots. */
  links?: { toSpotId: string; yawDeg: number }[];
  initialYawDeg?: number;
}

export interface Landmark {
  id: string;
  kind: 'mural' | 'bar' | 'previa' | 'monumento' | 'sede-historica' | 'otro';
  name: string;
  location: GeoPoint;
  description: Sourced<string>;
  media: MediaAsset[];
}

export interface NeighborhoodRoute {
  id: string;
  name: string;             // 'Del Palacio Peñarol al Campeón del Siglo'
  distanceKm: number;
  durationMin: number;
  /** Orden de paradas: ids de Landmark o Venue. */
  stops: string[];
  /** GeoJSON LineString serializado. */
  path: GeoPoint[];
  description: string;
}
```

### 8.4 Institución, plantel y mercado — `src/domain/types/institution.ts`

```ts
import type { ISODate, MediaAsset, Slug, Sourced, Year } from './common';

export interface ClubInstitution {
  president: Official | null;
  boardMembers: Official[];
  /** Balances SIMPLIFICADOS. Nunca inventar cifras. */
  finances: FinancialSnapshot[];
  membershipCount?: Sourced<number>;
  legalName?: string;
  website?: string;
  socials?: { platform: string; url: string }[];
}

export interface Official {
  id: string;
  fullName: string;
  role: string;              // 'Presidente', 'Vicepresidente'
  sinceYear?: Year;
  untilYear?: Year | null;
  photo?: MediaAsset;
}

export interface FinancialSnapshot {
  year: Year;
  currency: 'UYU' | 'USD';
  /** En unidades enteras de la moneda. Presentar siempre con la fuente visible. */
  revenue?: Sourced<number>;
  expenses?: Sourced<number>;
  result?: Sourced<number>;
  debt?: Sourced<number>;
  note?: string;
}

export interface SquadPlayer {
  id: string;
  fullName: string;
  displayName: string;
  position: Position;
  shirtNumber?: number;
  birthDate?: ISODate;
  nationality: string[];     // ISO 3166-1 alpha-2
  heightCm?: number;
  photo?: MediaAsset;
  /** Canterano del club. */
  homegrown: boolean;
  joinedAt?: ISODate;
  contractUntil?: ISODate;
  marketValueUsd?: Sourced<number>;
}

export type Position =
  | 'GK' | 'CB' | 'LB' | 'RB' | 'DM' | 'CM' | 'AM' | 'LW' | 'RW' | 'ST';

export interface Transfer {
  id: string;
  playerId: string;
  playerName: string;
  direction: 'in' | 'out';
  counterpartClub: string;
  counterpartClubSlug?: Slug;
  year: Year;
  feeUsd?: Sourced<number>;
  /** Para el ranking de "mejores ventas históricas". */
  isRecordSale?: boolean;
  note?: string;
}
```

### 8.5 Memoria: línea de tiempo y palmarés — `src/domain/types/timeline.ts`

```ts
import type { ISODate, MediaAsset, Sourced, Year } from './common';

export interface TimelineEvent {
  id: string;
  /** Precisión variable: a veces sólo se conoce el año. */
  date: ISODate;
  precision: 'day' | 'month' | 'year';
  title: string;
  summary: string;
  body?: string;
  kind: 'fundacion' | 'titulo' | 'estadio' | 'figura' | 'hito' | 'crisis' | 'clasico';
  /** 1–5. Define el peso visual en la timeline swipeable. */
  weight: 1 | 2 | 3 | 4 | 5;
  media?: MediaAsset[];
  source: string | null;
  verified: boolean;
}

export interface Honour {
  id: string;
  competition: string;
  scope: 'nacional' | 'continental' | 'intercontinental' | 'regional';
  count: Sourced<number>;
  years: Year[];
}
```

### 8.6 `ClubStature` — cómo se ordena la grilla sin discutir

El requisito habla de ordenar por "grandeza". **La grandeza no se hardcodea a dedo**: se calcula
con una fórmula documentada y auditable, guardada en el dato. Así el orden es defendible y el día
que se discuta, se discute la fórmula, no el capricho del agente.

```ts
export interface ClubStature {
  /** Puntaje 0–100 calculado por `computeStature()`. */
  score: number;
  /** Tier visual derivado del score; define el tamaño de celda en la grilla. */
  tier: 'colosal' | 'grande' | 'historico' | 'clasico' | 'emergente';
  /** Desglose transparente: la UI puede mostrarlo en un tooltip. */
  breakdown: {
    nationalTitles: number;
    continentalTitles: number;
    yearsInTopFlight: number;
    culturalWeight: number;    // 0–100, curado editorialmente y documentado
    activeSupportBase: number; // 0–100
  };
  /** Override manual EXCEPCIONAL. Requiere `reason`. */
  manualOverride?: { tier: ClubStature['tier']; reason: string };
}
```

```ts
// src/domain/logic/stature.ts
const W = {
  nationalTitles: 0.30,
  continentalTitles: 0.25,
  yearsInTopFlight: 0.15,
  culturalWeight: 0.20,
  activeSupportBase: 0.10,
} as const;
```

**Reglas:** el agente **no** inventa los valores de `culturalWeight` ni `activeSupportBase`; los
toma del JSON, que es curado por una persona. Si faltan, usa `0` y marca `verified: false`.

### 8.7 Clásicos — `src/domain/types/derby.ts`

```ts
import type { HexColor, ISODate, MediaAsset, Slug, Sourced } from './common';
import type { RecordMeta } from './meta';

export interface Derby {
  slug: Slug;                     // 'clasico-de-los-medianos'
  name: string;
  aka?: string[];
  /** SIEMPRE dos, en orden estable [izquierda, derecha] del split screen. */
  sides: [DerbySide, DerbySide];
  intensity: 1 | 2 | 3 | 4 | 5;
  origin: Sourced<string>;
  headToHead: HeadToHead;
  /** Jugadores que jugaron en ambos clubes. */
  crossovers: Crossover[];
  memorableMatches: DerbyMatch[];
  /** Módulos de gamificación habilitados para este clásico. */
  games: DerbyGameConfig;
  media: MediaAsset[];
  meta: RecordMeta;
}

export interface DerbySide {
  clubSlug: Slug;
  /** Denormalizado para que el split screen renderice sin cargar el club entero. */
  shortName: string;
  crest: MediaAsset;
  colors: { primary: HexColor; secondary: HexColor };
  /** 'left' | 'right' explícito: nunca depender del índice del array en el CSS. */
  side: 'left' | 'right';
}

export interface HeadToHead {
  totalMatches: Sourced<number>;
  winsBySlug: Record<Slug, number>;
  draws: number;
  goalsBySlug: Record<Slug, number>;
  biggestWin?: { clubSlug: Slug; score: string; date: ISODate };
  currentStreak?: { clubSlug: Slug | null; count: number };
  /** Rango de la estadística: importante para la honestidad del número. */
  coverage: { fromYear: number; toYear: number; competitions: string[] };
}

export interface Crossover {
  playerId: string;
  displayName: string;
  photo?: MediaAsset;
  spells: { clubSlug: Slug; fromYear: number; toYear: number; appearances?: number }[];
  /** 'lo quisieron en los dos lados' vs 'traición' — tono siempre deportivo. */
  note?: Sourced<string>;
}

export interface DerbyMatch {
  id: string;
  date: ISODate;
  competition: string;
  score: string;               // '2-1' en el orden de `sides`
  venue: string;
  story: Sourced<string>;
  media?: MediaAsset[];
}

export interface DerbyGameConfig {
  combinedXI: boolean;         // armar el 11 ideal combinado
  polls: Poll[];
  quiz?: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; label: string; clubSlug?: Slug }[];
  /** Resultados mock en Fase 1; en Fase 2 vienen del backend. */
  mockResults?: Record<string, number>;
  closesAt?: ISODate;
}
```

### 8.8 Metadatos de registro y Skin — `src/domain/types/meta.ts`

```ts
export interface RecordMeta {
  /** Versión del esquema; se incrementa ante cambios rompientes. */
  schemaVersion: 1;
  updatedAt: ISODate;
  /** Completitud 0–1: permite a la UI ocultar secciones vacías con elegancia. */
  completeness: number;
  editorialStatus: 'draft' | 'review' | 'published';
}

export interface Skin {
  clubSlug: Slug;
  scheme: 'light' | 'dark';
  /** Mapa listo para `style.setProperty`. Las claves SON los nombres de las vars. */
  tokens: Record<string, string>;
}
```

### 8.9 Ejemplo de mock — `src/data/clubs/penarol.json` (recortado)

```jsonc
{
  "slug": "penarol",
  "name": "Club Atlético Peñarol",
  "shortName": "Peñarol",
  "nickname": "Aurinegro",
  "foundedYear": 1891,
  "city": "Montevideo",
  "division": "primera",
  "crest": {
    "id": "crest-current",
    "kind": "image",
    "src": "/media/clubs/penarol/crest.svg",
    "alt": "Escudo de Peñarol: franjas amarillas y negras con las siglas CAP",
    "license": "fair-use"
  },
  "identity": {
    "colors": {
      // [PLACEHOLDER] verificar contra manual de marca oficial
      "primary": "#FFD100",
      "secondary": "#111111",
      "preferredScheme": "dark",
      "note": "Amarillo y negro. El amarillo NO se usa como color de texto: ver --club-primary-readable."
    }
  },
  "stature": {
    "score": 0,
    "tier": "colosal",
    "breakdown": {
      "nationalTitles": 0, "continentalTitles": 0, "yearsInTopFlight": 0,
      "culturalWeight": 0, "activeSupportBase": 0
    }
  },
  "honours": [
    {
      "id": "h-uy-primera",
      "competition": "Campeonato Uruguayo de Primera División",
      "scope": "nacional",
      "count": { "value": 0, "source": null, "verified": false },
      "years": []
    }
  ],
  "meta": { "schemaVersion": 1, "updatedAt": "2026-01-01", "completeness": 0.15, "editorialStatus": "draft" }
}
```

> Los ceros y arrays vacíos son **deliberados**: es mejor un dato ausente y visible como pendiente
> que un dato inventado que la hinchada detecta al segundo.

### 8.10 La capa `repositories/`

```ts
// src/repositories/clubsRepository.ts
import type { Club, ClubSummary, Slug } from '@/domain/types';
import { clubSchema } from '@/domain/schemas/club';

const modules = import.meta.glob<{ default: unknown }>('../data/clubs/*.json');
const cache = new Map<Slug, Club>();

export async function getClubs(): Promise<ClubSummary[]> { /* … */ }

export async function getClub(slug: Slug): Promise<Club> {
  const cached = cache.get(slug);
  if (cached) return cached;

  const loader = modules[`../data/clubs/${slug}.json`];
  if (!loader) throw new NotFoundError(`Club no encontrado: ${slug}`);

  const raw = (await loader()).default;
  // En dev validamos contra Zod; en prod confiamos en el build.
  const club = import.meta.env.DEV ? clubSchema.parse(raw) : (raw as Club);
  cache.set(slug, club);
  return club;
}

/** Se llama en hover/touchstart para que el Portal aterrice con datos listos. */
export function prefetchClub(slug: Slug): void { void getClub(slug).catch(() => {}); }
```

**Reglas de repositorio:** siempre `async`, siempre devuelven tipos de `domain/types`, nunca
devuelven el JSON crudo, nunca conocen React. Todo error de datos es una clase de error tipada
(`NotFoundError`, `SchemaError`) — nunca un `throw new Error(string)` suelto.

---

## 9. Vista principal (Index) — la grilla

**Concepto:** una grilla asimétrica, densa, tipo mosaico, donde el tamaño de cada celda lo define
`stature.tier`. No es un catálogo: es un mural.

### Especificación

- Layout CSS Grid con `grid-auto-flow: dense`. Spans por tier:
  `colosal` 2×2 · `grande` 2×1 · `historico`/`clasico` 1×1 · `emergente` 1×1 compacto.
  En mobile (< 640 px): 2 columnas, `colosal` ocupa el ancho completo.
- Cada celda: escudo + nombre corto + año de fundación, sobre un fondo que ya usa los colores del
  club (mini-skin local con `style={{ '--club-primary': … }}` scopeado a la card).
- **Hover/focus:** la celda se eleva, el escudo gana profundidad (parallax leve del puntero, máx.
  8 px), y el resto de la grilla baja su saturación a 65 % (`filter: saturate(.65)` en el
  contenedor con la celda activa exenta). En touch, este efecto se dispara en `touchstart`.
- Orden por defecto: `stature.score` desc. Controles de reordenamiento: alfabético, por antigüedad,
  por división. El orden es **estado de URL** (`?sort=`), no estado local.
- Buscador con filtrado en vivo, accesible por teclado (`/` para enfocar), con `aria-live` anunciando
  la cantidad de resultados.
- **Cero imágenes pesadas al cargar:** los escudos son SVG; las fotos ambiente de cada celda son
  `loading="lazy"` con LQIP.
- La grilla usa el skin **neutral** (definido en `theme.css`), nunca el de un club.

---

## 10. Secciones internas del club

Ruta base `/club/:slug`, con subrutas que **no desmontan el layout ni resetean el skin**:

```
/club/:slug              → Portada (hero + accesos a las tres secciones)
/club/:slug/espacios     → Experiencia y Espacios
/club/:slug/identidad    → Identidad y Mística
/club/:slug/institucion  → Datos Institucionales
```

La navegación entre subrutas es una transición lateral de 340 ms, sin tocar el header ni el skin.

### 10.1 Experiencia y Espacios (`features/club-spaces`)

| Módulo | Regla de implementación |
|---|---|
| **Visor 360°** | Componente `<PanoViewer>` propio sobre three.js: esfera invertida + textura equirectangular. Se monta **solo tras click explícito** en el poster. Controles: drag, pinch, y **teclado obligatorio** (flechas = rotar, +/− = zoom). Hotspots navegables entre `PanoramaSpot`. |
| **Street View / tours externos** | Nunca se embebe un iframe de terceros automáticamente. Se muestra un poster con un botón "Cargar recorrido externo" que advierte que carga contenido de un tercero. Solo `externalTour.requiresConsent === true` habilita la carga. |
| **Mapa de barrio** | MapLibre + estilo raster libre. El mapa hereda el skin: marcadores y trazos usan `--club-primary-readable`. Carga diferida (`React.lazy`) — MapLibre es pesado. |
| **Rutas** | Cada `NeighborhoodRoute` se recorre en scroll: al avanzar, el mapa hace `flyTo` a la parada activa y su ficha aparece a un lado. Debe existir una **lista alternativa navegable por teclado** con la misma información (el scroll-jacking no puede ser el único acceso). |
| **Murales y previa** | Galería tipo masonry con lightbox accesible (focus trap, Esc para cerrar, flechas para navegar). Cada asset muestra `credit` y `license`. |

### 10.2 Identidad y Mística (`features/club-identity`)

**Visualizador de camisetas 3D**
- `@react-three/fiber` + `drei`, cargado con `React.lazy` + `Suspense`. **Nunca** entra en el
  bundle inicial.
- Modelos `.glb` con compresión Draco, presupuesto < 1.5 MB por camiseta.
- **Fallback obligatorio:** si WebGL no está disponible, el dispositivo tiene poca memoria
  (`navigator.deviceMemory < 4`), o el usuario pidió reducir movimiento, se muestra `kit.flat` (2D)
  con zoom. La feature **degrada, no desaparece**.
- Selector de camisetas como carrusel de miniaturas; la iluminación de la escena usa los colores del
  skin para que el 3D se sienta parte de la página.
- Rotación automática lenta solo mientras el elemento está en viewport y `prefers-reduced-motion`
  no está activo. Se pausa al interactuar.

**Audios de cánticos / murga**
- Un **único** `<audio>` global gobernado por `AudioProvider` + `audioStore`. Prohibido crear
  instancias sueltas por componente.
- Estado inicial: **silenciado**. La preferencia (on/off + volumen) persiste en `localStorage` bajo
  `garra:prefs:audio`.
- Al entrar a un club con audio activado: fade-in de 800 ms del `Chant` marcado como `loopable`.
  Al salir: fade-out de 400 ms.
- Se pausa automáticamente si el usuario reproduce un video, y al perder visibilidad de la pestaña
  (`visibilitychange`).
- Control global visible siempre (esquina inferior), con etiqueta accesible que dice qué suena.
- Letras (`lyrics`): solo se muestran si son publicables. Ver §14 (moderación).

**Videos de hinchada**
- `<LazyVideo>`: poster + play explícito. `preload="none"`. Sin autoplay con sonido, nunca.
- Máximo 6 por club para no diluir la curaduría.

**Línea de tiempo interactiva**
- Carrusel horizontal con Embla: swipe en touch, drag en desktop, y **navegación por teclado**
  (flechas, Home/End) obligatoria.
- El `weight` del evento define tamaño de tarjeta y densidad visual.
- Los eventos sin `verified` se marcan con un indicador sutil "dato sin verificar" (nunca se ocultan
  ni se presentan como ciertos).
- Un `<ol>` semántico por debajo, visualmente transformado: los lectores de pantalla recorren una
  lista ordenada normal.

### 10.3 Datos Institucionales (`features/club-institution`)

- Tono **sobrio**: acá el skin se atenúa (superficies neutras con acentos de marca) para que los
  números se lean como información, no como propaganda.
- **Plantel:** grilla filtrable por posición, con vista de campo (formación) opcional. Cada ficha
  muestra `homegrown` como distintivo.
- **Mejores ventas históricas:** ranking derivado de `transfers` (`direction: 'out'` ordenado por
  `feeUsd`). Toda cifra muestra su fuente al pasar el cursor / al enfocar. Sin fuente ⇒ se muestra
  como "cifra no confirmada", nunca como número duro.
- **Balances:** tabla simple + un gráfico de barras mínimo (SVG propio, sin librería de charts).
  Encabezado explícito: "cifras simplificadas, ver fuente". **Prohibido inferir, proyectar o
  redondear cifras financieras.**
- **Autoridades y sedes:** fichas con foto y período.
- Si `completeness < 0.4`, la sección muestra un estado vacío honesto y bien diseñado
  ("Estamos completando esta información"), nunca un placeholder tipo *lorem ipsum*.

---

## 11. Sección "Los Clásicos"

Ruta `/clasico/:slug`. Es la pieza más ambiciosa de la interfaz.

### 11.1 El split screen

```
┌───────────────────────┬───────────────────────┐
│   SKIN CLUB A         │        SKIN CLUB B    │
│   scope: .side-left   │   scope: .side-right  │
│                       │                       │
│   ← contenido A       │       contenido B →   │
└───────────────────────┴───────────────────────┘
        divisoria diagonal animada (clip-path)
```

**Implementación del doble skin.** El `SkinProvider` global aplica un skin **neutral** al `<html>`,
y `DerbyLayout` monta **dos scopes locales** que redefinen las mismas variables:

```tsx
// features/derby-split/DerbySplit.tsx
<div className="derby" data-derby={derby.slug}>
  <section className="derby__side derby__side--left"  style={leftSkin.tokens as CSSProperties}>…</section>
  <section className="derby__side derby__side--right" style={rightSkin.tokens as CSSProperties}>…</section>
</div>
```

Como las variables son las mismas (`--club-primary`, `--club-ink`…), **todos los componentes
funcionan igual dentro de cada mitad sin ninguna prop extra**. Esta es la razón de fondo por la que
el skin vive en CSS vars y no en props de React.

Reglas:

1. La divisoria es un `clip-path` con ángulo configurable (por defecto 8°) animado con
   `--split-position` (0–1). No se usan dos scrolls independientes: el scroll es **uno solo**.
2. En mobile (< 768 px) el split es **horizontal** (arriba/abajo), no vertical. Se conserva la
   diagonal.
3. Cada mitad calcula su contraste de forma independiente. Un clásico entre dos clubes de colores
   parecidos **no puede** volverse ilegible: si el contraste entre las dos mitades es < 3:1, se
   inserta automáticamente una divisoria de 3 px con `--club-ink` de cada lado.
4. El orden `left`/`right` viene del dato (`DerbySide.side`), **nunca** del índice del array ni de
   un criterio del agente. Es un tema sensible: el orden lo decide la curaduría.
5. Presentación equilibrada: mismo espacio, misma jerarquía tipográfica y mismo peso visual para
   ambos lados, en todos los módulos. Sin excepciones.

### 11.2 Animaciones de confrontación al scroll

Sistema `<ScrollScene>` sobre `useScrollProgress` (IntersectionObserver + `requestAnimationFrame`,
o `ScrollTimeline` donde esté soportado). Escenas canónicas:

| Escena | Comportamiento |
|---|---|
| **Choque de escudos** | Los dos escudos entran desde los bordes opuestos y se encuentran en el centro; en el impacto, un pulso de luz con el color de cada lado |
| **Barrido de la divisoria** | `--split-position` se mueve según el historial: el lado con más victorias "empuja" la diagonal |
| **Duelo de cifras** | Los números del head-to-head cuentan en paralelo desde 0; el mayor se resalta con `--club-primary-readable` de su lado |
| **Cruce de veredas** | Las fichas de `crossovers` viajan de una mitad a la otra, cambiando de skin a mitad de camino |

Reglas: `transform` y `opacity` únicamente (nada de animar `width`, `top`, `filter` en scroll).
Presupuesto: **≤ 4 escenas animadas por página**. Con `prefers-reduced-motion`, todas se
convierten en apariciones estáticas con los valores finales — **el contenido nunca depende de que
la animación ocurra**.

### 11.3 Módulos de datos y gamificación

- **Historial comparado:** barras espejadas desde el centro. Siempre visible el `coverage`
  ("historial desde 1900 en Campeonato Uruguayo") — un número sin su alcance es un número mentiroso.
- **Cruzaron de vereda:** cards con las etapas en cada club; tono deportivo, nunca acusatorio.
- **11 ideal combinado:** el usuario arma una formación con jugadores de ambos clubes.
  - Estado local + `localStorage` (`garra:xi:<derbySlug>`). Sin backend en Fase 1.
  - **Drag & drop nunca puede ser la única forma de interactuar**: cada slot es un botón que abre un
    selector accesible por teclado.
  - Exportable como imagen (canvas) para compartir.
- **Encuestas de la previa:** votación local, resultados mock desde `poll.mockResults`.
  Se debe rotular claramente **"resultados de muestra"** mientras no haya backend. Presentar
  números simulados como reales es una violación grave de este documento.
- **Sin contenido violento ni provocación:** copys, apodos y textos de gamificación se mantienen en
  registro deportivo. Cero referencias a incidentes violentos, cero insultos, cero cánticos
  discriminatorios (§14).

---

## 12. Accesibilidad (bloqueante, no "nice to have")

Ningún componente se considera terminado sin esto:

1. **Contraste:** AA en todo (4.5:1 texto, 3:1 texto grande y elementos de UI). Garantizado por
   `ensureContrast`, verificado por test automático sobre **todos** los skins de `data/clubs/`.
2. **Teclado:** toda funcionalidad operable sin mouse. Orden de foco lógico. Focus visible siempre,
   con `outline: 2px solid var(--club-focus); outline-offset: 2px`. **Prohibido `outline: none`
   sin reemplazo equivalente.**
3. **Semántica:** HTML nativo primero. `<button>` para acciones, `<a>` para navegación, headings
   jerárquicos sin saltos, landmarks (`main`, `nav`, `aside`). ARIA solo cuando el HTML no alcanza.
4. **Movimiento:** `prefers-reduced-motion: reduce` respetado en el 100 % de las animaciones, vía
   `MotionProvider` (`framer-motion` `MotionConfig reducedMotion="user"`) **y** en CSS.
5. **Medios:** `alt` descriptivo real en toda imagen informativa (`alt=""` en las decorativas).
   Video con subtítulos o transcripción cuando hay habla. Audio con descripción de qué suena.
6. **Anuncios:** cambios de contexto importantes (entrar a un club, cambiar de subruta) anunciados
   con una región `aria-live="polite"` y el `document.title` actualizado.
7. **Zoom y reflow:** usable a 200 % de zoom y en viewport de 320 px sin scroll horizontal.
8. **Toques:** ≥ 44×44 px. Ningún gesto complejo (pinch, drag) sin alternativa simple.
9. **El skin no rompe la accesibilidad:** si un club obliga a elegir entre "fiel al color" y
   "legible", **gana legible**. El color de marca se preserva en las masas de fondo, y el texto usa
   la variante `readable`.

---

## 13. Performance y medios

### Presupuestos (verificados en CI)

| Métrica | Objetivo |
|---|---|
| JS inicial (gzip) | ≤ 180 KB |
| LCP en 4G simulada (mobile) | ≤ 2.5 s |
| CLS | ≤ 0.05 |
| INP | ≤ 200 ms |
| Modelo 3D por camiseta | ≤ 1.5 MB |
| Panorama equirectangular | ≤ 800 KB (WebP/AVIF, 4096×2048) |
| Escudo | SVG, ≤ 20 KB |

### Reglas

- **Code splitting obligatorio** por ruta y por feature pesada: `three`/R3F, MapLibre y el visor 360
  van en chunks propios cargados con `React.lazy`, siempre detrás de una interacción o de un
  `IntersectionObserver`.
- Todas las imágenes: `width`/`height` explícitos, `loading="lazy"` salvo el LCP, formatos modernos
  con fallback, LQIP para evitar el flash.
- Video: `preload="none"`, `poster` siempre.
- Audio: `preload="metadata"`.
- Fuentes: `font-display: swap`, self-hosted, subset latino, máximo 2 familias + 4 pesos.
- Memoizar solo con evidencia. `useMemo`/`useCallback` porque sí es ruido; medí con el Profiler.
- Animar únicamente `transform`, `opacity` y variables registradas con `@property`.
- Listas largas (plantel completo, timelines de 100+ eventos): virtualización o paginación.

---

## 14. Reglas estrictas de código

### TypeScript

```jsonc
// tsconfig.json — obligatorio
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "verbatimModuleSyntax": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

- **`any` está prohibido.** Si no conocés el tipo, es `unknown` + validación con Zod.
- `@ts-ignore` prohibido. `@ts-expect-error` permitido solo con comentario explicando por qué
  (ej. APIs de navegador aún sin tipos, como View Transitions).
- Nada de type assertions (`as Foo`) sobre datos externos: se valida con el schema.
- Props de componentes: `interface XProps`, exportada. Nada de `React.FC`.
- Enums de TS prohibidos: usar union types de string literals.
- Imports absolutos con `@/`. Prohibido `../../../`.

### React

- Solo function components. Nada de clases.
- Un componente **hace una cosa**. Si pasa de ~150 líneas o de 4 `useState`, se divide o pasa a
  `useReducer` / store.
- Lógica no trivial → custom hook en `hooks/` o `features/x/hooks/`.
- **Estado en el lugar correcto:**
  | Tipo de estado | Dónde vive |
  |---|---|
  | UI efímera (abierto/cerrado, hover) | `useState` local |
  | Filtros, orden, tab activo, club activo | **URL** (search params) |
  | Skin, audio, preferencias | Zustand |
  | Datos del dominio | `repositories` + caché del router (loaders) |
- Zustand siempre con selectores (`useStore((s) => s.campo)`). Nunca desestructurar el store entero.
- `key` estable y semántica (`club.slug`), jamás el índice del array.
- Efectos: mínimos y con cleanup. Un `useEffect` que sincroniza dos estados de React es un smell.
- Todo componente que puede fallar (3D, mapa, medios externos) va envuelto en un `ErrorBoundary`
  con fallback **skinneado**, nunca una pantalla blanca.
- `Suspense` con skeletons que respetan la forma final del contenido (sin CLS).

### CSS / Tailwind

- Colores de club: **solo** vía `var(--club-*)`. Cero hex de club en el código de componentes.
- Nada de clases Tailwind construidas por interpolación de strings.
- Nombres de clases custom en BEM cuando se necesita CSS propio (`derby__side--left`).
- `!important` prohibido salvo en overrides documentados de librerías de terceros.
- Espaciado y tipografía por escala del `@theme`, sin valores mágicos.
- Media queries mobile-first. Preferir `clamp()` y unidades relativas a breakpoints múltiples.

### Nomenclatura y contenido

- Código, nombres de archivos, tipos, variables y commits: **en inglés**.
- Textos de interfaz (copys) y comentarios explicativos de dominio: **en español rioplatense**,
  neutro y sobrio. Todo copy centralizado en `src/content/` — cero strings de UI hardcodeados en
  componentes.
- Commits en Conventional Commits (`feat:`, `fix:`, `refactor:`, `perf:`, `a11y:`, `data:`).

### Moderación de contenido (regla de producto)

Este proyecto publica material de hinchadas. Al cargar o mostrar cánticos, letras, videos o textos:

- **Excluir** contenido discriminatorio (racista, xenófobo, homofóbico, sexista), apologías de
  violencia, insultos a personas identificables o referencias a incidentes violentos.
- Ante la duda sobre una letra o un video, `published: false` y **preguntar**. No es una decisión
  que el agente resuelve solo.
- Respetar derechos: todo asset lleva `license` y `credit`. Sin licencia clara → no se publica.

---

## 15. Testing y Definition of Done

### Qué se testea

| Nivel | Herramienta | Alcance obligatorio |
|---|---|---|
| Unitario | Vitest | `lib/color.ts`, `domain/logic/*` (skin, stature, head-to-head), formatters |
| Datos | Vitest + Zod | **Todos** los JSON de `src/data/` validan contra su schema |
| Contraste | Vitest | Para cada club: todos los pares críticos del skin cumplen AA |
| Componente | Testing Library | Primitivos de `components/ui` y features con lógica de interacción |
| E2E | Playwright | Flujo portal (grilla → club), navegación por subrutas, split screen, teclado |
| A11y | axe-core en Playwright | 0 violaciones críticas en index, club y clásico |

Test de contraste — es el que protege el principio P3, no lo borres:

```ts
// src/domain/logic/skin.contrast.test.ts
import { describe, expect, it } from 'vitest';
import { getClubs } from '@/repositories/clubsRepository';
import { buildSkin } from './skin';
import { contrastRatio } from '@/lib/color';

const PAIRS: [ink: string, bg: string, min: number][] = [
  ['--club-ink', '--club-surface', 4.5],
  ['--club-primary-readable', '--club-surface', 4.5],
  ['--club-on-primary', '--club-primary', 4.5],
  ['--club-on-secondary', '--club-secondary', 4.5],
  ['--club-focus', '--club-surface', 3],
];

describe('skin contrast (WCAG AA)', async () => {
  const clubs = await getClubs();
  for (const club of clubs) {
    const { tokens } = buildSkin(club);
    for (const [ink, bg, min] of PAIRS) {
      it(`${club.slug}: ${ink} sobre ${bg} ≥ ${min}:1`, () => {
        expect(contrastRatio(tokens[ink]!, tokens[bg]!)).toBeGreaterThanOrEqual(min);
      });
    }
  }
});
```

### Script de verificación

```jsonc
// package.json
"scripts": {
  "verify": "pnpm typecheck && pnpm lint && pnpm test && pnpm build",
  "typecheck": "tsc --noEmit",
  "lint": "eslint . --max-warnings=0",
  "test": "vitest run",
  "test:e2e": "playwright test"
}
```

### Definition of Done (checklist por entrega)

- [ ] `pnpm verify` pasa sin warnings.
- [ ] Cero `any`, cero `@ts-ignore`, cero `console.log` olvidados.
- [ ] Funciona con teclado de punta a punta; foco visible en todo momento.
- [ ] Probado con `prefers-reduced-motion: reduce` activado.
- [ ] Probado en 320 px, 768 px y 1440 px de ancho.
- [ ] Contraste AA verificado con al menos 3 clubes de paletas opuestas (uno claro, uno oscuro, uno
      saturado).
- [ ] Sin layout shift perceptible al cargar ni al transicionar.
- [ ] Assets pesados cargan bajo demanda; el bundle inicial sigue dentro del presupuesto.
- [ ] Todo dato nuevo tiene `source` + `verified` o está marcado como pendiente.
- [ ] Estados vacío, cargando y error implementados y **skinneados**.
- [ ] Ningún color de club hardcodeado fuera de `data/`.

---

## 16. Zona gris: cuándo parar y preguntar

Detené el trabajo y consultá — **no improvises** — cuando:

1. Falte un dato histórico, estadístico o institucional real y no haya fuente verificable.
2. Haya que decidir el orden `left`/`right` de un clásico, o el peso cultural de un club.
3. Un copy pueda leerse como agresivo, burlón o parcial hacia una hinchada.
4. Una letra de cántico o un video tenga contenido dudoso (§14 moderación).
5. La licencia de un asset (foto, audio, video, modelo 3D) no esté clara.
6. Cumplir un requisito visual implique romper una regla de accesibilidad o un presupuesto de
   performance.
7. Se necesite una dependencia fuera de la lista aprobada.
8. Haya que cambiar el modelo de datos de §8 de forma rompiente.

**Formato para preguntar:** qué estás intentando hacer · qué regla te bloquea · 2 alternativas
concretas con su trade-off · tu recomendación.

---

## 17. Orden de trabajo sugerido (Fase 1)

1. **Fundaciones:** Vite + TS strict + Tailwind v4 + `theme.css` + `skin.css` + `lib/color.ts`
   con sus tests. *(Sin esto nada de lo demás tiene sentido.)*
2. **Datos:** interfaces de §8 + schemas Zod + 3 clubes mock completos (uno claro, uno oscuro, uno
   saturado) + 1 clásico + `repositories`.
3. **Skin end-to-end:** `buildSkin` + store + provider + una página de prueba que cicla entre los
   3 clubes. Acá se valida el corazón del proyecto.
4. **Grilla index** con mini-skins por celda.
5. **Portal transition** (View Transitions + fallback).
6. **Layout de club** + portada + navegación entre subrutas.
7. **Identidad y Mística** (timeline → camisetas 2D → audio → 3D al final).
8. **Espacios** (mapa → landmarks → 360°).
9. **Institucional.**
10. **Clásicos:** split screen → historial → escenas de scroll → gamificación.
11. **Endurecimiento:** auditoría a11y, presupuestos de performance, E2E.

> Nunca avances al paso siguiente con el anterior "casi listo". El sistema de skins y el modelo de
> datos son cimientos: un error ahí se paga multiplicado por cada club y cada componente.

---

## 18. Glosario

| Término | Significado en este proyecto |
|---|---|
| **Skin** | Conjunto de CSS variables derivadas de la identidad de un club, aplicadas a un scope |
| **Portal** | La transición inmersiva de la grilla a la vista de club |
| **Scope** | Elemento del DOM donde se redefinen las variables de skin (`<html>` o una mitad del derby) |
| **Readable** | Variante de un color de marca ajustada en OKLCH hasta cumplir contraste AA |
| **Stature** | Puntaje calculado de "grandeza" que define el peso visual en la grilla |
| **Side** | Cada mitad del split screen de un clásico |
| **Sourced** | Envoltorio de dato que obliga a declarar fuente y verificación |
