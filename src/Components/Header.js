import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://aircall-backend.onrender.com",
});

const Header = () => {
  const [calls, setCalls] = useState([]);
  const [activeTab, setActiveTab] = useState("activity");
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await api.get(`/activities`);
      setCalls(response.data);
    } catch (error) {
      console.error("Error fetching calls:", error);
    }
  };

  const archiveCall = async (id, isArchived) => {
    try {
      await api.patch(`/activities/${id}`, { is_archived: isArchived });
      fetchCalls();
    } catch (error) {
      console.error(`Error archiving call ${id}:`, error);
    }
  };

  const archiveAllCalls = async () => {
    try {
      await Promise.all(
        calls
          .filter((call) => !call.is_archived)
          .map((call) =>
            api.patch(`/activities/${call.id}`, { is_archived: true })
          )
      );
      fetchCalls();
    } catch (error) {
      console.error("Error archiving all calls:", error);
    }
  };

  const unarchiveAllCalls = async () => {
    try {
      await Promise.all(
        calls
          .filter((call) => call.is_archived)
          .map((call) =>
            api.patch(`/activities/${call.id}`, { is_archived: false })
          )
      );
      fetchCalls();
    } catch (error) {
      console.error("Error unarchiving all calls:", error);
    }
  };

  const handleCallClick = async (id) => {
    try {
      const response = await api.get(`/activities/${id}`);
      setSelectedCall(response.data);
      setActiveTab("inbox");
    } catch (error) {
      console.error(`Error fetching call ${id}:`, error);
    }
  };

  const renderCalls = (callsList) => {
    return callsList.map((call) => (
      <div
        key={call.id}
        onClick={() => handleCallClick(call.id)}
        className="cursor-pointer"
      >
        <div className="text-zinc-500 text-xs">
          {new Date(call.created_at).toLocaleDateString()}
        </div>
        <div className="flex justify-between items-center p-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
          <div>
            <div className="text-zinc-900 dark:text-zinc-100">{call.from}</div>
            <div className="text-zinc-500 text-sm">{call.direction}</div>
          </div>
          <div className="text-zinc-500 text-xs">
            {new Date(call.created_at).toLocaleTimeString()}
          </div>
        </div>
      </div>
    ));
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          ({calls.length}) Aircall Phone
        </h1>
        <div className="flex space-x-1">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
      </div>
      <div className="flex justify-around border-b border-zinc-200 dark:border-zinc-700">
        <button
          className={`py-2 ${
            activeTab === "activity"
              ? "text-primary-foreground border-b-2 border-black"
              : "text-zinc-500"
          }`}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
        <button
          className={`py-2 ${
            activeTab === "inbox"
              ? "text-primary-foreground border-b-2 border-black"
              : "text-zinc-500"
          }`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox
        </button>
        <button
          className={`py-2 ${
            activeTab === "archive"
              ? "text-primary-foreground border-b-2 border-black"
              : "text-zinc-500"
          }`}
          onClick={() => setActiveTab("archive")}
        >
          Archived
        </button>
      </div>

      <div className="p-4">
        {activeTab === "activity" && (
          <button
            className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={archiveAllCalls}
          >
            Archive all calls
          </button>
        )}
        {activeTab === "archive" && (
          <button
            className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={unarchiveAllCalls}
          >
            Unarchive all calls
          </button>
        )}
      </div>

      <div className="space-y-4 p-4 h-96 overflow-y-auto">
        {activeTab === "activity" &&
          renderCalls(calls.filter((call) => !call.is_archived))}
        {activeTab === "archive" &&
          renderCalls(calls.filter((call) => call.is_archived))}
        {activeTab === "inbox" && selectedCall && (
          <div>
            <div className="text-zinc-500 text-xs">
              {new Date(selectedCall.created_at).toLocaleDateString()}
            </div>
            <div className="flex justify-between items-center p-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
              <div>
                <div className="text-zinc-900 dark:text-zinc-100">
                  {selectedCall.from}
                </div>
                <div className="text-zinc-500 text-sm">
                  {selectedCall.direction}
                </div>
              </div>
              <div className="text-zinc-500 text-xs">
                {new Date(selectedCall.created_at).toLocaleTimeString()}
              </div>
            </div>
            <div className="text-zinc-500 text-sm">
              {formatDuration(selectedCall.duration)}
            </div>
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out"
              onClick={() =>
                archiveCall(selectedCall.id, !selectedCall.is_archived)
              }
            >
              {selectedCall.is_archived ? "Unarchive Call" : "Archive Call"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
