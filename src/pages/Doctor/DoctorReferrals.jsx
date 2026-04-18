import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorReferrals = () => {
  const { referrals, getMyReferrals, createReferral, profileData, pharmacies, labs, getPharmacies, getLabs } = useContext(DoctorContext);
  const [patientId, setPatientId] = useState("");
  const [refType, setRefType] = useState("LAB");
  const [refTargetId, setRefTargetId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getMyReferrals();
    getPharmacies();
    getLabs();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!patientId.trim() || !refTargetId.trim()) return;
    if (!profileData?.id) {
      alert("Doctor profile not loaded. Please refresh.");
      return;
    }

    const payload = {
      patientId: patientId.trim(),
      type: refType,
      notes: notes.trim(),
    };
    if (refType === "PHARMACY") {
      payload.pharmacyId = refTargetId.trim();
    } else if (refType === "LAB") {
      payload.labId = refTargetId.trim();
    }

    const ok = await createReferral(payload);
    if (ok) {
      setRefTargetId("");
      setNotes("");
      getMyReferrals();
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Referral Tracking</h1>

      <form onSubmit={onCreate} className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Patient ID</p>
          <input value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Referral Type</p>
          <select value={refType} onChange={(e) => { setRefType(e.target.value); setRefTargetId(""); }} className="w-full border rounded px-3 py-2">
            <option value="LAB">Lab</option>
            <option value="PHARMACY">Pharmacy</option>
            <option value="RADIOLOGY">Radiology</option>
          </select>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">{refType === "PHARMACY" ? "Pharmacy" : "Lab"}</p>
          {refType === "RADIOLOGY" ? (
            <input value={refTargetId} onChange={(e) => setRefTargetId(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter target" />
          ) : (
            <select value={refTargetId} onChange={(e) => setRefTargetId(e.target.value)} className="w-full border rounded px-3 py-2" required>
              <option value="">Select {refType === "PHARMACY" ? "Pharmacy" : "Lab"}</option>
              {(refType === "PHARMACY" ? pharmacies : labs).map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-600 mb-1">Notes</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[70px]" />
        </div>
        <div className="md:col-span-2">
          <button className="bg-primary text-white px-4 py-2 rounded">Create Referral</button>
        </div>
      </form>

      <div className="space-y-3">
        {referrals.length === 0 ? (
          <p className="text-gray-500">No referrals found.</p>
        ) : (
          referrals.map((ref) => (
            <div key={ref.id} className="bg-white border rounded-lg p-4">
              <p className="text-xs text-gray-500">{new Date(ref.createdAt).toLocaleString()}</p>
              <p className="font-semibold text-gray-900 mt-1">{ref.type}</p>
              <p className="text-sm text-gray-600">Patient: {ref.patient?.firstName} {ref.patient?.lastName}</p>
              <p className="text-sm text-gray-600">Status: {ref.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorReferrals;
