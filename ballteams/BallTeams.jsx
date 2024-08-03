import { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import './BallTeams.css';

const Fetch = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.balldontlie.io/v1/teams', {
      headers: {
        'Authorization': 'f7e7f063-0cec-4322-a643-b3266a9674e0'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setTeams(data.data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-header">MGA NBA TEAMS</h1>
      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <p>Loading data, please wait...</p>
        </div>
      ) : (
        <Row xs={1} md={3} className="g-4">
          {teams.map((team) => (
            <Col key={team.id}>
              <Card className="team-card">
                <Card.Body>
                  <Card.Title><strong>Team Name:</strong> {team.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Fetch;
