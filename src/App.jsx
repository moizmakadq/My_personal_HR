import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";
import Analytics from "@/pages/admin/Analytics";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CreateDrive from "@/pages/admin/CreateDrive";
import DriveDetail from "@/pages/admin/DriveDetail";
import InterviewMonitor from "@/pages/admin/InterviewMonitor";
import ManageDrives from "@/pages/admin/ManageDrives";
import ManageStudents from "@/pages/admin/ManageStudents";
import PlagiarismCenter from "@/pages/admin/PlagiarismCenter";
import Results from "@/pages/admin/Results";
import Scheduling from "@/pages/admin/Scheduling";
import Screening from "@/pages/admin/Screening";
import Settings from "@/pages/admin/Settings";
import StudentDetail from "@/pages/admin/StudentDetail";
import InterviewRoom from "@/pages/interviewer/InterviewRoom";
import InterviewerDashboard from "@/pages/interviewer/InterviewerDashboard";
import SelectionBoard from "@/pages/interviewer/SelectionBoard";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/Register";
import MyApplications from "@/pages/student/MyApplications";
import MyFeedback from "@/pages/student/MyFeedback";
import MyInterviews from "@/pages/student/MyInterviews";
import MyParsedProfile from "@/pages/student/MyParsedProfile";
import MyProfile from "@/pages/student/MyProfile";
import StudentDashboard from "@/pages/student/StudentDashboard";
import UpcomingDrives from "@/pages/student/UpcomingDrives";

function AppBootstrap() {
  const { initializeAuth } = useAuthStore();
  const { initializeStudents } = useStudentStore();
  const { initializeDriveData, syncFromStudents } = useDriveStore();
  const { profile } = useAuth();

  useEffect(() => {
    initializeAuth();
    initializeStudents();
    initializeDriveData();
  }, [initializeAuth, initializeStudents, initializeDriveData]);

  useEffect(() => {
    syncFromStudents();
  }, [profile, syncFromStudents]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppBootstrap />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allow={["admin"]}>
              <ManageStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students/:studentId"
          element={
            <ProtectedRoute allow={["admin"]}>
              <StudentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drives"
          element={
            <ProtectedRoute allow={["admin"]}>
              <ManageDrives />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drives/create"
          element={
            <ProtectedRoute allow={["admin"]}>
              <CreateDrive />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drives/:driveId"
          element={
            <ProtectedRoute allow={["admin"]}>
              <DriveDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/screening"
          element={
            <ProtectedRoute allow={["admin"]}>
              <Screening />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/scheduling"
          element={
            <ProtectedRoute allow={["admin"]}>
              <Scheduling />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/interview-monitor"
          element={
            <ProtectedRoute allow={["admin"]}>
              <InterviewMonitor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/results"
          element={
            <ProtectedRoute allow={["admin"]}>
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allow={["admin"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/plagiarism"
          element={
            <ProtectedRoute allow={["admin"]}>
              <PlagiarismCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allow={["admin"]}>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allow={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allow={["student"]}>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/parsed-profile"
          element={
            <ProtectedRoute allow={["student"]}>
              <MyParsedProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/drives"
          element={
            <ProtectedRoute allow={["student"]}>
              <UpcomingDrives />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allow={["student"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/interviews"
          element={
            <ProtectedRoute allow={["student"]}>
              <MyInterviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/feedback"
          element={
            <ProtectedRoute allow={["student"]}>
              <MyFeedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interviewer"
          element={
            <ProtectedRoute allow={["interviewer"]}>
              <InterviewerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviewer/room/:slotId"
          element={
            <ProtectedRoute allow={["interviewer"]}>
              <InterviewRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviewer/selection-board"
          element={
            <ProtectedRoute allow={["interviewer"]}>
              <SelectionBoard />
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard" element={<Navigate to="/student" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
