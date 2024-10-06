const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

let isActivityDone = false;

const client = new Client({
    authStrategy: new LocalAuth() // Simpan session agar tidak perlu scan ulang QR code
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    askActivity();  // Mulai mengecek kegiatan setelah client siap
});

client.on('message', message => {
    if (message.body.toLowerCase() === 'udah') {
        isActivityDone = true; // Set aktivitas sudah selesai
        console.log('Aktivitas selesai.');
    }
});

client.initialize();

function askActivity() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Reset status jika waktu menunjukkan 00:01
    if (hours === 0 && minutes === 1) {
        isActivityDone = false;
    }

    // Kirim pesan jika aktivitas belum selesai
    if (!isActivityDone) {
        client.sendMessage('nomorpenerima@s.whatsapp.net', 'Apakah sudah melakukan kegiatan tertentu?')
        .then(response => {
            console.log('Pesan terkirim:', response.body);
        })
        .catch(err => {
            console.error('Gagal mengirim pesan:', err);
        });
    }

    // Ulangi fungsi ini setiap 1 menit
    setTimeout(askActivity, 60000);
}
