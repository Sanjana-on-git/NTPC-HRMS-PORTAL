CREATE TABLE Departments (
  id INT PRIMARY KEY IDENTITY,
  name VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('Employee','DeptHead','DGM','HR')) NOT NULL,
  department_id INT FOREIGN KEY REFERENCES Departments(id),
  phone VARCHAR(20),
  joining_date DATE,
  is_active BIT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Attendance (
  id INT PRIMARY KEY IDENTITY,
  employee_id INT FOREIGN KEY REFERENCES Users(id),
  date DATE NOT NULL,
  check_in VARCHAR(10),
  check_out VARCHAR(10),
  status VARCHAR(20) CHECK (status IN ('Present','Absent','Late','Half Day','Holiday')),
  UNIQUE(employee_id, date)
);

CREATE TABLE Shifts (
  id INT PRIMARY KEY IDENTITY,
  employee_id INT FOREIGN KEY REFERENCES Users(id),
  date DATE NOT NULL,
  shift_type VARCHAR(50),
  start_time VARCHAR(10),
  end_time VARCHAR(10)
);

CREATE TABLE LeaveRequests (
  id INT PRIMARY KEY IDENTITY,
  employee_id INT FOREIGN KEY REFERENCES Users(id),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  leave_type VARCHAR(50),
  reason VARCHAR(500),
  status VARCHAR(20) DEFAULT 'Pending',
  remarks VARCHAR(500),
  reviewed_by INT FOREIGN KEY REFERENCES Users(id),
  reviewed_at DATETIME,
  created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE UploadHistory (
  id INT PRIMARY KEY IDENTITY,
  uploaded_by INT FOREIGN KEY REFERENCES Users(id),
  filename VARCHAR(255),
  record_count INT,
  uploaded_at DATETIME DEFAULT GETDATE()
);
