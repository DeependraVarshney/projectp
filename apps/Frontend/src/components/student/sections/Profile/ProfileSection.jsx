import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ProfileView from "./ProfileView/ProfileView";
import ProfileEdit from "./ProfileEdit/ProfileEdit";
import axios from "axios";
import { useState } from "react";
const ProfileSection = () => {
  const navigate = useNavigate();
  const { studentData, setstudentData } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    navigate("edit");
  };
console.log(studentData,"rttyui");
  const handleUpdate = async (updatedData) => {
    try {
      const response = await axios.put(
        `/api/v1/student/profile/${studentData._id}`,
        updatedData
      );
      if (response.data.statusCode === 200) {
        studentData(response.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
  };

  return isEditing ? (
    <ProfileEdit
    studentData={studentData}
      onUpdate={handleUpdate}
      onCancel={() => setIsEditing(false)}
    />
  ) : (
    <ProfileView studentData={studentData} onEdit={handleEdit} />
  );
};

export default ProfileSection;
