class edomTAElement extends edomInputElement {
    public setContent(text: string) {
        (this.element as HTMLTextAreaElement).value = text;
        this.value = text;
    }
}
