# 📋 Guía de Configuración - OTP Login

## ⚙️ Backend (Laravel)

### Requisitos Iniciales
```bash
cd login-otp-backend
composer install
```

### Generar clave APP_KEY (si es necesario)
```bash
php artisan key:generate
```

### Configurar Base de Datos
El `.env` actual usa **SQLite** (recomendado para desarrollo):
```env
DB_CONNECTION=sqlite
```

Para usar **MySQL**, modifica:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=otp_login
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
```

### Ejecutar Migraciones
```bash
php artisan migrate
```

### Configurar Mail (para enviar OTP)
Por defecto usa `log` (ver OTP en logs). Para producción, usa Mailtrap o Gmail:

**Opción 1: Mailtrap** (recomendado para testing)
1. Registrate en https://mailtrap.io
2. Obtén MAIL_USERNAME y MAIL_PASSWORD
3. Actualiza tu `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=xxx
MAIL_PASSWORD=xxx
```

**Opción 2: Gmail**
1. Activa "Contraseñas de aplicación" en tu cuenta Google
2. Copia la contraseña generada
3. Actualiza tu `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_contraseña_app
MAIL_ENCRYPTION=tls
```

### Iniciar Servidor
```bash
php artisan serve
```
El servidor estará en: `http://localhost:8000`

---

## 🎨 Frontend (React + Vite)

### Requisitos Iniciales
```bash
cd login-otp-frontend
npm install
```

### Configurar URL de API
En `.env`, actualiza si usas un puerto diferente:
```env
VITE_API_URL=http://localhost:8000/api
```

### Iniciar Servidor de Desarrollo
```bash
npm run dev
```
El servidor estará en: `http://localhost:5173`

---

## 🚀 Flujo de Uso

1. **Backend corriendo** en `http://localhost:8000`
2. **Frontend corriendo** en `http://localhost:5173`
3. Usuario ingresa email en el formulario
4. Backend envía OTP al email (por Mailtrap/Gmail o log)
5. Usuario ingresa el código OTP
6. Backend valida y retorna éxito

---

## 📧 Debugging de Email (Local)

Con `MAIL_MAILER=log`, revisa los logs:
```bash
tail -f storage/logs/laravel.log
```

O usa MailHog para capturar emails en desarrollo:
```bash
# Instalar MailHog: https://github.com/mailhog/MailHog
# Ejecutar: mailhog
# UI disponible en http://localhost:1025
# Configurar en .env:
MAIL_MAILER=smtp
MAIL_HOST=localhost
MAIL_PORT=1025
```

---

## ✅ Variables de Entorno Importantes

| Variable | Descripción |
|----------|-------------|
| `APP_ENV` | `local` (desarrollo), `production` (producción) |
| `APP_DEBUG` | `true` para ver errores detallados |
| `DB_CONNECTION` | `sqlite` o `mysql` |
| `MAIL_MAILER` | Motor de email (`log`, `smtp`, etc) |
| `SANCTUM_STATEFUL_DOMAINS` | Domains permitidos (para CORS) |

---

## ⚠️ Notas de Seguridad

- **NUNCA** hagas commit del `.env` (ya está en `.gitignore`)
- **Cambia** `APP_KEY` en producción
- **Usa** `APP_ENV=production` en producción
- **Desactiva** `APP_DEBUG=false` en producción
- **Protege** credenciales de email/DB

