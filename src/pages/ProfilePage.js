import React from "react";
import { useNavigate } from "react-router-dom";
import pic from "../images/photo.jfif";
import {
  UserOutlined,
  GiftOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
const ProfilePage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex pl-[15%] pr-[15%] pt-3 ">
      <div className="w-[35%] p-2">
        <img
          src="https://images-cdn.seeking.com/4974d699-503a-47ac-a107-7604b79c43c4.jpg?Expires=1724241600&Signature=LZtzXa5WZ~s1nPqmQe5wNzruINrWXBVs-iu7JTOMhB7uQbjHk7qMSR4CNiasoWjd5FIdHkvS0s9yT1Pv~xKHJDtbV0eVJT-i-0hYPpCY-FYqY3~sS8MITnIEIi5oTBJBo0r2I4H3ST97bfwoOQ0G6gsuviaoRA8PtZ95QIAaut5D9XvSFr9-r-7jc-3C3YxDbvmvOYjoJNVeBsZnzYQcM16dL2~vZ425-9rC24W8IZecqDuQUrC1b-ZVQR3oeDAn5P4G37B~zZp6ouzZdWMETDvxgOVjDvGajtsJN57Tyq~IYbsBKZzCCO5PHqTBoqhZvIaHYUy0I9yVySRQvSBkcQ__&Key-Pair-Id=K26P5T5R5SE85C"
          alt="img"
          className="w-[100%] rounded-md"
        />
        <div className="flex justify-between bg-white mt-3 rounded-md pt-4 pb-4 p-2">
          <div className="w-[33%] border-r-2 font-normal">
            <UserOutlined />
            <span className="ml-1">5'5''</span>
          </div>
          <div className="w-[33%] border-r-2">
            <UserOutlined />
            <span className="ml-1">Athletic</span>
          </div>
          <div>
            <UserOutlined />
            <span className="ml-1">Single</span>
          </div>
        </div>
        <div className="flex justify-between bg-white mt-2 rounded-md pt-4 pb-4 p-2">
          <div className="w-[50%] border-r-2">
            <UserOutlined />
            <span className="ml-1">Active: 1 d ago</span>
          </div>
          <div>
            <UserOutlined />
            <span className="ml-1">Canada</span>
          </div>
        </div>
        <div className="flex justify-between bg-white mt-2 rounded-md pt-4 pb-4 p-2">
          <div>
            <UserOutlined />
            <span className="ml-1">Vancouver, BC, CA</span>
          </div>
        </div>
        <div className=" bg-white mt-4 rounded-md pt-4 pb-4 p-2">
          <div className="flex justify-between">
            <div className="">
              <UserOutlined />
              <span className="ml-1">Member Since</span>
            </div>
            <div>
              <UserOutlined />
              <span className="ml-1">Jun 15, 2024</span>
            </div>
          </div>
          <hr className="mt-4 mb-4"></hr>
          <div className="flex justify-start">
            <UserOutlined />
            <span className="ml-1">Verifications</span>
          </div>
          <div className="flex justify-between mt-3 pl-5 pr-5">
            <UserOutlined />
            <UserOutlined />
            <UserOutlined />
            <UserOutlined />
            <UserOutlined />
            <UserOutlined />
          </div>
          <hr className="mt-5 mb-3"></hr>
        </div>

        <div className="flex justify-center gap-3 items-center border-2 rounded-md bg-white border-red-600 pt-2 pb-2 hover:bg-[#F0E5D9] cursor-pointer mt-3">
          <GiftOutlined
            style={{
              fontSize: "20px",
              color: "red",
              padding: "3px",
            }}
          />
          <span className="text-red-500">Gift Wishlist</span>
          <span className="p-1 bg-red-500 rounded-full">18</span>
        </div>

        <div className="flex justify-center gap-3 items-center border-2 rounded-md bg-white border-slate-200 pt-2 pb-2 hover:border-slate-400 cursor-pointer mt-3">
          <span className="p-1 text-slate-500 rounded-sm">User Notes</span>
        </div>
      </div>
      <div className="w-[65%] p-2">
        <div className="flex justify-between">
          <div>
            <p className="text-2xl">Valentina , 27</p>
            <p className="text-xl">Aventura, FL</p>
            <p className="text-md">charming girl</p>
          </div>
          <div className="group">
            <EllipsisOutlined
              style={{
                fontSize: "40px",
                color: "gray",
                padding: "3px",
                border: "1px solid gray",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              className="hover:border-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
