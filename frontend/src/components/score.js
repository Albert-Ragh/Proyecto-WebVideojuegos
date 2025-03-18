import { store, actions } from './store';

async function endGame(totalScore) {
  const token = localStorage.getItem('access_token');
  const gameId = 8;
  const score = totalScore;

  if (token)
    if (token != "0") {
      try {
        const response = await fetch(process.env.REACT_APP_LARAVEL_URL + '/api/saveScore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          mode: 'same-origin',
          body: JSON.stringify({ totalScore }),
        });
        const data = await response.json();
        store.dispatch(actions.saveData(data));
        const userId = data.id;

        await fetch(process.env.REACT_APP_LARAVEL_URL + '/api/createPlayedGame', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          mode: 'same-origin',
          body: JSON.stringify({ userId, gameId, score }),
        });
      } catch (error) {
        console.error(error);
      }
    }
}

export { endGame };
