import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import RangeSlider from 'react-bootstrap-range-slider';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import { addBet, editBet, removeBet } from '../../api/user';

const BetModal = ({user, match, matchBet, show, handleClose, onBet = null}) => {
    const firstOpponent = match.opponents[0].opponent;
    const secondOpponent = match.opponents[1].opponent;
    const maxAmount = matchBet ? matchBet.amount + user.coins : user.coins;
    const [initialValues, setInitialValues] = useState({
        coins: 0,
        teamId: null,
    });
    const schema = Yup.object().shape({
        coins: Yup.number().required('Vous devez saisir un montant.').min(0, 'Vous ne pouvez pas parier un nombre négatif.').max(maxAmount, `Vous ne pouvez pas parier plus de ${maxAmount} jeton${maxAmount > 1 ? 's' : ''}.`),
        teamId: Yup.mixed().oneOf([parseInt(firstOpponent.id), parseInt(secondOpponent.id), firstOpponent.id.toString(), secondOpponent.id.toString()], 'L\'équipe sélectionnée n\'est pas valide.'),
    });

    useEffect(() => {
        if (matchBet) {
            setInitialValues({
                coins: matchBet.amount,
                teamId: parseInt(matchBet.betOn),
            });
        }
    }, [matchBet]);

    const onSubmit = async (values, actions) => {
        if (!matchBet && 1 > values.coins) {
            handleClose();
        }

        if (matchBet) {
            if (1 > values.coins) {
                await removeBet(matchBet, user).then((res) => {
                    onBet && (onBet());
                }).catch((err) => {
                    console.error(`Error during onSubmit (Register) : ${err}`);
                });
            } else {
                await editBet(matchBet, user, values.coins, parseInt(values.teamId)).then((res) => {
                    onBet && (onBet());
                }).catch((err) => {
                    console.error(`Error during onSubmit (Register) : ${err}`);
                });
            }
        } else {
            await addBet(user, match, values.coins, parseInt(values.teamId)).then((res) => {
                onBet && (onBet());
            }).catch((err) => {
                console.error(`Error during onSubmit (Register) : ${err}`);
            });
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            validateOnMount={true}
            onSubmit={(values, actions) => onSubmit(values, actions)}
            enableReinitialize={true}
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
                <Form noValidate onSubmit={handleSubmit} id={`form-${match.id}`}>
                    <Modal
                        lg="md-down"
                        aria-labelledby="match-title"
                        centered={true}
                        show={show}
                    >
                        <Modal.Header>
                            <Modal.Title id="match-title">
                                Parier sur le match {match.name}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group as={Row} className="mb-2" controlId="teamId">
                                <Col xs={12}>
                                    <Form.Label>Choisir une équipe</Form.Label>
                                </Col>
                                <Col xs={12}>
                                    <Form.Check
                                        inline
                                        label={firstOpponent.name}
                                        name="teamId"
                                        type="radio"
                                        id={'firstOpponent'}
                                        value={parseInt(firstOpponent.id)}
                                        onChange={handleChange('teamId')}
                                        onBlur={() => setFieldTouched('teamId', true)}
                                        isInvalid={touched.teamId && !!errors.teamId}
                                        disabled={isSubmitting}
                                        checked={firstOpponent.id == values.teamId}
                                        required
                                    />
                                    <Form.Check
                                        inline
                                        label={secondOpponent.name}
                                        name="teamId"
                                        type="radio"
                                        id="secondOpponent"
                                        value={parseInt(secondOpponent.id)}
                                        onChange={handleChange('teamId')}
                                        onBlur={() => setFieldTouched('teamId', true)}
                                        isInvalid={touched.teamId && !!errors.teamId}
                                        disabled={isSubmitting}
                                        checked={secondOpponent.id == values.teamId}
                                        required
                                    />
                                </Col>
                                <Col xs={12}>
                                    {(errors.teamId && touched.teamId) && (
                                        <React.Fragment>
                                            <div className="is-invalid " />
                                            <div className="invalid-feedback">
                                                {errors.teamId}
                                            </div>
                                        </React.Fragment>
                                    )}
                                </Col>
                            </Form.Group>
                            <Row>
                                <Col xs={12}>
                                    <Form.Label>Montant (jetons)</Form.Label>
                                </Col>
                                <Col xs={4}>
                                    <Field name="coins">
                                        {({ field, form: { touched, errors }, meta }) => (
                                            <Form.Group controlId="coins">
                                                <InputGroup hasValidation>
                                                    <Form.Control
                                                        value={field.value}
                                                        onChange={handleChange('coins')}
                                                        type="number"
                                                        min={0}
                                                        max={maxAmount}
                                                        onBlur={handleBlur('coins')}
                                                        isValid={meta.touched && !meta.error}
                                                        isInvalid={meta.touched && !!meta.error}
                                                        disabled={isSubmitting}
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        )}
                                    </Field>
                                </Col>
                                <Col xs={8}>
                                    <RangeSlider
                                        value={values.coins}
                                        onChange={handleChange('coins')}
                                        variant="success"
                                        min={0}
                                        max={maxAmount}
                                        onBlur={handleBlur('coins')}
                                        tooltipPlacement="top"
                                        tooltipLabel={currentValue => `${currentValue}/${maxAmount}`}
                                        tooltip="on"
                                        disabled={isSubmitting}
                                    />
                                </Col>
                                <Col xs={12}>
                                    {(errors.coins && touched.coins) && (
                                        <React.Fragment>
                                            <div className="is-invalid" />
                                            <div className="invalid-feedback">
                                                {errors.coins}
                                            </div>
                                        </React.Fragment>
                                    )}
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer as="div">
                            <Row className="w-100 align-items-center justify-content-center">
                                <Col md={8} xs={12}>
                                    <Button
                                        className="my-1 w-100"
                                        variant={!matchBet ? 'outline-success' : matchBet && 1 > values.coins ? 'outline-danger' : 'outline-warning'}
                                        disabled={!isValid || isSubmitting || (!matchBet && 1 > values.coins)}
                                        type="submit"
                                        value="Submit"
                                        form={`form-${match.id}`}
                                    >
                                        {!matchBet ? 'Parier' : matchBet && 1 > values.coins ? 'Annuler le pari' : 'Modifier le pari'} {isSubmitting &&
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
                                    <Button className="my-1 w-100" variant="outline-danger" onClick={handleClose} disabled={isSubmitting}>Fermer</Button>
                                </Col>
                            </Row>
                        </Modal.Footer>
                    </Modal>
                </Form>
            )}
        </Formik>
    );
};

export default BetModal;
