"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { MediaItem } from "@/types";

/* ─── Icon helpers ───────────────────────────────────────────────── */
function CloseIcon()  { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function ChevLeft()   { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ChevRight()  { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function GridIcon()   { return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>; }

/* ─── Icon button style ──────────────────────────────────────────── */
const navBtn: React.CSSProperties = {
  width: "44px", height: "44px", borderRadius: "12px",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "rgba(253,252,250,0.8)", background: "transparent",
  border: "none", cursor: "pointer", transition: "background 0.15s, color 0.15s",
};

/* ─── Lightbox ───────────────────────────────────────────────────── */
function Lightbox({ images, currentIndex, onClose, onPrev, onNext }:
  { images: MediaItem[]; currentIndex: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {

  const image = images[currentIndex];

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   onPrev();
      if (e.key === "ArrowRight")  onNext();
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(26,18,8,0.95)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button onClick={onClose} style={{ ...navBtn, position: "absolute", top: "16px", right: "16px", zIndex: 10 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
        <CloseIcon />
      </button>

      {/* Counter */}
      <span style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", fontSize: "0.875rem", color: "rgba(253,252,250,0.5)", fontFamily: "var(--font-sans)" }}>
        {currentIndex + 1} / {images.length}
      </span>

      {/* Prev */}
      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{ ...navBtn, position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <ChevLeft />
        </button>
      )}

      {/* Image */}
      <div style={{ position: "relative", maxWidth: "80vw", maxHeight: "80vh", width: "100%", margin: "0 64px" }} onClick={(e) => e.stopPropagation()}>
        <Image src={image.url} alt={image.alt_text || "Gallery image"} width={1200} height={800}
          className="object-contain rounded-2xl" style={{ maxHeight: "80vh", width: "100%", objectFit: "contain" }} priority />
        {image.caption && <p style={{ textAlign: "center", fontSize: "0.875rem", color: "rgba(253,252,250,0.5)", marginTop: "12px", fontFamily: "var(--font-sans)" }}>{image.caption}</p>}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{ ...navBtn, position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <ChevRight />
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
          {images.slice(0, 8).map((img, i) => (
            <button key={img.id} onClick={(e) => e.stopPropagation()}
              style={{ width: "48px", height: "32px", borderRadius: "8px", overflow: "hidden", border: `2px solid ${i === currentIndex ? "#C8913A" : "transparent"}`, opacity: i === currentIndex ? 1 : 0.5, padding: 0, cursor: "pointer" }}>
              <Image src={img.url} alt="" width={48} height={32} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main gallery ───────────────────────────────────────────────── */
export function ImageGallery({ images, title, className }: { images: MediaItem[]; title: string; className?: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage     = useCallback(() => setLightboxIndex((i) => i !== null ? (i - 1 + images.length) % images.length : 0), [images.length]);
  const nextImage     = useCallback(() => setLightboxIndex((i) => i !== null ? (i + 1) % images.length : 0), [images.length]);

  if (!images.length) return null;
  const [cover, ...rest] = images;

  if (images.length === 1) {
    return (
      <>
        <div className={className} style={{ position: "relative", aspectRatio: "16/9", borderRadius: "16px", overflow: "hidden", cursor: "pointer" }} onClick={() => setLightboxIndex(0)}>
          <Image src={cover.url} alt={cover.alt_text || title} fill className="object-cover hover:scale-105 transition-transform duration-500" priority />
        </div>
        {lightboxIndex !== null && <Lightbox images={images} currentIndex={lightboxIndex} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />}
      </>
    );
  }

  return (
    <>
      <div className={className} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "8px", height: "480px" }}>
        {/* Cover — spans both rows on left */}
        <div style={{ gridRow: "1 / 3", position: "relative", overflow: "hidden", borderRadius: "16px 0 0 16px", cursor: "pointer" }}
          onClick={() => setLightboxIndex(0)}>
          <Image src={cover.url} alt={cover.alt_text || title} fill sizes="50vw" className="object-cover hover:scale-105 transition-transform duration-500" priority />
          <div style={{ position: "absolute", inset: 0, background: "transparent", transition: "background 0.3s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(26,18,8,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }} />
        </div>

        {/* Right top */}
        {rest[0] && (
          <div style={{ position: "relative", overflow: "hidden", borderRadius: "0 16px 0 0", cursor: "pointer" }}
            onClick={() => setLightboxIndex(1)}>
            <Image src={rest[0].url} alt={rest[0].alt_text || ""} fill sizes="25vw" className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        )}

        {/* Right bottom — shows +N if more images */}
        {rest[1] && (
          <div style={{ position: "relative", overflow: "hidden", borderRadius: "0 0 16px 0", cursor: "pointer" }}
            onClick={() => setLightboxIndex(2)}>
            <Image src={rest[1].url} alt={rest[1].alt_text || ""} fill sizes="25vw" className="object-cover hover:scale-105 transition-transform duration-500" />
            {images.length > 3 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(26,18,8,0.5)" }}>
                <span style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "1.5rem" }}>+{images.length - 3}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <button onClick={() => setLightboxIndex(0)}
        style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.875rem", color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#1A1208"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#7A6E60"; }}>
        <GridIcon />
        View all {images.length} photos
      </button>

      {lightboxIndex !== null && <Lightbox images={images} currentIndex={lightboxIndex} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />}
    </>
  );
}
