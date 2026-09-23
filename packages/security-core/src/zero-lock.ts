export type LocalLockMethod="DEVICE_BIOMETRIC"|"ZERO_PIN"|"DEVICE_PASSCODE";
export type LocalLockState="UNLOCKED"|"LOCKED"|"PANIC_LOCKED"|"DESTROYING";
export type PanicAction="LOCK_NOW"|"HIDE_CONTENT"|"CLEAR_CLIPBOARD"|"DESTROY_LOCAL_KEYS";
export type LocalPrivacyPolicy={autoLockSeconds:number;lockOnBackground:boolean;lockOnDeviceChange:boolean;clipboardClearSeconds:number;screenshotProtectionRequested:boolean;panicActions:readonly PanicAction[];};
export const ZERO_LOCK_POLICY=Object.freeze({minAutoLockSeconds:15,maxAutoLockSeconds:86400,secureStorageRequired:true,privateKeysStayLocal:true,biometricIsPlatformGate:true,devicePasscodeSupported:true,panicRequiresExplicitConfirmation:true,clipboardClearRequired:true,backgroundContentHidden:true,localCacheEncryptionRequired:true});
export function validateAutoLockSeconds(v:number):boolean{return Number.isInteger(v)&&v>=ZERO_LOCK_POLICY.minAutoLockSeconds&&v<=ZERO_LOCK_POLICY.maxAutoLockSeconds}
export function canUnlock(method:LocalLockMethod,deviceAvailable:boolean):boolean{return deviceAvailable&&["DEVICE_BIOMETRIC","ZERO_PIN","DEVICE_PASSCODE"].includes(method)}
export function nextLockState(state:LocalLockState,event:"LOCK"|"PANIC"|"UNLOCK"|"DESTROY_START"|"DESTROY"):LocalLockState{if(event==="PANIC")return "PANIC_LOCKED";if(event==="LOCK"&&state==="UNLOCKED")return "LOCKED";if(event==="UNLOCK"&&["LOCKED","PANIC_LOCKED"].includes(state))return "UNLOCKED";if(event==="DESTROY_START")return "DESTROYING";if(event==="DESTROY"&&state==="DESTROYING")return "PANIC_LOCKED";return state}
