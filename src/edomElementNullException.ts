class edomElementNullException {
    message: string;
    constructor(message: string) {
        this.message = message;
        console.error(message);
    }
}
