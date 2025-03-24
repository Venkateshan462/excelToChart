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
import TreeView from './components/charts/TreeView';
const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'All Value chains',
    children: <PharmaProcessTree />,
  },
  {
    key: '2',
    label: 'By Value chain',
    // children: <div><TangledTree /> <SunburstChart /></div>,
    children: <div><TreeView /></div>
  },
];
const App = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
export default App;