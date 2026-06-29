/**
 * @module OpenRouterService
 * @description network layer for openrouter api communication
 */

import { StorageManager } from "../utils/storage.js"

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

export const OpenRouterService = {
    // send full chat history to openrouter and listen to stream chunks
    async sendMessageStream(messages, onChunk, onError, onComplete) {
        const token = StorageManager.get("openroutertoken")
        const model = StorageManager.get("selectedmodel")

        if (!token) {
            onError("openrouter token is missing go to settings")
            return
        }

        try {
            const response = await fetch(OPENROUTER_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://github.com/Txzp/4kryx-IA",
                    "X-Title": "4kryx AI Discord Plugin"
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    stream: true
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData?.error?.message || `http error status ${response.status}`)
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder("utf-8")
            let buffer = ""

            // read incoming stream buffer chunks
            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split("\n")
                
                // save last partial line back to buffer
                buffer = lines.pop()

                for (const line of lines) {
                    const cleanedLine = line.trim()
                    if (!cleanedLine) continue
                    if (cleanedLine === "data: [DONE]") continue

                    if (cleanedLine.startsWith("data: ")) {
                        try {
                            const parsed = JSON.parse(cleanedLine.slice(6))
                            const tokenText = parsed.choices[0]?.delta?.content || ""
                            if (tokenText) {
                                onChunk(tokenText)
                            }
                        } catch (parseError) {
                            // ignore malformed clean lines chunks
                        }
                    }
                }
            }

            // stream finished successfully
            onComplete()

        } catch (error) {
            console.error("[4kryx AI] stream request failed", error)
            onError(error.message || "unknown network error occurred")
        }
    }
}