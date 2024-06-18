const routes = {
  '/': { title: 'Home', render: 'views/activity.html' },
  '/map': { title: 'Map', render: 'views/map.html' },
  '/timer': { title: 'Timer', render: 'views/timer.html' },
};

const app = document.getElementById('app');

function router() {
  let view = routes[location.pathname];
  const path = 'http://localhost:8080/' + view.render;
  const links = document.querySelectorAll('[data-link]');
  links.forEach((elem) => {
    elem.classList.remove('icon_link__acitve');
    elem.href == location.pathname ? elem.classList.add('icon_link__acitve') : false;
  });
  if (view) {
    fetch(path)
      .then((res) => res.text())
      .then((res) => {
        document.title = view.title;
        app.innerHTML = res;

        window.dispatchEvent(new CustomEvent('finishedLoading'));
      });
  } else {
    history.replaceState('', '', '/');
    router();
  }
}

const links = document.querySelectorAll('[data-link]');

window.addEventListener('click', (e) => {
  if (
    e.target.matches('[data-link]') ||
    e.target.parentElement.matches('[data-link]') ||
    e.target.parentElement.parentElement.matches('[data-link]')
  ) {
    e.preventDefault();
    let href;
    if (e.target.matches('[data-link]')) {
      href = e.target.href;
    } else if (e.target.parentElement.matches('[data-link]')) {
      href = e.target.parentElement.href;
    }

    history.pushState(null, null, href);
    router();
  }
});

// Update router
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);
