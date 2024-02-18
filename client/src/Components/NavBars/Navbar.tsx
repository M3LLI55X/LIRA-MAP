//Christian Wu - s194597
import { FC } from "react";
import { NavLink } from 'react-router-dom';
//import '../css/navbar.css';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import IntroductionModal from "../Modal/IntroductionModal";
import OptionsModal from "../Modal/OptionsModal";
interface NavBtnProps {
    to: string;
    name: string;
}

const NavBtn: FC<NavBtnProps> = ({ to, name }) => {
    return (
        <NavLink
            className='nav-tab'
            activeClassName="nav-tab-active"
            to={to}
        >
            {name}
        </NavLink>
    )
}

const Navbar: FC = () => {
    return (
        <div className="nav-wrapper">
            <div className="nav-container">
                <div className="nav-block">
                    <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
                        <ButtonGroup className="me-2" aria-label="First group">
                            <IntroductionModal />
                            <OptionsModal />
                        </ButtonGroup>
                    </ButtonToolbar>

                </div>
            </div>
        </div>
    )
}

export default Navbar;
