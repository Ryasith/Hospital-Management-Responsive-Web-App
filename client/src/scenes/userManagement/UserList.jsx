import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Collapse, Grid } from "@mui/material";
import Header from "components/Header";
import Card from "components/Card";
import Button from "components/Button";
import {
  AddCircleOutlineOutlined,
  DoDisturbAltOutlined,
  ModeOutlined,
  SearchOutlined,
  DeleteForeverOutlined,
  CheckCircleOutline,
  VpnKey
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "components/CustomTable";
import CustomIconButton from "components/CustomIconButton";
import Swal from 'sweetalert2'
import PasswordResetPopup from "components/PasswordResetPopup";

const UserList = () => {
  const [resetPage, setResetPage] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showPasswordResetPopup, setShowPasswordResetPopup] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userID, setUserID] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);  

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5001/user/all_users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const formattedUsers = useMemo(() => {
    if (users.length > 0) {
      return users?.map((user) => {
        return {
          userId: user._id,
          email: user.email,
          userRole: user.userRole,
          userName: user.firstName + " " + user.lastName,
          phoneNumber: user.phoneNumber,
          city: user.city,
        };
      });
    }
    return [];
  }, [users]);

  const columns = [
    { id: "email", label: "Email", minWidth: 100 },
    { id: "userRole", label: "User Type", minWidth: 100 },
    { id: "userName", label: "Name", minWidth: 100 },
    { id: "phoneNumber", label: "Phone", minWidth: 100 },
    { id: "city", label: "City", minWidth: 100, align: "center" },
    {
      id: "action",
      label: "Action",
      minWidth: 100,
    },
  ];

  const handleDeleteClick = (userId) => {
    Swal.fire({
      title: "Do you want to delete this user?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUser(userId).then(()=>{
          fetchUsers();
          Swal.fire("Deleted successfully");
        })
      }
    });
  }

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/user/deleteUser/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      const result = await response.json();
      console.log(result.message); // Optional: handle success message
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  }

  const handleActionResetPassword = (row) => {
    const {  userId, email } = row;
    // dispatch(fetchUserProfileById(parseInt(userId)));
    setUserEmail(email);
    setUserID(userId);
    setShowPasswordResetPopup(true);
  }

  const actionComponent = (row) => {
    return (
      <>
        <CustomIconButton
          color="info"
          size="small"
          variant="outlined"
          tooltipMessage="Edit"
          tooltipPlacement="top"
          onClick={() => navigate("/create_user", {state: {userId: row.userId}})}
        >
          <ModeOutlined fontSize="small" />
        </CustomIconButton>
        <CustomIconButton
          color="error"
          size="small"
          variant="outlined"
          tooltipMessage="Reset Password"
          tooltipPlacement="top"
          onClick={() => handleDeleteClick(row.userId)}
        >
          <DeleteForeverOutlined fontSize="small" />
        </CustomIconButton>
        <CustomIconButton
          color="warning"
          size="small"
          variant="outlined"
          tooltipMessage="Reset Password"
          tooltipPlacement="top"
          onClick={() => handleActionResetPassword(row)}
        >
          <VpnKey fontSize="small" />
        </CustomIconButton>
      </>
    );
  };

  return (
    <>
          { showPasswordResetPopup &&
      <PasswordResetPopup
        open={showPasswordResetPopup}
        email={userEmail}
        userId={userID}
        onClose={() => {
          setShowPasswordResetPopup(false);
        }}
      />
      }
      <Box m="20px">
        <Header title="User List" subtitle="User Management" />
        <Box mt={2}>
          <Card>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs = {12} md>
              </Grid>
              <Grid item xs={12} md="auto">
                <Button
                  fullWidth
                  color="info"
                  startIcon={<AddCircleOutlineOutlined />}
                  onClick={() => navigate("/create_user")}
                >
                  Create User
                </Button>
              </Grid>
            </Grid>
            <Table
              columns={columns}
              rows={formattedUsers}
              actionComponent={(row) => actionComponent(row)}
              emptyText="No User(s) Found"
              resetPage={resetPage}
            />
          </Card>
        </Box>
      </Box>
    </>
  )
}

export default UserList