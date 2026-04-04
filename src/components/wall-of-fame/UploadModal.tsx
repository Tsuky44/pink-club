"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Upload, ImageIcon, Loader2 } from "lucide-react";
import { uploadPhoto } from "@/actions/galleryActions";

interface UploadModalProps {
  onClose: () => void;
}

export function UploadModal({ onClose }: UploadModalProps) {
  const [photographerName, setPhotographerName] = useState("");
  const [carModel, setCarModel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError(null);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photographerName.trim() || !carModel.trim() || !file) {
      setError("Tous les champs sont requis");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("photographer_name", photographerName);
      formData.append("car_model", carModel);
      formData.append("image", file);

      const result = await uploadPhoto(formData);

      if (result.success && result.deleteToken) {
        // Store delete token in localStorage
        const existingTokens = localStorage.getItem("pink-club-upload-tokens");
        const tokens = existingTokens ? JSON.parse(existingTokens) : [];
        tokens.push(result.deleteToken);
        localStorage.setItem("pink-club-upload-tokens", JSON.stringify(tokens));
        
        onClose();
        // Recharger la page pour voir la nouvelle photo
        window.location.reload();
      } else {
        setError(result.error || "Erreur lors de l'upload");
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-surface-container border border-white/10 p-8"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-[family-name:var(--font-space-grotesk)] font-black italic uppercase tracking-tighter mb-2">
          AJOUTER UNE <span className="text-primary">LÉGENDE</span>
        </h2>
        <p className="text-on-surface-variant font-[family-name:var(--font-manrope)] text-sm mb-8">
          Partage ta machine avec la communauté
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-primary bg-primary/10"
                : "border-white/20 hover:border-white/40"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {preview ? (
              <div className="relative w-full aspect-video">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                  <ImageIcon size={32} className="text-white/60" />
                </div>
                <p className="text-white font-[family-name:var(--font-space-grotesk)] font-bold">
                  Glisse ta photo ici
                </p>
                <p className="text-white/50 text-sm">
                  ou clique pour sélectionner
                </p>
              </div>
            )}
          </div>

          {/* Nom du photographe */}
          <div>
            <label className="block text-xs font-[family-name:var(--font-space-grotesk)] font-bold tracking-widest uppercase text-white/60 mb-2">
              Ton Nom
            </label>
            <input
              type="text"
              value={photographerName}
              onChange={(e) => setPhotographerName(e.target.value)}
              placeholder="Ex: Jean Dupont"
              className="w-full px-4 py-3 bg-surface border border-white/10 text-white font-[family-name:var(--font-manrope)] placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Modèle de voiture */}
          <div>
            <label className="block text-xs font-[family-name:var(--font-space-grotesk)] font-bold tracking-widest uppercase text-white/60 mb-2">
              Modèle du Véhicule
            </label>
            <input
              type="text"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              placeholder="Ex: Nissan Silvia S15"
              className="w-full px-4 py-3 bg-surface border border-white/10 text-white font-[family-name:var(--font-manrope)] placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm font-[family-name:var(--font-manrope)]">
              {error}
            </p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isUploading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-primary text-white font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(255,0,127,0.4)] transition-all"
          >
            {isUploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                ENVOI EN COURS...
              </>
            ) : (
              <>
                <Upload size={20} />
                PUBLIER
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
