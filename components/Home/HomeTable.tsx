import {
  TableContainer,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@windmill/react-ui";
import React, { useMemo } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { useTable, useSortBy } from "react-table";

import { Districts, SummaryLang, SummaryKeys } from "../../lib/constants";

type HomeTableProps = {
  districtHistories: Stats.DistrictHistories;
  hotspotsHistories: Stats.HotspotHistories;
};

export default function HomeTable({
  districtHistories,
  hotspotsHistories,
}: HomeTableProps) {
  const columns = useMemo(
    () => [
      {
        Header: "District",
        accessor: "district",
      },
      ...Object.values(SummaryKeys).map((k) => ({
        Header: SummaryLang[k],
        accessor: k,
      })),
      {
        Header: "Hotspots",
        accessor: "hotspots",
      },
    ],
    []
  );
  const data = useMemo(
    () =>
      Object.values(Districts).map((d) => ({
        district: d,
        ...districtHistories[districtHistories.length - 1].summary[d],
        hotspots: hotspotsHistories[
          hotspotsHistories.length - 1
        ].hotspots.filter((h) => h.district.toLowerCase() === d).length,
      })),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  return (
    <div>
      <TableContainer>
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, j) => (
                  <TableCell
                    key={j}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <span className="items-center inline-flex">
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <div className="h-4 invisible w-4" />
                      )}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow key={i} {...row.getRowProps()}>
                  {row.cells.map((cell, j) => (
                    <TableCell
                      className="capitalize"
                      key={j}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
