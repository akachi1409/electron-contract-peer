const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('contactapi', {
    receiveContact: (contactInstance) => {
        ipcRenderer.on('received:contact', contactInstance)
    },
    getOldContacts: () => {
        ipcRenderer.send('get:oldcontacts')
    },
    addContact: (contactInstance)=>{
        ipcRenderer.send('send:contact', contactInstance)
    }
})