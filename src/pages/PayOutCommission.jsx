/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import API from "../instance/TokenInstance";
import Modal from "../components/modals/Modal";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import CircularLoader from "../components/loaders/CircularLoader";
import Navbar from "../components/layouts/Navbar";
import { Select, Tooltip, notification } from "antd";

const PayOutCommission = () => {
  const paymentFor = "commission"
  const [api, contextHolder] = notification.useNotification();
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [modifyPayment, setModifyPayment] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    noReload: false,
    type: "info",
  });
  const [agents, setAgents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [agentType, setAgentType] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState("0.00");

  const [alreadyPaid, setAlreadyPaid] = useState("0.00");
const [remainingPayable, setRemainingPayable] = useState("0.00");

  const [selectedUserList, setSelectedUserList] = useState([]);
  const [commissionPayments, setCommissionPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCommissionCalculation, setIsLoadingCommissionCalculation] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [errors, setErrors] = useState({});
  const [reRender, setReRender] = useState(0);

  const [targetData, setTargetData] = useState({
    target: 0,
    achieved: 0,
    remaining: 0,
    difference: 0,
    incentiveAmount: "₹0.00",
    incentivePercent: "0%",
  });



  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);


  const [commissionForm, setCommissionForm] = useState({
    agent_id: "",
    pay_date: new Date().toISOString().split("T")[0],

    commissionCalculationFromDate: "",
    commissionCalculationToDate: "",
    amount: "", // This will be auto-populated
    pay_type: "cash",
    transaction_id: "",
    note: "",
    pay_for: paymentFor,
    admin_type: "",
  });

  const [commissionBreakdown, setCommissionBreakdown] = useState([]);
  const [incentiveAmount, setIncentiveAmount] = useState("0.00");


  // const fetchAgents = async () => {
  //   try {
  //     const response = await API.get("/agent/get-agent");
  //     if (response.data) {
  //       setAgents(response.data);
  //     } else {
  //       setAgents({});
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch Agents");
  //   }
  // };

  const fetchAgents = async () => {
    try {
      const res = await API.get("/agent/get-agent");
      const all = res.data || [];

      setAgents(all.filter(a => a.agent_type === "agent" || a.agent_type === "both"));
      setEmployees(all.filter(a => a.agent_type === "employee" || a.agent_type === "both"));
    } catch (err) {
      console.error("Agent fetch error", err);
    }
  };

const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const d = new Date(date);
  if (isNaN(d)) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fetchTargetDetails = async (agentId, fromDate, toDate) => {
  if (!agentId || !fromDate || !toDate) {
    setTargetData({
      target: 0,
      achieved: 0,
      remaining: 0,
      difference: 0,
      incentiveAmount: "₹0.00",
      incentivePercent: "0%",
    });
    return;
  }

  try {
    const res = await API.get(`/target/employee/${agentId}`, {
      params: { from_date: formatDate(fromDate), to_date: formatDate(toDate) },
    });

    if (res.data?.success && res.data?.summary) {
      const empSummary = res.data.summary;

      setTargetData({
        target: empSummary.agent?.target?.value || "Not Set",
        achieved: empSummary.metrics?.actual_business || "₹0.00",
        difference: empSummary.metrics?.target_difference || "₹0.00",
        remaining: empSummary.metrics?.target_remaining || "₹0.00",
        incentiveAmount: empSummary.metrics?.incentive || "₹0.00",  
        incentivePercent:
          (empSummary.agent?.target?.achievement_percent || "0") + "%",
      });
    } else {
      setTargetData({
        target: 0,
        achieved: 0,
        remaining: 0,
        difference: 0,
        incentiveAmount: "₹0.00",
        incentivePercent: "0%",
      });
    }
  } catch (error) {
    console.error("Failed to fetch target details", error);
    setTargetData({
      target: 0,
      achieved: 0,
      remaining: 0,
      difference: 0,
      incentiveAmount: "₹0.00",
      incentivePercent: "0%",
    });
  }
};

  const fetchCommissionPayments = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/payment-out/get-commission-payments");
      const responseData = response.data.map((payment, index) => ({
        id: index + 1,
        _id: payment._id,
        agent_id: payment.agent_id,
        agent_name: payment.agent_id?.name,
        pay_date: payment.pay_date,
        amount: payment.amount,
        pay_type: payment.pay_type,
        commission_from: payment.commissionCalculationFromDate?.split("T")[0] || "-",
        commission_to: payment.commissionCalculationToDate?.split("T")[0] || "-",
        transaction_id: payment.transaction_id,
        note: payment.note,
        pay_for: payment.pay_for,
        disbursed_by: payment.admin_type?.name,
        receipt_no: payment.receipt_no
      }));
      setCommissionPayments(responseData);
    } catch (error) {
      console.error("Failed to fetch Commission payments", error);
      setCommissionPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

//   useEffect(() => {
//   const { agent_id, commissionCalculationFromDate, commissionCalculationToDate } = commissionForm;
//   if (agent_id && commissionCalculationFromDate && commissionCalculationToDate) {
//     const fd = formatDate(commissionCalculationFromDate);
//     const td = formatDate(commissionCalculationToDate);
//     fetchTargetDetails(agent_id, fd, td);
//   }
// }, [commissionForm.agent_id, commissionForm.commissionCalculationFromDate, commissionForm.commissionCalculationToDate]);


  useEffect(() => {
    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);
    setAdminId(userObj._id);
    setAdminName(userObj.full_name || userObj.name || "");

    if (userObj?.admin_access_right_id?.access_permissions?.edit_payment) {
      setModifyPayment(
        userObj.admin_access_right_id.access_permissions.edit_payment === "true"
      );
    }

    fetchAgents();
    fetchCommissionPayments();
  }, [reRender]);

const calculateTotalPayableCommission = async (agentId, calcFromDate, calcToDate) => {
  if (!agentId || !calcFromDate || !calcToDate) {
    setCommissionForm((prev) => ({ ...prev, amount: "" }));
    return;
  }

  setIsLoadingCommissionCalculation(true);
  try {
    const { data: comm } = await API.get(
      "/enroll/get-detailed-commission-per-month",
      { params: { agent_id: agentId, from_date: formatDate(calcFromDate), to_date: formatDate(calcToDate) } }
    );

    const summary = comm?.summary || {};
    const breakdown = comm?.commission_data || [];
    setCommissionBreakdown(breakdown);

    let achieved = summary?.actual_business || 0;
    if (typeof achieved === "string") {
      achieved = Number(achieved.replace(/[^0-9.-]+/g, ""));
    }

    const actualCommission = parseFloat(
      (summary?.total_actual || "0").toString().replace(/[^0-9.-]+/g, "")
    );

    // agent incentive = 1% of difference (if > 0), else 0
    const difference = achieved - (summary?.target_value || 0);
    let incentive = 0;
    if (difference > 0) {
      incentive = difference * 0.01;
    }

    setTargetData({
      target: summary?.target_value || 0,
      achieved,
      remaining: Math.max((summary?.target_value || 0) - achieved, 0),
      difference,
      incentiveAmount: `₹${incentive.toFixed(2)}`,
      incentivePercent: "1%",
    });

    
    const totalPayable = actualCommission ;
    setCalculatedAmount(totalPayable.toFixed(2));
  } catch (error) {
    console.error("Failed to calculate agent commission:", error);
    setCommissionForm((prev) => ({ ...prev, amount: "" }));
  } finally {
    setIsLoadingCommissionCalculation(false);
  }
};

  const handleCommissionChange = (e) => {
    const { name, value } = e.target;
    setCommissionForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));


    if (name === "agent_id") {
      const updatedAgentId = value;
      const updatedFromDate = commissionForm.commissionCalculationFromDate;
      const updatedToDate = commissionForm.commissionCalculationToDate;

      if (updatedAgentId && updatedFromDate && updatedToDate) {
        calculateTotalPayableCommission(updatedAgentId, updatedFromDate, updatedToDate);
      } else {
        setCommissionForm((prev) => ({ ...prev, amount: "" }));
      }
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!commissionForm.agent_id) {
      newErrors.agent_id = "Please select an agent";
    }

    if (!commissionForm.amount || isNaN(commissionForm.amount) || parseFloat(commissionForm.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!commissionForm.commissionCalculationFromDate) {
      newErrors.commissionCalculationFromDate = "Commission From Date is required";
    }
    if (!commissionForm.commissionCalculationToDate) {
      newErrors.commissionCalculationToDate = "Commission To Date is required";
    }
    if (commissionForm.commissionCalculationFromDate && commissionForm.commissionCalculationToDate &&
      new Date(commissionForm.commissionCalculationFromDate) > new Date(commissionForm.commissionCalculationToDate)) {
      newErrors.commissionCalculationToDate = "To Date must be after From Date";
    }


    if (
      commissionForm.pay_type === "online" &&
      !commissionForm.transaction_id
    ) {
      newErrors.transaction_id = "Transaction ID is required for online payments"; // Corrected error key
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCommissionSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        setIsLoading(true);

        const payload = {
          ...commissionForm,
          admin_type: adminId,
        };

        // ✅ Send full payload including commissionCalculationFromDate & ToDate
        await API.post("/payment-out/add-commission-payment", payload);

        api.open({
          message: "Commission PayOut Added",
          description: "Commission Payment Has Been Successfully Added",
          className: "bg-green-400 rounded-lg font-bold",
          showProgress: true,
          pauseOnHover: false,
        });

        setShowCommissionModal(false);

        // Reset the form
        setCommissionForm({
          agent_id: "",
          pay_date: new Date().toISOString().split("T")[0],
          commissionCalculationFromDate: "",
          commissionCalculationToDate: "",
          amount: "",
          pay_type: "cash",
          transaction_id: "",
          note: "",
          admin_type: adminId,
          pay_for: paymentFor,
        });

        setReRender((val) => val + 1);
        fetchCommissionPayments();
      } catch (error) {
        const message = error.message || "Something went wrong";
        api.open({
          message: "Failed to Add Commission Payout",
          description: message,
          showProgress: true,
          pauseOnHover: false,
          className: "bg-red-400 rounded-lg font-bold",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };


  const commissionColumns = [
    { key: "id", header: "SL. NO" },
    { key: "pay_date", header: "Pay Date" },
    { key: "agent_name", header: "Agent" },
    { key: "amount", header: "Amount (₹)" },
    { key: "pay_type", header: "Payment Mode" },
    { key: "commission_from", header: "From Date" },
    { key: "commission_to", header: "To Date" },
    { key: "receipt_no", header: "Receipt No" },
    { key: "note", header: "Note" },
    { key: "disbursed_by", header: "Disbursed by" },
  ];


  const resetCommissionForm = () => {
    setAgentType("");
    setSelectedUserList([]);
    setCommissionForm({
      agent_id: "",
      pay_date: new Date().toISOString().split("T")[0],
      commissionCalculationFromDate: "",
      commissionCalculationToDate: "",
      amount: "",
      pay_type: "cash",
      transaction_id: "",
      note: "",
      admin_type: adminId,
      pay_for: paymentFor,
    });
    setCommissionBreakdown([]);
    setIncentiveAmount("0.00");
    setTargetData({
      target: 0,
      achieved: 0,
      remaining: 0,
      difference: 0,
      incentiveAmount: "₹0.00",
      incentivePercent: "0%",
    });
    setCalculatedAmount("0.00");
    setErrors({});
    setAlreadyPaid("0.00");
    setRemainingPayable("0.00");
  };


  return (
    <>
      <div>
        {contextHolder}
        <div className="flex mt-20">
          <Navbar visibility={true} />
          <Sidebar />
          <CustomAlert
            type={alertConfig.type}
            isVisible={alertConfig.visibility}
            message={alertConfig.message}
            noReload={alertConfig.noReload}
          />
          <div className="flex-grow p-7">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold mb-4 md:mb-0">
                <span className="text-2xl text-red-500 font-bold">
                  {/* {paymentFor?.toUpperCase()} */}
                  Commission / Incentive
                </span>{" "}
                Payments Out
              </h1>


              <Tooltip title="Add Commission Payment">
                <button
                  onClick={() => {
                    setShowCommissionModal(true);
                    setCommissionForm({
                      agent_id: "",
                      pay_date: new Date().toISOString().split("T")[0],
                      commissionCalculationFromDate: "",
                      commissionCalculationToDate: "",
                      amount: "",
                      pay_type: "cash",
                      transaction_id: "",
                      note: "",
                      admin_type: adminId,
                      pay_for: paymentFor
                    });
                    setErrors({});
                  }}
                  className="bg-blue-900 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-200 flex items-center"
                >
                  <span className="mr-2">+</span> Commission / Incentive Payment
                </button>
              </Tooltip>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">
                Commission / Incentive Payments
              </h2>

              {commissionPayments.length > 0 ? (
                <DataTable
                  data={commissionPayments}
                  columns={commissionColumns}
                  exportedPdfName="PayOut Commission"
                  exportedFileName={`Commission Payments.csv`}
                />
              ) : (
                <div className="mt-10 text-center text-gray-500">
                  <CircularLoader
                    isLoading={isLoading}
                    data="Commission Payments"
                    failure={commissionPayments.length === 0}
                  />
                </div>
              )}
            </div>
          </div>

          <Modal
            isVisible={showCommissionModal}
            onClose={() => {
              setShowCommissionModal(false);
              resetCommissionForm();
            }}

            width="max-w-md"
          >
            <div className="py-6 px-5 lg:px-8 text-left">
              <h3 className="mb-4 text-xl font-bold text-gray-900 border-b pb-2">
                Add Commission / Incentive Payment
              </h3>

              <form className="space-y-4" onSubmit={handleCommissionSubmit}>

                <div className="w-full mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Select Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={agentType}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setAgentType(selected);
                      setSelectedUserList(selected === "agent" ? agents : employees);
                      setCommissionForm((prev) => ({ ...prev, agent_id: "", amount: "" }));
                      setAlreadyPaid("0.00");
                      setRemainingPayable("0.00");
                    }}
                  >
                    <option value="" disabled>
                      -- Select Type --
                    </option>
                    <option value="agent">Agent</option>
                    <option value="employee">Employee</option>
                  </select>


                </div>

                {/* Step 2: Show list of Agents/Employees based on selection */}
                {agentType && (
                  <div className="w-full mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Select {agentType === "agent" ? "Agent" : "Employee"} <span className="text-red-500">*</span>
                    </label>
                    <Select
                      className="w-full h-12"
                      placeholder={`Select ${agentType}`}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        String(option?.children)?.toLowerCase().includes(input.toLowerCase())
                      }
                      value={commissionForm.agent_id || undefined}
                      onChange={(value) => {
                        setErrors(prev => ({ ...prev, agent_id: "" }));
                        setCommissionForm(prev => ({
                          ...prev,
                          agent_id: value,
                        }));
                        calculateTotalPayableCommission(
                          value,
                          commissionForm.commissionCalculationFromDate,
                          commissionForm.commissionCalculationToDate
                        );
                      }}
                    >
                      {(agentType === "agent" ? agents : employees).map((person) => (
                        <Select.Option key={person._id} value={person._id}>
                          {person.name} | {person.phone_number}
                        </Select.Option>
                      ))}
                    </Select>
                    {errors.agent_id && (
                      <p className="text-red-500 text-xs mt-1">{errors.agent_id}</p>
                    )}
                  </div>
                )}


                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-1/2">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      From Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="commissionCalculationFromDate"
                      value={commissionForm.commissionCalculationFromDate}
                      onChange={handleCommissionChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    {errors.commissionCalculationFromDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.commissionCalculationFromDate}
                      </p>
                    )}
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      To Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="commissionCalculationToDate"
                      value={commissionForm.commissionCalculationToDate}
                      onChange={handleCommissionChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    {errors.commissionCalculationToDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.commissionCalculationToDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => calculateTotalPayableCommission(
                      commissionForm.agent_id,
                      commissionForm.commissionCalculationFromDate,
                      commissionForm.commissionCalculationToDate
                    )}
                    disabled={!commissionForm.agent_id || !commissionForm.commissionCalculationFromDate || !commissionForm.commissionCalculationToDate || isLoadingCommissionCalculation}
                    className="px-2 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition duration-200"
                  >
                    {isLoadingCommissionCalculation ? "Calculating..." : "Calculate Amount"}
                  </button>
                </div>

                { agentType === "employee" && (
                 
<div className="grid grid-cols-2 gap-4 mt-6 p-3 rounded-lg bg-blue-50">
  <div>
    <label className="block text-sm font-medium">Target</label>
    <input
      value={targetData.target}
      readOnly
      className="w-full border rounded px-3 py-2 bg-white font-semibold"
    />
  </div>
  <div>
    <label className="block text-sm font-medium">Achieved</label>
    <input
      value={targetData.achieved}
      readOnly
      className="w-full border rounded px-3 py-2 bg-white font-semibold"
    />
  </div>
  <div>
    <label className="block text-sm font-medium">Difference</label>
    <input
      value={targetData.difference}
      readOnly
      className="w-full border rounded px-3 py-2 bg-white font-semibold"
    />
  </div>
  <div>
    <label className="block text-sm font-medium">Remaining</label>
    <input
      value={targetData.remaining}
      readOnly
      className="w-full border rounded px-3 py-2 bg-white font-semibold"
    />
  </div>
  <div className="col-span-2">
    <label className="block text-sm font-medium">Incentive</label>
    <input
      value={`${targetData.incentiveAmount} `}
      readOnly
      className="w-full border rounded px-3 py-2 bg-white font-semibold"
    />
  </div>
</div>

                )}



                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    name="pay_date"
                    value={commissionForm.pay_date}
                    onChange={handleCommissionChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    disabled={!modifyPayment}
                  />
                  {errors.pay_date && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.pay_date}
                    </p>
                  )}
                </div>

                {/* Auto-populated calculated amount (readonly) */}
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Total Payable  (₹)
                  </label>
                  <input
                    type="text"
                    value={calculatedAmount}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 font-semibold"
                  />
                </div>

                {/* User-entered actual payout amount */}
                <div className="w-full mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Enter  Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    min={1}
                    value={commissionForm.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCommissionForm((prev) => ({
                        ...prev,
                        amount: value,
                      }));
                      setErrors((prev) => ({ ...prev, amount: "" }));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter how much to pay"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                  )}
                </div>


                {/* {commissionBreakdown.length > 0 && (
                  <div className="mt-6 bg-gray-100 p-3 rounded-lg shadow-inner border border-gray-300">
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                      Commission Breakdown (Customer-wise + Incentive)
                    </h4>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      <table className="min-w-full text-sm border">
                        <thead>
                          <tr className="bg-blue-100 text-gray-700">
                            <th className="border px-3 py-2 text-left">Customer</th>
                            <th className="border px-3 py-2 text-left">Phone</th>
                            <th className="border px-3 py-2 text-left">Group</th>
                            <th className="border px-3 py-2 text-right">Commission (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commissionBreakdown.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border px-3 py-2">{item.user_name || "-"}</td>
                              <td className="border px-3 py-2">{item.phone_number || "-"}</td>
                              <td className="border px-3 py-2">{item.group_name || "-"}</td>
                              <td className="border px-3 py-2 text-right">
                                {item.actual_commission_digits || "₹0"}
                              </td>
                            </tr>
                          ))}

                        
                          <tr className="bg-green-100 font-semibold">
                            <td className="border px-3 py-2" colSpan={3}>
                              Incentive (Bonus)
                            </td>
                            <td className="border px-3 py-2 text-right text-green-800">
                              ₹{parseFloat(incentiveAmount).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )} */}

                {agentType === "agent" && commissionBreakdown.length > 0 && (
                  <div className="mt-6 bg-gray-100 p-3 rounded-lg shadow-inner border border-gray-300">
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                      Commission Breakdown (Customer-wise   )
                    </h4>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      <table className="min-w-full text-sm border">
                        <thead>
                          <tr className="bg-blue-100 text-gray-700">
                            <th className="border px-3 py-2 text-left">Customer</th>
                            <th className="border px-3 py-2 text-left">Phone</th>
                            <th className="border px-3 py-2 text-left">Group</th>
                            <th className="border px-3 py-2 text-right">Commission (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commissionBreakdown.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border px-3 py-2">{item.user_name || "-"}</td>
                              <td className="border px-3 py-2">{item.phone_number || "-"}</td>
                              <td className="border px-3 py-2">{item.group_name || "-"}</td>
                              <td className="border px-3 py-2 text-right">
                                {item.actual_commission_digits || "₹0"}
                              </td>
                            </tr>
                          ))}

                         
                          {/* <tr className="bg-green-100 font-semibold">
                            <td className="border px-3 py-2" colSpan={3}>
                              Incentive (Bonus)
                            </td>
                            <td className="border px-3 py-2 text-right text-green-800">
                              ₹{parseFloat(incentiveAmount).toLocaleString("en-IN")}
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}


                {/* Payment Mode */}
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Payment Mode
                  </label>
                  <select
                    name="pay_type"
                    value={commissionForm.pay_type}
                    onChange={handleCommissionChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    {modifyPayment && (
                      <>
                        <option value="cheque">Cheque</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </>
                    )}
                  </select>
                  {errors.pay_type && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.pay_type}
                    </p>
                  )}
                </div>

                {/* Transaction ID (conditionally shown) */}
                {commissionForm.pay_type === "online" && (
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Transaction ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="transaction_id"
                      value={commissionForm.transaction_id}
                      onChange={handleCommissionChange}
                      placeholder="Enter transaction ID"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    {errors.transaction_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.transaction_id}
                      </p>
                    )}
                  </div>
                )}

                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Note
                  </label>
                  <textarea
                    name="note"
                    value={commissionForm.note}
                    onChange={handleCommissionChange}
                    placeholder="Additional details"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="2"
                  />
                  {errors.note && (
                    <p className="text-red-500 text-xs mt-1">{errors.note}</p>
                  )}
                </div>

                {/* Disbursed By */}
                <div className="w-full bg-blue-50 p-3 rounded-lg">
                  <label className="block mb-1 text-sm font-medium text-gray-900">
                    Disbursed By
                  </label>
                  <div className="font-semibold">{adminName}</div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCommissionModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || isLoadingCommissionCalculation}
                    className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : "Save Payment"}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div >
    </>
  );
};

export default PayOutCommission;