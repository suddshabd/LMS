import OpenAI from "openai";

export const generateDescription = async (title) => {
    if (!title || typeof title !== "string") return null;

    const apiKey = process.env.OPENAI_API_KEY;

    // If API key is present, call OpenAI to get a concise course description
    if (apiKey) {
        try {
            const client = new OpenAI({ apiKey });

            const prompt = `Write a concise, engaging 2-3 sentence course description for a course titled: "${title}". Focus on learning outcomes, target audience, and practical benefits.`;

            const resp = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150,
            });

            const text = resp?.choices?.[0]?.message?.content;
            if (text) return text.trim();
        } catch (err) {
            // Let caller handle fallback / logging
            throw err;
        }
    }

    // Fallback: simple templated description when no API key available
    return `Learn ${title} with this concise course designed to deliver practical skills and real-world examples. Ideal for learners who want quick, applicable knowledge and step-by-step guidance.`;
};
