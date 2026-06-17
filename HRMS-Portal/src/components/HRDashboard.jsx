import React, { useState } from "react";
import ntpcLogo from "../assets/ntpc-logo.png";
import {
  Home,
  Upload,
  ClipboardCheck,
  Lock,
  LogOut,
  Calendar,
  Clock,
  ChevronDown,
  Download,
  Check,
  X,
  Plus,
  AlertTriangle,
} from "lucide-react";

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [files, setFiles] = useState([]);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "upload", label: "Upload Attendance", icon: Upload },
    { id: "approve", label: "Approve Attendance", icon: ClipboardCheck },
    { id: "password", label: "Change Password", icon: Lock },
  ];

  const departments = [
    { name: "O&M - C&I (Boiler)", color: "bg-blue-100 text-blue-700" },
    { name: "Operations-Group I, II, III", color: "bg-pink-100 text-pink-700" },
    { name: "O&M", color: "bg-orange-100 text-orange-700" },
    { name: "C&I (Offsite)", color: "bg-green-100 text-green-700" },
    { name: "C&I (Turbine)", color: "bg-purple-100 text-purple-700" },
    { name: "C&I (Lab-MM)", color: "bg-red-100 text-red-700" },
    { name: "EMD", color: "bg-lime-100 text-lime-700" },
    { name: "MM-Boiler-Mill Maint", color: "bg-pink-100 text-pink-700" },
    { name: "EM-CHP", color: "bg-yellow-100 text-yellow-700" },
    { name: "O&M-FM", color: "bg-purple-100 text-purple-700" },
    { name: "MM-Boiler-Fans", color: "bg-orange-100 text-orange-700" },
    { name: "MM-Boiler-Pressure Parts", color: "bg-blue-100 text-blue-700" },
  ];

  const approvalRows = [
    {
      id: "000111",
      dept: "Electrical",
      file: "Electrical_06/26.xlsx",
      uploaded: "11/06/2026",
      approvedBy: "000931",
      approvedOn: "11/06/2026",
      status: "Approved",
    },
    {
      id: "000112",
      dept: "Civil",
      file: "Civil_06/26.xlsx",
      uploaded: "12/06/2026",
      approvedBy: "000932",
      approvedOn: "12/06/2026",
      status: "Approved",
    },
    {
      id: "000113",
      dept: "Mechanical",
      file: "Mechanical_06/26.xlsx",
      uploaded: "13/06/2026",
      approvedBy: "000933",
      approvedOn: "13/06/2026",
      status: "Approved",
    },
    {
      id: "000114",
      dept: "IT",
      file: "IT_06/26.xlsx",
      uploaded: "13/06/2026",
      approvedBy: "000934",
      approvedOn: "13/06/2026",
      status: "Approved",
    },
    {
      id: "000115",
      dept: "CLI",
      file: "CLI_06/26.xlsx",
      uploaded: "14/06/2026",
      approvedBy: "000935",
      approvedOn: "14/06/2026",
      status: "Approved",
    },
  ];

  const [rows, setRows] = useState(approvalRows);

  const handleApprove = (id) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
  };

  const handleReject = (id) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
  };

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files || []);
    setFiles(uploaded);
  };

  return (
    <div className="min-h-screen bg-[#e3ddd4] flex items-center justify-center p-8 font-sans">
      {/* Main White Container */}
      <div className="relative w-full max-w-5xl min-h-[580px] bg-white rounded-[17px] overflow-hidden shadow-sm flex">

        {/* Bottom Left Shape */}
        <div className="absolute bottom-0 left-0 z-0">
          <svg width="180" height="150" viewBox="0 0 180 150" fill="none">
            <path
              d="M0 0V150H180C140 150 120 120 75 120C25 120 0 90 0 55V0Z"
              fill="#BDEBF3"
            />
          </svg>
        </div>

       
        {/* Sidebar */}
<div className="w-[255px] relative z-10 flex flex-col px-3 py-11 bg-white">

  {/* Logo Section */}
  <div className="flex items-center gap-3 mb-16 pl-6">
    <img
  src={ntpcLogo}
  alt="NTPC Logo"
  className="w-12 h-8 object-contain"
/>

    <div className="leading-tight">
      <h2 className="text-[15px] font-bold text-[#0A84D0] uppercase tracking-tight">
        NTPC SIMHADRI
      </h2>

      <p className="text-[10px] italic text-gray-500 font-medium">
        Attendance Management System
      </p>
    </div>
  </div>

  {/* Navigation */}
  <nav className="flex flex-col gap-10 pl-8">
    {navItems.map((item) => {
      const Icon = item.icon;
      const active = activeTab === item.id;

      return (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className="
            flex
            items-center
            gap-6
            text-[15px]
            transition
            duration-200
            text-left
          "
        >
          <Icon
            size={22}
            className={active ? "text-black" : "text-gray-500"}
            strokeWidth={active ? 2.7 : 2.2}
          />

          <span
            className={`${
              active
                ? "text-black font-medium"
                : "text-gray-500 font-normal"
            }`}
          >
            {item.label}
          </span>
        </button>
      );
    })}

    {/* Logout */}
    <button
      onClick={() => setShowLogoutModal(true)}
      className="flex items-center gap-6 text-[15px] text-gray-500 text-left"
    >
      <LogOut size={22} strokeWidth={2.2} />
      <span>Log out</span>
    </button>
  </nav>

  {/* Bottom Blob */}
  <div className="absolute bottom-0 left-0">
    <svg width="190" height="180" viewBox="0 0 190 180" fill="none">
      <path
        d="M0 0V180H190C145 180 122 145 82 145C35 145 0 112 0 65V0Z"
        fill="#BDEBF3"
      />
    </svg>
  </div>
</div>
        {/* Divider */}
        <div className="w-px bg-gray-200 my-8"></div>

        {/* Content */}
        <div className="flex-1 px-8 py-7 relative z-10">
          {/* TopBar */}
          <div className="flex justify-end items-center gap-4 mb-7 text-sm text-gray-500">
            <div className="flex items-center gap-1 text-blue-500">
              <Calendar size={14} />
              04 April 2026
            </div>

            <div className="flex items-center gap-1 text-blue-500">
              <Clock size={14} />
              10:00 AM
            </div>

            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40?img=12"
                alt="avatar"
                className="w-7 h-7 rounded-full"
              />
              HR Admin
              <ChevronDown size={14} />
            </div>
          </div>

          {/* HOME */}
          {activeTab === "home" && (
            <>
              <h2 className="text-2xl font-semibold text-center mb-4">
                HR Department
              </h2>

              <div className="w-[380px] h-px bg-gray-200 mx-auto mb-12"></div>

              <div className="grid grid-cols-2 gap-4 mb-7">
                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-medium text-sm mb-4">
                    Sending Attendance of Employees working in Shifts
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {departments.map((d, i) => (
                      <span
                        key={i}
                        className={`text-xs px-3 py-1 rounded-full ${d.color}`}
                      >
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>

               <div className="border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <ClipboardCheck size={26} className="text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-600">
                    The Format is to be downloaded and uploaded with the file name as{" "}
                    <span className="text-blue-600 font-medium">Dept_monthyear</span>. For Example if you
                    are uploading file for Operation Group-I dept for the month of March 2017, the file
                    name should be{" "}
                    <span className="text-blue-600 font-medium">OperationGroup1_032017</span>.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg text-sm">
                  Download Attendance Format
                  <Download size={15} />
                </button>
              </div>
            </>
          )}

          {/* Upload */}
{activeTab === "upload" && (
  <>
    {/* Upload Card */}
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4 max-w-[600px] mx-auto">
      <h2 className="flex items-center gap-2 font-semibold text-lg text-gray-800 mb-4">
        <Plus size={16} className="text-blue-500" />
        Upload Excel Attendance
      </h2>

      <label
        className="
          block
          border-2
          border-dashed
          border-gray-300
          rounded-xl
          py-8
          px-5
          text-center
          cursor-pointer
          transition-all
          duration-300
          hover:border-blue-500
        "
      >
        <input
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Upload Icon */}
        <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
          <Upload size={22} className="text-white" />
        </div>

        <p className="font-medium text-gray-700 text-base mb-1">
          Drop files here or click to browse
        </p>

        <p className="text-xs text-gray-400 mb-3">
          Excel (.xlsx) files are supported here
        </p>

        <span className="inline-block border border-gray-300 rounded-md px-4 py-1.5 text-xs text-gray-600 bg-white hover:bg-gray-50 transition">
          Choose Files
        </span>

        {files.length > 0 && (
          <p className="text-xs text-gray-500 mt-3">
            {files.map((f) => f.name).join(", ")}
          </p>
        )}
      </label>

      {/* Buttons */}
      <div className="flex justify-center gap-3 mt-4">
        <button className="bg-blue-500 text-white px-5 py-2 rounded-lg text-xs font-medium hover:bg-blue-600">
          Upload Document
        </button>

        <button className="border border-gray-300 px-5 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
          Save as a draft
        </button>
      </div>
    </div>

    {/* Remarks */}
    <div className="border border-gray-300 rounded-lg h-20 px-4 py-3 text-gray-400 text-sm max-w-[600px] mx-auto">
      Remarks
    </div>
  </>
)}

          {/* Approve */}
          {activeTab === "approve" && (
  <div className="bg-white rounded-2xl p-4 overflow-x-auto">
    <table className="w-full text-xs border border-[#b9c5ff]">
      <thead>
        <tr className="bg-[#0A84D0] text-white text-left">
          <th className="px-3 py-3 font-medium">Dept. Id</th>
          <th className="px-3 py-3 font-medium">Dept. Name</th>
          <th className="px-3 py-3 font-medium">File Name</th>
          <th className="px-3 py-3 font-medium">File Path</th>
          <th className="px-3 py-3 font-medium">Uploaded On</th>
          <th className="px-3 py-3 font-medium">Approved By</th>
          <th className="px-3 py-3 font-medium">Approved On</th>
          <th className="px-3 py-3 font-medium">Status</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((row, idx) => (
          <tr
            key={row.id}
            className={`border border-[#b9c5ff] ${
              idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
            }`}
          >
            <td className="px-3 py-3">{row.id}</td>
            <td className="px-3 py-3">{row.dept}</td>
            <td className="px-3 py-3 text-[10px] text-gray-500 break-all">
              {row.file}
            </td>

            {/* Download */}
            <td className="px-3 py-3">
              <button className="text-red-400 underline text-[11px] hover:text-red-500">
                Download
              </button>
            </td>

            <td className="px-3 py-3">{row.uploaded}</td>
            <td className="px-3 py-3">{row.approvedBy}</td>
            <td className="px-3 py-3">{row.approvedOn}</td>

            {/* Status only */}
            <td className="px-3 py-3">
              <span
                className={`px-2 py-1 rounded text-[10px] font-medium ${
                  row.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : row.status === "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {row.status}
              </span>
            </td>
          </tr>
        ))}

        {/* Empty rows like screenshot */}
        {Array.from({ length: 2 }).map((_, i) => (
          <tr key={i} className="h-14 border border-[#b9c5ff]">
            {Array.from({ length: 8 }).map((__, j) => (
              <td key={j}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

          {/* Password */}
         {activeTab === "password" && (
  <div className="w-full max-w-[420px] ml-4 mt-6">
    {/* Title */}
    <h2 className="text-[30px] font-medium text-gray-900 mb-4">
      Change Password
    </h2>

    {/* Divider */}
    <div className="w-[400px] h-px bg-gray-300 mb-6"></div>

    {/* Inputs */}
    <div className="flex flex-col gap-3">
      <input
        type="password"
        placeholder="Old Password"
        className="
          w-[300px]
          border
          border-gray-300
          rounded-md
          px-4
          py-2.5
          text-sm
          outline-none
          focus:border-blue-500
        "
      />

      <input
        type="password"
        placeholder="New Password"
        className="
          w-[300px]
          border
          border-gray-300
          rounded-md
          px-4
          py-2.5
          text-sm
          outline-none
          focus:border-blue-500
        "
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="
          w-[300px]
          border
          border-gray-300
          rounded-md
          px-4
          py-2.5
          text-sm
          outline-none
          focus:border-blue-500
        "
      />

      {/* Button */}
      <button
        className="
          w-[300px]
          bg-blue-500
          text-white
          py-2.5
          rounded-md
          text-sm
          font-medium
          mt-1
          hover:bg-blue-600
          transition
        "
      >
        Change Password
      </button>
    </div>
  </div>
)}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[350px] text-center">
            <AlertTriangle size={40} className="mx-auto text-blue-500 mb-4" />

            <p className="mb-6">Are you sure you want to log out?</p>

            <div className="flex gap-3">
              <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg">
                Log Out
              </button>

              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-blue-500 text-blue-500 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}