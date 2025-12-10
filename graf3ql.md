# Graf3QL - F3 GraphQL Development Tool

> **Internal Developer Tool para streamline del workflow de desarrollo y testing de GraphQL queries en F3**

---

## 🎯 Motivación

### Problema Actual

Los desarrolladores de F3 enfrentan un flujo de trabajo fragmentado al trabajar con tickets:

1. **Cambio de contexto constante**: Cambiar entre múltiples herramientas (pizarra física/digital → f3-qa repo → GraphQL Playground → editor de código)
2. **Pérdida de información**: No hay registro automático de respuestas originales vs modificadas
3. **Comparación manual**: Detectar diferencias entre responses requiere inspección visual manual del JSON
4. **Falta de historial**: No existe registro de qué queries se probaron para cada ticket
5. **Copy/paste error-prone**: Copiar queries y variables entre herramientas introduce errores

### Impacto

- **Tiempo perdido**: ~5-10 minutos por ciclo de testing
- **Errores humanos**: Comparaciones visuales pierden detalles sutiles
- **Falta de trazabilidad**: Difícil reconstruir el proceso de debugging

---

## 💡 Descripción de la Solución

**Graf3QL** es una aplicación web local construida con Vite + React + Tailwind que integra todas las herramientas necesarias para el workflow de desarrollo de GraphQL en un solo lugar.

### Características Principales

#### 1. **Ticket Tracker Integrado**
- Crear, gestionar y trackear tickets de trabajo
- Asociar queries, variables y responses a cada ticket
- Estados visuales: En progreso, Completado, Con errores
- Persistencia automática en localStorage

#### 2. **Query Editor con Auto-load**
- Carga automática de queries desde el repo f3-qa (configurable)
- Editor JSON para variables con syntax highlighting
- Selector de environment (local, acc, stage, prod)
- Ejecución de queries con un click

#### 3. **Diff Viewer Avanzado**
- Comparación side-by-side de responses (original vs nuevo)
- Highlighting de diferencias con colores neon
- Modos de visualización: Side-by-side, Unified, Only changes
- Capacidad de ignorar campos dinámicos (timestamps, IDs)

#### 4. **Persistencia Inteligente**
- localStorage para historial de tickets
- Snapshots automáticos de respuestas
- Restauración de sesión al recargar
- Export/Import de tickets en JSON

### Tech Stack

```
Frontend:     Vite + React 18 + TypeScript
Styling:      Tailwind CSS 3.x
State:        Zustand (simple, performante)
GraphQL:      graphql-request
Diff Engine:  diff-match-patch o jsondiffpatch
Code Editor:  @monaco-editor/react (VSCode editor)
Storage:      localStorage API
UI Theme:     Dark mode con acentos neon (verde/morado/naranja)
```

### Arquitectura Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│  Graf3QL - F3 Development Tool                    [⚙️ Settings]     │
├───────────────┬─────────────────────────────────────────────────────┤
│               │  Ticket: F3-1234 - Fix page query performance       │
│  📋 TICKETS   ├─────────────────────────────────────────────────────┤
│               │                                                      │
│  ✓ F3-1235    │  🔍 Query Editor          │  📊 Response Viewer    │
│    page       │  ┌───────────────────────┐│  ┌──────────────────┐ │
│    2h ago     │  │ query page(           ││  │  Original (📸)   │ │
│               │  │   $id: ID,            ││  │  Saved at 10:23  │ │
│  ⏸️ F3-1234    │  │   $name: String!      ││  │                  │ │
│    globalNav  │  │ ) {                   ││  │  {               │ │
│    active     │  │   page(id: $id) {     ││  │    "page": {     │ │
│               │  │     ...               ││  │      ...         │ │
│  ⏸️ F3-1233    │  │   }                   ││  │    }             │ │
│    endCard    │  │ }                     ││  │  }               │ │
│    1d ago     │  └───────────────────────┘│  └──────────────────┘ │
│               │                            │                       │
│  + New Ticket │  📝 Variables             │  🆕 Latest Run        │
│               │  ┌───────────────────────┐│  ┌──────────────────┐ │
│               │  │ {                     ││  │  Response         │ │
│               │  │   "id": "123",        ││  │  234ms            │ │
│               │  │   "name": "home",     ││  │                  │ │
│               │  │   "platform": "web"   ││  │  {               │ │
│               │  │ }                     ││  │    "page": {     │ │
│               │  └───────────────────────┘│  │      ...         │ │
│               │                            │  │    }             │ │
│               │  [Select Query ▼] [🌍 local ▼] [🔄 Run Query]   │ │
│               │                            │  └──────────────────┘ │
│               │                            │                       │
│               │                            │  [📊 Show Diff]       │
└───────────────┴─────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Trabajo Solucionado

### Workflow Actual (Fragmentado)

```
1. Pizarra física/digital
   ↓ (escribir ID manualmente)
2. Abrir f3-qa repo
   ↓ (buscar y copiar query)
3. Abrir GraphQL Playground
   ↓ (pegar query + variables)
4. Ejecutar query
   ↓ (copiar respuesta a algún lado)
5. Modificar código en F3
6. Volver a Playground
7. Ejecutar query nuevamente
8. Comparar manualmente JSONs
   ↓ (scroll up/down, buscar diferencias)
9. Repetir 5-8 hasta completar ticket
```

**Tiempo estimado por iteración**: ~3-5 minutos  
**Cambios de contexto**: 6-8 por iteración

---

### Workflow con Graf3QL (Unificado)

```
1. Abrir Graf3QL (localhost:3000)
2. Click en "+ New Ticket"
   ↓ (auto-genera ID, tipo: F3-XXXX)
3. Seleccionar query desde dropdown
   ↓ (auto-carga query + template de variables)
4. Ajustar variables en editor JSON
5. Click en "🔄 Run Query" 
   ↓ (respuesta aparece en panel derecho)
6. Click en "📸 Save Original"
   ↓ (guarda snapshot como baseline)
7. Modificar código en F3
8. Click en "🔄 Run Query" (mismo lugar)
   ↓ (nueva respuesta aparece automáticamente)
9. Click en "📊 Show Diff"
   ↓ (diff visual side-by-side, cambios highlighted)
10. Iterar en F3, repetir paso 8-9 instantáneamente
11. Ticket automáticamente marcado como ✓ Completado
```

**Tiempo estimado por iteración**: ~30 segundos  
**Cambios de contexto**: 0 (todo en una ventana)

---

## 📦 Épicas y Features

### Epic 1: Core Infrastructure 🏗️

**Objetivo**: Setup del proyecto y arquitectura base

- [ ] Inicializar proyecto Vite + React + TypeScript
- [ ] Configurar Tailwind CSS con tema dark customizado
- [ ] Definir paleta de colores neon (verde #00ff88, morado #bd00ff, naranja #ff6b35)
- [ ] Implementar estructura de carpetas (features, components, lib, hooks)
- [ ] Setup de Zustand para state management
- [ ] Configurar localStorage wrapper con TypeScript types
- [ ] Implementar sistema de routing (React Router) si necesario
- [ ] Setup de ESLint + Prettier con reglas del proyecto

**Estimación**: 1 día

---

### Epic 2: Ticket Management System 📋

**Objetivo**: Sistema de creación, tracking y persistencia de tickets

#### Features:

- [ ] Modelo de datos Ticket (TypeScript interface)
  ```typescript
  interface Ticket {
    id: string;              // F3-XXXX
    status: 'in-progress' | 'completed' | 'error';
    queryName: string;
    environment: string;
    createdAt: number;
    updatedAt: number;
    originalResponse: any | null;
    latestResponse: any | null;
    variables: Record<string, any>;
  }
  ```

- [ ] Store Zustand para tickets
  - [ ] Acciones: createTicket, updateTicket, deleteTicket
  - [ ] Selector: getTicketById, getAllTickets
  - [ ] Persistencia automática a localStorage

- [ ] Componente TicketList (sidebar izquierdo)
  - [ ] Renderizar lista de tickets con estados visuales
  - [ ] Filtros: All, In Progress, Completed
  - [ ] Indicadores visuales (íconos, colores)
  - [ ] Click en ticket para cargar en editor

- [ ] Componente CreateTicketButton
  - [ ] Modal/form para crear nuevo ticket
  - [ ] Auto-generación de ID secuencial
  - [ ] Validación de inputs

- [ ] Componente TicketDetail (header area)
  - [ ] Muestra ID y metadata del ticket activo
  - [ ] Selector de estado (dropdown)
  - [ ] Timestamp de última modificación

**Estimación**: 2 días

---

### Epic 3: Query Editor & Execution 🔍

**Objetivo**: Editor de queries y variables con ejecución contra F3

#### Features:

- [ ] Integrar Monaco Editor para queries
  - [ ] Syntax highlighting para GraphQL
  - [ ] Auto-formatting (prettier-graphql)
  - [ ] Validación de sintaxis en tiempo real

- [ ] Integrar Monaco Editor para variables (JSON)
  - [ ] Syntax highlighting para JSON
  - [ ] Validación de JSON en tiempo real
  - [ ] Auto-complete de keys comunes

- [ ] Query Selector Component
  - [ ] Dropdown con queries disponibles desde f3-qa
  - [ ] Preview de query al hacer hover
  - [ ] Búsqueda/filtrado de queries

- [ ] Environment Selector
  - [ ] Dropdown: local, acc, stage, prod
  - [ ] URLs configurables via settings
  - [ ] Indicador visual del environment activo (color badge)

- [ ] GraphQL Client Service
  - [ ] Wrapper de graphql-request
  - [ ] Manejo de headers (auth, content-type)
  - [ ] Error handling con mensajes user-friendly
  - [ ] Loading states

- [ ] Run Query Button
  - [ ] Ejecutar query con variables actuales
  - [ ] Loading spinner durante request
  - [ ] Mostrar tiempo de respuesta (ms)
  - [ ] Error toast si falla

- [ ] Response Timing Component
  - [ ] Muestra tiempo de ejecución
  - [ ] Historial de timings (gráfico simple)

**Estimación**: 3 días

---

### Epic 4: F3-QA Integration 📥

**Objetivo**: Auto-carga de queries desde el repo f3-qa local

#### Features:

- [ ] Settings Panel Component
  - [ ] Input para path del repo f3-qa
  - [ ] Botón "Refresh Queries"
  - [ ] Validación de path (existe el directorio)

- [ ] Query Loader Service
  - [ ] Detectar si running local vs deployed
  - [ ] Si local: leer archivos .graphql via File System Access API
  - [ ] Si deployed: fallback a queries hardcoded o fetch remoto
  - [ ] Parser de archivos .graphql (extraer nombre, query, fragments)

- [ ] Query Cache
  - [ ] Cachear queries cargadas en memoria
  - [ ] Refresh on-demand desde settings

- [ ] Variables Template Generator
  - [ ] Analizar query y extraer variables requeridas
  - [ ] Generar template JSON con tipos apropiados
  - [ ] Valores default inteligentes basados en tipo

**Nota**: File System Access API tiene limitaciones de seguridad. Alternativas:
- Usar Electron wrapper (más complejo)
- Pedir al usuario subir directorio manualmente (folder picker)
- Configurar proxy local que sirva archivos de f3-qa

**Estimación**: 2 días

---

### Epic 5: Response Viewer & Diff System 📊

**Objetivo**: Visualización de responses y comparación diff avanzada

#### Features:

- [ ] Response Panel Component (dual pane)
  - [ ] Panel izquierdo: "Original Response" (frozen)
  - [ ] Panel derecho: "Latest Response" (actualizable)
  - [ ] Scroll sincronizado entre ambos paneles

- [ ] JSON Viewer Component
  - [ ] Syntax highlighting para JSON
  - [ ] Collapsible/expandible para objetos/arrays
  - [ ] Copy to clipboard
  - [ ] Search dentro del JSON
  - [ ] Line numbers

- [ ] Save Original Button
  - [ ] Guarda current response como "original"
  - [ ] Timestamp visible
  - [ ] Confirmación visual (toast/badge)

- [ ] Diff Engine Integration
  - [ ] Implementar jsondiffpatch o similar
  - [ ] Detectar: added, removed, modified
  - [ ] Calcular % de diferencia

- [ ] Diff Mode Selector
  - [ ] Side-by-side (default)
  - [ ] Unified (estilo git diff)
  - [ ] Only changes (solo muestra lo modificado)
  - [ ] Toggle button entre modos

- [ ] Diff Visualization
  - [ ] Color coding con tema neon:
    - Verde neon (#00ff88): Added
    - Naranja neon (#ff6b35): Modified
    - Rojo neon (#ff2e63): Removed
  - [ ] Inline annotations (+, -, ~)
  - [ ] Jump to next/previous change

- [ ] Smart Diff Filters
  - [ ] Settings para ignorar campos (instanceID, lastModified, etc.)
  - [ ] Regex patterns para exclusión
  - [ ] Preset común para F3 (timestamps, IDs)

**Estimación**: 3-4 días

---

### Epic 6: UI/UX Polish ✨

**Objetivo**: Interfaz moderna, profesional con diseño neon dark

#### Features:

- [ ] Design System Setup
  - [ ] Tailwind config con colores custom
  - [ ] Componentes base: Button, Input, Select, Modal, Toast
  - [ ] Animaciones suaves (framer-motion o Tailwind transitions)
  - [ ] Glassmorphism effects para paneles

- [ ] Dark Theme Implementation
  - [ ] Background: #0a0e27 (dark blue)
  - [ ] Surface: #1a1f3a (lighter blue)
  - [ ] Borders: colores neon con opacity baja
  - [ ] Text: #e0e0e0 (light gray)
  - [ ] Accents: neon colors para CTAs y highlights

- [ ] Layout Responsive
  - [ ] Grid system para paneles
  - [ ] Resizable panels (opcional: react-resizable-panels)
  - [ ] Mobile-friendly (aunque sea local, buena práctica)

- [ ] Keyboard Shortcuts
  - [ ] Cmd/Ctrl + Enter: Run query
  - [ ] Cmd/Ctrl + S: Save original
  - [ ] Cmd/Ctrl + D: Toggle diff
  - [ ] Cmd/Ctrl + N: New ticket
  - [ ] Cmd/Ctrl + K: Command palette (opcional)

- [ ] Loading & Error States
  - [ ] Skeleton loaders
  - [ ] Error boundaries
  - [ ] Toast notifications para feedback
  - [ ] Empty states (no tickets, no queries)

- [ ] Iconography
  - [ ] Lucide React o Heroicons
  - [ ] Íconos consistentes en toda la app
  - [ ] Animated icons para estados (loading, success, error)

- [ ] Micro-interactions
  - [ ] Hover effects en botones y cards
  - [ ] Smooth transitions entre estados
  - [ ] Ripple effects (opcional)
  - [ ] Confetti al completar ticket (fun!)

**Estimación**: 2-3 días

---

### Epic 7: Advanced Features (Optional/V2) 🚀

**Objetivo**: Features avanzadas para power users

- [ ] Query History dentro de cada ticket
  - [ ] Timeline de todas las ejecuciones
  - [ ] Ver cualquier response histórica
  - [ ] Comparar cualquier par de responses

- [ ] Export/Import Tickets
  - [ ] Export ticket como JSON
  - [ ] Import para compartir con equipo
  - [ ] Export a markdown para documentación

- [ ] Performance Metrics
  - [ ] Gráfico de tiempos de respuesta
  - [ ] Comparación de performance entre runs
  - [ ] Alerts si query es más lenta

- [ ] GraphQL Schema Introspection
  - [ ] Fetch schema desde F3
  - [ ] Schema explorer integrado
  - [ ] Type hints en editor

- [ ] Variables Presets
  - [ ] Guardar sets de variables comunes
  - [ ] Quick load de presets
  - [ ] Share presets entre tickets

- [ ] Team Collaboration (future)
  - [ ] Backend opcional para compartir tickets
  - [ ] Real-time updates con WebSockets
  - [ ] Comments en tickets

**Estimación**: Variable (5-10 días dependiendo de scope)

---

## 📐 Wireframes & Specs

### Color Palette

```css
/* Primary Dark Theme */
--bg-primary: #0a0e27;      /* Deep dark blue */
--bg-secondary: #1a1f3a;    /* Lighter dark blue */
--bg-tertiary: #252b4a;     /* Panel backgrounds */

/* Neon Accents */
--neon-green: #00ff88;      /* Success, additions */
--neon-purple: #bd00ff;     /* Primary actions */
--neon-orange: #ff6b35;     /* Warnings, modifications */
--neon-pink: #ff2e63;       /* Errors, deletions */

/* Text */
--text-primary: #e0e0e0;    /* Main text */
--text-secondary: #a0a0a0;  /* Secondary text */
--text-muted: #666666;      /* Muted text */

/* Borders & Dividers */
--border-default: rgba(189, 0, 255, 0.2);   /* Subtle purple glow */
--border-hover: rgba(189, 0, 255, 0.5);     /* Hover state */
```

### Typography

```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

### Layout Specs

```
Desktop (1920x1080):
├─ Sidebar: 320px fixed width
├─ Main area: flex-1 (remaining space)
│  ├─ Header: 60px height
│  ├─ Editor section: 50% height
│  │  ├─ Query editor: 60% width
│  │  └─ Variables editor: 40% width
│  └─ Response section: 50% height
│     ├─ Original: 50% width
│     └─ Latest: 50% width

Minimum viewport: 1280x720
```

---

## 🎯 Success Metrics

### Developer Experience
- ✅ Reducir tiempo de iteración de **3-5 min → 30 seg** (90% improvement)
- ✅ Eliminar cambios de contexto de **6-8 → 0** por iteración
- ✅ 100% de tickets con historial automático de testing

### Technical Goals
- ✅ Tiempo de carga inicial: < 2 segundos
- ✅ Respuesta UI: < 100ms para interacciones
- ✅ GraphQL query execution: display results en < 500ms (local)
- ✅ Zero pérdida de datos (localStorage persistence)

### Adoption
- ✅ 80% del equipo de desarrollo F3 usa la tool regularmente
- ✅ Promedio de 5+ tickets tracked por developer por semana

---

## 🚀 Roadmap

### Phase 1: MVP (2-3 semanas)
- Epic 1: Core Infrastructure ✓
- Epic 2: Ticket Management System ✓
- Epic 3: Query Editor & Execution ✓
- Epic 5: Response Viewer (básico) ✓
- Epic 6: UI/UX Polish (básico) ✓

**Entregable**: Tool funcional para workflow básico

---

### Phase 2: F3 Integration (1 semana)
- Epic 4: F3-QA Integration ✓
- Epic 5: Diff System completo ✓
- Epic 6: UI/UX Polish completo ✓

**Entregable**: Tool production-ready con todas las features core

---

### Phase 3: Advanced Features (2-3 semanas)
- Epic 7: Optional features según feedback del equipo

**Entregable**: Power user features

---

## 📝 Notas Técnicas

### LocalStorage Schema

```typescript
// Key structure
localStorage.setItem('graf3ql:tickets', JSON.stringify(tickets));
localStorage.setItem('graf3ql:settings', JSON.stringify(settings));
localStorage.setItem('graf3ql:active-ticket', ticketId);

// Data structure
interface StoredData {
  tickets: Ticket[];
  settings: {
    f3QaPath: string;
    environments: Record<string, string>;
    ignoredDiffFields: string[];
  };
  activeTicketId: string | null;
}
```

### File System Access API (para f3-qa integration)

```javascript
// Request access to f3-qa directory
const directoryHandle = await window.showDirectoryPicker();

// Read queries
const queriesDir = await directoryHandle.getDirectoryHandle('queries');
for await (const entry of queriesDir.values()) {
  if (entry.kind === 'file' && entry.name.endsWith('.graphql')) {
    const file = await entry.getFile();
    const content = await file.text();
    // Parse and store query
  }
}
```

**Limitación**: Solo funciona en contextos seguros (HTTPS o localhost)  

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier configured
- PR template con checklist

---

## 📄 License

usar do what the fuck you want licence
