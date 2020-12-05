const FULL_DASH_ARRAY = 283;

const calculateTimeFraction = (timeLeft: number, total: number): number => {
  const rawTimeFraction = timeLeft / total;
  return rawTimeFraction - (1 / total) * (1 - rawTimeFraction);
};

const setCircleDasharray = (timeLeft: number, total: number): void => {
  const circleDasharray = `${(calculateTimeFraction(timeLeft, total) * FULL_DASH_ARRAY).toFixed(0)} 283`;
  document
    .getElementById('base-timer-path-remaining')
    .setAttribute('stroke-dasharray', circleDasharray);
};

const setRemainingPathColor = (timeLeft: number, total: number): void => {
  const base = document.getElementById('base-timer-path-remaining');
  base.classList.remove('red');
  base.classList.remove('orange');
  base.classList.remove('green');
  if (timeLeft <= total / 4) {
    base.classList.add('red');
  } else if (timeLeft <= total / 2) {
    base.classList.add('orange');
  } else {
    base.classList.add('green');
  };
};

export const updateTimer = (timeLeft: number, total: number): void => {
  document.getElementById('base-timer-label').innerHTML = `${timeLeft}`;
  setCircleDasharray(timeLeft, total);
  setRemainingPathColor(timeLeft, total);
};

const timer = () => {
  return `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining green"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">0</span>
    </div>
  `;
};

export default timer;
