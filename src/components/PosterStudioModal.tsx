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
  onApprove?: (itemId: string) => Promise<void>;
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
  const cat = (item.category || '').trim();
  const name = (item.productName || '').trim();

  // Extract clean headline: up to first 3 words or short model
  const nameWords = name.split(/\s+/);
  const headline = nameWords.slice(0, 3).join(' ');

  // Verified specs from title / description (NO invented numbers!)
  const text = `${name} ${item.aiAnalysis?.productSummary || ''}`;
  let badge = 'OFFICIAL';
  const battMatch = text.match(/\b\d+[\d,]*\s*mah\b/i);
  const wattMatch = text.match(/\b\d+\s*w(?:att)?\b|\bpd\b/i);
  const ancMatch = text.match(/\banc\b|\benc\b/i);
  const dispMatch = text.match(/\bamoled\b|\blcd\b|\bips\b/i);

  if (battMatch) badge = battMatch[0].toUpperCase();
  else if (wattMatch) badge = wattMatch[0].toUpperCase();
  else if (ancMatch) badge = ancMatch[0].toUpperCase();
  else if (dispMatch) badge = dispMatch[0].toUpperCase();

  // Verified key features from AI analysis or real specs
  const rawKeyPts = (item.aiAnalysis?.keySellingPoints || []).filter(
    (pt) => !pt.toLowerCase().includes('badhon') && !pt.includes('সাপ্লায়ার') && !pt.includes('স্টক')
  );

  const keyPts = rawKeyPts.length > 0 ? rawKeyPts : [
    'Authentic Reseller Stock',
    'Tested & Verified Quality',
    '100% Genuine Device',
  ];

  const features = [
    { icon: '✨', title: keyPts[0]?.slice(0, 18) || 'Authentic Stock', desc: 'Verified by Mr.X Shop' },
    { icon: '⚡', title: keyPts[1]?.slice(0, 18) || 'Official Quality', desc: 'Genuine Components' },
    { icon: '🛡️', title: keyPts[2]?.slice(0, 18) || 'Tested Device', desc: 'Pre-Shipment Checked' },
  ];

  return {
    kicker: 'AUTHENTIC TECH  •  OFFICIAL RESELLER',
    headline,
    subtitle: `${cat || 'Smart Gadget'} Official Edition`,
    badge,
    supportingLine: 'Verified Quality  |  Authentic Reseller  |  Cash on Delivery',
    features,
    scriptWhite: 'Smart Choice',
    scriptBlue: 'Mr.X Shop',
    bottomBarText: `✨  ${(cat || 'SMART GADGET').toUpperCase()}  |  AUTHENTIC QUALITY  |  OFFICIAL RESELLER`,
    daylightHeadline: `${headline.toUpperCase()}`,
    daylightSubtitle: `${(cat || 'OFFICIAL EDITION').toUpperCase()}`,
  };
}

export const PosterStudioModal: React.FC<PosterStudioModalProps> = ({
  item,
  brandSettings,
  postingRules,
  onClose,
  onApprove,
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
    product_data_source: {
      source_of_truth: "Badhons World (badhonsworld.com) Reseller Catalog",
      source_product_url: item.productUrl,
      supplier_name: item.supplier,
      category: item.category,
      available_reference_images_count: images.length,
      rules: [
        "Product name, all available product images, description and available product information must come from Badhons World.",
        "Badhons World is the strict SOURCE OF TRUTH for product data.",
        "Do NOT replace Badhons World product data with random web-search results or AI-invented product information.",
        "Collect and use all available product images from the Badhons World product page as visual references when possible, not only the main image.",
        "Badhons World product images are REFERENCE IMAGES ONLY, not the final poster image.",
        "NEVER paste or overlay the original rectangular product photo or its original background into the poster.",
        "Generate the actual physical product naturally inside a new cinematic advertising scene while preserving its real appearance, shape, proportions, colors, materials, branding and visible details.",
        "Product description/caption must be based on the actual Badhons World product information.",
        "If required information is missing from Badhons World, do not invent it; leave it out or flag it for review."
      ]
    },
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

  // Helper: Background isolation & product segmentation (Removes raw photo background box)
  const isolateProductSubject = (img: HTMLImageElement): HTMLCanvasElement => {
    const off = document.createElement('canvas');
    off.width = img.naturalWidth || img.width || 600;
    off.height = img.naturalHeight || img.height || 600;
    const offCtx = off.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return off;

    offCtx.drawImage(img, 0, 0, off.width, off.height);
    try {
      const imgData = offCtx.getImageData(0, 0, off.width, off.height);
      const d = imgData.data;
      const w = off.width;
      const h = off.height;

      // Sample along all 4 perimeter borders to accurately identify the background
      const borderSamples: Array<[number, number]> = [];
      const stepX = Math.max(1, Math.floor(w / 32));
      const stepY = Math.max(1, Math.floor(h / 32));

      for (let x = 0; x < w; x += stepX) {
        borderSamples.push([x, 1], [x, 2], [x, h - 2], [x, h - 3]);
      }
      for (let y = 0; y < h; y += stepY) {
        borderSamples.push([1, y], [2, y], [w - 2, y], [w - 3, y]);
      }

      let bgR = 0, bgG = 0, bgB = 0, sampleCount = 0;
      for (const [sx, sy] of borderSamples) {
        if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
          const idx = (sy * w + sx) * 4;
          bgR += d[idx];
          bgG += d[idx + 1];
          bgB += d[idx + 2];
          sampleCount++;
        }
      }
      if (sampleCount > 0) {
        bgR /= sampleCount;
        bgG /= sampleCount;
        bgB /= sampleCount;
      }

      const avgLuminance = (bgR + bgG + bgB) / 3;
      const isLightBg = avgLuminance > 135;
      const lowerThresh = isLightBg ? 30 : 25;
      const upperThresh = isLightBg ? 76 : 60;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;

          // Enforce 100% transparent margin along outermost 2 pixels to erase any raw frame line
          if (x <= 1 || x >= w - 2 || y <= 1 || y >= h - 2) {
            d[i + 3] = 0;
            continue;
          }

          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];

          // Check if pixel is standard white/near-white studio backdrop
          const isStudioWhite = r > 220 && g > 220 && b > 220 && Math.max(r, g, b) - Math.min(r, g, b) < 28;
          if (isStudioWhite && isLightBg) {
            d[i + 3] = 0;
            continue;
          }

          const diff = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

          if (diff < lowerThresh) {
            d[i + 3] = 0; // Cut out background
          } else if (diff < upperThresh) {
            // Soft anti-aliased edge transition
            const factor = (diff - lowerThresh) / (upperThresh - lowerThresh);
            d[i + 3] = Math.round(d[i + 3] * factor);
          }
        }
      }

      offCtx.putImageData(imgData, 0, 0);
    } catch {
      // CORS fallback
    }
    return off;
  };

  const rawImage = (() => {
    // If AI generated poster exists on creative asset, use it when commercial mode is on
    if (useCommercialPoster && item.creative?.generatedPosterUrl) {
      return item.creative.generatedPosterUrl;
    }
    // Otherwise use authentic product reference photo
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

    // Load official Mr.X Shop Logo Image
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    let logoLoaded = false;
    logoImg.onload = () => {
      logoLoaded = true;
      if (!isCanvasRendering) {
        drawWatermarkLogo();
      }
    };
    logoImg.src = brandSettings.customLogoUrl || (isNight ? '/images/mrx_shop_logo.svg' : '/images/mrx_shop_logo_dark.svg');

    const drawWatermarkLogo = () => {
      if (!showWatermark) return;
      if (logoLoaded && logoImg.width > 0) {
        ctx.save();
        ctx.drawImage(logoImg, width - 220, 42, 170, 68);
        ctx.restore();
      }
    };

    const drawPosterScene = (productImg: HTMLImageElement | null) => {
      // 1. Background Scene
      if (selectedStyle === 'cinematic_night') {
        // Dark Slate Studio Night with Wet Reflections & Neon Bokeh
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
        // Bright Clean Daylight Commercial with Sunlight & Floor Surface
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

      // 2. Real Product Hero Staging (Isolated Physical Gadget, No Box Borders, True Fidelity)
      if (productImg && productImg.width > 0) {
        // Isolate the physical product from the original rectangular photo background
        const isolatedCanvas = isolateProductSubject(productImg);

        const targetSize = selectedStyle === 'cinematic_night' ? 620 : 640;
        const ratio = Math.min(targetSize / productImg.width, targetSize / productImg.height);
        const imgW = productImg.width * ratio;
        const imgH = productImg.height * ratio;

        // Dynamic scene-dependent placement (offset to right on pedestal)
        const centerX = selectedStyle === 'cinematic_night' ? width * 0.55 : width * 0.53;
        const centerY = selectedStyle === 'cinematic_night' ? height * 0.50 : height * 0.48;
        const imgX = centerX - imgW / 2;
        const imgY = centerY - imgH / 2;

        const baseContactY = centerY + imgH * 0.44;

        // Realistic Layer 1: Tight Dark Contact Shadow right at bottom of physical product
        ctx.save();
        const contactGrad = ctx.createRadialGradient(centerX, baseContactY, 4, centerX, baseContactY, imgW * 0.38);
        contactGrad.addColorStop(0, isNight ? 'rgba(0, 0, 0, 0.95)' : 'rgba(15, 23, 42, 0.55)');
        contactGrad.addColorStop(0.6, isNight ? 'rgba(0, 0, 0, 0.60)' : 'rgba(15, 23, 42, 0.25)');
        contactGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = contactGrad;
        ctx.beginPath();
        ctx.ellipse(centerX, baseContactY, imgW * 0.38, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Realistic Layer 2: Diffuse Ambient Occlusion Shadow
        ctx.save();
        const ambientGrad = ctx.createRadialGradient(centerX, baseContactY + 6, 12, centerX, baseContactY + 6, imgW * 0.52);
        ambientGrad.addColorStop(0, isNight ? 'rgba(0, 0, 0, 0.65)' : 'rgba(15, 23, 42, 0.30)');
        ambientGrad.addColorStop(0.5, isNight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(15, 23, 42, 0.10)');
        ambientGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = ambientGrad;
        ctx.beginPath();
        ctx.ellipse(centerX, baseContactY + 6, imgW * 0.52, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Realistic Layer 3: Flipped Soft Wet Reflection (for Night / Pedestal style)
        if (isNight) {
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(width * 0.54, height * 0.72, width * 0.44, height * 0.20, 0, 0, Math.PI * 2);
          ctx.clip(); // Clip reflection to wet slate pedestal surface

          ctx.save();
          ctx.translate(imgX, baseContactY * 2 - 10);
          ctx.scale(1, -0.28); // Flattened inverted reflection
          ctx.globalAlpha = 0.22;
          ctx.drawImage(isolatedCanvas, 0, imgY);
          ctx.restore();

          ctx.restore();
        }

        // Draw the pure physical product (No rectangular box, exact shape, buttons, ports)
        ctx.drawImage(isolatedCanvas, imgX, imgY, imgW, imgH);

        // Realistic Layer 4: Subtle Environmental Light Rim
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = isNight ? 0.08 : 0.05;
        ctx.fillStyle = isNight ? '#38bdf8' : '#fed7aa';
        ctx.beginPath();
        ctx.arc(centerX, centerY, imgW * 0.48, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Top-Right Brand Logo (Mr.X Shop Official Deterministic Vector Source)
      drawWatermarkLogo();

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

        // Bottom right ordering note (strictly phone and site, NO wa.me link)
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
      // Check if image is an already generated full poster
      const isCommercialArt =
        typeof effectiveImage === 'string' &&
        (effectiveImage.includes('_poster_') ||
          (item.creative?.generatedPosterUrl && effectiveImage === item.creative.generatedPosterUrl));

      if (isCommercialArt) {
        // Draw full generated poster edge-to-edge
        ctx.drawImage(img, 0, 0, width, height);

        // Deterministic official brand watermark
        drawWatermarkLogo();

        // Contact footer (NO wa.me link!)
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
                <div className="w-full mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">
                        Badhons World Reference Photos ({images.length} available)
                      </span>
                      <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        Reference Only · No Background Box
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Select reference angle
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2.5 leading-snug">
                    Used strictly as visual references to preserve actual product geometry, buttons, ports, and colors. The physical gadget is extracted and placed naturally in the scene.
                  </p>

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

                {/* Badhons World Source of Truth Verification Card */}
                {item.productUrl && (
                  <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>🏢</span>
                        <span>Badhons World (Source of Truth)</span>
                      </span>
                      <a
                        href={item.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded-md transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Visit badhonsworld.com</span>
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Product name, description, verified specs, and all {images.length} reference photos originate strictly from Badhons World. No random web-search results or AI-invented specs.
                    </p>
                    <div className="pt-1 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-blue-800">
                      <span className="font-mono truncate max-w-[210px]">{item.productUrl}</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {images.length} Reference Photos
                      </span>
                    </div>
                  </div>
                )}

                {/* Approval & Publish Action Buttons */}
                <div className="pt-2 space-y-2">
                  {!item.isApproved && onApprove && (
                    <button
                      onClick={async () => {
                        setIsPublishing(true);
                        try {
                          await onApprove(item.id);
                        } finally {
                          setIsPublishing(false);
                        }
                      }}
                      disabled={isPublishing}
                      className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Add to Evergreen Buffer</span>
                    </button>
                  )}

                  <button
                    onClick={handlePublishNow}
                    disabled={isPublishing}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50 ${
                      item.isApproved
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Publishing to Meta...</span>
                      </>
                    ) : item.isApproved ? (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Publish to Facebook & Instagram Now</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Approve & Publish to Meta</span>
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
