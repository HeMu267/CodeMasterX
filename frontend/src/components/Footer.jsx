import React from 'react';
import { SiYoutube } from "react-icons/si";
import { FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { BsGooglePlay } from "react-icons/bs";
import {CodeIcon} from "./Icon";
const Footer = () => {
  return (
    <footer className="bg-gray-950 p-10 text-white py-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <CodeIcon/>
          <span className="text-2xl font-bold">CodeMaster</span>
        </div>
        <div className="flex space-x-16">
          <div>
            <h4 className="text-lg font-bold mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">CodeMaster</a></li>
              <li><a href="https://github/heMu267" className="hover:underline">GitHub</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-2">Download App</h4>
            <a href="#">
              <BsGooglePlay className='h-10 w-20'/>
            </a>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-2">Follow us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">
                <BsTwitterX className='h-6 w-10'/>
              </a>
              <a href="#" className="hover:underline">
                <FaInstagram className='h-6 w-10'/>
              </a>
              <a href="#" className="hover:underline">
                <SiYoutube className='h-6 w-10'/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
