
function About() {
  return (
    <section id="about" className="py-[72px] max-w-7xl px-6 mx-auto bg-white">
        <div className='w-full flex flex-col lg:flex-row gap-[20px] lg:gap-[130px]'>
            <h1 className='font-medium whitespace-nowrap text-[#020202]' style={{fontSize: 'clamp(40px, 8vw, 64px)'}}>About Us</h1>
            <p className='text-justify' style={{fontSize: 'clamp(16px, 2.5vw, 18px)'}}>Arham Rubber International, a division of ISO-certified American Rubber Industries, is a premier manufacturer and supplier of high-performance industrial rubber products. We specialize in producing a diverse range of rubber sheets, hoses, and electrical insulating mats, along with custom rubber molded parts tailored to meet unique client specifications. Our product portfolio includes an extensive variety of industrial hoses for applications such as water, steam, chemical transfer, cement discharge, sand blasting, hydraulic systems, and refrigeration charging lines. Additionally, we offer specialized solutions like composite hoses for tanker loading, stainless steel braided hoses, and rubber profiles including rubber beading. Dedicated to quality and innovation, Arham Rubber International is committed to providing reliable and durable products for industrial applications worldwide.</p>
        </div>
    </section>
  )
}

export default About