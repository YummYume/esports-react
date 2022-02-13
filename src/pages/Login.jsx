import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import useLocalStorage from '@dothq/react-use-localstorage';
import { useNavigate, useLocation } from 'react-router-dom';

import { getUserOrFalse, generateToken, isLoggedIn } from '../api/user';

export default function Login({updateUser}) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [userToken, setUserToken] = useLocalStorage('userToken', localStorage.getItem('userToken'));
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(false);
    const [errorTimeout, setErrorTimeout] = useState(null);
    const [form, setForm] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        isLoggedIn().then((loggedIn) => {
            if (loggedIn) {
                updateUser();
                navigate('/menu');
            }
        }).catch((error) => {
            console.error(`Error during useEffect (Login) : ${error}`);
        });
    }, []);

    useEffect(() => {
        state && state.username && (setForm({...form, username: state.username}));
    }, [state]);

    const showError = (error) => {
        errorTimeout && (clearTimeout(errorTimeout));
        setError(error);
        if (error) {
            setErrorTimeout(setTimeout(() => {
                setError(false);
            }, 5000));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = e.currentTarget;

        showError(false);
        setLoading(true);

        if (formData.checkValidity() === false) {
            setLoading(false);
            e.preventDefault();
            e.stopPropagation();
            showError('Erreur dans le formulaire. Veuillez corriger les erreurs.');
            setValidated(true);
            return;
        }

        setValidated(true);

        await getUserOrFalse(form.username, form.password).then(user => {
            if (user) {
                user = generateToken(user);
                setUserToken(user.token);
                navigate('/menu');
            } else {
                showError('Nom d\'utilisateur ou mot de passe erroné.');
            }
        }).catch((error) => {
            console.error(`Error during onSubmit (getUserOrFalse) : ${error}`);
            showError('Une erreur est survenue.');
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleUserInput = (field, value) => {
        setForm((form) => {
            return {
                ...form,
                [field]: value
            }
        });
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
                        <Form.Group className="mb-3" controlId="username">
                            <InputGroup hasValidation>
                                <FloatingLabel
                                    controlId="floatingUsernameLabel"
                                    label="Nom d'utilisateur"
                                    className="mb-3 w-100"
                                >
                                    <Form.Control
                                        type="text"
                                        value={form.username}
                                        placeholder="Nom d'utilisateur"
                                        onInput={(e) => handleUserInput('username', e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Veuillez saisir votre nom d'utilisateur.
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <InputGroup hasValidation>
                                <FloatingLabel
                                    controlId="floatingPasswordLabel"
                                    label="Mot de passe"
                                    className="mb-3 w-100"
                                >
                                    <Form.Control
                                        type="password"
                                        value={form.password}
                                        placeholder="Mot de passe"
                                        onInput={(e) => handleUserInput('password', e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Veuillez saisir votre mot de passe.
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </InputGroup>
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="outline-light" disabled={loading} size="lg" type="submit">
                                Connexion {loading &&
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
