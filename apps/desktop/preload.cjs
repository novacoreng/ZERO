const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("ZERO_DESKTOP",{platform:process.platform,testBuild:true});
