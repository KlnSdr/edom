class edom {
  public static body: edomElement;

  private static _allElements: edomElement[];
  public static get allElements(): edomElement[] {
    return edom._allElements;
  }

  public static init() {
    edom._allElements = [];

    edom.body = edom.fromExisting(document.body);
    edom.body.id = "body";
  }

  public static newElement(
    tagName: string
  ):
    | edomElement
    | edomInputElement
    | edomAnchorElement
    | edomListElement
    | edomImageElement
    | edomLabelElement
    | edomTAElement {
    switch (tagName.toLowerCase()) {
      case "input":
        const element: edomInputElement = new edomInputElement(
          false,
          tagName
        ) as edomInputElement;
        element.addChange("onInput", (self: edomInputElement) => {
          self.value = (self.element as HTMLInputElement).value;
        });
        return element;

      case "textarea":
        const ta: edomTAElement = new edomInputElement(
          false,
          tagName
        ) as edomTAElement;
        ta.addChange("onInput", (self: edomTAElement) => {
          self.value = (self.element as HTMLTextAreaElement).value;
        });
        return ta;
      case "a":
        return new edomAnchorElement(false, tagName);
      case "ul":
      case "ol":
        return new edomListElement(false, tagName);
      case "img":
        return new edomImageElement(false, tagName);
      case "label":
        return new edomLabelElement(false, tagName);
      default:
        return new edomElement(false, tagName);
    }
  }

  public static fromExisting(element: HTMLElement) {
    edom.iterateChildren(element);
    return new edomElement(true, "", element);
  }

  private static iterateChildren(element: HTMLElement) {
    edom.getChildren(element).forEach((child: Element) => {
      console.log(child);
    });
  }

  private static getChildren(element: HTMLElement): Array<Element> {
    return Array.from(element.children);
  }

  public static findById(
    id: string
  ):
    | edomElement
    | edomInputElement
    | edomAnchorElement
    | edomListElement
    | edomImageElement
    | edomLabelElement
    | edomTAElement
    | undefined {
    let toReturn: edomElement | undefined = undefined;
    edom.allElements.forEach((element: edomElement) => {
      if (element.id === id) {
        toReturn = element;
      }
    });

    return toReturn;
  }

  public static break() {
    return edom.newElement("br");
  }

  public static fromTemplate(
    template: edomTemplate | edomTemplate[],
    parent: edomElement | null = null
  ) {
    if (parent === null) {
      if ((template as edomTemplate).classes != undefined) {
        edom.body.applyStyle(...((template as edomTemplate).classes || []));
      }
      this.fromTemplate(
        (template as edomTemplate).children as edomTemplate[],
        edom.body
      );
    } else {
      for (let i = 0; i < (template as edomTemplate[]).length; i++) {
        const _template: edomTemplate = (template as edomTemplate[])[
          i
        ] as edomTemplate;
        const currentChild: edomElement = edom.newElement(_template.tag);
        if (_template.id != undefined) {
          currentChild.id = _template.id;
        }
        if (_template.text != undefined) {
          currentChild.text = _template.text;
        }
        if (_template.value != undefined) {
          (currentChild as edomInputElement).value = _template.value;
        }
        if (_template.type != undefined) {
          (currentChild as edomInputElement).type = _template.type;
        }
        if (_template.checked != undefined) {
          (currentChild as edomInputElement).checked = _template.checked;
          currentChild.addClick("clickChangeState", (self: edomElement) => {
            if (
              (self as edomInputElement).checked ===
              (self.element as HTMLInputElement).checked
            ) {
              return;
            }
            (self as edomInputElement).checked = (
              self.element as HTMLInputElement
            ).checked;
          });
        }
        if (_template.classes != undefined) {
          currentChild.applyStyle(..._template.classes);
        }
        if (_template.src != undefined) {
          (currentChild as edomImageElement).src = _template.src;
        }
        if (_template.for != undefined) {
          (currentChild as edomLabelElement).for = _template.for;
        }
        if (_template.name != undefined) {
          (currentChild as edomInputElement).name = _template.name;
        }
        if (_template.groupID != undefined) {
          (currentChild as edomInputElement).groupID = _template.groupID;
        }
        if (_template.target != undefined) {
          (currentChild as edomAnchorElement).href(_template.target);
        }
        if (_template.handler != undefined) {
          _template.handler.forEach((handler: handlerPreObject) => {
            currentChild.addEvent(
              handler.type,
              handler.id,
              (self: edomElement) => {
                handler.body(self);
              }
            );
          });
        }
        parent.addChild(currentChild);

        if (_template.children != undefined) {
          this.fromTemplate(_template.children, currentChild);
        }
      }
    }
  }
}
