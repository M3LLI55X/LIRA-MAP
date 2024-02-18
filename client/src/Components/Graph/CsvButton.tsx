// László Barak - s222899
import { FC } from "react";
import { FiDownload } from "react-icons/fi";
import { getPath } from "../../queries/fetch";

interface ICsvButton {
  queryRequest: string;
  queryType: string;
}

const CsvButton: FC<ICsvButton> = ({queryRequest: queryRequest, queryType: queryType}) => {

    const generateData = () => {
        fetch(getPath('/rides/generateData?queryRequest=' + queryRequest + '&queryType=' + queryType))
          .then((response) => response.blob())
          .then((resBlob) => {
            console.log(resBlob)
            const fileURL = URL.createObjectURL(resBlob);
            let alink = document.createElement('a');
            alink.href = fileURL;
            alink.download = `${queryRequest}.csv`;
            alink.click();
          });
    }

  return (
    <div className="btn zoom-btn" onClick={generateData}>
      <FiDownload />
    </div>
  );
};

export default CsvButton;
