//Christian Wu - s194597
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function YoutubeTab() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Modal.Header>
                <Modal.Title>YouTube link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                This is a YouTube link to help you better understand how to use LiRA map.click here:
                <a href="https://youtu.be/NdLBcXSgFGs" target="_blank">https://youtu.be/NdLBcXSgFGs</a>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>  */}
            </Modal.Footer>
        </>
    );
}

export default YoutubeTab
// render(<Example />); 