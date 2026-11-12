
export default function Home() {
  

const projects = [
  {
    name: "OWAITU SAFARIS",
    category: "Corporate Brand Identity",
    description:
      "A professional travel identity designed to connect people to the world through memorable visual communication.",
    images: [
      "/images/portfolio/owaitu-safaris/office-branding.webp",
      "/images/portfolio/owaitu-safaris/brand-logo.webp",
      "/images/portfolio/owaitu-safaris/website-mockup.webp",
    ],
  },
  {
    name: "MS MAINDE HAIR LINE",
    category: "Beauty Branding & Packaging",
    description:
      "A distinctive beauty brand identity extended across delivery packaging, retail signage and promotional merchandise.",
    images: [
      "/images/portfolio/ms-mainde-hair-line/delivery-bag-mockup.webp",
      "/images/portfolio/ms-mainde-hair-line/logo-identity.webp",
      "/images/portfolio/ms-mainde-hair-line/shop-signage.webp",
    ],
  },
  {
    name: "TAWA COFFEE",
    category: "Brand Identity & Packaging",
    description:
      "A distinctive coffee identity combining bold typography, warm colours and professional packaging applications.",
    images: [
      "/images/portfolio/tawa-coffee/brand-identity-board.webp",
      "/images/portfolio/tawa-coffee/coffee-packaging.webp",
      "/images/portfolio/tawa-coffee/shopping-bag-mockup.webp",
    ],
  },
  {
    name: "GEE JUICE POINT",
    category: "Product & Brand Identity",
    description:
      "A fresh product identity developed through packaging, visual communication and branded uniforms.",
    images: [
      "/images/portfolio/gee-juice-point/brand-overview.webp",
      "/images/portfolio/gee-juice-point/can-packaging.webp",
      "/images/portfolio/gee-juice-point/uniform-apron.webp",
    ],
  },
];



const services = [
  "Brand Identity Design",
  "Logo Design",
  "Graphic Design",
  "Packaging Design",
  "Social Media Design",
  "Printing & Creative Solutions",
];


  return (
    <main className="min-h-screen bg-[#F5F1E9] text-[#171717]">


      {/* NAVIGATION */}
      <nav className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-16 py-6 border-b border-[#DED8CE]">

        {/* LOGO */}
        <a href="#home" className="shrink-0">
          <img
            src="/graphicollins-logo.png"
            alt="Graphicollins"
            className="h-11 w-auto object-contain"
          />
        </a>

        {/* NAVIGATION LINKS */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-medium">
          <a href="#home" className="hover:text-[#C58A45] transition-colors">
            Home
          </a>

          <a href="#about" className="hover:text-[#C58A45] transition-colors">
            About
          </a>

          <a href="#portfolio" className="hover:text-[#C58A45] transition-colors">
            Portfolio
          </a>

          <a href="#services" className="hover:text-[#C58A45] transition-colors">
            Services
          </a>

          <a href="#pricing" className="hover:text-[#C58A45] transition-colors">
            Pricing
          </a>
        </div>

        {/* CONTACT BUTTON */}
        <a
          href="/project-inquiry"
          className="bg-[#171717] text-white px-6 py-3 rounded-full text-sm hover:bg-[#C58A45] transition shrink-0"
        >
          Let's Talk ↗
        </a>

      </nav>


      {/* HERO SECTION */}
      <section
        id="home"
        className="grid md:grid-cols-2 gap-12 md:gap-16 px-6 md:px-16 py-20 md:py-28 items-center"
      >
        {/* LEFT CONTENT */}
        <div>
          <p className="uppercase text-xs tracking-[0.35em] text-[#C58A45] mb-8">
            Independent Creative Design Studio
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-[82px] font-semibold leading-[1.08] tracking-tight">
            Turning Ideas
            <br />
            Into
            <br />
            <span className="font-serif italic font-normal text-[#C58A45]">
              Iconic Brands.
            </span>
          </h1>

          <p className="text-[#77736C] leading-8 max-w-md mt-8 text-base">
            We build meaningful visual identities and creative experiences
            that help businesses stand out and make a lasting impression.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#portfolio"
              className="bg-[#C58A45] text-white px-8 py-4 rounded-full text-sm hover:bg-[#171717] transition"
            >
              Explore Our Work ↗
            </a>

            <a
             href="/project-inquiry"
              className="border border-[#171717] px-8 py-4 rounded-full text-sm hover:bg-[#171717] hover:text-white transition"
            >
              Start a Project
            </a>
          </div>

          <div className="mt-16 pt-6 border-t border-[#DED8CE] flex gap-12">
            <div>
              <p className="text-2xl font-semibold">Creative</p>
              <p className="text-xs text-[#77736C] mt-2">Thinking</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">Distinctive</p>
              <p className="text-xs text-[#77736C] mt-2">Identities</p>
            </div>
          </div>
        </div>

        {/* RIGHT PORTFOLIO SHOWCASE */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">

     <div className="relative min-h-[240px] md:min-h-[320px] overflow-hidden group">
  <img
    src="/images/portfolio/tawa-coffee/brand-identity-board.webp"
    alt="TAWA Coffee branding"
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
  />
</div>
            <div className="relative min-h-[240px] md:min-h-[320px] overflow-hidden rounded-lg group mt-12">
  <img
    
src="/images/portfolio/owaitu-safaris/brand-logo.webp"

    alt="OWAITU SAFARIS brand identity"
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
  />
</div>

            <div className="relative min-h-[190px] md:min-h-[190px] overflow-hidden rounded-lg group -mt-4">
  <img
    src="/images/portfolio/ms-mainde-hair-line/logo-identity.webp"
    alt="MS MAINDE Hair Line Brand Identity"
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
  />
</div>

            <div className="relative min-h-[190px] overflow-hidden rounded-lg group">
  <img
    src="/images/portfolio/gee-juice-point/brand-overview.webp"
    alt="GEE JUICE POINT brand identity"
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
  />
</div>

          </div>

          <p className="text-[10px] tracking-[0.3em] text-[#77736C] mt-6 text-right uppercase">
            Selected Creative Works — 2026
          </p>
        </div>
      </section>

      
{/* ABOUT SECTION */}
<section id="about" className="bg-white px-6 md:px-16 py-28 md:py-36">
  <div className="max-w-7xl mx-auto">

    <p className="text-xs tracking-[0.3em] text-[#C58A45] uppercase mb-12">
      About the Creative Studio
    </p>

    <div className="grid md:grid-cols-2 gap-12 md:gap-20">

      {/* LEFT: HEADLINE */}
      <div>
        <h2 className="text-5xl md:text-7xl font-semibold leading-[1.1] text-black">
          We don't just design brands.
          <br />
          <span className="font-serif italic text-[#C58A45]">
            We give them identity.
          </span>
        </h2>
      </div>

      {/* RIGHT: INTRODUCTION */}
      <div className="flex flex-col justify-center">
        <p className="text-lg md:text-xl text-[#77736C] leading-relaxed">
          I am the creative mind behind GRAPHICOLLINS, an independent
          creative design studio dedicated to transforming ideas
          into powerful visual identities. Through strategic thinking,
          creativity and purposeful design, I help businesses
          communicate their value, establish recognition and build
          brands that leave a lasting impression.
        </p>

        <p className="text-sm font-semibold text-black mt-8">
          Turning ideas into iconic brands.
        </p>

        <div className="mt-10">
          <a
            href="#portfolio"
            className="inline-block border-b border-[#C58A45] pb-2 text-sm font-medium text-black hover:text-[#C58A45] transition"
          >
            Explore My Creative Journey →
          </a>
        </div>
      </div>

    </div>

    {/* MISSION AND PHILOSOPHY */}
    <div className="grid md:grid-cols-3 gap-10 mt-28 pt-12 border-t border-gray-200">

      <div>
        <p className="text-xs tracking-widest text-[#C58A45] uppercase mb-5">
          01 / My Mission
        </p>
        <h3 className="text-2xl font-semibold text-black mb-4">
          Design with Purpose.
        </h3>
        <p className="text-sm text-[#77736C] leading-7">
          To transform ideas into meaningful designs that help
          businesses communicate clearly, build recognition and
          connect with their audiences.
        </p>
      </div>

      <div>
        <p className="text-xs tracking-widest text-[#C58A45] uppercase mb-5">
          02 / My Vision
        </p>
        <h3 className="text-2xl font-semibold text-black mb-4">
          Create Beyond Limits.
        </h3>
        <p className="text-sm text-[#77736C] leading-7">
          To build a globally recognized creative studio that
          champions originality, innovation and exceptional
          visual experiences.
        </p>
      </div>

      <div>
        <p className="text-xs tracking-widest text-[#C58A45] uppercase mb-5">
          03 / My Philosophy
        </p>
        <h3 className="text-2xl font-semibold text-black mb-4">
          Creativity with Meaning.
        </h3>
        <p className="text-sm text-[#77736C] leading-7">
          Every design should tell a story, communicate a purpose
          and create an impression that lasts beyond the first look.
        </p>
      </div>

    </div>

  </div>
</section>


      
{/* PORTFOLIO SECTION */}

<section
  id="portfolio"
  className="bg-[#F5F1E9] px-6 md:px-16 py-24"
>
  <div className="max-w-7xl mx-auto">

    <p className="text-xs tracking-[0.3em] text-[#C58A45] uppercase mb-5">
      Selected Projects — 2026
    </p>

    <div className="flex flex-wrap justify-between items-end gap-6 mb-16">

      <h2 className="text-4xl md:text-6xl font-semibold">
        Selected Creative
        <br />
        <span className="font-serif italic text-[#C58A45]">
          Works.
        </span>
      </h2>

      <p className="text-sm text-[#77736C] max-w-sm leading-7">
        A collection of brand identities, packaging designs
        and creative applications developed to make
        businesses recognizable and memorable.
      </p>

    </div>

    <div className="grid md:grid-cols-2 gap-x-10 gap-y-20">

      {projects.map((project, index) => (

        <article key={project.name} className="group">

          {/* PROJECT IMAGES */}   
<div className="grid grid-cols-2 gap-3">
  {project.images.map((image, imageIndex) => (
    <div
      key={image}
      className={`group relative overflow-hidden rounded-xl bg-white border border-[#E9E1D8] ${
        imageIndex === 0
          ? "col-span-2 aspect-[16/9]"
          : "aspect-[4/5]"
      }`}
    >
      <img
        src={image}
        alt={`${project.name} mockup ${imageIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
    </div>
  ))}
</div>

        

          {/* PROJECT INFORMATION */}

          <div className="flex justify-between items-center mt-7">

            <span className="text-xs tracking-widest text-[#C58A45]">
              PROJECT 0{index + 1}
            </span>

            <span className="text-xs text-[#77736C]">
              {project.category}
            </span>

          </div>

          <h3 className="text-2xl md:text-3xl font-semibold mt-4">
            {project.name}
          </h3>

          <p className="text-sm text-[#77736C] mt-3 leading-7 max-w-lg">
            {project.description}
          </p>

          <div className="border-b border-[#DED8CE] mt-7" />

        </article>

      ))}

    </div>

    <div className="mt-20 text-center">

      <p className="text-xs tracking-[0.3em] text-[#C58A45] uppercase">
        GRAPHICOLLINS CREATIVE STUDIO
      </p>

      <p className="text-sm text-[#77736C] mt-3">
        Turning ideas into iconic brands.
      </p>

    </div>

  </div>
</section>

      {/* SERVICES SECTION */}
      <section id="services" className="bg-[#171717] text-white px-6 md:px-16 py-24">
        <p className="text-xs tracking-[0.3em] text-[#C58A45] uppercase mb-6">
          What We Do
        </p> 

<h2 className="text-4xl md:text-6xl font-medium tracking-tight">
  Creative solutions.
  <br />
  <span className="font-serif italic font-normal text-[#C58A45]">
    Meaningful impact.
  </span>
</h2>

<div className="grid md:grid-cols-2">
  {services.map((service, index) => (
    <a
      key={service}
      href={`#${service.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
      className="flex items-center justify-between py-7 border-t border-white/20 group hover:text-[#C58A45] transition-colors"
    >
      <div className="flex gap-6 items-center">
        <span className="text-[#C58A45] text-sm">
          0{index + 1}
        </span>

        <h3 className="text-lg md:text-xl">
          {service}
        </h3>
      </div>

      <span className="text-[#C58A45]">↗</span>
    </a>
  ))}
</div>
</section>
{/* GRAPHICOLLINS PRICING SECTION */}
<section id="pricing" className="bg-[#F8F7F4] px-6 md:px-16 py-28">

  <div className="max-w-7xl mx-auto">

    {/* SECTION INTRO */}
    <p className="text-xs tracking-[0.3em] text-[#C58A45] uppercase mb-5">
      Investment & Pricing
    </p>
    <div className="grid md:grid-cols-2 gap-10 mb-16">
      <h2 className="text-4xl md:text-6xl font-semibold leading-tight text-black">
        Great design.
        <br />
        <span className="font-serif italic text-[#C58A45]">
          Worth the investment.
        </span>
      </h2>

      <p className="text-[#77736C] text-lg leading-8 md:self-end">
        Creative solutions designed to give your business a distinctive
        identity. Explore our packages and find the right creative
        investment for your brand.
      </p>
    </div>

    {/* 01 BRANDING PACKAGES */}
    <div className="mb-24">

      <div className="mb-10">
        <p className="text-xs tracking-widest text-[#C58A45] mb-3">
          01 / BRAND DEVELOPMENT
        </p>
        <h3 className="text-3xl md:text-4xl font-semibold text-black">
          Branding Packages
        </h3>
        <p className="text-gray-500 mt-3">
          Build a brand that people recognize and remember.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* LOGO STARTER */}
        <div className="bg-white border border-gray-200 p-8 flex flex-col">
          <p className="text-xs tracking-widest text-black">
            01 / LOGO STARTER
          </p>

          <h4 className="text-2xl font-semibold mt-5 text-gray-600">
            Logo Starter
          </h4>

          <p className="text-black text-sm mt-3">
            A foundation for new businesses and emerging brands.
          </p>

          <div className="my-8">
            <p className="text-3xl font-bold text-gray-600">TZS 150,000</p>
            <p className="text-sm text-[#C58A45] mt-2">≈ USD 57</p>
          </div>

          <div className="border-t border-black/30 pt-6 space-y-4 text-sm text-black flex-1">
            <p>✓ Logo concept</p>
            <p>✓ 2 initial concepts</p>
            <p>✓ 2 revisions</p>
            <p>✓ PNG / JPG formats</p>
            <p>✓ Transparent logo</p>
            <p>✓ Basic colour palette</p>
          </div>

          <a href="mailto:graphicollins@gmail.com?subject=Logo%20Starter%20Package"
            className="mt-10 text-center border border-black py-4 text-sm font-semibold hover:bg-black hover:text-white transition">
            Get Started →
          </a>
        </div>

        {/* BRAND ESSENTIAL */}
        <div className="bg-[#171717] text-white p-8 flex flex-col">
          <p className="text-xs tracking-widest text-[#C58A45]">
            02 / BRAND ESSENTIAL
          </p>

          <h4 className="text-2xl font-semibold mt-5">
            Brand Essential
          </h4>

          <p className="text-gray-400 text-sm mt-3">
            A professional identity for growing businesses.
          </p>

          <div className="my-8">
            <p className="text-3xl font-bold">TZS 400,000</p>
            <p className="text-sm text-[#C58A45] mt-2">≈ USD 151</p>
          </div>

          <div className="border-t border-gray-700 pt-6 space-y-4 text-sm text-gray-300 flex-1">
            <p>✓ Professional logo</p>
            <p>✓ Colour palette</p>
            <p>✓ Typography</p>
            <p>✓ Business card</p>
            <p>✓ Letterhead</p>
            <p>✓ Social media profile image</p>
            <p>✓ Basic brand guidelines</p>
          </div>

          <a href="mailto:graphicollins@gmail.com?subject=Brand%20Essential%20Package"
            className="mt-10 text-center bg-[#C58A45] text-black py-4 text-sm font-semibold hover:bg-white transition">
            Choose This Package →
          </a>
        </div>

        {/* FULL BRAND IDENTITY */}
        <div className="bg-[#C58A45] border border-[#C58A45] p-8 flex flex-col text-[#171717]">
          <p className="text-xs tracking-widest text-[#FFFFFF]">
            03 / FULL BRAND IDENTITY
          </p>

          <h4 className="text-2xl font-semibold mt-5 text-white">
            Full Brand Identity
          </h4>

          <p className="text-gray-500 text-sm mt-3">
            A complete visual identity and brand experience.
          </p>

          <div className="my-8">
            <p className="text-3xl font-bold text-black">TZS 1,000,000</p>
            <p className="text-sm text-[#FFFFFF] mt-2">≈ USD 378</p>
          </div>

          <div className="border-t pt-6 space-y-4 text-sm text-gray-600 flex-1">
            <p>✓ Logo system</p>
            <p>✓ Primary & secondary logo</p>
            <p>✓ Colour system</p>
            <p>✓ Typography system</p>
            <p>✓ Brand guidelines</p>
            <p>✓ Business card</p>
            <p>✓ Letterhead</p>
            <p>✓ Social media templates</p>
            <p>✓ Packaging / application mockups</p>
            <p>✓ Brand presentation</p>
          </div>

          <a href="mailto:graphicollins@gmail.com?subject=Full%20Brand%20Identity"
            className="mt-10 text-center border border-black py-4 text-sm font-semibold hover:bg-black hover:text-white transition">
            Choose This Package →
          </a>
        </div>

      </div>
    </div>

    {/* 02 GRAPHIC DESIGN PRICE LIST */}
    <div className="mb-24">

      <p className="text-xs tracking-widest text-[#C58A45] mb-3">
        02 / CREATIVE SERVICES
      </p>

      <h3 className="text-3xl md:text-4xl font-semibold text-black">
        Graphic Design Price List
      </h3>

      <p className="text-gray-500 mt-3 mb-10">
        Flexible design rates for different creative requirements.
      </p>

      <div className="overflow-x-auto bg-white border border-gray-200">
        <table className="w-full min-w-[700px] text-left">

          <thead className="bg-[#171717] text-white">
            <tr>
              <th className="p-5 text-sm">Service</th>
              <th className="p-5 text-sm">Starter</th>
              <th className="p-5 text-sm">Professional</th>
              <th className="p-5 text-sm">Premium</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700">
            {[
              ["Social Media Post", "20,000", "40,000", "60,000", "8", "15", "23"],
              ["Flyer / Poster", "40,000", "60,000", "80,000", "15", "23", "30"],
              ["Business Card", "40,000", "60,000", "80,000", "15", "23", "30"],
              ["Banner Design", "60,000", "80,000", "100,000", "23", "30", "38"],
              ["Menu Design", "60,000", "70,000", "120,000", "23", "26", "45"],
              ["Invitation Card", "25,000", "40,000", "60,000", "9", "15", "23"],
              ["Logo Design", "100,000", "200,000", "350,000", "38", "76", "132"],
              ["Brand Identity", "350,000", "600,000", "1,000,000", "132", "227", "378"],
              ["Packaging Design", "80,000", "150,000", "250,000", "30", "57", "95"],
              ["Billboard Design", "80,000", "150,000", "250,000", "30", "57", "95"],
            ].map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-[#F8F7F4]">
                <td className="p-5 font-semibold text-black">{item[0]}</td>
                <td className="p-5">
                  <span className="block">TZS {item[1]}</span>
                  <span className="text-xs text-[#C58A45]">≈ ${item[4]}</span>
                </td>
                <td className="p-5">
                  <span className="block">TZS {item[2]}</span>
                  <span className="text-xs text-[#C58A45]">≈ ${item[5]}</span>
                </td>
                <td className="p-5">
                  <span className="block">TZS {item[3]}</span>
                  <span className="text-xs text-[#C58A45]">≈ ${item[6]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Prices are per design assignment. Final scope and deliverables
        are confirmed before project commencement.
      </p>
    </div>

    {/* 03 MONTHLY SOCIAL MEDIA PACKAGES */}
    <div className="mb-20">

      <p className="text-xs tracking-widest text-[#C58A45] mb-3">
        03 / MONTHLY CREATIVE SUPPORT
      </p>

      <h3 className="text-3xl md:text-4xl font-semibold text-black">
        Monthly Social Media Packages
      </h3>

      <p className="text-gray-500 mt-3 mb-10">
        Consistent creative content to keep your brand visible and relevant.
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        {/* MONTHLY STARTER */}
        <div className="bg-white border border-gray-200 p-8 flex flex-col">
          <p className="text-xs text-[#C58A45] tracking-widest">
            MONTHLY / STARTER
          </p>

          <h4 className="text-2xl font-semibold mt-5 text-black">
            Starter
          </h4>

          <div className="my-8">
            <p className="text-3xl font-bold text-black">TZS 250,000</p>
            <p className="text-sm text-[#C58A45] mt-2">≈ USD 95 / month</p>
          </div>

          <div className="border-t pt-6 space-y-4 text-sm text-gray-600 flex-1">
            <p>✓ 8 social media designs</p>
            <p>✓ 2 designs per week</p>
            <p>✓ Basic creative direction</p>
            <p>✓ 1 revision per design</p>
          </div>

          <a href="mailto:graphicollins@gmail.com?subject=Monthly%20Starter%20Package"
            className="mt-10 text-center border border-black py-4 text-sm font-semibold hover:bg-black hover:text-white transition">
            Subscribe →
          </a>
        </div>

        {/* MONTHLY BUSINESS */}
        <div className="bg-[#171717] text-white p-8 flex flex-col">
          <p className="text-xs text-[#C58A45] tracking-widest">
            MONTHLY / BUSINESS
          </p>

          <h4 className="text-2xl font-semibold mt-5">
            Business
          </h4>

          <div className="my-8">
            <p className="text-3xl font-bold">TZS 450,000</p>
            <p className="text-sm text-[#C58A45] mt-2">≈ USD 170 / month</p>
          </div>

          <div className="border-t border-gray-700 pt-6 space-y-4 text-sm text-gray-300 flex-1">
            <p>✓ 15 social media designs</p>
            <p>✓ Promotional graphics</p>
            <p>✓ Story designs</p>
            <p>✓ Consistent brand styling</p>
            <p>✓ Up to 2 revisions per design</p>
          </div>

          <a href="mailto:graphicollins@gmail.com?subject=Monthly%20Business%20Package"
            className="mt-10 text-center bg-[#C58A45] text-black py-4 text-sm font-semibold hover:bg-white transition">
            Subscribe →
          </a>
        </div>

        {/* MONTHLY PREMIUM */}
        <div className="bg-[#C58A45] border border-gray-200 p-8 flex flex-col">
          <p className="text-xs text-[#FFFFFF] tracking-widest">
            MONTHLY / PREMIUM
          </p>

          <h4 className="text-2xl font-semibold mt-5 text-black">
            Premium
          </h4>

          <div className="my-8">
            <p className="text-3xl font-bold text-black">TZS 750,000</p>
            <p className="text-sm text-[#FFFFFF] mt-2">≈ USD 284 / month</p>
          </div>

          <div className="border-t pt-6 space-y-4 text-sm text-gray-600 flex-1">
            <p>✓ 25 social media designs</p>
            <p>✓ Posts + stories</p>
            <p>✓ Promotional campaigns</p>
            <p>✓ Creative direction</p>
            <p>✓ Content layout / design support</p>
            <p>✓ Priority service</p>
          </div>

          <a href="mailto:graphicollins@gmail.com?subject=Monthly%20Premium%20Package"
            className="mt-10 text-center border border-black py-4 text-sm font-semibold hover:bg-black hover:text-white transition">
            Subscribe →
          </a>
        </div>

      </div>
    </div>

    {/* CUSTOM PROJECTS */}
    <div className="bg-[#171717] text-white p-10 md:p-16 text-center">
      <p className="text-xs tracking-widest text-[#C58A45] mb-5">
        YOUR VISION, OUR CREATIVITY
      </p>

      <h3 className="text-3xl md:text-5xl font-semibold">
        Have a unique project in mind?
      </h3>

      <p className="text-gray-400 mt-5 max-w-2xl mx-auto leading-7">
        Not every creative project fits into a package.
        Tell us about your vision and let's develop a custom solution
        for your business.
      </p>

      <a href="mailto:graphicollins@gmail.com?subject=Custom%20Project%20Quotation"
        className="inline-block mt-8 bg-[#C58A45] text-black px-9 py-4 font-semibold text-sm hover:bg-white transition">
        Request a Custom Quote →
      </a>
    </div>

    {/* PRICING NOTE */}
    <p className="text-xs text-gray-400 text-center mt-10 leading-6">
      USD amounts are approximate conversions for reference.
      Final USD quotations may vary with exchange rates.
      Printing, production and third-party expenses are quoted separately.
      Monthly packages are billed per month.
    </p>

  </div>
</section>



{/* CONTACT SECTION */}
<section className="py-24 px-6 text-center bg-white">

  <p className="text-xs tracking-[0.3em] uppercase text-[#C58A45]">
    Have a project in mind?
  </p>

  <h2 className="text-4xl md:text-6xl font-bold mt-6 text-black">
    Let's create
    <br />
    something
    <span className="font-serif italic text-[#C58A45]">
      iconic.
    </span>
  </h2>

  <p className="text-[#77736C] mt-7 max-w-md mx-auto leading-7">
    Have an idea, a business or a brand that needs a fresh
    identity? Let's make it happen.
  </p>

  <a
    href="https://wa.me/255747502884?text=Hello%20GRAPHICOLLINS"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center mt-10 bg-[#C58A45] hover:bg-[#D99B55] text-black px-10 py-5 rounded-full text-sm font-medium transition-all duration-300"
  >
    Contact Us on WhatsApp <span>↗</span>
  </a>

</section>
{/* END CONTACT SECTION */}


      {/* FOOTER */}
      <footer className="bg-[#171717] text-white px-6 md:px-16 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
          <img
            src="/graphicollins-logo.png"
            alt="Graphicollins"
            className="h-10 w-auto object-contain"
          />
          <p className="text-sm text-white/60">
            Turning ideas into iconic brands.
          </p>
          <p className="text-xs text-white/50">
            © 2026 GRAPHICOLLINS. All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}