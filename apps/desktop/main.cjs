const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const TEST_URL = process.env.ZERO_WEB_URL || "https://zero-five-alpha.vercel.app/";
function createWindow(){
 const win=new BrowserWindow({width:1440,height:920,minWidth:980,minHeight:680,backgroundColor:"#090c10",title:"ZERO",webPreferences:{preload:path.join(__dirname,"preload.cjs"),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 win.removeMenu();
 win.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\//.test(url))shell.openExternal(url);return{action:"deny"};});
 win.webContents.on("will-navigate",(event,url)=>{if(!url.startsWith(TEST_URL)){event.preventDefault();}});
 win.loadURL(TEST_URL);
}
app.whenReady().then(()=>{createWindow();app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
