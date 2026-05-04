import React, { useState, useMemo } from "react";
import { ICON_PATHS } from "@src/assets/icons/paths";
import "@src/styles/global.css";

const Table = ({ columns = [], data = [], itemsPerPage = 5 }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);

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

  // 🔃 SORT
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const { key, direction } = sortConfig;

    return [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setCurrentPage(1);
    setSortConfig((prev) => {
      if (prev?.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  // 📄 PAGINATION
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [currentPage, sortedData, itemsPerPage]);

  // 🔢 Pagination numbers
  const pages = [...Array(totalPages).keys()].map((n) => n + 1);

  return (
    <div>
      {/* SEARCH */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text"
            style={{width:40}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="search-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={ICON_PATHS.SEARCH}
                />
              </svg>
            </span>
            <input
              className="form-control"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table align-middle table-custom small">
          <thead className="thead-custom">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                    style={{
                      cursor: "pointer",
                      textAlign: i === columns.length - 1 ? "right" : "left",
                    }}
                  onClick={() => handleSort(col.accessor)}
                >
                  {col.header}{" "}
                  {sortConfig?.key === col.accessor &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j}
                   >

                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📄 PAGINATION */}
      <div className="d-flex justify-content-end mt-3">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 && "disabled"}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ‹
            </button>
          </li>

          {pages.map((p) => (
            <li
              key={p}
              className={`page-item ${currentPage === p ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(p)}>
                {p}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages && "disabled"
            }`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              ›
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Table;