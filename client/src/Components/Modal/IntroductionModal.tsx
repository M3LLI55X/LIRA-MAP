//Christian Wu - s194597
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import '../../css/modal.css';
import TabComponent from './ModalTab';

function IntroductionModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Typography className='introduction-modal-text' variant="h6" noWrap component="div" onClick={handleShow} style={{ color: show ? "orange" : "white", fontSize: show ? "25px" : "1.25rem" }}>
                LiRA-MAP
            </Typography>
            <Modal className='modal' show={show} onHide={handleClose} size="lg" centered>
                <TabComponent />
            </Modal>
        </>
    );
}

export default IntroductionModal

// render(<Example />); 