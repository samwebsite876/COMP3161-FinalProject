from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
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


if __name__ == '__main__':
    app.run(debug=True)