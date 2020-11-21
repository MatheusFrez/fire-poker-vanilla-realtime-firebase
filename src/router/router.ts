interface Route {
  path: RegExp;
  callback: (...args: any) => void;
}

export default class Router {
  private routes: Route[];
  private notFound: () => void;

  constructor (params: {
    routes: Route[],
    notFound: () => void,
  }) {
    this.routes = params.routes;
    this.notFound = params.notFound;
    this.bindLoad();
    this.bindPopState();
    this.bindAnchorNavigate();
  }

  public push (path: string): void {
    const finded = this.routes.some((route) => {
      const match = path.match(route.path);
      if (match) {
        match.shift();
        this._push(path);
        route.callback(...match);
        return true;
      }
      return false;
    });
    if (!finded) {
      this.notFound();
    }
  }

  private bindAnchorNavigate (): void {
    document.addEventListener('click', (event: any) => {
      if (event.target.tagName === 'A') {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        this.push(href);
      }
    });
  }

  private bindLoad (): void {
    window.addEventListener('load', () => {
      const path = location.pathname;
      this.push(path);
    });
  }

  private bindPopState (): void {
    window.addEventListener('popstate', () => {
      this.push(location.pathname);
    });
  }

  private _push (path: string): void {
    history.pushState(null, null, path);
  }
}
