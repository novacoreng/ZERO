# ZERO Universal File Engine — Phase 10

## Scope
ZERO accepts arbitrary individual file types as opaque file objects. Folders are not uploaded as directories; the client packages a folder locally, such as a ZIP archive, and uploads that resulting file.

## Object model
Each file has an opaque ID, display name, byte size, declared media type, lifecycle state, packaging mode, and integrity digest. The server does not need to understand the file's contents.

## Security
Client-side encryption occurs before upload in the later file-encryption phase. The server never executes uploaded files and does not index their content. File metadata must be treated as potentially sensitive.

## Validation
The client and API validate name, size, media type, packaging mode and integrity metadata. MIME type is a hint, not a trust boundary. Security-sensitive file handling must not execute or dynamically load uploaded content.

## Limits
The contract currently caps an object at 10 GiB and defines resumable chunks between 256 KiB and 16 MiB. These are product-level limits and can be tightened by deployment configuration.

## Lifecycle
CREATED -> READY -> UPLOADING -> AVAILABLE is the normal path. Failure, expiration and destruction are explicit terminal paths. Phase 12 will add resumable upload execution.

## Explicit non-goals
- No folder upload protocol.
- No server-side file execution.
- No server-side content indexing.
- No client-side encryption implementation in this phase.
- No resumable upload runtime in this phase.
