class edomAnchorElement extends edomElement {
    public target: string = "";

    public href(location: string) {
        this.target = location;
        (this.element as HTMLAnchorElement).href = this.target;
    }
}
