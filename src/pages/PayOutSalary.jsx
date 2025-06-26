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
import { useParams } from "react-router-dom";
// daily customer automated message
const PayOutSalary = () => {
  const paymentFor = "salary";
  const [api, contextHolder] = notification.useNotification();
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [modifyPayment, setModifyPayment] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    noReload: false,
    type: "info",
  });
  const [agents, setAgents] = useState([]);
  const [salaryPayments, setSalaryPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [errors, setErrors] = useState({});
  const [reRender, setReRender] = useState(0);
  const [salaryForm, setSalaryForm] = useState({
    agent_id: "",
    pay_date: new Date().toISOString().split("T")[0],
    amount: "",
    pay_type: "cash",
    transaction_id: "",
    note: "",
    pay_for: paymentFor,
    admin_type: "",
  });

  const fetchAgents = async () => {
    try {
      const response = await API.get("/agent/get-employee");
      if (response.data) {
        setAgents(response.data?.employee || []);
      } else {
        setAgents({});
      }
    } catch (error) {
      console.error("Failed to fetch Agents");
    }
  };

  // Fetch salary payments
  const fetchSalaryPayments = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/payment-out/get-salary-payments");
      const responseData = response.data.map((payment, index) => ({
        id: index + 1,
        _id: payment._id,
        agent_id: payment.agent_id,
        agent_name: payment.agent_id?.name,
        pay_date: payment.pay_date,
        amount: payment.amount,
        pay_type: payment.pay_type,
        transaction_id: payment.transaction_id,
        note: payment.note,
        pay_for: payment.pay_for,
        disbursed_by: payment.admin_type?.name,
        receipt_no: payment.receipt_no,
      }));
      setSalaryPayments(responseData);
    } catch (error) {
      console.error("Failed to fetch Salary payments", error);
      setSalaryPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userObj = JSON.parse(user);
    setAdminId(userObj._id);
    setAdminName(userObj.name || "");

    if (userObj?.admin_access_right_id?.access_permissions?.edit_payment) {
      setModifyPayment(
        userObj.admin_access_right_id.access_permissions.edit_payment === "true"
      );
    }
  }, []);
  useEffect(() => {
    fetchAgents();
    fetchSalaryPayments();
  }, [reRender]);
  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const validateForm = () => {
    const newErrors = {};

    if (!salaryForm.agent_id) {
      newErrors.agent_id = "Please select an agent";
    }

    if (!salaryForm.amount || isNaN(salaryForm.amount)) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (salaryForm.pay_type === "online" && !salaryForm.transaction_id) {
      newErrors.pay_type = "Transaction ID is required for online payments";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        setIsLoading(true);
        const payload = {
          ...salaryForm,
          admin_type: adminId,
        };

        await API.post("/payment-out/add-salary-payment", payload);
        api.open({
          message: "Salary Payout Successful",
          description: "The salary payment has been successfully processed.",
          className: "bg-green-500 rounded-lg font-semibold text-white",
          showProgress: true,
          pauseOnHover: false,
        });

        setShowSalaryModal(false);
        setSalaryForm({
          agent_id: "",
          pay_date: new Date().toISOString().split("T")[0],
          amount: "",
          pay_type: "cash",
          transaction_id: "",
          note: "",
          admin_type: adminId,
          pay_for: paymentFor,
        });
        setReRender((val) => val + 1);
        fetchSalaryPayments();
      } catch (error) {
        const message = error.message || "Something went wrong";
        api.open({
          message: "Salary Payout Failed",
          description:
            message ||
            "There was an error while processing the salary payout. Please try again.",
          showProgress: true,
          pauseOnHover: false,
          className: "bg-red-500 rounded-lg font-semibold text-white",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const salaryColumns = [
    { key: "id", header: "SL. NO" },
    {
      key: "pay_date",
      header: "Pay Date",
    },
    {
      header: "Agent",
      key: "agent_name",
    },
    {
      header: "Amount (₹)",
      key: "amount",
    },
    {
      header: "Payment Mode",
      key: "pay_type",
    },
    ,
    {
      header: "Receipt No",
      key: "receipt_no",
    },
    {
      header: "Note",
      key: "note",
    },
    ,
    {
      header: "Disbursed by",
      key: "disbursed_by",
    },
  ];

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
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">
                <span className="text-2xl text-red-500 font-bold">
                  {paymentFor?.toUpperCase()}
                </span>
                {"  "}
                Payments Out
              </h1>

              <Tooltip title="Add Salary Payment">
                <button
                  onClick={() => setShowSalaryModal(true)}
                  className="ml-4 bg-blue-900 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-200 flex items-center"
                >
                  <span className="mr-2">+</span> Salary Payment
                </button>
              </Tooltip>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">
                Salary Payments
              </h2>

              {salaryPayments.length > 0 ? (
                <DataTable
                  data={salaryPayments}
                  columns={salaryColumns}
                  exportedFileName={`salary_Payments_${
                    new Date().toISOString().split("T")[0]
                  }.csv`}
                />
              ) : (
                <div className="mt-10 text-center text-gray-500">
                  <CircularLoader
                    isLoading={isLoading}
                    data="Salary Payments"
                    failure={salaryPayments.length === 0}
                  />
                </div>
              )}
            </div>
          </div>

          <Modal
            isVisible={showSalaryModal}
            onClose={() => setShowSalaryModal(false)}
            width="max-w-md"
          >
            <div className="py-6 px-5 lg:px-8 text-left">
              <h3 className="mb-4 text-xl font-bold text-gray-900 border-b pb-2">
                Add Salary Payment
              </h3>

              <form className="space-y-4" onSubmit={handleSalarySubmit}>
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Agent <span className="text-red-500">*</span>
                  </label>
                  <Select
                    className="w-full h-12"
                    placeholder="Select Agent"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={salaryForm.agent_id || undefined}
                    onChange={(value) => {
                      setErrors((prev) => ({ ...prev, agent_id: "" }));
                      setSalaryForm((prev) => ({
                        ...prev,
                        agent_id: value,
                      }));
                    }}
                  >
                    {agents.map((agent) => (
                      <Select.Option key={agent._id} value={agent._id}>
                        {`${agent.name} | ${agent.phone_number}`}
                      </Select.Option>
                    ))}
                  </Select>
                  {errors.agent_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.agent_id}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    name="pay_date"
                    value={salaryForm.pay_date}
                    onChange={handleSalaryChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    disabled={!modifyPayment}
                  />
                  {errors.pay_date && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.pay_date}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={salaryForm.amount}
                    onChange={handleSalaryChange}
                    placeholder="Enter amount"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                  )}
                </div>

                {/* Payment Mode */}
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Payment Mode
                  </label>
                  <select
                    name="pay_type"
                    value={salaryForm.pay_type}
                    onChange={handleSalaryChange}
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
                {salaryForm.pay_type === "online" && (
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Transaction ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="transaction_id"
                      value={salaryForm.transaction_id}
                      onChange={handleSalaryChange}
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
                    value={salaryForm.note}
                    onChange={handleSalaryChange}
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
                    onClick={() => setShowSalaryModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : "Save Payment"}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default PayOutSalary;
