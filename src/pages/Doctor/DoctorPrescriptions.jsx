import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorPrescriptions = () => {
  const { prescriptions, getMyPrescriptions, createPrescription, profileData, patients, getPatients } = useContext(DoctorContext);
  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    getMyPrescriptions();
    getPatients();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!patientId || !medicine.trim()) return;
    if (!profileData?.id) {
      alert("Doctor profile not loaded. Please refresh.");
      return;
    }

    const medicines = JSON.stringify([{
      medicine: medicine.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
    }]);

    const ok = await createPrescription({
      patientId: patientId,
      notes: notes.trim(),
      medicines,
      status: "FINALIZED",
    });
    if (ok) {
      setNotes("");
      setMedicine("");
      setDosage("");
      setFrequency("");
      setDuration("");
      getMyPrescriptions();
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Prescription Workflow</h1>

      <form onSubmit={onCreate} className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Select Patient</p>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} - {p.phone}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-600 mb-1">Notes</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[80px]" />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Medicine</p>
          <input value={medicine} onChange={(e) => setMedicine(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Dosage</p>
          <input value={dosage} onChange={(e) => setDosage(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Frequency</p>
          <input value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Duration</p>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <button className="bg-primary text-white px-4 py-2 rounded">Finalize Prescription</button>
        </div>
      </form>

      <div className="space-y-3">
        {prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions created yet.</p>
        ) : (
          prescriptions.map((p) => (
            <div key={p.id} className="bg-white border rounded-lg p-4">
              <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</p>
              <p className="font-semibold text-gray-900 mt-1">Patient: {p.patientId}</p>
              <p className="text-sm text-gray-600">{p.notes || "No notes"}</p>
              <ul className="mt-2 text-sm text-gray-700">
                {JSON.parse(p.medicines || '[]').map((item, idx) => (
                  <li key={idx}>
                    {item.medicine} - {item.dosage} - {item.frequency} - {item.duration}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
