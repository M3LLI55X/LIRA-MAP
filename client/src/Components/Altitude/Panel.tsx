//Christian Wu - s194597
import { FC } from "react";
import Checkbox from "../Checkbox";
import LoadingSpinner from "../Spinners/LoadingSpinner";

interface IPanel {
  showLoadingSpinner: boolean;
  showHotline: boolean;
  showHeatmap: boolean;
  toggleShowHotline: (isChecked: boolean) => void;
  toggleShowHeatmap: (isChecked: boolean) => void;
}

const Panel: FC<IPanel> = ({
  showLoadingSpinner,
  showHotline,
  showHeatmap,
  toggleShowHotline,
  toggleShowHeatmap,
}) => {
  return (
    <div className="panel-wrapper">
      {showLoadingSpinner ? (
        <LoadingSpinner width="4rem" height="4rem" />
      ) : null}
      <div className="panel-checkboxes">
        <Checkbox
          className="panel-checkbox"
          html={<p>Hotline</p>}
          forceState={showHotline}
          onClick={toggleShowHotline}
        />
        <Checkbox
          className="panel-checkbox"
          html={<p>Heatmap</p>}
          forceState={showHeatmap}
          onClick={toggleShowHeatmap}
        />
      </div>
    </div>
  );
};

export default Panel;
