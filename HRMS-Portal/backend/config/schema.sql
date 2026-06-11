CREATE TABLE Departments (
  DeptID       INT IDENTITY(1,1) PRIMARY KEY,
  DeptName     NVARCHAR(100) NOT NULL,
  CreatedAt    DATETIME DEFAULT GETDATE()
);

CREATE TABLE Users (
  UserID       INT IDENTITY(1,1) PRIMARY KEY,
  EmployeeCode NVARCHAR(20)  NOT NULL UNIQUE,
  FullName     NVARCHAR(150) NOT NULL,
  Email        NVARCHAR(200) NOT NULL UNIQUE,
  Password     NVARCHAR(255) NOT NULL,
  Role         NVARCHAR(20)  NOT NULL CHECK (Role IN ('DGM','DeptHead','HR')),
  DeptID       INT REFERENCES Departments(DeptID),
  HodUserID    INT,
  IsActive     BIT DEFAULT 1,
  CreatedAt    DATETIME DEFAULT GETDATE(),
  UpdatedAt    DATETIME DEFAULT GETDATE()
);

ALTER TABLE Users ADD CONSTRAINT FK_Users_Hod FOREIGN KEY (HodUserID) REFERENCES Users(UserID);

CREATE TABLE AttendanceSheets (
  SheetID         INT IDENTITY(1,1) PRIMARY KEY,
  UploadedBy      INT NOT NULL REFERENCES Users(UserID),
  DeptID          INT NOT NULL REFERENCES Departments(DeptID),
  AttendanceMonth NVARCHAR(7) NOT NULL,
  FileName        NVARCHAR(255) NOT NULL,
  FilePath        NVARCHAR(500) NOT NULL,
  TotalRows       INT DEFAULT 0,
  Status          NVARCHAR(20) DEFAULT 'Pending' CHECK (Status IN ('Pending','Approved','Rejected')),
  Remarks         NVARCHAR(500),
  UploadedAt      DATETIME DEFAULT GETDATE(),
  ReviewedAt      DATETIME,
  ReviewedBy      INT REFERENCES Users(UserID)
);

CREATE TABLE AttendanceRecords (
  RecordID       INT IDENTITY(1,1) PRIMARY KEY,
  SheetID        INT NOT NULL REFERENCES AttendanceSheets(SheetID) ON DELETE CASCADE,
  UserID         INT REFERENCES Users(UserID),
  EmployeeCode   NVARCHAR(20),
  AttendanceDate DATE NOT NULL,
  Status         NVARCHAR(10) CHECK (Status IN ('P','A','HD','OT','L')),
  ShiftCode      NVARCHAR(20),
  OTHours        DECIMAL(4,2) DEFAULT 0,
  Remarks        NVARCHAR(255)
);

CREATE TABLE ApprovalLog (
  LogID      INT IDENTITY(1,1) PRIMARY KEY,
  SheetID    INT NOT NULL REFERENCES AttendanceSheets(SheetID),
  ActionBy   INT NOT NULL REFERENCES Users(UserID),
  Action     NVARCHAR(20) CHECK (Action IN ('Submitted','Approved','Rejected','Resubmitted')),
  Remarks    NVARCHAR(500),
  ActionAt   DATETIME DEFAULT GETDATE()
);

CREATE TABLE Notifications (
  NotifID   INT IDENTITY(1,1) PRIMARY KEY,
  UserID    INT NOT NULL REFERENCES Users(UserID),
  Message   NVARCHAR(500) NOT NULL,
  IsRead    BIT DEFAULT 0,
  CreatedAt DATETIME DEFAULT GETDATE()
);

INSERT INTO Departments (DeptName) VALUES
  ('Engineering'),('Human Resources'),('Finance'),('Operations'),('IT'),('Electrical');

INSERT INTO Users (EmployeeCode, FullName, Email, Password, Role, DeptID)
VALUES ('HR001', 'HR Admin', 'hr@company.com',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'HR', 2);

PRINT 'Schema created successfully.';
