"use client";
import { useState } from "react";
import { useRegion, RegionKey } from "@/contexts/RegionContext";
import { MapPin, X } from "lucide-react";

interface RegionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegionSelectionModal({ isOpen, onClose }: RegionSelectionModalProps) {
  const { activeKey, setActiveRegion, regions } = useRegion();
  const [isChangingRegion, setIsChangingRegion] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleRegionSelect = (regionKey: string) => {
    if (isChangingRegion || isConfirming) return;

    if (activeKey === regionKey) {
      setIsConfirming(true);
      setTimeout(() => {
        setIsConfirming(false);
        onClose();
      }, 1500);
      return;
    }
    
    setIsChangingRegion(true);
    setActiveRegion(regionKey as RegionKey);

    setTimeout(() => {
      setIsChangingRegion(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(30, 18, 40, 0.99)',
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)',
        zIndex: 200000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.3s ease-in-out',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div
        style={{
          background: 'hsl(var(--card))',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          minHeight: '320px',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '2px solid hsl(var(--accent))',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px hsl(var(--accent) / 0.2)',
          position: 'relative',
          transform: isOpen ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {}
        <button
          onClick={onClose}
          className="region-modal-close float-animation"
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            background: 'transparent',
            border: 'none',
            color: '#FFD600', // всегда жёлтая
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.22s cubic-bezier(0.6,0.05,0.4,1)',
          }}
          aria-label="Закрыть"
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.22)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <X size={28} style={{ color: '#FFD600' }} />
        </button>

        {}
        <div style={{ textAlign: 'center', marginBottom: '24px', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {isChangingRegion ? (
            <h2
              style={{
                color: 'hsl(var(--accent))',
                fontSize: '28px',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                margin: 0,
                fontFamily: 'var(--main-font)',
              }}
            >
              Регион изменен
            </h2>
          ) : isConfirming ? (
            <h2
              style={{
                color: 'hsl(var(--accent))',
                fontSize: '28px',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                margin: 0,
                fontFamily: 'var(--main-font)',
              }}
            >
              Регион подтвержден
            </h2>
          ) : (
            <>
              <h2
                style={{
                  color: 'hsl(var(--accent))',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  margin: 0,
                  marginBottom: '8px',
                  fontFamily: 'var(--main-font)',
                }}
              >
                Выберите свой регион
              </h2>
              <p
                style={{
                  color: 'hsl(var(--muted-foreground))',
                  fontSize: '16px',
                  margin: 0,
                }}
              >
                Это поможет нам показать актуальную информацию для вашего города
              </p>
            </>
          )}
        </div>

        {}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => handleRegionSelect(region.id)}
              disabled={isChangingRegion || isConfirming}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 20px',
                borderRadius: '8px',
                border: activeKey === region.id ? '2px solid hsl(var(--accent))' : '2px solid hsl(var(--border) / 0.3)',
                background: activeKey === region.id 
                  ? 'hsl(var(--accent) / 0.1)' 
                  : isChangingRegion 
                    ? 'hsl(var(--muted))' 
                    : 'transparent',
                color: activeKey === region.id ? 'hsl(var(--accent))' : 'hsl(var(--foreground))',
                fontWeight: activeKey === region.id ? 'bold' : 'normal',
                fontSize: '20.7px',
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                cursor: (isChangingRegion || isConfirming) ? 'not-allowed' : 'pointer',
                opacity: (isChangingRegion || isConfirming) ? 0.6 : 1,
                outline: 'none',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                if (!isChangingRegion && !isConfirming && activeKey !== region.id) {
                  e.currentTarget.style.background = 'hsl(var(--accent) / 0.05)';
                  e.currentTarget.style.borderColor = 'hsl(var(--accent) / 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isChangingRegion && !isConfirming && activeKey !== region.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'hsl(var(--border) / 0.3)';
                }
              }}
            >
              <span>{region.name}</span>
            </button>
          ))}
        </div>

      </div>
      <style jsx global>{`
        @keyframes float-animation {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(5px, 5px); }
          50% { transform: translate(-5px, -5px); }
          75% { transform: translate(5px, -5px); }
        }
        @keyframes location-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .float-animation {
          animation: float-animation 6s ease-in-out infinite;
        }
        .location-pulse {
          animation: location-pulse 1.5s ease-in-out infinite;
          transform-origin: center;
        }
        .region-modal-close:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
