// import React from "react";
// import TangledTree from "./components/d3/TangledTree";
// import SunburstChart from "./components/d3/SunburstChart";
// import MultiSheetExcelToJson from "./components/multiSheet/MultiSheetExcelToJson";
// import PharmaProcessTree from "./components/multiSheet/pharmaprocesstree";
// // import ExcelToJson from "./components/ExcelToJson";

// const App = () => {
//   return (
//     <div>
//       {/* <MultiSheetExcelToJson /> */}
//       <PharmaProcessTree />
//       <TangledTree />
//       {/* <ExcelToJson /> */}
//       <SunburstChart />
//     </div>
//   );
// };

// export default App;

import React from 'react';
import { Tabs } from 'antd';
import TangledTree from "./components/d3/TangledTree";
import SunburstChart from "./components/d3/SunburstChart";
import MultiSheetExcelToJson from "./components/multiSheet/MultiSheetExcelToJson";
import PharmaProcessTree from "./components/multiSheet/pharmaprocesstree";
// import ExcelToJson from "./components/ExcelToJson";
const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Single Chain Process',
    children: <PharmaProcessTree />,
  },
  {
    key: '2',
    label: 'Multi Chain Process',
    children: <div><TangledTree /> <SunburstChart /></div>,
  },
];
const App = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
export default App;