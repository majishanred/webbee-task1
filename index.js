const routes = {
  '/': { title: 'Home', render: 'views/activity.html', scripts: [] },
  '/map': { title: 'Map', render: 'views/map.html', scripts: [initMap] },
  '/timer': { title: 'Timer', render: 'views/timer.html', scripts: [initTimer] },
  404: { titile: 'Not Found', render: 'views/404.html', scripts: [] },
};

initRouter();

function initRouter() {
  const app = document.getElementById('app');

  document.querySelectorAll('[data-link]').forEach((link) => link.addEventListener('click', handleNavigation, true));

  function handleNavigation(e) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('cleanup:' + location.pathname));
    window.history.pushState({}, '', e.currentTarget.href);
    switchLocation();
  }

  function switchLocation() {
    let view = routes[location.pathname] || routes['404'];
    const path = 'http://localhost:8080/' + view.render;
    fetch(path)
      .then((res) => res.text())
      .then((res) => {
        document.title = view.title;
        app.innerHTML = res;
        paintLink();
        view.scripts.forEach((script) => script());
        window.dispatchEvent(new CustomEvent('init:' + location.pathname));
      });
  }

  function paintLink() {
    document
      .querySelectorAll('[data-link]')
      .forEach((link) =>
        location.href === link.href && routes[location.pathname]
          ? link.classList.add('icon-link__active')
          : link.classList.remove('icon-link__active'),
      );
  }

  Object.entries(routes).forEach((pair) => {
    const [path, component] = pair;
    component.scripts.forEach(async (script) => {
      const { init, cleanup } = await script();
      window.addEventListener('init:' + path, init);
      window.addEventListener('cleanup:' + path, cleanup);
    });
  });

  switchLocation();
}

async function initMap() {
  await ymaps3.ready;

  return {
    init: () => {
      const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;

      clearMapNode();
      const map = new YMap(
        document.getElementById('map'),

        {
          location: {
            center: [20.539817, 54.722352],

            zoom: 18,
          },
        },
      );

      map.addChild(new YMapDefaultSchemeLayer());

      map.addChild(new YMapDefaultFeaturesLayer());

      const content = document.createElement('section');

      const marker = new YMapMarker(
        {
          coordinates: [20.539817, 54.722352],
          draggable: false,
        },
        content,
      );

      map.addChild(marker);
      content.style =
        'width: 25px; height: 25px; border-radius: 9999px; background-color: red; position: relative; top: -12.5px; left: -12.5px';

      function clearMapNode() {
        const elem = document.getElementById('map');
        elem.innerHTML = null;
      }
    },
    cleanup: () => {},
  };
}

function initTimer() {
  let startDate = new Date();
  let pauseDate = 0;
  let timerElement = document.createElement('div');
  let container;

  let timerId;

  const paintTimer = () => {
    let diffDate = (new Date() - startDate - pauseDate) / 1000;
    let hours = Math.floor(diffDate / 3600).toString();
    let minutes = Math.floor(diffDate / 60).toString();
    let seconds = Math.floor(diffDate % 60).toString();

    hours = hours.length < 2 ? '0' + hours : hours;
    minutes = minutes.length < 2 ? '0' + minutes : minutes;
    seconds = seconds.length < 2 ? '0' + seconds : seconds;

    timerElement.innerText = `${hours}` + ':' + `${minutes}` + ':' + `${seconds}`;
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState == 'hidden') {
      pauseDate = new Date();
    } else {
      pauseDate = new Date() - pauseDate;
    }
  });

  return {
    init: () => {
      container = document.getElementById('timer');
      paintTimer();
      container.appendChild(timerElement);
      timerId = setInterval(paintTimer, 1000);
    },
    cleanup: () => {
      clearInterval(timerId);
    },
  };
}
