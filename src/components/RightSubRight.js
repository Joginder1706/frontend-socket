import React from "react";
import pic from "../images/photo.jfif";
// import { GiftOutlined } from "@ant-design/icons";
import formatMonthDayYear from "../utils/formatMonthDayYear";

const RightSubRight = ({ width, selectedUserData, checkRightSection }) => {
  const image_url = "https://www.fansmaps.com/pictures/place-full/";

  const getPlans = (planId) => {
    switch (planId) {
      case 1:
        return "Free"
      case 5:
        return "Platinum"
      case 6:
        return "Basic Sugar Daddy"
      case 8:
        return "Whale Sugar Daddy"
      default:
        return "Free"
    }
  }

  return (
    <div
      style={{
        display: width === 100 ? "none" : "",
        transition: "width 0.3s ease-in-out",
      }}
      className={`ml-${checkRightSection ? "0" : "4"
        } h-[75vh] overflow-auto sm:h-[100vh] sm:block`}
    >
      <div className="bg-white shadow-[inset_0_-2px_0_0_rgb(231,231,231)] pb-2">
        {/* <div className="flex flex-wrap justify-between gap-3 border-b border-gray-200 p-2">
          <img src={pic} alt="User" className="rounded w-[30%]" />
          <img src={pic} alt="User" className="rounded w-[30%]" />
        </div> */}
        {selectedUserData?.photos &&
          selectedUserData.photos.map((item, index) => (
            <img
              key={index}
              src={`${image_url}${item.dir}/${item.filename}`}
              alt="User"
              className="rounded w-[30%]"
            />
          ))}
        <div className="text-sm text-gray-600">
          <div className="flex justify-between p-2 pt-7 border-b">
            <strong>Member Since:</strong>
            <span>{selectedUserData?.submission_date ? formatMonthDayYear(selectedUserData?.submission_date) : ""}</span>
          </div>
          <div className="flex justify-between p-2 pt-7 border-b">
            <strong>Last Active:</strong>{" "}
            <span>{selectedUserData?.active_date ? formatMonthDayYear(selectedUserData?.active_date) : ""}</span>
          </div>
          <div className="flex justify-between p-2 pt-7 border-b">
            <strong>Location:</strong>
            <span>{selectedUserData?.city_name}</span>
          </div>
          <div className="flex justify-between p-2 pt-7 border-b">
            <strong>Age:</strong>{" "}
            <span>{selectedUserData?.details?.age_id}</span>
          </div>
          <div className="flex justify-between p-2 pt-7 border-b">
            <strong>Gender:</strong> <span>{selectedUserData?.gender}</span>
          </div>
          <div className="flex justify-between p-2 pt-7 border-b">
            <strong>Type of Member:</strong> <span>{getPlans(selectedUserData?.plan)}</span>
          </div>
          <div className="flex justify-between p-2 pt-7 border-b">
            <strong>Ethnicity:</strong>{" "}
            <span>{selectedUserData?.details?.ethnicity_id}</span>
          </div>
          <div className="flex justify-between p-2 pt-7 border-b">
            <strong>Date Sexual Health Tested:</strong>{" "}
            <span>{selectedUserData?.healthtest_date ? formatMonthDayYear(selectedUserData?.healthtest_date) : ""}</span>
          </div>
          <div className="bg-[#EEEEEE] pl-2 pt-4 pb-4 font-semibold">
            Short Description
          </div>
          <div className="p-4 font-normal">{selectedUserData?.short_desc}</div>
          <div className="bg-[#EEEEEE] pl-2 pt-4 pb-4 font-semibold">
            About Me
          </div>
          <div className="p-4 font-normal">{selectedUserData?.description}</div>
          <div className="bg-[#EEEEEE] pl-2 pt-4 pb-4 font-semibold">
            What I'm Looking For
          </div>
          <div className="p-4 font-normal">
            {selectedUserData?.characters_description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSubRight;
