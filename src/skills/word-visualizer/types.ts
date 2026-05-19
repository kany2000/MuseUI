// ============================================================
// Word Visualizer Types
// ============================================================

export interface SkillOption {
  id: string;
  name: string;
  name_zh: string;
  description: string;
  description_zh?: string;
  promptModifier: string;
}

// ============================================================
// Visualizer Modes
// ============================================================

export type VisualizerMode = 'no-ground' | 'with-ground';

export interface WordVisualizerConfig {
  word: string;              // 核心文字
  language: 'auto' | 'zh' | 'en';
  context?: string;          // 补充语境
  mood?: string;             // 情绪倾向
  forbidden?: string;        // 禁用元素
  mode: VisualizerMode;      // 无地面版 vs 有地面版
  allowExtraText: boolean;   // 是否允许辅助文字
}

// ============================================================
// Mood Options
// ============================================================

export const VISUALIZER_MOODS: SkillOption[] = [
  {
    id: 'gentle',
    name: 'Gentle',
    name_zh: '温柔',
    description: 'Warm, soft, and tender atmosphere',
    promptModifier: '温柔、温暖、柔和的情绪氛围',
  },
  {
    id: 'cold',
    name: 'Cold',
    name_zh: '冷峻',
    description: 'Cool, detached, and restrained atmosphere',
    promptModifier: '冷峻、疏离、克制的情绪氛围',
  },
  {
    id: 'dangerous',
    name: 'Dangerous',
    name_zh: '危险',
    description: 'Tense, threatening, and ominous atmosphere',
    promptModifier: '危险、压迫、张力的情绪氛围',
  },
  {
    id: 'lonely',
    name: 'Lonely',
    name_zh: '孤独',
    description: 'Solitary, isolated, and melancholic atmosphere',
    promptModifier: '孤独、寂寞、疏离的情绪氛围',
  },
  {
    id: 'romantic',
    name: 'Romantic',
    name_zh: '浪漫',
    description: 'Love, passion, and emotional depth',
    promptModifier: '浪漫、情感、温柔的情绪氛围',
  },
  {
    id: 'hopeful',
    name: 'Hopeful',
    name_zh: '希望',
    description: 'Optimistic, uplifting, and inspiring atmosphere',
    promptModifier: '希望、光明、积极向上的情绪氛围',
  },
  {
    id: 'pure',
    name: 'Pure',
    name_zh: '纯真',
    description: 'Innocent, naive, and simple atmosphere',
    promptModifier: '纯真、纯粹、天真的情绪氛围',
  },
  {
    id: 'desire',
    name: 'Desire',
    name_zh: '欲望',
    description: 'Longing, craving, and passionate desire',
    promptModifier: '欲望、渴望、诉求的情绪氛围',
  },
  {
    id: 'order',
    name: 'Order',
    name_zh: '秩序',
    description: 'Structured, organized, and systematic',
    promptModifier: '秩序、规范、结构的情绪氛围',
  },
  {
    id: 'conflict',
    name: 'Conflict',
    name_zh: '冲突',
    description: 'Confrontation, tension, and opposition',
    promptModifier: '冲突、对抗、矛盾的情绪氛围',
  },
  {
    id: 'freedom',
    name: 'Freedom',
    name_zh: '自由',
    description: 'Liberation, unbound, and unrestricted',
    promptModifier: '自由、解脱、无拘束的情绪氛围',
  },
  {
    id: 'silence',
    name: 'Silence',
    name_zh: '沉默',
    description: 'Quiet, still, and contemplative atmosphere',
    promptModifier: '沉默、寂静、内省的情绪氛围',
  },
  {
    id: 'destruction',
    name: 'Destruction',
    name_zh: '毁灭',
    description: 'Chaos, breaking down, and annihilation',
    promptModifier: '毁灭、崩塌、破坏的情绪氛围',
  },
  {
    id: 'rebirth',
    name: 'Rebirth',
    name_zh: '重生',
    description: 'Renewal, regeneration, and new beginning',
    promptModifier: '重生、涅槃、新生的情绪氛围',
  },
];

// ============================================================
// Language Options
// ============================================================

export const VISUALIZER_LANGUAGES: SkillOption[] = [
  {
    id: 'auto',
    name: 'Auto Detect',
    name_zh: '自动',
    description: 'Automatically detect the language of input',
    promptModifier: '',
  },
  {
    id: 'zh',
    name: 'Chinese',
    name_zh: '中文',
    description: 'Force Chinese language',
    promptModifier: '语言: 中文',
  },
  {
    id: 'en',
    name: 'English',
    name_zh: '英文',
    description: 'Force English language',
    promptModifier: 'Language: English',
  },
];

// ============================================================
// Mode Options
// ============================================================

export const VISUALIZER_MODES: SkillOption[] = [
  {
    id: 'no-ground',
    name: 'No Ground',
    name_zh: '无地面版',
    description: 'Floating composition, no ground plane',
    promptModifier: '',
  },
  {
    id: 'with-ground',
    name: 'With Ground',
    name_zh: '有地面版',
    description: 'With clear ground plane, stage-like composition',
    promptModifier: '',
  },
];
