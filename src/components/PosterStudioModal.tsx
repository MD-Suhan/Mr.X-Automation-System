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
  const nameLower = name.toLowerCase();

  // ONIKUMA Gaming Headsets (e.g. K19)
  if (nameLower.includes('k19') || nameLower.includes('onikuma') || (nameLower.includes('headset') && nameLower.includes('gaming'))) {
    return {
      kicker: 'PRO GAMING AUDIO  •  7.1 SURROUND',
      headline: nameLower.includes('k19') ? 'ONIKUMA K19' : name.split(' ').slice(0, 3).join(' '),
      subtitle: 'Pro RGB Gaming Headset',
      badge: '7.1 RGB',
      supportingLine: '40mm Neodymium Drivers  |  Noise-Canceling Mic  |  RGB Glow',
      features: [
        { icon: '🎧', title: 'Surround Bass', desc: '40mm Neodymium Drivers' },
        { icon: '🎙️', title: 'Noise-Free Mic', desc: 'Rotatable Clear Comms' },
        { icon: '🌈', title: 'RGB Lighting', desc: 'Dynamic Battle Glow' },
        { icon: '☁️', title: 'Memory Foam', desc: 'All-Day Comfy Cushion' },
      ],
      scriptWhite: 'Game With',
      scriptBlue: 'Power',
      bottomBarText: '🎮  7.1 SURROUND  |  NOISE-CANCELING MIC  |  RGB GLOW',
      daylightHeadline: 'ONIKUMA / K19',
      daylightSubtitle: 'PRO GAMING HEADSET',
    };
  }

  // QIF Fast Charging Power Banks (e.g. QY-45, QY-54)
  if (nameLower.includes('qy-45') || nameLower.includes('qy-54') || (nameLower.includes('qif') && nameLower.includes('power bank'))) {
    return {
      kicker: '100W SUPER PD  •  FAST CHARGING',
      headline: nameLower.includes('qy-45') ? 'QIF QY-45' : name.split(' ').slice(0, 2).join(' '),
      subtitle: '10000mAh PD Fast Charge Power Bank',
      badge: '100W PD',
      supportingLine: 'Digital Display  |  Built-in Type-C Cable  |  Compact Portability',
      features: [
        { icon: '⚡', title: '100W PD Charge', desc: 'Ultra-Fast Two-Way PD' },
        { icon: '🔋', title: '10,000mAh', desc: 'High-Density Lithium Cell' },
        { icon: '💡', title: 'Digital Screen', desc: 'Exact Battery % Level' },
        { icon: '🪢', title: 'Built-in Cable', desc: 'Lanyard Hand Strap' },
      ],
      scriptWhite: 'Power In',
      scriptBlue: 'Your Pocket',
      bottomBarText: '⚡  100W PD CHARGE  |  10000mAh  |  DIGITAL DISPLAY',
      daylightHeadline: '10000mAh / PD',
      daylightSubtitle: 'FAST CHARGING POWER BANK',
    };
  }

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

  // Smart Drones, Mobile Coolers, Cameras, Gaming Peripherals
  if (cat.includes('drone') || name.toLowerCase().includes('drone')) {
    return {
      kicker: '4K AERIAL VISION  •  ALTITUDE HOVER',
      headline: name.split(' ').slice(0, 3).join(' '),
      subtitle: '4K Ultra HD Dual Camera Drone',
      badge: '4K DUAL',
      supportingLine: 'Optical Flow Hover  |  WiFi FPV Live  |  360° Flips',
      features: [
        { icon: '📷', title: '4K Dual Cam', desc: '90° Adjustable View' },
        { icon: '🚁', title: 'Optical Flow', desc: 'Rock-Solid Auto Hover' },
        { icon: '📱', title: 'WiFi FPV', desc: 'Real-Time Phone Feed' },
        { icon: '⚡', title: 'Modular Batt', desc: 'Extended Flight Time' },
      ],
      scriptWhite: 'Fly High',
      scriptBlue: 'Capture All',
      bottomBarText: '🚁  4K DUAL CAMERA  |  OPTICAL HOVER  |  WIFI FPV',
      daylightHeadline: '4K / DUAL CAM',
      daylightSubtitle: 'PRO AERIAL DRONE',
    };
  }

  if (cat.includes('cooler') || name.toLowerCase().includes('cooler')) {
    return {
      kicker: 'INSTANT FREEZE  •  NO OVERHEATING',
      headline: name.split(' ').slice(0, 2).join(' '),
      subtitle: 'Semiconductor Mobile Gaming Cooler',
      badge: 'ICE COLD',
      supportingLine: 'Dual Peltier Chip  |  Silent Turbofan  |  RGB Gaming',
      features: [
        { icon: '❄️', title: 'Rapid Cool', desc: 'Drops Temp in 3 Secs' },
        { icon: '🎮', title: 'Esports Ready', desc: 'Zero Frame Drop' },
        { icon: '🔇', title: 'Silent Fan', desc: 'Ultra-Quiet Operation' },
        { icon: '🌈', title: 'RGB Lighting', desc: 'Dynamic Mecha Glow' },
      ],
      scriptWhite: 'Play Cool',
      scriptBlue: 'Win More',
      bottomBarText: '❄️  SEMICONDUCTOR CHIP  |  RGB LIGHTS  |  SILENT FAN',
      daylightHeadline: 'ICE / COOLER',
      daylightSubtitle: 'MOBILE GAMING FAN',
    };
  }

  // Fallback for gaming accessories or other categories
  const rawKeyPts = (item.aiAnalysis?.keySellingPoints || []).filter(
    (pt) => !pt.toLowerCase().includes('badhon') && !pt.includes('সাপ্লায়ার') && !pt.includes('স্টক')
  );
  const keyPts = rawKeyPts.length >= 4 ? rawKeyPts : [
    'Premium Build',
    'High Performance',
    'Certified Quality',
    'Extended Endurance'
  ];
  return {
    kicker: 'PREMIUM QUALITY  •  TREND TECH',
    headline: name.split(' ').slice(0, 3).join(' '),
    subtitle: `${item.category} Official Edition`,
    badge: 'PRO',
    supportingLine: 'Official Reseller  |  Authentic Stock  |  Warranty',
    features: [
      { icon: '✨', title: keyPts[0]?.slice(0, 16) || 'Premium Build', desc: 'Engineered for Performance' },
      { icon: '⚡', title: keyPts[1]?.slice(0, 16) || 'Fast Response', desc: 'Low Latency & High Speed' },
      { icon: '🛡️', title: keyPts[2]?.slice(0, 16) || 'Official Quality', desc: 'Certified Components' },
      { icon: '🔋', title: keyPts[3]?.slice(0, 16) || 'Durable Life', desc: 'Extended Battery Backup' },
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
  const [useCommercialPoster, setUseCommercialPoster] = useState<boolean>(true);
  const images = item.images && item.images.length > 0 ? item.images : [item.heroImage];
  // Default to unboxed product hero photo (index 1) if available and multiple photos exist
  const [heroImageIndex, setHeroImageIndex] = useState<number>(() => {
    return images.length > 1 ? 1 : 0;
  });
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [creativeAngleIndex, setCreativeAngleIndex] = useState(0);
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
    setUseCommercialPoster(true);
    const currentImgs = item.images && item.images.length > 0 ? item.images : [item.heroImage];
    setHeroImageIndex(currentImgs.length > 1 ? 1 : 0);
  }, [item]);

  // Handle Regenerate: cycle creative styles, angles, and typography variations
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const nextIndex = (creativeAngleIndex + 1) % 4;
      setCreativeAngleIndex(nextIndex);

      if (useCommercialPoster) {
        // Toggle between Night and Daylight commercial photography
        setSelectedStyle((prev) => (prev === 'cinematic_night' ? 'daylight_minimal' : 'cinematic_night'));
      } else {
        // Cycle to next product photo reference angle
        if (images.length > 1) {
          setHeroImageIndex((prev) => (prev + 1) % images.length);
        }
      }

      if (onRegenerate) {
        await onRegenerate(item.id, selectedStyle);
      }
    } catch {
      // handled
    } finally {
      setTimeout(() => {
        setIsRegenerating(false);
      }, 350);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeImage = images[heroImageIndex] || item.heroImage;

  // Complete Master Prompt JSON matching the user's exact specification
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
          quantity: `There are ${images.length} product reference images provided.`,
          instruction: "Use ALL identified product reference images together to understand the exact product identity, shape, proportions, dimensions, colors, materials, components, packaging details, buttons, ports, displays and other recognizable characteristics.",
          same_product_rule: "When multiple product images are provided, treat them as different views or references of the SAME product unless the user explicitly states otherwise."
        },
        logo_image: {
          rule: "Identify the image that primarily contains the actual Mr.X Shop brand logo as the LOGO REFERENCE, regardless of its upload order or position among the provided images.",
          quantity: "Normally there will be exactly ONE separate Mr.X Shop logo reference image.",
          instruction: "The identified Mr.X Shop logo image is a separate branding reference and must be used directly as the source of truth for the Mr.X Shop logo.",
          important: "Do NOT treat a logo, text, symbol, watermark or branding printed on the product or product packaging as the Mr.X Shop logo reference."
        },
        critical_rule: "Never assume that the first, second, third or last uploaded image is the logo. Determine the role of every image by visually inspecting its actual content."
      },
      product_reference_priority: {
        instruction: "Use ALL identified product reference images together as visual sources of truth for the same product.",
        priority: "For visual appearance, the actual product shown in the provided reference images always has higher priority than creative styling."
      },
      logo_reference_priority: {
        instruction: "The separately identified Mr.X Shop logo image is the ONLY valid source for the Mr.X Shop logo in the final poster.",
        priority: "The provided logo reference has higher priority than any AI-generated interpretation of the brand."
      }
    },
    product: {
      subject: `Use the exact product specified in "${item.productName}" as the main subject.`,
      importance: "The product must be the hero element of the poster.",
      identity: "Preserve the exact identity and recognizable characteristics of the product shown in ALL provided product reference images.",
      visual_priority: "The provided product images are the absolute visual source of truth for the actual product.",
      preserve: [
        "shape", "proportions", "dimensions", "color", "materials",
        "texture", "buttons", "ports", "logos printed on the actual product",
        "screen details", "components", "accessories", "overall design"
      ],
      restriction: [
        "Do not redesign the product.",
        "Do not recolor the product.",
        "Do not deform the product.",
        "Do not change its proportions.",
        "Do not add imaginary features.",
        "Do not remove actual features.",
        "Do not replace the actual product with a similar-looking product.",
        "Do not merge different product references into a new product.",
        "Do not alter important product details for aesthetic purposes."
      ]
    },
    creative_direction: {
      style: "premium cinematic commercial photography",
      theme: "modern technology, lifestyle and premium product advertising aesthetics",
      concept: "Build a creative environment around the product that visually communicates its purpose, features and lifestyle.",
      main_rule: "Change the environment, lighting, atmosphere and composition, not the product.",
      creativity_priority: "Creativity must come from the scene, background, lighting, camera composition, depth, atmosphere and environmental effects rather than changing the product."
    },
    scene_generation: {
      instruction: "Automatically create a visually appropriate premium environment based on the product category, product description and actual product appearance.",
      examples: {
        smartwatch: "futuristic technology and active lifestyle environment",
        earbuds: "premium music and entertainment environment",
        gaming_product: "dramatic gaming setup",
        speaker: "immersive sound environment",
        desk_lamp: "creative modern workspace",
        fan: "cool refreshing summer environment",
        portable_gadget: "modern lifestyle technology setup",
        lighting_product: "ambient interior environment",
        beauty_product: "premium clean beauty environment",
        home_product: "modern stylish home environment",
        figure_toy: "dramatic collector showcase room with atmospheric lighting and pedestal"
      },
      rule: "The environment may be highly creative, but it must never alter, redesign, recolor or distort the actual product."
    },
    branding: {
      brand: "Mr.X Shop",
      logo_reference: {
        source: "Use the separately identified Mr.X Shop logo reference image provided by the user.",
        instruction: "Use the exact provided Mr.X Shop logo as the ONLY source of truth. Do not create a new logo."
      },
      logo_processing: {
        background_removal: "Remove ONLY the original background surrounding the provided Mr.X Shop logo.",
        preserve: [
          "exact logo design", "exact logo shape", "original logo proportions",
          "original logo colors", "original logo text", "original logo symbols",
          "original typography", "original spacing"
        ]
      },
      logo_integration: {
        instruction: "After removing ONLY the background, place the EXACT provided Mr.X Shop logo naturally into the poster.",
        placement: "Use one clean corner of the poster with sufficient padding and clear visibility.",
        style: "premium, subtle and professional",
        visibility: "The logo must remain clearly recognizable and readable.",
        integration_rule: "Blend the logo with the overall environment only through subtle placement, shadow, glow or surrounding atmosphere. Do not modify the actual logo artwork."
      },
      absolute_logo_restrictions: [
        "Never generate a new Mr.X Shop logo.",
        "Never redraw the Mr.X Shop logo.",
        "Never recreate the Mr.X Shop logo from memory.",
        "Never approximate the Mr.X Shop logo.",
        "Never replace the provided Mr.X Shop logo.",
        "Never redesign the Mr.X Shop logo.",
        "Never change the logo colors.",
        "Never change the logo text.",
        "Never change the logo symbols.",
        "Never change the logo proportions.",
        "Never distort the logo.",
        "Never use product packaging branding as a replacement for the provided Mr.X Shop logo.",
        "Never omit the provided Mr.X Shop logo when a separate logo reference image is supplied."
      ]
    },
    lighting: {
      style: "cinematic commercial lighting",
      effects: [
        "soft glow", "rim lighting", "realistic reflections",
        "depth lighting", "ambient light", "premium highlights", "controlled shadows"
      ],
      restriction: "Lighting effects may interact naturally with the environment and product, but must not change the actual product color, shape or design."
    },
    visual_effects: {
      allowed: [
        "particles", "light streaks", "energy effects", "smoke",
        "mist", "water splashes", "motion effects", "environmental atmosphere", "subtle glow"
      ],
      restriction: "Visual effects must enhance the environment and advertising composition, not change or cover important product details."
    },
    composition: {
      format: "1:1 square",
      platform: ["Facebook", "Instagram"],
      focus: "Hero product composition",
      layout: {
        product: "Center or dominant position depending on the product and scene.",
        logo: "One clean corner position with sufficient padding.",
        text: "Minimal and clean.",
        negative_space: "Maintain professional visual balance.",
        hierarchy: "Product first, product name second, important features third, branding and supporting information after that."
      }
    },
    typography: {
      headline: `Use the exact value from "${item.productName}".`,
      style: "modern premium sans-serif",
      supporting_text: {
        instruction: "Select only a few of the most important and relevant features or benefits from product description.",
        rule: "Keep supporting text concise, accurate, readable and visually balanced.",
        language_rule: "Use clear professional English for poster text unless the user explicitly requests another language."
      },
      text_rule: [
        "Minimal text.", "No clutter.", "Professional appearance.",
        "Do not fill the poster with unnecessary text.",
        "Do not place the entire product description on the poster.",
        "Do not invent technical specifications.",
        "Do not invent numbers.", "Do not invent unsupported claims.",
        "Do not exaggerate product capabilities.",
        "Do not repeat the same information unnecessarily."
      ]
    },
    quality: {
      photorealism: "high-end commercial photography",
      details: "ultra-detailed",
      render: "premium advertising quality",
      shadows: "realistic",
      reflections: "realistic",
      materials: "physically accurate",
      depth: "cinematic depth of field",
      finish: "professional e-commerce advertising quality"
    },
    negative_constraints: [
      "do not change product shape", "do not change product color",
      "do not change product proportions", "do not change product design",
      "do not invent product features", "do not invent specifications",
      "do not invent numbers or claims", "do not remove actual product features",
      "do not replace the product with another product",
      "do not merge different product references into a new product",
      "do not generate a new Mr.X Shop logo", "do not redraw the Mr.X Shop logo",
      "do not redesign the Mr.X Shop logo", "do not approximate the Mr.X Shop logo",
      "do not recreate the logo from memory", "do not replace the provided logo",
      "do not change logo colors", "do not change logo text",
      "do not change logo symbols", "do not change logo proportions",
      "do not distort the logo", "do not use packaging branding as the Mr.X Shop logo",
      "do not omit the provided Mr.X Shop logo",
      "do not place the logo incorrectly over important product details",
      "avoid clutter", "avoid excessive text", "avoid low-quality rendering",
      "avoid unrealistic product geometry", "avoid stock-photo appearance",
      "avoid generic AI-generated branding"
    ],
    social_media_caption: {
      instruction: "After creating the poster, generate a separate modern, minimalistic and ready-to-post social media caption for the same product.",
      style: {
        tone: "modern, clean, professional, natural and engaging",
        language: "Bangla and English mixed naturally",
        length: "short to medium",
        format: "Facebook and Instagram ready-to-post"
      },
      content_source: {
        product_name: item.productName,
        product_description: item.aiAnalysis?.productSummary || item.productName,
        instruction: "Use the product name and the provided product description as the factual source for the caption."
      },
      structure: {
        line_1: "Product name and important model, capacity or specification when relevant.",
        line_2: "A short, catchy English hook related to the product.",
        line_3: "A concise natural Bangla description explaining the product's main use, benefit or appeal.",
        line_4: "A short ordering call-to-action.",
        contact: "Include the official Mr.X Shop WhatsApp number ONLY. Do NOT create or display a WhatsApp link.",
        website: "Include the official Mr.X Shop website.",
        hashtags: "Generate relevant product-specific hashtags."
      },
      writing_rules: [
        "Keep the caption modern and minimalistic.",
        "Do not repeat the entire product description.",
        "Use only accurate information from the provided product description.",
        "Do not invent specifications, price, warranty, discount or claims.",
        "Mention only the most useful product features.",
        "Avoid generic, overly promotional or exaggerated language.",
        "Keep Bangla natural and easy to read.",
        "Use English naturally where it improves the caption.",
        "Do not use unnecessary emojis.",
        "Use 'Inbox / WhatsApp' or similar natural ordering language.",
        "Keep the caption visually clean with proper line breaks.",
        "Generate approximately 5-10 relevant hashtags.",
        "Include the brand hashtag #MrXShop.",
        "Do NOT output a wa.me link.",
        "Do NOT convert the WhatsApp number into a clickable link.",
        "Display the WhatsApp contact as a plain phone number only."
      ],
      official_contact: {
        whatsapp_number: "01822300348",
        website: "https://mrxshopbd.web.app"
      },
      output_format: {
        instruction: "Return the caption as a clean copy-paste-ready text block after generating the poster.",
        template: `${item.productName}\n\n[Short English hook]\n[Short natural Bangla product-focused description]\n\n📩 অর্ডার করতে Inbox / WhatsApp করুন। অথবা অর্ডার করুন Website-এ।\n\n📲 WhatsApp: 01822300348\n🌐 Website: https://mrxshopbd.web.app\n\n#MrXShop #${item.category.replace(/\\s+/g, '')} #TechGadgetsBD`
      }
    },
    final_instruction: "First visually inspect ALL uploaded images and identify their roles. Determine which image is the separate Mr.X Shop logo and which images are product references based on their visual content, not upload order. Treat every non-logo product-related image as a product reference and use ALL product reference images together as different views or references of the SAME product. Read and understand the entire product description, even if it is very long or written in Bangla, English, Banglish or mixed language. Use the description as the factual source for specifications, features, functions, benefits and selling points. Do not invent or assume unsupported information. Do not place the entire description on the poster; select only a few important and accurate points. For the actual product appearance, always follow the provided product reference images. Treat the identified Mr.X Shop logo image as the ONLY valid source for the Mr.X Shop logo. Remove ONLY its original background and place the EXACT original logo into the poster. Never recreate, redraw, redesign, approximate, replace or omit the provided logo. Create a premium, photorealistic, cinematic 1:1 advertising poster where the product remains the hero element. Build all creativity around the environment, lighting, atmosphere, effects and composition while keeping both the actual product and provided Mr.X Shop logo visually faithful to their reference images. After generating the poster, provide a separate modern, minimalistic, copy-paste-ready social media caption using the product name and accurate information from the product description. The caption must show the official Mr.X Shop WhatsApp contact as the plain number 01822300348 only, never as a wa.me link, followed by the official website https://mrxshopbd.web.app and relevant product-specific hashtags."
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

  const daylightIndex = images.findIndex((url) => url.includes('daylight_flatlay'));
  const cinematicIndex = images.findIndex((url) => url.includes('cinematic_poster'));

  const rawImage = (() => {
    const nameLower = (item.productName || '').toLowerCase();

    // When commercial poster mode is active (default for unboxed studio aesthetic)
    if (useCommercialPoster) {
      // 1. ONIKUMA Gaming Headsets (e.g. K19)
      if (nameLower.includes('k19') || nameLower.includes('onikuma') || (nameLower.includes('headset') && nameLower.includes('gaming'))) {
        if (selectedStyle === 'cinematic_night' || selectedStyle === 'cyber_neon' || selectedStyle === 'studio_tech') {
          return '/images/k19_gaming_night_poster.jpg';
        }
        return '/images/k19_gaming_daylight_poster.jpg';
      }

      // 2. QIF Fast Charging Power Banks (e.g. QY-45, QY-54)
      if (nameLower.includes('qy-45') || nameLower.includes('qy-54') || nameLower.includes('qif') || (nameLower.includes('power bank') && nameLower.includes('fast charging'))) {
        if (selectedStyle === 'cinematic_night' || selectedStyle === 'cyber_neon' || selectedStyle === 'studio_tech') {
          return '/images/qy45_powerbank_night_poster.jpg';
        }
        return '/images/qy45_powerbank_daylight_poster.jpg';
      }

      // 3. A9 Pro Earbuds
      if (nameLower.includes('a9 pro') || item.productId === 'prod-bw-001') {
        if (selectedStyle === 'cinematic_night' || selectedStyle === 'cyber_neon' || selectedStyle === 'studio_tech') {
          return '/images/a9_pro_cinematic_poster.jpg';
        }
        return '/images/a9_pro_daylight_flatlay.jpg';
      }

      // 4. HK9 Ultra Smartwatch
      if (nameLower.includes('hk9') || nameLower.includes('watch')) {
        return '/images/hk9_ultra_watch_poster.jpg';
      }

      // 5. Cyberpunk Magnetic Power Bank
      if (nameLower.includes('cyberpunk')) {
        return '/images/cyber_powerbank_poster.jpg';
      }

      // 6. Tom & Jerry or Superhero Collectibles
      if (nameLower.includes('superhero') || nameLower.includes('spider-man')) {
        return '/images/superhero_figure_poster.jpg';
      }
      if (nameLower.includes('tom & jerry') || nameLower.includes('tom and jerry')) {
        return '/images/tom_and_jerry_poster.jpg';
      }
    }

    // When viewing a specific supplier photo reference angle:
    if (images[heroImageIndex]) {
      return images[heroImageIndex];
    }
    return item.heroImage;
  })();

  const effectiveImage = rawImage && rawImage.startsWith('http')
    ? `/api/proxy-image?url=${encodeURIComponent(rawImage)}`
    : rawImage;

  const [isCanvasRendering, setIsCanvasRendering] = useState(true);

  // High-Resolution 1080x1080 Promotional Poster Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsCanvasRendering(true);

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const isNight = selectedStyle === 'cinematic_night' || selectedStyle === 'cyber_neon' || selectedStyle === 'studio_tech';

    const drawPosterScene = (productImg: HTMLImageElement | null) => {
      // 1. Background Scene
      if (selectedStyle === 'cinematic_night') {
        // Reference 2: Dark Slate Studio Night with Wet Reflections & Neon Bokeh
        const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 100, width * 0.5, height * 0.5, 750);
        bgGrad.addColorStop(0, '#0a1426');
        bgGrad.addColorStop(0.4, '#060a12');
        bgGrad.addColorStop(1, '#020307');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Ambient cyan-blue bokeh spotlight
        const bokeh = ctx.createRadialGradient(width * 0.65, height * 0.42, 40, width * 0.65, height * 0.42, 380);
        bokeh.addColorStop(0, 'rgba(0, 136, 255, 0.32)');
        bokeh.addColorStop(0.6, 'rgba(0, 136, 255, 0.08)');
        bokeh.addColorStop(1, 'transparent');
        ctx.fillStyle = bokeh;
        ctx.beginPath();
        ctx.arc(width * 0.65, height * 0.42, 380, 0, Math.PI * 2);
        ctx.fill();

        // Wet slate rock pedestal
        const rockGrad = ctx.createLinearGradient(0, height * 0.56, 0, height * 0.92);
        rockGrad.addColorStop(0, '#1c2430');
        rockGrad.addColorStop(0.3, '#0f1722');
        rockGrad.addColorStop(1, '#080d14');
        ctx.fillStyle = rockGrad;
        ctx.beginPath();
        ctx.ellipse(width * 0.54, height * 0.72, width * 0.44, height * 0.20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pedestal edge rim highlight
        ctx.strokeStyle = 'rgba(0, 136, 255, 0.28)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else if (selectedStyle === 'daylight_minimal') {
        // Reference 1: Bright Clean Daylight Commercial with Daylight Sunlight & Floor Surface
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#f8fafc');
        bgGrad.addColorStop(0.45, '#f1f5f9');
        bgGrad.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Soft daylight floor plane
        const floorGrad = ctx.createLinearGradient(0, height * 0.68, 0, height);
        floorGrad.addColorStop(0, '#e2e8f0');
        floorGrad.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, height * 0.68, width, height * 0.32);

        // Floor horizon line highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.68);
        ctx.lineTo(width, height * 0.68);
        ctx.stroke();

        // Soft sunlight beam from top left
        const sun = ctx.createRadialGradient(width * 0.2, height * 0.2, 50, width * 0.2, height * 0.2, 600);
        sun.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
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

      // 2. Real Product Hero Staging (Unchanged shape, ports, buttons, colors)
      if (productImg && productImg.width > 0) {
        const centerX = selectedStyle === 'cinematic_night' ? width * 0.56 : width * 0.54;
        const centerY = selectedStyle === 'cinematic_night' ? height * 0.50 : height * 0.48;
        // Large hero size (640px) so product is prominent and crisp
        const targetSize = selectedStyle === 'cinematic_night' ? 620 : 640;
        
        const ratio = Math.min(targetSize / productImg.width, targetSize / productImg.height);
        const imgW = productImg.width * ratio;
        const imgH = productImg.height * ratio;
        const imgX = centerX - imgW / 2;
        const imgY = centerY - imgH / 2;

        // Realistic layered ground contact shadow beneath product base
        const shadowGrad = ctx.createRadialGradient(centerX, centerY + imgH * 0.46, 10, centerX, centerY + imgH * 0.46, imgW * 0.46);
        shadowGrad.addColorStop(0, isNight ? 'rgba(0, 0, 0, 0.75)' : 'rgba(15, 23, 42, 0.35)');
        shadowGrad.addColorStop(0.5, isNight ? 'rgba(0, 0, 0, 0.35)' : 'rgba(15, 23, 42, 0.15)');
        shadowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + imgH * 0.46, imgW * 0.46, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw real product photo with soft feathered edge mask (eliminating hard sticker boxes)
        const offCanvas = document.createElement('canvas');
        offCanvas.width = Math.round(imgW);
        offCanvas.height = Math.round(imgH);
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(productImg, 0, 0, imgW, imgH);
          // Apply soft radial vignette mask so corners and borders blend seamlessly into the scene
          offCtx.globalCompositeOperation = 'destination-in';
          const maskGrad = offCtx.createRadialGradient(
            imgW / 2, imgH / 2, Math.min(imgW, imgH) * 0.35,
            imgW / 2, imgH / 2, Math.max(imgW, imgH) * 0.52
          );
          maskGrad.addColorStop(0, 'rgba(0,0,0,1)');
          maskGrad.addColorStop(0.85, 'rgba(0,0,0,0.95)');
          maskGrad.addColorStop(1, 'rgba(0,0,0,0)');
          offCtx.fillStyle = maskGrad;
          offCtx.fillRect(0, 0, imgW, imgH);

          ctx.drawImage(offCanvas, imgX, imgY);
        } else {
          ctx.drawImage(productImg, imgX, imgY, imgW, imgH);
        }
      }

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

        // Model / Stock Badge
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

        // Price Tag if available
        if (item.price && item.price > 0) {
          ctx.save();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.roundRect(60, 222, 120, 32, 8);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(`৳ ${item.price.toLocaleString()} BDT`, 72, 243);
          ctx.restore();
        }

        // LEFT COLUMN: Vertical Icon Feature Badges (Dynamic based on product)
        let featY = 276;
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

          featY += 60;
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
        ctx.textAlign = 'left';
        
        // Top Left Kicker
        ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0284c7';
        ctx.fillText(customData.kicker, 60, 68);

        // Large Dark Headline
        ctx.font = '900 64px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(customData.headline, 60, 136);

        // Subtitle + Badge
        ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#334155';
        ctx.fillText(customData.subtitle, 60, 178);

        // Badge pill
        ctx.fillStyle = '#0088ff';
        const subW = ctx.measureText(customData.subtitle).width;
        ctx.beginPath();
        ctx.roundRect(60 + subW + 14, 156, 78, 28, 14);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(customData.badge, 60 + subW + 30, 175);

        // Price Tag if available
        if (item.price && item.price > 0) {
          ctx.save();
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.roundRect(60, 204, 120, 32, 8);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(`৳ ${item.price.toLocaleString()} BDT`, 72, 225);
          ctx.restore();
        }

        // LEFT COLUMN: Clean Daylight Feature Cards
        let dFeatY = 256;
        customData.features.slice(0, 3).forEach((feat) => {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(60, dFeatY, 210, 48, 10);
          ctx.fill();
          ctx.stroke();

          // Icon
          ctx.font = '16px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(feat.icon, 82, dFeatY + 30);

          // Text
          ctx.textAlign = 'left';
          ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText(feat.title, 104, dFeatY + 22);

          ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#64748b';
          ctx.fillText(feat.desc, 104, dFeatY + 37);

          dFeatY += 56;
        });

        // Bottom Left Tagline
        ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(customData.daylightHeadline, 60, height - 75);

        ctx.strokeStyle = '#0088ff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(60, height - 60);
        ctx.lineTo(140, height - 60);
        ctx.stroke();

        ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText(customData.daylightSubtitle, 60, height - 40);

        // Bottom right ordering note
        ctx.textAlign = 'right';
        ctx.fillStyle = '#64748b';
        ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`WhatsApp: 01822300348 · ${brandSettings.websiteUrl}`, width - 60, height - 45);
      }

      setIsCanvasRendering(false);
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Check if image is a commercial poster art (either AI generated or preset commercial asset)
      const isCommercialArt =
        typeof effectiveImage === 'string' &&
        (effectiveImage.includes('_poster') ||
          effectiveImage.includes('_flatlay') ||
          effectiveImage.includes('k19_gaming') ||
          effectiveImage.includes('qy45_powerbank') ||
          effectiveImage.includes('a9_pro') ||
          effectiveImage.includes('cyber_powerbank') ||
          effectiveImage.includes('hk9_ultra') ||
          effectiveImage.includes('superhero_figure') ||
          effectiveImage.includes('tom_and_jerry'));

      if (isCommercialArt) {
        // Draw the full cinematic commercial photography poster edge-to-edge
        ctx.drawImage(img, 0, 0, width, height);

        // Always overlay the clean official Mr.X Shop brand watermark with subtle shadow
        if (showWatermark) {
          drawMrXLogo(ctx, width - 150, 75, isNight);
        }

        // Draw clean official contact footer
        ctx.textAlign = 'right';
        ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = isNight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(15, 23, 42, 0.75)';
        ctx.fillText('WhatsApp: 01822300348 · mrxshopbd.web.app', width - 60, height - 40);

        setIsCanvasRendering(false);
        return;
      }

      drawPosterScene(img);
    };

    img.onerror = () => {
      // Fallback: try loading directly without crossOrigin
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        drawPosterScene(fallbackImg);
      };
      fallbackImg.onerror = () => {
        drawPosterScene(null);
      };
      fallbackImg.src = rawImage;
    };

    img.src = effectiveImage;
  }, [item, selectedStyle, heroImageIndex, showWatermark, effectiveImage, rawImage, brandSettings, customData]);

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-5xl w-full max-h-[96vh] sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header - Sticky top with guaranteed close button */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 py-3 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
              Mr.X
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {item.productName}
              </h2>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span className="text-[10px] sm:text-xs text-slate-500">
                  Mr.X Creative Studio (1:1 Commercial Ad)
                </span>
                {item.productUrl && (
                  <a
                    href={item.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-2 py-0.5 rounded transition-colors"
                    title="Open live supplier product on badhonsworld.com to verify specs and photos"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>🔗 Open Supplier Product (badhonsworld.com)</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all shadow-xs border border-slate-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-800" />
          </button>
        </div>

        {/* Studio View Navigation Tabs - Fully Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-6 py-2 border-b border-slate-100 bg-slate-50/60 gap-2">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setActiveTab('poster')}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'poster'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>1:1 Visual Poster</span>
            </button>
            <button
              onClick={() => setActiveTab('prompt_json')}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'prompt_json'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Prompt JSON Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('caption')}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'caption'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Social Media Caption</span>
            </button>
          </div>

          {activeTab === 'poster' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              <button
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isCustomizing ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Customize Data</span>
              </button>

              <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg text-xs font-medium shrink-0">
                <button
                  onClick={() => setSelectedStyle('cinematic_night')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    selectedStyle === 'cinematic_night'
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-600'
                  }`}
                >
                  <Moon className="w-3 h-3 text-blue-400" />
                  <span>3rd Image (Night)</span>
                </button>
                <button
                  onClick={() => setSelectedStyle('daylight_minimal')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    selectedStyle === 'daylight_minimal'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>2nd Image (Daylight)</span>
                </button>
              </div>

              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs active:scale-95 transition-all"
                title="Regenerate poster composition, lighting, and angles"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'Regenerating...' : '🔄 Regenerate Poster'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {/* TAB 1: VISUAL POSTER STUDIO */}
          {activeTab === 'poster' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Canvas Preview (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="relative w-full max-w-[440px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                  <canvas ref={canvasRef} className="w-full h-full object-contain" />
                  {isCanvasRendering && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                      <Sparkles className="w-6 h-6 text-blue-400 animate-spin" />
                      <span className="text-xs font-semibold text-slate-200">পোস্টার প্রস্তুত হচ্ছে...</span>
                      <span className="text-[10px] text-slate-400">Badhons World লাইভ ইমেজ প্রসেসিং</span>
                    </div>
                  )}
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
                    {/* ✨ AI Commercial Poster Button */}
                    <button
                      onClick={() => {
                        setUseCommercialPoster(true);
                      }}
                      className={`relative px-3 py-1.5 shrink-0 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center gap-1.5 text-center ${
                        useCommercialPoster
                          ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-100 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 opacity-80 hover:opacity-100'
                      }`}
                      title="AI generated unboxed commercial advertising poster"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[11px] whitespace-nowrap">✨ AI Master Poster</span>
                    </button>

                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setUseCommercialPoster(false);
                          setHeroImageIndex(idx);
                        }}
                        className={`relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          !useCommercialPoster && heroImageIndex === idx
                            ? 'border-blue-600 ring-2 ring-blue-100 scale-105'
                            : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                        title={`Angle #${idx + 1}`}
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
                <div className="w-full flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showWatermark}
                      onChange={(e) => setShowWatermark(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Official Mr.X Shop Logo Overlay</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRegenerate}
                      disabled={isRegenerating}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all shadow-xs"
                      title="নতুন লাইটিং, অ্যাঙ্গেল এবং কম্পোজিশনে পোস্টার পুনরায় তৈরি করুন"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                      <span>{isRegenerating ? 'তৈরি হচ্ছে...' : '🔄 Regenerate Poster'}</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download 1:1 PNG</span>
                    </button>
                  </div>
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

                {/* Direct Supplier Source Product Verification Card */}
                {item.productUrl && (
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-slate-900">
                        🔍 অরিজিনাল প্রডাক্ট সোর্স লিংক
                      </span>
                      <a
                        href={item.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded-md transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>ভিজিট করুন</span>
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      অ্যাপ্রুভ করার আগে badhonsworld.com-এর আসল প্রডাক্ট পেজ ওপেন করে ছবি ও টেকনিক্যাল স্পেসিফিকেশন মিলিয়ে নিন।
                    </p>
                    <div className="mt-2 pt-1.5 border-t border-blue-200/60 text-[11px] text-blue-700 font-mono truncate">
                      {item.productUrl}
                    </div>
                  </div>
                )}

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

        {/* Mobile Sticky Footer Close Button */}
        <div className="sm:hidden px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-medium text-slate-500 truncate mr-2">
            {item.productName}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>বন্ধ করুন (Close)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
