//Christian Wu - s194597
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function IntroTab() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Introduction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Welcome to the LiRA Software!
                Live Road Assessment (LiRA) is a project worked on by Vejdirektoratet, DTU, Green Mobility and SWECO and its purpose is to gather sensor data from cars and present it graphically. Additionally it can support taking raw sensor data and compute additional data, that can't be obtained by a physical sensor.
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button> */}
            </Modal.Footer>
        </>
    );
}

export default IntroTab
// render(<Example />); 