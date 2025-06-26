// (imports)
import { useEffect, useState } from "react";
import Navbar from "../components/layouts/Navbar";
import SettingSidebar from "../components/layouts/SettingSidebar";
import api from "../instance/TokenInstance";
import Modal from "../components/modals/Modal";
import DataTable from "../components/layouts/Datatable";
import { Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";

const today = new Date();
const todayStr = new Date().toISOString().split("T")[0];
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  .toISOString()
  .split("T")[0];
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  .toISOString()
  .split("T")[0];

function generateVirtualTargets(original, type, fromDate, toDate) {
  if (!type || type === "designation") return original;

  const extended = [...original];
  const from = new Date(fromDate);
  const to = new Date(toDate);

  const ids = [...new Set(original.map((t) => t.agentId?._id || t.agentId))];

  for (const id of ids) {
    const personalTargets = original.filter(
      (t) => t.agentId === id || t.agentId?._id === id
    );

    const latest = personalTargets
      .filter((t) => new Date(t.startDate) < from)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];

    if (!latest) continue;

    const existingMonths = new Set(
      personalTargets.map((t) => {
        const d = new Date(t.startDate);
        return `${d.getFullYear()}-${d.getMonth()}`;
      })
    );

    const loop = new Date(from);
    while (loop <= to) {
      const key = `${loop.getFullYear()}-${loop.getMonth()}`;
      if (!existingMonths.has(key)) {
        const virtual = {
          ...latest,
          startDate: new Date(
            loop.getFullYear(),
            loop.getMonth(),
            1
          ).toISOString(),
          endDate: new Date(
            loop.getFullYear(),
            loop.getMonth() + 1,
            0
          ).toISOString(),
          isVirtual: true,
        };
        extended.push(virtual);
      }
      loop.setMonth(loop.getMonth() + 1);
    }
  }

  return extended;
}

const Target = () => {
  const [selectedType, setSelectedType] = useState("agents");
  const [type, setType] = useState("");
  const [selectedId, setSelectedId] = useState("all");
  const [agents, setAgents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [targets, setTargets] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [virtualTargets, setVirtualTargets] = useState([]);

  const [formData, setFormData] = useState({
    agentId: "",
    designationId: "",
    startDate: "",
    endDate: "",
    totalTarget: "",
    incentive: 0,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTargetId, setEditTargetId] = useState(null);
  const [fromDate, setFromDate] = useState(firstDay);
  const [toDate, setToDate] = useState(lastDay);
  const [tableData, setTableData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "",
    type: "",
  });
  const [reload, setReload] = useState(0);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const [agentRes, designationRes] = await Promise.all([
        api.get("/agent/get-agent"),
        api.get("/target/get-designation"),
      ]);

      const all = agentRes.data || [];
      setAgents(
        all.filter((a) => a.agent_type === "agent" || a.agent_type === "both")
      );
      setEmployees(
        all.filter(
          (a) => a.agent_type === "employee" || a.agent_type === "both"
        )
      );
      setDesignations(designationRes.data || []);
    };

    fetchData();
  }, [reload]);

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await api.get("/target/get-targets", {
          params: {
            fromDate,
            toDate,
            ...(selectedId !== "all" &&
              type === "agent" && { agentId: selectedId }),
            ...(selectedId !== "all" &&
              type === "employee" && { agentId: selectedId }),
            ...(selectedId !== "all" &&
              type === "designation" && { designationId: selectedId }),
          },
        });

        const originalTargets = res.data || [];

        if (type && (type === "agent" || type === "employee")) {
          const from = new Date(fromDate);
          const to = new Date(toDate);
          const extendedTargets = [...originalTargets];

          const personMap = {};
          const list = type === "agent" ? agents : employees;

          for (const person of list) {
            const personId = person._id;
            const personalTargets = originalTargets.filter(
              (t) => t.agentId === personId || t.agentId?._id === personId
            );

            // Find latest target before fromDate
            const latest = personalTargets
              .filter((t) => new Date(t.startDate) < from)
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];

            if (!latest) continue;

            const monthSet = new Set(
              personalTargets.map((t) => {
                const d = new Date(t.startDate);
                return `${d.getFullYear()}-${d.getMonth()}`;
              })
            );

            const loop = new Date(from);
            while (loop <= to) {
              const key = `${loop.getFullYear()}-${loop.getMonth()}`;
              if (!monthSet.has(key)) {
                const newTarget = {
                  ...latest,
                  startDate: new Date(
                    loop.getFullYear(),
                    loop.getMonth(),
                    1
                  ).toISOString(),
                  endDate: new Date(
                    loop.getFullYear(),
                    loop.getMonth() + 1,
                    0
                  ).toISOString(),
                  isVirtual: true,
                };
                extendedTargets.push(newTarget);
              }
              loop.setMonth(loop.getMonth() + 1);
            }
          }

          setTargets(extendedTargets);
          setVirtualTargets(extendedTargets);
        } else {
          setTargets(originalTargets);
          setVirtualTargets(originalTargets);
        }
      } catch (err) {
        console.error("Error fetching targets:", err);
      }
    };

    if (fromDate && toDate && type) {
      fetchTargets();
    }
  }, [fromDate, toDate, type, selectedId, reload]);

  useEffect(() => {
    const sourceList =
      type === "agent"
        ? agents
        : type === "employee"
        ? employees
        : designations;

    const buildRows = async () => {
      const rows = await Promise.all(
        sourceList
          .filter((p) => selectedId === "all" || p._id === selectedId)
          .map(async (person) => {
            const relatedTargets = virtualTargets.filter(
              (t) =>
                (t.agentId?._id || t.agentId) === person._id ||
                (t.designationId?._id || t.designationId) === person._id
            );

            if (relatedTargets.length === 0) {
              let designation = person.title || "N/A";
              if (type !== "designation") {
                try {
                  const { data: empData } = await api.get(
                    `/agent/get-additional-employee-info-by-id/${person._id}`
                  );
                  designation =
                    empData?.employee?.designation_id?.title || designation;
                } catch (err) {
                  console.error(
                    "Error fetching designation for placeholder row:",
                    err
                  );
                }
              }
              return [
                {
                  name: person.name || person.title,
                  phone: person.phone_number || "-",
                  designation,
                  target: "-",
                  achieved: "-",
                  remaining: "-",
                  difference: "-",
                  incentive_percent: "-",
                  incentive_amount: "-",
                 action: (
  <Dropdown
    trigger={["click"]}
    menu={{
      items: [{ key: "set", label: "Set Target" }],
      onClick: ({ key }) => {
        if (key === "set") openSetModal(person, type);
      },
    }}
  >
    <IoMdMore className="cursor-pointer" />
  </Dropdown>
),

                },
              ];
            }

            const row = await formatRow(person, relatedTargets, type);
            return [row];
          })
      );
      setTableData(rows.flat());
    };

    if (type && selectedId) buildRows();
  }, [type, selectedId, targets, fromDate, toDate]);

const formatRow = async (person, targets, currentType) => {
  let designation = "N/A";
  let achieved = 0;

  const allTargets = targets.filter(
    (t) =>
      (t.agentId?._id || t.agentId) === person._id ||
      (t.designationId?._id || t.designationId) === person._id
  );

  const monthMap = {};
  allTargets.forEach((t) => {
    const date = new Date(t.startDate);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthMap[key]) monthMap[key] = t.totalTarget || 0;
  });

  const defaultTarget =
    Object.values(monthMap).length > 0 ? Object.values(monthMap)[0] : 0;

  let total = 0;
  let loop = new Date(fromDate);
  const end = new Date(toDate);

  while (loop <= end) {
    const key = `${loop.getFullYear()}-${loop.getMonth()}`;
    const value = monthMap[key] ?? defaultTarget;
    total += value;
    loop.setMonth(loop.getMonth() + 1);
  }

  try {
    const { data: commData } = await api.get(
      `/enroll/get-detailed-commission/${person._id}`,
      {
        params: {
          from_date: fromDate,
          to_date: toDate,
        },
      }
    );
    achieved = commData?.summary?.actual_business || 0;
    if (typeof achieved === "string") {
      achieved = Number(achieved.replace(/[^0-9.-]+/g, ""));
    }
  } catch (err) {
    console.error("Error fetching actual business (achieved):", err);
  }

  designation = person.designationTitle || person.title || "N/A";

  let isFallback = false;
  if ((currentType === "agent" || currentType === "employee") && person._id) {
    try {
      const { data: empData } = await api.get(
        `/agent/get-additional-employee-info-by-id/${person._id}`
      );
      const fetchedTitle = empData?.employee?.designation_id?.title;
      if (fetchedTitle) {
        designation = fetchedTitle;
        const allDirect = allTargets.filter(
          (t) => (t.agentId?._id || t.agentId) === person._id
        );
        if (allDirect.length === 0) {
          isFallback = true;
        }
      }
    } catch (err) {
      console.error("Error fetching designation for row:", err);
    }
  }

  if (isFallback) {
    designation += " (default)";
  }

  const difference = total - achieved;
  const remaining = difference > 0 ? difference : 0;
  let incentiveAmount = 0;
  let incentivePercent = "0%";
  const title = designation.toLowerCase();

  if (title === "business agent" && achieved >= total) {
    incentiveAmount = achieved * 0.005;
    incentivePercent = "0.5%";
  } else if (difference < 0) {
    incentiveAmount = Math.abs(difference) * 0.01;
    incentivePercent = "1%";
  }

const dropdownItems = [];

const hasRealTarget = targets.find(
  (t) =>
    ((t.agentId?._id || t.agentId) === person._id ||
      (t.designationId?._id || t.designationId) === person._id) &&
    t._id && !t.isVirtual
);

if (hasRealTarget) {
  dropdownItems.push({ key: "update", label: "Update Target" });
  dropdownItems.push({ key: "delete", label: "Delete Target" });
} else {
  dropdownItems.push({ key: "set", label: "Set Target" });
}


const actionDropdown = (
  <Dropdown
    trigger={["click"]}
    menu={{
      items: dropdownItems,
      onClick: ({ key }) => {
        if (key === "set") openSetModal(person, currentType);
        if (key === "update" && hasRealTarget) openEditModal(hasRealTarget);
        if (key === "delete" && hasRealTarget) handleDeleteTarget(hasRealTarget._id);
      },
    }}
  >
    <IoMdMore className="cursor-pointer" />
  </Dropdown>
);


  return {
    name: person.name || person.title,
    phone: person.phone_number || "-",
    designation,
    target: total,
    achieved,
    remaining,
    difference,
    incentive_percent: incentivePercent,
    incentive_amount: `₹${incentiveAmount.toFixed(2)}`,
    action: actionDropdown,
  };
};



const openSetModal = (person, selectedType) => {
  const isDesig = selectedType === "designation";
  setFormData({
    agentId: isDesig ? "" : person._id,
    designationId: isDesig ? person._id : "",
    startDate: firstDay,
    endDate: lastDay,
    totalTarget: "",
    incentive: 0,
  });
  setSelectedName(person.name || person.title || "");
  setModalVisible(true);
};



  const openEditModal = (target) => {
    setFormData({
      agentId: target.agentId?._id || "",
      designationId: target.designationId?._id || "",
      startDate: target.startDate?.split("T")[0] || "",
      endDate: target.endDate?.split("T")[0] || "",
      totalTarget: target.totalTarget,
      incentive: target.incentive || 0,
    });
    setEditTargetId(target._id);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const handleDeleteTarget = async (id) => {
    try {
      await api.delete(`/target/delete-target/${id}`);
      setAlertConfig({
        visibility: true,
        message: "Target deleted",
        type: "success",
      });
      setReload((prev) => prev + 1);
    } catch (err) {
      console.error("Delete failed", err);
      setAlertConfig({
        visibility: true,
        message: "Delete failed",
        type: "error",
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    if (name === "totalTarget") {
      const val = parseInt(value);
      if (val > 2000000 && val <= 5000000) updated.incentive = 1;
      else if (val > 5000000 && val <= 10000000) updated.incentive = 2;
      else if (val > 10000000 && val <= 20000000) updated.incentive = 3;
      else if (val > 20000000) updated.incentive = 4;
      else updated.incentive = 0;
    }
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/target/update-target/${editTargetId}`, formData);
        setAlertConfig({
          visibility: true,
          message: "Target updated successfully",
          type: "success",
        });
      } else {
        await api.post("/target/add-target", formData);
        setAlertConfig({
          visibility: true,
          message: "Target added",
          type: "success",
        });
      }
      setModalVisible(false);
      setIsEditMode(false);
      setEditTargetId(null);
      setReload((prev) => prev + 1);
    } catch (err) {
      console.error("Submit failed", err);
      setAlertConfig({
        visibility: true,
        message: isEditMode ? "Update failed" : "Add failed",
        type: "error",
      });
    }
  };

  const getColumns = () => {
    const baseColumns = [
      { key: "name", header: "Name" },

      { key: "target", header: "Target" },
      { key: "action", header: "Action" },
    ];

    const fullColumns = [
      { key: "name", header: "Name" },
      { key: "phone", header: "Phone Number" },
      { key: "designation", header: "Designation" },
      { key: "target", header: "Target" },
      { key: "achieved", header: "Achieved" },
      { key: "remaining", header: "Remaining" },
      { key: "difference", header: "Difference (Target - Achieved)" },
      { key: "incentive_percent", header: "Incentive (%)" },
      { key: "incentive_amount", header: "Incentive (₹)" },
      { key: "action", header: "Action" },
    ];

    if (type === "designation") {
      return baseColumns;
    }

    return fullColumns;
  };

  return (
    <>
      <div className="flex mt-20">
        <Navbar visibility={true} />
        <SettingSidebar />
        <CustomAlertDialog
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
          onClose={() => setAlertConfig({ ...alertConfig, visibility: false })}
        />
        <div className="flex-grow p-6">
          <h1 className="text-2xl font-semibold mb-4">Target Report</h1>
          <div className="flex gap-2 flex-wrap mb-6">
            <select
              className="lp-2 border rounded"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setSelectedId("all");
              }}
            >
              <option value="">Select Type</option>
              <option value="agent">Agent</option>
              <option value="employee">Employee</option>
              <option value="designation">Designation</option>
            </select>
            {type && (
              <select
                className="p-2 border rounded"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="all">All</option>
                {(type === "agent"
                  ? agents
                  : type === "employee"
                  ? employees
                  : designations
                ).map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name || p.title}
                  </option>
                ))}
              </select>
            )}
            <input
              type="date"
              className="p-2 border rounded"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className="p-2 border rounded"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <DataTable
            data={tableData}
            columns={getColumns()}
            exportedFileName="Target-Report.csv"
          />
        </div>
      </div>

      <Modal
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setIsEditMode(false);
          setEditTargetId(null);
        }}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {isEditMode ? "Update Target" : "Set Target"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedName && (
              <>
                <label className="block font-medium">Target For</label>
                <input
                  type="text"
                  value={selectedName}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </>
            )}
            <label className="block font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleFormChange}
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
            <label className="block font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleFormChange}
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
            <label className="block font-medium">Total Target</label>
            <input
              type="number"
              name="totalTarget"
              value={formData.totalTarget}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
              required
            />
            {/* <label className="block font-medium">Incentive (%)</label>
            <input
              type="number"
              name="incentive"
              value={formData.incentive}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            /> */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              {isEditMode ? "Update Target" : "Save Target"}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Target;
