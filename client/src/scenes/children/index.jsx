import React, {useMemo} from "react";
import { Box, useTheme } from "@mui/material";
import { useGetChildrenQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";

const Children = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetChildrenQuery();

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.7,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 0.5,
    },
    {
      field: "mobile",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      },
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "parentName",
      headerName: "Parent Name",
      flex: 1,
    }
  ];

  const formattedData = useMemo(() => {
    if (data?.length > 0) {
      return data?.map((child) => {
        return {
          _id: child._id,
          name: child.childFirstName + " " + child.childLastName,
          gender: child.gender,
          mobile: child.mobile,
          address: child.address,
          parentName: child.parentName,
        };
      });
    }
    return [];
  }, [data]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CHILDREN" subtitle="List of Children Data" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={formattedData || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Children;