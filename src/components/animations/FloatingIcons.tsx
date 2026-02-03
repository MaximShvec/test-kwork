'use client';

import React, { useEffect, useRef } from 'react';

const ICON_SIZE = 80;               // Icon size in px
const ICON_SPEED = 2;                // Base icon speed (удвоено)

const COLLISION_RADIUS = ICON_SIZE / 2;    // Collision radius

class FloatingIcon {
    icon: HTMLImageElement;
    size: number;
    radius: number;
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    decayStartTime: number | null;
    _decayStartMag?: number;
    container: HTMLDivElement;

    constructor(iconPath: string, container: HTMLDivElement) {
        this.container = container;

        this.icon = new Image();
        this.icon.src = iconPath;
        this.icon.classList.add('floating-icon'); // Add class if needed for specific styling

        this.size = ICON_SIZE;
        this.radius = COLLISION_RADIUS;
        const pageWidth = window.innerWidth;
        const pageHeight = document.documentElement.scrollHeight;

        this.x = Math.random() * (pageWidth - 2 * this.radius) + this.radius;
        this.y = Math.random() * (pageHeight - 2 * this.radius) + this.radius;

        const angle = Math.random() * Math.PI * 2;
        this.speedX = ICON_SPEED * Math.cos(angle);
        this.speedY = ICON_SPEED * Math.sin(angle);

        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1; // Reduced rotation speed

        this.decayStartTime = null;

        Object.assign(this.icon.style, {
            position: 'absolute',
            width: `${this.size}px`,
            height: `${this.size}px`,
            pointerEvents: 'none', 
            transform: `translate(${this.x - this.radius}px, ${this.y - this.radius}px) rotate(${this.rotation}deg)`,
            zIndex: '9999', 
            userSelect: 'none',
            willChange: 'transform',
            opacity: '1', 
            transition: 'opacity 0.3s ease',
        });

        container.appendChild(this.icon);
    }

    update(icons: FloatingIcon[], mouseX: number | null, mouseY: number | null) {

        icons.forEach(other => {
            if (other === this) return;
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const dist = Math.hypot(dx, dy);
            const minD = this.radius + other.radius;
            if (dist < minD && dist > 0) {
                const nx = dx / dist;
                const ny = dy / dist;
                const tx = -ny;
                const ty = nx;

                const v1n = this.speedX * nx + this.speedY * ny;
                const v1t = this.speedX * tx + this.speedY * ty;
                const v2n = other.speedX * nx + other.speedY * ny;
                const v2t = other.speedX * tx + other.speedY * ty;

                const newV1n = v2n;
                const newV2n = v1n;

                this.speedX = newV1n * nx + v1t * tx;
                this.speedY = newV1n * ny + v1t * ty;
                other.speedX = newV2n * nx + v2t * tx;
                other.speedY = newV2n * ny + v2t * ty;

                const overlap = (minD - dist) / 2; // Divide by 2 as both move
                this.x -= nx * overlap;
                this.y -= ny * overlap;
                other.x += nx * overlap;
                other.y += ny * overlap;
            }
        });

        if (mouseX !== null && mouseY !== null) {

            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.hypot(dx, dy);
            const repelRadius = this.radius * 0.8; // Меньший радиус реакции

            if (dist < repelRadius) {
                const nx = dx / (dist || 1); // Normalize direction vector
                const ny = dy / (dist || 1);

                this.speedX = nx * ICON_SPEED * 8;
                this.speedY = ny * ICON_SPEED * 8;
                this.decayStartTime = performance.now();

                this.x += nx * 2;
                this.y += ny * 2;
            }
        }

        if (this.decayStartTime !== null) {
            const elapsed = performance.now() - this.decayStartTime;
            const duration = 5000; // 5 seconds
            const startMag = this._decayStartMag || Math.hypot(this.speedX, this.speedY) || ICON_SPEED;
            if (!this._decayStartMag) this._decayStartMag = startMag;
            if (elapsed >= duration) {

                const mag = Math.hypot(this.speedX, this.speedY) || 1;
                this.speedX = (this.speedX / mag) * ICON_SPEED;
                this.speedY = (this.speedY / mag) * ICON_SPEED;
                this.decayStartTime = null;
                this._decayStartMag = undefined;
            } else {

                const t = elapsed / duration;
                const mag = startMag + (ICON_SPEED - startMag) * t;
                const curMag = Math.hypot(this.speedX, this.speedY) || 1;
                this.speedX = (this.speedX / curMag) * mag;
                this.speedY = (this.speedY / curMag) * mag;
            }
        } else {
            this._decayStartMag = undefined;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        const pageWidth = window.innerWidth;
        const pageHeight = document.documentElement.scrollHeight;
        this.container.style.height = `${pageHeight}px`; // Update container height

        const header = document.querySelector('header.header') as HTMLElement | null;
        const headerH = header ? header.offsetHeight : 0;
        const scrollY = window.scrollY || window.pageYOffset;

        const topLimit = (scrollY < headerH + 50 ? headerH : 0) + this.radius;

        const footer = document.querySelector('footer.footer') as HTMLElement | null;
        const footerTop = footer ? footer.offsetTop : pageHeight;

        const bottomLimit = (footer ? Math.min(footerTop, pageHeight) : pageHeight) - this.radius;


        const leftLimit = this.radius;
        const rightLimit = pageWidth - this.radius;

        const bounceFactor = -0.8; // Less than -1 for energy loss, adjust as needed
        const pushOff = 1; // Small distance to push off the wall

        if (this.x < leftLimit) {
            this.x = leftLimit + pushOff;
            this.speedX *= bounceFactor;
        } else if (this.x > rightLimit) {
            this.x = rightLimit - pushOff;
            this.speedX *= bounceFactor;
        }

        if (this.y < topLimit) {
            this.y = topLimit + pushOff;

            if (this.speedY < 0) this.speedY *= bounceFactor;

            this.speedX += (Math.random() - 0.5) * 0.5;
        } else if (this.y > bottomLimit) {
            this.y = bottomLimit - pushOff;

            if (this.speedY > 0) this.speedY *= bounceFactor;

            this.speedX += (Math.random() - 0.5) * 0.5;
        }

        this.icon.style.transform =
            `translate(${this.x - this.radius}px, ${this.y - this.radius}px) rotate(${this.rotation}deg)`;

        if (parseFloat(this.icon.style.opacity) < 0.6) {
             this.icon.style.opacity = `${Math.min(parseFloat(this.icon.style.opacity) + 0.01, 0.6)}`;
         }
    }

    destroy() {
        this.icon.remove();
    }
}

export const FloatingIcons = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const iconsRef = useRef<FloatingIcon[]>([]);
    const mousePosRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
    const animationFrameIdRef = useRef<number | null>(null);

    useEffect(() => {
        const containerElement = containerRef.current;
        if (!containerElement) return;

        const iconPaths = [
            '/images/icons/1.png', '/images/icons/2.png', '/images/icons/3.png',
            '/images/icons/4.png', '/images/icons/5.png', '/images/icons/6.png',
            '/images/icons/7.png', '/images/icons/8.png', '/images/icons/9.png',
            '/images/icons/10.png', '/images/icons/11.png', '/images/icons/12.png',
            '/images/icons/13.png'
        ];

        iconPaths.forEach(path => {
            const img = new Image();
            img.src = path;
        });

        iconsRef.current = []; // Clear previous icons if any
        iconPaths.forEach(path => {
            iconsRef.current.push(new FloatingIcon(path, containerElement));
        });

        const handleMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
        };
        document.addEventListener('mousemove', handleMouseMove);

        const handleResize = () => {
            if (containerElement) {
                containerElement.style.height = `${document.documentElement.scrollHeight}px`;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial height set

        const animate = () => {
            if (containerElement) {
                 containerElement.style.height = `${document.documentElement.scrollHeight}px`;
            }
            const { x, y } = mousePosRef.current;
            iconsRef.current.forEach(ic => ic.update(iconsRef.current, x, y));
            animationFrameIdRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            iconsRef.current.forEach(icon => icon.destroy());
            iconsRef.current = [];
        };
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <div
            ref={containerRef}
            className="floating-icons-container"
            style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                pointerEvents: 'none',
                zIndex: '9999', 
                overflow: 'hidden',
            }}
        />
    );
};
