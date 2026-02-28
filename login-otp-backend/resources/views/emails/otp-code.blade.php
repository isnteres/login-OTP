<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 40px; }
        .card { background: white; border-radius: 12px; padding: 40px; max-width: 480px; margin: auto; }
        .title { color: #1e40af; font-size: 22px; font-weight: bold; }
        .code { font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #1e40af;
                background: #dbeafe; padding: 20px; border-radius: 8px;
                text-align: center; margin: 24px 0; }
        .muted { color: #64748b; font-size: 14px; }
    </style>
</head>
<body>
    <div class="card">
        <p class="title">Hola, {{ $userName }} 👋</p>
        <p>Tu código de verificación es:</p>
        <div class="code">{{ $code }}</div>
        <p class="muted">Este código expira en <strong>10 minutos</strong>.</p>
        <p class="muted">Si no solicitaste este código, ignora este mensaje.</p>
    </div>
</body>
</html>