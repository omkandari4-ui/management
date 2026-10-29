/**
 * UniFlow - Automated Integration & Logic Test Suite
 * Tests Storage, Validation, Demo Seeder, CRUD, Constraints, Backup/Restore, and Referential Integrity.
 */

const fs = require('fs');
const path = require('path');

// 1. Mock LocalStorage in Node environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => {
    for (const k in mockStorage) delete mockStorage[k];
  }
};

async function runTests() {
  console.log('--- STARTING UNIFLOW INTEGRATION TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // Import ES Modules dynamically in Node
  const storageModule = await import('./js/storage.js');
  const validationModule = await import('./js/validation.js');
  const { Storage, COLLECTIONS } = storageModule;
  const { Validation } = validationModule;

  // TEST 1: Initial Demo Seeding
  assert(!Storage.isInitialized(), 'Storage initially reports uninitialized');
  const seeded = Storage.initializeDemoData(false);
  assert(seeded === true, 'initializeDemoData returned true on fresh run');
  assert(Storage.isInitialized() === true, 'Storage reports initialized after seeding');

  const depts = Storage.getAll(COLLECTIONS.DEPARTMENTS);
  const courses = Storage.getAll(COLLECTIONS.COURSES);
  const sessions = Storage.getAll(COLLECTIONS.SESSIONS);
  const semesters = Storage.getAll(COLLECTIONS.SEMESTERS);
  const sections = Storage.getAll(COLLECTIONS.SECTIONS);
  const students = Storage.getAll(COLLECTIONS.STUDENTS);
  const enrollments = Storage.getAll(COLLECTIONS.ENROLLMENTS);

  assert(depts.length === 5, `Demo departments seeded correctly (expected 5, got ${depts.length})`);
  assert(courses.length === 8, `Demo courses seeded correctly (expected 8, got ${courses.length})`);
  assert(sessions.length === 3, `Demo sessions seeded correctly (expected 3, got ${sessions.length})`);
  assert(semesters.length > 20, `Demo semesters generated correctly (got ${semesters.length})`);
  assert(sections.length > 5, `Demo sections generated correctly (got ${sections.length})`);
  assert(students.length === 28, `Demo students seeded correctly (expected 28, got ${students.length})`);
  assert(enrollments.length === 28, `Demo enrollments created correctly (expected 28, got ${enrollments.length})`);

  // TEST 2: Re-seeding Guard (Must not overwrite user data)
  const testDept = depts[0];
  const originalName = testDept.name;
  Storage.update(COLLECTIONS.DEPARTMENTS, testDept.id, { name: 'Renamed Computing Department' });

  // Call initializeDemoData again without force
  const reseedResult = Storage.initializeDemoData(false);
  assert(reseedResult === false, 'initializeDemoData refuses to reseed when already initialized');
  const deptAfter = Storage.getById(COLLECTIONS.DEPARTMENTS, testDept.id);
  assert(deptAfter.name === 'Renamed Computing Department', 'User modifications preserved across re-initialization');

  // Restore name
  Storage.update(COLLECTIONS.DEPARTMENTS, testDept.id, { name: originalName });

  // TEST 3: Referential Counts Calculation
  const caStudentCount = Storage.getDepartmentStudentCount('dept_ca');
  assert(caStudentCount > 0, `Department CA student count calculated dynamically (${caStudentCount})`);

  const bcaStudentCount = Storage.getCourseStudentCount('crs_bca');
  assert(bcaStudentCount > 0, `Course BCA student count calculated dynamically (${bcaStudentCount})`);

  const sessStudentCount = Storage.getSessionStudentCount('sess_2025_26');
  assert(sessStudentCount > 0, `Session 2025–26 student count calculated dynamically (${sessStudentCount})`);

  // TEST 4: Validation Engine
  assert(Validation.isValidEmail('john.doe@uniflow.edu') === true, 'Valid email recognized');
  assert(Validation.isValidEmail('invalid-email') === false, 'Invalid email rejected');
  assert(Validation.isValidEmail('') === false, 'Empty email rejected');

  assert(Validation.isValidDateRange('2025-08-01', '2026-05-31') === true, 'Valid date range approved');
  assert(Validation.isValidDateRange('2026-05-31', '2025-08-01') === false, 'Inverted date range rejected');

  // RegNo uniqueness
  const existingReg = students[0].regNo;
  assert(Validation.isStudentRegNoUnique(existingReg) === false, `Existing regNo "${existingReg}" detected as duplicate`);
  assert(Validation.isStudentRegNoUnique(existingReg, students[0].id) === true, 'Same student regNo allowed when editing self');
  assert(Validation.isStudentRegNoUnique('UF-9999-9999') === true, 'New unique regNo allowed');

  // Dept code uniqueness
  assert(Validation.isDeptCodeUnique('CA') === false, 'Existing dept code CA detected as duplicate');
  assert(Validation.isDeptCodeUnique('CA', 'dept_ca') === true, 'Same dept code allowed when editing self');
  assert(Validation.isDeptCodeUnique('NEWDEPT') === true, 'New unique dept code allowed');

  // TEST 5: Safe Deletion Verification
  const deptDelCheck = Validation.canDeleteDepartment('dept_ca');
  assert(deptDelCheck.allowed === false, 'Prevent deletion of department with active courses and students');
  assert(typeof deptDelCheck.reason === 'string', `Informative rejection reason returned: "${deptDelCheck.reason}"`);

  const courseDelCheck = Validation.canDeleteCourse('crs_bca');
  assert(courseDelCheck.allowed === false, 'Prevent deletion of course with enrolled students');

  // Create an empty dummy department and verify it CAN be deleted
  const dummyDept = Storage.create(COLLECTIONS.DEPARTMENTS, {
    name: 'Temporary Department',
    code: 'TEMP',
    status: 'active'
  });
  const dummyDelCheck = Validation.canDeleteDepartment(dummyDept.id);
  assert(dummyDelCheck.allowed === true, 'Empty department without dependencies can be safely deleted');
  Storage.delete(COLLECTIONS.DEPARTMENTS, dummyDept.id);
  assert(Storage.getById(COLLECTIONS.DEPARTMENTS, dummyDept.id) === null, 'Deleted empty department removed from storage');

  // TEST 6: Student CRUD & Placement
  const newStudent = Storage.create(COLLECTIONS.STUDENTS, {
    regNo: 'UF-2025-TEST1',
    fullName: 'Test Candidate',
    email: 'test.candidate@uniflow.edu',
    status: 'active',
    enrollmentDate: '2025-09-01'
  });
  assert(newStudent.id && newStudent.regNo === 'UF-2025-TEST1', 'Student created with generated ID');

  const newEnrollment = Storage.create(COLLECTIONS.ENROLLMENTS, {
    studentId: newStudent.id,
    courseId: 'crs_bca',
    departmentId: 'dept_ca',
    sessionId: 'sess_2025_26',
    semesterId: semesters[0].id,
    enrollmentStatus: 'active',
    enrollmentDate: '2025-09-01'
  });
  assert(newEnrollment.id && newEnrollment.studentId === newStudent.id, 'Enrollment record linked to student');

  const fetchedActiveEnr = Storage.getStudentActiveEnrollment(newStudent.id);
  assert(fetchedActiveEnr !== null && fetchedActiveEnr.courseId === 'crs_bca', 'getStudentActiveEnrollment found active placement');

  // Update student status to archived
  Storage.update(COLLECTIONS.STUDENTS, newStudent.id, { status: 'archived' });
  assert(Storage.getById(COLLECTIONS.STUDENTS, newStudent.id).status === 'archived', 'Student status updated to archived');

  // Clean test student
  Storage.delete(COLLECTIONS.STUDENTS, newStudent.id);
  Storage.delete(COLLECTIONS.ENROLLMENTS, newEnrollment.id);

  // TEST 7: JSON Export and Schema Validation
  const backupJSON = Storage.exportFullBackup();
  assert(typeof backupJSON === 'string' && backupJSON.length > 500, 'exportFullBackup generates valid JSON string');

  const validCheck = Storage.validateImportJSON(backupJSON);
  assert(validCheck.valid === true, 'validateImportJSON approves valid backup');
  assert(validCheck.summary.students === 28, 'Backup summary reports correct student count (28)');

  // Malformed JSON check
  const badJSONCheck = Storage.validateImportJSON('{"invalid_json: 123');
  assert(badJSONCheck.valid === false && badJSONCheck.errors.length > 0, 'Malformed JSON rejected with error message');

  // Missing collections check
  const missingColsCheck = Storage.validateImportJSON(JSON.stringify({ data: { departments: [] } }));
  assert(missingColsCheck.valid === false, 'JSON missing required collections rejected');

  // Duplicate registration numbers in import check
  const duplicateRegsJSON = JSON.stringify({
    data: {
      departments: [{ id: 'd1', code: 'D1', name: 'Dept 1' }],
      courses: [],
      students: [
        { id: 's1', regNo: 'UF-DUP-001', fullName: 'Student 1' },
        { id: 's2', regNo: 'UF-DUP-001', fullName: 'Student 2' }
      ],
      enrollments: []
    }
  });
  const dupCheck = Storage.validateImportJSON(duplicateRegsJSON);
  assert(dupCheck.valid === false && dupCheck.errors.some(e => e.includes('Duplicate student registration')), 'Duplicate registration numbers in import detected and rejected');

  // Summary
  console.log(`\n--- TEST RESULTS: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner caught unexpected exception:', err);
  process.exit(1);
});

