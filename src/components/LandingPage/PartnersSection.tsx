import React from 'react';
import { GraduationCap } from 'lucide-react';

export const PartnersSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          We are happy to Follow Us with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
            incredible learners & partners
          </span>
        </h2>
        
        <p className="mt-3 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Over 50,000 students and leading digital agencies trust Learn Hub to upskill in modern front-end engineering, Figma interface systems, and data analytics.
        </p>

        {/* Brand Emblem */}
        <div className="my-10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-black text-slate-900 tracking-tighter leading-none">
                LEARN HUB
              </span>
              <span className="text-[10px] tracking-widest text-teal-600 uppercase font-bold">
                STUDENTS & DIGITAL TALENT
              </span>
            </div>
          </div>
        </div>

        {/* Social Icons matching screenshot 1 */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
            title="Instagram"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
            title="Facebook"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.8C10.5 0 9 1.5 9 4.5V8z" />
            </svg>
          </a>

          {/* X / Twitter */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
            title="X"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Discord */}
          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-[#5865F2] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
            title="Discord"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
            title="LinkedIn"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
            title="WhatsApp Community"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
};
