import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const CrmBoard = () => {
  const { crmTasks, getCrmTasks, createCrmTask, updateCrmTask, crmSummary, getCrmSummary } = useContext(AdminContext);
  const [title, setTitle] = useState("");
  const [patientName, setPatientName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    getCrmTasks({ status: statusFilter });
    getCrmSummary();
  }, [statusFilter]);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const ok = await createCrmTask({
      title: title.trim(),
      patientName: patientName.trim(),
      description: description.trim(),
      priority,
    });
    if (ok) {
      setTitle("");
      setPatientName("");
      setDescription("");
      setPriority("Medium");
      getCrmTasks({ status: statusFilter });
      getCrmSummary();
    }
  };

  const onStatusChange = async (taskId, status) => {
    const ok = await updateCrmTask(taskId, { status });
    if (ok) {
      getCrmTasks({ status: statusFilter });
      getCrmSummary();
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">CRM Board</h1>

      {crmSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border rounded p-3">
            <p className="text-xs text-gray-500">Open</p>
            <p className="text-xl font-semibold text-gray-800">{crmSummary.open}</p>
          </div>
          <div className="bg-white border rounded p-3">
            <p className="text-xs text-gray-500">In Progress</p>
            <p className="text-xl font-semibold text-gray-800">{crmSummary.inProgress}</p>
          </div>
          <div className="bg-white border rounded p-3">
            <p className="text-xs text-gray-500">Done</p>
            <p className="text-xl font-semibold text-gray-800">{crmSummary.done}</p>
          </div>
          <div className="bg-white border rounded p-3">
            <p className="text-xs text-gray-500">High Priority Pending</p>
            <p className="text-xl font-semibold text-red-600">{crmSummary.highPriorityPending}</p>
          </div>
        </div>
      )}

      <form onSubmit={onCreate} className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Task Title</p>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Patient Name</p>
          <input value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-600 mb-1">Description</p>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[80px]" />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Priority</p>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button className="bg-primary text-white px-4 py-2 rounded">Create Task</button>
        </div>
      </form>

      <div className="flex items-center gap-3 mb-4">
        <p className="text-sm text-gray-600">Filter Status:</p>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="space-y-3">
        {crmTasks.length === 0 ? (
          <p className="text-gray-500">No CRM tasks found.</p>
        ) : (
          crmTasks.map((task) => (
            <div key={task._id} className="bg-white border rounded-lg p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.patientName || "General task"}</p>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                <div className="min-w-[180px]">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task._id, e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">Priority: {task.priority}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CrmBoard;
