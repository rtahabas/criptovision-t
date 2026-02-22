import React from "react";
import { updateUser } from "../../redux/action/user";
import { useDispatch, useSelector } from "react-redux";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { Box, Divider, Dialog, DialogContent, DialogTitle, Slide, DialogActions, TextField, Grid } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const formFields = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "username", label: "Username" },
  { key: "phone", label: "Phone" },
  { key: "city", label: "City" },
  { key: "CNIC", label: "CNIC" },
  { key: "email", label: "Email" },
];

const EditClient = ({ open, setOpen, scroll = "paper" }) => {
  const dispatch = useDispatch();
  const { currentEmployee: currentClient, isFetching } = useSelector((state) => state.user);
  const initialClientState = React.useMemo(
    () => ({
      firstName: currentClient?.firstName || "",
      lastName: currentClient?.lastName || "",
      username: currentClient?.username || "",
      phone: currentClient?.phone || "",
      city: currentClient?.city || "",
      CNIC: currentClient?.CNIC || "",
      email: currentClient?.email || "",
    }),
    [currentClient],
  );

  const [clientData, setClientData] = React.useState(initialClientState);

  React.useEffect(() => {
    setClientData(initialClientState);
  }, [initialClientState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentClient?._id) return;
    await dispatch(updateUser(currentClient._id, clientData));
    setClientData(initialClientState);
    setOpen(false);
  };

  const handleInputChange = (field, value) => {
    setClientData((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      scroll={scroll}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-describedby="alert-dialog-slide-description"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400 font-primary">Edit Client</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>

        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad size={23} />
              <span>Client Details</span>
            </div>
            <Divider />

            <Grid container className="mt-4" columnSpacing={2}>
              {formFields.map((field) => (
                <React.Fragment key={field.key}>
                  <Grid item xs={12} sm={4} className="pb-4 text-lg">
                    {field.label}
                  </Grid>

                  <Grid item xs={12} sm={8} className="pb-4">
                    <TextField
                      size="small"
                      fullWidth
                      value={clientData?.[field.key] || ""}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            alignItems: "flex-start",
            padding: "20px",
          }}
        >
          <button
            type="reset"
            className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all"
            onClick={handleClose}
            disabled={isFetching}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin"
            disabled={isFetching}
          >
            {isFetching ? "Submitting..." : "Submit"}
          </button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditClient;
