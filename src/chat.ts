import OpenAI from "openai";

const resource = process.env.OPENAI_API_RESOURCE;
const model = process.env.OPENAI_API_MODEL || "gpt-4o";
const apiVersion = process.env.OPENAI_API_VERSION;

export class Chat {
  private chatAPI: OpenAI;

  constructor(apiKey: string) {
    this.chatAPI = new OpenAI({
      apiKey,
      baseURL: `https://${resource}.openai.azure.com/openai/deployments/${model}`,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: { "api-key": apiKey },
    });
  }

  private generatePrompt = (patch: string) => {
    const answerLanguage = process.env.LANGUAGE
      ? `Answer me in ${process.env.LANGUAGE},`
      : "";

    const prompt =
      process.env.PROMPT ||
      "Below is a code patch, please help me do a brief code review on it. Any bug risks and/or improvement suggestions are welcome:";

    return `${prompt}, ${answerLanguage}:
    ${patch}
    `;
  };

  public codeReview = async (patch: string) => {
    if (!patch) {
      return "";
    }

    console.time("code-review cost");
    const prompt = this.generatePrompt(patch);

    const res = await this.chatAPI.chat.completions.create({
      model,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are a kind code reviewer.",
        },
        { role: "user", content: prompt },
      ],
    });

    console.timeEnd("code-review cost");
    return res.choices[0]?.message?.content || "";
  };
}
