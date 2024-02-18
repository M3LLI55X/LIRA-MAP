import { FC } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { ActiveMeasProperties } from '../../models/properties';

interface IGraphTabs {
    selectedMeasurements: ActiveMeasProperties[];
    setShownGraphMeasurementGraph: any;
}

const GraphTabs: FC<IGraphTabs> = ({ selectedMeasurements, setShownGraphMeasurementGraph }) => {
    return (
        <Tabs
            defaultActiveKey="profile"
            id="justify-tab-example"
            className="mb-3"
        >

            {selectedMeasurements.map(({ name }: ActiveMeasProperties) =>
                <Tab eventKey="home" title="Home">
                    {name}
                </Tab>
            )}
        </Tabs>
    );
}

export default GraphTabs;