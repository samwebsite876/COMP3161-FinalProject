# COMP3161 Final Project - Database

## Database Design
- Users table (superclass) with Students, Lecturers, SysAdmins as child tables
- ISA inheritance pattern using foreign keys

## Data Generated
- 100,000 students
- 120 lecturers  
- 10 sysadmins
- 200 courses
- ~400,000 enrollments

## Requirements Met
- ✅ 100,000+ students
- ✅ 200+ courses
- ✅ 3-6 courses per student
- ✅ 10+ students per course
- ✅ 1-5 courses per lecturer

## How to Load
1. Run schema.sql first
2. Run 01_users.sql through 06_enrollments.sql in order
