import React, { useContext, useState, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorRecords = () => {
  const { records, getPatientRecords, createPatientRecord, profileData, patients, getPatients } = useContext(DoctorContext);
  const [patientId, setPatientId] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [notes, setNotes] = useState("");
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");

  const onSearch = async (e) => {
    e.preventDefault();
    if (!patientId) return;
    await getPatientRecords(patientId);
  };

  const onCreate = async (e) => {
    e.preventDefault();
    if (!patientId || !chiefComplaint.trim()) return;
    if (!profileData?.id) {
      alert("Doctor profile not loaded. Please refresh.");
      return;
    }

    const ok = await createPatientRecord({
      patientId: patientId.trim(),
      chiefComplaint: chiefComplaint.trim(),
      notes: notes.trim(),
    }, profileData.id);

    if (ok) {
      setChiefComplaint("");
      setNotes("");
      setMedicine("");
      setDosage("");
      setFrequency("");
      setDuration("");
      await getPatientRecords(patientId.trim());
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Patient Records</h1>

      <form onSubmit={onSearch} className="bg-white p-4 rounded-lg border mb-6 flex gap-2 items-end">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">Select Patient</p>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} - {p.phone}
              </option>
            ))}
          </select>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded">Load Records</button>
      </form>

      <form onSubmit={onCreate} className="bg-white p-4 rounded-lg border mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
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
          <p className="text-sm text-gray-600 mb-1">Chief Complaint</p>
          <input value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-600 mb-1">Notes</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[90px]" />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Medicine</p>
          <input value={medicine} onChange={(e) => setMedicine(e.target.value)} className="w-full border rounded px-3 py-2" />
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
          <button className="bg-primary text-white px-4 py-2 rounded">Create Record</button>
        </div>
      </form>

      <div className="space-y-3">
        {records.length === 0 ? (
          <p className="text-gray-500">No records loaded.</p>
        ) : (
          records.map((record) => (
            <div key={record.id} className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">{new Date(record.visitDate).toLocaleString()}</p>
              <p className="font-semibold text-gray-900 mt-1">{record.chiefComplaint}</p>
              {record.diagnosis && <p className="text-sm text-gray-600 mt-1">Diagnosis: {record.diagnosis}</p>}
              <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorRecords;
