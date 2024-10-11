"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import BarChart from '../components/BarChart';
import SideBar, { Course } from '../components/SideBar';
import { IoHomeOutline } from 'react-icons/io5';
import {Poppins, Montserrat} from 'next/font/google';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], 
  variable: '--font-poppins',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
});


const ResultsContent = () => {
  const searchParams = useSearchParams();
  const course = searchParams.get('course');
  const professor = searchParams.get('professor');
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesToDisplay, setCoursesToDisplay] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<Course | null>(null); 
  const [routeType, setRouteType] = useState<"course" | "professor" | null>(null); 

  const fetchCourses = async () => {
    setLoading(true);
    try {
      if (course) {
        const response = await fetch(`/api/courses/search?course=${encodeURIComponent(course)}`);
        const data = await response.json();
        setRouteType("course");
        setSelectedCourse(course);
        setCourses(data);
      } else if (professor) {
        const response = await fetch(`/api/courses/search?professor=${encodeURIComponent(professor)}`);
        const data = await response.json();
        setSelectedProfessor(professor)
        const filteredCourses = data.filter((course: Course) => {
          const matchesProfessor = selectedProfessor ? course.instructor1 === selectedProfessor : true;
          const matchesCourse = selectedCourse ? 
            course.subject_id === selectedCourse : true;
          return matchesProfessor && matchesCourse;
        });
        
        const uniqueFilteredCourses = filteredCourses.reduce((acc: Course[], course: Course) => {
          const identifier = `${course.subject_id}-${course.course_number}`;
          if (!acc.some((c: Course) => `${c.subject_id}-${c.course_number}` === identifier)) {
            acc.push(course);
          }
          return acc;
        }, []);

        setRouteType("professor");
        setCourses(filteredCourses);
        setCoursesToDisplay(uniqueFilteredCourses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(selectedProfessor, selectedCourse, selectedYear, selectedSemester, selectedSection)
  useEffect(() => {
    if (course || professor) {
        fetchCourses();
    }
  }, [course, professor]);

  const [subjectId, courseNumber] = selectedCourse ? selectedCourse.split(" ") : [null, null];
  const professors = [...new Set(courses.map(course => course.instructor1))];
  const filteredCourses = selectedProfessor
    ? courses.filter(course => course.instructor1 === selectedProfessor)
    : [];
    const years = [...new Set(
      filteredCourses
          .filter(course => 
              !selectedCourse || // Allow all courses if no course is selected yet
              (course.subject_id === subjectId && 
               course.course_number === courseNumber)
          )
          .map(course => course.year)
          .sort((a:any , b:any) => b - a) // Sort years in descending order
  )];
  const semesters = [...new Set(
    filteredCourses
        .filter(course => 
            !selectedCourse || // Allow all courses if no course is selected yet
            (course.subject_id === subjectId && 
             course.course_number === courseNumber &&
             course.year === selectedYear
            )
        )
        .map(course => course.semester)
  )];

  const finalFilteredCourses = filteredCourses
  .filter(course => {
    const matchesYear = selectedYear ? course.year === selectedYear : true;
    const matchesSemester = selectedSemester ? course.semester === selectedSemester : true;
    return matchesYear && matchesSemester;
  })
  .sort((a, b) => {
    // Sort by section_number in ascending order
    return a.section_number.localeCompare(b.section_number);
  });

  const handleProfessorClick = (professor: any) => {
    setSelectedProfessor(professor);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
  };

  const resetState = () => {
    setSelectedProfessor(null);
    setSelectedCourse(null);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setCourses([]);
    setCoursesToDisplay([]); 
  };
  
  
  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <IoHomeOutline
          onClick={() => (window.location.href = '/')}
          className="text-2xl cursor-pointer ml-4 mt-1"
          aria-label="Home"
        />
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => (window.location.href = '/')}
        >
          <h1 className="text-2xl font-montserrat">
            <span className={`${poppins.className} font-bold`}>UTA</span>
            <span className={`${montserrat.className} font-normal`}> GRADES</span>
          </h1>
        </div>
        <div className="w-8"></div>
      </div>
      {/* SearchBar always at the top */}
      <SearchBar initialValue={course || ''} resetState={resetState}/>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No results found for &quot;{course}&quot;. Please try another search.</p>
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <SideBar
            professors={professors}
            selectedProfessor={selectedProfessor}
            setSelectedProfessor={handleProfessorClick}
            years={years}
            selectedYear={selectedYear}
            selectedCourse={selectedCourse}
            coursesToDisplay={coursesToDisplay}
            setCoursesToDisplay={setCoursesToDisplay}
            setSelectedCourse={setSelectedCourse}
            setSelectedYear={setSelectedYear}
            semesters={semesters}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            finalFilteredCourses={finalFilteredCourses}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            routeType={routeType}
          />

          {/* Right content area */}
          <div className="w-2/3 pl-4 mt-16">
            {selectedSection ? (
              <div className="flex flex-col border p-4 rounded-lg shadow-md h-full gap-4">
              <h2 className="text-3xl mt-4 font-extrabold mb-4 text-center text-cyan-500 drop-shadow-md">{`${selectedSection.subject_id} ${selectedSection.course_number}`}</h2>
              <div className='flex flex-col gap-6 mr-0.5 ml-0.5'>
                  <div className='flex flex-row gap-4 justify-evenly'>
                    <div className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-blue-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                      <span className=''>PROFESSOR</span>
                      <span className='text-blue-500 text-lg'>{selectedSection.instructor1}</span>
                    </div>
                    <div className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-green-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                      <span className=''>YEAR</span>
                      <span className='text-blue-500 text-lg'>{selectedSection.year}</span>
                    </div>
                    <div className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-orange-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                      <span className=''>SEMESTER</span>
                      <span className='text-blue-500 text-lg'>{selectedSection.semester}</span>
                    </div>
                  </div>
                  <div className='flex flex-row gap-4 justify-evenly'>
                  <div className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-teal-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                      <span className=''>SECTION</span>
                      <span className='text-blue-500 text-lg'>{selectedSection.section_number}</span>
                    </div>
                    <div className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-rose-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                      <span className=''>AVERAGE GPA</span>
                      <span className='text-blue-500 text-lg'>{selectedSection.course_gpa}</span>
                    </div>
                    <div className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-yellow-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                      <span className=''>TOTAL STUDENTS</span>
                      <span className='text-blue-500 text-lg'>{selectedSection.grades_count}</span>
                    </div>
                  </div>
              </div>

              <div className="mt-8">
                <BarChart grades={selectedSection} />
              </div>
            </div>
              
                
            ) : (
              <p>{selectedProfessor 
                    ? "Select a course to see more information." 
                    : "Select a Professor to see more information."
                }
              </p>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

// Content needs to be wrapped in a Suspense tag to avoid CSR bailout due to useSearchParams()
const ResultsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
};

export default ResultsPage;