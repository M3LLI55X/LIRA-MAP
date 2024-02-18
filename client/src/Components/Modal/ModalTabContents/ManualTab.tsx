//Christian Wu - s194597
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function ManualTab() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Modal.Header>
                <Modal.Title>Manual</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                By clicking on the car icon the Trips panel will appear. Here all the available trips, from the LiRA database, will be shown. Also a search box for finding a specific trip, date filtering and an additional search box for finding a municipality is at the top.All available trips can be displayed by clicking on the data icon at the top right of the page.The data displayed on the right drawer that appears are data that can be shown on the map like track position, interpolation, engine rpm etc. and details of selected trips.When clicking on specific data with data points. A graph will be shown.On the graph the user can zoom-in and out and export the data as a CSV-file.
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

export default ManualTab
// render(<Example />); 