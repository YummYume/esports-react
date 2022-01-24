import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import { isLoggedIn } from './API/user';
import styles from '../styles/App.module.scss';

export default function App() {
    const navigate = useNavigate();

    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center" xs={12}>
                    <h1 className={`${styles.mainTitle}`}>L'Esport,<br /> Plus qu'une Compétition,<br />Un Investissement.</h1>
                </Col>
            </Row>
            <Row className="justify-content-center my-2">
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
