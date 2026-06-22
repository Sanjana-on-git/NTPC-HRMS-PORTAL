import React, { useState } from "react";
import ntpcLogo from "../assets/ntpc-logo.png";
import blobImg from "../assets/blob.png";
import api from "../utils/api";
import { useEffect } from "react";
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

export default function HODDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  // const [files, setFiles] = useState([]);

  const navItems = [
    { id: "home", label: "Home", icon: Home },

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

  const [rows, setRows] = useState([]);
const handleDownload = (filePath) => {
  const fileName = filePath.split("\\").pop();

  const url = `http://localhost:5001/${filePath.replace(/\\/g, "/")}`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  const handleApprove = async (id) => {
  try {
    await api.post(
      `/depthead/review/${id}`,
      {
        action: "Approved",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchPending();
  } catch (err) {
    console.log(err);
  }
};

  const handleReject = async (id) => {
    try {
      await api.post(`/depthead/review/${id}`,
        {
          action: "Rejected",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchPending();
    } catch (err) {
      console.log(err);
    }
  };

  // const handleFileUpload = (e) => {
  //   const uploaded = Array.from(e.target.files || []);
  //   setFiles(uploaded);
  // };
  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const { data } =  await api.get("/depthead/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRows(data.pending);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="min-h-screen bg-[#e3ddd4] flex items-center justify-center p-8 font-sans">
      {/* Main White Container */}
      <div className="relative w-full max-w-5xl min-h-[580px] bg-white rounded-[17px] shadow-sm flex overflow-hidden">




        {/* Sidebar */}<div className="w-[255px] relative z-20 flex flex-col px-3 py-11 bg-white">

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
                    className={`${active
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
              type="button"
              onClick={() => {
                console.log("logout clicked");
                setShowLogoutModal(true);
              }}
              className="flex items-center gap-6 text-[15px] text-gray-500 text-left"
            >
              <LogOut size={22} strokeWidth={2.2} />
              <span>Log out</span>
            </button>
          </nav>

          {/* Bottom Blob */}
          {/* Bottom Left Shape */}
          <div className="absolute -bottom-15 -left-39 z-0 pointer-events-none">
            <img
              src={blobImg}
              alt="blob"
              className="w-[1400px] h-[180px] object-contain"
            />
          </div>
        </div>
        {/* Divider */}
        <div className="w-px bg-gray-200 my-8"></div>

        {/* Content */}
        <div className="flex-1 px-8 py-7 relative z-10">
          {/* TopBar */}
          <div className="flex justify-end items-center gap-4 mb-7 text-sm text-gray-500">
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar size={14} />
              04 April 2026
            </div>

            <div className="flex items-center gap-1 text-gray-500">
              <Clock size={14} />
              10:00 AM
            </div>

            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40?img=12"
                alt="avatar"
                className="w-7 h-7 rounded-full"
              />
              {user.DeptName} Department
              <ChevronDown size={14} />
            </div>
          </div>

          {/* HOME */}
          {activeTab === "home" && (
            <>
              <h2 className="text-2xl font-semibold text-center mb-4">
                HOD Dashboard
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
                    <th className="px-3 py-3 font-medium text-center">Approve</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.Id}
                      className={`border border-[#b9c5ff] ${idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
                        }`}
                    >
                      <td className="px-3 py-3">{row.Id}</td>
                      <td className="px-3 py-3">{row.Dept}</td>

                      <td className="px-3 py-3 text-[10px] text-gray-500 break-all">
                        {row.FileName}
                      </td>

                      <td className="px-3 py-3">
                        <button
  onClick={() => handleDownload(row.FilePath)}
  className="text-red-400 underline text-[11px] hover:text-red-500"
>
  Download
</button>
                      </td>

                      <td className="px-3 py-3">{row.Upload_dt}</td>

                      <td className="px-3 py-3">
                        {row.Approved_by || "-"}
                      </td>

                      <td className="px-3 py-3">
                        {row.Approved_dt || "-"}
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-medium ${row.Status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {row.Status || "Pending"}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        {row.Status !== "Approved" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleApprove(row.Id)}
                              className="w-7 h-7 rounded bg-green-500 flex items-center justify-center text-white hover:bg-green-600"
                            >
                              <Check size={14} />
                            </button>

                            <button
                              onClick={() => handleReject(row.Id)}
                              className="w-7 h-7 rounded bg-red-500 flex items-center justify-center text-white hover:bg-red-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-green-600 font-medium text-[11px]">
                            Done
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Empty rows */}
                  {Array.from({ length: 2 }).map((_, i) => (
                    <tr key={i} className="h-14 border border-[#b9c5ff]">
                      {Array.from({ length: 9 }).map((__, j) => (
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-8 w-[350px] text-center">
            <AlertTriangle size={40} className="mx-auto text-blue-500 mb-4" />

            <p className="mb-6">Are you sure you want to log out?</p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg"
              >
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