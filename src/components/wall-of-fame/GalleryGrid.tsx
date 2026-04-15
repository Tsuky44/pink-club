"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { PhotoCard } from "./PhotoCard";
import { Lightbox } from "./Lightbox";
import { getPhotos, deletePhoto, getUserVotedPhotoIds, Photo } from "@/actions/galleryActions";
import { useInView } from "framer-motion";

interface GalleryGridProps {
  photos: Photo[];
  isTopSection?: boolean;
  hasMore?: boolean;
  filter?: 'recent' | 'kudos' | 'drivers';
}

export function GalleryGrid({ photos: initialPhotos, isTopSection = false, hasMore: initialHasMore = false, filter = 'recent' }: GalleryGridProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [offset, setOffset] = useState(12);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  // Voted IDs — source of truth is server for logged-in users, localStorage for guests
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set());
  
  // Lightbox state
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });

  // Load user's deletion tokens from localStorage
  const getUserTokens = (): string[] => {
    if (typeof window === "undefined") return [];
    const tokens = localStorage.getItem("pink-club-upload-tokens");
    return tokens ? JSON.parse(tokens) : [];
  };

  // On mount: sync voted state from server (DB for logged-in users, cookie for guests)
  useEffect(() => {
    const photoIds = initialPhotos.map((p) => p.id);
    getUserVotedPhotoIds(photoIds)
      .then((ids) => setVotedIds(new Set(ids)))
      .catch(() => {});
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || isTopSection) return;
    
    setIsLoading(true);
    try {
      const newPhotos = await getPhotos(offset, 12);
      if (newPhotos.length > 0) {
        setPhotos((prev) => [...prev, ...newPhotos]);
        setOffset((prev) => prev + 12);
        setHasMore(newPhotos.length === 12);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, hasMore, isLoading, isTopSection]);

  useEffect(() => {
    if (isInView && hasMore && !isTopSection && !isLoading) {
      loadMore();
    }
  }, [isInView]);

  const handlePhotoClick = (photoId: number) => {
    setSelectedPhotoId(photoId);
    setIsLightboxOpen(true);
  };

  const handleKudo = async (photoId: number) => {
    const hasVoted = votedIds.has(photoId);

    // Optimistic update
    setVotedIds((prev) => {
      const next = new Set(prev);
      if (hasVoted) next.delete(photoId); else next.add(photoId);
      return next;
    });
    setPhotos((prev) => prev.map((p) =>
      p.id === photoId ? { ...p, kudos: p.kudos + (hasVoted ? -1 : 1) } : p
    ));

    try {
      const res = await fetch(`/api/kudos/${photoId}`, { method: "POST" });
      const data = await res.json();
      // Sync with real server count and voted state
      setPhotos((prev) => prev.map((p) => p.id === photoId ? { ...p, kudos: data.kudos } : p));
      setVotedIds((prev) => {
        const next = new Set(prev);
        if (data.voted) next.add(photoId); else next.delete(photoId);
        return next;
      });
    } catch {
      // Rollback on error
      setVotedIds((prev) => {
        const next = new Set(prev);
        if (hasVoted) next.add(photoId); else next.delete(photoId);
        return next;
      });
      setPhotos((prev) => prev.map((p) =>
        p.id === photoId ? { ...p, kudos: p.kudos + (hasVoted ? 1 : -1) } : p
      ));
    }
  };

  const handleDelete = async (photoId: number) => {
    const userTokens = getUserTokens();
    if (!userTokens.includes(photoId.toString())) return;
    
    if (!confirm("Es-tu sûr de vouloir supprimer cette photo ?")) return;
    
    try {
      await deletePhoto(photoId);
      
      // Remove token from localStorage
      const updatedTokens = userTokens.filter((id: string) => id !== photoId.toString());
      localStorage.setItem("pink-club-upload-tokens", JSON.stringify(updatedTokens));
      
      // Remove photo from list
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      setIsLightboxOpen(false);
      setSelectedPhotoId(null);
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  // Apply filter to photos
  const filteredPhotos = useMemo(() => {
    let result = [...photos];
    
    switch (filter) {
      case 'kudos':
        result.sort((a, b) => b.kudos - a.kudos);
        break;
      case 'drivers':
        // Group by photographer and sort by count, then flatten
        const byDriver = result.reduce((acc, photo) => {
          acc[photo.photographerName] = acc[photo.photographerName] || [];
          acc[photo.photographerName].push(photo);
          return acc;
        }, {} as Record<string, Photo[]>);
        
        result = Object.entries(byDriver)
          .sort((a, b) => b[1].length - a[1].length)
          .flatMap(([, photos]) => photos);
        break;
      case 'recent':
      default:
        // Sort by created_at DESC
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    return result;
  }, [photos, filter]);
  const selectedPhoto = selectedPhotoId ? filteredPhotos.find((p) => p.id === selectedPhotoId) || null : null;
  const canDeleteSelected = selectedPhotoId ? getUserTokens().includes(selectedPhotoId.toString()) : false;

  // Grille Masonry avec CSS columns comme Stitch
  return (
    <>
      <div className="masonry-grid">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.5 }}
            className="masonry-item mb-8"
          >
            <PhotoCard 
              photo={photo} 
              rank={isTopSection ? index + 1 : undefined}
              onClick={() => handlePhotoClick(photo.id)}
              onKudo={() => handleKudo(photo.id)}
              hasVoted={votedIds.has(photo.id)}
            />
          </motion.div>
        ))}
        
        {/* Loader pour scroll infini */}
        {!isTopSection && hasMore && (
          <div ref={ref} className="col-span-full h-20 flex items-center justify-center">
            {isLoading && (
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            )}
          </div>
        )}
      </div>

      <Lightbox
        photo={selectedPhoto}
        isOpen={isLightboxOpen}
        onClose={() => {
          setIsLightboxOpen(false);
          setSelectedPhotoId(null);
        }}
        onKudo={selectedPhotoId ? () => handleKudo(selectedPhotoId) : () => {}}
        onDelete={canDeleteSelected && selectedPhotoId ? () => handleDelete(selectedPhotoId) : undefined}
        hasVoted={selectedPhotoId ? votedIds.has(selectedPhotoId) : false}
      />
    </>
  );
}
