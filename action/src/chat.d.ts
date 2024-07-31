export declare class Chat {
    private chatAPI;
    constructor(apiKey: string);
    private generatePrompt;
    codeReview: (patch: string) => Promise<string>;
}
