// Clinical AI Engine for HealthAI
// Implements Emergency Red Flag Detection, Evidence-Based Symptom Triage, and Conversational Health Guidance

export const RED_FLAG_PATTERNS = [
  {
    regex: /\b(chest pain|chest pressure|crushing chest|radiat(ing|es)? (to|down) (the )?(left )?arm|chest tight(ness)? with sweat(ing)?)\b/i,
    flag: 'Possible Acute Coronary Syndrome / Heart Attack',
    urgency: 'EMERGENCY',
    instructions: 'Call 911 / 112 immediately. Sit down in a comfortable position, rest, unlock the front door for paramedics, and do not drive yourself to the hospital.'
  },
  {
    regex: /\b(slurr(ed|ing) speech|facial droop|face drooping|arm weakness|sudden numbness|can'?t speak|b-?e-?fast)\b/i,
    flag: 'Signs of Acute Stroke (BE-FAST)',
    urgency: 'EMERGENCY',
    instructions: 'Call emergency services (911 / 112) immediately. Note the exact time symptoms started. Stroke treatments are time-critical.'
  },
  {
    regex: /\b(can'?t breathe|struggling to breathe|severe shortness of breath|gasping for air|turning blue|lips blue)\b/i,
    flag: 'Severe Respiratory Distress / Hypoxia',
    urgency: 'EMERGENCY',
    instructions: 'Call 911 / 112 right now. Sit upright to maximize airflow. If you have a prescribed rescue inhaler, use it as directed.'
  },
  {
    regex: /\b(throat (closing|swelling)|tongue swell(ing|ed)?|anaphylax(is)?|allergic reaction with wheez(ing)?)\b/i,
    flag: 'Suspected Anaphylaxis / Severe Allergic Reaction',
    urgency: 'EMERGENCY',
    instructions: 'Use an Epinephrine auto-injector (EpiPen) immediately if available into the outer thigh, and call 911 / 112 without delay.'
  },
  {
    regex: /\b(worst headache of (my )?life|thunderclap headache|sudden explosive headache)\b/i,
    flag: 'Suspected Subarachnoid Hemorrhage / Thunderclap Headache',
    urgency: 'EMERGENCY',
    instructions: 'Requires urgent emergency evaluation at the nearest emergency department. Call 911 or have someone take you immediately.'
  },
  {
    regex: /\b(coughing (up )?blood|vomiting blood|coffee ground emesis|black tarry stool)\b/i,
    flag: 'Internal or Gastrointestinal Bleeding',
    urgency: 'EMERGENCY',
    instructions: 'Seek emergency medical evaluation immediately. Do not ingest food, drinks, or medications until evaluated.'
  },
  {
    regex: /\b(stiff neck with (high )?fever|neck stiffness and fever and confusion)\b/i,
    flag: 'Possible Meningeal Irritation / Meningitis',
    urgency: 'EMERGENCY',
    instructions: 'Seek immediate emergency medical attention at an emergency room.'
  },
  {
    regex: /\b(suicid(e|al)|kill myself|end my life|want to die)\b/i,
    flag: 'Mental Health Crisis / Suicide Prevention Alert',
    urgency: 'CRISIS_SUPPORT',
    instructions: 'Please reach out immediately. Call or text 988 (Suicide & Crisis Lifeline in the US/Canada) or call your local emergency number. You are not alone and compassionate help is available 24/7.'
  }
];

// Check if any text or symptom list contains emergency red flags
export function detectEmergency(textOrList) {
  const combined = Array.isArray(textOrList) ? textOrList.join(' ') : String(textOrList);
  
  for (const pattern of RED_FLAG_PATTERNS) {
    if (pattern.regex.test(combined)) {
      return {
        isEmergency: true,
        detectedFlag: pattern.flag,
        urgency: pattern.urgency,
        instructions: pattern.instructions
      };
    }
  }

  return { isEmergency: false };
}

// Symptom Triage Analysis Algorithm
export function analyzeSymptoms({ symptoms, duration, severity, ageGroup, preExistingConditions, additionalDetails }) {
  const allText = [
    ...(Array.isArray(symptoms) ? symptoms : [symptoms]),
    additionalDetails || '',
    preExistingConditions || ''
  ].join(' ').toLowerCase();

  // 1. Critical Safety Check First: NEVER delay emergency detection!
  const emergencyCheck = detectEmergency(allText);
  if (emergencyCheck.isEmergency) {
    return {
      triageLevel: 'EMERGENCY - Immediate Medical Attention Required',
      urgencyColor: 'red',
      isEmergency: true,
      emergencyDetails: {
        flag: emergencyCheck.detectedFlag,
        action: emergencyCheck.instructions,
        emergencyNumber: '911 (US/Canada), 112 (EU), 999 (UK)'
      },
      summary: `HealthAI has detected symptoms consistent with a potential medical emergency (${emergencyCheck.detectedFlag}). Prompt clinical evaluation is essential.`,
      possibleExplanations: [
        {
          condition: emergencyCheck.detectedFlag,
          likelihood: 'High Clinical Priority',
          description: 'Requires acute physical examination, diagnostic imaging, and physician assessment.'
        }
      ],
      nextSteps: [
        'Call local emergency services (911 / 112) or go to the nearest emergency room immediately.',
        'Do not drive yourself—request an ambulance so paramedics can provide immediate care en route.',
        'Remain calm and stay seated in an accessible location.'
      ],
      disclaimer: 'CRITICAL NOTICE: This is an automated safety triage recommendation, not a diagnosis. In potential emergencies, professional healthcare personnel must be alerted immediately.'
    };
  }

  // 2. Multi-factor triage score
  const sev = Number(severity) || 5;
  let triageLevel = 'Self-Care & Home Monitoring';
  let urgencyColor = 'green';
  let recommendedTimeframe = 'Within 3-5 days if symptoms do not improve';

  if (sev >= 8 || allText.includes('severe') || allText.includes('excruciating') || allText.includes('intolerable')) {
    triageLevel = 'Urgent Care - Seek Evaluation within 12-24 Hours';
    urgencyColor = 'orange';
    recommendedTimeframe = 'Same-day walk-in clinic or urgent care center';
  } else if (sev >= 5 || allText.includes('moderate') || duration?.includes('week') || duration?.includes('month')) {
    triageLevel = 'Routine Medical Consultation';
    urgencyColor = 'blue';
    recommendedTimeframe = 'Schedule an appointment with your primary care provider within 2-4 days';
  }

  // 3. Differential Clinical Possibilities Generator (Knowledge-driven clinical heuristics)
  const possibilities = [];
  const followUpQuestions = [];
  const redFlagsToWatch = [];

  // Respiratory / ENT
  if (allText.includes('cough') || allText.includes('sore throat') || allText.includes('congestion') || allText.includes('runny nose') || allText.includes('sneez')) {
    if (allText.includes('fever') || allText.includes('body ache') || allText.includes('chill')) {
      possibilities.push({
        condition: 'Acute Viral Upper Respiratory Infection (e.g. Influenza or common viral syndrome)',
        likelihood: 'Probable',
        description: 'Common viral illnesses can cause fever, myalgia, fatigue, cough, and pharyngitis, typically resolving in 7–10 days.'
      });
    } else if (allText.includes('itchy') || allText.includes('pollen') || allText.includes('spring')) {
      possibilities.push({
        condition: 'Allergic Rhinitis / Seasonal Allergies',
        likelihood: 'Probable',
        description: 'Immune response to environmental allergens leading to sneezing, clear nasal drainage, and itchy eyes.'
      });
    } else {
      possibilities.push({
        condition: 'Common Cold (Viral Rhinopharyngitis)',
        likelihood: 'Probable',
        description: 'Mild self-limiting upper airway infection frequently caused by rhinoviruses.'
      });
    }
    followUpQuestions.push('Are you experiencing any shortness of breath or pain when inhaling deeply?');
    followUpQuestions.push('Do you have a measured fever above 100.4°F (38°C)?');
    redFlagsToWatch.push('Sudden inability to swallow saliva, stridor (high-pitched breathing sound), or shortness of breath.');
  }

  // Headache / Neurological
  if (allText.includes('headache') || allText.includes('head pain') || allText.includes('migraine')) {
    if (allText.includes('throbbing') || allText.includes('light') || allText.includes('sound') || allText.includes('nausea') || allText.includes('one side')) {
      possibilities.push({
        condition: 'Migraine Headache',
        likelihood: 'Moderate to High',
        description: 'Neurovascular condition often presenting with unilateral throbbing pain, photophobia, phonophobia, and sometimes visual aura.'
      });
    } else {
      possibilities.push({
        condition: 'Tension-Type Headache',
        likelihood: 'Probable',
        description: 'Characterized by dull, aching band-like pressure across both sides of the forehead or occipital region, frequently triggered by stress or eye strain.'
      });
    }
    followUpQuestions.push('Did the headache start suddenly like a thunderclap or did it build up gradually?');
    followUpQuestions.push('Is there any accompanying vision change, neck stiffness, or numbness?');
    redFlagsToWatch.push('Sudden onset "worst headache ever", neurological deficit, or fever with stiff neck.');
  }

  // Gastrointestinal
  if (allText.includes('stomach') || allText.includes('nausea') || allText.includes('vomit') || allText.includes('diarrhea') || allText.includes('heartburn') || allText.includes('acid')) {
    if (allText.includes('heartburn') || allText.includes('acid') || allText.includes('after eating')) {
      possibilities.push({
        condition: 'Gastroesophageal Reflux Disease (GERD) / Dyspepsia',
        likelihood: 'Probable',
        description: 'Stomach acid flowing back into the esophagus causing burning substernal discomfort and regurgitation.'
      });
    } else {
      possibilities.push({
        condition: 'Acute Gastroenteritis / Food-related Enteric Disturbance',
        likelihood: 'Probable',
        description: 'Inflammation of the stomach and intestines leading to cramping, nausea, vomiting, or loose stools.'
      });
    }
    followUpQuestions.push('Are you able to keep sips of water or electrolyte fluids down?');
    followUpQuestions.push('Is there any localized sharp pain in the lower right abdomen?');
    redFlagsToWatch.push('Signs of severe dehydration (no urination for 8+ hours, severe dizziness), blood in stool, or rigid painful abdomen.');
  }

  // Musculoskeletal
  if (allText.includes('back pain') || allText.includes('joint') || allText.includes('knee') || allText.includes('muscle') || allText.includes('sprain') || allText.includes('strain')) {
    possibilities.push({
      condition: 'Acute Musculoskeletal Strain / Ligamentous Irritation',
      likelihood: 'Probable',
      description: 'Micro-tears in muscle fibers or tendons from physical exertion, awkward posture, or repetitive stress.'
    });
    followUpQuestions.push('Did the pain begin following an acute injury, lift, or twist?');
    redFlagsToWatch.push('Numbness in the groin/saddle area, loss of bowel/bladder control, or inability to bear any weight.');
  }

  // Skin / Rash
  if (allText.includes('rash') || allText.includes('itching') || allText.includes('hives') || allText.includes('skin')) {
    possibilities.push({
      condition: 'Contact Dermatitis or Mild Urticaria (Hives)',
      likelihood: 'Probable',
      description: 'Localized skin inflammation secondary to irritant exposure, contact allergy, or mild histamine reaction.'
    });
    redFlagsToWatch.push('Spreading rapidly, blistering, involvement of eyes/mouth, or accompanied by wheezing or facial swelling.');
  }

  // Default fallback if no specific cluster matched
  if (possibilities.length === 0) {
    possibilities.push({
      condition: 'Non-Specific Symptom Cluster',
      likelihood: 'Requires Clinical Evaluation',
      description: 'The symptoms entered require physical examination, vital signs assessment, and physician history to identify root causes.'
    });
    followUpQuestions.push('When did you first notice these sensations, and what makes them better or worse?');
    followUpQuestions.push('Have you started any new medications, foods, or experienced recent travel?');
  }

  // Next steps tailored to triage level
  const nextSteps = [];
  if (triageLevel.includes('Urgent Care')) {
    nextSteps.push('Visit a walk-in clinic or urgent care facility today for in-person evaluation.');
    nextSteps.push('Rest, monitor your temperature, and avoid strenuous activity.');
    nextSteps.push('If symptoms suddenly escalate or difficulty breathing develops, proceed to the ER.');
  } else if (triageLevel.includes('Routine')) {
    nextSteps.push('Contact your family doctor or primary care practice to book an appointment this week.');
    nextSteps.push('Keep a written log of when symptoms occur and any triggers you notice.');
    nextSteps.push('Practice supportive self-care (hydration, balanced rest, over-the-counter relief per pharmacist guidance).');
  } else {
    nextSteps.push('Supportive home care: ensure adequate hydration and restorative rest.');
    nextSteps.push('Consult a licensed pharmacist regarding safe over-the-counter symptom management options.');
    nextSteps.push('Seek professional medical evaluation if symptoms persist past 5-7 days or worsen.');
  }

  return {
    triageLevel,
    urgencyColor,
    isEmergency: false,
    recommendedTimeframe,
    severityScore: sev,
    possibleExplanations: possibilities,
    followUpQuestions,
    redFlagsToWatch: redFlagsToWatch.length > 0 ? redFlagsToWatch : [
      'Sudden onset of severe shortness of breath or chest pain.',
      'High persistent fever above 103°F (39.4°C) not responding to antipyretics.',
      'Sudden confusion, fainting, or inability to stay awake.'
    ],
    nextSteps,
    disclaimer: 'DISCLAIMER: HealthAI symptom triage provides general educational guidance and possible explanations based on reported inputs. It is not a medical diagnosis or treatment plan. Always consult a licensed healthcare professional for medical concerns.'
  };
}

// AI Health Chat Assistant Service (Supports Gemini, OpenAI, or intelligent clinical fallback)
export async function generateChatResponse({ messages, userContext }) {
  const latestMessage = messages[messages.length - 1]?.text || '';

  // 1. Check for Emergency in Chat
  const emergencyCheck = detectEmergency(latestMessage);
  if (emergencyCheck.isEmergency) {
    return {
      text: `🚨 **IMPORTANT EMERGENCY SAFETY ALERT** 🚨\n\nBased on your message, you mentioned symptoms that may indicate a life-threatening medical emergency (**${emergencyCheck.detectedFlag}**).\n\n**Immediate Action Required:**\n- **Call 911 / 112 (or your local emergency services) immediately.**\n- ${emergencyCheck.instructions}\n- Do not wait or rely on an AI assistant for acute emergencies.\n\n*Emergency responders are equipped to provide life-saving intervention. Please reach out to them immediately.*`,
      isEmergency: true,
      suggestedFollowUps: ['Call 911 / 112', 'Find Nearest Emergency Room', 'Alert Emergency Contact']
    };
  }

  // 2. If Gemini API Key is configured, attempt LLM call
  if (process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `You are HealthAI, a compassionate, articulate, and medically cautious healthcare assistant.
Your objectives:
1. Provide accurate, clear, evidence-based health information in accessible language.
2. Clearly explain medical terms and preventive healthcare.
3. Ask 1-2 thoughtful clarifying follow-up questions when relevant.
4. Emphasize healthy lifestyle, nutrition, hydration, sleep, and routine screenings.
5. ALWAYS maintain the boundary that you provide health education and guidance, NOT a replacement for a doctor or formal clinical diagnosis.
6. If any hint of emergency appears, urge immediate contact with emergency medical services.
User Context: Name: ${userContext?.name || 'User'}, Age: ${userContext?.age || 'Adult'}, Known conditions: ${userContext?.conditions || 'None stated'}.`;

      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600,
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          return {
            text: responseText + "\n\n---\n*Disclaimer: HealthAI provides general informational guidance and is not a substitute for professional medical diagnosis or treatment.*",
            isAi: true,
            provider: 'Gemini AI'
          };
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, switching to clinical engine:', e.message);
    }
  }

  // 3. Clinical Reasoning & Knowledge Base Engine (Robust, accurate fallback)
  const q = latestMessage.toLowerCase();
  let answer = '';
  let followUps = [];

  if (q.includes('blood pressure') || q.includes('hypertension')) {
    answer = `**Understanding Blood Pressure & Healthy Range:**\n\nBlood pressure measures the force of circulating blood against your arterial walls:\n- **Normal Range:** Less than 120/80 mmHg (Systolic / Diastolic).\n- **Elevated:** Systolic 120–129 mmHg and Diastolic < 80 mmHg.\n- **Hypertension Stage 1:** 130–139 mmHg systolic or 80–89 mmHg diastolic.\n- **Hypertension Stage 2:** 140/90 mmHg or higher.\n\n**Evidence-Based Lifestyle Strategies to Support Healthy Blood Pressure:**\n1. **DASH Diet:** Emphasize leafy greens, berries, potassium-rich foods, and limit sodium to < 2,300 mg/day.\n2. **Regular Aerobic Activity:** Aim for at least 150 minutes of moderate aerobic exercise weekly.\n3. **Stress Reduction:** Techniques such as diaphragmatic breathing, meditation, and quality sleep.\n4. **Hydration & Limiting Alcohol:** Drink adequate water and moderate or eliminate alcohol intake.`;
    followUps = ['How often should I measure my blood pressure at home?', 'What foods are highest in potassium?', 'What is a hypertensive crisis?'];
  } else if (q.includes('prediabetes') || q.includes('blood sugar') || q.includes('glucose') || q.includes('hba1c') || q.includes('a1c')) {
    answer = `**Blood Sugar & Pre-Diabetes Insights:**\n\n- **Fasting Blood Glucose:** Normal is 70–99 mg/dL. Pre-diabetes is 100–125 mg/dL. 126 mg/dL or higher on two separate tests indicates diabetes.\n- **Hemoglobin A1c (HbA1c):** Reflects your average blood sugar over the past 2–3 months. Normal is below 5.7%, pre-diabetes is 5.7%–6.4%, and diabetes is 6.5% or above.\n\n**Reversing or Managing Pre-Diabetes:**\n- **Pair Carbohydrates with Protein & Fiber:** Slows down glucose absorption and minimizes insulin spikes.\n- **Post-Meal Walking:** A 10–15 minute brisk walk after meals helps skeletal muscles absorb glucose directly from the bloodstream.\n- **Strength Training:** Muscle mass is the body's primary metabolic sink for circulating glucose.`;
    followUps = ['What are the best snacks for stabilizing blood sugar?', 'What symptoms indicate insulin resistance?', 'How frequently should HbA1c be tested?'];
  } else if (q.includes('sleep') || q.includes('insomnia') || q.includes('rem')) {
    answer = `**Evidence-Based Sleep Hygiene & Recovery:**\n\nQuality sleep (7–9 hours for adults) is foundational for immune resilience, cardiovascular health, and cognitive function.\n\n**Core Sleep Optimization Guidelines:**\n1. **Consistent Sleep-Wake Schedule:** Go to bed and wake up at the same time every day, even on weekends.\n2. **Morning Sunlight Exposure:** Get 10–20 minutes of natural outdoor light within an hour of waking to set your circadian rhythm.\n3. **Cool, Dark Environment:** Keep the bedroom around 65–68°F (18–20°C) with blackout curtains.\n4. **Screen Sunset:** Dim screens and avoid blue light at least 45 minutes before sleep to facilitate melatonin synthesis.\n5. **Caffeine Timing:** Stop caffeine intake at least 8 hours prior to bedtime.`;
    followUps = ['What is the difference between deep sleep and REM sleep?', 'Are natural supplements like magnesium helpful?', 'When should someone be tested for sleep apnea?'];
  } else if (q.includes('hydrate') || q.includes('hydration') || q.includes('water') || q.includes('electrolytes')) {
    answer = `**Hydration and Cellular Function:**\n\nWater makes up roughly 60% of the adult human body and is vital for nutrient transport, temperature regulation, joint lubrication, and renal filtration.\n\n**Key Guidelines:**\n- **Baseline Target:** Roughly 2 to 3 liters (8–12 cups) daily, adjusting for climate and physical activity.\n- **Electrolytes:** Sodium, potassium, magnesium, and calcium regulate muscle contraction and fluid balance. Plain water is usually sufficient for daily activities under an hour; intensive exercise or heavy sweating benefits from electrolyte replenishment.\n- **Urine Check:** Light straw or pale lemonade color generally indicates optimal hydration; dark amber signals a need for more fluids.`;
    followUps = ['Can you drink too much water (hyponatremia)?', 'What are natural sources of electrolytes?', 'Does herbal tea count toward daily water intake?'];
  } else if (q.includes('cholesterol') || q.includes('lipid') || q.includes('triglyceride')) {
    answer = `**Understanding Cholesterol & Lipid Panels:**\n\nCholesterol is a waxy lipid essential for cell membranes and hormone synthesis. A standard lipid panel evaluates:\n- **LDL ("Bad") Cholesterol:** Optimal is typically < 100 mg/dL. High LDL can accumulate in artery walls forming plaque.\n- **HDL ("Good") Cholesterol:** Optimal is > 40 mg/dL (men) or > 50 mg/dL (women). HDL transports excess cholesterol back to the liver.\n- **Triglycerides:** Optimal is < 150 mg/dL. These are fats derived from excess caloric intake and refined carbohydrates.\n\n**Supportive Steps:**\nIncrease soluble fiber (oats, flaxseeds, legumes, apples) and omega-3 fatty acids (wild salmon, chia seeds), while limiting trans fats and ultra-processed carbohydrates.`;
    followUps = ['What is the difference between LDL and ApoB?', 'How does exercise affect HDL cholesterol?', 'At what age should regular lipid screening begin?'];
  } else if (q.includes('antibiotic') || q.includes('infection') || q.includes('virus') || q.includes('bacteria')) {
    answer = `**Viruses vs. Bacteria & Antibiotic Stewardship:**\n\n- **Viruses:** Cause the common cold, flu, COVID-19, and most bronchitis cases. **Antibiotics have zero effect on viruses.** Viral infections typically resolve through rest, hydration, and symptom relief.\n- **Bacteria:** Cause conditions like strep throat, urinary tract infections (UTIs), and bacterial pneumonia. These do respond to targeted antibiotics prescribed by a physician.\n\n**Why Stewardship Matters:**\nTaking antibiotics unnecessarily can disrupt your beneficial gut microbiome and contributes to global antibiotic resistance (superbugs). Always finish prescribed courses exactly as directed by your doctor.`;
    followUps = ['How can a doctor tell if a sore throat is viral or strep?', 'What probiotics help restore gut health after antibiotics?', 'What are warning signs that a viral cold has become a secondary infection?'];
  } else {
    answer = `Thank you for asking about **${latestMessage.slice(0, 40)}**.

**Key Health & Wellness Principles:**
1. **Holistic Assessment:** Health involves the interplay of nutrition, daily physical movement, restorative sleep, stress management, and preventive screenings.
2. **Preventive Checks:** Regular checkups with your primary care provider enable early detection of vital markers (blood pressure, blood glucose, cholesterol).
3. **Listen to Your Body:** Keep track of the onset, triggers, and progression of any physical changes you experience.

Could you share a bit more detail about what specifically you'd like to explore? For example:
- Are you inquiring about preventive lifestyle practices?
- Are you asking about a specific medical term or lab test?
- Are you currently experiencing any discomfort or specific symptoms?`;
    followUps = [
      'Explain common lab test terms (CBC, CMP, Lipid panel)',
      'What preventive screenings are recommended by age?',
      'How to build a sustainable daily wellness routine'
    ];
  }

  return {
    text: answer + "\n\n---\n*Disclaimer: HealthAI provides general informational guidance and is not a substitute for professional medical diagnosis or treatment.*",
    isAi: true,
    suggestedFollowUps: followUps,
    provider: 'HealthAI Clinical Engine'
  };
}
