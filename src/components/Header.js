import React, { useState, useEffect } from 'react';
import { DownOutlined, SettingOutlined, LogoutOutlined, MessageOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button, Avatar } from 'antd';
import pic from "../images/photo.jfif";  // Default profile picture
import logo from "../images/logo-white.png";
import logoMobile from "../images/favicon-96.png";
import { useLocation } from "react-router-dom";
import getCookie from '../utils/getCookie';
const Header = ({ userDetail, selectedUserList, countUnRead, setCountUnRead, socket }) => {
    const { id: loggedId } = getCookie("loggedin");
    const location = useLocation();
    const path = location.pathname.split("/")[1];
    const logourl = "https://www.fansmaps.com/pictures/logo/";
    const [menuVisible, setMenuVisible] = useState(false);


    const handleMenuClick = () => {
        setMenuVisible(!menuVisible);
    };

    const handleLogout = () => {
        if (loggedId && socket) {
            socket.emit("userLeftChat", loggedId);
        }
        window.location.href = "https://www.fansmaps.com/user/sign-out";
    };
    const handleViewProfile = () => {
        const place_slug = userDetail?.place_slug;
        const cat_slug = userDetail?.cat_slug;
        const state_slug = userDetail?.state_slug ?? "state_slug";
        const city_slug = userDetail?.city_slug ?? "city_slug";
        if (!place_slug || !state_slug || !city_slug || !cat_slug) {
            // should not be empty
        } else {
            window.location.href = `https://www.fansmaps.com/listing/${state_slug}/${city_slug}/${cat_slug}/${place_slug}`;
        }
    }

    const getPlans = (planId) => {
        switch (planId) {
            case 1:
                return "Free";
            case 5:
                return "Platinum";
            case 6:
                return "Basic Sugar Daddy";
            case 8:
                return "Whale Sugar Daddy";
            default:
                return "Free";
        }
    };

    const menuItems = [
        {
            key: '1',
            label: (
                <div className="flex items-center py-4">
                    <div>
                        <Avatar size={64} src={userDetail?.logo ? `${logourl}${userDetail.logo.slice(0, 2)}/${userDetail.logo}` : pic} />
                    </div>
                    <div className="flex flex-col items-center px-2 gap-1">
                        <p className="text-sm font-semibold mt-2">{userDetail?.place_name || ''}</p>
                        <span className="text-xs text-gray-500">{getPlans(userDetail?.plan)}</span>
                        <Button
                            onClick={() =>
                                (window.location.href = "https://www.fansmaps.com/user/select-plan")
                            }
                            className="w-full bg-[#a6784c] text-white font-semibold mb-2"
                        >
                            Upgrade to Unlimited
                        </Button>
                    </div>
                </div>
            )
        },
        { type: 'divider' },
        {
            key: '2',
            label: (
                <Button
                    onClick={() => window.location.href = "https://www.fansmaps.com/user/my-listings"}
                    className="w-full border border-gray-300 mb-2"
                >
                    Edit Profile
                </Button>
            ),
        },
        {
            key: '3',
            label: <Button onClick={handleViewProfile} className="w-full border border-gray-300 mb-2">View Profile</Button>,
        },
        { type: 'divider' },
        {
            key: '4',
            icon: <SettingOutlined />,
            label: (<span onClick={() => window.location.href = "https://www.fansmaps.com/user/my-profile"}>My Account Dashboard</span>),
        },
        { type: 'divider' },
        {
            key: '5',
            icon: <LogoutOutlined />,
            label: 'Log Out',
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <header className="flex bg-[#2C2D2E] justify-between items-center p-4 h-[64px]">
            <div className="hidden sm:flex items-center space-x-6">
                <div onClick={() => window.location.href = "https://www.fansmaps.com"} className="flex items-center space-x-2 cursor-pointer">
                    <img src={logo} alt="fansmaps Logo" className="h-10" />
                </div>
                <nav className="flex items-center space-x-6">
                    <div className='flex flex-col items-center py-1'>
                        <div className='relative'>
                            <MessageOutlined style={{ color: "#fff" }} />
                            <span className={`absolute left-3 -top-1 inline-flex justify-center box-border items-center text-center max-w-full cursor-default px-1 h-4  text-xs font-semibold rounded-[4px] text-white   ${countUnRead > 0 ? "bg-red-600 border border-solid" : ""} `}>{countUnRead > 0 ? countUnRead : ""}</span>
                        </div>

                        <span className="text-white underline cursor-pointer">Messages</span>
                    </div>
                    <button
                        onClick={() =>
                            (window.location.href = "https://www.fansmaps.com/user/select-plan")
                        }
                        className="bg-[#a6784c] text-white py-1 px-3 rounded hover:bg-opacity-80"
                    >
                        Upgrade to Unlimited
                    </button>
                </nav>
            </div>
            <div className="flex sm:hidden items-center justify-between shadow-sm">
                <div className="flex items-center">
                    <img src={logoMobile} alt="Logo" className="h-8 w-8 rounded-full" />
                    <span onClick={() => window.location.href = "https://www.fansmaps.com/user/select-plan"} className="ml-2 text-[15px] text-stone-50 bg-[#A48566] font-bold p-1 rounded-md">
                        Unlimited Upgrade
                    </span>
                </div>
            </div>


            <Dropdown
                overlay={<Menu items={menuItems} />}
                trigger={['click']}
                visible={menuVisible}
                onVisibleChange={setMenuVisible}
            >
                <div className="flex items-center space-x-2 cursor-pointer" onClick={handleMenuClick}>
                    <Avatar src={userDetail?.logo ? `${logourl}${userDetail.logo.slice(0, 2)}/${userDetail.logo}` : pic} className="h-8 w-8 rounded-full" />
                    <span className="text-white">{userDetail?.place_name || ''}</span>
                    <DownOutlined className="text-white" />
                </div>
            </Dropdown>
        </header>

    );
};

export default Header;
