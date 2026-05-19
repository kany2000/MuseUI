#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DESIGNS_DIR = path.join(__dirname, '../src/skills/designs');
const INDEX_FILE = path.join(DESIGNS_DIR, 'index.ts');

const DESIGN_LIST = [
    "claude/DESIGN",
    "cohere/DESIGN",
    "elevenlabs/DESIGN",
    "minimax/DESIGN",
    "mistral.ai/DESIGN",
    "ollama/DESIGN",
    "opencode.ai/DESIGN",
    "replicate/DESIGN",
    "runwayml/DESIGN",
    "together.ai/DESIGN",
    "voltagent/DESIGN",
    "x.ai/DESIGN",
    "cursor/DESIGN",
    "expo/DESIGN",
    "linear.app/DESIGN",
    "lovable/DESIGN",
    "mintlify/DESIGN",
    "posthog/DESIGN",
    "raycast/DESIGN",
    "resend/DESIGN",
    "sentry/DESIGN",
    "supabase/DESIGN",
    "vercel/DESIGN",
    "warp/DESIGN",
    "zapier/DESIGN",
    "clickhouse/DESIGN",
    "composio/DESIGN",
    "hashicorp/DESIGN",
    "mongodb/DESIGN",
    "sanity/DESIGN",
    "stripe/DESIGN",
    "airtable/DESIGN",
    "cal/DESIGN",
    "clay/DESIGN",
    "figma/DESIGN",
    "framer/DESIGN",
    "intercom/DESIGN",
    "miro/DESIGN",
    "notion/DESIGN",
    "pinterest/DESIGN",
    "webflow/DESIGN",
    "binance/DESIGN",
    "coinbase/DESIGN",
    "kraken/DESIGN",
    "revolut/DESIGN",
    "wise/DESIGN",
    "airbnb/DESIGN",
    "apple/DESIGN",
    "bmw/DESIGN",
    "ferrari/DESIGN",
    "ibm/DESIGN",
    "meta/DESIGN",
    "lamborghini/DESIGN",
    "nike/DESIGN",
    "nvidia/DESIGN",
    "renault/DESIGN",
    "shopify/DESIGN",
    "spacex/DESIGN",
    "tesla/DESIGN",
    "spotify/DESIGN",
    "uber/DESIGN",
    "superhuman/DESIGN",
    "bugatti/DESIGN",
    "playstation/DESIGN",
    "theverge/DESIGN",
    "wired/DESIGN",
    "mastercard/DESIGN",
    "vodafone/DESIGN",
    "starbucks/DESIGN"
];

const CATEGORY_MAP = {
    'claude': 'Tech', 'cohere': 'Tech', 'elevenlabs': 'Tech', 'minimax': 'Tech', 'mistral.ai': 'Tech',
    'ollama': 'Tech', 'opencode.ai': 'Tech', 'replicate': 'Tech', 'runwayml': 'Tech', 'together.ai': 'Tech',
    'voltagent': 'Tech', 'x.ai': 'Tech', 'cursor': 'Tech', 'expo': 'Tech', 'linear.app': 'Tech',
    'lovable': 'Tech', 'mintlify': 'Tech', 'posthog': 'Tech', 'raycast': 'Tech', 'resend': 'Tech',
    'sentry': 'Tech', 'supabase': 'Tech', 'vercel': 'Tech', 'warp': 'Tech', 'zapier': 'Tech',
    'clickhouse': 'Tech', 'composio': 'Tech', 'hashicorp': 'Tech', 'mongodb': 'Tech', 'sanity': 'Tech',

    'stripe': 'Finance', 'binance': 'Finance', 'coinbase': 'Finance', 'kraken': 'Finance',
    'revolut': 'Finance', 'wise': 'Finance', 'mastercard': 'Finance',

    'airtable': 'Creative', 'cal': 'Creative', 'clay': 'Creative', 'figma': 'Creative',
    'framer': 'Creative', 'intercom': 'Creative', 'miro': 'Creative', 'notion': 'Creative',
    'pinterest': 'Creative', 'webflow': 'Creative',

    'airbnb': 'Minimal', 'apple': 'Minimal', 'spotify': 'Minimal', 'uber': 'Minimal', 'superhuman': 'Minimal',

    'bmw': 'Bold', 'ferrari': 'Bold', 'lamborghini': 'Bold', 'bugatti': 'Bold', 'nike': 'Bold',
    'nvidia': 'Bold', 'spacex': 'Bold', 'tesla': 'Bold', 'playstation': 'Bold', 'theverge': 'Bold',
    'wired': 'Bold', 'renault': 'Bold', 'shopify': 'Bold', 'ibm': 'Bold', 'meta': 'Bold',
    'vodafone': 'Bold', 'starbucks': 'Bold'
};

function sanitizeId(name) {
    return name.replace(/\./g, '_').replace(/-/g, '_');
}

function sanitizeFilename(name) {
    return name.replace(/\./g, '-');
}

function extractTitle(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
}

function escapeForJs(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function main() {
    console.log(`📥 启动浏览器，准备下载 ${DESIGN_LIST.length} 个 DESIGN.md...\n`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 先访问首页，让 Cloudflare challenge 通过，拿到 cookie
    console.log('🌐 通过 Cloudflare 验证...');
    try {
        await page.goto('https://getdesign.md', { waitUntil: 'networkidle', timeout: 30000 });
        console.log('✅ Cloudflare 验证通过\n');
    } catch (e) {
        console.log('⚠️  首页加载超时，继续尝试...\n');
    }

    const results = [];

    for (let i = 0; i < DESIGN_LIST.length; i++) {
        const item = DESIGN_LIST[i];
        const brandName = item.split('/')[0];
        const filename = sanitizeFilename(brandName) + '.md';
        const filepath = path.join(DESIGNS_DIR, filename);
        const id = sanitizeId(brandName);

        try {
            process.stdout.write(`[${i + 1}/${DESIGN_LIST.length}] ${brandName}...`);

            const url = `https://getdesign.md/design-md/${item}.md`;
            const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });

            // 获取页面纯文本内容（.md 文件应该直接显示为文本）
            let content = await page.evaluate(() => {
                // 如果是纯文本页面
                const pre = document.querySelector('pre');
                if (pre) return pre.textContent;
                return document.body.innerText;
            });

            if (!content || content.length < 100) {
                // 可能是 SPA，尝试等待内容加载
                await page.waitForTimeout(3000);
                content = await page.evaluate(() => {
                    const pre = document.querySelector('pre');
                    if (pre) return pre.textContent;
                    // 尝试找 markdown 渲染区域
                    const article = document.querySelector('article') || document.querySelector('.markdown') || document.querySelector('[class*="content"]');
                    if (article) return article.innerText;
                    return document.body.innerText;
                });
            }

            if (!content || content.length < 100) {
                throw new Error('内容为空或太短');
            }

            const title = extractTitle(content) || brandName;
            fs.writeFileSync(filepath, content, 'utf-8');

            const category = CATEGORY_MAP[brandName] || 'Tech';
            results.push({ id, filename, name: title, category, brandName });

            console.log(` ✅ (${content.length} bytes)`);

            await page.waitForTimeout(800);

        } catch (err) {
            console.log(` ❌ ${err.message}`);
        }
    }

    await browser.close();

    console.log(`\n✅ 下载完成，成功 ${results.length}/${DESIGN_LIST.length}\n`);

    // 生成 index.ts
    console.log('📝 生成 index.ts...');

    const imports = results.map(r =>
        `import ${r.id}Md from './${r.filename}?raw';`
    ).join('\n');

    const templates = results.map(r => `    {
        id: '${r.id}',
        name: '${escapeForJs(r.name)}',
        name_zh: '${escapeForJs(r.name)}',
        category: '${r.category}',
        description: '${escapeForJs(r.name)} design system',
        description_zh: '${escapeForJs(r.name)} 设计系统',
        content: ${r.id}Md,
    }`).join(',\n');

    const indexContent = `${imports}

export interface DesignMdTemplate {
    id: string;
    name: string;
    name_zh: string;
    category: 'Tech' | 'Finance' | 'Creative' | 'Minimal' | 'Bold' | 'Custom';
    description: string;
    description_zh: string;
    content: string;
}

export const DESIGN_MD_TEMPLATES: DesignMdTemplate[] = [
${templates}
];

export const getDesignMdList = () =>
    DESIGN_MD_TEMPLATES.map(({ content, ...meta }) => meta);

export const getDesignMdById = (id: string): DesignMdTemplate | undefined =>
    DESIGN_MD_TEMPLATES.find(t => t.id === id);
`;

    fs.writeFileSync(INDEX_FILE, indexContent, 'utf-8');
    console.log('✅ index.ts 已更新\n');
    console.log('🎉 全部完成！');
}

main().catch(console.error);
