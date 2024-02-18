//Christian Wu - s194597
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function CreditsTab() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Modal.Header>
                <Modal.Title>Credits</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                This extension to the LiRA software is made by group D.
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

export default CreditsTab
// render(<Example />); 