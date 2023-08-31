class edomRouter {
  private static routes: { [key: string]: Component } = {};

  private constructor() {
    onpopstate = (_ev: PopStateEvent) => {
      edomRouter.goTo(window.location.pathname, false);
    };
  }

  public static goTo(route: string, pushHistory: boolean = true) {
    edom.body.children.forEach((child) => child.delete());

    let ui: Component | undefined = this.routes[route];
    if (ui === undefined) {
      ui = this.routes["fallback"];
    }

    ui.render(edom.body);

    if (pushHistory) {
      history.pushState(null, "", route);
    }
  }

  public static setFallback(ui: Component) {
    this.routes["fallback"] = ui;
  }

  public static addRoute(path: string, ui: Component) {
    this.routes[path] = ui;
  }
}

