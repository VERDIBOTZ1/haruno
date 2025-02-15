let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
let fetch = require('node-fetch')

let handler = async (m, { conn, args, usedPrefix, isPrems, isOwner, command }) => {
    if (!args[0]) throw `Harap masukkan link group yang ingin dimasukkan bot nya.\n\nContoh: *${usedPrefix + command} https://chat.whatsapp.com/TIANANMEN1989`
    let [_, code] = args[0].match(linkRegex) || []
    let user = db.data.users[m.sender]
    if (!code) throw 'Link Salah'
    if (!(isPrems || isOwner)) {
        let hako = await conn.query({
            json: ["query", "invite", code],
            expect200: true
          })
          if (!hako) throw hako        
        if(db.data.chats[hako.id].trial) await conn.send3Button(m.chat, `Group tersebut sudah pernah melakukan trial 1 hari. Silahkan menyewa bot untuk memasukkan bot ke dalam group.`, watermark, 'Sewa', '.sewa', 'Owner', '.owner', 'Group Official', '.harunoff', m)
        if (user.joincount === 1 ) throw `Kamu sudah melebihi token/limit memasukkan bot ke dalam group!`
        user.joincount += 1
        let res = await conn.acceptInvite(code)
        db.data.chats[res.gid].trial = true
        m.reply('Joining group...').then(async() => {
            var jumlahHari = 86400000 * 1
            var now = new Date() * 1
            if (now < db.data.chats[res.gid].expired) db.data.chats[res.gid].expired += jumlahHari
            else db.data.chats[res.gid].expired = now + jumlahHari
                await m.reply(`Berhasil join grup ${res.gid}\nBot akan keluar secara otomatis setelah: ${msToDate(global.db.data.chats[res.gid].expired - now)}.\nToken joincount mu: ${user.joincount}/1`)
                await conn.reply(owner[0] + '@s.whatsapp.net', `@${m.sender.split`@`[0]} telah menambahkan ${conn.user.name} ke ${res.gid}, bot akan keluar dalam waktu: ${msToDate(global.db.data.chats[res.gid].expired - now)}`, 0,  { contextInfo: { mentionedJid: [m.sender]}})
                await conn.sendButtonLoc(res.gid, await(await fetch(thumbfoto)).buffer(), `${conn.user.name} adalah bot whatsapp yang dibangun dengan Nodejs, ${conn.user.name} diundang oleh @${m.sender.split(`@`)[0]}\n\nKetik ${usedPrefix}menu untuk melihat daftar perintah\nBot akan keluar secara otomatis setelah ${msToDate(global.db.data.chats[res.gid].expired - now)}`.trim(), watermark, 'Menu', `${usedPrefix}?`, null, { contextInfo: { mentionedJid: [m.sender] } })
        })
    } else if (!isOwner) {
        if (users.joincount === 3) throw `Kamu sudah melebihi token/limit memasukkan bot ke dalam group!`
        user.joincount += 1
        let res = await conn.acceptInvite(code)
        m.reply('Joining group...').then(async() => {
            var jumlahHari = 86400000 * 30
            var now = new Date() * 1
            if (now < db.data.chats[res.gid].expired) db.data.chats[res.gid].expired += jumlahHari
            else db.data.chats[res.gid].expired = now + jumlahHari
                await m.reply(`Berhasil join grup ${res.gid}\nBot akan keluar secara otomatis setelah: ${msToDate(global.db.data.chats[res.gid].expired - now)}.\nToken joincount mu: ${user.joincount}/3`)
                await conn.reply(owner[0] + '@s.whatsapp.net', `@${m.sender.split`@`[0]} telah menambahkan ${conn.user.name} ke ${res.gid}, bot akan keluar dalam waktu: ${msToDate(global.db.data.chats[res.gid].expired - now)}`, 0,  { contextInfo: { mentionedJid: [m.sender]}})
                await conn.sendButtonLoc(res.gid, await(await fetch(thumbfoto)).buffer(), `${conn.user.name} adalah bot whatsapp yang dibangun dengan Nodejs, ${conn.user.name} diundang oleh @${m.sender.split(`@`)[0]}\n\nKetik ${usedPrefix}menu untuk melihat daftar perintah\nBot akan keluar secara otomatis setelah ${msToDate(global.db.data.chats[res.gid].expired - now)}`.trim(), watermark, 'Menu', `${usedPrefix}?`, null, { contextInfo: { mentionedJid: [m.sender] } })
        })
    } else if (isOwner) {
        if (!args[1]) throw `Masukkan format yang benar! format: .join <link> <jumlah hari>`
        let res = await conn.acceptInvite(code)
        m.reply('Joining group...').then(async() => { 
            var jumlahHari = 86400000 * args[1]
            var now = new Date() * 1
            if (now < db.data.chats[res.gid].expired) db.data.chats[res.gid].expired += jumlahHari
            else db.data.chats[res.gid].expired = now + jumlahHari
            await m.reply(`Berhasil join grup ${res.gid}\nBot akan keluar secara otomatis setelah: ${msToDate(global.db.data.chats[res.gid].expired - now)}`)
            await conn.sendButtonLoc(res.gid, await(await fetch(thumbfoto)).buffer(), `${conn.user.name} adalah bot whatsapp yang dibangun dengan Nodejs, ${conn.user.name} diundang oleh @${m.sender.split(`@`)[0]}\n\nKetik ${usedPrefix}menu untuk melihat daftar perintah\nBot akan keluar secara otomatis setelah ${msToDate(global.db.data.chats[res.gid].expired - now)}`.trim(), watermark, 'Menu', `${usedPrefix}?`, null, { contextInfo: { mentionedJid: [m.sender] } })
        })
    }
}
handler.help = ['join <chat.whatsapp.com>']
handler.tags = ['tools']

handler.command = /^join$/i

module.exports = handler

function msToDate(ms) {
    temp = ms
    days = Math.floor(ms / (24 * 60 * 60 * 1000));
    daysms = ms % (24 * 60 * 60 * 1000);
    hours = Math.floor((daysms) / (60 * 60 * 1000));
    hoursms = ms % (60 * 60 * 1000);
    minutes = Math.floor((hoursms) / (60 * 1000));
    minutesms = ms % (60 * 1000);
    sec = Math.floor((minutesms) / (1000));
    return days + " hari " + hours + " jam " + minutes + " menit";
    // +minutes+":"+sec;
}