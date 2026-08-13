const HeroSection = () => {
  return (
    <section className="flex w-full items-center px-5 py-12 sm:px-8 sm:py-16 lg:min-h-[440px] lg:px-16 lg:py-16 border-b-2 border-black">
      <div className="mx-auto flex w-full max-w-6xl items-center">
        <div className="flex w-full max-w-6xl flex-col gap-4 text-center lg:text-left">

          {/* Badge */}
          <span className="mx-auto w-fit border-2 border-black bg-green-500 px-3 py-2 text-xs font-bold text-white sm:text-sm lg:mx-0">
            Selalu ada jalan saat kita mau berusaha
          </span>

          {/* Title */}
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] text-black sm:text-5xl lg:text-5xl">
            DIMAS YOGA KURNIAWAN
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-[680px] font-body text-sm leading-relaxed text-gray-700 sm:text-base lg:mx-0">
            Selamat datang di website pribadi saya. Website ini dibangun
            menggunakan Next.js dan Golang sebagai backend. Saya membangun
            website ini untuk mendukung aktivitas baru saya, yaitu blogging.
          </p>

          {/* Social */}
          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            <span className="border-2 border-black px-2 py-1">
              Github
            </span>

            <span className="border-2 border-black px-2 py-1">
              Instagram
            </span>

            <span className="border-2 border-black px-2 py-1">
              Facebook
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
