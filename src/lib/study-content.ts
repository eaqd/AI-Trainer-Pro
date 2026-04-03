export interface ConceptCard {
  title: string
  category: string
  content: string
  keyPoints: string[]
}

export interface RubricLevel {
  score: number
  label: string
  description: string
  examples: string[]
}

export interface PlatformInfo {
  name: string
  description: string
  taskTypes: string[]
  payRange: string
  qualificationTips: string[]
  commonMistakes: string[]
  proTips: string[]
}

export interface GlossaryTerm {
  term: string
  definition: string
  category: string
}

export const conceptCards: ConceptCard[] = [
  {
    title: "Response Quality Rating",
    category: "prompt_rating",
    content: "When rating AI responses, evaluators assess multiple dimensions including helpfulness, accuracy, safety, and relevance. The key is calibration — being consistent in how you apply standards across different responses.",
    keyPoints: [
      "Always read the full prompt before evaluating the response",
      "Check factual claims against your knowledge",
      "Consider whether the response actually addresses what was asked",
      "Look for subtle errors hidden in otherwise correct responses",
      "Rate based on the rubric, not personal preference",
    ],
  },
  {
    title: "Side-by-Side Comparison",
    category: "response_comparison",
    content: "Pairwise comparison is one of the most common tasks in RLHF. You'll see two or more responses to the same prompt and must decide which is better. The challenge is identifying subtle quality differences.",
    keyPoints: [
      "Read all responses before making a decision",
      "Create a mental checklist: accuracy, helpfulness, safety, style",
      "A shorter, correct answer often beats a longer, partially wrong one",
      "Watch for hallucinations that sound confident but are wrong",
      "Consider the user's likely intent, not just the literal question",
    ],
  },
  {
    title: "Effective Prompt Engineering",
    category: "prompt_writing",
    content: "Good prompts are clear, specific, and well-structured. They anticipate potential misunderstandings and include appropriate constraints.",
    keyPoints: [
      "Be specific about format, length, and audience",
      "Include constraints to narrow the output space",
      "Provide examples when the task is ambiguous",
      "Break complex tasks into steps",
      "Consider edge cases the AI might encounter",
    ],
  },
  {
    title: "Code Review Best Practices",
    category: "code_review",
    content: "AI-generated code review involves checking for correctness, efficiency, security, and style. Common issues include off-by-one errors, missing edge cases, and security vulnerabilities.",
    keyPoints: [
      "Check for logical errors before style issues",
      "Look for edge cases: empty inputs, null values, boundary conditions",
      "Verify that error handling is appropriate",
      "Check for security issues: injection, XSS, data exposure",
      "Consider performance implications of the code",
    ],
  },
  {
    title: "Hallucination Detection",
    category: "hallucination_detection",
    content: "AI hallucinations are confident-sounding but false statements. They range from completely fabricated facts to subtle distortions of real information. Detecting them requires careful reading and domain knowledge.",
    keyPoints: [
      "Be skeptical of specific numbers, dates, and citations",
      "Watch for plausible-sounding but unverifiable claims",
      "Cross-reference multiple claims in the same response",
      "Made-up research papers and authors are common hallucinations",
      "Partially true statements with incorrect details are hardest to catch",
    ],
  },
  {
    title: "Safety Assessment Framework",
    category: "safety_assessment",
    content: "Safety evaluation involves classifying content on a spectrum from completely safe to clearly harmful. The challenging part is the gray area — content that's concerning but not explicitly harmful.",
    keyPoints: [
      "Consider both direct and indirect harm potential",
      "PII exposure is always a safety concern",
      "Context matters — medical info for a doctor vs. a child",
      "Over-refusal (refusing safe requests) is also a problem",
      "Distinguish between discussing a topic and endorsing it",
    ],
  },
  {
    title: "Instruction Following Analysis",
    category: "instruction_following",
    content: "Complex prompts often contain multiple requirements. Evaluators must systematically check whether each instruction was followed, partially followed, or missed entirely.",
    keyPoints: [
      "List all explicit requirements from the prompt",
      "Check implicit requirements (format, tone, length)",
      "Partial compliance counts as a miss in most rubrics",
      "Order and structure requirements are often overlooked",
      "Watch for responses that address the spirit but not the letter",
    ],
  },
  {
    title: "Mathematical Reasoning Verification",
    category: "math_reasoning",
    content: "Verifying AI math solutions requires checking each step independently. Common errors include sign mistakes, incorrect formulas, and logical leaps that skip necessary steps.",
    keyPoints: [
      "Verify each step independently — don't assume correct steps",
      "Check the final answer by working backwards when possible",
      "Watch for correct process but wrong arithmetic",
      "Unit analysis catches many errors",
      "Logic problems require checking that all cases are covered",
    ],
  },
  {
    title: "Writing Quality Assessment",
    category: "text_quality",
    content: "Evaluating writing quality involves checking grammar, coherence, style, tone, and structure. Good writing is clear, concise, and appropriate for its audience.",
    keyPoints: [
      "Read for overall coherence before checking details",
      "Check that tone matches the intended audience",
      "Look for redundancy and unnecessary verbosity",
      "Verify logical flow between paragraphs",
      "Assess whether the writing achieves its stated purpose",
    ],
  },
]

export const rubricGuide: RubricLevel[] = [
  {
    score: 5,
    label: "Excellent",
    description: "The response is nearly perfect. Accurate, comprehensive, well-structured, and directly addresses the user's needs. No meaningful improvements needed.",
    examples: [
      "Provides a complete, correct answer with appropriate detail",
      "Anticipates follow-up questions or edge cases",
      "Uses clear, professional language appropriate for the audience",
      "Includes relevant examples or analogies when helpful",
    ],
  },
  {
    score: 4,
    label: "Good",
    description: "The response is solid with minor room for improvement. Mostly accurate and helpful, but could be slightly better in one dimension.",
    examples: [
      "Correct answer but could be more concise",
      "Helpful but misses one minor aspect of the question",
      "Good content but slightly awkward phrasing in places",
      "Accurate but could benefit from an example",
    ],
  },
  {
    score: 3,
    label: "Average",
    description: "The response is acceptable but has noticeable gaps. It addresses the question but with missing information, minor inaccuracies, or structural issues.",
    examples: [
      "Partially answers the question but misses key points",
      "Contains one factual error among mostly correct information",
      "Too verbose or too brief for the question asked",
      "Correct information but poorly organized",
    ],
  },
  {
    score: 2,
    label: "Below Average",
    description: "The response has significant issues. Multiple errors, major gaps in coverage, or fundamentally misunderstands part of the question.",
    examples: [
      "Several factual errors or hallucinated information",
      "Misinterprets the main question but answers a related one",
      "Provides dangerous advice without appropriate caveats",
      "Mostly unhelpful padding with little substance",
    ],
  },
  {
    score: 1,
    label: "Poor",
    description: "The response fails to be helpful. Fundamentally wrong, harmful, completely off-topic, or essentially empty.",
    examples: [
      "Completely incorrect or fabricated information",
      "Harmful content without safety considerations",
      "Does not address the question at all",
      "Refuses a perfectly reasonable request without justification",
    ],
  },
]

export const platformInfo: PlatformInfo[] = [
  {
    name: "DataAnnotation.tech",
    description: "One of the largest AI training data platforms, providing RLHF and SFT data for major AI companies. Known for high-quality standards and competitive pay for skilled workers.",
    taskTypes: [
      "Response quality rating (1-5 scale with justification)",
      "Side-by-side response comparison and ranking",
      "Prompt writing and rewriting",
      "Code generation and review",
      "Factual accuracy verification",
      "Safety and harmfulness assessment",
      "Multi-turn conversation evaluation",
    ],
    payRange: "$20-45+/hr depending on task type and expertise level",
    qualificationTips: [
      "Qualification tests typically take 30-60 minutes",
      "You need 80%+ accuracy to pass most qualifications",
      "Read the rubric carefully — they provide detailed scoring criteria",
      "Take your time on qualification tests; speed matters less than accuracy",
      "If you fail, you can often retake after a waiting period",
      "Coding tasks tend to pay the highest rates",
    ],
    commonMistakes: [
      "Rushing through questions without reading the full context",
      "Not calibrating to the provided rubric (using personal standards instead)",
      "Missing subtle hallucinations in otherwise correct responses",
      "Being inconsistent across similar questions",
      "Over-penalizing for style when content is accurate",
      "Not providing detailed enough justifications for your ratings",
    ],
    proTips: [
      "Keep a personal calibration document with example ratings",
      "When unsure between two scores, note what pushes you either way",
      "Read the full prompt AND response before starting to evaluate",
      "Check for common hallucination patterns: fake citations, wrong dates, invented people",
      "For code tasks: actually trace through the code mentally, don't just skim",
      "Maintain a consistent working schedule for better throughput",
    ],
  },
  {
    name: "Outlier.ai",
    description: "A platform focused on AI training data, particularly for large language model alignment. Offers various task types from simple rating to complex evaluation.",
    taskTypes: [
      "Response rating and comparison",
      "Prompt engineering evaluation",
      "Domain-specific knowledge assessment",
      "Code evaluation and generation",
      "Creative writing assessment",
    ],
    payRange: "$15-40/hr depending on domain expertise",
    qualificationTips: [
      "Domain expertise is highly valued — leverage your background",
      "Multiple project types are available; find your strength",
      "Quality scores directly affect your access to higher-paying tasks",
      "Consistency across evaluations is tracked and valued",
    ],
    commonMistakes: [
      "Applying domain expertise inconsistently",
      "Not adapting to project-specific rubrics",
      "Spending too long on simple tasks, reducing hourly rate",
      "Ignoring the specific evaluation criteria for each project",
    ],
    proTips: [
      "Specialize in 2-3 areas where you have genuine expertise",
      "Build a strong track record on simpler tasks before complex ones",
      "Keep notes on project-specific rubrics for consistency",
      "Time yourself to optimize throughput while maintaining quality",
    ],
  },
  {
    name: "Remotasks (now part of Scale AI)",
    description: "Originally a standalone platform, now integrated into Scale AI. Offers a wide range of data labeling and AI training tasks, from simple annotation to complex evaluation.",
    taskTypes: [
      "Image and text annotation",
      "AI response evaluation",
      "Content moderation",
      "Data categorization",
      "Quality assurance review",
    ],
    payRange: "$10-30/hr depending on task complexity and region",
    qualificationTips: [
      "Start with simpler tasks to build reputation",
      "Training courses are required before accessing tasks",
      "Performance metrics directly affect task availability",
      "Peer review system means your work is checked by others",
    ],
    commonMistakes: [
      "Skipping training materials and jumping into tasks",
      "Not understanding the labeling schema before starting",
      "Inconsistent annotations across similar items",
      "Ignoring edge case guidelines",
    ],
    proTips: [
      "Complete all available training thoroughly",
      "Read the task guidelines multiple times",
      "Start each session by reviewing a few examples",
      "Ask for clarification in forums when guidelines are ambiguous",
    ],
  },
  {
    name: "Scale AI",
    description: "One of the largest AI data companies, serving major tech companies and government clients. Offers sophisticated evaluation tasks with high quality standards.",
    taskTypes: [
      "RLHF data collection (rating and comparison)",
      "Red-teaming and adversarial testing",
      "Domain expert evaluation (medical, legal, STEM)",
      "Multi-modal evaluation (text + images)",
      "Complex reasoning verification",
    ],
    payRange: "$25-65+/hr for expert-level tasks",
    qualificationTips: [
      "Expert qualifications require demonstrable domain knowledge",
      "Technical assessments are rigorous — prepare thoroughly",
      "Quality scores are the primary metric for task access",
      "Multiple review rounds ensure high-quality outputs",
    ],
    commonMistakes: [
      "Underestimating the depth of knowledge required",
      "Not providing sufficient justification for evaluations",
      "Failing to follow specific formatting requirements",
      "Inconsistency between similar evaluation scenarios",
    ],
    proTips: [
      "Leverage your professional background for specialized tasks",
      "Build a portfolio of consistent, high-quality work",
      "Network with other evaluators for tips and calibration",
      "Stay updated on AI developments relevant to your domain",
    ],
  },
  {
    name: "Alignerr",
    description: "A specialized platform for AI alignment tasks, focusing on ensuring AI systems behave as intended. Emphasizes safety, helpfulness, and honesty in evaluations.",
    taskTypes: [
      "Alignment evaluation (safety, helpfulness, honesty)",
      "Red-teaming exercises",
      "Constitutional AI feedback",
      "Value alignment assessment",
      "Edge case identification",
    ],
    payRange: "$20-50/hr depending on task complexity",
    qualificationTips: [
      "Strong understanding of AI safety concepts is essential",
      "Familiarity with alignment frameworks (Constitutional AI, RLHF) helps",
      "Nuanced thinking about ethical edge cases is valued",
      "Clear, reasoned justifications for your evaluations matter",
    ],
    commonMistakes: [
      "Binary thinking about safety (safe/unsafe) instead of nuanced assessment",
      "Not considering context when evaluating potential harm",
      "Focusing only on obvious harms while missing subtle ones",
      "Over-refusing legitimate requests (the 'safety theater' problem)",
    ],
    proTips: [
      "Study AI safety literature to understand alignment challenges",
      "Practice identifying the difference between discussing harm and causing harm",
      "Consider diverse perspectives when evaluating content",
      "Document your reasoning process for controversial edge cases",
    ],
  },
]

export const glossaryTerms: GlossaryTerm[] = [
  { term: "RLHF", definition: "Reinforcement Learning from Human Feedback — a training technique where human preferences are used to fine-tune AI models. Evaluators compare outputs and the model learns to produce preferred responses.", category: "Training Methods" },
  { term: "SFT", definition: "Supervised Fine-Tuning — training an AI model on curated examples of desired input-output pairs. Often the first step before RLHF.", category: "Training Methods" },
  { term: "DPO", definition: "Direct Preference Optimization — an alternative to RLHF that directly optimizes the model using preference data without training a separate reward model.", category: "Training Methods" },
  { term: "Constitutional AI", definition: "An approach where AI systems are guided by a set of principles (a 'constitution') to self-improve their responses for safety and helpfulness.", category: "Training Methods" },
  { term: "Red-teaming", definition: "The practice of deliberately trying to make AI systems produce harmful, incorrect, or inappropriate outputs to identify vulnerabilities.", category: "Evaluation" },
  { term: "Hallucination", definition: "When an AI generates false information that it presents as fact. Can range from subtle errors to completely fabricated claims, citations, or data.", category: "Quality Issues" },
  { term: "Reward Model", definition: "A model trained on human preference data that predicts how humans would rate a given response. Used in RLHF to guide the main model's training.", category: "Training Methods" },
  { term: "Likert Scale", definition: "A rating scale (typically 1-5 or 1-7) used to measure attitudes or opinions. Common in AI evaluation for rating response quality.", category: "Evaluation" },
  { term: "Pairwise Comparison", definition: "An evaluation method where two items are compared directly. In AI training, comparing two model responses to determine which is better.", category: "Evaluation" },
  { term: "Inter-annotator Agreement", definition: "A measure of how consistently different evaluators rate the same content. High agreement suggests clear guidelines; low agreement suggests ambiguous tasks.", category: "Evaluation" },
  { term: "Calibration", definition: "The process of ensuring consistent application of evaluation criteria. Well-calibrated evaluators produce similar ratings for similar content.", category: "Evaluation" },
  { term: "PII", definition: "Personally Identifiable Information — data that could identify a specific person (names, addresses, SSNs, etc.). AI should not generate or expose PII.", category: "Safety" },
  { term: "Over-refusal", definition: "When an AI unnecessarily refuses to answer a legitimate, safe question. This is a quality issue where safety measures are too aggressive.", category: "Quality Issues" },
  { term: "Prompt Engineering", definition: "The practice of crafting effective prompts to get desired outputs from AI systems. Includes techniques like few-shot examples, chain-of-thought, and role-playing.", category: "Skills" },
  { term: "Chain-of-Thought", definition: "A prompting technique that encourages AI to show its reasoning step-by-step, which often improves accuracy on complex tasks.", category: "Skills" },
  { term: "Few-shot Learning", definition: "Providing a few examples in the prompt to demonstrate the desired output format or behavior, without retraining the model.", category: "Skills" },
  { term: "Annotation", definition: "The process of labeling or categorizing data for AI training. Can include text classification, entity recognition, sentiment analysis, etc.", category: "Tasks" },
  { term: "Ground Truth", definition: "The correct, verified answer against which AI outputs and human evaluations are compared. Establishing ground truth is critical for evaluation quality.", category: "Evaluation" },
  { term: "Throughput", definition: "The rate at which an evaluator completes tasks, usually measured in tasks per hour. Must be balanced with quality.", category: "Metrics" },
  { term: "Quality Score", definition: "A metric tracking how closely an evaluator's ratings align with expert consensus or ground truth. Directly affects access to tasks and pay rates.", category: "Metrics" },
  { term: "Edge Case", definition: "An unusual or extreme scenario that tests the boundaries of AI behavior or evaluation criteria. Often the hardest to evaluate correctly.", category: "Evaluation" },
  { term: "Rubric", definition: "A detailed scoring guide that defines what constitutes each rating level. Following the rubric precisely is essential for consistent evaluation.", category: "Evaluation" },
  { term: "Adversarial Prompt", definition: "A prompt deliberately designed to trick, confuse, or manipulate an AI system into producing undesired outputs.", category: "Safety" },
  { term: "Jailbreak", definition: "An adversarial technique that attempts to bypass an AI's safety guidelines to produce prohibited content.", category: "Safety" },
  { term: "Alignment Tax", definition: "The potential reduction in model capability that comes from safety training. Well-aligned models should minimize this tradeoff.", category: "Concepts" },
]
