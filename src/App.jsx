import React from "react";
import ExcelToJson from "./components/ExcelToJson";
import MultiSheetExcelToJson from "./components/multiSheet/MultiSheetExcelToJson";
import PharmaProcessTree from "./components/multiSheet/pharmaprocesstree";

const App = () => {
  return (
    <div>
      {/* <MultiSheetExcelToJson /> */}
      <PharmaProcessTree />
      <ExcelToJson />
    </div>
  );
};

export default App;
