# ZERO Accessibility & Localization — Phase 34

ZERO targets WCAG 2.2 AA-oriented accessibility.

## Accessibility
Keyboard navigation, visible focus, semantic labels, screen-reader support, reduced motion, text scaling and high-contrast presentation are required foundations. Security-critical actions must remain understandable and operable with assistive technology.

## Localization
The architecture supports locale-aware UI copy and formatting. Initial locale set includes en-NG, en-US, en-GB, yo-NG, ha-NG and ig-NG. Locale detection is client-side and falls back to en-US.

## Direction
The layout system is direction-aware so RTL locales can be added without restructuring the application.

## Privacy
Sensitive message content and private cryptographic material must never be sent to translation services. Translation operates on product UI resources, not private communications.

## Limitations
Full UI implementation across web/mobile/desktop, professional translations, RTL locale addition, accessibility audit, screen-reader/device testing and independent legal/privacy review remain required.
