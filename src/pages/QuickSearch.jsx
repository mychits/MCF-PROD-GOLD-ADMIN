/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import Navbar from "../components/layouts/Navbar";
import CircularLoader from "../components/loaders/CircularLoader";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import { Input, Space, Table, Tag } from "antd";
import Fuse from "fuse.js";
import { Link, useNavigate } from "react-router-dom";
const QuickSearch = () => {
  const { Search } = Input;
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const searchInputRef = useRef();
  const [TableUsers, setTableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const filters = [
    { id: "1", filterName: "Customer Id", key: "customer_id" },
    { id: "2", filterName: "Name", key: "name" },
    { id: "3", filterName: "Phone Number", key: "phone_number" },
    { id: "4", filterName: "Address", key: "address" },
    { id: "5", filterName: "Pincode", key: "pincode" },
    { id: "6", filterName: "Area", key: "customer_area" },
    { id: "7", filterName: "Status", key: "customer_status" },
  ];

  const [activeFilters, setActiveFilters] = useState(filters.map((f) => f.id));

  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  const [searchText, setSearchText] = useState("");
  const fil = filters
  .filter((filter) => activeFilters.includes(filter.id))
  .map((filter) => filter.key);
  const fuseSearchOptions = {
    includeScore: true,

    keys:[...fil],
  };
  const fuse = new Fuse(TableUsers, fuseSearchOptions);

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  useEffect(() => {
    const fetchCollectionArea = async () => {
      try {
        const response = await api.get(
          "/collection-area-request/get-collection-area-data"
        );

        setAreas(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchCollectionArea();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/user/get-user");
        setUsers(response.data);
        const formattedData = response.data.map((group, index) => ({
          _id: group?._id,
          id: index + 1,
          name: group?.full_name,
          phone_number: group?.phone_number,
          address: group?.address,
          pincode: group?.pincode,
          customer_id: group?.customer_id,
          collection_area: group?.collection_area?.route_name,
          customer_status: group?.customer_status
            ? group?.customer_status
            : "Active",
        }));
        let fData = formattedData.map((ele) => {
          if (
            ele?.address &&
            typeof ele.address === "string" &&
            ele?.address?.includes(",")
          )
            ele.address = ele.address.replaceAll(",", " ");
          return ele;
        });
        if (!fData) setTableUsers(formattedData);
        if (!fData) setTableUsers(formattedData);
        setTableUsers(fData);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [reloadTrigger]);
  const columns = [
    { dataIndex: "id", title: "SL. NO", key: "id" },
    { dataIndex: "customer_id", title: "Customer Id", key: "customer_id" },
    { dataIndex: "name", title: "Customer Name", key: "name" },
    {
      dataIndex: "phone_number",
      title: "Customer Phone Number",
      key: "phone_number",
    },
    { dataIndex: "address", title: "Customer Address", key: "address" },
    { dataIndex: "pincode", title: "Customer Pincode", key: "pincode" },
    { dataIndex: "collection_area", title: "Area", key: "collection_area" },
    {
      dataIndex: "customer_status",
      title: "Customer Status",
      render: (text) => (
        <Tag color={text === "active" || text === "Active" ? "green" : "red"}>
          {text}
        </Tag>
      ),
    },
  ];
  const handleFilterToggle = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id)
        ? prev.filter((filterId) => filterId !== id)
        : [...prev, id]
    );
  };
  return (
    <div>
      <div className="flex mt-20">
        <Sidebar />
        <Navbar visibility={true} />
        <CustomAlertDialog
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
          onClose={() =>
            setAlertConfig((prev) => ({ ...prev, visibility: false }))
          }
        />

        <div className="flex-grow p-7">
          <h1 className="text-xl font-bold">Search Filter</h1>
          <div className="grid grid-cols-12 gap-3 my-9">
            {filters.map((filter) => {
              const isActive = activeFilters.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterToggle(filter.id)}
                  className={`col-span-2 rounded-full bg-gradient-to-r ${
                    isActive
                      ? "from-blue-500 to-blue-700"
                      : "from-gray-300 to-gray-400 text-gray-800"
                  } text-white font-semibold shadow-md hover:from-blue-300 hover:to-blue-400 transition duration-300 ease-in-out py-2 px-4 text-center`}
                >
                  {filter.filterName}
                </button>
              );
            })}
          </div>
          <Search
            placeholder="Search Customer"
            allowClear
            enterButton
            ref={searchInputRef}
            size="large"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />

          {TableUsers?.length > 0 && !isLoading ? (
            <Table
              virtual
              title={() => (
                <h1 className="text-2xl font-semibold text-center">
                  Customers
                </h1>
              )}
              bordered
              tableLayout="auto"
              columns={columns}
              dataSource={
                searchText.trim()
                  ? fuse.search(searchText).map((res) => res.item)
                  : TableUsers
              }
              onRow={(record) => {
                return {
                  onClick: () => {
                    const userId = record._id;
                    if (userId) {
                      navigate(`/reports/user-report/?user_id=${userId}`);
                    } else {
                      window.location.reload();
                    }
                  },
                  style: { cursor: "pointer" },
                };
              }}
            />
          ) : (
            <CircularLoader
              isLoading={isLoading}
              failure={TableUsers.length <= 0}
              data="Customer Data"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;
