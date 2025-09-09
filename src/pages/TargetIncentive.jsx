import React, { useEffect, useState } from "react";
import { Select } from "antd";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import Navbar from "../components/layouts/Navbar";
import Modal from "../components/modals/Modal";
import SettingSidebar from "../components/layouts/SettingSidebar";

const TargetIncentive = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // YYYY-MM format
  const [agentLoading, setAgentLoading] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [employeeCustomerData, setEmployeeCustomerData] = useState([]);
  const [commissionTotalDetails, setCommissionTotalDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionForm, setCommissionForm] = useState({
    agent_id: "",
    pay_date: new Date().toISOString().split("T")[0],
    amount: "",
    pay_type: "cash",
    transaction_id: "",
    note: "",
    pay_for: "commission",
    admin_type: "",
  });
  const [errors, setErrors] = useState({});
  const [adminId, setAdminId] = useState("");
  const [adminName, setAdminName] = useState("");
  const [targetData, setTargetData] = useState({
    target: 0,
    achieved: 0,
    remaining: 0,
    startDate: "",
    endDate: "",
  });

  // Initialize with current month
  useEffect(() => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;
    setSelectedMonth(currentMonth);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setAdminId(user._id);
      setAdminName(user.name || "");
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/agent/get-employee");
      setEmployees(res?.data?.employee);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchCommissionReport = async (employeeId) => {
    if (!employeeId || !selectedMonth) return;
    const abortController = new AbortController();
    setLoading(true);
    try {
      // Calculate first and last day of selected month
      const [year, month] = selectedMonth.split("-");
      const firstDay = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).toISOString().split("T")[0];
      
      const res = await api.get("/enroll/get-detailed-commission-per-month", {
        params: { 
          agent_id: employeeId, 
          from_date: firstDay, 
          to_date: lastDay 
        },
        signal: abortController.signal,
      });
      setEmployeeCustomerData(res.data?.commission_data);
      setCommissionTotalDetails(res.data?.summary);
    } catch (err) {
      if (err.name !== "AbortController") {
        console.error("Error fetching employee report:", err);
        setEmployeeCustomerData([]);
        setCommissionTotalDetails({});
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  };

const fetchTargetData = async (employeeId) => {
  try {
    if (!employeeId || !selectedMonth) return;
    const abortController = new AbortController();

    const [year] = selectedMonth.split("-");
    
    // Fetch target details for the selected agent
    const targetRes = await api.get(`/target/agent/${employeeId}`, {
      params: { year },
      signal: abortController.signal,
    });

    // Map month number to month name (01-12 to January-December)
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthNumber = parseInt(selectedMonth.split("-")[1], 10);
    const monthName = monthNames[monthNumber - 1];

    let targetForMonth = 0;
    if (targetRes.data && targetRes.data.length > 0) {
      const monthData = targetRes.data[0].monthData || {};
      targetForMonth = Number(monthData[monthName] || 0);
    }

    // Calculate first and last day of selected month
    const [yearPart, monthPart] = selectedMonth.split("-");
    const firstDay = `${yearPart}-${monthPart}-01`;
    const lastDay = new Date(yearPart, monthPart, 0).toISOString().split("T")[0];

    // Fetch commission data to get achieved
    const { data: comm } = await api.get(
      "/enroll/get-detailed-commission-per-month",
      {
        params: {
          agent_id: employeeId,
          from_date: firstDay,
          to_date: lastDay,
        },
        signal: abortController.signal,
      }
    );

    let achieved = comm?.summary?.actual_business || 0;
    if (typeof achieved === "string") {
      achieved = Number(achieved.replace(/[^0-9.-]+/g, ""));
    }

    const remaining = Math.max(targetForMonth - achieved, 0);
    const difference = targetForMonth - achieved;

    // Format first and last day for display
    const startDateDisplay = firstDay;
    const endDateDisplay = lastDay;

    setTargetData({
      target: Math.round(targetForMonth),
      achieved,
      remaining,
      difference,
      startDate: startDateDisplay,
      endDate: endDateDisplay,
    });
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Error fetching target data:", err);
      setTargetData({
        target: 0,
        achieved: 0,
        remaining: 0,
        difference: 0,
        startDate: "",
        endDate: "",
      });
    }
  }
};
  const fetchAllCommissionReport = async () => {
    if (!selectedMonth) return;
    
    const abortController = new AbortController();
    setLoading(true);
    try {
      // Calculate first and last day of selected month
      const [year, month] = selectedMonth.split("-");
      const firstDay = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).toISOString().split("T")[0];
      
      const res = await api.get("enroll/get-detailed-commission-all", {
        params: { 
          from_date: firstDay, 
          to_date: lastDay 
        },
        signal: abortController.signal
      });
      setEmployeeCustomerData(res.data?.commission_data);
      setCommissionTotalDetails(res.data?.summary);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching all commission report:", err);
        setEmployeeCustomerData([]);
        setCommissionTotalDetails({});
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleEmployeeChange = async (value) => {
    setSelectedEmployeeId(value);
    setAgentLoading(true); 

    if (value === "ALL") {
      setSelectedEmployeeDetails(null);
      setTargetData({
        target: 0,
        achieved: 0,
        remaining: 0,
        startDate: "",
        endDate: "",
        designation: "",
        incentiveAmount: "₹0.00",
        incentivePercent: "0%",
      });
      await fetchAllCommissionReport();
    } else {
      const selectedEmp = employees.find((emp) => emp._id === value);
      setSelectedEmployeeDetails(selectedEmp || null);
      await fetchCommissionReport(value);
      await fetchTargetData(value);
    }

    setAgentLoading(false); 
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId === "ALL") {
      fetchAllCommissionReport();
    } else if (selectedEmployeeId && selectedMonth) {
      fetchCommissionReport(selectedEmployeeId);
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (selectedEmployeeId && selectedEmployeeId !== "ALL" && selectedMonth) {
      fetchTargetData(selectedEmployeeId);
    }
  }, [employeeCustomerData, selectedMonth]);

  const handleCommissionChange = (e) => {
    const { name, value } = e.target;
    setCommissionForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!commissionForm.agent_id) newErrors.agent_id = "Please select an agent";
    if (!commissionForm.amount || isNaN(commissionForm.amount))
      newErrors.amount = "Please enter a valid amount";
    if (commissionForm.pay_type === "online" && !commissionForm.transaction_id)
      newErrors.transaction_id = "Transaction ID is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCommissionSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const payload = { ...commissionForm, admin_type: adminId };
      await api.post("/payment-out/add-commission-payment", payload);
      alert("Commission Paid Successfully!");
      setShowCommissionModal(false);
    } catch (err) {
      alert("Failed to add payment.");
    }
  };

  const handlePayNow = () => {
    const actual = parseFloat(
      (commissionTotalDetails?.total_actual || "0")
        .toString()
        .replace(/[^0-9.-]+/g, "")
    );

    const total = actual;

    setCommissionForm({
      agent_id: selectedEmployeeId,
      pay_date: new Date().toISOString().split("T")[0],
      amount: total.toFixed(2),
      pay_type: "cash",
      transaction_id: "",
      note: "",
      pay_for: "commission",
      admin_type: adminId,
    });

    setErrors({});
    setShowCommissionModal(true);
  };

  const processedTableData = employeeCustomerData.map((item, index) => ({
    ...item,
  }));

  const columns = [
    ...(selectedEmployeeId === "ALL"
      ? [{ key: "agent_name", header: "Agent Name" }]
      : []),
    { key: "user_name", header: "Customer Name" },
    { key: "phone_number", header: "Phone Number" },
    { key: "group_name", header: "Group Name" },
    { key: "group_value_digits", header: "Group Value" },
    { key: "commission_rate", header: "Commission Rate" },
    { key: "start_date", header: "Start Date" },
    { key: "estimated_commission_digits", header: "Estimated Commission" },
    { key: "actual_commission_digits", header: "Actual Commission" },
    { key: "total_paid_digits", header: "Total Paid" },
    { key: "required_installment_digits", header: "Required Installment" },
    { key: "commission_released", header: "Commission Released" },
  ];

  // Get current month for max attribute
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  return (
    <div className="w-screen min-h-screen">
      <div className="flex mt-30">
        <SettingSidebar />
        <Navbar visibility={true} />
        <div className="flex-grow p-7">
          <h1 className="text-2xl font-bold text-center ">
            Reports - Commission
          </h1>

          <div className="mt-11 mb-8">
            <div className="mb-2">
              <div className="flex justify-center items-center w-full gap-4 bg-blue-50 p-2 w-30 h-40 rounded-3xl border   space-x-2">
                <div className="mb-2">
                  <label className="block text-lg text-gray-500 text-center font-semibold mb-2">
                    Employee
                  </label>
                  <Select
                    value={selectedEmployeeId || undefined}
                    onChange={handleEmployeeChange}
                    showSearch
                    popupMatchSelectWidth={false}
                    placeholder="Search or Select Employee"
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    style={{ height: "50px", width: "600px" }}
                  >
                    <Select.Option value="ALL">All</Select.Option>
                    {employees.map((emp) => (
                      <Select.Option key={emp._id} value={emp._id}>
                        {emp.name} - {emp.phone_number}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                {/* Single month picker */}
                <div className="mb-2">
                  <label className="block text-lg text-gray-500 text-center font-semibold mb-2">
                    Month
                  </label>
                  <input
                    type="month"
                    value={selectedMonth || ""}
                    max={currentMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-[200px] h-[50px]"
                  />
                </div>
              </div>
            </div>
          </div>
          {agentLoading ? (
            <div className="flex justify-center py-10">
              <CircularLoader isLoading={true} />
            </div>
          ) : (
            <>
              {/* Employee Info */}
              {(selectedEmployeeId === "ALL" || selectedEmployeeDetails) && (
                <div className="mb-8 bg-gray-50 rounded-md shadow-md p-6 space-y-4">
                  {selectedEmployeeId !== "ALL" && selectedEmployeeDetails && (
                    <>
                      <div className="flex gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium mb-1">Name</label>
                          <input
                            value={selectedEmployeeDetails.name || "-"}
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 bg-white"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium mb-1">Email</label>
                          <input
                            value={selectedEmployeeDetails.email || "-"}
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 bg-white"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium mb-1">
                            Phone Number
                          </label>
                          <input
                            value={selectedEmployeeDetails.phone_number || "-"}
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium mb-1">
                            Adhaar Number
                          </label>
                          <input
                            value={selectedEmployeeDetails.adhaar_no || "-"}
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 bg-white"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium mb-1">
                            PAN Number
                          </label>
                          <input
                            value={selectedEmployeeDetails.pan_no || "-"}
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 bg-white"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium mb-1">
                            Pincode
                          </label>
                          <input
                            value={selectedEmployeeDetails.pincode || "-"}
                            readOnly
                            className="border border-gray-300 rounded px-4 py-2 bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Address</label>
                        <input
                          value={selectedEmployeeDetails.address || "-"}
                          readOnly
                          className="border border-gray-300 rounded px-4 py-2 bg-white"
                        />
                      </div>
                    </>
                  )}

                  {/* Summary always shown */}
                  <div className="flex gap-4">
                    <div className="flex flex-col flex-1">
                      <label className="text-sm font-medium mb-1">
                        Actual Business
                      </label>
                      <input
                        value={commissionTotalDetails?.actual_business || "-"}
                        readOnly
                        className="border border-gray-300 rounded px-4 py-2 bg-white text-green-700 font-bold"
                      />
                    </div>

                    <div className="flex flex-col flex-1">
                      <label className="text-sm font-medium mb-1">
                        Actual Commission
                      </label>
                      <input
                        value={commissionTotalDetails?.total_actual || "-"}
                        readOnly
                        className="border border-gray-300 rounded px-4 py-2 bg-white  text-green-700 font-bold"
                      />
                    </div>

                    <div className="flex flex-col flex-1">
                      <label className="text-sm font-medium mb-1">
                        Gross Business
                      </label>
                      <input
                        value={commissionTotalDetails?.expected_business || "-"}
                        readOnly
                        className="border border-gray-300 rounded px-4 py-2 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col flex-1">
                      <label className="text-sm font-medium mb-1">
                        Gross Commission
                      </label>
                      <input
                        value={commissionTotalDetails?.total_estimated || "-"}
                        readOnly
                        className="border border-gray-300 rounded px-4 py-2 bg-white"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <label className="text-sm font-medium mb-1">
                        Total Customers
                      </label>
                      <input
                        value={commissionTotalDetails?.total_customers || "-"}
                        readOnly
                        className="border border-gray-300 rounded px-4 py-2 bg-white"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <label className="text-sm font-medium mb-1">
                        Total Groups
                      </label>
                      <input
                        value={commissionTotalDetails?.total_groups || "-"}
                        readOnly
                        className="border border-gray-300 rounded px-4 py-2 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedEmployeeId &&
                selectedEmployeeId !== "ALL" &&
                selectedMonth && (
                  <div className="bg-gray-100  p-4 rounded-lg shadow mb-6">
                    <h2 className="text-lg font-bold text-yellow-800 mb-2">
                      Target Details
                    </h2>

                    {targetData.achieved >= targetData.target && (
                      <div className="text-green-800 font-semibold mb-3">
                        🎉 Target Achieved
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4 bg-gray-50 ">
                      <div>
                        <label className="block font-medium">Target Set</label>
                        <input
                          value={`₹${targetData.target?.toLocaleString("en-IN")}`}
                          readOnly
                          className="border px-3 py-2 rounded w-full bg-gray-50 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Achieved</label>
                        <input
                          value={`₹${targetData.achieved?.toLocaleString("en-IN")}`}
                          readOnly
                          className="border px-3 py-2 rounded w-full bg-gray-50 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Difference</label>
                        <input
                          value={`₹${targetData.difference?.toLocaleString("en-IN")}`}
                          readOnly
                          className="border px-3 py-2 rounded w-full bg-gray-50 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-medium">Total Payable</label>
                        <input
                          readOnly
                          value={(() => {
                            const actual = parseFloat(
                              (commissionTotalDetails?.total_actual || "0")
                                .toString()
                                .replace(/[^0-9.-]+/g, "")
                            );
                            return `₹${actual.toLocaleString("en-IN")}`;
                          })()}
                          className="border px-3 py-2 rounded w-full bg-gray-50 text-green-700 font-bold"
                        />
                      </div>
                    </div>

                  
                  </div>
                )}

              <Modal
                isVisible={showCommissionModal}
                onClose={() => setShowCommissionModal(false)}
                width="max-w-md"
              >
                <div className="py-6 px-5 text-left">
                  <h3 className="mb-4 text-xl font-bold text-gray-900 border-b pb-2">
                    Add Commission Payment
                  </h3>
                  <form className="space-y-4" onSubmit={handleCommissionSubmit}>
                    <div>
                      <label className="block text-sm font-medium">
                        Agent Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={
                          employees.find(
                            (emp) => emp._id === commissionForm.agent_id
                          )?.name || ""
                        }
                        className="w-full border p-2 rounded bg-gray-100 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        name="pay_date"
                        value={commissionForm.pay_date}
                        onChange={handleCommissionChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Total Payable Commission
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={`₹${commissionForm.amount || "0.00"}`}
                        className="w-full border p-2 rounded bg-gray-100 text-green-700 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Payment Mode
                      </label>
                      <select
                        name="pay_type"
                        value={commissionForm.pay_type}
                        onChange={handleCommissionChange}
                        className="w-full border p-2 rounded"
                      >
                        <option value="cash">Cash</option>
                        <option value="online">Online</option>
                        <option value="cheque">Cheque</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>

                    {commissionForm.pay_type === "online" && (
                      <div>
                        <label className="block text-sm font-medium">
                          Transaction ID
                        </label>
                        <input
                          type="text"
                          name="transaction_id"
                          value={commissionForm.transaction_id}
                          onChange={handleCommissionChange}
                          className="w-full border p-2 rounded"
                        />
                        {errors.transaction_id && (
                          <p className="text-red-500 text-sm">
                            {errors.transaction_id}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium">Note</label>
                      <textarea
                        name="note"
                        value={commissionForm.note}
                        onChange={handleCommissionChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowCommissionModal(false)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        Save Payment
                      </button>
                    </div>
                  </form>
                </div>
              </Modal>

              {loading ? (
                <CircularLoader isLoading={true} />
              ) : employeeCustomerData.length > 0 ? (
                <>
                  <DataTable
                    data={processedTableData}
                    columns={columns}
                    exportedPdfName={`Commission Report`}
                    printHeaderKeys={[
                      "Name",
                      "Phone Number",
                      "Month",
                      "Target Set",
                      "Achieved",
                      "Remaining",
                      "Total Payable Commission",
                      "Actual Business",
                      "Actual Commission",
                      "Gross Business",
                      "Gross Commission",
                      "Total Customers",
                      "Total Groups",
                    ]}
                    printHeaderValues={[
                      selectedEmployeeId === "ALL"
                        ? "All Employees"
                        : selectedEmployeeDetails?.name || "-",
                      selectedEmployeeId === "ALL"
                        ? "-"
                        : selectedEmployeeDetails?.phone_number || "-",
                      selectedMonth
                        ? new Date(
                            `${selectedMonth}-01`
                          ).toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                          })
                        : "-",
                      `₹${targetData?.target?.toLocaleString("en-IN") || "0"}`,
                      `₹${targetData?.achieved?.toLocaleString("en-IN") || "0"}`,
                      `₹${targetData?.remaining?.toLocaleString("en-IN") || "0"}`,
                      (() => {
                        const actual = parseFloat(
                          (commissionTotalDetails?.total_actual || "0")
                            .toString()
                            .replace(/[^0-9.-]+/g, "")
                        );
                        return `₹${actual.toLocaleString("en-IN")}`;
                      })(),
                      `₹${commissionTotalDetails?.actual_business?.toLocaleString(
                        "en-IN"
                      ) || "0"
                      }`,
                      `₹${commissionTotalDetails?.total_actual?.toLocaleString(
                        "en-IN"
                      ) || "0"
                      }`,
                      `₹${commissionTotalDetails?.expected_business?.toLocaleString(
                        "en-IN"
                      ) || "0"
                      }`,
                      `₹${commissionTotalDetails?.total_estimated?.toLocaleString(
                        "en-IN"
                      ) || "0"
                      }`,
                      commissionTotalDetails?.total_customers || "0",
                      commissionTotalDetails?.total_groups || "0",
                    ]}
                    exportedFileName={`CommissionReport-${selectedEmployeeDetails?.name || "all"
                      }-${selectedMonth}.csv`}
                  />
                </>
              ) : (
                selectedEmployeeDetails?.name && (
                  <p className="text-center font-bold text-lg">
                    No Commission Data found.
                  </p>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default TargetIncentive;