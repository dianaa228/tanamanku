<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $token,
        public string $email,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Password Tanamanku 🌱',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml(),
        );
    }

    private function buildHtml(): string
    {
        $resetUrl = config('app.frontend_url', 'http://localhost:3000')
            . "/reset-password?token={$this->token}&email={$this->email}";

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body { font-family: 'Poppins', Arial, sans-serif; background: #FFFBF5; margin: 0; padding: 20px; }
                .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #16A34A, #22C55E); padding: 40px 30px; text-align: center; }
                .header h1 { color: white; font-size: 24px; margin: 0; }
                .header .emoji { font-size: 48px; margin-bottom: 12px; }
                .body { padding: 30px; }
                .body p { color: #14532D; font-size: 14px; line-height: 1.6; }
                .btn { display: block; width: 100%; padding: 16px; background: #16A34A; color: white; text-align: center; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 16px; margin: 24px 0; }
                .btn:hover { background: #15803D; }
                .token-box { background: #F0FDF4; border: 1px dashed #16A34A; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0; }
                .token-box code { font-size: 18px; font-weight: 700; color: #15803D; letter-spacing: 2px; }
                .footer { padding: 20px 30px; background: #F0FDF4; text-align: center; }
                .footer p { font-size: 11px; color: #14532D; opacity: 0.6; margin: 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <div class='emoji'>🔑</div>
                    <h1>Reset Password</h1>
                </div>
                <div class='body'>
                    <p>Halo <strong>{$this->name}</strong>,</p>
                    <p>Kami menerima permintaan untuk mereset password akun Tanamanku kamu. Klik tombol di bawah untuk membuat password baru:</p>

                    <a href='{$resetUrl}' class='btn'>🔒 Ubah Password</a>

                    <p>Atau masukkan kode ini secara manual:</p>
                    <div class='token-box'>
                        <code>{$this->token}</code>
                    </div>

                    <p style='font-size:12px; color:#9CA3AF;'>⏰ Link ini berlaku selama <strong>60 menit</strong>. Jika kamu tidak meminta reset password, abaikan email ini.</p>
                </div>
                <div class='footer'>
                    <p>© 2026 Tanamanku — Urban Gardening Platform</p>
                    <p>Email ini dikirim otomatis, jangan balas.</p>
                </div>
            </div>
        </body>
        </html>";
    }
}
