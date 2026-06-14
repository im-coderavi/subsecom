import { Product, Bundle } from './types';

export const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'LayoutGrid' },
  { id: 'writing', label: 'AI Writing', icon: 'FileText' },
  { id: 'chat', label: 'AI Chat', icon: 'MessageSquare' },
  { id: 'code', label: 'AI Code', icon: 'Code2' },
  { id: 'image', label: 'AI Image', icon: 'Image' },
  { id: 'video', label: 'AI Video', icon: 'Video' },
  { id: 'voice', label: 'AI Voice', icon: 'Mic' },
  { id: 'productivity', label: 'Productivity', icon: 'CheckSquare' },
  { id: 'design', label: 'Design', icon: 'Palette' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'claude-3-5',
    name: 'Claude 3.5 Sonoma',
    slug: 'claude-3-5',
    badge: 'Best Seller',
    category: 'chat',
    logo: 'Sparkles', // Orange
    shortDescription: 'Advanced AI assistant by Anthropic.',
    description: 'Anthropic\'s Claude 3.5 Sonnet excels at coding, analysis, and writing tasks. Includes high-capacity tokens and fast-track processing times. Ideal for technical and academic research, complex programming tasks, and precise content generation.',
    monthlyPrice: 15.99,
    originalPrice: 20.00,
    deliveryTime: 'Instant Delivery',
    features: [
      '200K Tokens Context Window',
      'Advanced Coding & Reasoning Abilities',
      'Claude Artifacts Access',
      'No Message Cap limits',
      'Dedicated Customer Support Escalation'
    ],
    deliveryMethod: 'Shared Premium Access + Account Credentials provided via dashboard in 2-5 min.',
    rating: 4.9,
    ratingCount: 348
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    slug: 'chatgpt-plus',
    badge: 'Popular',
    category: 'chat',
    logo: 'MessageSquareCode', // Green
    shortDescription: 'The world\'s most powerful AI assistant.',
    description: 'ChatGPT Plus gives you access to GPT-4o, GPT-o1, GPT-o3-mini, and advanced analysis features. Perfect for everyday tasks, brainstorm sessions, translation, and custom GPT creations. Fully shared workspace accounts with continuous session restoration.',
    monthlyPrice: 14.99,
    originalPrice: 20.00,
    deliveryTime: 'Instant Delivery',
    features: [
      'Access to GPT-4o and o1-pro models',
      'DALL-E 3 Image Generation built-in',
      'Custom GPT Explorers & Builders',
      'Advanced Voice Mode (where available)',
      'Web-browsing and coding sandbox tools'
    ],
    deliveryMethod: 'Chrome Extension Auth Token / Direct Username and Password for premium portal logins.',
    rating: 4.8,
    ratingCount: 512
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Advanced',
    slug: 'gemini-pro',
    badge: 'Trending',
    category: 'chat',
    logo: 'Sparkle', // Blue
    shortDescription: 'Google\'s most powerful AI model.',
    description: 'Get absolute premium privileges with Google Gemini Advanced (1.5 Pro). Offers unparalleled reasoning, extreme context size of up to 1 million tokens, and deep integrations with Google Workspace apps (Docs, Gmail, Drive).',
    monthlyPrice: 11.99,
    originalPrice: 19.99,
    deliveryTime: 'Instant Delivery',
    features: [
      '1 Million+ tokens context size',
      'Google Workspace integrations built-in',
      'Fast response times & priority processing',
      'Next-generation voice interactive mode',
      'Multimodal reading (photos, videos, docs)'
    ],
    deliveryMethod: 'Exclusive Sub-account / Shared workspace access with isolated private chat sessions.',
    rating: 4.7,
    ratingCount: 195
  },
  {
    id: 'midjourney',
    name: 'Midjourney Pro',
    slug: 'midjourney',
    badge: 'Top Pick',
    category: 'image',
    logo: 'Image', // Purple
    shortDescription: 'Create stunning AI images with ease.',
    description: 'The absolute gold standard of generative art. Access Midjourney Pro on Discord or Web portal to generate highly aesthetic, photorealistic, and illustrative assets. This plan includes unlimited relaxed generation hours and active fast-mode hours.',
    monthlyPrice: 9.99,
    originalPrice: 30.00,
    deliveryTime: 'Instant Delivery',
    features: [
      'Fast Image Generation Hours',
      'Stealth Mode (hide your images from public gallery)',
      'Parallel Generation (up to 12 jobs in queue)',
      'Access both Discord and Web visual editor',
      'Commercial utilization rights'
    ],
    deliveryMethod: 'Discord Shared Workspace Premium Bot channel or authenticated Web portal mirror access.',
    rating: 4.9,
    ratingCount: 420
  },
  {
    id: 'cursor-pro',
    name: 'Cursor Pro',
    slug: 'cursor-pro',
    badge: 'Developer',
    category: 'code',
    logo: 'Code2', // Slate/Dark
    shortDescription: 'The AI code editor built for developers.',
    description: 'Cursor is the premier fork of VS Code optimized for coding with AI. Write code, debug terminals, and chat with your entire codebase natively. Includes unlimited fast-model queries (Claude 3.5 Sonnet, GPT-4o) and hyper-intelligent autocompletion.',
    monthlyPrice: 12.99,
    originalPrice: 20.00,
    deliveryTime: 'Instant Delivery',
    features: [
      'Unlimited Fast AI Chat queries',
      'Premium Custom Model selection',
      'Local codebase embedding indexing',
      'Copilot++ intelligent inline completions',
      'Terminal command auto-completions'
    ],
    deliveryMethod: 'OAuth secure token proxy link compatible with the official Cursor application.',
    rating: 4.9,
    ratingCount: 289
  },
  {
    id: 'perplexity-pro',
    name: 'Perplexity Pro',
    slug: 'perplexity-pro',
    badge: 'New',
    category: 'productivity',
    logo: 'SearchCode', // Teal
    shortDescription: 'AI search engine for smarter answers.',
    description: 'The premier conversational answer engine. Perplexity Pro searches the web in real-time, cites authoritative sources, and processes massive files. Select from top AI models like Claude 3.5, GPT-4o, and Gemini 1.5 Pro as your research companion.',
    monthlyPrice: 9.99,
    originalPrice: 20.00,
    deliveryTime: 'Instant Delivery',
    features: [
      'Unlimited Pro Searches each day',
      'Advanced File Upload and analysis',
      'Choose your active LLM (Sonnet, GPT, etc)',
      'Full Collection sharing & publishing',
      'Includes $5 monthly AI API credits'
    ],
    deliveryMethod: 'Direct Premium Account details / Chrome extension token switcher.',
    rating: 4.8,
    ratingCount: 215
  },
  {
    id: 'notion-ai',
    name: 'Notion AI Pro',
    slug: 'notion-ai',
    category: 'productivity',
    logo: 'Layers', // Black
    shortDescription: 'AI assistant inside Notion workspace.',
    description: 'Bring the computational power of modern generative AI straight into your Notion workspace pages. Auto-summarize team wikis, draft documents instantly, fix grammar, and brainstorm product specifications right where you write.',
    monthlyPrice: 8.99,
    originalPrice: 15.00,
    deliveryTime: 'Instant Delivery',
    features: [
      'Unlimited AI Prompts inside Notion editor',
      'Smart database autofill & summaries',
      'Instant editing and auto voice-of-tone adjustments',
      'Action item extraction from meeting summaries',
      'Collaborative shared team workspaces'
    ],
    deliveryMethod: 'Shared Workspace team invite with complete Premium Notion AI features.',
    rating: 4.6,
    ratingCount: 144
  },
  {
    id: 'copilot-pro',
    name: 'Copilot Pro',
    slug: 'copilot-pro',
    category: 'productivity',
    logo: 'ToggleLeft', // Blue/Gold
    shortDescription: 'Your everyday AI companion by Microsoft.',
    description: 'Unlock supercharged productivity in Microsoft 365 apps. Integrate Word, Excel, PowerPoint, Outlook, and OneNote with deep generative power. Built on GPT-4o, Microsoft Copilot Pro provides premium responses and speed.',
    monthlyPrice: 9.99,
    originalPrice: 20.00,
    deliveryTime: 'Instant Delivery',
    features: [
      'Seamless Microsoft 365 App Integrations',
      'Priority GPT-4o model access during peak times',
      'Designer Studio (formerly Bing Image Creator) boost credits',
      'Excel auto-formula drafting and chart design',
      'Advanced slide deck outline creation'
    ],
    deliveryMethod: 'Authenticated account login credentials or managed Microsoft 365 Family sub-invites.',
    rating: 4.5,
    ratingCount: 130
  },
  {
    id: 'runway-gen3',
    name: 'Runway Gen-3 Pro',
    slug: 'runway-gen3',
    category: 'video',
    logo: 'Film', // Dark Grey
    shortDescription: 'Create next-gen AI videos and visuals.',
    description: 'Transform words, images, or audio clips into striking cinematic sequences. Runway Gen-3 features extreme temporal consistency, highly realistic facial gestures, and breathtaking fluid physics simulation for professional filmmakers.',
    monthlyPrice: 15.99,
    originalPrice: 35.00,
    deliveryTime: 'Instant Delivery',
    features: [
      'Generous monthly generation credits',
      'High-definition cinematic exports (no watermarks)',
      'Text-to-Video and Video-to-Video models',
      'Custom camera motion controllers',
      'Motion brushing & temporal keyframing'
    ],
    deliveryMethod: 'Secure dedicated workspace portal credentials delivered step-by-step.',
    rating: 4.8,
    ratingCount: 180
  },
  {
    id: 'elevenlabs-pro',
    name: 'ElevenLabs Pro',
    slug: 'elevenlabs-pro',
    category: 'voice',
    logo: 'Speaker', // Yellowish Gold
    shortDescription: 'Realistic AI voice generation platform.',
    description: 'The gold standard of text-to-speech generators. Clone your own voice, design unique speaking profiles, and synthesize emotional human speech in dozens of global languages. Perfect for audiobooks, dubbing, and video voiceovers.',
    monthlyPrice: 7.99,
    originalPrice: 22.00,
    deliveryTime: 'Instant Delivery',
    features: [
      '100,000 monthly characters allocation',
      'Professional custom voice cloning',
      'Access to advanced Voice Design controls',
      'High fidelity MP3 sound output options',
      'Full commercial rights and distribution licenses'
    ],
    deliveryMethod: 'API proxy route key or authenticated Premium sub-account credentials.',
    rating: 4.7,
    ratingCount: 225
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3 Plus',
    slug: 'dall-e-3',
    category: 'design',
    logo: 'Palette', // Sparkly
    shortDescription: 'Generate stunning images from text.',
    description: 'OpenAI\'s flagship DALL-E 3 visual engine, packaged with extreme prompt precision. DALL-E 3 excels at rendering complex, high-clarity graphic elements, readable text inside illustrations, and rich color palettes.',
    monthlyPrice: 8.99,
    originalPrice: 15.00,
    deliveryTime: 'Instant Delivery',
    features: [
      'Incredibly high accuracy prompt following',
      'Readable typography inside image renders',
      'Widescreen and vertical canvas ratios supported',
      'Automatic image generation prompt helpers',
      'Full royalty-free commercial distribution rights'
    ],
    deliveryMethod: 'Instant DALL-E 3 dedicated editor / OpenAI API consumer panel login access.',
    rating: 4.7,
    ratingCount: 167
  },
  {
    id: 'suno-pro',
    name: 'Suno AI Pro',
    slug: 'suno-pro',
    category: 'voice',
    logo: 'Music', // Pink/Orange
    shortDescription: 'Create songs with AI music generator.',
    description: 'Express your musical visions in any style or lyric. Suno AI Pro creates high-fidelity complete arrangements—including vocals, backing tracks, drums, and solos. Whether pop, rock, trap, or orchestral melodies, Suno gets it done.',
    monthlyPrice: 7.99,
    originalPrice: 10.00,
    deliveryTime: 'Instant Delivery',
    features: [
      '2,500 monthly song generation credits (500 songs)',
      'Full commercial monetization rights',
      'High-quality audio track downloads and sharing',
      'Custom lyrics, style, and instrumentation setup',
      'Priority servers with faster generation queues'
    ],
    deliveryMethod: 'Suno workspace premium account or browser authentication token.',
    rating: 4.8,
    ratingCount: 198
  }
];

export const BUNDLES: Bundle[] = [
  {
    id: 'creator-bundle',
    name: 'Creator Bundle',
    price: 2399,
    originalPrice: 3399,
    savingPercent: 30,
    products: ['Midjourney Pro', 'Runway Gen-3 Pro', 'ChatGPT Plus'],
    toolsCount: 3,
    colorTheme: 'creator',
    features: [
      'Perfect for designers, YouTubers, and videomakers',
      'High-fidelity cinematics & visual image processing',
      'All chat, video, and image requirements in one'
    ]
  },
  {
    id: 'pro-bundle',
    name: 'Pro Bundle',
    price: 2299,
    originalPrice: 3499,
    savingPercent: 35,
    products: ['Claude 3.5 Sonoma', 'ChatGPT Plus', 'Gemini Advanced'],
    toolsCount: 3,
    colorTheme: 'pro',
    features: [
      'The Holy Trinity of Conversational AI Assistants',
      'Compare outputs across LLMs instantly',
      'Maximize research capacity with over 1.2M token workspace'
    ]
  },
  {
    id: 'ultimate-bundle',
    name: 'Ultimate Bundle',
    price: 2699,
    originalPrice: 4499,
    savingPercent: 40,
    products: ['ChatGPT Plus', 'Notion AI Pro', 'Suno AI Pro', 'Cursor Pro', 'ElevenLabs Pro'],
    toolsCount: 5,
    colorTheme: 'ultimate',
    features: [
      'The complete developer and business operating suite',
      'Includes text, code, voice, databases, and audio tools',
      'Over ₹1800+ separate monthly SaaS cost saved instantly'
    ]
  }
];

export const FAQS = [
  {
    id: 'faq-1',
    question: 'How do I get my subscriptions after purchasing?',
    answer: 'Once you successfully make a purchase on AI Nest, your account credentials or browser authentication tokens will be populated instantly (within 2-5 minutes) inside your user dashboard. You will also receive an email with step-by-step instructions. For any issues, our 24/7 web-live customer support is always here.'
  },
  {
    id: 'faq-2',
    question: 'Are these subscriptions official and legal?',
    answer: 'Yes, 100%. We manage team, corporate, or family tier seats which are completely legal and verified. We allocate these seats directly to our users. Your dashboard credentials will sign you into the official service website directly or via our premium authenticated proxy layers.'
  },
  {
    id: 'faq-3',
    question: 'Can I use my existing account?',
    answer: 'For some tools like Notion or Microsoft Copilot, we can send workspace invites directly to your email, allowing you to use your existing account. For other tools like Claude, ChatGPT Plus, or Cursor, we provide high-security shared premium accounts or custom access tokens.'
  },
  {
    id: 'faq-4',
    question: 'What is your refund policy?',
    answer: 'We offer a complete 7-Day Money-Back No-Questions-Asked refund guarantee. If the tool does not work as advertised, or if you simply change your mind, let us know via live chat and we will reverse your payment immediately.'
  },
  {
    id: 'faq-5',
    question: 'Do you offer customer support for API connections or usage?',
    answer: 'Absolutely! Our support team includes senior developers who can assist you with Cursor setup, Copilot integrations, API key proxies, or Midjourney server integrations anytime.'
  }
];
