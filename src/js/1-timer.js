import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';
import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

const dateTimeInput = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerIntervalId = null;

startButton.disabled = true;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function showErrorToast(message) {
  iziToast.error({
    title: 'Помилка',
    message: message,
    position: 'topRight',
  });
}

function showSuccessToast(message) {
  iziToast.success({
    title: 'Готово!',
    message: message,
    position: 'topRight',
  });
}
// таймер
function updateTimerDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  timerFields.days.textContent = addLeadingZero(days);
  timerFields.hours.textContent = addLeadingZero(hours);
  timerFields.minutes.textContent = addLeadingZero(minutes);
  timerFields.seconds.textContent = addLeadingZero(seconds);
}

function startCountdown() {
  if (!userSelectedDate) return;

  startButton.disabled = true;
  dateTimeInput.disabled = true;

  if (timerIntervalId) {
    clearInterval(timerIntervalId);
  }

  // Функція, що виконується кожну секунду
  const tick = () => {
    const now = Date.now();
    const ms = userSelectedDate.getTime() - now;

    if (ms <= 0) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
      updateTimerDisplay(0);
      dateTimeInput.disabled = false;
      showSuccessToast('Зворотний відлік завершено!');
      return;
    }

    updateTimerDisplay(ms);
  };

  tick();

  timerIntervalId = setInterval(tick, 1000);
}

startButton.addEventListener('click', startCountdown);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = Date.now();

    if (selectedDate.getTime() <= now) {
      showErrorToast('Please choose a date in the future');
      startButton.disabled = true;
      userSelectedDate = null;
    } else {
      startButton.disabled = false;
      userSelectedDate = selectedDate;
    }
  },
};

flatpickr(dateTimeInput, options);

document.addEventListener('DOMContentLoaded', () => {
  updateTimerDisplay(0);
});
