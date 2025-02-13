import { postAsync } from "./request";

export async function updateLoadMediaByCourse({ file }) {
  const formData = new FormData();
  if (file) formData.append("files", file);
  const url = "/api/upload";
  const response = await postAsync(url, formData);
  return response;
}
