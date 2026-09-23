# ZERO Secure Media & Metadata — Phase 15

## Trust boundary
Uploaded media remains untrusted until it passes the sanitization pipeline. Declared MIME type is metadata supplied by the client and is never treated as authoritative.

## Metadata privacy
The processing boundary removes EXIF, GPS/location tags, device/camera identifiers and other unnecessary embedded metadata before a derivative is created. Original encrypted objects remain opaque to the server; processing is performed only on explicitly authorized encrypted/decrypted processing boundaries defined by the production architecture.

## Filenames
User-visible names are normalized and sanitized. Path separators, control characters and unsafe characters are removed. Filenames are never interpreted as filesystem paths.

## Derivatives
Thumbnails, previews and transcoded variants are generated only from sanitized media. Derivatives are separate encrypted objects and must not become a plaintext privacy bypass.

## Processing isolation
Untrusted media must not be executed. Production media workers require sandboxing, resource limits, dependency pinning, no arbitrary network access, and quarantine on failure.

## Privacy
GPS and device metadata are stripped by default. Sensitive metadata must not be copied into logs, analytics or filenames.

## Limitations
A production media-processing provider/worker sandbox and audited metadata tooling remain required. The E2EE architecture must preserve the invariant that the ordinary messaging/file server cannot decrypt user content.
