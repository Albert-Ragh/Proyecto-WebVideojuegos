import { useSelector, useDispatch } from 'react-redux';
import { store, actions } from './store'; // import the Redux store
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Container, NavLink } from 'react-bootstrap';
import routes from '../index.js';
import moment from 'moment';

const Historial = () => {
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const token = localStorage.getItem('access_token');
  const [playedGames, setPlayedGames] = useState([]);
  const userInfo = useSelector((state) => state.data);

  useEffect(() => {
    async function fetchPlayedGame() {
      if (isLoggedIn) {
        try {
          const response = await fetch( `${routes.fetchLaravel}/api/showPlayedGame?userId=${userInfo.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            mode: 'same-origin',
          });
          const infoPlayedGame = await response.json();
          console.log(infoPlayedGame);
          setPlayedGames(infoPlayedGame);
        } catch (error) {
          console.error(error);
        }
      }
    }
    fetchPlayedGame();
  }, []);

  return (
    <div>
      {isLoggedIn ?
        <Container>
          <h2>Historial</h2>
          {playedGames.map((game, userId) => (
            <Card key={userId}>
              <Card.Body>
                <Card.Title>Juego: {game.name}</Card.Title>
                <Card.Text>Puntos: {game.score}</Card.Text>
                <Card.Text>Fecha: {moment(game.created_at).format('DD MMM YYYY HH:mm:ss')}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Container> :
        <p className="ranking_font_size">You need to be logged in</p>
      }
    </div>
  );
};

export default Historial;
