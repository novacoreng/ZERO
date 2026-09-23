export type SupportedLocale="en-NG"|"en-US"|"en-GB"|"yo-NG"|"ha-NG"|"ig-NG";
export type TextDirection="LTR"|"RTL";
export type AccessibilityPreference={reducedMotion:boolean;largeText:boolean;highContrast:boolean;screenReaderHints:boolean;};
export const ACCESSIBILITY_LOCALIZATION_POLICY=Object.freeze({
wcagTarget:"WCAG_2_2_AA",
keyboardNavigationRequired:true,
focusVisibleRequired:true,
screenReaderSemanticsRequired:true,
reducedMotionSupported:true,
textScalingSupported:true,
highContrastSupported:true,
rtlArchitectureReady:true,
securityCopyMustBeTranslatable:true,
fallbackLocale:"en-US",
localeDetectionClientOnly:true,
sensitiveContentNotSentForTranslation:true
});
const RTL_LOCALES:ReadonlySet<string>=new Set([]);
export function isSupportedLocale(v:string):v is SupportedLocale{return ["en-NG","en-US","en-GB","yo-NG","ha-NG","ig-NG"].includes(v)}
export function directionForLocale(locale:SupportedLocale):TextDirection{return RTL_LOCALES.has(locale)?"RTL":"LTR"}
export function validateLocaleTag(v:string):boolean{return /^[a-z]{2}(?:-[A-Z]{2})?$/.test(v)}
export function hasAccessibleLabel(v:string):boolean{return v.trim().length>0}
export function shouldReduceMotion(pref:AccessibilityPreference):boolean{return pref.reducedMotion}
