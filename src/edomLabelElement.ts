class edomLabelElement extends edomElement {
    private _for: string = "";
    public get for(): string {
        return this._for;
    }

    public set for(htmlFor: string) {
        this._for = htmlFor;
        (this.element as HTMLLabelElement).htmlFor = this._for;
    }
}
