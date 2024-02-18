//Christian Wu - s194597 and László Barak - s222899
import { FC } from "react";
import { FiDownload, FiMinus, FiPlus, FiRotateCcw } from "react-icons/fi";
import LoadingSpinner from "../Spinners/LoadingSpinner";
//import "../../css/zoom.css";
import CsvButton from "./CsvButton";

const zoomGap = 0.5;

interface IZoom {
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  showLoadingSpinner: boolean;
  queryRequest:string;
  queryType:string;
}

const Zoom: FC<IZoom> = ({ setZoom, showLoadingSpinner, queryRequest: queryRequest, queryType: queryType }) => {
  const zoomIn = () => setZoom((z) => z + zoomGap);
  const zoomOut = () => setZoom((z) => Math.max(1, z - zoomGap));
  const resetZoom = () => setZoom(1);

  return (
    <div className="zoom-btns">
      {showLoadingSpinner ? (
        <LoadingSpinner width="3rem" height="3rem" />
      ) : null}
      <div className="btn zoom-btn" onClick={zoomIn}>
        <FiPlus />
      </div>
      <div className="btn zoom-btn" onClick={zoomOut}>
        <FiMinus />
      </div>
      <div className="btn zoom-btn" onClick={resetZoom}>
        <FiRotateCcw />
      </div>
      <CsvButton queryRequest={queryRequest} queryType={queryType}></CsvButton>
    </div>
  );
};

export default Zoom;
