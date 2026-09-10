export async function readApiResponse(response) {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* Proxy errors can be HTML. */
  }
  if (!response.ok)
    throw new Error(
      data?.message ||
        (response.status >= 500
          ? "Login service is temporarily unavailable. Please try again shortly."
          : "Request failed. Please check your details and retry."),
    );
  if (!data)
    throw new Error("The server returned an empty response. Please retry.");
  return data;
}
