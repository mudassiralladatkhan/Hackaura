import { HACKATHON_DATA } from '../data/hackathonData';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function getGroqResponse(userMessage: string): Promise<string> {
    if (!GROQ_API_KEY) {
        console.error("Missing Groq API Key");
        return "I'm currently undergoing maintenance (API Key Missing). Please contact the organizers.";
    }

    const systemPrompt = `
You are the official AI Assistant for Hackaura 2026, a National Level Hackathon organized by Vikram Sarabhai Tech Club (VSTC) at VSGM Government Polytechnic, Nipani.
Your tone is helpful, energetic, and student-friendly. Use emojis! 🚀

Knowledge Base:
${JSON.stringify(HACKATHON_DATA)}

Rules:
1. For questions about Hackaura 2026 (logistics, rules, dates), STRICTLY use the provided Knowledge Base.
2. For general questions (coding concepts, project ideas, technology trends, "what is X"), USE YOUR OWN KNOWLEDGE to be helpful and educational.
3. If a question is about Hackaura but NOT in the data, ask the user to contact coordinators rather than guessing.
3. Keep answers concise (under 3-4 sentences where possible) unless detailed workflow is asked.
4. Handle typos and spelling mistakes gracefully (e.g. "accommadation" -> Accommodation).
5. IMPORTANT: Fees are ₹600. Accommodation/Food are provided.
6. Verify answers against the 'faqs' section specifically for logistical questions.
    `;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.5,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq API Error Detail:", errorText);
            throw new Error(`Groq API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "I'm having trouble thinking right now. 😵‍💫";

    } catch (error: any) {
        console.error("Groq API Call Failed:", error);
        return "I'm having trouble connecting to my brain. Please try again in a moment! 🧠⚡";
    }
}
