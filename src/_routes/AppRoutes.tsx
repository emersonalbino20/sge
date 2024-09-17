import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Index = lazy(()=>import('../_pages/Index'))
const HomePage = lazy(()=>import('../_pages/HomePage'))
const StudentInsertPage = lazy(()=>import('../_pages/StudentInsertPage'))
const StudentListPage = lazy(()=>import('../_pages/StudentListPage'))
const TeacherPage = lazy(()=>import('../_pages/TeacherPage'))

const PersonInchargePage = lazy(()=>import('../_pages/PersonInchargePage'))

const CursePage = lazy(()=>import('../_pages/CursePage'))
const SubjectPage = lazy(()=>import('../_pages/SubjectPage'))
const AcademicYearPage = lazy(()=>import('../_pages/AcademicYearPage'))
const GradePage = lazy(()=>import('../_pages/GradePage'))
const ClassRoomPage = lazy(()=>import('../_pages/ClassRoomPage'))
const PeriodPage = lazy(()=>import('../_pages/PeriodPage'))
const ClassPage = lazy(()=>import('../_pages/ClassPage'))
const PaymentPage = lazy(()=>import('../_pages/PaymentPage'))
const ParentsPage = lazy(()=>import('../_pages/ParentsPage'))

export default function AppRoutes(){
    
    return(
        <BrowserRouter>
        <Suspense fallback={<div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>}>
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/Home" element={<HomePage/>}/>
                <Route path="/StudentInsertPage" element={<StudentInsertPage/>}/>
                <Route path="/StudentListPage" element={<StudentListPage/>}/>
                <Route path="/TeacherPage" element={<TeacherPage/>}/>
                <Route path="/PersonInchargePage" element={<PersonInchargePage/>}/>
                <Route path="/CursePage" element={<CursePage/>}/>
                <Route path="/SubjectPage" element={<SubjectPage/>}/>
                <Route path="/AcademicYearPage" element={<AcademicYearPage/>}/>
                <Route path="/GradePage" element={<GradePage/>}/>
                <Route path="/ClassRoomPage" element={<ClassRoomPage/>}/>
                <Route path="/PeriodPage" element={<PeriodPage/>}/>
                <Route path="/ClassPage" element={<ClassPage/>}/>
                <Route path="/PaymentPage" element={<PaymentPage/>}/>
                <Route path="/ParentsPage" element={<ParentsPage/>}/>
            </Routes>
        </Suspense>
        </BrowserRouter>
    );
}