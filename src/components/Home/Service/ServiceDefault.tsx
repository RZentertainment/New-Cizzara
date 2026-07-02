"use client";

import React, { RefObject, useEffect, useState } from "react";

interface ServiceDefaultProps {
  bellRef: RefObject<HTMLDivElement | null>;
  ropeRef: RefObject<HTMLDivElement | null>;
  onBellClick: () => void;
  onServiceClick: (service: any) => void;
}

interface ServiceData {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  categories: string[];
  galleryImages: string[];
}

const ServiceDefault = ({ bellRef, ropeRef, onBellClick, onServiceClick }: ServiceDefaultProps) => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/data/ServiceData.json');
        if (!response.ok) {
          throw new Error('Failed to fetch services data');
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services');
        console.error('Error loading services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section
      className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-[#120d0d]"
      style={{ scrollSnapAlign: "start" }}
    >
     

      {/* ── CONTENT (Service Cards) — centred layout ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-7xl px-4 max-h-[80vh] overflow-y-auto">
        {loading ? (
          <div className="w-full py-20 text-center">
            <div className="inline-block w-12 h-12 border-4 border-[#e4e1de] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-[#f2eaea]">Loading services...</p>
          </div>
        ) : error ? (
          <div className="w-full py-20 text-center text-red-400">
            <p>Error loading services: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
                index={index}
                onClick={() => onServiceClick(service)}
              />
            ))}
          </div>
        )}  
      </div>

     

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {    
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

const ServiceCard = ({ 
  heroImage, 
  title,
  index,
  onClick
}: { heroImage: string; title: string; index: number; onClick: () => void }) => {
  return (
    <div 
      className="group relative   rounded-xs overflow-hidden  cursor-pointer"
      style={{ 
        opacity: 0,
        animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`
      }}
      onClick={() => {
        console.log("[ServiceCard] clicked:", title);
        onClick();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
    >
      {/* Image Container - fixed height */}
      <div className="h-[150px] relative overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle gradient overlay for image only */}
      </div>

      {/* Title below the image */}
        <h3 className="text-sm font-light text-center text-white tracking-wider mt-5 group-hover:text-[#C4A882] transition-colors duration-300">
          {title}
        </h3>
      
   
    </div>
  );
};

export default ServiceDefault;