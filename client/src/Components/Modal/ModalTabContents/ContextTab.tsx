//Christian Wu - s194597
import React from 'react';
import Modal from 'react-bootstrap/Modal';

function ContextTab() {

    return (
        <>
            <Modal.Header>
                <Modal.Title>Context</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                The objective of the LiRA (Live Road Assessment) project is to deliver road pavements surveys to help manage the Danish road network by using the data from sensors in modern vehicles.

                The sensors installed in the modern vehicles will be able to measure data like the roughness (IRI) and the friction of the roads which can be used to give an overall estimate of the condition of the roads.

                The purpose of our project is to extend the LiRA Map software by implementing new features and improve its overall functionality.

                For more information, go to: <a href="https://lira-project.dk/" target="_blank">https://lira-project.dk/</a>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button> */}
            </Modal.Footer>
        </>
    );
}

export default ContextTab
// render(<Example />); 