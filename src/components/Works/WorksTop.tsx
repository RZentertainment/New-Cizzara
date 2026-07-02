"use client";

interface WorksTopProps {
  onClose: () => void;
}

interface Project {
  title: string;
  link: string;
}

// Only title + link are used, per spec — everything else from the source
// records (ids, descriptions, imageUrl, timestamps) is intentionally dropped.
const PROJECTS: Project[] = [
  {
    title: "GoGreenBeforeGreenGoes",
    link: "https://www.youtube.com/watch?v=wNHI39nzHAU",
  },
  {
    title: "Commercial Video Production for Energy Drink | Red Bull | Cinematography | Product Video | 2024",
    link: "https://youtu.be/NqtlUDcepwk?si=-qeheH_o0OslqJ30",
  },
  {
    title: "Crafting Elegance: Barrister Watch Unveiled in Stunning Cizzara Studios Shoot",
    link: "https://youtu.be/K7r_GGO0aBQ?si=dEGOutScphB3CJGl",
  },
  {
    title: "Vishwas ki Neev - Darshanam Group #WhereDreamsComeHome",
    link: "https://youtu.be/fSKRY70DqP0?si=ylS20pU5jB5Q9k2K",
  },
  {
    title: "National Industries - Frozen Food Manufacturers",
    link: "https://youtu.be/wwSCJ1fDygU?si=eTcGa098cPSQvpj2",
  },
  {
    title: "CK Zipper | Corporate Video | Asia's Largest Sustainable Reclosable Zipper Manufacturer 2023",
    link: "https://youtu.be/i30aXVfy3P8?si=Tod-pzTqLftdN-p2",
  },
  {
    title: "Kanan International Pvt. Ltd. - Lets Grow Globally",
    link: "https://youtu.be/tt79RIukKu0?si=sPyOu6biaiyX8wOR",
  },
  {
    title: "Tu Rovein (Full Song) | Amit Mutreja | Deepak T, Sharad C, Udeshna, SRG | Latest Punjabi Songs 2022",
    link: "https://youtu.be/jORDOPzXO0E?si=lYBg6sQmy89qw6Mt",
  },
  {
    title: "Commercial Video Production for Energy Drink | Reb bull | Cinematography | Product Video | 2024",
    link: "https://youtu.be/NqtlUDcepwk?si=x5fXL5NAZAbtVLpw",
  },
  {
    title: "Khuda Tu (Video Song) Amit Mutreja | Aamir, Deepak Tripathi, Kajal | SRG | Panorama Music",
    link: "https://youtu.be/0FCTTnbke2o?si=_KFdLIauqQh03QKz",
  },
  {
    title: "Commercial Video Production for Watch | Fossil | Cinematography | Product Video | 2024",
    link: "https://youtu.be/IQV8MQSa058?si=23a8yKqMYx2Qlioy",
  },
  {
    title: "STOP MOTION ANIMATION | Shot on Panasonic GH5 | 2021 by Cizzara Film Studio",
    link: "https://youtu.be/9fKSuDxgC4A?si=lMfNUEkOGd00fBrE",
  },
  {
    title: "Strava Healthcare Nutraceuticals Products Video - Sports nutrition, Gym Supplement, Proteins.",
    link: "https://youtu.be/-gDnmntGJts?si=QOaEgakcqzaI8zt8",
  },
  {
    title: "Cinematic Product Shoot At Cizzara Studio | Gold Jewellery | 2024",
    link: "https://youtu.be/F6LPuubch8g?si=CHrBzx2jUPQFJLB0",
  },
  {
    title: "Babubhai Sentimental | Official Trailer | Nakshraaj | Shivani Joshi | Mayur Chauhan",
    link: "https://youtu.be/Nj_psjNIZBQ?si=fK0q7RiYn1m_Dwep",
  },
  {
    title: "Te Amo | Cover by Milan Gadhvi & Monika Joshi | ‪@CizzaraMusic‬ | AK9 | Dum Maaro Dum",
    link: "https://youtu.be/YkNCSnCHyeI?si=gY4iETNwmmVxDwxO",
  },
  {
    title: "Pushpa: Srivalli - Cover (Hindi) by Milan Gadhvi | Allu Arjun | Javed Ali | AK9 ‪@CizzaraMusic‬",
    link: "https://youtu.be/dLlzoOJ4CZo?si=zZdtjRqt7VrBUz76",
  },
  {
    title: "PRIVATE LABELING- HING | ASAFOETIDA MANUFACTURING | NATIONAL FOODS",
    link: "https://youtu.be/NJOtI9izok4?si=OMuUwcMQUdDjGZAR",
  },
  {
    title: "SEP COOLERS | TV Commercial 5 | Hindustan Ki Garmi Ka Solution | Best Air Coolers in India",
    link: "https://youtu.be/3gZ-BNdl0Vg?si=4_Whx82rTLIvQ0As",
  },
  {
    title: "Green Crusaders - Rotary Club of Baroda Greens #GoGreenBeforeGreenGoes",
    link: "https://youtu.be/fMlL8lapwyc?si=12-1heVYYCDcvA66",
  },
  {
    title: "Vote Utsav Vadodara 2019 | Desh ka Maha Tyohaar | Music Video |",
    link: "https://youtu.be/4cDRzn998d0?si=xlW0Hex-qPr1plxV",
  },
  {
    title: "Wahi Hai Wahi Hai | Motivational Rap Song | Latest Music Video | Aarvi Music Label | AK9",
    link: "https://youtu.be/gMfqcx9tilk?si=we2LEM6dBy7D8vH0",
  }, {
    title: "Jaan Vaar Du | Friendship Day Special | Aarvi Music Label | Manish S Sharma | Sharad Chaudhary",
    link: "https://youtu.be/T_tKDKSqDcU?si=HtE9Wtkwm76m_Lt7",
  }, {
    title: "Dil Tu Bata – A Soulful Love Song | Aarvi Music Label | Latest Music Video",
    link: "https://youtu.be/1dijN4zLlHo?si=3fYLjsbsPeFr4l2g",
  }, {
    title: "Shu Karu Fariyad – Aamir Mir Latest Song | Heartfelt Gujarati Love Song | Aarvi Music Label",
    link: "https://youtu.be/RxWrTiiF2-M?si=PbvrdvgWquarfRtQ",
  },
];


const getYoutubeThumbnail = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
  );

  return match
    ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
    : "";
};

export default function WorksTop({ onClose }: WorksTopProps) {
  return (
    <section className="relative h-screen w-full overflow-x-hidden overflow-y-auto bg-[linear-gradient(180deg,#100e0e_0%,#0c0b0b_100%)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close work panel"
        className="absolute right-6 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10 sm:right-10 sm:top-8"
      >
        <span className="absolute h-px w-[1.1rem] rotate-45 bg-[#f1ede8]" />
        <span className="absolute h-px w-[1.1rem] -rotate-45 bg-[#f1ede8]" />
      </button>

      <div className="mx-auto w-full max-w-[78rem] px-6 pb-24 pt-24 sm:px-10 sm:pt-28">
        <header className="mb-14 max-w-2xl sm:mb-20">
          <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.22em] text-[#a15d4e]">
            Selected Work
          </p>
          <h1 className="font-serif text-[clamp(3.2rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-wide text-[#f1ede8]">
            WORK
          </h1>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-[#a8a39d] sm:text-lg">
            Selected projects that define our cinematic vision, creative
            direction, and visual storytelling.
          </p>
        </header>

      <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
  {PROJECTS.map((project) => (
    <a
      key={project.link}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-white/10 bg-black transition-all duration-500 group-hover:border-[#a15d4e]/60">
        <img
          src={getYoutubeThumbnail(project.link)}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/35 transition-all duration-500 group-hover:bg-black/20" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-black/40 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-[#b62505]">
            <span className="ml-[3px] h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-white" />
          </span>
        </div>
      </div>

      <p className="mt-4 font-sans text-sm leading-snug text-[#d9d5cf] transition-colors duration-300 group-hover:text-[#f1ede8] sm:text-base">
        {project.title}
      </p>
    </a>
  ))}
</div>
      </div>
    </section>
  );
}