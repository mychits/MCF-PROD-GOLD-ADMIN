import { Button, Select, Tooltip, Input } from "antd";
import Sidebar from "../components/layouts/Sidebar";
import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";
import Navbar from "../components/layouts/Navbar";
import Modal from "../components/modals/Modal";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import filterOption from "../helpers/filterOption";

const SoftTransferCustomer = () => {
  const [groups, setGroups] = useState([]);
  const [deletedEnrollments, setDeletedEnrollments] = useState([]);
  const [activeEnrollments, setActiveEnrollments] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [isDataTableLoading, setIsDataTableLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [enrolledCustomer, setEnrolledCustomer] = useState("");
  const [enrolledTicket, setEnrolledTicket] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferGroup, setTransferGroup] = useState("");
  const [transferToUser, setTransferToUser] = useState("");
  const [transferToTicket, setTransferToTicket] = useState("");

const fetchTransfers = async () => {
  try {
    setIsDataTableLoading(true);
    const res = await api.get("/enroll/transfer/get-all");

    const formattedData = (res.data || []).map((transfer, index) => {
      const fromGroupName = getGroupNameById(transfer?.fromGroup?._id || transfer?.fromGroup);
      const toGroupName = getGroupNameById(transfer?.toGroup?._id || transfer?.toGroup);
      const fromUser = transfer?.fromUser || {};
      const toUser = transfer?.toUser || {};

      return {
        _id: transfer._id,
        id: index + 1,
        transfer_id: `TRAN-${index + 1}`,
        from_group: fromGroupName,
        to_group: toGroupName,
        from_customer: fromUser.full_name || "-",
        from_phone: fromUser.phone_number || "-",
        from_ticket: transfer?.fromTicket || "-",
        to_customer: toUser.full_name || "-",
        to_phone: toUser.phone_number || "-",
        to_ticket: transfer?.toTicket || "-",
        transfer_amount: transfer?.transferAmount ?? 0,
        amount_paid: transfer?.amountPaid ?? 0,
        transfer_type: transfer?.transferType || "-",
        date: transfer?.createdAt?.split("T")[0] || "-",
  
      };
    });

    setTransferData(formattedData);
  } catch (err) {
    console.error("Failed to fetch transfers", err);
  } finally {
    setIsDataTableLoading(false);
  }
};


  const handleAddTransferClick = async () => {
    try {
      const [deletedRes, activeRes] = await Promise.all([
        api.get("/enroll/get-deleted-enrollments"),
        api.get("/enroll/get-active-enrollments"),
      ]);
      setDeletedEnrollments(deletedRes.data);
      setActiveEnrollments(activeRes.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error loading enrollments", err);
      alert("Could not load enrollment data.");
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await api.get("/group/get-group-admin");
      setGroups(res.data);
    } catch (error) {
      console.error("Unable to fetch group data", error);
    }
  };

  useEffect(() => {
    fetchTransfers();
    fetchGroups();
  }, []);

  const handleChange = (key, value) => {
    switch (key) {
      case "group_id":
        setSelectedGroup(value);
        break;
      case "enroll_customer":
        const [userId, ticket] = value.split("|");
        setEnrolledCustomer(userId);
        setEnrolledTicket(ticket);
        setAmountPaid(0);
        break;
      case "transfer_group":
        setTransferGroup(value);
        break;
      case "transfer_user":
        const [toUserId, toTicket] = value.split("|");
        setTransferToUser(toUserId);
        setTransferToTicket(toTicket);
        break;
      case "transfer_amount":
        if (value === "") {
          setTransferAmount("");
        } else if (/^\d*\.?\d*$/.test(value)) {
          setTransferAmount(value);
        }
        break;
      default:
        break;
    }
  };

  const fetchAmountPaid = async () => {
    if (!selectedGroup || !enrolledCustomer || !enrolledTicket) {
      alert("Please select Group, Enrolled Customer, and Ticket first.");
      return;
    }
    try {
      const res = await api.get("/enroll/get-amount-paid", {
        params: {
          group_id: selectedGroup,
          user_id: enrolledCustomer,
          ticket: enrolledTicket,
        },
      });
      setAmountPaid(res.data.amountPaid || 0);
    } catch (error) {
      console.error("Failed to fetch amount paid", error);
    }
  };

const handleTransfer = async () => {
  if (
    !selectedGroup ||
    !enrolledCustomer ||
    !enrolledTicket ||
    !transferGroup ||
    !transferToUser ||
    !transferToTicket ||
    !transferAmount ||
    parseFloat(transferAmount) <= 0
  ) {
    alert("Please fill all fields and enter a valid transfer amount.");
    return;
  }

  if (parseFloat(transferAmount) > amountPaid) {
    alert("Transfer amount cannot exceed amount paid.");
    return;
  }

  try {
    const payload = {
      fromGroup: selectedGroup,
      fromUserId: enrolledCustomer,
      fromTicket: Number(enrolledTicket),
      amountPaid,
      transferAmount: parseFloat(transferAmount),
      toGroup: transferGroup,
      toUser: transferToUser,
      toTicket: Number(transferToTicket),
      transferType: "soft",
    };

    const res = await api.post("/enroll/transfer-customer", payload);

    if (res.status === 200 || res.status === 201) {
      const transfer = res.data;

      const fromEnrollment = deletedEnrollments.find(
        (e) => e.user_id?._id === enrolledCustomer
      );

      const toEnrollment = activeEnrollments.find(
        (e) => e.user_id?._id === transferToUser
      );

      const formatted = {
        _id: transfer._id,
        id: transferData.length + 1,
        transfer_id: `Tran${transferData.length + 1}`,
        from_group_id: selectedGroup,
        from_group_name: getGroupNameById(selectedGroup),
        from_user_id: enrolledCustomer,
        from_customer: fromEnrollment?.user_id?.full_name || "-",
        from_phone: fromEnrollment?.user_id?.phone_number || "-",
        from_ticket: enrolledTicket,

        to_group_id: transferGroup,
        to_group_name: getGroupNameById(transferGroup),
        to_user_id: transferToUser,
        to_customer: toEnrollment?.user_id?.full_name || "-",
        to_phone: toEnrollment?.user_id?.phone_number || "-",
        to_ticket: transferToTicket,

        transfer_amount: parseFloat(transferAmount),
        amount_paid: amountPaid,
        transfer_type: "soft",
        date: new Date().toISOString().split("T")[0],

        
      };

      setTransferData((prev) => [...prev, formatted]);
      alert("Transfer successful!");
      resetForm();
      setShowModal(false);
    } else {
      alert("Transfer failed.");
    }
  } catch (error) {
    console.error("Transfer error:", error);
    alert("Transfer failed.");
  }
};



  const resetForm = () => {
    setSelectedGroup("");
    setEnrolledCustomer("");
    setEnrolledTicket("");
    setTransferGroup("");
    setTransferToUser("");
    setTransferToTicket("");
    setTransferAmount("");
    setAmountPaid(0);
  };


const getGroupNameById = (groupId) => {
  const group = groups.find((g) => g._id === groupId);
  return group ? group.group_name : "-";
};


const columns = [
  { key: "id", header: "sl-no", render: (row) => row.id },
 { key: "transfer_id", header: "Transfer ID", render: (row) => row.transfer_id },

  { key: "from_group", header: "From Group", render: (row) => row.from_group },
  {
    key: "from_customer",
    header: "From Customer",
    render: (row) => `${row.from_customer} (${row.from_phone})`,
  },
  { key: "from_ticket", header: "From Ticket", render: (row) => row.from_ticket },
  { key: "to_group", header: "To Group", render: (row) => row.to_group },
  {
    key: "to_customer",
    header: "To Customer",
    render: (row) => `${row.to_customer} (${row.to_phone})`,
  },
  { key: "to_ticket", header: "To Ticket", render: (row) => row.to_ticket },
  { key: "transfer_amount", header: "Transfer Amount", render: (row) => row.transfer_amount },
  { key: "amount_paid", header: "Amount Paid", render: (row) => row.amount_paid },
  { key: "transfer_type", header: "Transfer Type", render: (row) => row.transfer_type },
  { key: "date", header: "Transfer Date", render: (row) => row.date },

];





  return (
    <>
      <div className="flex mt-20">
        <Navbar
          onGlobalSearchChangeHandler={(e) => setSearchText(e.target.value)}
          visibility={true}
        />
        <Sidebar />
        <div className="flex-grow p-7">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Customer Transfers</h1>
            <button
              onClick={handleAddTransferClick}
              className="bg-blue-950 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
            >
              + Add Transfer
            </button>
          </div>

          {transferData?.length > 0 ? (
            <DataTable
              data={filterOption(transferData, searchText)}
              columns={columns}
            />
          ) : (
            <CircularLoader
              isLoading={isDataTableLoading}
              failure={transferData?.length <= 0}
              data="Transfers"
            />
          )}
        </div>
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className="py-6 px-5 lg:px-8 text-left space-y-4">
          <h3 className="text-xl font-bold mb-4">Add Transfer</h3>

          <label>Group</label>
          <Select
            className="w-full h-12"
            placeholder="Select Group"
            onChange={(value) => handleChange("group_id", value)}
            value={selectedGroup || undefined}
            showSearch
          >
            {[...new Map(deletedEnrollments
              .filter((e) => e.group_id?._id)
              .map((e) => [e.group_id._id, e.group_id])).values()]
              .map((group) => (
                <Select.Option key={group._id} value={group._id}>
                  {group.group_name}
                </Select.Option>
              ))}
          </Select>

          <label>Enrolled Customer</label>
          <Select
            className="w-full h-12"
            placeholder="Select Enrolled Customer"
            onChange={(value) => handleChange("enroll_customer", value)}
            value={enrolledCustomer && enrolledTicket ? `${enrolledCustomer}|${enrolledTicket}` : undefined}
            showSearch
          >
            {deletedEnrollments
              .filter((e) => e.group_id?._id === selectedGroup)
              .map((e) => (
                <Select.Option
                  key={e._id}
                  value={`${e.user_id._id}|${e.tickets}`}
                >
                  {`${e.user_id.full_name} | ${e.user_id.phone_number} | Ticket: ${e.tickets}`}
                </Select.Option>
              ))}
          </Select>

          <Button onClick={fetchAmountPaid} className="w-full h-12 bg-blue-900 text-white">
            Check Total Amount
          </Button>

          <Input disabled className="w-full h-12" placeholder="Amount Paid" value={amountPaid} />

          <Input
            className="w-full h-12"
            placeholder="Transfer Amount"
            value={transferAmount}
            onChange={(e) => handleChange("transfer_amount", e.target.value)}
          />

          <label>Transfer Group</label>
          <Select
            className="w-full h-12"
            placeholder="Select Transfer Group"
            onChange={(value) => handleChange("transfer_group", value)}
            value={transferGroup || undefined}
            showSearch
          >
            {[...new Map(activeEnrollments
              .filter((e) => e.group_id?._id)
              .map((e) => [e.group_id._id, e.group_id])).values()]
              .map((group) => (
                <Select.Option key={group._id} value={group._id}>
                  {group.group_name}
                </Select.Option>
              ))}
          </Select>

          <label>Transfer To Customer</label>
          <Select
            className="w-full h-12"
            placeholder="Select Customer"
            onChange={(value) => handleChange("transfer_user", value)}
            value={transferToUser && transferToTicket ? `${transferToUser}|${transferToTicket}` : undefined}
            showSearch
          >
            {[...new Map(activeEnrollments .filter(e => e.user_id && e.user_id._id).map((e) => [`${e.user_id._id}|${e.tickets}`, e])).values()]
              .map((e) => (
                <Select.Option
                  key={`${e.user_id._id}|${e.tickets}`}
                  value={`${e.user_id._id}|${e.tickets}`}
                >
                  {`${e.user_id.full_name} | ${e.user_id.phone_number} | Ticket: ${e.tickets}`}
                </Select.Option>
              ))}
          </Select>

          <Button onClick={handleTransfer} className="w-full h-12 bg-green-700 text-white">
            Submit Transfer
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default SoftTransferCustomer;
