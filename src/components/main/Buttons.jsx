import Button from 'react-bootstrap/Button';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MainButtons = ({user}) => {
    const navigate = useNavigate();

    if (false !== user) {
        return (
            <Row className="justify-content-center my-2">
                <Col className="text-center my-2" lg={6} md={8} sm={10} xs={12}>
                    <Button className="w-100" size="lg" variant="outline-secondary" onClick={() => navigate('/menu')}>Menu</Button>
                </Col>
            </Row>
        );
    }

    return (
        <Row className="justify-content-center my-2">
            <Col className="text-center my-2" lg={3} md={4} sm={6} xs={12}>
                <Button className="w-100" size="lg" variant="outline-secondary" onClick={() => navigate('login')}>Connexion</Button>
            </Col>
            <Col className="text-center my-2" lg={3} md={4} sm={6} xs={12}>
                <Button className="w-100" size="lg" variant="outline-secondary">Inscription</Button>
            </Col>
        </Row>
    );
};

export default MainButtons;
