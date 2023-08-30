class edomImageElement extends edomElement {
    private _src: string = "";
    public get src(): string {
        return this._src;
    }
    public set src(src: string) {
        this._src = src;
        (this.element as HTMLImageElement).src = this.src;
    }
}
