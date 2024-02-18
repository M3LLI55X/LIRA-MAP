//Christian Wu - s194597
import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ContextTab from './ModalTabContents/ContextTab';
import CreditsTab from './ModalTabContents/CreditsTab';
import IntroTab from './ModalTabContents/IntroTab';
import ManualTab from './ModalTabContents/ManualTab';
import YoutubeTab from './ModalTabContents/YoutubeTab';

function TabComponent() {
    return (
        <Tabs
            defaultActiveKey="intro"
            id="uncontrolled-tab-example"
            className="mb-3"
        >
            <Tab eventKey="intro" title="Introduction">
                <IntroTab />
            </Tab>
            <Tab eventKey="context" title="Context">
                <ContextTab />
            </Tab>
            <Tab eventKey="manual" title="Manual">
                <ManualTab />
            </Tab>
            <Tab eventKey="YouTube link" title="YouTube link" >
                <YoutubeTab />
            </Tab>
            <Tab eventKey="credits" title="Credits">
                <CreditsTab />
            </Tab>
        </Tabs>
    );
}

export default TabComponent;