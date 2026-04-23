---REPORT (Views)---

-- All courses that have 50 or more students 
CREATE VIEW courses_50_plus AS
SELECT course_code, COUNT(student_id) AS total_students
FROM Enrollments
GROUP BY course_code
HAVING COUNT(student_id) >= 50;

-- All students that do 5 or more courses. 
CREATE VIEW students_5_courses AS
SELECT student_id, COUNT(course_code) AS total_courses
FROM Enrollments
GROUP BY student_id
HAVING COUNT(course_code) >= 5;

-- All lecturers that teach 3 or more courses. 
CREATE VIEW lecturers_3_courses AS
SELECT assigned_lecturer, COUNT(course_code) AS total_courses
FROM Courses
GROUP BY assigned_lecturer
HAVING COUNT(course_code) >= 3;

-- The 10 most enrolled courses. 
CREATE VIEW top_10_courses AS
SELECT course_code, COUNT(student_id) AS total_students
FROM Enrollments
GROUP BY course_code
ORDER BY total_students DESC
LIMIT 10;

-- The top 10 students with the highest overall averages. 
CREATE VIEW top_10_students AS
SELECT e.student_id, AVG(g.grade) AS avg_grade
FROM Submissions s
JOIN Grades g ON s.submission_id = g.submission_id
JOIN Enrollments e ON s.student_id = e.student_id
GROUP BY e.student_id
ORDER BY avg_grade DESC
LIMIT 10;