import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faUser,
  faCog,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <>
      <div className="flex justify-around p-4 border-t border-zinc-200 dark:border-zinc-800">
        <button style={{ fontSize: "22px" }}>
          <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
        </button>
        <button style={{ fontSize: "22px" }}>
          <FontAwesomeIcon icon={faUser} aria-hidden="true" />
        </button>
        <button style={{ fontSize: "22px" }}>
          <FontAwesomeIcon icon={faCog} aria-hidden="true" />
        </button>
        <button style={{ fontSize: "22px" }}>
          <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
