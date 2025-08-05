import { Link } from "react-router";
import React from "react";
import { Err } from "@utils/error";

export default function Welcome({ module = "module" }: { module?: string }) {
  return (
    <>
      <h1>Rsbuild with React </h1>
      <div>{module}</div>
      <div>
        <button type="button" onClick={() => Err("Test Error")}>
          Error
        </button>
      </div>
      <div>{React.version}</div>
      <div>
        <ul>
          <li>
            <Link to="/">Home (App route Relative)</Link>
          </li>
          <li>
            <a href="/">Home (direct url manipulation (parent url))</a>
          </li>
          <li>
            <Link to="/another">Module</Link>
          </li>
          <li>
            <Link to="/dashboard">Protected</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
