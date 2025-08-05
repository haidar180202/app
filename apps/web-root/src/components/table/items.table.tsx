import { useItems, useItemsMutation } from "@api/items/items.api";
import  { useState } from "react";


export default function itemsTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, error, isLoading, isFetching } = useItems({ page, pageSize });

  const { del } = useItemsMutation();

  if (isLoading)
    return <div className="alert alert-info">Loading data...</div>;
  if (error)
    return (
      <div className="alert alert-danger">
        Error loading data: {(error as Error).message}
      </div>
    );

  return (
    <div>
      <table className="table table-bordered table-striped table-hover">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item:any) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      del.mutate(item.id, {
                        onSuccess: () =>
                          alert("Deleted item id " + item.id),
                        onError: () => alert("Failed to delete"),
                      })
                    }
                    disabled={del.isPending}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination manual */}
      <nav>
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {page} {isFetching && <span> (Loading...)</span>}
            </span>
          </li>
          <li
            className={`page-item ${
              data && data.length < pageSize ? "disabled" : ""
            }`}
          >
            <button className="page-link" onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
