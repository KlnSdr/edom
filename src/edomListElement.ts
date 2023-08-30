class edomListElement extends edomElement {
    public addEntry(text: string) {
        const bullet: edomElement = edom.newElement("li");
        bullet.text = text;

        this.addChild(bullet);
    }

    public addEntryLink(text: string, target: string): void;
    public addEntryLink(
        text: string,
        clickHandler: (self: edomElement) => void
    ): void;

    public addEntryLink(
        text: string,
        doOnClick: string | ((self: edomElement) => void)
    ) {
        const bullet: edomElement = edom.newElement("li");

        const link: edomAnchorElement = edom.newElement("a") as edomAnchorElement;
        link.text = text;

        if (typeof doOnClick === "string") {
            link.href(doOnClick);
        } else if (typeof doOnClick === "function") {
            link.addClick("", () => {
                doOnClick(link);
            });

            link.href("javascript:void(0);");
        }

        bullet.addChild(link);
        this.addChild(bullet);
    }
}
