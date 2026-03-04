<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Bienvenido al sistema</title>
</head>
<body style="margin:0;padding:0;background:#0f1623;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1623;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#151d2e;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

          {{-- Header --}}
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.08em;text-transform:uppercase;">
                Panel de Administración
              </p>
              <h1 style="margin:8px 0 0;font-size:26px;font-weight:700;color:#ffffff;">
                ¡Bienvenido al sistema!
              </h1>
            </td>
          </tr>

          {{-- Body --}}
          <tr>
            <td style="padding:36px 40px;">

              <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                Hola, <strong style="color:white;">{{ $name }}</strong>.<br/>
                Tu cuenta ha sido creada. Estas son tus credenciales de acceso:
              </p>

              {{-- Credenciales --}}
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">

                {{-- Email --}}
                <tr>
                  <td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;margin-bottom:10px;">
                    <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:0.08em;text-transform:uppercase;">
                      Correo electrónico
                    </p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#a5b4fc;">
                      {{ $email }}
                    </p>
                  </td>
                </tr>

                <tr><td style="height:10px;"></td></tr>

                {{-- Contraseña temporal --}}
                <tr>
                  <td align="center" style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:24px 20px;">
                    <p style="margin:0 0 8px;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;">
                      Contraseña temporal
                    </p>
                    <p style="margin:0;font-size:32px;font-weight:700;color:#a5b4fc;letter-spacing:6px;font-family:'Courier New',monospace;">
                      {{ $tempPassword }}
                    </p>
                  </td>
                </tr>

              </table>

              {{-- Aviso cambio de contraseña --}}
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:rgba(99,102,241,0.07);border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6;">
                      🔒 Al iniciar sesión por primera vez <strong style="color:rgba(255,255,255,0.7);">no se te pedirá código OTP</strong>.
                      Se te pedirá que establezcas una contraseña nueva antes de continuar.
                    </p>
                  </td>
                </tr>
              </table>

              {{-- Advertencia --}}
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:10px;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6;">
                      ⚠️ <strong style="color:rgba(255,255,255,0.7);">No compartas esta contraseña</strong> con nadie.
                      Es de uso único y deberás cambiarla al ingresar.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.3);line-height:1.6;">
                Si tenés algún problema para acceder, contactá al administrador del sistema.
              </p>

            </td>
          </tr>

          {{-- Footer --}}
          <tr>
            <td style="border-top:1px solid rgba(255,255,255,0.06);padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);">
                Este es un correo automático · No respondas este mensaje
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>