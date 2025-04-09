import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa"
import Image from "next/image"

export default function PedidosSection() {
  return (
    <section
      id="pedidos"
      className="flex flex-col md:flex-row items-center justify-between px-6 py-16 bg-orange-50 rounded-2xl shadow-lg mt-20 gap-10 max-w-6xl mx-auto"
    >
      {/* Imagen decorativa */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/doraditas.jpeg"
          alt="Empanadas"
          width={320}
          height={320}
          className="rounded-2xl shadow-md object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="w-full md:w-1/2 flex flex-col items-center text-center gap-6">
        <h2 className="text-4xl font-extrabold text-orange-600 leading-tight">
          ¿Querés hacer un pedido?
        </h2>

        <p className="text-gray-700 text-lg max-w-md">
          Registrate para pedir por la web y ganá empanadas <span className="font-bold text-orange-500">DORADAS</span>, o hacelo directamente por WhatsApp.
        </p>

        <div className="bg-yellow-100 border border-yellow-300 rounded-xl px-4 py-3 shadow-inner text-yellow-800 text-md font-medium">
          Cada compra <span className="text-orange-600 font-bold">POR LA WEB</span> te suma <span className="font-bold">1 empanada DORADA</span><br />
          ¡Juntá 7 y reclamá tu <span className="text-orange-500 font-extrabold">DOCENA!</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
          <Link
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition duration-300 w-full sm:w-auto text-center shadow"
          >
            Iniciar sesión
          </Link>
          <a
            href="https://wa.me/5491123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition duration-300 w-full sm:w-auto shadow"
          >
            <FaWhatsapp size={20} />
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
