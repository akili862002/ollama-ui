import { useState } from "react";
import LOGO from "./assets/icon32.png";
import { generateOpenAIChatCompletion } from "./utils/openai";
import Markdown from "react-markdown";
import { SvgSpinners3DotsBounce } from "./icons";

function App() {
  const [query, setQuery] = useState<string>("");
  const [ask, setAsk] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    setAnswer("");
    setQuery("");
    setAsk(query);
    setLoading(true);
    try {
      const [res, controller] = await generateOpenAIChatCompletion("", {
        stream: true,
        message: query,
      });

      const reader = res.body.getReader();
      const chunks = [];
      let done, value;
      while (!done) {
        ({ value, done } = await reader.read());
        const text = new TextDecoder().decode(value);
        console.log(text);
        setAnswer((prev) => prev + text);
        if (done) {
          return chunks;
        }
        chunks.push(value);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-5 flex flex-col items-center py-10 ">
      <div className="max-w-3xl w-full">
        <header className="pb-4 flex gap-2 items-center flex-shrink-0">
          <img src={LOGO} alt="logo" className="w-16 h-16" />
        </header>
        <div className=" bg-neutral-100 rounded-lg p-6 flex-1">
          <div>I'm a Super AI. Ask me anything!</div>
          {ask && <div className="text-right">{ask}</div>}
          {!answer && loading && (
            <SvgSpinners3DotsBounce className="h-6 w-6 mt-6 text-neutral-600" />
          )}
          {answer && (
            <div className="mt-6">
              <Markdown>{answer}</Markdown>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 mt-6">
          <div className="flex gap-3">
            <input
              disabled={loading}
              value={query}
              className="px-5 py-3 border w-full outline-none focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700 rounded-lg"
              placeholder="Ask anything..."
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                  e.preventDefault();
                }
              }}
            />
            <button
              type="button"
              className="h-full bg-black text-white px-6 py-3 rounded-lg disabled:bg-neutral-500"
              onClick={handleSend}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
