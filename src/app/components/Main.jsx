import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa"
import PedidosSection from "./PedidosSection"
import MenuSection from "./MenuSection"

export default function Main() {
  return (
    <main className="flex-1 px-6 max-w-6xl mx-auto">

      {/* Sección Pedidos */}
      <section id="pedidos">
        <PedidosSection/>
      </section>  

      {/* Sección Menú */}
      {/* <section id="menu" className="my-12 bg-orange-50 rounded-xl shadow-xl p-6">
        <h2 className="text-4xl font-bold mb-12 text-left text-orange-600">Doraditas de:</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
         
          <div className="bg-orange-50 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
          <img
            src="https://www.infobae.com/resizer/v2/7ULLO5LYNBAOVPPGVXJAS7RIRU.jpg?auth=25e723ef281cb2a9bd857233de8511cd8d1e5a74c395d640fafcc2a19b72286c&smart=true&width=350&height=233&quality=85"
            alt="Empanada de carne"
            className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Carne Clásica</h3>
              <p className="text-sm text-gray-600 mb-4">Sabor tradicional con carne jugosa y condimentos.</p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition">
                Agregar al pedido
              </button>
            </div>
          </div>


          <div className="bg-orange-50 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
          <img
            src="https://www.infobae.com/resizer/v2/7ULLO5LYNBAOVPPGVXJAS7RIRU.jpg?auth=25e723ef281cb2a9bd857233de8511cd8d1e5a74c395d640fafcc2a19b72286c&smart=true&width=350&height=233&quality=85"
            alt="Empanada de carne"
            className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Pollo</h3>
              <p className="text-sm text-gray-600 mb-4">Trozos de pollo al estilo casero con un toque de cebolla.</p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition">
                Agregar al pedido
              </button>
            </div>
          </div>


          <div className="bg-orange-50 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
          <img
            src="https://www.infobae.com/resizer/v2/7ULLO5LYNBAOVPPGVXJAS7RIRU.jpg?auth=25e723ef281cb2a9bd857233de8511cd8d1e5a74c395d640fafcc2a19b72286c&smart=true&width=350&height=233&quality=85"
            alt="Empanada de carne"
            className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Jamón y Queso</h3>
              <p className="text-sm text-gray-600 mb-4">Queso fundido con jamón cocido.</p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition">
                Agregar al pedido
              </button>
            </div>
          </div>


          <div className="bg-orange-50 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
          <img
            src="https://www.infobae.com/resizer/v2/7ULLO5LYNBAOVPPGVXJAS7RIRU.jpg?auth=25e723ef281cb2a9bd857233de8511cd8d1e5a74c395d640fafcc2a19b72286c&smart=true&width=350&height=233&quality=85"
            alt="Empanada de carne"
            className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Verduras</h3>
              <p className="text-sm text-gray-600 mb-4">Espinaca, acelga, queso.</p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition">
                Agregar al pedido
              </button>
            </div>
          </div>
        </div>
      </section> */}
      <MenuSection />

      <section id="ubicacion" className="px-4 py-12 bg-orange-50 rounded-2xl">
             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        
                {/* Texto */}
                <div className="lg:w-1/2 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-orange-600 mb-4">¿Dónde estamos?</h2>
                    <p className="text-gray-700 text-lg mb-6">
                        Nos encontramos en Santa Rosa, La Pampa. Retirá tus empanadas o pedí delivery en minutos. Sabor casero, atención cálida.
                    </p>
                    <p className="text-gray-600 text-sm">
                        🕒 Horario de atención: Lunes a Sábados de 19:00 a 23:30 hs.
                    </p>
                </div>

                {/* Mapa */}
                <div className="w-full lg:w-1/2 h-64 sm:h-96">
                <iframe
                    title="Mapa ubicación Doraditas"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52548.24252508766!2d-64.317144!3d-36.616672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95c2cd295dc7fddf%3A0xb2a78e4c75fd46a4!2sSanta%20Rosa%2C%20La%20Pampa!5e0!3m2!1ses-419!2sar!4v1681342208893!5m2!1ses-419!2sar"
                    width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-2xl shadow-md"
                    ></iframe>
                </div>
             </div>
        </section>


    </main>
  )
}
