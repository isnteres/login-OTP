<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 40px; }
        .card { background: white; border-radius: 12px; padding: 40px; max-width: 480px; margin: auto; }
        .title { color: #1e40af; font-size: 22px; font-weight: bold; }
        .password { font-size: 28px; font-weight: bold; color: #1e40af;
                    background: #dbeafe; padding: 16px; border-radius: 8px;
                    text-align: center; margin: 24px 0; letter-spacing: 4px; }
        .muted { color: #64748b; font-size: 14px; }
        .btn { display: block; background: #1e40af; color: white; text-align: center;
               padding: 14px; border-radius: 8px; text-decoration: none;
               font-weight: bold; margin-top: 24px; }
    </style>
</head>
<body>
    <div class="card">
        <p class="title">Bienvenido, {{ $userName }} 👋</p>
        <p>Tu cuenta ha sido creada. Esta es tu contraseña temporal:</p>
        <div class="password">{{ $tempPassword }}</div>
        <p class="muted">Por seguridad deberás cambiarla en tu primer ingreso.</p>
        <a href="{{ env('FRONTEND_URL') }}/register" class="btn">
            Activar mi cuenta
        </a>
        <p class="muted" style="margin-top: 24px;">
            Si no esperabas este mensaje contacta a soporte.
        </p>
    </div>
</body>
</html>