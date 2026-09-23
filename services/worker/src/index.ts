export type WorkerJob = {
  id: string;
  type: "placeholder";
};

export function validateJob(job: WorkerJob): boolean {
  return Boolean(job.id) && job.type === "placeholder";
}
