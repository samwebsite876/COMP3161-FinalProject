import random
import string
from faker import Faker

fake = Faker()

# ============================================
# CONFIGURATION
# ============================================
NUM_STUDENTS = 100000
NUM_LECTURERS = 120
NUM_SYSADMIN = 10
NUM_COURSES = 200
MIN_COURSES_PER_STUDENT = 3
MAX_COURSES_PER_STUDENT = 6
MIN_STUDENTS_PER_COURSE = 10

# ============================================
# COURSE LIST (200 courses)
# ============================================
course_titles = [
    'Introduction to Computer Science', 'Data Structures', 'Algorithms', 'Operating Systems', 'Databases',
    'Computer Networks', 'Artificial Intelligence', 'Machine Learning', 'Software Engineering', 'Cybersecurity',
    'Web Development', 'Mobile App Development', 'Cloud Computing', 'Big Data Analytics', 'Computer Graphics',
    'Calculus I', 'Calculus II', 'Calculus III', 'Linear Algebra', 'Discrete Mathematics',
    'Probability Theory', 'Statistics', 'Differential Equations', 'Numerical Analysis', 'Real Analysis',
    'Complex Analysis', 'Abstract Algebra', 'Number Theory', 'Topology', 'Mathematical Modeling',
    'Physics I', 'Physics II', 'Classical Mechanics', 'Electromagnetism', 'Quantum Physics',
    'Thermodynamics', 'Optics', 'Nuclear Physics', 'Astrophysics', 'Fluid Mechanics',
    'General Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry', 'Physical Chemistry',
    'Biochemistry', 'Environmental Chemistry', 'Polymer Chemistry', 'Medicinal Chemistry', 'Chemical Thermodynamics',
    'Introduction to Biology', 'Cell Biology', 'Genetics', 'Microbiology', 'Molecular Biology',
    'Ecology', 'Evolutionary Biology', 'Neuroscience', 'Immunology', 'Botany',
    'Zoology', 'Anatomy and Physiology', 'Marine Biology', 'Conservation Biology', 'Bioinformatics',
    'Introduction to Psychology', 'Developmental Psychology', 'Abnormal Psychology', 'Social Psychology', 'Cognitive Psychology',
    'Clinical Psychology', 'Educational Psychology', 'Industrial Psychology', 'Health Psychology', 'Forensic Psychology',
    'Introduction to Sociology', 'Social Theory', 'Research Methods', 'Urban Sociology', 'Criminology',
    'Cultural Sociology', 'Political Sociology', 'Sociology of Education', 'Sociology of Gender', 'Sociology of Race',
    'Microeconomics', 'Macroeconomics', 'Econometrics', 'International Economics', 'Development Economics',
    'Labor Economics', 'Public Economics', 'Financial Economics', 'Behavioral Economics', 'Environmental Economics',
    'Financial Accounting', 'Managerial Accounting', 'Corporate Finance', 'Investments', 'Financial Management',
    'Marketing Management', 'Consumer Behavior', 'Brand Management', 'Digital Marketing', 'Market Research',
    'Organizational Behavior', 'Human Resource Management', 'Strategic Management', 'Operations Management', 'Business Ethics',
    'Entrepreneurship', 'Supply Chain Management', 'Project Management', 'International Business', 'Business Analytics',
    'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Chemical Engineering', 'Biomedical Engineering',
    'Environmental Engineering', 'Materials Engineering', 'Aerospace Engineering', 'Industrial Engineering', 'Petroleum Engineering',
    'English Literature', 'Creative Writing', 'American Literature', 'British Literature', 'World Literature',
    'Linguistics', 'Rhetoric and Composition', 'Technical Writing', 'Journalism', 'Public Speaking',
    'Art History', 'Drawing Fundamentals', 'Painting', 'Sculpture', 'Digital Art',
    'Graphic Design', 'Photography', 'Film Studies', 'Theater Arts', 'Music Theory',
    'History of Western Civilization', 'American History', 'European History', 'African History', 'Asian History',
    'Latin American History', 'Medieval History', 'Modern History', 'Military History', 'Diplomatic History',
    'Introduction to Philosophy', 'Ethics', 'Logic', 'Metaphysics', 'Epistemology',
    'Political Philosophy', 'Philosophy of Mind', 'Philosophy of Science', 'Aesthetics', 'Existentialism',
    'American Government', 'Comparative Politics', 'International Relations', 'Political Theory', 'Public Policy',
    'Constitutional Law', 'Criminal Justice', 'Public Administration', 'Urban Planning', 'Environmental Policy',
    'Introduction to Anthropology', 'Cultural Anthropology', 'Physical Anthropology', 'Archaeology', 'Linguistic Anthropology',
    'Medical Anthropology', 'Economic Anthropology', 'Political Anthropology', 'Urban Anthropology', 'Visual Anthropology',
    'Digital Forensics', 'Game Development', 'Human-Computer Interaction', 'Parallel Computing', 'Quantum Computing',
    'Sports Psychology', 'Organizational Psychology', 'Consumer Psychology', 'Cross-Cultural Psychology', 'Rehabilitation Psychology',
    'International Marketing', 'Service Marketing', 'Retail Management', 'Sales Management', 'Advertising Management'
][:NUM_COURSES]

course_codes = [f"C{i+1:03d}" for i in range(NUM_COURSES)]

# ============================================
# GENERATE DATA
# ============================================
used_emails = set()
used_usernames = set()

user_inserts = []
course_inserts = []
enrollment_inserts = []

student_ids = list(range(1, NUM_STUDENTS + 1))
lecturer_ids = list(range(100001, 100001 + NUM_LECTURERS))
sysadmin_ids = list(range(200001, 200001 + NUM_SYSADMIN))

# Generate users
for user_id in student_ids:
    first = fake.first_name().replace("'", "''")
    last = fake.last_name().replace("'", "''")
    email = f"{first.lower()}.{last.lower()}@uwi.edu"
    username = f"{first.lower()}_{last.lower()}"
    counter = 1
    while email in used_emails:
        email = f"{first.lower()}.{last.lower()}{counter}@uwi.edu"
        counter += 1
    while username in used_usernames:
        username = f"{first.lower()}_{last.lower()}{counter}"
        counter += 1
    used_emails.add(email)
    used_usernames.add(username)
    password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(8))
    user_inserts.append(f"({user_id}, '{first}', '{last}', '{email}', '{username}', '{password}', 'student')")

for user_id in lecturer_ids:
    first = fake.first_name().replace("'", "''")
    last = fake.last_name().replace("'", "''")
    email = f"{first.lower()}.{last.lower()}@uwi.edu"
    username = f"{first.lower()}_{last.lower()}"
    counter = 1
    while email in used_emails:
        email = f"{first.lower()}.{last.lower()}{counter}@uwi.edu"
        counter += 1
    while username in used_usernames:
        username = f"{first.lower()}_{last.lower()}{counter}"
        counter += 1
    used_emails.add(email)
    used_usernames.add(username)
    password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(8))
    user_inserts.append(f"({user_id}, '{first}', '{last}', '{email}', '{username}', '{password}', 'lecturer')")

for user_id in sysadmin_ids:
    first = fake.first_name().replace("'", "''")
    last = fake.last_name().replace("'", "''")
    email = f"{first.lower()}.{last.lower()}@uwi.edu"
    username = f"{first.lower()}_{last.lower()}"
    counter = 1
    while email in used_emails:
        email = f"{first.lower()}.{last.lower()}{counter}@uwi.edu"
        counter += 1
    while username in used_usernames:
        username = f"{first.lower()}_{last.lower()}{counter}"
        counter += 1
    used_emails.add(email)
    used_usernames.add(username)
    password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(8))
    user_inserts.append(f"({user_id}, '{first}', '{last}', '{email}', '{username}', '{password}', 'sysadmin')")

# ============================================
# GENERATE COURSES WITH LECTURER CONSTRAINTS
# ============================================
lecturer_course_count = {lid: 0 for lid in lecturer_ids}
course_assignments = []

# Create a copy of course codes to assign
available_courses = course_codes.copy()
random.shuffle(available_courses)

# First: Give each lecturer exactly 1 course (requirement g)
course_index = 0
for lecturer_id in lecturer_ids:
    if course_index < len(available_courses):
        course_code = available_courses[course_index]
        course_assignments.append((course_code, lecturer_id))
        lecturer_course_count[lecturer_id] += 1
        course_index += 1

# Second: Distribute remaining courses ensuring no lecturer exceeds 5 (requirement f)
remaining_courses = available_courses[course_index:]

for course_code in remaining_courses:
    # Find lecturers with less than 5 courses
    available_lecturers = [lid for lid in lecturer_ids if lecturer_course_count[lid] < 5]
    if available_lecturers:
        lecturer_id = random.choice(available_lecturers)
        course_assignments.append((course_code, lecturer_id))
        lecturer_course_count[lecturer_id] += 1
    else:
        # This shouldn't happen with 120 lecturers * 5 = 600 capacity, 200 courses total
        lecturer_id = random.choice(lecturer_ids)
        course_assignments.append((course_code, lecturer_id))
        lecturer_course_count[lecturer_id] += 1

# Create a mapping from course_code to lecturer_id
course_lecturer_map = {code: lid for code, lid in course_assignments}

# Generate course inserts
for code, title in zip(course_codes, course_titles):
    lecturer_id = course_lecturer_map[code]
    course_inserts.append(f"('{code}', '{title}', {lecturer_id})")

# ============================================
# GENERATE ENROLLMENTS
# ============================================
enrollment_id = 1
course_enrollment_count = {code: 0 for code in course_codes}
student_courses = {sid: [] for sid in student_ids}

for student_id in student_ids:
    num = random.randint(MIN_COURSES_PER_STUDENT, MAX_COURSES_PER_STUDENT)
    enrolled = random.sample(course_codes, min(num, NUM_COURSES))
    for course_code in enrolled:
        grade = round(random.uniform(30, 100), 2)
        enrollment_inserts.append(f"({enrollment_id}, {student_id}, '{course_code}', {grade})")
        student_courses[student_id].append(course_code)
        course_enrollment_count[course_code] += 1
        enrollment_id += 1

for course_code in course_codes:
    while course_enrollment_count[course_code] < MIN_STUDENTS_PER_COURSE:
        candidates = [s for s in student_ids if course_code not in student_courses[s] and len(student_courses[s]) < MAX_COURSES_PER_STUDENT]
        if not candidates:
            break
        student = random.choice(candidates)
        grade = round(random.uniform(30, 100), 2)
        enrollment_inserts.append(f"({enrollment_id}, {student}, '{course_code}', {grade})")
        student_courses[student].append(course_code)
        course_enrollment_count[course_code] += 1
        enrollment_id += 1

# ============================================
# WRITE OUTPUT FILES
# ============================================
with open("01_users.sql", "w") as f:
    f.write("INSERT INTO Users (user_id, first_name, last_name, email, username, password, user_type) VALUES\n")
    f.write(",\n".join(user_inserts))
    f.write(";\n")

with open("02_students.sql", "w") as f:
    f.write("INSERT INTO Students (student_id, user_id) VALUES\n")
    f.write(",\n".join([f"({sid}, {sid})" for sid in student_ids]))
    f.write(";\n")

with open("03_lecturers.sql", "w") as f:
    f.write("INSERT INTO Lecturers (lecturer_id, user_id) VALUES\n")
    f.write(",\n".join([f"({lid}, {lid})" for lid in lecturer_ids]))
    f.write(";\n")

with open("04_sysadmins.sql", "w") as f:
    f.write("INSERT INTO SysAdmins (admin_id, user_id) VALUES\n")
    f.write(",\n".join([f"({aid}, {aid})" for aid in sysadmin_ids]))
    f.write(";\n")

with open("05_courses.sql", "w") as f:
    f.write("INSERT INTO Courses (course_code, title, assigned_lecturer) VALUES\n")
    f.write(",\n".join(course_inserts))
    f.write(";\n")

with open("06_enrollments.sql", "w") as f:
    f.write("INSERT INTO Enrollments (enroll_id, student_id, course_code, final_grade) VALUES\n")
    f.write(",\n".join(enrollment_inserts))
    f.write(";\n")

# Verification output
print(f"Generated: {len(user_inserts)} users, {len(course_inserts)} courses, {len(enrollment_inserts)} enrollments")
print("\n=== LECTURER COURSE LOAD VERIFICATION ===")
print(f"Lecturers with 0 courses: {sum(1 for count in lecturer_course_count.values() if count == 0)}")
print(f"Lecturers with >5 courses: {sum(1 for count in lecturer_course_count.values() if count > 5)}")
print(f"Min courses per lecturer: {min(lecturer_course_count.values())}")
print(f"Max courses per lecturer: {max(lecturer_course_count.values())}")
print(f"Avg courses per lecturer: {sum(lecturer_course_count.values()) / len(lecturer_ids):.2f}")