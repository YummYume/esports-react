import './App.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import { isLoggedIn } from './components/API/user';

export default function App() {
    const navigate = useNavigate();

    return (
        <Container className="align-items-center" fluid>
            <Row className="justify-content-center my-3">
                <Col className="text-center" xs={12}>
                    <h1>L'Esport, plus qu'une competition, un investissement</h1>
                </Col>
            </Row>
            <Row className="justify-content-center my-3">
                <Col className="text-center my-2" lg={3} md={4} sm={6} xs={12}>
                    <Button className="w-100" size="lg" variant="outline-secondary" onClick={() => navigate('login')}>Connexion</Button>
                </Col>
                <Col className="text-center my-2" lg={3} md={4} sm={6} xs={12}>
                    <Button className="w-100" size="lg" variant="outline-secondary">Inscription</Button>
                </Col>
            </Row>
        </Container>
    );
}
