import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  RefreshCw,
  Share2,
  Sparkles,
  ShieldCheck,
  FileCode,
  Eye,
  Sliders,
  Sun,
  Moon,
  Layers,
  Edit3,
  ExternalLink,
} from 'lucide-react';
import type { PipelineItem, BrandSettings, PostingRules } from '../types/index.ts';

interface PosterStudioModalProps {
  item: PipelineItem;
  brandSettings: BrandSettings;
  postingRules: PostingRules;
  onClose: () => void;
  onPublish: (itemId: string) => Promise<void>;
  onRegenerate: (itemId: string, theme?: string) => Promise<void>;
}

interface DynamicPosterData {
  kicker: string;
  headline: string;
  subtitle: string;
  badge: string;
  supportingLine: string;
  features: Array<{ icon: string; title: string; desc: string }>;
  scriptWhite: string;
  scriptBlue: string;
  bottomBarText: string;
  daylightHeadline: string;
  daylightSubtitle: string;
}

function resolveProductPosterData(item: PipelineItem): DynamicPosterData {
  const cat = (item.category || '').toLowerCase();
  const name = item.productName || '';

  if (cat.includes('earbud') || cat.includes('tws') || cat.includes('headphone') || cat.includes('audio')) {
    return {
      kicker: 'SMARTER SOUND  •  MORE CONTROL',
      headline: name.includes('A9 Pro') ? 'A9 Pro' : name.split(' ').slice(0, 3).join(' '),
      subtitle: 'ANC/ENC Wireless Earbuds',
      badge: 'E0482',
      supportingLine: 'Premium Sound  |  Smart Features  |  Everyday Vibes',
      features: [
        { icon: '📶', title: 'ANC + ENC', desc: 'Clear Calls & Music' },
        { icon: '👆', title: 'Smart Touch', desc: 'LCD Screen Control' },
        { icon: '🔄', title: 'Surround 360°', desc: 'Immersive Audio' },
        { icon: '⚡', title: 'Fast Charging', desc: 'Type-C Endurance' },
      ],
      scriptWhite: 'Your Music',
      scriptBlue: 'Your Way',
      bottomBarText: '📊  ANC/ENC  |  SMART SCREEN  |  PREMIUM SOUND',
      daylightHeadline: 'ANC / ENC',
      daylightSubtitle: 'WIRELESS EARBUDS',
    };
  }

  if (cat.includes('power') || cat.includes('bank') || cat.includes('charger') || cat.includes('battery')) {
    return {
      kicker: 'NEXT-GEN POWER  •  COMPACT DESIGN',
      headline: name.includes('Cyberpunk') ? 'Cyberpunk' : name.split(' ').slice(0, 2).join(' '),
      subtitle: '22.5W Magnetic Wireless Power Bank',
      badge: '22.5W',
      supportingLine: 'MagSafe Snap  |  High Speed PD  |  Airline Safe',
      features: [
        { icon: '⚡', title: '22.5W Fast', desc: 'Two-Way PD Charging' },
        { icon: '🧲', title: 'MagSafe Snap', desc: '15W Magnetic Wireless' },
        { icon: '🔋', title: '10,000mAh', desc: 'High-Density Lithium' },
        { icon: '💡', title: 'LED Display', desc: 'Real-Time Battery %' },
      ],
      scriptWhite: 'Power In',
      scriptBlue: 'Your Pocket',
      bottomBarText: '⚡  22.5W PD  |  15W MAGSAFE  |  DIGITAL DISPLAY',
      daylightHeadline: '22.5W / MAGSAFE',
      daylightSubtitle: 'WIRELESS POWER BANK',
    };
  }

  if (cat.includes('watch') || cat.includes('smartwatch') || cat.includes('band')) {
    return {
      kicker: 'SMART TRACKING  •  ALL-DAY ACTIVE',
      headline: name.includes('HK9') ? 'HK9 Ultra 2' : name.split(' ').slice(0, 3).join(' '),
      subtitle: '2.12" AMOLED Smartwatch',
      badge: 'AMOLED',
      supportingLine: 'Always-On Display  |  AI Assistant  |  Titanium Case',
      features: [
        { icon: '📱', title: '2.12" AMOLED', desc: '60Hz High Refresh' },
        { icon: '👆', title: 'Smart Gesture', desc: 'Double-Tap Calling' },
        { icon: '📞', title: 'BT Calling', desc: 'Bangla Font Support' },
        { icon: '❤️', title: 'Health Suite', desc: 'Heart & Sleep Tracking' },
      ],
      scriptWhite: 'Style Your',
      scriptBlue: 'Time',
      bottomBarText: '⌚  60Hz AMOLED  |  BT CALLING  |  TITANIUM CASE',
      daylightHeadline: 'AMOLED / ULTRA',
      daylightSubtitle: 'SMARTWATCH EDITION',
    };
  }

  if (cat.includes('speaker') || cat.includes('sound')) {
    return {
      kicker: 'IMMERSIVE SOUND  •  HEAVY BASS',
      headline: name.includes('PulseBlast') ? 'PulseBlast' : name.split(' ').slice(0, 2).join(' '),
      subtitle: '360° Heavy Bass Mini Speaker',
      badge: 'IPX7',
      supportingLine: 'Dynamic RGB Lights  |  Dual Passive Radiator  |  TWS Pair',
      features: [
        { icon: '🔊', title: '15W Peak Bass', desc: 'Dual Passive Radiators' },
        { icon: '🌈', title: 'Dynamic RGB', desc: 'Beat-Synced Lights' },
        { icon: '💧', title: 'IPX7 Waterproof', desc: 'Drop-Resistant Silicone' },
        { icon: '🔋', title: '12H Playtime', desc: '2600mAh Endurance' },
      ],
      scriptWhite: 'Feel The',
      scriptBlue: 'Beat',
      bottomBarText: '🎵  360° SURROUND  |  RGB BEATS  |  IPX7 WATERPROOF',
      daylightHeadline: 'IPX7 / BASS',
      daylightSubtitle: 'PORTABLE BLUETOOTH SPEAKER',
    };
  }

  if (cat.includes('gimbal') || cat.includes('camera') || cat.includes('stabilizer')) {
    return {
      kicker: 'CINEMA STABILIZATION  •  AUTO TRACKING',
      headline: name.includes('3-Axis') ? 'Smart 3-Axis' : name.split(' ').slice(0, 2).join(' '),
      subtitle: 'AI Face Tracking Foldable Gimbal',
      badge: '3-AXIS',
      supportingLine: 'Optical AI Vision  |  Magnetic Fill Light  |  Foldable',
      features: [
        { icon: '🎯', title: 'AI Tracking', desc: 'Standalone Sensor 360°' },
        { icon: '💡', title: '3-Color Light', desc: 'Magnetic Fill Lamp' },
        { icon: '📐', title: '3-Axis Motor', desc: 'Inception & Zoom Modes' },
        { icon: '🔋', title: '10H Runtime', desc: 'Reverse Phone Charging' },
      ],
      scriptWhite: 'Create Like',
      scriptBlue: 'A Pro',
      bottomBarText: '🎬  3-AXIS GIMBAL  |  AI TRACKING  |  FILL LIGHT',
      daylightHeadline: '3-AXIS / AI',
      daylightSubtitle: 'PHONE GIMBAL STABILIZER',
    };
  }

  // Fallback for gaming accessories or other categories
  const keyPts = item.aiAnalysis?.keySellingPoints || ['High Performance', 'Smart Design', 'Long Battery', 'Fast Charge'];
  return {
    kicker: 'PREMIUM QUALITY  •  TREND TECH',
    headline: name.split(' ').slice(0, 3).join(' '),
    subtitle: `${item.category} Official Edition`,
    badge: 'PRO',
    supportingLine: 'Official Reseller  |  Authentic Stock  |  Warranty',
    features: [
      { icon: '✨', title: keyPts[0]?.slice(0, 14) || 'Premium Build', desc: 'Engineered for Performance' },
      { icon: '⚡', title: keyPts[1]?.slice(0, 14) || 'Fast Response', desc: 'Low Latency & High Speed' },
      { icon: '🛡️', title: keyPts[2]?.slice(0, 14) || 'Official Quality', desc: 'Certified Components' },
      { icon: '🔋', title: keyPts[3]?.slice(0, 14) || 'Durable Life', desc: 'Extended Battery Backup' },
    ],
    scriptWhite: 'Smart Life',
    scriptBlue: 'Better Tech',
    bottomBarText: `✨  ${item.category.toUpperCase()}  |  GENUINE QUALITY  |  OFFICIAL RESELLER`,
    daylightHeadline: `${item.category.toUpperCase()} / PRO`,
    daylightSubtitle: 'OFFICIAL RESELLER EDITION',
  };
}

export const PosterStudioModal: React.FC<PosterStudioModalProps> = ({
  item,
  brandSettings,
  postingRules,
  onClose,
  onPublish,
  onRegenerate,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<'cinematic_night' | 'daylight_minimal' | 'cyber_neon' | 'studio_tech'>(
    'cinematic_night'
  );
  const [activeTab, setActiveTab] = useState<'poster' | 'prompt_json' | 'caption'>('poster');
  const [heroImageIndex, setHeroImageIndex] = useState<number>(0);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Dynamic Product Poster Data (auto-adapts to each product)
  const defaultPosterData = resolveProductPosterData(item);
  const [customData, setCustomData] = useState<DynamicPosterData>(defaultPosterData);

  // Reset when item changes
  useEffect(() => {
    setCustomData(resolveProductPosterData(item));
  }, [item]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const images = item.images && item.images.length > 0 ? item.images : [item.heroImage];
  const activeImage = images[heroImageIndex] || item.heroImage;

  // Generate the exact prompt JSON matching the user's specification
  const promptJson = {
    product_name: item.productName,
    product_description: {
      content: item.aiAnalysis?.productSummary || item.productName,
      language: "The description may be written in Bangla, English, Banglish, or a mixture of languages.",
      length: "The description may be short, medium, or very long.",
      instruction: "Read and understand the entire provided product description before creating the poster and caption.",
      usage: "Use the product description as the factual source for product specifications, features, functions, benefits and selling points.",
      poster_rule: "Do NOT place the entire product description on the poster. Select only a few important, accurate and visually relevant features or benefits for concise supporting text.",
      caption_rule: "Do NOT copy the entire product description into the caption. Select only the most useful and relevant information.",
      accuracy: "Do not invent, assume, exaggerate, incorrectly translate, or modify product specifications, features, numbers or claims.",
      priority: "For product specifications, features and benefits, follow the provided product description. For visual appearance, always follow the provided product reference images."
    },
    instruction: "Create a premium cinematic advertising poster for the product specified in the product_name field above.",
    reference_images: {
      image_identification: {
        instruction: "Before generating anything, visually inspect ALL uploaded images and determine the role of each image based on its actual visual content.",
        product_images: {
          rule: "Any image primarily showing the actual product, product packaging, accessories, or different views of the product must be treated as a PRODUCT REFERENCE.",
          quantity: `${images.length} product reference images provided.`,
          instruction: "Use ALL identified product reference images together to understand the exact product identity, shape, proportions, dimensions, colors, materials, components, packaging details, buttons, ports, displays and other recognizable characteristics."
        },
        logo_image: {
          rule: "Identify the image that primarily contains the actual Mr.X Shop brand logo as the LOGO REFERENCE.",
          quantity: "Exactly ONE separate Mr.X Shop logo reference image.",
          instruction: "The identified Mr.X Shop logo image is a separate branding reference and must be used directly as the source of truth for the Mr.X Shop logo."
        }
      }
    },
    branding: {
      brand: "Mr.X Shop",
      logo_reference: {
        source: "Official Mr.X Shop logo reference image (Blue Brush X, SMART GADGETS · BETTER LIFE).",
        instruction: "Use the exact provided Mr.X Shop logo as the ONLY source of truth. Do not create a new logo."
      }
    },
    social_media_caption: {
      instruction: "After creating the poster, generate a separate modern, minimalistic and ready-to-post social media caption.",
      official_contact: {
        whatsapp_number: "01822300348",
        website: "https://mrxshopbd.web.app"
      },
      output_format: {
        template: `${item.productName}\n\n[Short English hook]\n[Short natural Bangla product-focused description]\n\n📩 অর্ডার করতে Inbox / WhatsApp করুন। অথবা অর্ডার করুন Website-এ।\n\n📲 WhatsApp: 01822300348\n🌐 Website: https://mrxshopbd.web.app\n\n#MrXShop #${item.category.replace(/\\s+/g, '')} #TechGadgetsBD`
      }
    }
  };

  // Helper: Draw authentic Mr.X Shop Logo on Canvas
  const drawMrXLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, isDarkTheme: boolean) => {
    ctx.save();
    ctx.translate(x, y);

    // "Mr." in brush italic font
    ctx.font = 'italic 900 48px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isDarkTheme ? '#ffffff' : '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText('Mr.', -24, 0);

    // Dynamic Brush 'X' in vibrant cyan/electric blue
    ctx.strokeStyle = '#0088ff';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-16, -34);
    ctx.lineTo(24, 6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(24, -34);
    ctx.lineTo(-16, 6);
    ctx.stroke();

    // Secondary blue highlight stroke for hand-painted brush effect
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-12, -30);
    ctx.lineTo(20, 2);
    ctx.stroke();

    // Divider line with "— S H O P —"
    const textColor = isDarkTheme ? '#ffffff' : '#0f172a';
    ctx.textAlign = 'center';
    ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = textColor;
    ctx.fillText('—  S H O P  —', 0, 24);

    // Subtitle "SMART GADGETS · BETTER LIFE"
    ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.65)' : 'rgba(15, 23, 42, 0.65)';
    ctx.fillText('SMART GADGETS · BETTER LIFE', 0, 40);

    ctx.restore();
  };

  // High-Resolution 1080x1080 Promotional Poster Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const isNight = selectedStyle === 'cinematic_night' || selectedStyle === 'cyber_neon' || selectedStyle === 'studio_tech';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeImage;

    img.onload = () => {
      // 1. Render Scene Background matching user references
      if (selectedStyle === 'cinematic_night') {
        // Reference 2: Dark Slate Studio Night with Wet Reflections & Neon Bokeh
        const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 100, width * 0.5, height * 0.5, 750);
        bgGrad.addColorStop(0, '#0a1426');
        bgGrad.addColorStop(0.4, '#060a12');
        bgGrad.addColorStop(1, '#020307');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Ambient cyan-blue bokeh backlights
        const bokeh = ctx.createRadialGradient(width * 0.75, height * 0.4, 30, width * 0.75, height * 0.4, 350);
        bokeh.addColorStop(0, 'rgba(0, 136, 255, 0.28)');
        bokeh.addColorStop(1, 'transparent');
        ctx.fillStyle = bokeh;
        ctx.beginPath();
        ctx.arc(width * 0.75, height * 0.4, 350, 0, Math.PI * 2);
        ctx.fill();

        // Wet slate rock pedestal
        const rockGrad = ctx.createLinearGradient(0, height * 0.52, 0, height * 0.88);
        rockGrad.addColorStop(0, '#1c2430');
        rockGrad.addColorStop(0.3, '#0f1722');
        rockGrad.addColorStop(1, '#080d14');
        ctx.fillStyle = rockGrad;
        ctx.beginPath();
        ctx.ellipse(width * 0.52, height * 0.68, width * 0.45, height * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rock edge texture highlights
        ctx.strokeStyle = 'rgba(0, 136, 255, 0.25)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (selectedStyle === 'daylight_minimal') {
        // Reference 1: Bright Clean Daylight Commercial with Sunlight & Slate Texture
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#f8fafc');
        bgGrad.addColorStop(0.5, '#f1f5f9');
        bgGrad.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Slate rock texture block at bottom left (matching Reference 1)
        const slateGrad = ctx.createLinearGradient(0, height * 0.65, width * 0.45, height);
        slateGrad.addColorStop(0, '#334155');
        slateGrad.addColorStop(0.5, '#1e293b');
        slateGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = slateGrad;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.72);
        ctx.lineTo(width * 0.38, height * 0.65);
        ctx.lineTo(width * 0.42, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Soft daylight cast
        const sun = ctx.createRadialGradient(width * 0.2, height * 0.2, 50, width * 0.2, height * 0.2, 500);
        sun.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        sun.addColorStop(1, 'transparent');
        ctx.fillStyle = sun;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Cyber Neon / Studio Tech
        const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 80, width * 0.5, height * 0.5, 700);
        bgGrad.addColorStop(0, '#111827');
        bgGrad.addColorStop(0.6, '#0b0f19');
        bgGrad.addColorStop(1, '#030712');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Product Drawing with 100% Fidelity (Unchanged shape, ports, buttons, labels)
      const centerX = selectedStyle === 'cinematic_night' ? width * 0.56 : width * 0.5;
      const centerY = selectedStyle === 'cinematic_night' ? height * 0.52 : height * 0.48;
      const targetSize = selectedStyle === 'cinematic_night' ? 460 : 490;
      
      const ratio = Math.min(targetSize / img.width, targetSize / img.height);
      const imgW = img.width * ratio;
      const imgH = img.height * ratio;
      const imgX = centerX - imgW / 2;
      const imgY = centerY - imgH / 2;

      // Realistic contact shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + imgH * 0.46, imgW * 0.48, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw original product photo
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 20);
      ctx.clip();
      ctx.drawImage(img, imgX, imgY, imgW, imgH);
      ctx.restore();

      // Border contour
      ctx.strokeStyle = isNight ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 20);
      ctx.stroke();

      // 3. Top-Right Brand Logo (Mr.X Shop)
      if (showWatermark) {
        drawMrXLogo(ctx, width - 150, 75, isNight);
      }

      // 4. DYNAMIC Typography & Visual Layout (Derived from each Product)
      if (selectedStyle === 'cinematic_night') {
        ctx.textAlign = 'left';
        
        // Kicker (Dynamic based on product)
        ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(customData.kicker, 60, 68);

        // Large Headline (Dynamic based on product)
        ctx.font = '900 64px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(customData.headline, 60, 136);

        // Subtitle + SKU Badge (Dynamic based on product)
        ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(customData.subtitle, 60, 178);

        // Model Badge
        ctx.fillStyle = '#0284c7';
        const subWidth = ctx.measureText(customData.subtitle).width;
        ctx.beginPath();
        ctx.roundRect(60 + subWidth + 14, 156, 78, 28, 14);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(customData.badge, 60 + subWidth + 30, 175);

        // Supporting one-liner
        ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(customData.supportingLine, 60, 208);

        // LEFT COLUMN: Vertical Icon Feature Badges (Dynamic based on product)
        let featY = 270;
        customData.features.forEach((feat) => {
          // Circle icon container
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.strokeStyle = '#0088ff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(85, featY + 12, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Icon emoji
          ctx.font = '16px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(feat.icon, 85, featY + 18);

          // Title & Description
          ctx.textAlign = 'left';
          ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(feat.title, 120, featY + 8);

          ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(feat.desc, 120, featY + 24);

          featY += 62;
        });

        // BOTTOM RIGHT: Cursive Script Tagline (Dynamic based on product)
        ctx.textAlign = 'right';
        ctx.font = 'italic 700 32px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(customData.scriptWhite, width - 70, height - 120);

        ctx.font = 'italic 900 44px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0088ff';
        ctx.fillText(customData.scriptBlue, width - 70, height - 76);

        // BOTTOM BAR: Minimal Specs Strip (Dynamic based on product)
        ctx.textAlign = 'left';
        ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(customData.bottomBarText, 60, height - 45);
      } else {
        // Reference 1: Clean Daylight Minimal Commercial
        // Bottom Left Typography on Dark Slate Slab (Dynamic based on product)
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 38px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(customData.daylightHeadline, 60, height - 90);

        // Blue accent underline
        ctx.strokeStyle = '#0088ff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(60, height - 75);
        ctx.lineTo(130, height - 75);
        ctx.stroke();

        ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(customData.daylightSubtitle, 60, height - 52);

        // Bottom right ordering note
        ctx.textAlign = 'right';
        ctx.fillStyle = '#64748b';
        ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`WhatsApp: 01822300348 · ${brandSettings.websiteUrl}`, width - 60, height - 45);
      }
    };

    img.onerror = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.productName, width / 2, height / 2);
    };
  }, [item, selectedStyle, heroImageIndex, showWatermark, activeImage, brandSettings, customData]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.productName.slice(0, 18).replace(/\\s+/g, '_')}_MrX_Poster.png`;
    a.click();
  };

  const handleCopyCaption = () => {
    if (!item.caption?.fullFormattedText) return;
    navigator.clipboard.writeText(item.caption.fullFormattedText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(promptJson, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handlePublishNow = async () => {
    setIsPublishing(true);
    try {
      await onPublish(item.id);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              Mr.X
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 truncate max-w-md">
                {item.productName}
              </h2>
              <p className="text-xs text-slate-500">
                Official Mr.X Shop Advertising Creative Studio (1:1 Commercial Ad)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio View Navigation Tabs */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('poster')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'poster'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>1:1 Visual Poster</span>
            </button>
            <button
              onClick={() => setActiveTab('prompt_json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'prompt_json'
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Prompt JSON Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('caption')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'caption'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Social Media Caption</span>
            </button>
          </div>

          {activeTab === 'poster' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  isCustomizing ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Customize Data</span>
              </button>

              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setSelectedStyle('cinematic_night')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                    selectedStyle === 'cinematic_night'
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-600'
                  }`}
                >
                  <Moon className="w-3 h-3 text-blue-400" />
                  <span>Reference 2 (Cinematic Night)</span>
                </button>
                <button
                  onClick={() => setSelectedStyle('daylight_minimal')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                    selectedStyle === 'daylight_minimal'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>Reference 1 (Daylight Minimal)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: VISUAL POSTER STUDIO */}
          {activeTab === 'poster' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Canvas Preview (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="relative w-full max-w-[440px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                  <canvas ref={canvasRef} className="w-full h-full object-contain" />
                </div>

                {/* Photo Angle Picker from Badhons World */}
                <div className="w-full mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">
                      Product Reference Photo ({images.length} available)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Shape, ports & screen preserved
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHeroImageIndex(idx)}
                        className={`relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          heroImageIndex === idx
                            ? 'border-blue-600 ring-2 ring-blue-100 scale-105'
                            : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[9px] px-1">
                          #{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Poster Action Bar */}
                <div className="w-full flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showWatermark}
                      onChange={(e) => setShowWatermark(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Official Mr.X Shop Logo Overlay</span>
                  </label>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download 1:1 PNG</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Customize Data or Quick Copy & Safety (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {isCustomizing ? (
                  /* Custom Data Editor */
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-900">Custom Poster Data for This Product</span>
                      <button
                        onClick={() => setCustomData(resolveProductPosterData(item))}
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        Reset Defaults
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Headline</label>
                        <input
                          type="text"
                          value={customData.headline}
                          onChange={(e) => setCustomData({ ...customData, headline: e.target.value })}
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Model / Badge</label>
                        <input
                          type="text"
                          value={customData.badge}
                          onChange={(e) => setCustomData({ ...customData, badge: e.target.value })}
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Kicker (Top Eyebrow)</label>
                        <input
                          type="text"
                          value={customData.kicker}
                          onChange={(e) => setCustomData({ ...customData, kicker: e.target.value })}
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Subtitle</label>
                        <input
                          type="text"
                          value={customData.subtitle}
                          onChange={(e) => setCustomData({ ...customData, subtitle: e.target.value })}
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Script (White)</label>
                        <input
                          type="text"
                          value={customData.scriptWhite}
                          onChange={(e) => setCustomData({ ...customData, scriptWhite: e.target.value })}
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Script (Blue)</label>
                        <input
                          type="text"
                          value={customData.scriptBlue}
                          onChange={(e) => setCustomData({ ...customData, scriptBlue: e.target.value })}
                          className="w-full px-2 py-1 border rounded bg-white"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1">
                      Canvas updates dynamically in real-time as you type!
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Official Brand Identity Card */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">Brand Identity & Contacts</span>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          Mr.X Shop
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1 font-mono">
                        <div>WhatsApp: <span className="font-bold text-slate-900">01822300348</span> (Plain Number)</div>
                        <div>Website: <span className="text-blue-600">https://mrxshopbd.web.app</span></div>
                        <div>Tagline: <span className="text-slate-500">SMART GADGETS · BETTER LIFE</span></div>
                      </div>
                    </div>

                    {/* Active Poster Specs Summary */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-slate-900 mb-2">Applied Product Callouts:</div>
                      <div className="grid grid-cols-2 gap-2 text-slate-700">
                        {customData.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-white p-1.5 rounded border border-slate-100">
                            <span>{f.icon}</span>
                            <span className="font-bold truncate">{f.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Caption Snapshot */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Formatted Social Caption</span>
                    <button
                      onClick={handleCopyCaption}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {copiedCaption ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCaption ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[160px] overflow-y-auto bangla-text p-2 bg-white rounded border border-slate-100 font-sans">
                    {item.caption?.fullFormattedText}
                  </div>
                </div>

                {/* Publish Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handlePublishNow}
                    disabled={isPublishing || item.stage === 'published'}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                      item.stage === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {item.stage === 'published' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Published to Facebook & Instagram</span>
                      </>
                    ) : isPublishing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Publishing Post...</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Publish to Facebook & Instagram</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROMPT JSON ENGINE */}
          {activeTab === 'prompt_json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Official Prompt Specification JSON
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Automatically populated with current product name, description & Mr.X Shop brand constraints
                  </p>
                </div>

                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied JSON!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Complete JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto border border-slate-800">
                <pre>{JSON.stringify(promptJson, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL MEDIA CAPTION */}
          {activeTab === 'caption' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Facebook & Instagram Caption (Official Format)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Natural Bangla description + English hook + Plain WhatsApp number + Official Website
                  </p>
                </div>

                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Caption!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bangla-text">
                {item.caption?.fullFormattedText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
