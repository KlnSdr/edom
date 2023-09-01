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

  public static rewriteUrl() {
    let path: string = window.location.pathname;
    let query: string = window.location.search;
    let hash: string = window.location.hash;

    let queryObj: eObj = edomRouter.parseQuery(query);
    if (
      queryObj["p"] !== undefined &&
      queryObj["q"] !== undefined &&
      queryObj["h"] !== undefined
    ) {
      edomRouter.decodeUrl(queryObj);
    } else {
      edomRouter.encodeUrl(path, query, hash);
    }
  }

  // idea:
  // https://github.com/rafgraph/spa-github-pages
  private static decodeUrl(queryObj: eObj) {
    // base64 regex:
    // https://stackoverflow.com/a/35002237/13079323
    const base64regex: RegExp =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    let basePath: string = queryObj["p"];
    let baseQuery: string = queryObj["q"];
    let baseHash: string = queryObj["h"];

    let path: string = "";
    let query: string = "";
    let hash: string = "";

    if (base64regex.test(basePath)) {
      path = atob(basePath);
    }
    if (base64regex.test(baseQuery)) {
      query = atob(baseQuery);
    }
    if (base64regex.test(baseHash)) {
      hash = atob(baseHash);
    }

    history.replaceState(null, "", path + query + hash);
    edomRouter.goTo(path, false);
  }

  private static encodeUrl(path: string, query: string, hash: string) {
    window.location.assign(
      "/?p=" + btoa(path) + "&q=" + btoa(query) + "&h=" + btoa(hash)
    );
  }

  private static parseQuery(query: string): eObj {
    if (query.indexOf("?") < 0) {
      return {};
    }

    let queryObj: eObj = {};
    let queryStr: string = query.substring(query.indexOf("?") + 1);
    let queryArr: string[] = queryStr.split("&");

    queryArr.forEach((query) => {
      let key: string = query.substring(0, query.indexOf("="));
      let value: string = query.substring(query.indexOf("=") + 1);

      queryObj[key] = value;
    });

    return queryObj;
  }
}
