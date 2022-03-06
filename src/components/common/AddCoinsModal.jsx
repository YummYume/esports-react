import React, { useState } from 'react';
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
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { addCoins } from '../../api/user';

const AddCoinsModal = ({user, show, handleClose, updateUser}) => {
    const minAmount = process.env.REACT_APP_MIN_COINS;
    const maxAmount = Math.max(process.env.REACT_APP_MAX_COINS - user.coins, 0);
    const swal = withReactContent(Swal);
    const [initialValues, setInitialValues] = useState({
        coins: 0,
    });
    const schema = Yup.object().shape({
        coins: Yup.number().required('Vous devez saisir un montant.').min(minAmount, `Montant minimum : ${minAmount} jeton${minAmount > 1 ? 's' : ''}`).max(maxAmount, `Montant maximum : ${maxAmount} jeton${maxAmount > 1 ? 's' : ''}`),
    });

    const onSubmit = async (values, actions) => {
        1 > values.coins && (handleClose());

        addCoins(user, parseInt(values.coins)).then(res => {
            if (res.coins > user.coins) {
                swal.fire({
                    icon: 'success',
                    text: `${values.coins} jeton${values.coins > 1 ? 's' : ''} ajouté${values.coins > 1 ? 's' : ''}.`,
                }).then(() => {
                    updateUser();
                });
            } else {
                swal.fire({
                    icon: 'error',
                    text: `Une erreur s'est produite.`,
                });
            }
        }).catch((error) => {
            swal.fire({
                icon: 'error',
                text: `Une erreur s'est produite.`,
            });
            console.error(`Error during onSubmit (AddCoinsModal) : ${error}`);
        }).finally(() => {
            actions.resetForm();
        });
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
                values,
                errors,
                isValid,
                isSubmitting,
                touched,
            }) => (
                <Form noValidate onSubmit={handleSubmit} id="add-coins-form">
                    <Modal
                        lg="md-down"
                        aria-labelledby="modal-title"
                        centered={true}
                        show={show}
                    >
                        <Modal.Header>
                            <Modal.Title id="modal-title">
                                Ajouter des jetons
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
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
                                                        max={parseInt(maxAmount)}
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
                                        max={parseInt(maxAmount)}
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
                                <Col xs={12}>
                                    <p className="mt-3 mb-0">Soit {(values.coins * 0.1).toFixed(2)}€</p>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer as="div">
                            <Row className="w-100 align-items-center justify-content-center">
                                <Col md={8} xs={12}>
                                    <Button
                                        className="my-1 w-100"
                                        variant="outline-success"
                                        disabled={!isValid || isSubmitting || 1 > values.coins}
                                        type="submit"
                                        value="Submit"
                                        form="add-coins-form"
                                    >
                                        Payer {isSubmitting &&
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

export default AddCoinsModal;
