import { getNow } from '../helpers/date';

const TimerControl = (context) => {
  context.$startButton.addEventListener('click', () => {
    handleStart(context);
    toggleStartPauseButtons('start');
  });

  context.$pauseButton.addEventListener('click', () => {
    context.$timerEl.innerHTML = context.$timerEl.innerHTML.replace(
      'Working',
      'Paused'
    );

    clearInterval(context.currentInterval);
    toggleStartPauseButtons('pause');
  });

  context.$skipButton.addEventListener('click', () => {
    context.$skipButton.disabled = true;
    context.endBreakTimer();
  });

  const toggleStartPauseButtons = (button) => {
    if (button === 'start') {
      context.$startButton.classList.add('disabledButton');
      context.$startButton.disabled = true;

      context.$pauseButton.classList.remove('disabledButton');
      context.$pauseButton.disabled = false;
    } else {
      context.$startButton.classList.remove('disabledButton');
      context.$startButton.disabled = false;

      context.$pauseButton.classList.add('disabledButton');
      context.$pauseButton.disabled = true;
    }
  };
};

export const toggleTimerButtons = (context, showTimerButtons) => {
  if (showTimerButtons) {
    context.$timerButtons.classList.remove('hidden');
    context.$skipButton.classList.add('hidden');
  } else {
    context.$skipButton.disabled = false;
    context.$timerButtons.classList.add('hidden');
    context.$skipButton.classList.remove('hidden');
  }
};

const handleStart = (context) => {
  const now = getNow();

  if (context.currentRemaining) {
    const remaining = new Date(now.getTime() + context.currentRemaining);
    context.initializeTimer(remaining);
  } else {
    context.createNewTimer();
  }
};

const handlePause = (context) => {};
export default TimerControl;
