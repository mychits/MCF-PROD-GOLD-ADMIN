import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select, Button, Typography, Table, message, Empty } from "antd";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";

const { Title, Text } = Typography;
const { Option } = Select;


// const SalaryRemainingReport = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [selectedDateType, setSelectedDateType] = useState("ThisYear");
//   const [selectedFromDate, setSelectedFromDate] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Format date
//   const today = new Date();
//   const formatDate = (date) => date.toLocaleDateString("en-CA");

//   // 🟢 Handle predefined date ranges
//   useEffect(() => {
//     const handleDateChange = (value) => {
//       if (value === "Today") {
//         const formatted = formatDate(today);
//         setSelectedFromDate(formatted);
//         setSelectedDate(formatted);
//       } else if (value === "Yesterday") {
//         const yesterday = new Date(today);
//         yesterday.setDate(yesterday.getDate() - 1);
//         const formatted = formatDate(yesterday);
//         setSelectedFromDate(formatted);
//         setSelectedDate(formatted);
//       } else if (value === "ThisMonth") {
//         const start = new Date(today.getFullYear(), today.getMonth(), 1);
//         const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//         setSelectedFromDate(formatDate(start));
//         setSelectedDate(formatDate(end));
//       } else if (value === "LastMonth") {
//         const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//         const end = new Date(today.getFullYear(), today.getMonth(), 0);
//         setSelectedFromDate(formatDate(start));
//         setSelectedDate(formatDate(end));
//       } else if (value === "ThisYear") {
//         const start = new Date(today.getFullYear(), 0, 1);
//         const end = new Date(today.getFullYear(), 11, 31);
//         setSelectedFromDate(formatDate(start));
//         setSelectedDate(formatDate(end));
//       }
//     };

//     handleDateChange(selectedDateType);
//   }, [selectedDateType]);

//   // 🟢 Fetch Employees
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await api.get("/agent/get-employee"); // adjust your endpoint
//         setEmployees(res.data.employee);
//       } catch (err) {
//         message.error("Failed to fetch employees");
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // 🟣 Fetch salary remaining data


// const handleGenerateReport = async () => {
//   if (!selectedEmp) {
//     message.warning("Please select an employee");
//     return;
//   }

//   setLoading(true);
//   try {
//     // const res = await api.get("/salary/get-remaining-salary", {
//     //   empId: selectedEmp,  // ✅ must match backend exactly
//     //   from_date: selectedFromDate,
//     //   to_date: selectedDate,
//     //   year: new Date().getFullYear().toString(),
//     // });
//        const res = await api.get(
//      `/salary/get-remaining-salary?empId=${selectedEmp}&from_date=${selectedFromDate}&to_date=${selectedDate}&year=${new Date().getFullYear()}`
//    );

//     console.log("API Response:", res.data);

//     if (res.data?.success) {
//       const d = res.data;
//       const emp = employees.find((e) => e._id === selectedEmp);

//       setReportData([
//         {
//           key: d.employee_id,
//           name: emp?.name || "N/A",
//           expected: d.summary.expected,
//           paid: d.summary.paid,
//           remaining: d.summary.remaining,
//           period: `${d.period.from_date} → ${d.period.to_date}`,
//         },
//       ]);
//     } else {
//       message.warning("No salary data found");
//       setReportData([]);
//     }
//   } catch (error) {
//     console.error("Error:", error.response?.data || error.message);
//     message.error("Error fetching salary report");
//     setReportData([]);
//   } finally {
//     setLoading(false);
//   }
// };


//   // 🧾 DataTable Columns
//   const columns = [
//     { title: "Employee Name", dataIndex: "name", key: "name" },
//     { title: "Expected Salary", dataIndex: "expected", key: "expected" },
//     { title: "Total Paid", dataIndex: "paid", key: "paid" },
//     { title: "Remaining Salary", dataIndex: "remaining", key: "remaining" },
//     { title: "Period", dataIndex: "period", key: "period" },
//   ];

//   return (
//     <div className="p-6">
//       <Card bordered={false} className="shadow-md rounded-xl mb-4">
//         <Title level={3}>💼 Employee Salary Remaining Report</Title>

//         <Row gutter={[16, 16]} align="middle">
//           <Col xs={24} md={8}>
//             <label className="font-semibold">Select Employee</label>
//             <Select
//               showSearch
//               placeholder="Choose employee"
//               style={{ width: "100%" }}
//               value={selectedEmp}
//               onChange={(v) => setSelectedEmp(v)}
//               filterOption={(input, option) =>
//                 option.children.toLowerCase().includes(input.toLowerCase())
//               }
//             >
//               {employees.map((emp) => (
//                 <Option key={emp._id} value={emp._id}>
//                   {emp.name}
//                 </Option>
//               ))}
//             </Select>
//           </Col>

//           <Col xs={24} md={8}>
//             <label className="font-semibold">Select Period</label>
//             <Select
//               value={selectedDateType}
//               onChange={(value) => setSelectedDateType(value)}
//               style={{ width: "100%" }}
//             >
//               <Option value="Today">Today</Option>
//               <Option value="Yesterday">Yesterday</Option>
//               <Option value="ThisMonth">This Month</Option>
//               <Option value="LastMonth">Last Month</Option>
//               <Option value="ThisYear">This Year</Option>
//             </Select>
//           </Col>

//           <Col xs={24} md={8} className="flex items-end">
//             <Button
//               type="primary"
//               size="large"
//               loading={loading}
//               onClick={handleGenerateReport}
//               style={{ width: "100%" }}
//             >
//               Generate Report
//             </Button>
//           </Col>
//         </Row>
//       </Card>

//       {/* 🧾 Salary DataTable */}
//       <Card bordered={false} className="shadow rounded-xl">
//         <Table
//           columns={columns}
//           dataSource={reportData}
//           loading={loading}
//           pagination={false}
//           bordered
//         />
//       </Card>
//     </div>
//   );
// };

// const SalaryRemainingReport = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [selectedDateType, setSelectedDateType] = useState("ThisYear");
//   const [selectedFromDate, setSelectedFromDate] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showFilterField, setShowFilterField] = useState(false);


//   const today = new Date();
//   const formatDate = (date) => date.toLocaleDateString("en-CA");


//   useEffect(() => {
//     const handleDateChange = (value) => {
//       setShowFilterField(false);

//       if (value === "Today") {
//         const formatted = formatDate(today);
//         setSelectedFromDate(formatted);
//         setSelectedDate(formatted);
//       } else if (value === "Yesterday") {
//         const yesterday = new Date(today);
//         yesterday.setDate(yesterday.getDate() - 1);
//         const formatted = formatDate(yesterday);
//         setSelectedFromDate(formatted);
//         setSelectedDate(formatted);
//       } else if (value === "ThisMonth") {
//         const start = new Date(today.getFullYear(), today.getMonth(), 1);
//         const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//         setSelectedFromDate(formatDate(start));
//         setSelectedDate(formatDate(end));
//       } else if (value === "LastMonth") {
//         const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//         const end = new Date(today.getFullYear(), today.getMonth(), 0);
//         setSelectedFromDate(formatDate(start));
//         setSelectedDate(formatDate(end));
//       } else if (value === "ThisYear") {
//         const start = new Date(today.getFullYear(), 0, 1);
//         const end = new Date(today.getFullYear(), 11, 31);
//         setSelectedFromDate(formatDate(start));
//         setSelectedDate(formatDate(end));
//       } else if (value === "Custom") {
//         setShowFilterField(true);
//         setSelectedFromDate("");
//         setSelectedDate("");
//       }
//     };

//     handleDateChange(selectedDateType);
//   }, [selectedDateType]);


//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await api.get("/agent/get-employee");
//         setEmployees(res.data.employee);
//       } catch (err) {
//         message.error("Failed to fetch employees");
//       }
//     };
//     fetchEmployees();
//   }, []);


// //   const handleGenerateReport = async () => {
// //     if (!selectedEmp) {
// //       message.warning("Please select an employee");
// //       return;
// //     }

// //     if (!selectedFromDate || !selectedDate) {
// //       message.warning("Please select valid dates");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
  
// //       const res = await api.get(
// //         `/salary/get-remaining-salary?empId=${selectedEmp}&from_date=${selectedFromDate}&to_date=${selectedDate}&year=${new Date().getFullYear()}`
// //       );

// //       console.log("API Response:", res.data);

// //       if (res.data?.success) {
// //         const d = res.data;
// //         const emp = employees.find((e) => e._id === selectedEmp);

// //         setReportData([
// //           {
// //             key: d.employee_id,
// //             name: emp?.full_name || emp?.name || "N/A",
// //             expected: d.summary.expected,
// //             paid: d.summary.paid,
// //             remaining: d.summary.remaining,
// //             period: `${d.period.from_date} → ${d.period.to_date}`,
// //           },
// //         ]);
// //       } else {
// //         message.warning("No salary data found");
// //         setReportData([]);
// //       }
// //     } catch (error) {
// //       console.error("Error:", error.response?.data || error.message);
// //       message.error("Error fetching salary report");
// //       setReportData([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// const handleGenerateReport = async () => {
//   if (!selectedEmp) {
//     message.warning("Please select an employee");
//     return;
//   }
//   if (!selectedFromDate || !selectedDate) {
//     message.warning("Please select valid dates");
//     return;
//   }

//   setLoading(true);
//   try {
//     const res = await api.get(
//       `/salary/get-remaining-salary?empId=${selectedEmp}&from_date=${selectedFromDate}&to_date=${selectedDate}&year=${new Date().getFullYear()}`
//     );

//     if (res.data?.success && res.data.monthlyReport?.length) {
//       const emp = employees.find((e) => e._id === selectedEmp);
//       const rows = res.data.monthlyReport.map((m, index) => ({
//         key: index,
//         name: emp?.full_name || emp?.name || "N/A",
//         month: m.month,
//         expected: m.expected,
//         paid: m.paid,
//         remaining: m.remaining,
//       }));
//       setReportData(rows);
//     } else {
//       message.warning("No data found for this employee");
//       setReportData([]);
//     }
//   } catch (error) {
//     console.error("Error:", error.response?.data || error.message);
//     message.error("Error fetching salary report");
//   } finally {
//     setLoading(false);
//   }
// };

// const columns = [
//   { header: "Employee Name", key: "name" },
//   { header: "Month", key: "month" },
//   { header: "Expected Salary", key: "expected" },
//   { header: "Paid Salary", key: "paid" },
//   { header: "Remaining Salary", key: "remaining" },
// ];

//   return (
//     <div className="p-6">
//       <Card bordered={false} className="shadow-md rounded-xl mb-4">
//         <Title level={3}>Monthly Salary Report</Title>

//         <Row gutter={[16, 16]} align="middle">
//           <Col xs={24} md={8}>
//             <label className="font-semibold">Select Employee</label>
//             <Select
//               showSearch
//               placeholder="Choose employee"
//               style={{ width: "100%" }}
//               value={selectedEmp}
//               onChange={(v) => setSelectedEmp(v)}
//               filterOption={(input, option) =>
//                 option?.children?.toLowerCase().includes(input.toLowerCase())
//               }
//             >
//               {employees.map((emp) => (
//                 <Option key={emp._id} value={emp._id}>
//                   {emp.name}
//                 </Option>
//               ))}
//             </Select>
//           </Col>

//           <Col xs={24} md={8}>
//             <label className="font-semibold">Select Period</label>
//             <Select
//               value={selectedDateType}
//               onChange={(value) => setSelectedDateType(value)}
//               style={{ width: "100%" }}
//             >
//               {/* <Option value="Today">Today</Option>
//               <Option value="Yesterday">Yesterday</Option> */}
//               <Option value="ThisMonth">This Month</Option>
//               <Option value="LastMonth">Last Month</Option>
//               <Option value="ThisYear">This Year</Option>
//               <Option value="Custom">Custom</Option>
//             </Select>
//           </Col>

//           <Col xs={24} md={8} className="flex items-end">
//             <Button
//               type="primary"
//               size="large"
//               loading={loading}
//               onClick={handleGenerateReport}
//               style={{ width: "100%" }}
//             >
//               Generate Report
//             </Button>
//           </Col>
//         </Row>

//         {/* 🗓️ Custom Date Filter Fields */}
//         {showFilterField && (
//           <div className="flex gap-4 mt-4">
//             <div className="mb-2">
//               <label>From Date</label>
//               <input
//                 type="date"
//                 value={selectedFromDate}
//                 onChange={(e) => setSelectedFromDate(e.target.value)}
//                 className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full max-w-xs"
//               />
//             </div>
//             <div className="mb-2">
//               <label>To Date</label>
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full max-w-xs"
//               />
//             </div>
//           </div>
//         )}
//       </Card>

    
//       <Card bordered={false} className="shadow rounded-xl">
//         <DataTable
//           columns={columns}
//           data={reportData}
//           loading={loading}
//          // pagination={false}
//          // bordered
//         />
//       </Card>
//     </div>
//   );
// };


// const SalaryRemainingReport = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🟢 Fetch employees
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await api.get("/agent/get-employee");
//         setEmployees(res.data.employee);
//       } catch (err) {
//         console.error("Error fetching employees:", err);
//         message.error("Failed to load employees");
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // 🟣 Fetch monthly salary data
//   const handleGenerateReport = async () => {
//     if (!selectedEmp) {
//       message.warning("Please select an employee");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.get(
//         `/salary/get-remaining-salary?empId=${selectedEmp}&year=${selectedYear}`
//       );

//       console.log("API Response:", res.data);

//       if (res.data?.success && res.data.monthlyReport.length > 0) {
//         const employee = employees.find((e) => e._id === selectedEmp);
//         const tableData = res.data.monthlyReport.map((m, index) => ({
//           key: index,
//           employee: employee?.full_name || employee?.name || "N/A",
//           month: m.month,
//           expected: m.expected,
//           paid: m.paid,
//           remaining: m.remaining,
//         }));

//         setReportData(tableData);
//       } else {
//         message.warning("No salary data found for this employee");
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching report:", error);
//       message.error("Error fetching salary report");
//       setReportData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🧾 Table Columns
//   const columns = [
//     { header: "Employee Name", key: "employee" },
//     { header: "Month", key: "month" },
//     { header: "Expected Salary",key: "expected" },
//     { header: "Total Paid", key: "paid" },
//     { header: "Remaining Salary", key: "remaining" },
//   ];

//   return (
//     <div className="p-6">
//       <Card bordered={false} className="shadow-md rounded-xl mb-4">
//         <Title level={3}>💼 Monthly Employee Salary Remaining Report</Title>

//         <Row gutter={[16, 16]} align="middle">
//           {/* Select Employee */}
//           <Col xs={24} md={8}>
//             <label className="font-semibold">Select Employee</label>
//             <Select
//               showSearch
//               placeholder="Choose employee"
//               style={{ width: "100%" }}
//               value={selectedEmp}
//               onChange={(v) => setSelectedEmp(v)}
//               filterOption={(input, option) =>
//                 option?.children?.toLowerCase().includes(input.toLowerCase())
//               }
//             >
//               {employees.map((emp) => (
//                 <Option key={emp._id} value={emp._id}>
//                   {emp.name}
//                 </Option>
//               ))}
//             </Select>
//           </Col>

//           {/* Select Year */}
//           <Col xs={24} md={8}>
//             <label className="font-semibold">Select Year</label>
//             <Select
//               value={selectedYear}
//               onChange={(v) => setSelectedYear(v)}
//               style={{ width: "100%" }}
//             >
//               <Option value="2025">2025</Option>
//               <Option value="2024">2024</Option>
//               <Option value="2023">2023</Option>
//             </Select>
//           </Col>

//           {/* Generate Button */}
//           <Col xs={24} md={8} className="flex items-end">
//             <Button
//               type="primary"
//               size="large"
//               loading={loading}
//               onClick={handleGenerateReport}
//               style={{ width: "100%" }}
//             >
//               Generate Report
//             </Button>
//           </Col>
//         </Row>
//       </Card>

//       {/* 🧾 Salary Table */}
//       <Card bordered={false} className="shadow rounded-xl">
//         <DataTable
//           columns={columns}
//           data={reportData}
//           loading={loading}
//           //pagination={false}
//          // bordered
//         />
//       </Card>
//     </div>
//   );
// };

// const SalaryRemainingReport = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const allMonths = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
//   ];

//   // 🟢 Fetch employees
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await api.get("/agent/get-employee");
//         setEmployees(res.data.employee);
//       } catch (err) {
//         console.error("Error fetching employees:", err);
//         message.error("Failed to load employees");
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // 🟣 Fetch monthly salary data
//   const handleGenerateReport = async () => {
//     if (!selectedEmp) {
//       message.warning("Please select an employee");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.get(
//         `/salary/get-remaining-salary?empId=${selectedEmp}&year=${selectedYear}`
//       );

//       console.log("API Response:", res.data);

//       if (res.data?.success) {
//         const employee = employees.find((e) => e._id === selectedEmp);
//         const salaryData = res.data.monthlyReport || [];

//         // 🔹 Create a map of months that have data
//         const salaryMap = salaryData.reduce((acc, item) => {
//           acc[item.month] = item;
//           return acc;
//         }, {});

//         // 🔹 Build full 12-month data
//         const fullYearData = allMonths.map((month, index) => {
//           const data = salaryMap[month] || {};
//           return {
//             key: index,
//             employee: employee?.full_name || employee?.name || "N/A",
//             month,
//             expected: data.expected ?? 0,
//             paid: data.paid ?? 0,
//             remaining: data.remaining ?? data.expected ?? 0,
//           };
//         });

//         setReportData(fullYearData);
//       } else {
//         message.warning("No salary data found for this employee");
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching report:", error);
//       message.error("Error fetching salary report");
//       setReportData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🧾 Table Columns
//   const columns = [
//     { header: "Employee Name", key: "employee" },
//     { header: "Month", key: "month" },
//     { header: "Expected Salary", key: "expected" },
//     { header: "Total Paid", key: "paid" },
//     { header: "Remaining Salary", key: "remaining" },
//   ];

//   return (
//     <div className="p-6">
//       <Card bordered={false} className="shadow-md rounded-xl mb-4">
//         <Title level={3}>Monthly Employee Salary Report</Title>

//         <Row gutter={[16, 16]} align="middle">
//           {/* Select Employee */}
//           <Col xs={24} md={8}>
//             <label className="font-semibold">Select Employee</label>
//             <Select
//               showSearch
//               placeholder="Choose employee"
//               style={{ width: "100%" }}
//               value={selectedEmp}
//               onChange={(v) => setSelectedEmp(v)}
//               filterOption={(input, option) =>
//                 option?.children?.toLowerCase().includes(input.toLowerCase())
//               }
//             >
//               {employees.map((emp) => (
//                 <Option key={emp._id} value={emp._id}>
//                   {emp.name}
//                 </Option>
//               ))}
//             </Select>
//           </Col>

//           {/* Select Year */}
//           <Col xs={24} md={8}>
//             <label className="font-semibold">Select Year</label>
//             <Select
//               value={selectedYear}
//               onChange={(v) => setSelectedYear(v)}
//               style={{ width: "100%" }}
//             >
//               <Option value="2025">2025</Option>
//               <Option value="2024">2024</Option>
//               <Option value="2023">2023</Option>
//             </Select>
//           </Col>

//           {/* Generate Button */}
//           <Col xs={24} md={8} className="flex items-end">
//             <Button
//               type="primary"
//               size="large"
//               loading={loading}
//               onClick={handleGenerateReport}
//               style={{ width: "100%" }}
//             >
//               Generate Report
//             </Button>
//           </Col>
//         </Row>
//       </Card>

//       {/* 🧾 Salary Table */}
//       <Card bordered={false} className="shadow rounded-xl">
//         <DataTable
//           columns={columns}
//           data={reportData}
//           loading={loading}
//         />
//       </Card>
//     </div>
//   );
// };


const SalaryRemainingReport = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false); // 🆕 Flag for empty results

  const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // 🟢 Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/agent/get-employee");
        setEmployees(res.data.employee);
      } catch (err) {
        console.error("Error fetching employees:", err);
        message.error("Failed to load employees");
      }
    };
    fetchEmployees();
  }, []);

  // 🟣 Fetch monthly salary data
  const handleGenerateReport = async () => {
    if (!selectedEmp) {
      message.warning("Please select an employee");
      return;
    }

    setLoading(true);
    setNoData(false);

    try {
      const res = await api.get(
        `/salary/get-remaining-salary?empId=${selectedEmp}&year=${selectedYear}`
      );

      console.log("API Response:", res.data);

      if (res.data?.success && res.data.monthlyReport?.length > 0) {
        const employee = employees.find((e) => e._id === selectedEmp);
        const salaryData = res.data.monthlyReport;

        // 🔹 Create a map of months that have data
        const salaryMap = salaryData.reduce((acc, item) => {
          acc[item.month] = item;
          return acc;
        }, {});

        // 🔹 Build full 12-month data (mix with API data)
        const fullYearData = allMonths.map((month, index) => {
          const data = salaryMap[month] || {};
          return {
            key: index,
            employee: employee?.full_name || employee?.name || "N/A",
            month,
            expected: data.expected ?? 0,
            paid: data.paid ?? 0,
            remaining: data.remaining ?? (data.expected ?? 0),
          };
        });

        setReportData(fullYearData);
      } else {
        // ❌ No data found
        setReportData([]);
        setNoData(true);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      message.error("Error fetching salary report");
      setReportData([]);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Table Columns
  const columns = [
    { header: "Employee Name", key: "employee" },
    { header: "Month", key: "month" },
    { header: "Expected Salary", key: "expected" },
    { header: "Total Paid", key: "paid" },
    { header: "Remaining Salary", key: "remaining" },
  ];

  return (
    <div className="p-6">
      <Card bordered={false} className="shadow-md rounded-xl mb-4">
        <Title level={3}>Monthly Employee Salary Report</Title>

        <Row gutter={[16, 16]} align="middle">
          {/* Select Employee */}
          <Col xs={24} md={8}>
            <label className="font-semibold">Select Employee</label>
            <Select
              showSearch
              placeholder="Choose employee"
              style={{ width: "100%" }}
              value={selectedEmp}
              onChange={(v) => setSelectedEmp(v)}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map((emp) => (
                <Option key={emp._id} value={emp._id}>
                  {emp.name}
                </Option>
              ))}
            </Select>
          </Col>

          {/* Select Year */}
          <Col xs={24} md={8}>
            <label className="font-semibold">Select Year</label>
            <Select
              value={selectedYear}
              onChange={(v) => setSelectedYear(v)}
              style={{ width: "100%" }}
            >
              <Option value="2025">2025</Option>
              <Option value="2024">2024</Option>
              <Option value="2023">2023</Option>
            </Select>
          </Col>

          {/* Generate Button */}
          <Col xs={24} md={8} className="flex items-end">
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleGenerateReport}
              style={{ width: "100%" }}
            >
              Generate Report
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 🧾 Salary Table */}
      <Card bordered={false} className="shadow rounded-xl">
        {noData ? (
          <Empty
            description={`No data found for this employee in ${selectedYear}`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <DataTable columns={columns} data={reportData} loading={loading} />
        )}
      </Card>
    </div>
  );
};




export default SalaryRemainingReport;

