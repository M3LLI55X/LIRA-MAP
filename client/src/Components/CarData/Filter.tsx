import { Dispatch, FC, SetStateAction } from "react";

import { SegTypes } from "../../pages/CarData";

import '../../css/filter.css';


export interface IFilter {
    setTypes: Dispatch<SetStateAction<SegTypes>>;
}

const Filter: FC<IFilter> = ({ setTypes }) => {

    // const popup = useSegPopup({
    //     dataType: undefined,
    //     aggrType: undefined,
    //     direction : undefined
    // })

    // const firePopup = () => popup.fire( (types: SegTypes) => {
    //     console.log(types);
    //     setTypes(types)
    // } )

    // return <FaFilter onClick={firePopup} className="toolbar-button" />

    return null;

}


export default Filter;