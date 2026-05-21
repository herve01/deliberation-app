import React, { useMemo, useState } from "react";

import {
  CBadge,
  CCard,
  CCardBody,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CPagination,
  CPaginationItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from "@coreui/react";

import "bootstrap-icons/font/bootstrap-icons.css";

const Table = ({
  columns = [],
  data = [],
  itemsPerPage = 5,
}) => {

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [sortConfig, setSortConfig] =
    useState(null);

  // SEARCH
  const filteredData = useMemo(() => {

    return data.filter((row) =>
      columns.some((col) => {

        const value = row[col.accessor];

        return value
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase());

      })
    );

  }, [search, data, columns]);

  // SORT
  const sortedData = useMemo(() => {

    if (!sortConfig) {
      return filteredData;
    }

    const { key, direction } =
      sortConfig;

    return [...filteredData].sort((a, b) => {

      let valA = a[key];
      let valB = b[key];

      // NULL
      if (valA == null) return 1;
      if (valB == null) return -1;

      // STRING
      if (typeof valA === "string") {

        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);

      }

      // NUMBER / DATE
      if (valA < valB) {
        return direction === "asc"
          ? -1
          : 1;
      }

      if (valA > valB) {
        return direction === "asc"
          ? 1
          : -1;
      }

      return 0;

    });

  }, [filteredData, sortConfig]);

  // SORT CLICK
  const handleSort = (key) => {

    setCurrentPage(1);

    setSortConfig((prev) => {

      if (
        prev?.key === key &&
        prev.direction === "asc"
      ) {

        return {
          key,
          direction: "desc"
        };
      }

      return {
        key,
        direction: "asc"
      };

    });
  };

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedData.length / itemsPerPage
    )
  );

  const paginatedData = useMemo(() => {

    const start =
      (currentPage - 1) * itemsPerPage;

    return sortedData.slice(
      start,
      start + itemsPerPage
    );

  }, [
    currentPage,
    sortedData,
    itemsPerPage
  ]);

  const pages =
    [...Array(totalPages).keys()]
      .map((n) => n + 1);

  return (
      <CCardBody>

        {/* SEARCH */}
        <div className="mb-4">

          <CInputGroup>

            <CInputGroupText>
              <i className="bi bi-search"></i>
            </CInputGroupText>

            <CFormInput
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {

                setSearch(e.target.value);

                setCurrentPage(1);

              }}
            />

          </CInputGroup>

        </div>

        {/* TABLE */}
        <CTable
          hover
          responsive
          align="middle"
          className="mb-0 border"
        >

          {/* HEADER */}
          <CTableHead
            color="light"
            className="text-nowrap">
            <CTableRow>
              {columns.map((col, i) => (
                <CTableHeaderCell
                  key={col.accessor || i}
                  onClick={() =>
                    handleSort(col.accessor)
                  }>
                  <div
                    className={`d-flex align-items-center gap-2 ${
                      i === columns.length - 1
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}>
                    {col.header}
                    {sortConfig?.key === col.accessor && (

                      <CBadge color="secondary">
                        {sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"}
                      </CBadge>
                    )}
                  </div>
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>

          {/* BODY */}
          <CTableBody>

            {paginatedData.length > 0 ? (

              paginatedData.map((row, i) => (

                <CTableRow
                  key={row.id || i}>

                  {columns.map((col, j) => (

                    <CTableDataCell
                      key={col.accessor || j}>
                      {col.render
                        ? col.render(row)
                        : row[col.accessor] ?? "-"}

                    </CTableDataCell>
                  ))}
                </CTableRow>
              ))
              ) : (

              <CTableRow>
                <CTableDataCell
                  colSpan={columns.length}
                  className="text-center py-5">
                  Aucun résultat
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* PAGINATION */}
        <div className="d-flex justify-content-end mt-4">

          <CPagination align="end">
            {/* PREVIOUS */}
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
            >
              ‹
            </CPaginationItem>

            {/* PAGES */}
            {pages.map((p) => (

              <CPaginationItem
                key={p}
                active={currentPage === p}
                onClick={() =>
                  setCurrentPage(p)
                }
              >
                {p}
              </CPaginationItem>

            ))}

            {/* NEXT */}
            <CPaginationItem
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    totalPages
                  )
                )
              }
            >
              ›
            </CPaginationItem>

          </CPagination>

        </div>

      </CCardBody>
  );
};

export default Table;