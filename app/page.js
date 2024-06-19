// pages/index.js (or any server-side route in Next.js)

import { createClient } from "@deepgram/sdk";
import fs from "fs";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};

export default function Home() {
  const text =
    "Hey......,.... Today i am going to take you in the world of aliens, interested naa";

  const getAudio = async () => {
    try {
      const response = await deepgram.speak.request(
        { text },
        {
          model: "aura-hera-en",
          encoding: "linear16",
          container: "wav",
        }
      );

      const stream = await response.getStream();
      const buffer = await getAudioBuffer(stream);

      fs.writeFile("public/output.wav", buffer, (err) => {
        if (err) {
          console.error("Error writing audio to file:", err);
        } else {
          console.log("Audio file written to output.wav");
        }
      });
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  };

  getAudio();

  return (
    <div>
      <h1>Generating Audio</h1>
      <p>Check console for status...</p>
    </div>
  );
}
