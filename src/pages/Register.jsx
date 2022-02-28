import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useNavigate } from 'react-router-dom';
import { RiQuestionMark } from 'react-icons/ri';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { getUserOrFalse, register, isLoggedIn } from '../api/user';

export default function Register({updateUser}) {
    const navigate = useNavigate();
    const swal = withReactContent(Swal);
    const initialValues = {
        username: '',
        password: '',
        confirmPassword: '',
        confirmedAge: false,
    };
    const schema = Yup.object().shape({
        confirmedAge: Yup.bool().required().oneOf([true], 'Vous devez certifier votre âge pour vous enregistrer.'),
    });

    useEffect(() => {
        isLoggedIn().then((loggedIn) => {
            if (loggedIn) {
                updateUser();
                navigate('/menu');
            }
        }).catch((error) => {
            console.error(`Error during useEffect (Register) : ${error}`);
        });
    }, []);

    const validateUsername = async (value) => {
        let error;
        let currentUsername = value.trim();

        currentUsername.length < 3 && (error = 'Votre nom d\'utilisateur doit contenir au moins 3 caractères.');
        currentUsername.length > 20 && (error = 'Votre nom d\'utilisateur ne peut pas contenir plus de 20 caractères.');

        if (undefined === error) {
            await getUserOrFalse(currentUsername).then(data => {
                !!data && (error = 'Ce nom d\'utilisateur existe déjà.');
            }).catch(err => {
                error = 'Une erreur est survenue lors de la validation du nom d\'utilisateur.';
                console.error(`Error during validateUsername (Register) : ${err}`);
            });
        }

        return error;
    };

    const validatePassword = (value) => {
        let error;

        if (/\s/.test(value)) {
            error = 'Le mot de passe ne doit pas contenir d\'espace.';
        } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value)) {
            error = 'Votre mot de passe doit contenir un minimum de 8 caractères, dont 1 nombre, une lettre majuscule et une lettre minuscule.'
        }

        return error;
    };

    const validateConfirmPassword = (value, password) => {
        let error;

        password.trim() !== value && (error = 'Les mots de passe ne correspondent pas.');

        return error;
    };

    const onSubmit = async (values, actions) => {
        const newUser = {
            username: values.username,
            password: values.password,
        };

        await register(newUser).then((res) => {
            if (res) {
                swal.fire({
                    icon: 'success',
                    title: <p className="text-success">Inscription réussite</p>,
                    text: `Bienvenue, ${newUser.username}! Votre inscription est terminée, vous pouvez dès maintenant vous connecter.`,
                    footer: <div className="text-muted">Vous avez obtenu 100 jetons gratuitement, disponibles dès votre première connexion.</div>,
                    confirmButtonText: 'Se connecter',
                    customClass: {
                        confirmButton: 'btn btn-success',
                    },
                    buttonsStyling: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then(() => {
                    navigate('/login', {
                        state: {
                            username: newUser.username,
                        }
                    });
                });
            } else {
                swal.fire({
                    icon: 'error',
                    title: <p className="text-danger">Erreur lors de l'inscription</p>,
                    text: 'Une erreur est survenue lors de votre inscription, veuillez réessayer.',
                    footer: ':(',
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: 'Fermer',
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false,
                    allowOutsideClick: false,
                    allowEscapeKey: true,
                });
            }
        }).catch((err) => {
            console.error(`Error during onSubmit (Register) : ${err}`);
            swal.fire({
                icon: 'error',
                title: 'Erreur lors de l\'inscription',
                text: 'Une erreur est survenue lors de votre inscription, veuillez réessayer ultérieurement.',
                footer: ':(',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: 'Fermer',
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false,
                allowOutsideClick: false,
                allowEscapeKey: true,
            });
        }).finally(() => {
            actions.setSubmitting(false);
        });
    };

    return (
        <Container className="align-items-center" fluid>
            <Row className="justify-content-around">
                <Col className="mb-5" xs={12}>
                    <h1 className="text-center">Inscription</h1>
                </Col>
                <Col sm={12} md={9} lg={8} xl={7} xxl={6}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={schema}
                        validateOnMount={true}
                        onSubmit={(values, actions) => onSubmit(values, actions)}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            setFieldTouched,
                            values,
                            errors,
                            isValid,
                            isSubmitting,
                            touched,
                        }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Field name="username" validate={validateUsername}>
                                    {({ field, form: { touched, errors }, meta }) => (
                                        <Form.Group className="mb-4" controlId="username">
                                            <InputGroup hasValidation>
                                                <FloatingLabel
                                                    controlId="floatingUsernameLabel"
                                                    label="Nom d'utilisateur"
                                                    className="flex-grow-1"
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Nom d'utilisateur"
                                                        value={field.value}
                                                        onChange={handleChange('username')}
                                                        onBlur={handleBlur('username')}
                                                        isValid={meta.touched && !meta.error}
                                                        isInvalid={meta.touched && !!meta.error}
                                                        disabled={isSubmitting}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {meta.error}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </InputGroup>
                                        </Form.Group>
                                    )}
                                </Field>
                                <Field name="password" validate={validatePassword}>
                                    {({ field, form: { touched, errors }, meta }) => (
                                        <Form.Group className="mb-4" controlId="password">
                                            <InputGroup hasValidation>
                                                <FloatingLabel
                                                    controlId="floatingPasswordLabel"
                                                    label="Mot de passe"
                                                    className="flex-grow-1"
                                                >
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="Mot de passe"
                                                        value={field.value}
                                                        onChange={handleChange('password')}
                                                        onBlur={handleBlur('password')}
                                                        isValid={meta.touched && !meta.error}
                                                        isInvalid={meta.touched && !!meta.error}
                                                        disabled={isSubmitting}
                                                    />
                                                </FloatingLabel>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="password-tooltip">
                                                            Votre mot de passe doit contenir un minimum de 8 caractères, dont 1 nombre, une lettre majuscule et une lettre minuscule.
                                                        </Tooltip>
                                                    }
                                                >
                                                    <InputGroup.Text as="div" id="passwordAddon"><RiQuestionMark /></InputGroup.Text>
                                                </OverlayTrigger>
                                            </InputGroup>
                                            <div className={`${meta.touched && !!meta.error ? 'd-block ' : ''}invalid-feedback`}>
                                                {meta.error}
                                            </div>
                                        </Form.Group>
                                    )}
                                </Field>
                                <Field name="confirmPassword" validate={(e) => validateConfirmPassword(e, values.password)}>
                                    {({ field, form: { touched, errors }, meta }) => (
                                        <Form.Group className="mb-4" controlId="confirmPassword">
                                            <InputGroup hasValidation>
                                                <FloatingLabel
                                                    controlId="floatingConfirmPasswordLabel"
                                                    label="Confirmer le mot de passe"
                                                    className="flex-grow-1"
                                                >
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="Confirmer le mot de passe"
                                                        value={field.value}
                                                        onChange={handleChange('confirmPassword')}
                                                        onBlur={handleBlur('confirmPassword')}
                                                        isValid={meta.touched && !meta.error}
                                                        isInvalid={meta.touched && !!meta.error}
                                                        disabled={isSubmitting}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {meta.error}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </InputGroup>
                                        </Form.Group>
                                    )}
                                </Field>
                                <Form.Group className="mb-3" controlId="confirmedAge">
                                    <Form.Check
                                        name="confirmedAge"
                                        className={touched.confirmedAge && !!errors.confirmedAge ? 'text-invalid' : 'text-light'}
                                        label="Je certifie avoir plus de 18 ans."
                                        onBlur={() => setFieldTouched('confirmedAge', true)}
                                        onChange={handleChange('confirmedAge')}
                                        isInvalid={touched.confirmedAge && !!errors.confirmedAge}
                                        feedback={errors.confirmedAge}
                                        feedbackType="invalid"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </Form.Group>
                                <div className="text-center">
                                    <Button variant="outline-light" disabled={!isValid || isSubmitting} size="lg" type="submit" value="Submit">
                                        Inscription {isSubmitting &&
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
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    )
};
