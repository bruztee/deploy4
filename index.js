// src/client/js/index.js

import { connect, play, sendChatMessage } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';

// I'm using a tiny subset of Bootstrap here for convenience - there's some wasted CSS,
// but not much. In general, you should be careful using Bootstrap because it makes it
// easy to unnecessarily bloat your site.
import './css/bootstrap-reboot.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

Promise.all([
  connect(onGameOver),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    play(usernameInput.value); // Используем функцию play из networking.js
    playMenu.classList.add('hidden');
    initState();
    startCapturingInput();
    startRendering();
    setLeaderboardHidden(false);

    // Показать чат и инициализировать его
    const chatContainer = document.getElementById('chat-container');
    chatContainer.classList.remove('hidden');

    // Обработчик ввода чата
    const chatInput = document.getElementById('chat-input');
    const sendChatButton = document.getElementById('send-chat-button');

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && chatInput.value.trim()) {
        console.log('Sending chat message from input with username:', usernameInput.value);
        sendChatMessage(chatInput.value, usernameInput.value);
        chatInput.value = '';
      }
    });
    
    sendChatButton.addEventListener('click', () => {
      if (chatInput.value.trim()) {
        console.log('Sending chat message from button with username:', usernameInput.value);
        sendChatMessage(chatInput.value, usernameInput.value);
        chatInput.value = '';
      }
    });
  };
}).catch(console.error);

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove('hidden');
  setLeaderboardHidden(true);
  // Скрыть чат при завершении игры
  document.getElementById('chat-container').classList.add('hidden');
}