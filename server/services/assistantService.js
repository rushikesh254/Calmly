import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getSupportiveAdvice = async (req, res) => {
	try {
		const { message } = req.body;
		if (!message || typeof message !== "string") {
			return res.status(400).json({ error: "Message is required" });
		}

		const systemPrompt = `You are a compassionate mental health support assistant named Calmly.
Provide brief, empathetic, non-clinical guidance. Avoid medical diagnoses.
Encourage professional help if the user expresses severe distress or self-harm thoughts.`;

		const completion = await client.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: message },
			],
			max_tokens: 300,
			temperature: 0.8,
		});

		const aiText =
			completion.choices?.[0]?.message?.content?.trim() ||
			"Sorry, I could not generate a response.";
		res.json({ response: aiText });
	} catch (err) {
		console.error("Assistant error:", err);
		const status = err.status || 500;
		res.status(status).json({ error: "Failed to generate advice" });
	}
};
