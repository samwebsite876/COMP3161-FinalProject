from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="$e@Rch876",
        database="university",
        auth_plugin='mysql_native_password'
    )


@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    user_id = data.get('user_id')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    user_type = data.get('user_type')

    if not all([user_id, first_name, last_name, email, username, password, user_type]):
        return jsonify({"error": "All fields are required"}), 400

    if user_type not in ['student', 'lecturer', 'sysadmin']:
        return jsonify({"error": "Invalid user_type"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        user_query = """
            INSERT INTO Users (user_id, first_name, last_name, email, username, password, user_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(user_query, (user_id, first_name, last_name, email, username, password, user_type))

        if user_type == 'student':
            role_query = "INSERT INTO Students (student_id, user_id) VALUES (%s, %s)"
            cursor.execute(role_query, (user_id, user_id))

        elif user_type == 'lecturer':
            role_query = "INSERT INTO Lecturers (lecturer_id, user_id) VALUES (%s, %s)"
            cursor.execute(role_query, (user_id, user_id))

        elif user_type == 'sysadmin':
            role_query = "INSERT INTO SysAdmins (admin_id, user_id) VALUES (%s, %s)"
            cursor.execute(role_query, (user_id, user_id))

        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201

    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "username and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT user_id, first_name, last_name, email, username, user_type, password
            FROM Users
            WHERE username = %s
        """
        cursor.execute(query, (username,))
        user = cursor.fetchone()

        if not user or user['password'] != password:
            return jsonify({"error": "Invalid credentials"}), 401

        return jsonify({
            "message": "Login successful",
            "user": {
                "user_id": user["user_id"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "email": user["email"],
                "username": user["username"],
                "user_type": user["user_type"]
            }
        }), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/courses', methods=['POST'])
def create_course():
    data = request.get_json()

    created_by = data.get('created_by')
    course_code = data.get('course_code')
    title = data.get('title')
    assigned_lecturer = data.get('assigned_lecturer')

    if not all([created_by, course_code, title, assigned_lecturer]):
        return jsonify({"error": "created_by, course_code, title and assigned_lecturer are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        admin_query = """
            SELECT sa.admin_id, u.user_type
            FROM SysAdmins sa
            JOIN Users u ON sa.user_id = u.user_id
            WHERE sa.admin_id = %s
        """
        cursor.execute(admin_query, (created_by,))
        admin = cursor.fetchone()

        if not admin:
            return jsonify({"error": "Only sysadmins can create courses"}), 403

        lecturer_query = """
            SELECT l.lecturer_id
            FROM Lecturers l
            WHERE l.lecturer_id = %s
        """
        cursor.execute(lecturer_query, (assigned_lecturer,))
        lecturer = cursor.fetchone()

        if not lecturer:
            return jsonify({"error": "Assigned lecturer must exist"}), 400

        insert_query = """
            INSERT INTO Courses (course_code, title, assigned_lecturer)
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (course_code, title, assigned_lecturer))
        conn.commit()

        return jsonify({"message": "Course created successfully"}), 201

    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/courses', methods=['GET'])
def get_all_courses():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT c.course_code, c.title, c.assigned_lecturer,
                   u.first_name, u.last_name
            FROM Courses c
            JOIN Lecturers l ON c.assigned_lecturer = l.lecturer_id
            JOIN Users u ON l.user_id = u.user_id
            ORDER BY c.course_code
        """
        cursor.execute(query)
        courses = cursor.fetchall()

        return jsonify(courses), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/courses/student/<int:student_id>', methods=['GET'])
def get_student_courses(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        student_check = "SELECT student_id FROM Students WHERE student_id = %s"
        cursor.execute(student_check, (student_id,))
        student = cursor.fetchone()

        if not student:
            return jsonify({"error": "Student not found"}), 404

        query = """
            SELECT c.course_code, c.title, c.assigned_lecturer
            FROM Enrollments e
            JOIN Courses c ON e.course_code = c.course_code
            WHERE e.student_id = %s
            ORDER BY c.course_code
        """
        cursor.execute(query, (student_id,))
        courses = cursor.fetchall()

        return jsonify(courses), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/courses/lecturer/<int:lecturer_id>', methods=['GET'])
def get_lecturer_courses(lecturer_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        lecturer_check = "SELECT lecturer_id FROM Lecturers WHERE lecturer_id = %s"
        cursor.execute(lecturer_check, (lecturer_id,))
        lecturer = cursor.fetchone()

        if not lecturer:
            return jsonify({"error": "Lecturer not found"}), 404

        query = """
            SELECT course_code, title, assigned_lecturer
            FROM Courses
            WHERE assigned_lecturer = %s
            ORDER BY course_code
        """
        cursor.execute(query, (lecturer_id,))
        courses = cursor.fetchall()

        return jsonify(courses), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/courses/<course_code>/register', methods=['POST'])
def register_for_course(course_code):
    data = request.get_json()

    student_id = data.get('student_id')

    if not student_id:
        return jsonify({"error": "student_id is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        student_check = "SELECT student_id FROM Students WHERE student_id = %s"
        cursor.execute(student_check, (student_id,))
        student = cursor.fetchone()

        if not student:
            return jsonify({"error": "Only students can register for a course"}), 403

        course_check = "SELECT course_code FROM Courses WHERE course_code = %s"
        cursor.execute(course_check, (course_code,))
        course = cursor.fetchone()

        if not course:
            return jsonify({"error": "Course not found"}), 404

        duplicate_check = """
            SELECT enroll_id
            FROM Enrollments
            WHERE student_id = %s AND course_code = %s
        """
        cursor.execute(duplicate_check, (student_id, course_code))
        existing = cursor.fetchone()

        if existing:
            return jsonify({"error": "Student already registered for this course"}), 400

        count_check = "SELECT COUNT(*) AS total FROM Enrollments WHERE student_id = %s"
        cursor.execute(count_check, (student_id,))
        course_count = cursor.fetchone()

        if course_count["total"] >= 6:
            return jsonify({"error": "Student cannot register for more than 6 courses"}), 400

        next_id_query = "SELECT COALESCE(MAX(enroll_id), 0) + 1 AS next_id FROM Enrollments"
        cursor.execute(next_id_query)
        next_id = cursor.fetchone()["next_id"]

        insert_query = """
            INSERT INTO Enrollments (enroll_id, student_id, course_code, final_grade)
            VALUES (%s, %s, %s, NULL)
        """
        cursor.execute(insert_query, (next_id, student_id, course_code))
        conn.commit()

        return jsonify({"message": "Student registered for course successfully"}), 201

    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()





@app.route('/courses/<course_code>/sections', methods=['POST'])
def add_section(course_code):
    data = request.get_json()

    if not data:
        return jsonify({"error": "ERROR! A Request body is required"}), 400

    title = data.get('title')

    if not title or title.strip() == "":
        return jsonify({"error": "ERROR! A Section title is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:

        course_check = "SELECT course_code FROM Courses WHERE course_code = %s"
        cursor.execute(course_check, (course_code,))
        course = cursor.fetchone()

        if not course:
            return jsonify({"error": "Unable to find course"}), 404

        insert_query = """
            INSERT INTO Course_Sections (course_code, title)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (course_code, title))
        conn.commit()

        return jsonify({"message": "Section added successfully"}), 201

    except mysql.connector.Error as err:
        conn.rollback()  
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


# For Lecturer Only

@app.route('/sections/<int:section_id>/content', methods=['POST'])
def add_content(section_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "ERROR! A Request body is required"}), 400

    title = data.get('title')
    content_type = data.get('content_type')
    content_url = data.get('content_url')
    uploaded_by = data.get('uploaded_by')

    if not all([content_type, uploaded_by]):
        return jsonify({"error": "ERROR! Both content_type and uploaded_by are required"}), 400

    if content_type not in ['link', 'file', 'slide']:
        return jsonify({"error": "ERROR! Invalid content_type"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT section_id, course_code FROM Course_Sections WHERE section_id = %s", (section_id,))
        section = cursor.fetchone()

        if not section:
            return jsonify({"error": "Section not found"}), 404

        cursor.execute("SELECT lecturer_id FROM Lecturers WHERE lecturer_id = %s", (uploaded_by,))
        lecturer = cursor.fetchone()

        if not lecturer:
            return jsonify({"error": "Sorry! Only lecturers can upload content"}), 403

        cursor.execute("SELECT assigned_lecturer FROM Courses WHERE course_code = %s", (section["course_code"],))
        course = cursor.fetchone()

        if course["assigned_lecturer"] != uploaded_by:
            return jsonify({"error": "ERROR! This Lecturer is not assigned to this course"}), 403

        query = """
            INSERT INTO Course_Content (section_id, title, content_type, content_url, uploaded_by)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (section_id, title, content_type, content_url, uploaded_by))
        conn.commit()

        return jsonify({"message": "Course content added successfully"}), 201

    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/courses/<course_code>/content', methods=['GET'])
def get_course_content(course_code):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT course_code FROM Courses WHERE course_code = %s", (course_code,))
        course = cursor.fetchone()

        if not course:
            return jsonify({"error": "Course not found"}), 404

        query = """
            SELECT cs.title AS section, cc.title, cc.content_type, cc.content_url
            FROM Course_Sections cs
            LEFT JOIN Course_Content cc ON cs.section_id = cc.section_id
            WHERE cs.course_code = %s
        """
        cursor.execute(query, (course_code,))
        results = cursor.fetchall()

        return jsonify(results), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/courses/<course_code>/assignments', methods=['POST'])
def create_assignment(course_code):
    data = request.get_json()

    if not data:
        return jsonify({"error": "ERROR! A Request body is required"}), 400

    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')
    created_by = data.get('created_by')

    if not all([title, due_date, created_by]):
        return jsonify({"error": "ERROR! title, due_date and created_by are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT course_code, assigned_lecturer FROM Courses WHERE course_code = %s", (course_code,))
        course = cursor.fetchone()

        if not course:
            return jsonify({"error": "Course not found"}), 404

        if course["assigned_lecturer"] != created_by:
            return jsonify({"error": "Sorry! Only assigned lecturer can create assignments"}), 403

        query = """
            INSERT INTO Assignments (course_code, title, description, due_date, created_by)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (course_code, title, description, due_date, created_by))
        conn.commit()

        return jsonify({"message": "Assignment created successfully"}), 201

    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/assignments/<int:assignment_id>/submit', methods=['POST'])
def submit_assignment(assignment_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "ERROR! A Request body is required"}), 400

    student_id = data.get('student_id')
    file_url = data.get('file_url')

    if not all([student_id, file_url]):
        return jsonify({"error": "ERROR! Both student_id and file_url are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT assignment_id, course_code FROM Assignments WHERE assignment_id = %s", (assignment_id,))
        assignment = cursor.fetchone()

        if not assignment:
            return jsonify({"error": "Assignment not found"}), 404

        cursor.execute("SELECT student_id FROM Students WHERE student_id = %s", (student_id,))
        student = cursor.fetchone()

        if not student:
            return jsonify({"error": "Invalid student. Please double check student information and try again."}), 403

        cursor.execute("""
            SELECT * FROM Enrollments 
            WHERE student_id = %s AND course_code = %s
        """, (student_id, assignment["course_code"]))
        enrolled = cursor.fetchone()

        if not enrolled:
            return jsonify({"error": "ERROR! Student is not enrolled in this course"}), 403

        query = """
            INSERT INTO Submissions (assignment_id, student_id, file_url)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (assignment_id, student_id, file_url))
        conn.commit()

        return jsonify({"message": "Assignment submitted successfully"}), 201

    except mysql.connector.IntegrityError:
        conn.rollback()
        return jsonify({"error": "Student has already submitted this assignment"}), 400

    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/submissions/<int:submission_id>/grade', methods=['POST'])
def grade_submission(submission_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "ERROR! A Request body is required"}), 400

    grade = data.get('grade')
    graded_by = data.get('graded_by')

    if grade is None or graded_by is None:
        return jsonify({"error": "grade and graded_by are required"}), 400

    if not (0 <= float(grade) <= 100):
        return jsonify({"error": "ERROR! Grade must be between 0 and 100"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT submission_id FROM Submissions WHERE submission_id = %s", (submission_id,))
        submission = cursor.fetchone()

        if not submission:
            return jsonify({"error": "Submission not found"}), 404

        cursor.execute("SELECT lecturer_id FROM Lecturers WHERE lecturer_id = %s", (graded_by,))
        lecturer = cursor.fetchone()

        if not lecturer:
            return jsonify({"error": "Sorry! Only lecturers can grade"}), 403

        query = """
            INSERT INTO Grades (submission_id, grade, graded_by)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (submission_id, grade, graded_by))

        cursor.execute("""
            SELECT s.student_id, a.course_code
            FROM Submissions s
            JOIN Assignments a ON s.assignment_id = a.assignment_id
            WHERE s.submission_id = %s
        """, (submission_id,))
        info = cursor.fetchone()

        student_id = info["student_id"]
        course_code = info["course_code"]

        cursor.execute("""
            SELECT AVG(g.grade) AS avg_grade
            FROM Grades g
            JOIN Submissions s ON g.submission_id = s.submission_id
            JOIN Assignments a ON s.assignment_id = a.assignment_id
            WHERE s.student_id = %s AND a.course_code = %s
        """, (student_id, course_code))

        avg = cursor.fetchone()["avg_grade"]

        # Update Enrollments table with final calculated average
        cursor.execute("""
            UPDATE Enrollments
            SET final_grade = %s
            WHERE student_id = %s AND course_code = %s
        """, (avg, student_id, course_code))

        conn.commit()

        return jsonify({"message": "Grade added and final grade updated successfully"}), 201

    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)