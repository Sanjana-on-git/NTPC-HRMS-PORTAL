import React, { useState } from "react";
import { Home, Clock, Calendar as CalendarIcon, Users, UserCheck, UserX, ChevronDown, ChevronRight, Download, Upload, ClipboardCheck, Lock, LogOut, Plus, Check, X, AlertTriangle } from "lucide-react";

export default function HODDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [files, setFiles] = useState([]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "upload", label: "Upload Attendance", icon: Upload },
    { id: "approve", label: "Approve Attendance", icon: ClipboardCheck },
    { id: "shift", label: "Shift Management", icon: CalendarIcon },
    { id: "password", label: "Change Password", icon: Lock },
  ];

  const shifts = [
    { name: "Shift-A", time: "(06:00 AM - 12:00 PM)", icon: "☀️", total: 412, present: 338, absent: 73, bg: "bg-blue-50" },
    { name: "Shift-B", time: "(12:00 PM - 15:00 PM)", icon: "🌤️", total: 412, present: 338, absent: 73, bg: "bg-orange-50" },
    { name: "Shift-C", time: "(15:00 PM - 20:00 PM)", icon: "🌙", total: 412, present: 338, absent: 73, bg: "bg-indigo-50" },
  ];

  const approvalRows = [
    { id: "000111", dept: "Electrical", file: "Electrical_06/26.xlsx", uploaded: "11/06/2026", approvedBy: "000931", approvedOn: "11/06/2026", status: "pending" },
    { id: "000112", dept: "Civil", file: "Civil_06/26.xlsx", uploaded: "12/06/2026", approvedBy: "000932", approvedOn: "12/06/2026", status: "pending" },
    { id: "000113", dept: "Mechanical", file: "Mechanical_06/26.xlsx", uploaded: "13/06/2026", approvedBy: "000933", approvedOn: "13/06/2026", status: "pending" },
    { id: "000114", dept: "IT", file: "IT_06/26.xlsx", uploaded: "13/06/2026", approvedBy: "000934", approvedOn: "13/06/2026", status: "pending" },
    { id: "000115", dept: "CLI", file: "CLI_06/26.xlsx", uploaded: "14/06/2026", approvedBy: "000935", approvedOn: "14/06/2026", status: "pending" },
  ];

  const [rows, setRows] = useState(approvalRows);

  const handleApprove = (id) => setRows(rows.map(r => r.id === id ? { ...r, status: "approved" } : r));
  const handleReject = (id) => setRows(rows.map(r => r.id === id ? { ...r, status: "rejected" } : r));
  const handleFileUpload = (e) => setFiles(Array.from(e.target.files || []));

  const Sidebar = () => (
    <div className="w-64 bg-white rounded-l-3xl flex flex-col py-6 px-4 relative overflow-hidden h-full">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center text-white text-[8px] font-bold leading-tight text-center">
          NTPC
        </div>
        <div>
          <div className="font-bold text-blue-700 text-sm leading-tight">NTPC SIMHADRI</div>
          <div className="text-[10px] text-gray-400 leading-tight">Attendance Management System</div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-2 mb-6">
        <img src="https://i.pravatar.cc/40?img=47" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <div className="font-semibold text-sm text-gray-800">Sanjana Chatterjee</div>
          <div className="text-xs text-gray-400">HOD</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-left ${
                active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 text-left mt-2"
        >
          <LogOut size={18} />
          Log out
        </button>
      </nav>

      <div className="absolute bottom-0 left-0">
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          <path d="M0 160 C 0 100, 60 160, 160 160 L 0 160 Z" fill="#cdeef0" opacity="0.7" />
        </svg>
      </div>
    </div>
  );

  const TopBar = () => (
    <div className="flex justify-end items-center gap-4 mb-6 text-sm text-gray-500">
      <div className="flex items-center gap-1.5">
        <CalendarIcon size={15} />
        04 April 2026
      </div>
      <div className="w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-1.5">
        <Clock size={15} />
        10:00 AM
      </div>
      <div className="w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-2">
        <img src="https://i.pravatar.cc/40?img=47" alt="avatar" className="w-7 h-7 rounded-full object-cover" />
        <span className="text-gray-600">HR Admin</span>
        <ChevronDown size={14} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0ece4] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-6xl bg-[#f0ece4] rounded-3xl flex overflow-hidden shadow-sm" style={{ minHeight: "640px" }}>
        <Sidebar />

        <div className="flex-1 bg-[#f0ece4] p-8 rounded-r-3xl">
          <TopBar />

          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users size={22} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Total Employees</div>
                    <div className="text-2xl font-bold text-gray-800">2,180</div>
                    <div className="text-[11px] text-gray-400">Across all departments</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <UserCheck size={22} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Total Present</div>
                    <div className="text-2xl font-bold text-gray-800">1,180</div>
                    <div className="text-[11px] text-gray-400">Across all shifts</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <UserX size={22} className="text-red-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Total Absent</div>
                    <div className="text-2xl font-bold text-gray-800">1000</div>
                    <div className="text-[11px] text-gray-400">Across all shifts</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Shift-wise Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  {shifts.map((shift) => (
                    <div key={shift.name} className={`${shift.bg} rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span>{shift.icon}</span>
                        <span className="font-semibold text-gray-800 text-sm">{shift.name}</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-3">{shift.time}</div>
                      <div className="flex justify-between text-sm">
                        <div>
                          <div className="font-bold text-gray-800">{shift.total}</div>
                          <div className="text-[11px] text-gray-400">Total</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-600">{shift.present}</div>
                          <div className="text-[11px] text-gray-400">Present</div>
                        </div>
                        <div>
                          <div className="font-bold text-red-500">{shift.absent}</div>
                          <div className="text-[11px] text-gray-400">Absent</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      "Download Attendance (15/06/2026)",
                      "Download Attendance (Monthly)",
                      "Download 2FA Report",
                    ].map((label, i) => (
                      <button key={i} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                        <span className="flex items-center gap-2">
                          <Download size={15} className="text-green-500" />
                          {label}
                        </span>
                        <ChevronRight size={16} className="text-gray-300" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4">Attendance Overview</h3>
                  <div className="text-xs text-gray-400 mb-4">(08/06/2026)</div>
                  <div className="flex items-center gap-8 justify-center">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#fde2e2" strokeWidth="14" />
                        <circle
                          cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="14"
                          strokeDasharray={`${(1180 / 2180) * 251.2} 251.2`} strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-800">2,180</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                        <div>
                          <div className="font-semibold text-gray-800">Present</div>
                          <div className="text-xs text-gray-400">1,180 (54.0%)</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-300 inline-block" />
                        <div>
                          <div className="font-semibold text-gray-800">Absent</div>
                          <div className="text-xs text-gray-400">1,000 (46.0%)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-center text-gray-400 text-sm" style={{ minHeight: "400px" }}>
              Attendance records and history will appear here.
            </div>
          )}

          {activeTab === "upload" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-6">
                <Plus size={18} className="text-gray-400" /> Upload Excel Attendance
              </h2>
              <label className="block border-2 border-dashed border-gray-200 rounded-xl py-12 text-center cursor-pointer hover:border-blue-300 transition-colors">
                <input type="file" accept=".xlsx" className="hidden" onChange={handleFileUpload} />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <Upload size={20} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-700">Drop files here or click to browse</p>
                  <p className="text-xs text-gray-400">Excel (.xlsx) files are supported here</p>
                  <span className="border border-gray-300 rounded-md px-4 py-1.5 text-sm text-gray-600 mt-1">
                    Choose Files
                  </span>
                  {files.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">{files.map(f => f.name).join(", ")}</p>
                  )}
                </div>
              </label>
              <div className="flex gap-3 mt-6">
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Upload Document
                </button>
                <button className="border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Save as a draft
                </button>
              </div>
              <div className="mt-6 border border-gray-200 rounded-xl p-4 h-28 text-sm text-gray-300">
                Remarks
              </div>
            </div>
          )}

          {activeTab === "approve" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-600 text-white text-left">
                    <th className="px-4 py-3 font-medium">Dept. Id</th>
                    <th className="px-4 py-3 font-medium">Dept. Name</th>
                    <th className="px-4 py-3 font-medium">File Name</th>
                    <th className="px-4 py-3 font-medium">Download file</th>
                    <th className="px-4 py-3 font-medium">Uploaded On</th>
                    <th className="px-4 py-3 font-medium">Approved By</th>
                    <th className="px-4 py-3 font-medium">Approved On</th>
                    <th className="px-4 py-3 font-medium">Approve/Reject</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 border-t border-gray-100">{row.id}</td>
                      <td className="px-4 py-3 border-t border-gray-100">{row.dept}</td>
                      <td className="px-4 py-3 border-t border-gray-100 text-gray-500">{row.file}</td>
                      <td className="px-4 py-3 border-t border-gray-100">
                        <a href="#" className="text-red-500 underline">Download</a>
                      </td>
                      <td className="px-4 py-3 border-t border-gray-100">{row.uploaded}</td>
                      <td className="px-4 py-3 border-t border-gray-100">{row.approvedBy}</td>
                      <td className="px-4 py-3 border-t border-gray-100">{row.approvedOn}</td>
                      <td className="px-4 py-3 border-t border-gray-100">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(row.id)}
                            className={`w-7 h-7 rounded-md flex items-center justify-center text-white ${
                              row.status === "approved" ? "bg-green-600" : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleReject(row.id)}
                            className={`w-7 h-7 rounded-md flex items-center justify-center text-white ${
                              row.status === "rejected" ? "bg-red-600" : "bg-red-500 hover:bg-red-600"
                            }`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <tr key={`empty-${i}`}>
                      {Array.from({ length: 8 }).map((__, j) => (
                        <td key={j} className="px-4 py-3 border-t border-gray-100 h-10"></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "shift" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-center text-gray-400 text-sm" style={{ minHeight: "400px" }}>
              Shift Management settings will appear here.
            </div>
          )}

          {activeTab === "password" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
              <div className="h-px bg-gray-200 mb-6" />
              <div className="flex flex-col gap-4 max-w-md">
                <input type="password" placeholder="Old Password" className="border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <input type="password" placeholder="New Password" className="border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <input type="password" placeholder="Confirm Password" className="border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 mt-2">
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={48} className="text-blue-500" strokeWidth={1.5} />
            </div>
            <p className="text-gray-700 font-medium mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex-1"
              >
                Log Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 flex-1"
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