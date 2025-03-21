import { useState, useEffect } from "react";
import { Checkbox } from "antd";
import { createJsonForChart } from "./buildDynamicOrgTree";
import TangledTree from "./d3/TangledTree";
import SunburstChart from "./d3/SunburstChart";
import jsonData from "../components/singlesheetPharma.json"; // Import JSON file directly

const CheckboxGroup = Checkbox.Group;

const ExcelToJson = () => {
  const [treeData, setTreeData] = useState(null);
  const [selectOptions, setSelectOptions] = useState(null);
  const [checkedList, setCheckedList] = useState([]);

  useEffect(() => {
    const makeTreeOptions = (data) => {
      const filterRow = Object.keys(data[0]).map((item, index) => {
        return { value: item, key: `level-${index + 1}` };
      });
      setCheckedList(filterRow.map((item) => item.key));
      return filterRow;
    };

    const treeOptions = makeTreeOptions(jsonData);
    setSelectOptions(treeOptions);
    const responseData = createJsonForChart(jsonData);
    setTreeData(responseData);
  }, []);

  return (
    <div>
      {treeData && <TangledTree data={treeData} />}
      {treeData && <SunburstChart data={treeData} />}
    </div>
  );
};

export default ExcelToJson;
