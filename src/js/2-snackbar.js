import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  createPromise(delay, state)
    .then(resultDelay => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${resultDelay}ms`,
        position: 'topRight',
      });
    })
    .catch(errorDelay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${errorDelay}ms`,
        position: 'topRight',
      });
    });

  event.currentTarget.reset();
}

form.addEventListener('submit', handleSubmit);
