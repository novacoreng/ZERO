export type PresenceVisibility="EVERYONE"|"CONTACTS"|"NOBODY";
export type ReceiptVisibility="EVERYONE"|"CONTACTS"|"NOBODY";
export type TypingVisibility="EVERYONE"|"CONTACTS"|"NOBODY";
export type ForwardingPolicy="ALLOW"|"WARN"|"BLOCK";
export type NotificationPrivacy="FULL"|"SENDER_ONLY"|"HIDDEN";
export type PrivacyControls={readReceipts:ReceiptVisibility;typingIndicators:TypingVisibility;presence:PresenceVisibility;lastSeen:PresenceVisibility;forwarding:ForwardingPolicy;notificationPrivacy:NotificationPrivacy;screenshotProtectionRequested:boolean;linkPreviews:boolean;profileDiscovery:boolean;};
export const DEFAULT_PRIVACY_CONTROLS:Readonly<PrivacyControls>=Object.freeze({readReceipts:"CONTACTS",typingIndicators:"CONTACTS",presence:"CONTACTS",lastSeen:"CONTACTS",forwarding:"WARN",notificationPrivacy:"SENDER_ONLY",screenshotProtectionRequested:true,linkPreviews:false,profileDiscovery:false});
export function canExposePresence(setting:PresenceVisibility,viewerIsContact:boolean):boolean{return setting==="EVERYONE"||(setting==="CONTACTS"&&viewerIsContact)}
export function canSendReadReceipt(setting:ReceiptVisibility,viewerIsContact:boolean):boolean{return canExposePresence(setting,viewerIsContact)}
export function canShowTyping(setting:TypingVisibility,viewerIsContact:boolean):boolean{return canExposePresence(setting,viewerIsContact)}
export function shouldHideNotificationContent(setting:NotificationPrivacy):boolean{return setting!=="FULL"}
export function forwardingAllowed(policy:ForwardingPolicy):boolean{return policy==="ALLOW"}
