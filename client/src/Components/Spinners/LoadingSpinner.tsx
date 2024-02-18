import Spinner from 'react-bootstrap/Spinner';

function LoadingSpinner(props: { width: string; height: string; }) {

    return (
        <Spinner animation="border" variant="primary" role="status" style={{ width: props.width, height: props.height }}>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    );
}

export default LoadingSpinner;