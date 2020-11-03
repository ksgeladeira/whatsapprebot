const { create } = require('@open-wa/wa-automate')
const msgHandler = require('./msgHandler')
const welcome = require('./lib/welcome')
const fs = require('fs-extra')
const serverOption = {
    headless: true,
    cacheEnabled: false,
    useChrome: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
    serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
    serverOption.browserRevision = '737027'
} else if (opsys === 'darwin') {
    serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async (client) => {
        global.amdownloaden = [];
        global.sclient = client;
        console.log('[SERVER] Server Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
        })
        // listening on message
        client.onMessage((message) => {
            msgHandler(client, message)
        })

       
         client.onGlobalParicipantsChanged((async (heuh) => {
            await welcome(client, heuh)
            //left(client, heuh)
         }))
        
        client.onAddedToGroup((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 1) { 
            	client.sendText(chat.id, `test ${totalMem} members, Its needs atleast 30 members to activate the services`).then(() => client.leaveGroup(chat.id))
            	client.deleteChat(chat.id)
            } else {
                client.sendText(chat.groupMetadata.id, `Obrigado por me adicionar*${chat.contact.name}*. Use !help para ver os comandos!`)
            }
        })

        // listening on Incoming Call
        client.onIncomingCall((call) => {
            client.sendText(call.peerJid, '...')
            client.contactBlock(call.peerJid)
            ban.push(call.peerJid)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
        })
    }

create('session', serverOption)
    .then(async (client) => startServer(client))
    .catch((error) => console.log(error))
