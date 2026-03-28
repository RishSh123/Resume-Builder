import {
  PlusIcon,
  UploadCloudIcon,
  FilePenLineIcon,
  TrashIcon,
  PencilIcon,
  XIcon,
  UploadCloud,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { dummyResumeData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResumes, setShowCreateResumes] = useState(false);
  const [showUploadResumes, setShowUploadResumes] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const navigate = useNavigate();

  const loadAllResumes = async () => {
    setAllResumes(dummyResumeData);
  };

  const createResume = async (event) => {
    event.preventDefault();
    setShowCreateResumes(false);
    navigate(`/app/builder/res123`);
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    setShowUploadResumes(false);
    navigate(`/app/builder/res123`);
  };

  const editTitle = async (event) => {
    event.preventDefault();
  };

  const deleteResume = async (resumeId) => {
    const confirm = window.confirm("Are you sure you want to delete this resume?");
    if (!confirm) return;
    setAllResumes((prev) => prev.filter((resume) => resume._id !== resumeId));
  };

  useEffect(() => {
    loadAllResumes();
  }, []);



  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, Joe Doe
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResumes(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all">
              Create Resume
            </p>
          </button>

          <button
            onClick={() => setShowUploadResumes(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];

            return (
              <button
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                key={index}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}1A, ${baseColor}66)`,
                  borderColor: `${baseColor}66`,
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />

                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>

                <p
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all px-2 text-center"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 group-hover:flex items-center hidden"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id);
                      setTitle(resume.title);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* CREATE MODAL */}
        {showCreateResumes && (
          <form
            onSubmit={createResume}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600 focus:ring-green-600"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => {
                  setShowCreateResumes(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {/* UPLOAD MODAL */}
        {showUploadResumes && (
          <form
            onSubmit={uploadResume}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload a Resume</h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border rounded"
                required
              />

              <label
                htmlFor="resume-input"
                className="flex flex-col items-center justify-center gap-2 border text-slate-400 border-dashed rounded-md p-4 py-10 my-4 cursor-pointer hover:border-green-500 hover:text-green-700 transition-colors"
              >
                {resume ? (
                  <p className="text-green-700">{resume.name}</p>
                ) : (
                  <>
                    <UploadCloud className="size-14 stroke-1" />
                    <p>Upload Resume</p>
                  </>
                )}
              </label>

              <input
                id="resume-input"
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => setResume(e.target.files[0])}
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Upload Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => {
                  setShowUploadResumes(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;