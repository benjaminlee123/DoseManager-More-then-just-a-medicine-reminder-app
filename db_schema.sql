

-- Profile Table
CREATE TABLE IF NOT EXISTS ProfileTable (
  Profile_id INTEGER PRIMARY KEY, 
  Name TEXT, 
  DateOfBirth DATE
);

-- Medication table
CREATE TABLE IF NOT EXISTS MedicationTable (
  Medication_id INTEGER PRIMARY KEY,
  Profile_id INTEGER, 
  MedicationName TEXT,
  Description TEXT,
  Frequency TEXT,
  Dosage TEXT,
  FOREIGN KEY (Profile_id) REFERENCES ProfileTable (Profile_id)
);

-- Appointment table
CREATE TABLE IF NOT EXISTS AppointmentTable (
  Appointment_id INTEGER PRIMARY KEY,
  Profile_id INTEGER,
  AppointmentName TEXT,
  AppointmentDate DATE,
  DoctorName TEXT,
  AppointmentLocation TEXT,
  FOREIGN KEY (Profile_id) REFERENCES ProfileTable (Profile_id)
);
