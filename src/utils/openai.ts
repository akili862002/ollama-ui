export const generateOpenAIChatCompletion = async (
  token: string = "",
  body: any
): Promise<[Response | null, AbortController]> => {
  const controller = new AbortController();
  let error = null;

  const res = await fetch(
    `${import.meta.env.VITE_API_URI}/superai/chat-stream/${
      import.meta.env.VITE_MODEL
    }?query=${body.message}`,
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
