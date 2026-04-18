import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const ReferralsBoard = () => {
  const { referrals, getReferrals, updateReferralStatus } = useContext(AdminContext);

  useEffect(() => {
    getReferrals();
  }, []);

  const onChangeStatus = async (id, status) => {
    const ok = await updateReferralStatus(id, status);
    if (ok) getReferrals();
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Referrals Board</h1>
      <div className="space-y-3">
        {referrals.length === 0 ? (
          <p className="text-gray-500">No referrals available.</p>
        ) : (
          referrals.map((ref) => (
            <div key={ref.id} className="bg-white border rounded-lg p-4 flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">{ref.type}: {ref.pharmacy?.name || ref.lab?.name || ref.radiologyCenter?.name}</p>
                <p className="text-sm text-gray-600">Patient: {ref.patient?.firstName} {ref.patient?.lastName}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(ref.createdAt).toLocaleString()}</p>
              </div>
              <div className="min-w-[170px]">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <select value={ref.status} onChange={(e) => onChangeStatus(ref.id, e.target.value)} className="w-full border rounded px-3 py-2">
                  <option value="SENT">Sent</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReferralsBoard;
