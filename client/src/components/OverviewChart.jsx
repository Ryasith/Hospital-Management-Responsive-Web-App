import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { useGetMonthlyDataQuery } from "state/api";

const OverviewChart = ({ isDashboard = false, view }) => {
  const theme = useTheme();
  const { data, isLoading } = useGetMonthlyDataQuery();

  console.log(data)
  
    const [totalChildrenLine, totalUsersLine] = useMemo(() => {
      // const { monthlyData } = data;
      const totalChildrenLine = {
        id: "totalChildren",
        color: theme.palette.secondary.main,
        data: [],
      };
      const totalUsersLine = {
        id: "totalUsers",
        color: theme.palette.secondary[600],
        data: [],
      };
  
      if (data?.monthlyData) {
        // Initialize data arrays if not already done
        totalChildrenLine.data = totalChildrenLine.data || [];
        totalUsersLine.data = totalUsersLine.data || [];

        if (Array.isArray(data.monthlyData)) {
          data.monthlyData.reduce((acc, { month, totalChildren, totalUsers }) => {
            // Ensure month, totalChildren, and totalUsers are defined
            if (month !== undefined && totalChildren !== undefined && totalUsers !== undefined) {
              const curusers = acc.users + totalChildren;
              const curchildren = acc.children + totalUsers;

              totalChildrenLine.data = [
                ...totalChildrenLine.data,
                { x: month, y: curusers },
              ];
              totalUsersLine.data = [
                ...totalUsersLine.data,
                { x: month, y: curchildren },
              ];

              return { users: curusers, children: curchildren };
            }

            // If any value is undefined, return the accumulator without changes
            return acc;
          }, { users: 0, children: 0 });
        }

      } else {
        console.warn('data or data.monthlyData is undefined');
      }
      
  
      return [[totalChildrenLine], [totalUsersLine]];
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ResponsiveLine
      data={view === "users" ? totalUsersLine : totalChildrenLine}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: theme.palette.secondary[200],
            },
          },
          legend: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.secondary[200],
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.secondary[200],
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.secondary[200],
          },
        },
        tooltip: {
          container: {
            color: theme.palette.primary.main,
          },
        },
      }}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (v) => {
          if (isDashboard) return v.slice(0, 3);
          return v;
        },
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard
          ? ""
          : `Total ${view === "users" ? "Users Registration" : "Children Data Collection"} for Year`,
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 30,
                translateY: -40,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default OverviewChart;