CREATE DATABASE IF NOT EXISTS university;
USE university;

CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'lecturer', 'sysadmin') NOT NULL,
    INDEX idx_user_type (user_type),
    INDEX idx_name (last_name, first_name)
);

CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

CREATE TABLE Lecturers (
    lecturer_id INT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

CREATE TABLE SysAdmins (
    admin_id INT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

CREATE TABLE Courses (
    course_code VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    assigned_lecturer INT NOT NULL,
    FOREIGN KEY (assigned_lecturer) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE,
    INDEX idx_title (title),
    INDEX idx_assigned_lecturer (assigned_lecturer)
);

CREATE TABLE Enrollments (
    enroll_id INT PRIMARY KEY,
    student_id INT NOT NULL,
    course_code VARCHAR(10) NOT NULL,
    final_grade DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_code) REFERENCES Courses(course_code) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_course_code (course_code),
    INDEX idx_grade (final_grade)
);

CREATE TABLE Course_Sections (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_code) REFERENCES Courses(course_code) ON DELETE CASCADE,
    INDEX idx_course_code (course_code)
);

CREATE TABLE Course_Content (
    content_id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    title VARCHAR(255),
    content_type ENUM('link', 'file', 'slide') NOT NULL,
    content_url TEXT,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES Course_Sections(section_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE,
    INDEX idx_section_id (section_id)
);

CREATE TABLE Assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    created_by INT NOT NULL,
    FOREIGN KEY (course_code) REFERENCES Courses(course_code) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE
);

CREATE TABLE Submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    file_url TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (assignment_id, student_id), 
    FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);

CREATE TABLE Grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    grade DECIMAL(5,2),
    graded_by INT NOT NULL,
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES Submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES Lecturers(lecturer_id)
);

CREATE TABLE Calendar_Events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_code) REFERENCES Courses(course_code) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_course_code (course_code),
    INDEX idx_event_date (event_date),
    INDEX idx_created_by (created_by)
);

CREATE TABLE Forums (
    forum_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_code) REFERENCES Courses(course_code) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_course_code (course_code),
    INDEX idx_created_by (created_by)
);

CREATE TABLE Discussion_Threads (
    thread_id INT AUTO_INCREMENT PRIMARY KEY,
    forum_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id) REFERENCES Forums(forum_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_forum_id (forum_id),
    INDEX idx_user_id (user_id)
);

CREATE TABLE Thread_Replies (
    reply_id INT AUTO_INCREMENT PRIMARY KEY,
    thread_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_reply_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES Discussion_Threads(thread_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_reply_id) REFERENCES Thread_Replies(reply_id) ON DELETE CASCADE,
    INDEX idx_thread_id (thread_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_reply_id (parent_reply_id)
);