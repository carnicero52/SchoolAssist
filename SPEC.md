# SchoolAssist - Sistema de Asistencia Escolar

## 📋 Descripción
Sistema multi-instituto para control de asistencia escolar con credenciales QR, notificaciones en tiempo real y dashboard en vivo.

## ✅ Completado v1.0

### Core
- [x] Multi-instituto (multi-tenant)
- [x] 3 roles (Director, Admin, Portero)
- [x] Registro estudiante + foto
- [x] QR Code automático
- [x] Escanear QR (entrada/salida)
- [x] Dashboard tiempo real
- [x] Reportes (day/week/month/year)

### Notificaciones
- [x] Telegram via CallMeBot
- [x] WhatsApp via CallMeBot  
- [x] Email via SMTP

### Configuración
- [x] Colores customizables (brand, secondary, accent)
- [x] Modo claro/oscuro
- [x] Turnos/Horarios
- [x] Niveles/Grados/Grupos
- [x] Settings API

### Credenciales
- [x] Generador de credenciales
- [x] Preview
- [x] Email con credencial

### APIs
- [x] POST /api/scan - Registrar asistencia
- [x] GET /api/students - Listar estudiantes
- [x] POST /api/students - Crear estudiante + QR
- [x] GET /api/dashboard/stats - Métricas
- [x] GET/PUT /api/settings - Config
- [x] GET/PUT /api/superadmin/institutions
- [x] GET/PUT/DELETE /api/levels

### Páginas
- [x] / (Landing)
- [x] /login
- [x] /admin (Dashboard)
- [x] /admin/scan (Escaner)
- [x] /admin/credentials (Credenciales)
- [x] /admin/reports (Reportes)
- [x] /admin/settings (Configuración)

---

## 📦 Schema de Base de Datos

### Modelos
- Institution - Instituto/escuela
- Staff - Usuarios (director, admin, portero)
- Student - Estudiante
- QRCode - Código QR de credencial
- Level - Nivel (Primaria, Bachillerato)
- Group - Grupo (1A, 1B)
- Subject - Materia
- Schedule - Horario
- Shift - Turno
- ScanPoint - Punto de entrada
- Attendance - Registro de asistencia
- Notification - Notificaciones
- InstitutionSettings - Configs adicionales
- ActionLog - Log de acciones

---

## 🔐 Roles
- **director** - Acceso completo
- **admin** - Gestión de estudiantes, reportes, asistencia
- **portero** - Solo escanear

---

## 📊 Variables de Entorno
```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_APP_URL=
NEXTAUTH_SECRET=
SUPERADMIN_SECRET=
TELEGRAM_BOT_TOKEN=
CALLMEBOT_API_KEY=
```

---

## 🚀 Deploy
1. Importar en Vercel desde GitHub
2. Agregar DATABASE_URL
3. Deploy

## 🧪 Testing
1. Crear institute desde Super Admin
2. Crear usuario director
3. Login como director
4. Crear niveles/grupos
5. Registrar estudiantes
6. Probar escaneo