import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { buildDynamicOrgTree } from "../buildDynamicOrgTree";
import TangledTree from "../d3/TangledTree";
import CollapsibleTree from "../d3/CollapsibleTree";
import TreeView from "../charts/TreeView";
import HierarchyChart from "../charts/HierarchyChart";
import VisNetworkChart from "../charts/VisNetworkChart";

const MultiSheetExcelToJson = () => {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    if (excelData) {
      const filteredData = filterNonEmptyData(excelData);
      const keysToFomat = Object.keys(filteredData).map((key) => {
        const getHierarchyKeys = Object.keys(filteredData[key][0]);

        const hierarchyKeys = getHierarchyKeys;

        return { [key]: buildDynamicOrgTree(filteredData[key], hierarchyKeys) };
      });

      const result = convertToRadialTree(keysToFomat);
      setTreeData(result);
    }
  }, [excelData]);

  const convertToRadialTree = (data) => {
    return {
      name: "Root",
      children: data.map((category) => {
        const key = Object.keys(category)[0]; // Get top-level key (e.g., "Research")
        return {
          name: key,
          children: category[key], // Directly attach existing hierarchy
        };
      }),
    };
  };

  const filterNonEmptyData = (data) => {
    const cleanedData = {};

    Object.entries(data).forEach(([key, value]) => {
      const filteredItems = value.filter((item) =>
        Object.values(item).some((val) => val.trim() !== "")
      );

      if (filteredItems.length > 0) {
        cleanedData[key] = filteredItems;
      }
    });

    return cleanedData;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.match(/\.(xls|xlsx)$/)) {
      alert("Please upload a valid Excel file (.xls or .xlsx)");
      return;
    }

    setFileName(file.name); // Store file name for UI feedback

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const allSheetsData = {};
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            defval: "",
          });
          allSheetsData[sheetName] = sheet;
        });

        setExcelData(allSheetsData);
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Failed to process the Excel file.");
      }
    };

    reader.onerror = (error) => {
      console.error("File reading error:", error);
      alert("Error reading file.");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {fileName && (
        <p>
          Uploaded File: <strong>{fileName}</strong>
        </p>
      )}

      {treeData && (
        // <pre
        //   style={{
        //     height: "100vh",
        //     overflowY: "auto",
        //     border: "1px solid #ddd",
        //     padding: "10px",
        //     marginTop: "10px",
        //   }}
        // >
        //   <CollapsibleTree data={treeData} />
        // </pre>
        <>
          <VisNetworkChart data={treeData} />
          <HierarchyChart data={treeData} />
          <TreeView data ={treeData} />
        </>
      )}
    </div>
  );
};

export default MultiSheetExcelToJson;
