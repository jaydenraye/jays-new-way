const { createClient } = require('@supabase/supabase-js');

const MATCH_COUNT = 10;
const MATCH_THRESHOLD = 0.15;
const MAX_CONTEXT_CHARS = 18000;

// Map organ/condition keywords — all now point to the unified organ index
const ORGAN_INDEX_SOURCE = 'JAYS_NEW_WAY_ORGAN_INDEX.docx';
const LESSONS_INDEX_SOURCE = 'JAYS_NEW_WAY_WISDOM_LESSONS_INDEX.docx';

// Keywords that trigger the lessons index instead of or alongside the organ index
const LESSON_KEYWORDS = [
  'lesson', 'upgrade', 'belief upgrade', 'wisdom', 'understanding',
  'what do i tell', 'what should i say', 'how do i explain',
  'accurate understanding', 'correct understanding', 'what is the lesson',
  'what can they learn', 'how do they change', 'belief change',
  'what is the cure', 'how do they recover', 'how do they heal',
  'what do they need to understand', 'why does this happen',
];

function detectLessonQuery(text) {
  const lower = text.toLowerCase();
  return LESSON_KEYWORDS.some(kw => lower.includes(kw));
}

const ORGAN_SOURCE_MAP = {
  'liver': ORGAN_INDEX_SOURCE,
  'gallbladder': ORGAN_INDEX_SOURCE,
  'gall bladder': ORGAN_INDEX_SOURCE,
  'stomach': ORGAN_INDEX_SOURCE,
  'intestine': ORGAN_INDEX_SOURCE,
  'intestines': ORGAN_INDEX_SOURCE,
  'bowel': ORGAN_INDEX_SOURCE,
  'colon': ORGAN_INDEX_SOURCE,
  'pancreas': ORGAN_INDEX_SOURCE,
  'digestive': ORGAN_INDEX_SOURCE,
  'hepatitis': ORGAN_INDEX_SOURCE,
  'cirrhosis': ORGAN_INDEX_SOURCE,
  'heart': ORGAN_INDEX_SOURCE,
  'cardiovascular': ORGAN_INDEX_SOURCE,
  'blood pressure': ORGAN_INDEX_SOURCE,
  'lung': ORGAN_INDEX_SOURCE,
  'lungs': ORGAN_INDEX_SOURCE,
  'respiratory': ORGAN_INDEX_SOURCE,
  'asthma': ORGAN_INDEX_SOURCE,
  'bronchitis': ORGAN_INDEX_SOURCE,
  'kidney': ORGAN_INDEX_SOURCE,
  'kidneys': ORGAN_INDEX_SOURCE,
  'urinary': ORGAN_INDEX_SOURCE,
  'bladder': ORGAN_INDEX_SOURCE,
  'lymph': ORGAN_INDEX_SOURCE,
  'lymphatic': ORGAN_INDEX_SOURCE,
  'immune': ORGAN_INDEX_SOURCE,
  'muscle': ORGAN_INDEX_SOURCE,
  'muscular': ORGAN_INDEX_SOURCE,
  'fibromyalgia': ORGAN_INDEX_SOURCE,
  'bone': ORGAN_INDEX_SOURCE,
  'skeletal': ORGAN_INDEX_SOURCE,
  'arthritis': ORGAN_INDEX_SOURCE,
  'osteoporosis': ORGAN_INDEX_SOURCE,
  'skin': ORGAN_INDEX_SOURCE,
  'psoriasis': ORGAN_INDEX_SOURCE,
  'eczema': ORGAN_INDEX_SOURCE,
  'dermatitis': ORGAN_INDEX_SOURCE,
  'prostate': ORGAN_INDEX_SOURCE,
  'uterus': ORGAN_INDEX_SOURCE,
  'ovary': ORGAN_INDEX_SOURCE,
  'ovaries': ORGAN_INDEX_SOURCE,
  'reproductive': ORGAN_INDEX_SOURCE,
  'thyroid': ORGAN_INDEX_SOURCE,
  'adrenal': ORGAN_INDEX_SOURCE,
  'endocrine': ORGAN_INDEX_SOURCE,
  'hypothyroid': ORGAN_INDEX_SOURCE,
  'hyperthyroid': ORGAN_INDEX_SOURCE,
  'cancer': ORGAN_INDEX_SOURCE,
  'chronic fatigue': ORGAN_INDEX_SOURCE,
  'fatigue': ORGAN_INDEX_SOURCE,
  'left side': ORGAN_INDEX_SOURCE,
  'right side': ORGAN_INDEX_SOURCE,
  'water': ORGAN_INDEX_SOURCE,
  // Neurological
  'dementia': ORGAN_INDEX_SOURCE,
  'alzheimer': ORGAN_INDEX_SOURCE,
  'parkinson': ORGAN_INDEX_SOURCE,
  'epilepsy': ORGAN_INDEX_SOURCE,
  'seizure': ORGAN_INDEX_SOURCE,
  'stroke': ORGAN_INDEX_SOURCE,
  'migraine': ORGAN_INDEX_SOURCE,
  'headache': ORGAN_INDEX_SOURCE,
  'brain': ORGAN_INDEX_SOURCE,
  'nerve': ORGAN_INDEX_SOURCE,
  'nervous system': ORGAN_INDEX_SOURCE,
  'neuron': ORGAN_INDEX_SOURCE,
  // Mental health conditions
  'depression': ORGAN_INDEX_SOURCE,
  'anxiety': ORGAN_INDEX_SOURCE,
  'panic': ORGAN_INDEX_SOURCE,
  'ptsd': ORGAN_INDEX_SOURCE,
  'schizophrenia': ORGAN_INDEX_SOURCE,
  'bipolar': ORGAN_INDEX_SOURCE,
  'ocd': ORGAN_INDEX_SOURCE,
  'burnout': ORGAN_INDEX_SOURCE,
  'suicide': ORGAN_INDEX_SOURCE,
  // Hormonal / endocrine
  'hormone': ORGAN_INDEX_SOURCE,
  'oestrogen': ORGAN_INDEX_SOURCE,
  'estrogen': ORGAN_INDEX_SOURCE,
  'testosterone': ORGAN_INDEX_SOURCE,
  'menopause': ORGAN_INDEX_SOURCE,
  'pituitary': ORGAN_INDEX_SOURCE,
  'cortisol': ORGAN_INDEX_SOURCE,
  'insulin': ORGAN_INDEX_SOURCE,
  // Additional conditions
  'diabetes': ORGAN_INDEX_SOURCE,
  'blood sugar': ORGAN_INDEX_SOURCE,
  'cholesterol': ORGAN_INDEX_SOURCE,
  'inflammation': ORGAN_INDEX_SOURCE,
  'autoimmune': ORGAN_INDEX_SOURCE,
  'allergy': ORGAN_INDEX_SOURCE,
  'allergies': ORGAN_INDEX_SOURCE,
  'pain': ORGAN_INDEX_SOURCE,
  'chronic pain': ORGAN_INDEX_SOURCE,
  'tumour': ORGAN_INDEX_SOURCE,
  'tumor': ORGAN_INDEX_SOURCE,
  'benign': ORGAN_INDEX_SOURCE,
  'malignant': ORGAN_INDEX_SOURCE,
  'multiple sclerosis': ORGAN_INDEX_SOURCE,
  'back pain': ORGAN_INDEX_SOURCE,
  'shoulder': ORGAN_INDEX_SOURCE,
  'hip': ORGAN_INDEX_SOURCE,
  'knee': ORGAN_INDEX_SOURCE,
  'spine': ORGAN_INDEX_SOURCE,
  'neck': ORGAN_INDEX_SOURCE,
  'joint': ORGAN_INDEX_SOURCE,
  'stomach ulcer': ORGAN_INDEX_SOURCE,
  'ulcer': ORGAN_INDEX_SOURCE,
  'hernia': ORGAN_INDEX_SOURCE,
  'appendix': ORGAN_INDEX_SOURCE,
  'tonsil': ORGAN_INDEX_SOURCE,
  'sinus': ORGAN_INDEX_SOURCE,
  'ear': ORGAN_INDEX_SOURCE,
  'eye': ORGAN_INDEX_SOURCE,
  'teeth': ORGAN_INDEX_SOURCE,
  'gum': ORGAN_INDEX_SOURCE,
  'hair': ORGAN_INDEX_SOURCE,
  'nail': ORGAN_INDEX_SOURCE,
  'varicose': ORGAN_INDEX_SOURCE,
  'haemorrhoid': ORGAN_INDEX_SOURCE,
  'hemorrhoid': ORGAN_INDEX_SOURCE,
};

function detectOrganSource(text) {
  const lower = text.toLowerCase();
  for (const [keyword, source] of Object.entries(ORGAN_SOURCE_MAP)) {
    if (lower.includes(keyword)) {
      return { keyword, source };
    }
  }
  return null;
}

async function getQueryEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text.slice(0, 2000),
    }),
  });
  const data = await response.json();
  if (!data.data?.[0]?.embedding) throw new Error('OpenAI embedding failed');
  return data.data[0].embedding;
}

async function semanticSearch(supabase, queryEmbedding) {
  const { data, error } = await supabase.rpc('search_documents', {
    query_embedding: queryEmbedding,
    match_count: MATCH_COUNT,
    match_threshold: MATCH_THRESHOLD,
  });
  if (error) { console.error('Semantic search error:', error); return []; }
  return data || [];
}

async function keywordSearch(supabase, organSource) {
  const { keyword, source } = organSource;
  const allResults = [];

  // Search the organ index first (highest priority)
  const { data: indexData } = await supabase
    .from('document_chunks')
    .select('id, content, source, chunk_index')
    .ilike('source', '%ORGAN_INDEX%')
    .ilike('content', `%${keyword}%`)
    .limit(15);

  if (indexData && indexData.length > 0) {
    console.log(`RAG keyword: Found ${indexData.length} chunks in ORGAN INDEX for "${keyword}"`);
    indexData.forEach(r => allResults.push({ ...r, similarity: 0.9, keyword_match: true }));
  }

  // Also search ALL other documents for the keyword
  const { data: allData } = await supabase
    .from('document_chunks')
    .select('id, content, source, chunk_index')
    .ilike('content', `%${keyword}%`)
    .not('source', 'ilike', '%ORGAN_INDEX%')
    .limit(10);

  if (allData && allData.length > 0) {
    console.log(`RAG keyword: Found ${allData.length} additional chunks across all docs for "${keyword}"`);
    allData.forEach(r => {
      if (!allResults.find(existing => existing.id === r.id)) {
        allResults.push({ ...r, similarity: 0.5, keyword_match: true });
      }
    });
  }

  return allResults;
}

async function retrieveRelevantContext(queryEmbedding, userMessage, supabase) {
  const organSource = detectOrganSource(userMessage);
  const isLessonQuery = detectLessonQuery(userMessage);
  let keywordResults = [];

  if (organSource) {
    console.log(`RAG: Organ query detected — running keyword search for "${organSource.keyword}"`);
    keywordResults = await keywordSearch(supabase, organSource);

    // Also search specifically in the organ index
    const { data: indexData } = await supabase
      .from('document_chunks')
      .select('id, content, source, chunk_index')
      .ilike('source', '%ORGAN_INDEX%')
      .ilike('content', `%${organSource.keyword}%`)
      .limit(15);

    if (indexData && indexData.length > 0) {
      console.log(`RAG: Found ${indexData.length} chunks in ORGAN INDEX`);
      indexData.forEach(row => {
        if (!keywordResults.find(r => r.id === row.id)) {
          keywordResults.push({ ...row, similarity: 0.9, keyword_match: true });
        }
      });
    }
  }

  // If lesson query — also search the wisdom lessons index
  if (isLessonQuery || organSource) {
    const lessonKeyword = organSource ? organSource.keyword : userMessage.toLowerCase().split(' ').slice(0, 3).join(' ');
    const { data: lessonData } = await supabase
      .from('document_chunks')
      .select('id, content, source, chunk_index')
      .ilike('source', '%WISDOM_LESSONS%')
      .ilike('content', organSource ? `%${organSource.keyword}%` : `%lesson%`)
      .limit(8);

    if (lessonData && lessonData.length > 0) {
      console.log(`RAG: Found ${lessonData.length} chunks in WISDOM LESSONS INDEX`);
      lessonData.forEach(row => {
        if (!keywordResults.find(r => r.id === row.id)) {
          keywordResults.push({ ...row, similarity: 0.8, keyword_match: true });
        }
      });
    }
  }

  // Run semantic search
  let semanticResults = await semanticSearch(supabase, queryEmbedding);

  // Prioritise organ/lesson index results over semantic
  let results;
  if (keywordResults.length > 0) {
    const semanticFiltered = semanticResults.filter(r => !keywordResults.find(k => k.id === r.id));
    results = [...keywordResults, ...semanticFiltered];
    console.log(`RAG: Combined ${keywordResults.length} keyword + ${semanticFiltered.length} semantic results`);
  } else {
    results = semanticResults;
  }

  if (!results || results.length === 0) return null;

  let context = '';
  for (const chunk of results) {
    const sourceName = chunk.source.replace('.docx', '').replace(/_/g, ' ');
    const matchType = chunk.keyword_match ? 'keyword match' : `similarity: ${chunk.similarity?.toFixed(2)}`;
    const entry = `[Source: ${sourceName} | ${matchType}]\n${chunk.content}\n\n`;
    if (context.length + entry.length > MAX_CONTEXT_CHARS) break;
    context += entry;
  }

  return context.trim() || null;
}

function buildEnrichedSystemPrompt(originalSystem, retrievedContext) {
  if (!retrievedContext) return originalSystem;

  return `${originalSystem}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOURCE MATERIAL FROM JAY'S DOCUMENTS (retrieved for this query):
Use this material directly and exactly. Do not modify, interpret, or supplement it with general medical or psychological knowledge. This is the authoritative reference.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${retrievedContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF SOURCE MATERIAL. If the above does not contain the specific information requested, say: "I don't have that specific data — refer to the source document."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, system, model, max_tokens } = req.body;

    const latestUserMessage = messages
      ?.filter(m => m.role === 'user')
      ?.slice(-1)[0]?.content || '';

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    let enrichedSystem = system;
    try {
      const queryEmbedding = await getQueryEmbedding(latestUserMessage);
      const retrievedContext = await retrieveRelevantContext(queryEmbedding, latestUserMessage, supabase);
      enrichedSystem = buildEnrichedSystemPrompt(system, retrievedContext);

      if (retrievedContext) {
        console.log(`RAG: Retrieved ${retrievedContext.length} chars of context`);
        console.log(`RAG CONTENT PREVIEW: ${retrievedContext.slice(0, 500)}`);
      } else {
        console.log('RAG: No context found — using base system prompt only');
      }
    } catch (ragError) {
      console.error('RAG retrieval failed (non-fatal):', ragError.message);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: max_tokens || 1200,
        system: enrichedSystem,
        messages: messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);

  } catch (error) {
    console.error('Chat handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
