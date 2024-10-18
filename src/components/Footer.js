import React from 'react';
import { Link } from "react-router-dom";
const Footer = () => {
    return (
        <footer className="bg-[#2C2D2E] text-white py-6 hidden md:block">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-3 space-y-4 md:space-y-0">
                <div className="flex flex-wrap justify-center items-center space-x-5 text-center sm:flex-nowrap">
                    <Link
                        to="https://www.fansmaps.com/user/select-plan"
                        className="bg-red-500 text-white text-[14px] py-1 px-2 rounded hover:bg-orange-600 mb-2 sm:mb-0"
                    >
                        Post a Free Profile
                    </Link>
                    <span className="hidden sm:inline">|</span>
                    <Link
                        to="https://affiliate.fansmaps.com/"
                        className="text-white text-[14px] ease-in duration-300 hover:text-red-600 mb-2 sm:mb-0"
                    >
                        Affiliate Program
                    </Link>
                    <span className="hidden sm:inline">|</span>
                    <Link
                        to="https://www.fansmaps.com/post/about-fansmaps"
                        className="text-white text-[14px] ease-in duration-300 hover:text-red-600 mb-2 sm:mb-0"
                    >
                        What is Fans Maps
                    </Link>
                    <span className="hidden sm:inline">|</span>
                    <Link
                        to="https://www.fansmaps.com/contact"
                        className="text-white text-[14px] ease-in duration-300 hover:text-red-600 mb-2 sm:mb-0"
                    >
                        Contact
                    </Link>
                    <span className="hidden sm:inline">|</span>
                    <Link
                        to="https://www.fansmaps.com/post/privacy-policy"
                        className="text-white text-[14px] ease-in duration-300 hover:text-red-600 mb-2 sm:mb-0"
                    >
                        Privacy
                    </Link>
                    <span className="hidden sm:inline">|</span>
                    <Link
                        to="https://www.fansmaps.com/post/content-guidelines"
                        className="text-white text-[14px] ease-in duration-300 hover:text-red-600 mb-2 sm:mb-0"
                    >
                        Content Guidelines
                    </Link>
                    <span className="hidden sm:inline">|</span>
                    <Link
                        to="https://www.fansmaps.com/post/tou"
                        className="text-white text-[14px] ease-in duration-300 hover:text-red-600 mb-2 sm:mb-0"
                    >
                        Terms
                    </Link>
                    <span className="hidden sm:inline">|</span>
                    <Link
                        to="https://www.fansmaps.com/"
                        className="text-white text-[14px] ease-in duration-300 hover:text-red-600 mb-2 sm:mb-0"
                    >
                        Home
                    </Link>
                </div>
                <div className="text-white text-[14px]">
                    Copyright © 2024 Fansmaps. All rights reserved.
                </div>
            </div>
        </footer>

    );
};

export default Footer;
