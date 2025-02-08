import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Typography,
  useTheme,
  Box,
  Pagination,
  useMediaQuery,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const CustomTable = ({
  columns,
  rows,
  onRowClick,
  actionComponent,
  disablePagination,
  borderBox,
  emptyText,
  pageNumber,
  totalPages,
  resetPage,
  currentPageNumber,
  uniqueValue,
  cardContentComponent,
  disabled,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);

  useEffect(() => {
    setPage(0);
  }, [resetPage]);

  useEffect(() => {
    if (currentPageNumber !== null && currentPageNumber !== undefined) {
      setPage(currentPageNumber);
    }
  }, [currentPageNumber]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    pageNumber && pageNumber(newPage);
  };

  const handleChangeRowsPerPage = (
    event
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const renderTable = () => (
    <Box sx={{ width: "100%", overflowX: isMobile ? "auto" : "hidden", mt:1}}>
      {!isMobile && (
        <TableContainer>
          <Table
            stickyHeader
            aria-label="sticky table"
            style={{ background: theme.palette.mode === "dark" ? theme.palette.primary[600] : "#FFFFFF" }}
          >
            <TableHead>
              <TableRow>
                {columns.map(
                  (column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, background: theme.palette.mode === "dark" ? theme.palette.primary[600] : "#FFFFFF"}}
                      >
                        <Typography
                          fontWeight="bold"
                          color={theme.palette.mode === "dark" ? "whitesmoke" : "black"}
                        >
                          {column.label}
                        </Typography>
                      </TableCell>
                    )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row, rowIndex) => renderTableRow(row, rowIndex))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {emptyText || "No Data Found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isMobile && (
        <Box>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => renderCardView(row, rowIndex))
          ) : (
            <Box sx={{ textAlign: "center", padding: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {emptyText || "No Data Found"}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      {!disablePagination && renderPagination()}
    </Box>
  );

  const renderTableRow = (row, rowIndex) => {
    return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      key={rowIndex}
      onClick={() => {
        if (onRowClick) {
          handleRowClick(row);
          onRowClick(row);
        }
      }}
      style={{
        cursor: onRowClick ? "pointer" : "",
        backgroundColor:
          selectedRow &&
          uniqueValue &&
          selectedRow[uniqueValue] === row[uniqueValue]
            ? theme.palette.primary[600]
            : "inherit",
      }}
    >
        {columns.map(
          (column) => (
              <TableCell key={column.id} align={column.align}>
                {column.id === "status"  ? (
                  <span style={{ color: "inherit" }}>
                    {row[column.id]}
                  </span>
                ) :
                  column.id === "practice" && row[column.id].length > 20 ? (
                    <span title={row[column.id]}>{`${row[column.id].substring(
                      0,
                      20
                    )}...`}</span>
                  ) : column.format && typeof row[column.id] === "number" ? (
                    column.format(row[column.id])
                  ) : column.id === "action" && row[column.id] ? (
                    row[column.id]
                  ) : column.id === "action" && actionComponent ? (
                    actionComponent(row, rowIndex)
                  ) : (
                    row[column.id]
                  )}
              </TableCell>
            )
        )}
      </TableRow>
    );
  };

  const renderCardView = (row, rowIndex) => (
    <Box key={rowIndex} sx={{ mb: 2 }}>
      <Box
        onClick={() => {
          if (onRowClick) {
            handleRowClick(row);
            onRowClick(row);
          }
        }}
        sx={{
          cursor: onRowClick ? "pointer" : "default",
          backgroundColor: theme.palette.primary[600],
          borderRadius : 3,
          border :  1,
          borderColor : theme.palette.primary[600],
        }}
      >
        <CardContent>
          {cardContentComponent ? (
            cardContentComponent(row)
          ) : (
            <Grid container spacing={2} alignItems="center">
              {columns.map(
                (column, index) =>
                  column.id !== "action" &&
                  (index === 0 ? (
                    <>
                      <Grid
                        item
                        xs={10}
                        key={column.id}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          sx={{ marginRight: 1 }}
                        >
                          {column.label} :
                        </Typography>
                        <Typography variant="body2">
                          {row[column.id]}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} style={{ textAlign: "right" }}>
                        <IconButton
                          onClick={(event) => handleMenuClick(event, row)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Grid>
                    </>
                  ) : (
                    <Grid
                      item
                      xs={12}
                      key={column.id}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{ marginRight: 1 }}
                      >
                        {column.label}:
                      </Typography>
                      <Typography variant="body2">{row[column.id]}</Typography>
                    </Grid>
                  ))
              )}
            </Grid>
          )}
        </CardContent>
      </Box>
    </Box>
  );

  const renderPagination = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: 2,
        position: "sticky",
        bottom: 0,
        background: theme.palette.mode === "dark"? "secondary" : "primary",
        zIndex: 1,
      }}
    >
      <Pagination
        variant="outlined"
        shape="rounded"
        count={totalPages || Math.ceil(rows.length / rowsPerPage)}
        page={page + 1}
        onChange={(event, value) => handleChangePage(event, value - 1)}
        color={theme.palette.mode === "dark" ? "secondary" : "primary"}
        showFirstButton
        showLastButton
      />
    </Box>
  );

  const renderMenuItems = () => {
    if (menuRow && actionComponent) {
      const actions = actionComponent(menuRow, 0);
      return React.Children.map(actions, (action, index) => (
        <MenuItem key={index}>
          {React.cloneElement(action)}
        </MenuItem>
      ));
    }
    return null;
  };

  return (
    <Box sx={borderBox ? tableBorderStyle : {}}>
      {renderTable()}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {renderMenuItems()}
      </Menu>
    </Box>
  );
};

const tableBorderStyle = {
  backgroundColor: (theme) =>
    theme.palette.mode === "dark"
      ? theme.palette.primary[600]
      : theme.palette.primary[600],
  borderRadius: 2,
  p: 1,
};

export default CustomTable;
