class Timer {
  count;
  timerElem;
  timerId;

  constructor() {
    this.count = 0;
    this.#createElem();
    this.#initTimer();
    this.#addEventListeners();
  }

  #createElem() {
    const elem = document.createElement('div');

    let hours = Math.floor(this.count / 3600).toString();
    let minutes = Math.floor(this.count / 60).toString();
    let seconds = this.count % 60;

    hours = hours.toString().length < 2 ? '0' + hours : hours;
    minutes = minutes.toString().length < 2 ? '0' + minutes : minutes;
    seconds = seconds.toString().length < 2 ? '0' + seconds : seconds;

    elem.innerText = hours + ':' + minutes + ':' + seconds;
    this.timerElem = elem;
  }

  #initTimer() {
    this.timerId = setInterval(() => {
      this.count += 1;

      let hours = Math.floor(this.count / 3600).toString();
      let minutes = Math.floor(this.count / 60).toString();
      let seconds = this.count % 60;

      hours = hours.toString().length < 2 ? '0' + hours : hours;
      minutes = minutes.toString().length < 2 ? '0' + minutes : minutes;
      seconds = seconds.toString().length < 2 ? '0' + seconds : seconds;

      this.timerElem.innerText = hours + ':' + minutes + ':' + seconds;
    }, 1000);
  }

  #addEventListeners() {
    window.addEventListener('finishedLoading', () => {
      try {
        const parrentNode = document.getElementById('timer');
        parrentNode.appendChild(this.timerElem);
      } catch (e) {}
    });

    document.addEventListener('visibilitychange', () => {
      document.visibilityState === 'hidden' ? clearInterval(this.timerId) : this.#initTimer();
    });
  }
}

new Timer();
