require('dotenv').config()
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const Hyperswarm = require('hyperswarm')
const Corestore = require('corestore')
const Hyperbee = require('hyperbee');
const b4a = require('b4a')
const goodbye = require('graceful-goodbye')

console.log("===== Electron app is starting =====")
const conns = []


const initWindow = async ()=> {
  const store = new Corestore('storage')

  const swarm = new Hyperswarm()
  goodbye(() => swarm.destroy())

  swarm.on('connection', (conn) => {
    const name = b4a.toString(conn.remotePublicKey, 'hex');
    console.log('*Got Connection:', name, '*');
    const data = []
    for await (const contact of bee.createReadStream()) {
        // console.log(book);
        data.push(contact.value.toString());
    }
    conn.write(JSON.stringify(data))
    conns.push(conn)
    conn.once('close', () => conns.splice(conns.indexOf(conn), 1))
    conn.on('data', async (data) => {
        try {
            data = b4a.toString(data, 'utf-8')
            data = JSON.parse(data)
            if (Array.isArray(data)) {
                for (const contact of data) {
                    await bee.put(`ContacAt${contact.timeStamp}`, JSON.stringify(contact))
                }
            }
            else{
              window.wenContents.send("received:contact", data);
              await bee.put(`ContacAt${data.timeStamp}`, JSON.stringify(data))
            }
        }
        catch(err){
            console.log("=== ERR:", err)
            return;
        }
    })
  })
  
  const core = store.get({ name: 'contact-core' })
  const bee = new Hyperbee(core, {
      keyEncoding: 'utf-8',
      valueEncoding: 'utf-8',
  });
  await core.ready();
  console.log("===== Corestore is ready =====")

  topic = b4a.from(process.env.TOPIC, 'hex');
  discovery = swarm.join(topic, { server: true, client: true })
  
  
  discovery.flushed().then(() => {
    console.log('joined topic:', b4a.toString(topic, 'hex'))
  })
  window = new BrowserWindow({
    webPreferences: {
      // eslint-disable-next-line no-undef
      preload: path.join(__dirname) + '/middleware/preload.js',
    },
  })
  ipcMain.on('send:contact', async( event, contactInstance)=>{
    contactInstance = JSON.parse(contactInstance);
    await bee.put(`ContacAt${contactInstance.timeStamp}`, JSON.stringify(contactInstance));
    for (const conn of conns) {
      conn.write(JSON.stringify(contactInstance))
    }
  })
  ipcMain.on('get:oldcontacts', async()=>{
    for await (const contact of bee.createReadStream()){
      window.webContents.send('received:contact', JSON.parse(contact.value.toString()))
    }
  })
  window.loadURL('http://localhost:3000')
}
app.whenReady().then(() => {
  initWindow()
})