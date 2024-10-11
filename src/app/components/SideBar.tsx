"use client";
import React from 'react';

export interface Course {
    subject_id : string;
    course_number : string;
    instructor1 : string;
    section_number: string;
    semester: string;
    year: string;
    course_gpa: string;
    grades_count: string;
    grades_A: number;
    grades_B: number;
    grades_C: number;
    grades_D: number; 
    grades_F: number;
    grades_I: number;
    grades_P: number;
    grades_Q: number;
    grades_W: number;
    grades_Z: number;
    grades_R: number;
}
interface SideBarProps {
    professors: string[];
    selectedProfessor: string | null;
    setSelectedProfessor: (professor: string | null) => void;
    years: string[];
    selectedYear: string | null;
    setSelectedYear: (year: string | null) => void;
    selectedCourse: string | null;
    setSelectedCourse: (course: string | null) => void;
    coursesToDisplay: any[];
    setCoursesToDisplay: (course: Course[]) => void;
    semesters: string[];
    selectedSemester: string | null;
    setSelectedSemester: (semester: string | null) => void;
    finalFilteredCourses: any[];
    selectedSection: any | null;
    setSelectedSection: (section: any | null) => void;
    routeType: "course" | "professor" | null;
}

const SideBar: React.FC<SideBarProps> = ({
    professors,
    selectedProfessor,
    setSelectedProfessor,
    years,
    selectedYear,
    selectedCourse,
    coursesToDisplay,
    setCoursesToDisplay,
    setSelectedCourse,
    setSelectedYear,
    semesters,
    selectedSemester,
    setSelectedSemester,
    finalFilteredCourses,
    selectedSection,
    setSelectedSection,
    routeType,
}) => {
    const selectedProfAndCourse = selectedProfessor && selectedCourse;

    const handleBackButtonClick = () => {
        if (routeType === "professor") {
            // If currently on professor route, reset to course selection
            setSelectedCourse(null);
            setSelectedYear(null);
            setSelectedSemester(null);
            setSelectedSection(null);
        } else if (routeType === "course") {
            // If currently on course route, reset to professor selection
            setSelectedProfessor(null);
            setSelectedYear(null);
            setSelectedSemester(null);
            setSelectedSection(null);
        }
    };

    return (
        <div className="w-1/3 pr-4 mt-10">
            {selectedProfAndCourse ? (
                <div>
                    <h2 className="text-lg font-semibold mb-2">{`Sections for Professor: ${selectedProfessor}`}</h2>

                    {/* Year Dropdown */}
                    <div className="mb-4">
                        <label htmlFor="year" className="block font-semibold mb-1">
                            Select Year:
                        </label>
                        <select
                            id="year"
                            value={selectedYear || ""}
                            onChange={(e) => {setSelectedYear(e.target.value);
                                              setSelectedSection(null);
                                              setSelectedSemester(null);
                                      }
                            }
                            className="border p-2 rounded-lg w-full"
                        >
                            <option value="" disabled>
                                Select a year
                            </option>
                            {years.map((year, index) => (
                                <option key={index} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

          {/* Semester Dropdown */}
          <div className="mb-4">
            <label htmlFor="semester" className="block font-semibold mb-1">
              Select Semester:
            </label>
            <select
              id="semester"
              value={selectedSemester || ""}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="border p-2 rounded-lg w-full"
            >
              <option value="" disabled>
                Select a semester
              </option>
              {semesters.map((semester, index) => (
                <option key={index} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

                    {/* Section List */}
                    {selectedYear && selectedSemester && (
                        <ul className="space-y-2">
                            {finalFilteredCourses
                                .filter(course => {
                                    const [subjectId, courseNumber] = selectedCourse.split(" ");
                                    return course.subject_id === subjectId && course.course_number === courseNumber;
                                })
                                .map((course, index) => (
                                <li
                                    key={index}
                                    onClick={() => setSelectedSection(course)}
                                    className={`border p-2 rounded-lg shadow-sm cursor-pointer ${
                                        selectedSection &&
                                        selectedSection?.section_number === course.section_number &&
                                        selectedSection.year === course.year &&
                                        selectedSection.semester === course.semester
                                            ? 'bg-blue-100'
                                            : ''
                                    }`}
                                >
                                    {course.semester} {course.year} Section: {course.section_number}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        onClick={handleBackButtonClick}
                        className="mt-4 text-blue-500 underline"
                    >
                        {routeType === "course" ? "Back to professors" : "Back to courses"}
                    </button>
                </div>
            ) : routeType === "course" ? (
                <ul className="space-y-4">
                    {professors.map((professor, index) => (
                        <li
                            key={index}
                            className="border p-4 rounded-lg shadow-sm cursor-pointer"
                            onClick={() => setSelectedProfessor(professor)}
                        >
                            <h2 className="text-lg font-semibold">{professor}</h2>
                        </li>
                    ))}
                </ul>
            ) : routeType === "professor" ? (
                <ul className="space-y-4">
                    {coursesToDisplay.map((course, index) => (
                        <li
                            key={index}
                            className="border p-4 rounded-lg shadow-sm cursor-pointer"
                            onClick={() => setSelectedCourse(`${course.subject_id} ${course.course_number}`)}
                        >
                            <h2 className="text-lg font-semibold">{`${course.subject_id} ${course.course_number}`}</h2>
                            <h2 className="text-lg">Instructor: {course.instructor1}</h2>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
};

export default SideBar;
