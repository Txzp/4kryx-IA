export const AIService = {
  async sendMessage(messages, systemPrompt, onChunk, onError, onComplete) {
    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept":        "text/plain"
        },
        body: JSON.stringify({
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          model:    "openai",
          stream:   false
        })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const text  = await response.text();
      const words = text.split(" ");

      for (let i = 0; i < words.length; i++) {
        const spacing = i < words.length - 1 ? " " : "";
        onChunk(words[i] + spacing);
        await new Promise(r => setTimeout(r, 20));
      }

      onComplete();
    } catch (error) {
      console.error("[4kryx AI] API request failed", error);
      onError("Error al conectar con la IA. Reintenta.");
    }
  }
};