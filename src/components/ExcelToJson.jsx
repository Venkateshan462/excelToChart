import { useState, useEffect } from "react";
import { Checkbox } from "antd";
import * as XLSX from "xlsx";
import { createJsonForChart } from "./buildDynamicOrgTree";
import TangledTree from "./d3/TangledTree";
import SunburstChart from "./d3/SunburstChart";
import CirclePackingChart from "./d3/CirclePackingChart";
import ZoomableSunBurstChart from "./d3/ZoomableSunBurstChart";
const CheckboxGroup = Checkbox.Group;

const ExcelToJson = () => {
  const [treeData, setTreeData] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [selectOptions, setSelectOptions] = useState(null);
  const [checkedList, setCheckedList] = useState([]);

  const makeTreeOptions = (sheet) => {
    const filterRow = Object.keys(sheet[0]).map((item, index) => {
      return { value: item, key: `level-${index + 1}` };
    });
    setCheckedList(filterRow.map((item) => item.key));
    return filterRow;
  };

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setExcelData(sheet);
    };
    reader.readAsArrayBuffer(file);
  };
  useEffect(() => {
    if (excelData != null) {
      const treeOptions = makeTreeOptions(excelData);
      setSelectOptions(treeOptions);

      const responeData = createJsonForChart(excelData);
      setTreeData(responeData);
    }
  }, [excelData]);
  const handleCheckBoxChange = (list) => {
    setCheckedList(list);

    const rowsToFilter = selectOptions.filter((item) =>
      list.includes(item.key)
    );

    const filterKeys = rowsToFilter.map((item) => item.value);

    const filteredData = excelData.map((item) =>
      Object.fromEntries(
        Object.entries(item).filter(([key]) => filterKeys.includes(key))
      )
    );

    const responeData = createJsonForChart(filteredData);
    setTreeData(responeData);
  };
  return (
    <div>
      <input type="file" accept=".xlsx, .csv" onChange={handleFileUpload} />
      {selectOptions != null && (
        <CheckboxGroup
          options={selectOptions.map((item) => item.key)}
          value={checkedList}
          onChange={handleCheckBoxChange}
        />
      )}

      <div
        id="treeWrapper"
        style={{
          width: "100%",
          height: "100vh",
          overflow: "scroll",
          overflowX: "auto",
        }}
      >
        {treeData && <TangledTree data={treeData} />}
        {treeData && <SunburstChart data={treeData} />}
        {/* {treeData && <CirclePackingChart data={treeData} />} */}
        {/* {treeData && <ZoomableSunBurstChart data={treeData} />} */}
      </div>
    </div>
  );
};

export default ExcelToJson;
