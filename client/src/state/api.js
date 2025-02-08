import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: ["User"],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboardStat",
      providesTags: ["Dashboard"],
    }),
    getChildren: build.query({
      query: () => "general/children",
      providesTags: ["Children"],
    }),
    getMonthlyData: build.query({
      query: () => "general/monthly-data",
      providesTags: ["MonthlyData"],
    }),
    getBMIData: build.query({
      query: () => "general/bmi-data",
      providesTags: ["BMIData"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetDashboardQuery,
  useGetChildrenQuery,
  useGetMonthlyDataQuery,
  useGetBMIDataQuery
} = api;
