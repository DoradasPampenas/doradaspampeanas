import Image from "next/image"
import { FaInstagram, FaWhatsapp } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-orange-50 text-black px-4 py-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Image src="/LOGOREAL.png" alt="Logo" width={150} height={100} />

        {/* Redes Sociales */}
        <div className="flex items-center">
          <a 
            href="https://www.instagram.com/tucuenta" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-4 bg-pink-500 text-white p-2 rounded-full hover:scale-110 transition"
          >
            <FaInstagram size={20} />
          </a>
          <a 
            href="https://wa.me/5491123456789" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-4 bg-green-500 text-white p-2 rounded-full hover:scale-110 transition"
          >
            <FaWhatsapp size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}
