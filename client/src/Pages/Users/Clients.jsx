import React from "react";
import Topbar from "./Topbar";
import { Table } from "../../Components";
import { useDispatch, useSelector } from "react-redux";
import { getClients, getEmployeeClients } from "../../redux/action/user";
import { getUserReducer } from "../../redux/reducer/user";
import { Tooltip } from "@mui/material";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import Filter from "./Filter";
import User from "./User";
import DeleteClient from "./Delete";
import EditClient from "./EditClients";

const Clients = () => {
  ////////////////////////////////////// VARIABLES /////////////////////////////////////
  const dispatch = useDispatch();
  const { clients, isFetching, error, loggedUser } = useSelector((state) => state.user);

  const columns = [
    {
      field: "uid",
      headerName: "ID",
      width: 70,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip title={""}>
          <span className="font-primary capitalize">{params.row.uid}</span>
        </Tooltip>
      ),
    },
    {
      headerClassName: "super-app-theme--header",
      field: "Client Name",
      headerName: "Client Name",
      width: "200",
      renderCell: (params) => (
        <div className="capitalize text-[#20aee3] font-primary hover:text-[#007bff] cursor-pointer font-light">
          {params.row.firstName} {params.row.lastName}
        </div>
      ),
    },
    {
      field: "username",
      headerName: "Client Username",
      headerClassName: "super-app-theme--header",
      width: "200",
      renderCell: (params) => <div className="capitalize font-primary">{params.row.username}</div>,
    },
    {
      field: "phone",
      headerName: "Phone",
      headerClassName: "super-app-theme--header",
      width: "150",
      renderCell: (params) => <div className="font-primary">{params.row.phone}</div>,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "super-app-theme--header",
      width: "220",
      renderCell: (params) => <div className="font-primary">{params.row?.email}</div>,
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="flex gap-[10px]">
          {loggedUser?.role != "employee" && (
            <>
              <Tooltip placement="top" title="Delete" arrow>
                {" "}
                <PiTrashLight
                  onClick={() => handleOpenDeleteModal(params.row._id)}
                  className="cursor-pointer text-red-500 text-[23px] hover:text-red-400"
                />
              </Tooltip>
              <Tooltip placement="top" title="Edit" arrow>
                {" "}
                <CiEdit
                  onClick={() => handleOpenEditModal(params.row)}
                  className="cursor-pointer text-green-500 text-[23px] hover:text-green-600"
                />
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  ////////////////////////////////////// STATES ////////////////////////////////////////
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState("");
  const [openFilters, setOpenFilters] = React.useState("");
  const [openUser, setOpenUser] = React.useState(false);

  ////////////////////////////////////// USE EFFECTS ////////////////////////////////////
  React.useEffect(() => {
    loggedUser.role == 'employee'
      ?
      dispatch(getEmployeeClients())
      :
      dispatch(getClients());
  }, []);

  ////////////////////////////////////// FUNCTIONS //////////////////////////////////////////
  const handleClickOpen = () => {
    setOpenUser(true);
  };
  const handleOpenEditModal = (employee) => {
    dispatch(getUserReducer(employee));
    setOpenEditModal(true);
  };
  const handleOpenDeleteModal = (userId) => {
    setSelectedUserId(userId);
    setOpenDeleteModal(true);
  };

  return (
    <div className="w-full">
      <EditClient open={openEditModal} setOpen={setOpenEditModal} />
      <DeleteClient open={openDeleteModal} setOpen={setOpenDeleteModal} userId={selectedUserId} />
      <Filter open={openFilters} setOpen={setOpenFilters} />
      <User open={openUser} setOpen={setOpenUser} />

      <Topbar />
      <Table
        rows={clients}
        columns={columns}
        isFetching={isFetching}
        error={error}
        rowsPerPage={10}
      />
    </div>
  );
};

export default Clients;
