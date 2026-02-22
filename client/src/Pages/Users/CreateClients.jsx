import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClient } from "../../redux/action/user";
import { Box, Divider, Dialog, DialogContent, DialogTitle, Slide, DialogActions, TextField, Grid } from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { useForm } from "../../hooks/useForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const formFields = [
  { key: "firstName", label: "First Name", required: false },
  { key: "lastName", label: "Last Name", required: false },
  { key: "username", label: "Username", required: true },
  { key: "password", label: "Password", required: false },
  { key: "phone", label: "Phone", required: true },
  { key: "city", label: "City", required: false },
  { key: "CNIC", label: "CNIC", required: false },
  {
    key: "email",
    label: "Client Email",
    required: true,
    validate: (value) => {
      if (!value) return "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? "" : "Invalid email format";
    },
  },
];

const CreateClient = ({ open, setOpen, scroll }) => {
  const { isFetching } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { values, errors, handleChange, handleSubmit, reset, isSubmitting } = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      phone: "",
      city: "",
      CNIC: "",
      email: "",
    },
    fields: formFields,
    onSubmit: async (data) => {
      await dispatch(createClient(data, setOpen));
      reset();
    },
  });

  const handleClose = () => {
    setOpen(false);
    setEmployeeData(initialEmployeeState);
    setFieldErrors(initialFieldErrors);
  };

  return (
    <div>
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
            <div className="text-sky-400 font-primary">Create New Client</div>
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
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={`${field.topAligned ? "flex items-start pt-2" : ""} pb-4 text-lg`}
                    >
                      {field.label}
                    </Grid>

                    <Grid item xs={12} sm={8} className="pb-4">
                      <TextField
                        type={field.type}
                        size="small"
                        fullWidth
                        error={Boolean(errors[field.key])}
                        helperText={errors[field.key] || " "}
                        placeholder={field.placeholder}
                        value={values[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
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
              disabled={isFetching || isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin"
              disabled={isFetching || isSubmitting}
            >
              {isFetching || isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default CreateClient;
