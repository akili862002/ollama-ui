export const generateOpenAIChatCompletion = async (
  token: string = "",
  body: any,
  url: string = "https://e4e7-2001-ee0-500f-1f10-4d00-c738-e5ee-f341.ngrok-free.app"
  // url: string = "http://localhost:3000"
): Promise<[Response | null, AbortController]> => {
  const controller = new AbortController();
  let error = null;

  const res = await fetch(
    `${url}/superai/chat-stream/phi3?query=${body.message}`,
    // `${url}/superai/chat-stream/llama3?query=${body.message}`,
    {
      signal: controller.signal,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
    }
  ).catch((err) => {
    console.log(err);
    error = err;
    return null;
  });

  if (error) {
    throw error;
  }

  return [res, controller];
};
