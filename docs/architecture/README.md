# HR Shift Attendance Portal: System Architecture & Design

This document describes the design of the **HR Shift Attendance Portal** (NTPC Limited) using UML diagrams. The portal digitises the approval of shift attendance sheets: a **DGM** uploads the sheet, the respective **HOD** reviews and approves or rejects it, and **HR Personnel** download and process the approved sheets.

## Table of Contents

1. [Overview](#1-overview)
2. [Use Case Diagram](#2-use-case-diagram)
3. [Class Diagram](#3-class-diagram)
4. [Activity Diagram](#4-activity-diagram)
5. [Sequence Diagram](#5-sequence-diagram)
6. [State Diagram](#6-state-diagram)
7. [Alternate Versions](#7-alternate-versions)

---

## 1. Overview

### Actors

| Actor | Role in the system |
|-------|--------------------|
| **DGM** (Deputy General Manager) | Uploads attendance sheets, tracks their approval status, and views approved and rejected files along with rejection remarks. |
| **HOD** (Head of Department) | Receives and reviews attendance sheets, approves or rejects them, and adds remarks when rejecting. |
| **HR Personnel** | Views approved sheets, downloads and processes them, and maintains processed records. |

### Attendance sheet statuses

| Status | Meaning |
|--------|---------|
| Uploaded | The DGM has uploaded the attendance sheet. |
| Pending Review | The system has stored the file and forwarded it to the HOD; it awaits review. |
| Under Review | The HOD has opened the sheet and is reviewing it. |
| Approved | The HOD has approved the sheet. |
| Rejected | The HOD has rejected the sheet and entered remarks. |
| Forwarded to HR | The approved sheet has been sent to HR. |
| Processed | HR has downloaded and processed the attendance records. |

---

## 2. Use Case Diagram

![Use Case Diagram](images/01-use-case-diagram.png)

**Description:** The use case diagram shows what each actor can do inside the HR Shift Attendance Portal.

**DGM**
- Login, Change Password, Logout
- Upload Attendance Sheet
- View Upload History
- Track Approval Status
- View Approved Files
- View Rejected Files

**HOD**
- Login, Change Password, Logout
- View Received Attendance Sheets
- Review Attendance Sheet, which leads to Approve Attendance Sheet or Reject Attendance Sheet
- Add Remarks (required when rejecting a sheet)
- View Review History

**HR Personnel**
- Login, Logout
- View Approved Attendance Sheets
- Download Attendance Sheet
- View File History
- Maintain Processed Records

---

## 3. Class Diagram

![Class Diagram](images/02-class-diagram.png)

**Description:** The class diagram shows the main classes of the system, their attributes and methods, and how they relate.

| Class | Attributes | Key methods |
|-------|-----------|-------------|
| **User** (base class) | userID, name, email, password, role | login(), logout(), changePassword() |
| **DGM** (extends User) | | uploadAttendanceSheet(), viewUploadHistory(), trackStatus() |
| **HOD** (extends User) | | reviewAttendanceSheet(), approveAttendanceSheet(), rejectAttendanceSheet() |
| **HRPersonnel** (extends User) | | downloadAttendanceSheet(), viewFileHistory(), processAttendanceRecord() |
| **AttendanceSheet** | sheetID, fileName, uploadDate, status, filePath | uploadFile(), updateStatus(), viewDetails() |
| **ApprovalRecord** | approvalID, decision, remarks, reviewDate | saveDecision(), addRemarks() |

**Relationships**
- `DGM`, `HOD` and `HRPersonnel` inherit from `User`.
- Each `DGM`, `HOD` and `HRPersonnel` (1) is associated with zero or more `AttendanceSheet` objects (0..*).
- Each `AttendanceSheet` has one `ApprovalRecord` (1 to 1), which stores the HOD's decision and remarks.

---

## 4. Activity Diagram

![Activity Diagram](images/03-activity-diagram.png)

**Description:** A swimlane diagram of the attendance sheet approval workflow, with lanes for **DGM**, **System**, **HOD** and **HR**.

1. The DGM logs into the portal and uploads the attendance Excel sheet.
2. The system validates and stores the file, sets the status to **Pending Review**, and forwards the sheet to the respective HOD.
3. The HOD receives a notification and reviews the sheet, then decides whether to approve it.
4. **If approved:** the system updates the status to **Approved**. HR views the approved sheet, downloads it, and processes the attendance records. The system then updates the status to **Processed**.
5. **If rejected:** the HOD enters rejection remarks, the system updates the status to **Rejected**, and the DGM can view the rejection remarks and status.

---

## 5. Sequence Diagram

![Sequence Diagram](images/04-sequence-diagram.png)

**Description:** The sequence diagram shows the order of messages between the **DGM**, the **HR Shift Attendance Portal (System)**, the **Database**, the **HOD** and **HR Personnel**.

**Common flow (steps 1 to 9)**
1. DGM logs in to the portal.
2. DGM uploads the attendance Excel sheet.
3. System validates the uploaded file.
4. System stores the sheet in the database, and the database confirms storage (step 5).
6. System updates the status to "Pending Review".
7. System forwards the sheet to the respective HOD.
8. HOD views the received sheet.
9. HOD reviews the sheet.

**Alternative: Approved (steps 10 to 18)**
- 10. HOD approves the sheet.
- 11. System updates the status to "Approved".
- 12 to 13. System stores the approval record, and the database confirms.
- 14. System forwards the sheet to HR Personnel.
- 15 to 17. HR views, downloads and processes the attendance records.
- 18. System updates the status to "Processed".

**Alternative: Rejected (steps 10a to 14a)**
- 10a to 10b. HOD rejects the sheet and enters rejection remarks.
- 11a. System updates the status to "Rejected".
- 12a to 13a. System stores the remarks, and the database confirms.
- 14a. DGM views the rejection status and remarks.

---

## 6. State Diagram

![State Diagram](images/05-state-diagram.png)

**Description:** The state diagram shows the lifecycle of an **Attendance Sheet** object, from upload to its final state.

| From state | Event / method | To state |
|-----------|----------------|----------|
| Start | `uploadSheet()` | Uploaded |
| Uploaded | `assignToHOD()` | Pending Review |
| Pending Review | `reviewSheet()` | Under Review |
| Under Review | `reject()` | Rejected (end) |
| Under Review | `approve()` | Approved |
| Approved | `forwardToHR()` | Forwarded to HR |
| Forwarded to HR | `processAttendance()` | Processed (end) |

A sheet ends either as **Rejected** (the HOD provides remarks) or as **Processed** (HR has downloaded and processed it).

---

## 7. Alternate Versions

These are earlier draw.io versions of two of the diagrams above, kept for reference and for editing.

| Diagram | File |
|---------|------|
| Use Case Diagram (draw.io version) | [images/alternate-versions/01-use-case-diagram-drawio.png](images/alternate-versions/01-use-case-diagram-drawio.png) |
| Activity Diagram (dark theme, draw.io version) | [images/alternate-versions/03-activity-diagram-drawio-dark.png](images/alternate-versions/03-activity-diagram-drawio-dark.png) |
