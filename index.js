class Router {
  routes;
  rootElem;

  constructor(routes) {
    this.routes = routes;
    this.rootElem = document.getElementById('app');
  }

  init() {
    window.addEventListener('hashchange', (e) => {
      this.hasChanged();
    });

    this.hasChanged();
  }

  hasChanged() {
    if (window.location.hash.length > 0) {
      for (let i = 0, length = this.routes.length; i < length; i++) {
        let route = this.routes[i];
        if (route.isActiveRoute(window.location.hash.substr(1))) {
          this.goToRoute(route.htmlName);
        }
      }
    } else {
      for (let i = 0, length = this.routes.length; i < length; i++) {
        let route = this.routes[i];
        if (route.default) {
          this.goToRoute(route.htmlName);
        }
      }
    }
  }

  goToRoute(name) {
    const path = 'http://localhost:8080/views/' + name;

    fetch(path)
      .then((res) => res.text())
      .then((res) => {
        this.rootElem.innerHTML = res;

        const links = [...document.getElementsByTagName('a')].filter((_) => _.href.includes('#'));

        links.forEach((_) => {
          _.firstChild.nextSibling.classList.remove('icon_link__active');

          _.href == window.location.href ? _.firstChild.nextSibling.classList.add('icon_link__active') : false;
        });

        window.dispatchEvent(new CustomEvent('finishedLoading'));
      });
  }
}

class Route {
  name;
  htmlName;
  default;

  constructor(name, htmlName, defaultRoute) {
    this.name = name;
    this.htmlName = htmlName;
    this.default = defaultRoute;
  }

  isActiveRoute(hashedPath) {
    return hashedPath.replace('#', '') === this.name;
  }
}

new Router([
  new Route('', 'activity.html', true),
  new Route('map', 'map.html'),
  new Route('timer', 'timer.html'),
]).init();
