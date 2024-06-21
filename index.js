const timer = initTimer();

const routes = {
  '/': { title: 'Home', render: 'views/activity.html', scripts: [] },
  '/map': { title: 'Map', render: 'views/map.html', scripts: [initMap] },
  '/timer': { title: 'Timer', render: 'views/timer.html', scripts: [timer] },
};

const app = document.getElementById('app');

document.querySelectorAll('[data-link]').forEach((link) => link.addEventListener('click', handleNavigation, true));

function handleNavigation(e) {
  e.preventDefault();
  window.history.pushState({}, '', e.currentTarget.href);
  switchLocation();
}

function switchLocation() {
  let view = routes[location.pathname];
  const path = 'http://localhost:8080/' + view.render;
  if (view) {
    fetch(path)
      .then((res) => res.text())
      .then((res) => {
        document.title = view.title;
        app.innerHTML = res;
        paintLink();
        view.scripts.forEach((script) => script());
      });
  } else {
    history.replaceState('', '', '/');
    switchLocation();
  }
}

function paintLink() {
  document.querySelectorAll('[data-link]').forEach((link) => {
    let href = link.href.split('http://localhost:8080')[1];
    location.pathname === href ? link.classList.add('icon-link__active') : link.classList.remove('icon-link__active');
  });
}

async function initMap() {
  await ymaps3.ready;

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
}

window.addEventListener('DOMContentLoaded', switchLocation);

function initTimer() {
  let startDate = new Date();
  let pauseDate;
  let savedDiff = 0;

  let timerElement = document.createElement('div');
  let container;

  const paintTimer = () => {
    let diffDate = (new Date() - startDate - savedDiff) / 1000;
    let hours = Math.floor(diffDate / 3600).toString();
    let minutes = Math.floor(diffDate / 60).toString();
    let seconds = Math.floor(diffDate % 60).toString();

    hours = hours.length < 2 ? '0' + hours : hours;
    minutes = minutes.length < 2 ? '0' + minutes : minutes;
    seconds = seconds.length < 2 ? '0' + seconds : seconds;

    timerElement.innerText = `${hours}` + ':' + `${minutes}` + ':' + `${seconds}`;

    container ? container.appendChild(timerElement) : false;
  };

  let timer = setInterval(paintTimer, 1000);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState == 'hidden') {
      pauseDate = new Date();
      clearInterval(timer);
    } else {
      savedDiff += new Date() - pauseDate;
      paintTimer();
      timer = setInterval(paintTimer, 1000);
    }
  });

  return () => {
    container = document.getElementById('timer');
    paintTimer();
    clearInterval(timer);
    timer = setInterval(paintTimer, 1000);
  };
}
