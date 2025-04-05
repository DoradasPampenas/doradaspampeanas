import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa"
import Image from "next/image"

export default function PedidosSection() {
  return (
    <section
      id="pedidos"
      className="flex flex-col md:flex-row items-center justify-center text-center px-6 py-12 bg-orange-50 rounded-xl shadow mt-16 gap-8"
    >
      {/* Imagen decorativa */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/doraditas.jpeg" // Asegurate de tener esta imagen en /public
          alt="Empanadas"
          width={300}
          height={300}
          className="rounded-xl shadow"
        />
      </div>

      {/* Contenido */}
      <div className="w-full md:w-1/2 flex flex-col items-center gap-4">
        <h2 className="text-3xl font-bold text-orange-600">
          ¿Querés hacer un pedido?
        </h2>

        <p className="text-gray-700">
          Registrate para pedir por la web o hacelo directamente por WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/login"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Iniciar sesión
          </Link>
          <a
            href="https://wa.me/5491123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition"
          >
            <FaWhatsapp />
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
