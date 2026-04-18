import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const ReceptionAppointments = () => {
  const {
    receptionAppointments,
    getReceptionAppointments,
    confirmReceptionAppointment,
    cancelReceptionAppointment,
  } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    getReceptionAppointments();
  }, []);

  const onConfirm = async (id) => {
    const ok = await confirmReceptionAppointment(id);
    if (ok) getReceptionAppointments();
  };

  const onCancel = async (id) => {
    const ok = await cancelReceptionAppointment(id);
    if (ok) getReceptionAppointments();
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Reception Appointments</h1>
      <div className="bg-white border rounded-lg overflow-hidden">
        {receptionAppointments.length === 0 ? (
          <p className="text-gray-500 p-4">No appointments found.</p>
        ) : (
          receptionAppointments.map((item) => (
            <div key={item._id} className="p-4 border-b last:border-b-0 flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">{item.userData?.name || "Patient"}</p>
                <p className="text-sm text-gray-600">{item.docData?.name || "Doctor"} - {item.docData?.speciality || "N/A"}</p>
                <p className="text-sm text-gray-600">{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                <p className="text-xs text-gray-500 mt-1">Status: {item.status}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.status === "PENDING" && (
                  <button onClick={() => onConfirm(item.id || item._id)} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">Confirm</button>
                )}
                {item.status !== "CANCELLED" && item.status !== "COMPLETED" && (
                  <button onClick={() => onCancel(item.id || item._id)} className="px-3 py-2 rounded bg-red-600 text-white text-sm">Cancel</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReceptionAppointments;
