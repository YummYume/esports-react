import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import { Row, Col, Container } from 'react-bootstrap';
import { getUserOrFalse } from '../components/API/user';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(false);
    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        if (false !== error) {
            setTimeout(() => {
                setError(false);
            }, 4000)
        }
    });

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = e.currentTarget;

        setError(false);
        setLoading(true);

        if (formData.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setError('Erreur dans le formulaire. Veuillez corriger les erreurs.');
            return;
        }

        setValidated(true);

        getUserOrFalse(form.username, form.password).then(user => {
            setLoading(false);
            if (user) {
                console.log(user);
            } else {
                setError('Nom d\'utilisateur ou mot de passe erroné.');
            }
        });
    };

    const handleUserInput = (field, value) => {
        setForm((form) => {
            return {
                ...form,
                [field]: value
            }
        })
    };

    return (
        <Container className="align-items-center" fluid>
            <Row className="justify-content-around">
                <Col className="mb-5" xs={12}>
                    <h1 className="text-center">Connexion</h1>
                </Col>
                <Col sm={12} md={9} lg={8} xl={7} xxl={6}>
                    <Alert show={false !== error} variant="danger">
                        {error}
                    </Alert>
                    <Form noValidate validated={validated} onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Nom d'utilisateur</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control type="text" placeholder="Nom d'utilisateur" onInput={(e) => handleUserInput('username', e.target.value)} required/>
                                <Form.Control.Feedback type="invalid">
                                    Veuillez saisir votre nom d'utilisateur.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Mot de passe</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control type="password" placeholder="Mot de passe" onInput={(e) => handleUserInput('password', e.target.value)} required/>
                                <Form.Control.Feedback type="invalid">
                                    Veuillez saisir votre mot de passe.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="outline-secondary" disabled={loading} type="submit">
                                Connexion { loading &&
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    >
                                        <span className="visually-hidden">...</span>
                                    </Spinner>
                                }
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
};
