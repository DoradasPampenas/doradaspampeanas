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
        <h2 className="text-4xl font-bold text-orange-300 leading-tight">
          ¿Querés hacer un pedido?
        </h2>

        <p className="text-yellow-400 text-lg max-w-md text-justify-center">
          Registrate para pedir por la web y ganá empanadas <br/> <span className="font-bold text-gold-200">🥟DORADAS🥟</span><br/> o hacelo directamente por WhatsApp.
        </p>

        <div className="bg-yellow-100 border border-yellow-300 rounded-xl px-4 py-3 shadow-inner text-yellow-800 text-md font-medium">
          Cada compra <span className="text-orange-600 font-bold">POR LA WEB de una DOCENA o MAS</span> te suma <span className="font-bold">1 empanada DORADA</span><br />
          ¡Juntá 7 y reclamá tu <span className="text-orange-500 font-extrabold">DOCENA!</span>
        </div>

      </div>
    </section>
  )
}
