"use server";

import { createJob } from "@/lib/db/airtable";

export async function createJobAction(formData: FormData) {
  const job_identifier = formData.get("job_identifier") as string;
  const title = formData.get("title") as string;

  await createJob({
    job_identifier,
    title,
    status: "active",
  });
}
