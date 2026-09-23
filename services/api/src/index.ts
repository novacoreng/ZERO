export type HealthResponse = {
  status: "ok";
  service: "zero-api";
};

export function health(): HealthResponse {
  return { status: "ok", service: "zero-api" };
}
