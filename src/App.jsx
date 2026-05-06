import { useState, useEffect, useRef } from "react";

const SCREENS = ["home", "chat", "mood", "journal", "belief", "mindfulness", "learn"];

const NAV_ITEMS = [
  { id: "home", icon: "⌂", label: "Home" },
  { id: "chat", icon: "◎", label: "Support" },
  { id: "mood", icon: "◑", label: "Emotions" },
  { id: "journal", icon: "▤", label: "Journal" },
  { id: "belief", icon: "◈", label: "Beliefs" },
  { id: "mindfulness", icon: "❋", label: "Rest" },
  { id: "learn", icon: "◧", label: "Learn" },
];

const EMOTIONS = [
  { score: 1, emoji: "😔", label: "Depressed" },
  { score: 2, emoji: "😢", label: "Sad" },
  { score: 3, emoji: "😠", label: "Angry / Guilty / Regretful" },
  { score: 4, emoji: "😨", label: "Anxious / Fearful" },
  { score: 5, emoji: "😶", label: "Numb / Disconnected" },
  { score: 6, emoji: "😊", label: "Appreciative" },
];

const EMOTION_SIGNALS = {
  1: {
    signal: "Depression signals the conclusion that there is no point having goals — that the existence your mind believes would prove your life a success is no longer achievable. This is not a broken brain. It is a specific belief that has been reached, and it can be identified and upgraded.",
    prompt: "What conclusion has your mind reached about your future or your goals? What has it decided is no longer possible or worth pursuing?",
    followThrough: {
      title: "It Is Always Worthwhile Having Goals",
      points: [
        "The conclusion that there is no point having goals is a belief — not a fact. It is the Achievement Model reaching its logical conclusion: if the existence I need to achieve to prove my worth is no longer reachable, then there is no point. But this conclusion rests entirely on the incorrect premise that goals are for proving worth.",
        "Goals are not for proving your life a success by achieving them. They are for keeping you active and engaged with life — encountering the experiences that develop your understanding of reality. The goal is the vehicle for the development, not the measure of the life.",
        "Your value is not inside any goal. It is not earned by achieving anything. It is automatic — you are adding data to the system of life right now, regardless of what you have or have not achieved.",
        "Even if the specific goal your mind had in mind is no longer available — there is always a next goal. Life always provides another direction. The point is not to achieve any particular goal. The point is to remain engaged with the journey.",
      ],
      action: "belief",
      actionLabel: "Work on this belief →",
    }
  },
  2: {
    signal: "Sadness signals that your mind has concluded something important has been lost, has gone wrong, or will not be recovered. It is closely connected to the belief that life could have been different — that something that should have happened, didn't, or something that shouldn't have happened, did. The belief underneath sadness is always worth identifying.",
    prompt: "What does your mind believe has been lost or has gone wrong? What is it concluding about what that loss means for your value or your future?",
    followThrough: {
      title: "Nothing of True Value Has Been Lost",
      points: [
        "Sadness points to the belief that something important has been lost or that life has unfolded incorrectly. It is an accurate indicator — but not necessarily an accurate account of what has actually happened.",
        "Everything that has happened has happened because of cause and effect — the only way it could have unfolded given all the factors involved. The loss that feels wrong is part of the developmental path, not an interruption to it.",
        "What genuinely serves your development cannot be taken from you. The understanding you have received from every experience — including the ones that ended — remains part of who you are. That cannot be lost.",
        "The belief that something should still be present, or should not have ended, is what produces the sadness. The accurate understanding is that it was present for exactly as long as it was meant to be — and the next stage of your development follows from exactly here.",
      ],
      action: "chat",
      actionLabel: "Talk this through with AI support →",
    }
  },
  3: {
    signal: "Anger, guilt, and regret share the same root: the belief that someone — you or another person — could have simply chosen to act differently. That belief is not accurate. Free will does not exist. Every action is governed by the beliefs held at that point in development, which are governed by reasoning, which is governed by the law of cause and effect. No one could have chosen differently. The cure is education in why this is true.",
    prompt: "Who are you angry at or feeling guilty about — yourself or someone else? What do you believe they could and should have done differently?",
    followThrough: {
      title: "No One Could Have Acted Differently",
      points: [
        "Every person who has caused frustration, pain, or harm — including yourself — acted from the beliefs and priorities they held at that specific moment in their development. Given those beliefs, they could not have acted any differently. This is governed by cause and effect — the same law that governs everything.",
        "This is not an excuse for harmful behaviour. It is the accurate account of how behaviour works — and it is what allows the energy of anger, guilt, and resentment to be released.",
        "For guilt specifically: you acted from your beliefs at that time. A different outcome would have required different beliefs, which you did not yet have. You could not have known what you did not yet know. You could not have acted from understanding you had not yet developed.",
        "Understanding why something happened is not the same as approving of it. Whatever steps are needed can still be taken. Understanding simply removes the sustained psychological cost of maintaining resentment or guilt toward something that could not have been any other way.",
      ],
      action: "belief",
      actionLabel: "Work on the free will exercise →",
    }
  },
  4: {
    signal: "Anxiety is driven by two specific beliefs working together. The first is the belief that TOTAL control over the universe — over all events, other people, and outcomes — is both possible and necessary. The second is the belief that TOTAL prevention of all unwanted events is both possible and the correct strategy. The sympathetic nervous system fires because the failure to achieve total control or total prevention is perceived as a threat to being assessed as worthless, useless, or hopeless — which under the 'If you are good — you'll get' belief means missing out on necessities. The anxiety is not about the event itself. It is about what failing to control or prevent it proves about your value in the eyes of others.",
    prompt: "What specifically is your mind trying to totally control or totally prevent? What do you believe other people will conclude about you if that event occurs or if you are seen to not be in control?",
    followThrough: {
      title: "Total Control Is Not Available — and Not Needed",
      points: [
        "Total control over outcomes and total prevention of unwanted events are not available to any person. The pressure comes entirely from the demand for something that does not exist. The anxiety is not evidence that things are going wrong — it is evidence that an impossible demand is being placed.",
        "No event — including the ones you cannot prevent — can decrease your value. Your worth is not attached to any outcome. The belief that it is — the 'If you are good, you'll get' philosophy — is the belief that generates the need for total control.",
        "Preparation, full engagement, and complete contribution are all possible — without needing to control the outcome. These are different things. Only one of them is available. And only one of them is what life is actually asking of you.",
        "The events you cannot prevent are not evidence of failure. They are the experiences that provide the development you could not have chosen for yourself — data your mind required, delivered through circumstances you would never have deliberately selected.",
      ],
      action: "belief",
      actionLabel: "Work on the anxiety exercise →",
    }
  },
  5: {
    signal: "Numbness often signals that the mind has quietly concluded there is little point engaging with life — a less obvious form of the depression conclusion. It can also follow a long period of anxiety where the attempt at total control has exhausted the person. Worth examining what belief is making engagement feel pointless.",
    prompt: "What does engaging with life feel like right now? What belief is making it feel pointless or exhausting to be present in what is taking place?",
    followThrough: {
      title: "Engagement Is Always Worthwhile — Here Is Why",
      points: [
        "Numbness is often the quiet version of 'there is no point.' It follows either the conclusion that goals are no longer achievable, or the exhaustion of sustained anxiety where the attempt at total control has depleted the system. Either way, a specific belief is running — not a fact about your situation.",
        "Engagement with life is always worthwhile — not because things will necessarily go as desired, but because every experience provides data that develops understanding. The feeling that nothing is worth engaging with is the belief that needs addressing, not a truth about the circumstances.",
        "You are not required to feel energised before engaging. The feeling follows the belief — not the other way around. Begin by applying the accurate understanding, and the capacity to engage follows.",
        "Your presence in life right now — even in numbness — is contributing data to the system. You are not on hold. You are not missing your development. The experiences you are having right now are the experiences you are meant to be having.",
      ],
      action: "reflect",
      actionLabel: "Give the mind a rest →",
    }
  },
  6: {
    signal: "Appreciation signals that your beliefs are matching the reality of life — that you are recognising what is being received rather than what is being threatened. This is what wisdom produces. It is not a mood. It is the direct result of an accurate understanding of what is actually taking place.",
    prompt: "What are you recognising as valuable or purposeful right now? What understanding is making it possible to appreciate what life is providing?",
    followThrough: {
      title: "This Is What the Wisdom Model Feels Like",
      points: [
        "What you are experiencing right now is the direct result of accurate beliefs about your contribution and your path. This is not luck or circumstance — it is the natural state that follows correct understanding.",
        "Notice what beliefs are running that are allowing this. The more clearly you can identify them, the more readily you can return to them when the Achievement Model reasserts itself.",
        "Appreciation and happiness are not the goal — they are the by-product of accurate beliefs about life, contribution, and development. The goal is the accurate understanding. These feelings follow naturally from it.",
        "This state is available consistently — not just when circumstances are favourable. The same understanding applies regardless of what is happening in your life. Record what is working right now.",
      ],
      action: "journal",
      actionLabel: "Record what is working →",
    }
  },
};

const JOURNAL_PROMPTS = [
  "What belief about yourself has been causing the most pain today? Is that belief an accurate account of what is actually taking place — or is it measuring your value by something you have not achieved or controlled?",
  "Describe a situation that upset you recently. What did your mind conclude was happening? Is that conclusion accurate — or is it based on the belief that your life is going wrong or your value is decreasing?",
  "What belief about your future or your goals is causing stress right now? What would change in how you assess your situation if you understood that life cannot unfold incorrectly and your value is never in jeopardy?",
  "What has life been forcing you to encounter lately? Is your mind assessing this as a threat — or is it possible this is simply data your development required you to receive?",
  "Where did you notice your self-worth feeling threatened today? What is the belief underneath that? Is that belief an accurate account of how value is correctly measured?",
];

const BELIEF_STEPS = [
  {
    title: "Identify the Belief",
    desc: "What is the thought or belief causing you pain right now? Write it out plainly — no softening, no editing.",
    placeholder: "e.g. I am not good enough. Nobody cares about me. My life is going wrong...",
  },
  {
    title: "Trace It to Its Source",
    desc: "This belief didn't appear from nowhere. It was formed from data your environment gave you. Who or what taught you this? What events convinced you it was true?",
    placeholder: "Think back — where did this understanding come from? What experiences built it?",
  },
  {
    title: "Question the Achievement Model",
    desc: "Does this belief measure your value by what you've achieved, controlled, or proven? Notice if you're telling yourself you must live up to something before you're allowed to feel okay.",
    placeholder: "What standard is this belief demanding you meet? What happens to your worth if you don't meet it?",
  },
  {
    title: "The Wisdom Model — The Accurate Understanding",
    desc: "Life is developing you — not testing you. You are not failing. You are learning. Your value is automatic — it comes from simply being part of other people's journeys. Write the truth that replaces the old belief.",
    placeholder: "What is the accurate understanding that cancels this belief? What would you tell someone you loved who believed this?",
  },
  {
    title: "Integration",
    desc: "Read your new truth aloud three times. Old thoughts may still surface — that is normal and expected. It does not mean the work has not worked. It means new neurons have been added alongside the old ones. When the old thought surfaces, apply the new reasoning. That is how beliefs are changed.",
    placeholder: "Describe what you notice as you apply the new reasoning...",
  },
];

const EXERCISES = [
  {
    id: "achievement-box",
    title: "What's in Your Achievement Box?",
    subtitle: "Uncover what you believe your life must prove",
    icon: "◻",
    duration: "10 min",
    intro: "Most people have a hidden 'achievement box' — a specific existence they believe their life must live up to before it can be considered a success. Depression often begins when this goal feels out of reach. This exercise helps you find yours.",
    steps: [
      {
        question: "Complete this sentence honestly: 'My life will have been a success if I...'",
        hint: "Don't write what sounds good. Write what your gut actually believes. It might be about a career, a relationship, proving something to someone, or living a certain way.",
        placeholder: "My life will have been a success if I..."
      },
      {
        question: "Whose approval are you really seeking in order to feel your value is confirmed?",
        hint: "Is it a parent? Society? Someone who doubted you? Notice whether your value is actually sitting in someone else's hands — and what that means.",
        placeholder: "The person or thing whose approval I'm really seeking is..."
      },
      {
        question: "What do you believe will happen to your value if this goal is never achieved?",
        hint: "This is the part that sits deepest. The fear underneath is what needs to be understood — because understanding it is what begins to neutralise it — not by removing it, but by adding the accurate data that upgrades the belief producing it.",
        placeholder: "If I never achieve this, I believe I will be..."
      },
      {
        question: "Now consider: is this the only possible measure of a valuable life?",
        hint: "Think of people you genuinely admire or love. Is your achievement box the only reason they matter to you? What does that tell you?",
        placeholder: "What I notice when I question whether this is the only measure of value..."
      },
    ],
    closing: "Your value is not inside that box. It never was. Every day you exist, you are playing a role in other people's development — automatically, without needing to earn it. Life cannot go wrong for you. It can only develop you."
  },
  {
    id: "free-will-release",
    title: "Releasing Blame — Yours and Theirs",
    subtitle: "Understand why no one could have acted differently",
    icon: "◌",
    duration: "12 min",
    intro: "Anger, guilt, and regret all rest on the same belief: that someone — you or another person — could have simply chosen to act differently. This exercise walks you through why that belief, however convincing, is not accurate.",
    steps: [
      {
        question: "Think of something you deeply regret or feel guilty about. Describe it briefly.",
        hint: "Be honest but brief. You don't need to relive it — just name it clearly.",
        placeholder: "The thing I blame myself for is..."
      },
      {
        question: "At the moment you acted, what did you believe was the right or necessary thing to do?",
        hint: "Remember — you were acting from your belief system at that point in your development. You did what you believed you needed to do, for reasons that made sense to you then.",
        placeholder: "At that moment, I believed I had to / needed to / thought it was right to..."
      },
      {
        question: "What information or understanding would you have needed to act differently?",
        hint: "This is the key question. If you had genuinely needed different information to make a different decision, then you couldn't have simply 'chosen' differently. You would have needed to already know something you didn't yet know.",
        placeholder: "To have acted differently, I would have needed to already understand / believe / know..."
      },
      {
        question: "Apply the same thinking to someone who has hurt or angered you. What beliefs were governing their actions?",
        hint: "You don't have to excuse what they did. But can you see that they too were acting from their belief system — from their level of development at that moment? What information were they missing?",
        placeholder: "The belief or understanding they were acting from was probably..."
      },
    ],
    closing: "You could not have chosen to act any differently at that moment — because you were governed by the understanding you had at the time. Neither could they. This is not an excuse. It is the truth. And the truth is what sets people free from guilt, anger, and regret."
  },
  {
    id: "emotions-as-indicators",
    title: "Reading Your Emotions as Signals",
    subtitle: "Emotions are indicators, not truth",
    icon: "◎",
    duration: "8 min",
    intro: "Painful emotions are not signs that life is going wrong. They are signals that a particular belief you hold needs upgrading. This exercise helps you trace an emotion back to the belief underneath it — because that's where the real work happens.",
    steps: [
      {
        question: "What emotion are you experiencing most strongly right now?",
        hint: "Name it plainly — anger, sadness, anxiety, shame, hopelessness, jealousy, fear. Don't analyse it yet.",
        placeholder: "The emotion I'm feeling is..."
      },
      {
        question: "What does this emotion tell you is happening or about to happen?",
        hint: "Emotions always point to a conclusion your mind has reached. What has your mind decided about your situation, your value, or your future?",
        placeholder: "This feeling is telling me that..."
      },
      {
        question: "What belief is sitting underneath this conclusion?",
        hint: "Look for the 'if/then' structure: 'If this keeps happening, then I will...' or 'This means I am...' or 'This proves that life is...'",
        placeholder: "The underlying belief is..."
      },
      {
        question: "Is this belief an accurate account of reality — or is it measuring life by the Achievement Model?",
        hint: "Ask yourself: is this conclusion based on the idea that your life has gone wrong, that you are missing out, or that your value is decreasing? Or is it possible this situation is simply part of your development — data you needed to receive?",
        placeholder: "When I test this belief against the Wisdom Model, I notice..."
      },
    ],
    closing: "The emotion did its job — it flagged that a belief needs attention. As the accurate understanding replaces the incorrect belief, the emotion it was producing will change too. Not broken. In the learning phase."
  },
  {
    id: "self-versus-others",
    title: "The Line Between Self and Others",
    subtitle: "Understand and neutralise the conflict between helping yourself and helping others",
    icon: "◑",
    duration: "8 min",
    intro: "Many people feel torn between attending to their own needs and devoting themselves to others. This conflict can quietly fuel depression. This exercise reveals why the line between self and others is not what it appears to be.",
    steps: [
      {
        question: "Do you feel guilty when you focus on your own needs? Or do you feel guilty when you're not helping others enough? Describe the tension.",
        hint: "There's no wrong answer. Just notice which side of the tension you lean toward, and what that feels like.",
        placeholder: "The tension I feel between self and others is..."
      },
      {
        question: "When you help others, what is the belief driving it?",
        hint: "Is it obligation? Fear of what happens if you don't? Genuine care? Or perhaps a belief that your value comes from being useful to others? Be honest.",
        placeholder: "When I help others, I do it because I believe..."
      },
      {
        question: "When you attend to your own needs, what belief makes that feel wrong?",
        hint: "Notice the belief running underneath — is it that attending to your own needs means something is being taken from others, or that contributing to others first is what earns the right to receive?",
        placeholder: "It feels wrong to attend to my own needs because I believe..."
      },
      {
        question: "Consider this: every action you take — whether for yourself or others — is governed by what you believe matters most at that moment. You are always doing what you believe is right. How does that land?",
        hint: "There is no line between selfish and selfless — there is only what your belief system drives you toward. And by simply existing and going about your life, you are automatically contributing to other people's development.",
        placeholder: "When I consider that I'm always acting from my beliefs, and always playing a role in others' lives simply by existing, I notice..."
      },
    ],
    closing: "You are always receiving and always giving — simultaneously. The line between self and others does not exist. You cannot live for others at the expense of self, or for self at the expense of others. Both are the same process. You are valuable simply because you are here."
  },
  {
    id: "comfort-zone",
    title: "The Comfort Zone That Never Was",
    subtitle: "Understand why courage was never required",
    icon: "◈",
    duration: "8 min",
    intro: "The idea that you must 'step outside your comfort zone' to grow carries a hidden threat: that if you don't, your value and development are at risk. This exercise helps you see why that's not how development actually works.",
    steps: [
      {
        question: "Is there something in your life right now that you believe you 'should' be doing — something your mind keeps returning to as evidence that you are not measuring up?",
        hint: "Name it plainly. What is the thing your mind has decided you are falling short on?",
        placeholder: "The thing I feel I am not living up to is..."
      },
      {
        question: "What do you believe will happen to your value or your future if you never do it?",
        hint: "This is where the fear lives. Name it directly.",
        placeholder: "If I never do this, I believe..."
      },
      {
        question: "Now consider: every step you've ever taken in your life — including ones that felt terrifying — you took because your beliefs made it feel necessary. You weren't brave. You simply believed you had to. Can you see that?",
        hint: "Think of a time you did something hard. Your beliefs left you no other option you could live with. That was not courage — it was your belief system governing your response, as it always does.",
        placeholder: "When I think of a hard thing I did, I can see that I did it because I believed..."
      },
      {
        question: "If your development is forced upon you by life — not generated by you pushing yourself — what pressure does that remove?",
        hint: "Life brings what you need, when you need it, via the events it subjects you to. You are not responsible for generating your own development. What changes in how you assess your situation when you understand this is an accurate account of how life works?",
        placeholder: "If I genuinely understood that life brings my development to me, I would feel..."
      },
    ],
    closing: "You have never stepped outside your comfort zone. Every step you've taken was inside the zone of what your beliefs told you was necessary. And every experience life has brought you — including this moment — is developing you at exactly the rate it is meant to. Nothing is being missed."
  },
  {
    id: "anxiety-appreciation",
    title: "From Prevention to Appreciation",
    subtitle: "The anxiety shift that changes everything",
    icon: "◇",
    duration: "10 min",
    intro: "Anxiety is produced by two beliefs working together. The first is the belief that TOTAL control over the universe — over all events, people, and outcomes — is both possible and required. The second is the belief that TOTAL prevention of all unwanted events is both possible and the correct strategy. Control and prevention are normal parts of daily life — the brain acts on its beliefs and priorities, and this naturally includes trying to bring about desired outcomes and avoid undesired ones. The problem arises specifically when these cross into the demand for total control AND total prevention, both of which are impossible to achieve. The sympathetic nervous system fires because the failure to achieve either is perceived as a threat to being assessed negatively by others.",
    steps: [
      {
        question: "What event or situation is your anxiety currently trying to prevent?",
        hint: "Be specific. Anxiety always has a target — something it's convinced must not be allowed to happen.",
        placeholder: "My anxiety is trying to prevent..."
      },
      {
        question: "What does your anxiety believe will happen to your value or your life if that event occurs?",
        hint: "Underneath every anxiety is a belief that something will be proven about you, or that you will miss out on something essential.",
        placeholder: "If that event happens, I believe it will mean that I am / my life will..."
      },
      {
        question: "What could you actually learn or gain from the event you're trying to prevent — if it did occur?",
        hint: "This isn't about pretending you'd enjoy it. It's about recognising that every event — including unwanted ones — provides data. What might this one teach you?",
        placeholder: "If this event did happen, it might teach me or give me..."
      },
      {
        question: "What is one thing being received right now — today — that is genuinely worth appreciating?",
        hint: "Start small. A breath, a sound, a sensation, a connection. When attention is drawn toward what is being received rather than what must be prevented, the belief driving the anxiety begins to lose its hold — because the mind is now receiving data that contradicts it.",
        placeholder: "Something genuinely worth appreciating right now is..."
      },
    ],
    closing: "Control and prevention are normal parts of daily life — the brain acts on its beliefs and priorities, and this includes trying to bring about desired outcomes and avoid undesired ones. The problem is not control or prevention themselves. It is the belief that TOTAL control and TOTAL prevention are both possible and required. Because neither is achievable, the demand for them can never be satisfied. Understanding why no event can actually decrease your value, and why life cannot unfold incorrectly, is what removes the need for total control and total prevention — and with that, the anxiety."
  },
];

const MINDFULNESS = [
  {
    title: "Resting the Mind",
    duration: "5 min",
    icon: "□",
    desc: "Breathing — not to control the mind, but to give it a rest",
    reflection: "The mind's work is never done — and this is simply a time to give it some rest by using the conscious part of it to watch your breath.\n\nThoughts will continue to arise and pass — like clouds moving through the sky. All you need to do is watch them, the way you would watch clouds drifting past, rain falling, or the sun shining.\n\nWatch the nature of reality at work inside your mind. Watch the nature of life at work in your breathing — the body doing what it does, automatically, without any effort from you.\n\nWatch. Smile. Be grateful.\n\nAnd realise that your life is unfolding according to natural law — always right, and always exactly as it is meant to.",
    breathing: true,
  },
  {
    title: "Giving the Mind a Rest",
    duration: "10 min",
    icon: "◯",
    desc: "Sit, watch, and observe — curious and appreciative of what the mind does",
    reflection: "Sit comfortably. Your thoughts will continue — that is the brain doing exactly what it has evolved to do.\n\nDirect your attention to the breath moving in and out through your nostrils. Notice the sensation of air entering, and the sensation of it leaving. The brain will automatically register and process this — observe it doing so with curiosity. What an extraordinary organ, doing all of this automatically without any effort on your part.\n\nNow expand your attention to include the sensations in your body. The brain will immediately begin assessing and labelling what it finds — warmth, pressure, tension, ease. Let it. Watch it doing this automatically. You are not trying to change what it notices or stop it from noticing. Simply observe the process with interest.\n\nNow include the sounds around you. The brain will label them — that is what it does. Notice it doing so. Near sounds, distant sounds, expected and unexpected. Watch the mind registering each one, curious about how automatically and effortlessly it all happens.\n\nWhen a thought pulls your attention fully away, simply notice that it has happened — the brain has done what brains do — and bring your attention back to observing the breath, the sensations, the sounds.\n\nThis is the practice. Not emptying the mind or suspending its function. Simply watching this remarkable evolved organ at work, with appreciation for everything it does automatically and without effort.",
  },
  {
    title: "Receiving With Appreciation",
    duration: "8 min",
    icon: "◇",
    desc: "Sit, listen, observe — appreciating everything the mind does and everything life provides",
    reflection: "Sit comfortably. The mind will settle into what it does.\n\nBegin by appreciating your mind. It is working right now — assessing, labelling, registering, processing. This is not interference with your peace. This is your mind doing its extraordinary job, automatically and without effort on your part. Watch it working. Notice how it labels sounds, how it registers sensations, how thoughts arise and pass. This is the mind supporting your development — every observation it makes, every connection it forms, every piece of data it files away contributes to your growth. Appreciate it.\n\nNow bring your attention to the things in your life that you value — the people, the circumstances, the experiences that feel good. Simply receive them. Let them be present without needing to do anything with them.\n\nNow — and this is the deeper practice — bring to mind the things in your life you find difficult. The situations that are uncomfortable. The experiences you would not have chosen. The things you don't like.\n\nPractice receiving these too, with appreciation.\n\nNot because they feel good — but because every one of them is serving your development. Every difficult situation is providing data your understanding required. Every uncomfortable circumstance is developing a capability or an understanding that comfortable circumstances could not. Every person who helps expose where your beliefs are currently up to — so you can work on them and deepen your understanding of life — is contributing something to your wisdom that someone who only ever reflected your existing beliefs back to you could never offer.\n\nEven when beliefs are interpreting what is unfolding as hard or easy, welcome or unwelcome — development never stops. Education about life keeps moving forward regardless. That is something to deeply appreciate.\n\nThe mind continues doing what it does — observing, assessing, processing. Watch it. Appreciate it. The remarkable, tireless, extraordinary instrument of development that it is.",
  },
  {
    title: "Sitting Without an Agenda",
    duration: "10 min",
    icon: "♡",
    desc: "No goal, no outcome required — rest is the only purpose",
    reflection: "There is nothing this needs to produce. No insight is required. No realisation needs to emerge. No particular state needs to be reached. This is simply the mental faculty being given time where it does not need to perform, achieve, fix, or conclude anything. The brain will still be active — it always is. But right now it is not being asked to do anything with that activity. This is what rest for the mind looks like. It requires nothing from you.",
  },
];

const LEARN_CONTENT = [
  {
    title: "1. The Foundation — 'If You Are Good, You\'ll Get'",
    category: "Foundation",
    duration: "7 min",
    summary: "Before anything else can be understood, this needs to be seen clearly. Society is built on a single philosophy that drives almost all psychological stress — and most people have never consciously examined it.",
    content: "Society is built upon a foundation philosophy. It operates everywhere, every day, in almost every interaction. It was installed through parents, schools, religion, and culture — and most people are running it without knowing it exists.\n\nThe philosophy is: IF YOU ARE GOOD — YOU WILL GET.\n\nAt home: 'If you are good — you\'ll get a present.'\nAt school: 'If you are good — you\'ll get a prize.'\nAt work: 'If you are good — you\'ll get a promotion.'\n\nOn the surface this sounds reasonable. But open it up further.\n\n'If you are good — you\'ll get' does not only have people considering what they might receive. It also declares the possibility of MISSING OUT — and informs people that they need to LIVE UP TO A PARTICULAR STANDARD in order to not miss out, and that they need to gain the APPROVAL of whoever provides their necessities, by showing they are WORTHY of receiving.\n\nSpread out, the logic runs like this:\n\nAchieve something → that proves you have something to offer → that shows you have been a worthwhile investment → that earns approval → that secures the necessities for development and survival.\n\nAnd in reverse, the fear runs like this:\n\nIf I miss out on approval → I have not been a worthwhile investment → I have nothing to offer → I have not achieved what I needed to → I will miss out on my necessities.\n\nAt the base of every form of psychological stress, this is what is always found: the fear of missing out on what is needed for development and survival. Not missing out on luxuries — missing out on love, belonging, security, and a place in the world.\n\nThis philosophy is so deeply embedded in people\'s subconscious that most people are living by it without ever being consciously aware of it. It governs how they interpret every event, every relationship, every outcome. It is the water in which all psychological stress swims.\n\nEverything else in this course builds from here.",
  },
  {
    title: "2. Events vs Thoughts — What Is Actually Causing the Stress",
    category: "Foundation",
    duration: "6 min",
    summary: "Two completely different opinions exist on what causes psychological stress and what cures it. Only one of them is correct — and understanding why determines everything about whether help actually helps.",
    content: "There are two completely different opinions on the cause and cure of psychological stress.\n\nThe first holds that psychological stress is the result of poor decision-making about which path of events to travel. The solution: better decision-making skills, better choices, better circumstances, better outcomes.\n\nThe second holds that psychological stress is the result of particular thoughts about life\'s events. The solution: a better understanding of the events encountered.\n\nEvents versus thoughts. Which path of events — or which understanding of events?\n\nMost personal development, spiritual development, and counselling assistance currently available focuses on helping people to improve their circumstances. This is events-based help. And it sounds reasonable — until you understand that it is actually reinforcing the cause of psychological stress rather than addressing it.\n\nEvents-based help reinforces the precise beliefs already responsible for the stress:\n— The belief that life is going wrong\n— The belief that the person needs to prove they are in control\n— The belief that they might be missing out on their necessities\n— The belief that their value is at risk\n\nWhen the event improves, the person feels temporarily better. But then life continues to unfold the way life does — and the same beliefs are still running. The relief is short-lived.\n\nThoughts-based education is entirely different. It addresses the conclusions a person has reached about the events they encounter. Conclusions are beliefs. And it is specific incorrect beliefs — not events — that produce all psychological stress.\n\nThe cause of psychological stress is not addressed by better decision-making skills or better events. It is addressed by gaining a greater understanding of the events encountered. A greater understanding of reality.",
  },
  {
    title: "3. What a Belief Actually Is",
    category: "Foundation",
    duration: "6 min",
    summary: "The word 'beliefs' is used constantly and understood rarely. What beliefs actually are — how they form, how they work, and why they govern everything — is the essential foundation for all that follows.",
    content: "A belief is an understanding a person holds. This understanding consists of data that has enabled its construction — and it is the logical construction of that data that makes the person consider the understanding accurate.\n\nThis does not mean the belief is accurate. It means the person currently believes it is accurate, based on the data they have so far received. Beliefs that lack sufficient data to make them accurate will be inaccurate. But the person holding them will not experience them as inaccurate — they will experience them as simply how things are.\n\nEvery person is always acting on their best current understanding of reality. They are not choosing incorrect beliefs. They are holding the beliefs that the data they have received has produced.\n\nA person does not have one belief. Every person has a belief system — a structure of many beliefs, all connected, all in a priority format. This priority format is why a person places more importance on one factor over another. When a person cannot identify why they responded in a particular way, it is because the priority system was running at a level they were not consciously tracking.\n\nMany people experience enormous stress trying to understand why they acted contrary to what they consciously believed they should do. The answer is always that a different belief — one they were not consciously aware of — held a higher priority at that moment. This is not self-sabotage. Self-sabotage is impossible. There is always a governing belief producing every response.\n\nBeliefs are not chosen. They are formed from incoming data from the environment. They cannot be changed by deciding to change them. They change when new data provides sufficient reasoning to alter the existing understanding.",
  },
  {
    title: "4. The Achievement Model — How It Was Built",
    category: "Foundation",
    duration: "8 min",
    summary: "Society teaches a specific method for measuring personal development — and it is producing the epidemic of psychological stress visible everywhere. Understanding it precisely is the first step to moving beyond it.",
    content: "People who are psychologically stressed are focused on the events taking place in their life. Why are they so concerned about events?\n\nBecause they have been educated to believe that a person\'s life can go wrong. That development is measured by whether the person managed to create a particular outcome. When asked \'how is your life going?\' — the question is unconsciously heard as: \'Have you proven you are in control? Are you personally developed? Are you succeeding?\'\n\nThis method of measuring personal development is the Achievement Model.\n\nThe Achievement Model connects personal development to personal control over how life unfolds. It declares that a person\'s value and development are proven by achieving goals, controlling circumstances, and demonstrating capability. Under this model:\n\n— A good result confirms worth\n— A poor result threatens it\n— Approval from the right people feels like survival\n— Failure feels like evidence of personal inadequacy\n— The future success that would prove worth is always one more achievement away\n\nThe particular existence a person believes must be achieved for their life to be considered a success — this is their achievement box. It represents the way life must go before they will consider themselves valuable and worthy of their necessities.\n\nThe Achievement Model is the direct result of the \'If you are good — you\'ll get\' foundation philosophy. It has people measuring their value by their ability to display control over how life unfolds — which is precisely the same as declaring that a person needs to prove control over the universe before considering their existence worthwhile.\n\nMost people have not had this connection pointed out to them so directly. They are surprised when they see it. And more surprised when they begin to recognise how much of their daily experience is governed by it.",
  },
  {
    title: "5. The Wisdom Model — The Correct Measure of Development",
    category: "Foundation",
    duration: "7 min",
    summary: "There is a different way of understanding personal development — one that is accurate, that accounts for every person\'s value, and that removes the psychological pressure the Achievement Model generates.",
    content: "When attempting to find a correct way to measure personal development, begin with an accurate phrase: \'We grow from our life experiences.\'\n\nBut what does this actually mean?\n\nA life experience is nothing more than incoming data from the environment. The phrase \'we grow from our life experiences\' therefore actually means: we grow from our environment. Life develops us.\n\nThis is the opposite to what most personal development teaching claims. Most teaching has people developing themselves — going within, accessing inner knowing, choosing to grow. But development is the addition of components to an existing structure. It cannot mean reconnecting to what was supposedly already there.\n\nLife develops us. It develops our wisdom.\n\nWisdom is not knowing how to make life conform to personal agendas. This is simply the Achievement Model with a spiritual label. Wisdom is an accurate account of reality — an understanding of what is actually taking place, of how the system of cause and effect works, of the developmental process itself.\n\nThe Wisdom Model measures personal development by the level of understanding a person has received in reference to what is actually taking place in life. It has nothing to do with control over life — because no person has control over life. We are all by-products of life.\n\nUnder the Wisdom Model, goals still matter enormously — but for a completely different reason. Goals produce active interaction with the environment, which results in life experiences, which produce development. The goal is not the point. The development encountered on the way is the point.\n\nThis means:\n— Every life experience provides development — not just the ones that go as desired\n— A goal not achieved still served its purpose\n— There is no wrong path — every path provides the development it was always going to provide\n\nThe Wisdom Model cancels the psychological devastation of the Achievement Model. It does not remove ambition. It removes the pressure of having worth attached to outcomes.",
  },
  {
    title: "6. Free Will — The Most Dangerous Contradiction",
    category: "Core Truths",
    duration: "10 min",
    summary: "At the core of all psychological stress — all anger, guilt, regret, fear, and conflict — there is one concept. Once this is seen clearly, everything else begins to make sense.",
    content: "At the core of all psychological stress, all anger, all guilt, all regret, all suicidal ideation, every war — the concept of free will is always found.\n\nFree will, as commonly understood, declares that a person could have simply chosen to act differently. That when someone harmed you, they chose to. That when you made a mistake, you chose to.\n\nSee if you can find the contradiction: \'You have free will. You had a choice. You could have chosen differently.\'\n\nThis appears to declare that the mind is not governed by anything. But look at what it means in practice: \'You could have chosen better/correctly.\' For something to be declared correct, there must be reasons. A reasoned assessment of what is better. So the statement actually means: \'For reasons, you should have picked correctly.\' Which is declaring that decisions are based on reasonings — that the thought process is governed.\n\nFree will contradicts itself. It cannot exist.\n\nLet\'s test it. Try to choose to believe something you currently have no reason to believe. Right now — choose to believe the sky is green. You cannot. A belief requires data to form it. Without the data, the belief cannot exist.\n\nTry another. Think of something you currently believe you would not do under any circumstances. Now choose to do it. You cannot — because to do that action, you would first need to believe it was warranted. The brain works by reasonings. Always.\n\nThis means: every person, at every moment, acts from the beliefs and priorities they hold at that specific point in their development. Given those beliefs, they could not have acted differently. Not because they are weak — because of the law of cause and effect that governs everything in the universe, including the human mind.\n\nWhen this is genuinely understood, resentment, guilt, and blame begin to lose their hold — not as a choice to forgive, but as the natural consequence of new data upgrading the belief that was producing them. The old belief remains — new understanding is added alongside it, and the priority shifts.\n\nThere is no evil — only people at their current level of development. There is no self-sabotage — only beliefs governing responses in ways the person has not yet consciously identified.",
  },
  {
    title: "7. How Beliefs Actually Change",
    category: "Core Truths",
    duration: "6 min",
    summary: "Most people expect the wrong thing when changing beliefs — and conclude the work has failed when it is actually working. Understanding the process accurately is what makes it possible to continue.",
    content: "One of the most critical pieces of education a person can receive — and one of the most consistently absent from conventional help — is what to expect when beliefs change.\n\nMany people are taught that once a belief changes, the old thought will no longer arise. They move from therapist to therapist seeking the one that will finally stop old thoughts from surfacing. When no approach delivers this, they conclude they are beyond help. This experience is built on a misunderstanding of how the brain works.\n\nThe brain works via neurons. When a belief changes, new neurons form alongside the existing ones. The old neurons do not disappear. Old thoughts still surface in conscious awareness after new beliefs have been formed. This is not failure. It is the normal, expected functioning of the brain.\n\nWhat changes is not whether the old thought arises. What changes is what happens when it does.\n\nThe old thought arises. The new understanding is applied to it. The accurate reasoning is brought to bear. The old thought loses its emotional force — not because it was stopped, but because the accurate understanding provides a more complete account of reality.\n\nThis is the practice. Not the prevention of old thoughts — the application of accurate understanding when old thoughts arise. Every time this happens, the new neuronal pathway strengthens.\n\nBeliefs change when new data provides sufficient reasoning to alter the existing understanding. Not through effort or willpower — through the receipt of accurate information.",
  },
  {
    title: "8. Self-Worth — Why Every Person Is Valuable",
    category: "Self-Worth",
    duration: "8 min",
    summary: "Personal value is the most misunderstood concept in psychology. It is measured incorrectly by almost everyone — and this incorrect measurement is the direct cause of depression, anxiety, and suicidal ideation.",
    content: "What does the word \'value\' mean?\n\nConsider a pen. Is the pen\'s value its value to itself? Or is the pen\'s value the role it plays in something else\'s existence? The pen\'s value is always in reference to the role it plays in a particular process — contributing to the drawing of a picture, the writing of a letter.\n\nThe value of any item is never its value to itself. It is always the role that item plays in a process outside of itself. This applies to every human being.\n\nA person\'s value is not their value to their own development. It is the role they play in other people\'s development. And because we all grow from our environment — because life develops us through the data we receive from the people and events around us — every person is automatically and constantly contributing to the development of every other person they interact with.\n\nNot because of what they achieve. Because they are part of the system.\n\nTo make up a system, all the components are required. Every component is in the system for a reason. If a person is alive and in the system of life, they are meant to be in the system. Their presence is not accidental. It is structural.\n\nImagine a picture of the earth with every person on it visible. Try to circle one person who is not meant to be there. You cannot do it. Because if they are on this earth, they are meant to be here — which means they have purpose.\n\nA person is valuable regardless of whether they believe they are valuable. The belief and the fact are two separate things. The earth does not become flat because someone believes it is. A person\'s worth does not disappear because they believe it has.\n\nThe feeling of worthiness follows the accurate understanding — it does not precede it. The understanding comes first. The feeling follows.",
  },
  {
    title: "9. Suicide — Its Real Cause and Real Cure",
    category: "Self-Worth",
    duration: "7 min",
    summary: "Suicide is consistently misunderstood. It is not a desire to end existence — and understanding what it actually is points directly to the only thing that genuinely prevents it.",
    content: "When people drop to the level of despair where they consider suicide as the only option, they say that life is too hard.\n\nBut it is not life that is too hard. It is the pressure they are under because of what they believe life requires them to prove.\n\nConsider a footballer. Playing football is not inherently hard — unless the footballer believes they must prove their side can always win. The pressure is not in the activity of playing. It is in the belief that a particular outcome must be achieved to prove worth.\n\nLife works the same way. The activity of living is not the pressure. The pressure comes from believing that a particular outcome must be produced in order to prove value and secure necessities.\n\nSuicide is not an attempt to end existence. It is an attempt to escape the pressure being placed on perceived value — to find a place where the pressure stops. The person does not want to die. They want the belief that their value is under permanent threat to end.\n\nThis is always connected to the Achievement Model. When a person concludes that the particular achievement that would prove their life a success is no longer attainable — there is no longer any point. Life under those conditions feels impossible, not because the activities of life are impossible, but because the demand attached to those activities is impossible.\n\nThe accurate understanding that resolves this is not encouragement or reassurance. It is education in why value was never attached to any outcome. Every person who lives by the Wisdom Model — who understands that their value is the automatic role they play in the system of life — survives the situations that would otherwise produce suicidal thinking. Not because their circumstances are better. Because the belief producing the unbearable pressure has been replaced with an accurate account of reality.",
  },
  {
    title: "10. The Two Camps — 'You Knew' vs 'You Are Here Learning'",
    category: "Core Truths",
    duration: "6 min",
    summary: "Throughout history, two completely opposed philosophies have existed. Every person, every institution, every approach to psychological health belongs to one of them — whether they know it or not.",
    content: "As far back as literature can be traced, two camps have always existed.\n\nTHE 'YOU KNEW' CAMP\nThis camp holds that decision-making rests on whether a person is exercising free will and choosing correctly — or failing to exercise free will and choosing incorrectly. It teaches that people have the power of choice and are either worthy of receiving their necessities (if they choose correctly) or not (if they choose wrongly). Perfection is expected. The answers are supposedly already within. People simply need to access what they already know. Failure is a moral category — the result of not choosing to do better.\n\nTHE 'YOU ARE HERE LEARNING' CAMP\nThis camp holds that decision-making as conventionally understood does not exist — because every response is governed by beliefs in a priority format. People can only respond the way their current belief system produces.\n\nThis camp explains that because people could not have acted differently given their beliefs, everyone is always having the experience they are meant to have. Psychological stress is the result of incorrect beliefs about what is taking place — not a journey down a wrong path.\n\nThis camp holds that no one has all the answers, that going within to reconnect to what was supposedly already known is a misunderstanding of how development works, and that there is no evil — only people at their current level of development, requiring further assistance in understanding life.\n\nAs people grow in understanding, they move from the \'You knew\' camp into the \'You are here learning\' camp.\n\nEvery approach to mental health, every relationship pattern, every response to conflict, every form of self-judgment — all of it traces back to which camp is operating. The entire methodology of this course is built on the understandings of the second camp.",
  },
  {
    title: "Depression — The Complete Picture",
    category: "Deep Dives",
    duration: "10 min",
    summary: "Depression is not a brain malfunction. It is a specific conclusion the mind has reached — and because it is a conclusion, it can be identified, examined, and replaced with an accurate understanding.",
    content: "Depression is almost universally framed as a brain disease — a chemical imbalance that must be medicated. This framing is incomplete and in many cases actively harmful.\n\nThe chemical change in the brain is real. But it does not come first. It follows a specific conclusion that the mind has reached.\n\nDepression is the conclusion that there is no point having goals — that the particular existence the mind believes would prove life a success is no longer achievable.\n\nThis conclusion is always reached through the \'If you are good — you will get\' philosophy. The mind identifies a specific achievement, status, relationship, or life condition that would prove its worth — and then concludes this is no longer reachable.\n\nAt that point, under the Achievement Model, there is no longer any point. The chemical change follows this conclusion.\n\nThis is why antidepressants address the symptom without addressing the cause. When the medication is stopped, the underlying conclusion is still running. The depression returns.\n\nThe cure is education. Specifically: education in why the Achievement Model is not an accurate account of how value is measured. Education in why it is always worthwhile having goals — not because goals prove worth when achieved, but because goals keep a person actively engaged with the experiences that develop their understanding. Education in why the specific goal that felt irreplaceable can always be replaced — because the purpose of the goal was never to achieve it, but to generate the experiences along the way.\n\nWhen the mind genuinely understands that its value was never inside the goal, and that it is always worthwhile engaging with life regardless of outcomes, the conclusion that produced the depression no longer holds. The chemical change reverses. The depression lifts.",
  },
  {
    title: "Anxiety — The Complete Picture",
    category: "Deep Dives",
    duration: "8 min",
    summary: "Anxiety is not caused by stress, pressure, or difficult circumstances. It is produced by two specific beliefs — and understanding them precisely is what removes anxiety permanently.",
    content: "Anxiety is produced by two specific beliefs working together.\n\nThe first is the belief that TOTAL control over the universe — over all events, other people, and all outcomes — is both possible and required. The second is the belief that TOTAL prevention of all unwanted events is both possible and the correct strategy.\n\nControl and prevention are normal parts of daily life. The problem arises when these cross into the demand for total control and total prevention — both of which are impossible. The sympathetic nervous system fires because the failure to achieve total control or total prevention is perceived as a threat to being assessed as worthless, useless, or hopeless by others.\n\nAnd why does that assessment feel so threatening? Because of the \'If you are good — you will get\' philosophy. If assessed as not in control, as failing, as not coping — the person risks missing out on necessities. Love, belonging, security, opportunity.\n\nThe anxiety is never about the event itself. It is always about what failing to control or prevent that event proves about value in the eyes of others.\n\nThis is why breathing exercises and distraction techniques provide only temporary relief. They address the activated nervous system without touching the beliefs producing it.\n\nWhat permanently resolves anxiety is understanding two things. First: total control and total prevention are not available. Accepting this genuinely removes the impossible demand generating the anxiety. Second: no event decreases value. When this is genuinely understood, the perceived threat disappears. The nervous system stops firing because there is nothing to protect against.",
  },
  {
    title: "The Mind-Body Connection",
    category: "Deep Dives",
    duration: "7 min",
    summary: "Physical health conditions are not random. Each one corresponds precisely to a specific psychological concern about a specific ability in life. The body is a microcosm of the macrocosm of life.",
    content: "The actual mechanism of mind-body connection is more precise than the standard medical understanding. Neurons involved in the thought process relating to a specific psychological concern emit energy fields at specific frequencies. Those energy fields directly affect the cellular structure of the organ that corresponds to the ability being thought about. Different concerns affect different organs because different thoughts emit different frequencies.\n\nEvery physical structure in the body performs a specific physiological function. That function directly mirrors a specific ability in life. When a person holds a sustained psychological concern about a particular ability in life, the corresponding physical structure is affected.\n\nThe body is a microcosm of the macrocosm of life. Place a map of the human body beside a map of a business — the abilities required for development and survival are identical at both levels.\n\nThe cardiovascular system distributes resources to all areas — in life, this corresponds to the ability to ensure all areas of life receive what they need for development. The digestive system receives, processes, and extracts value from what comes in — in life, this corresponds to the ability to receive and extract development from life experiences.\n\nThis means every health condition is a diagnostic tool. The condition identifies the organ. The organ identifies the ability. The ability identifies the specific psychological concern that needs to be addressed.\n\nCritically — the concern does not have to be about the person\'s own life. It is always the person\'s own concern — their own mind\'s conclusion — that affects their own body.\n\nEvery health condition is signalling an incorrect belief that needs upgrading. Not a malfunction. Not bad luck. A precise message from the body about which belief needs attention.",
  },
  ,
  {
    title: "11. Self vs Others — Am I Allowed to Attend to My Own Life?",
    category: "Foundation",
    duration: "6 min",
    summary: "Many people carry guilt about attending to their own life rather than helping others. This guilt is built on a misunderstanding — and once seen accurately, both the guilt and the conflict are neutralised by the accurate understanding that replaces the incorrect belief producing them.",
    content: "Society educates people to believe there is a line drawn between self and other people when it comes to attending to necessities. Are we supposed to put our needs first, or put other people\'s needs first?\n\nThis question is easy to answer when you understand how the brain works — and extremely confusing when you believe in free will.\n\nWhen a person decides to help someone else, that decision comes from their belief system of priorities. There is not one action taken in an entire lifetime that does not come from beliefs and the resulting priorities. This applies equally to acts that appear selfless and acts that appear self-serving.\n\nHere is the accurate account: whenever going about what is generally classified as working on one\'s own life, a person is still automatically playing a role in helping other people with their development. Simply by existing and responding to life, data is being supplied to other people\'s minds — data that is contributing to their growth in understanding reality.\n\nWe are always the experience others were meant to have. We are food for thought for each other. Every interaction, every response, every way of going about life — all of it is automatically contributing to other people\'s development, whether that was the intention or not.\n\nThis means the question \'am I supposed to help others or attend to my own life?\' rests on a false premise — that these are separate activities that must be chosen between. They are not. As you attend to your own life, you are automatically also attending to others\' development. The line between self and others does not exist in the way it appears to.\n\nThe guilt many people carry about this is directly connected to the \'If you are good — you\'ll get\' philosophy: the belief that worth must be proven through service to others before receiving is justified. Understanding that contribution is automatic removes the foundation of that guilt entirely.",
  },
  {
    title: "12. Jealousy — Why It Keeps You Stuck",
    category: "Core Truths",
    duration: "6 min",
    summary: "Jealousy is one of the most common companions of depression — and one of the least understood. It is not a character flaw. It is the logical result of a specific incorrect belief.",
    content: "Jealousy requires two things to operate. First, comparing one\'s own life circumstances to other people\'s. Second, believing that you could have been them — that your circumstances could now be different if different decisions had been made.\n\nIf free will exists, both of these are reasonable. If it does not, neither is.\n\nMost people with depression spend significant time wishing they were someone else, with someone else\'s mind and circumstances. What many of them are not aware of is how directly this fuels the depression.\n\nThe underlying pain in jealousy is not really about the other person\'s circumstances. It is about a sense of decreasing personal value — the belief that the other person\'s life is proving them to be a success while one\'s own circumstances are proving failure. It is the Achievement Model operating through comparison.\n\nFocusing on other people\'s lives and what they have does not allow focus on finding one\'s own personal value. And personal value can only be found by looking at one\'s own circumstances and the role they are playing in the lives of others.\n\nThe jealousy will only subside when two things are understood. First: it was actually impossible to be standing in someone else\'s shoes. Life could not have unfolded differently, because every person was always acting from their beliefs and priorities at each moment — the only way they could. There was never a fork in the road where a different decision was freely available.\n\nSecond: we are always receiving from seeing what others have in their lives. Every person and every circumstance encountered is providing data that contributes to development. The circumstances being experienced right now — however they compare to someone else\'s — are precisely the circumstances providing the development currently required.\n\nNothing is missing. Nothing has gone to the wrong person. The comparison was always between two people both doing exactly what they were going to do, both receiving exactly what they needed to receive.",
  },
  {
    title: "13. Effort vs Outcome — The Secret to Staying Involved in Life",
    category: "Self-Worth",
    duration: "7 min",
    summary: "This is one of the most practically important lessons in this entire course. It is the specific shift that keeps people involved in life when the Achievement Model would otherwise produce despair.",
    content: "Unbeknown to most people, every person on this planet, with every breath and action taken, is spending energy and putting effort into making life conform to personal desires.\n\nIt is this activity — this effort — that has people performing the valuable role of influencing other people and enabling their development. It is people\'s activity that defines them as valuable. Not whether they accomplished a goal.\n\nWhen measuring development by the Achievement Model, a person attaches their value to the results of any effort made. Results are deemed to show proof of value only if they match the original intent. Any life situation that does not conform to the desired outcome is perceived as a decrease in personal value.\n\nIf life continues to refuse to unfold into the particular events a person has been working toward, this person will continue to believe their value is decreasing and that life is becoming a greater personal threat.\n\nThis is the precise path that leads to suicidal thinking: the belief that any chance of restoring personal value is near impossible, and that there is no longer any point in engaging.\n\nThe shift that changes this is moving personal value from \'results\' to \'effort.\' Being more proud of having a go than of achieving a particular outcome.\n\nThis is not a consolation prize. It is an accurate account of what actually makes a person valuable. Every effort put into working on life is automatically contributing something to the system. The contribution is in the effort and the activity — not in whether the specific desired outcome was produced.\n\nAt the point where either suicide or \'being more proud of having a go\' appear to be the only options — this understanding becomes literally life-saving. And it is much better received before a person reaches that point.\n\nHaving a go is something every person is doing every second of every day with every action taken. Understanding why that is valuable represents genuine development. Such development is received from life — not from achieving control over life.",
  },
  {
    title: "14. The Secret to Happiness",
    category: "Foundation",
    duration: "6 min",
    summary: "Most people are pursuing happiness as a goal. This is precisely why it remains out of reach. What happiness actually is — and what produces it consistently — is entirely different from what is commonly believed.",
    content: "Ask different people the purpose of life. More often than not the answer received is \'happiness\'. The purpose of life is to find and do what makes you happy.\n\nBut happiness is an emotion. And emotions are triggered — they are not achieved. So what triggers happiness?\n\nHappiness is triggered when the belief about what is taking place matches the belief about what needs to be taking place. The event being encountered is assessed — through the belief system — as being the right event. And the assessment of rightness produces the feeling of happiness.\n\nThis means continuous happiness is only possible when beliefs about what needs to happen actually match what life dictates will happen. And what life dictates is reality — everything that unfolds as the result of all the factors that played a role in producing it.\n\nContinuous happiness, therefore, is not produced by gaining control over which events occur. It is produced by holding an accurate account of what is actually taking place — understanding why the events unfolding are the right events, why they are providing development, why life is not going wrong.\n\nWhen life fails to conform to expectations, and happiness disappears — this is not evidence that something has gone wrong. It is evidence that the belief about what needs to happen does not match the reality of what is happening. The accurate account of reality is the ingredient that is missing.\n\nThis is why wisdom is the secret to happiness. Wisdom — an accurate account of reality — allows every experience, including the ones that were not preferred, to be understood as the experience that was meant to be taking place. When that understanding is present, the happiness that follows is not dependent on circumstances conforming to desires. It is dependent on understanding why the circumstances are always exactly as they are meant to be.",
  },
  {
    title: "15. Anger, Guilt, and Regret — What They Actually Are",
    category: "Core Truths",
    duration: "7 min",
    summary: "Anger, guilt, and regret are almost universally misunderstood — both in their cause and in what they are trying to signal. Understanding them accurately is what allows them to be neutralised — the incorrect belief producing them is upgraded, not removed.",
    content: "The most common understanding of anger is that it makes people respond to injustice — that without anger, people would not address situations where harm is being done. But consider: a person with deep understanding of life does not feel angry when treated poorly, and yet still responds to the situation in order to help the person who acted poorly to learn. Meanwhile, a person with less understanding feels angry and responds to gain revenge.\n\nIf anger performed the role of making people respond to injustice, the first person could not have responded. But they did.\n\nAnger does not produce the response to injustice. Beliefs produce the response. What anger does is signal that a specific incorrect belief is running — the belief that someone could have chosen to act differently.\n\nAnger is triggered when a person believes another person could have chosen to act differently or made a different decision. Anger loses its hold when the person receives the data that upgrades the free will belief — understanding that free will does not exist and that the other person could not have acted differently given their beliefs at that moment.\n\nGuilt operates identically, but directed inward. It is the result of believing that the person themselves could have chosen to act differently — that a better option was freely available and not taken. Guilt is not helping anyone act better in the future. It is letting the person know that they need help understanding that free will does not exist and that they acted from the only beliefs they held at that time.\n\nRegret is the sustained version of this — the ongoing pain of believing that circumstances could now be different if a different decision had been made at some point in the past. Regret only changes when a person is educated to understand why a different decision could not have been made, and hence why life has not unfolded down an incorrect path.\n\nNone of these emotions — anger, guilt, or regret — are performing the role of improving future behaviour. All three are indicators pointing to the same incorrect belief: that free will exists and people could simply have chosen differently. All three dissolve when that belief is replaced with the accurate account of how the mind actually works.",
  },
  {
    title: "16. Emotions — Their Real Role",
    category: "Foundation",
    duration: "5 min",
    summary: "Emotions are the most focused-upon component of the psychological realm — and the most misunderstood. They are not the cause of psychological stress. They are not what governs health conditions. They are indicators.",
    content: "When seeking professional help or reading about psychological wellbeing, most of the attention is directed at emotions. But emotions do not govern how a person perceives or responds to any situation. Emotions are also not what governs which physiological dysfunction takes place as a result of psychological stress.\n\nThe only psychological factor that governs all of these things is beliefs.\n\nIf emotions governed how people acted, people who were angry would all act the same way. They do not. When angry, different people act in entirely different ways — all governed by what they believe should be done when angry. The emotion is the same. The beliefs governing the response are different. Beliefs are governing the response, not the emotion.\n\nEmotions cannot precede beliefs, because before an emotion can be triggered, the event must first be assessed. That assessment is performed by the belief system. The conclusion — the assessment of what is taking place — is always a belief. The emotion follows the belief.\n\nEmotions exist in the brain — in the limbic system. They do not exist in other organs of the body. They cannot travel. The idea that emotions are stored in organs is a misunderstanding of how the mind-body connection works. What physiological dysfunction in an organ actually reflects is the beliefs the brain holds — not the emotions it produces.\n\nSo what is the role of emotions?\n\nEmotions are the psychological realm\'s method of letting a person know how they are going in reference to an accurate assessment of their environment. They are connected to beliefs. Particular beliefs trigger particular emotions.\n\nWhen a child is emotionally distressed, the correct response is to identify what the child believes is happening and why — and then provide the data that upgrades the belief to an accurate understanding. When this is done, the emotional state improves. This is belief system work — not emotional management.\n\nEmotions are indicators. They flag which beliefs need attention. They are not the problem — they are the signal pointing to the belief that is the problem.",
  },
  {
    title: "17. Needs vs Desires — What Do We Actually Require?",
    category: "Foundation",
    duration: "7 min",
    summary: "Many people are in psychological crisis over things they believe they need but do not have. Understanding the difference between what is genuinely needed and what is desired changes the entire relationship with what is missing.",
    content: "People will claim they have needs and cannot live without receiving them. And in one sense, they are right — they do have needs. But the question is whether what they are describing as needs are actually needs, or whether they are desires that feel like needs.\n\nWhat correctly defines a need? Consider a boat. What does it need? Everything required to keep it afloat and in the condition that enables it to stay afloat and carry people safely to the next destination.\n\nWhat might people on the boat desire? They might desire the boat to travel faster. But this is only a need if they must travel faster in order to stay alive.\n\nA genuine need is any factor that enables survival long enough to encounter the experiences that provide development. Desires are factors that stimulate mental and physical activity and give people reason to engage with life. Both serve a purpose — but they are different things.\n\nDesires can feel exactly like needs because of the \'If you are good — you\'ll get\' philosophy. People have been educated to believe they must achieve the circumstances they desire in order to prove valuable enough to receive necessities. The desire consequently feels like a survival requirement. The fear of not receiving it feels like the fear of dying.\n\nBefore a person has received sufficient understanding that life is developing them, desires are what keep them engaged with life. After receiving that understanding, the appreciation of what is actually being received keeps them engaged even when specific desires are not fulfilled.\n\nA person receiving food, water, air, exercise, warmth, and life experiences is receiving everything they need. The belief that something essential is missing when desires are not met is the belief that needs examining — not the circumstances.\n\nIt is okay to pursue desires. It is valuable to have them. What is not sustainable is believing that survival depends on achieving them. Understanding the difference between what is genuinely needed and what is desired is one of the most practically stabilising understandings a person can receive.",
  }
];


const INITIAL_MESSAGES = [
  {
    role: "assistant",
    content: "Welcome. I'm here to help you get a clearer, more accurate understanding of what's going on for you — because that's what actually helps.\n\nTo do that well, I'll need to understand where you're at. Tell me what's on your mind.",
  },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [aiFollowThrough, setAiFollowThrough] = useState("");
  const [followThroughLoading, setFollowThroughLoading] = useState(false);
  const [moodNote, setMoodNote] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [journalPromptIdx, setJournalPromptIdx] = useState(0);
  const [savedEntries, setSavedEntries] = useState([]);
  const [beliefStep, setBeliefStep] = useState(0);
  const [beliefAnswers, setBeliefAnswers] = useState(["", "", "", "", ""]);
  const [beliefComplete, setBeliefComplete] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);
  const [beliefTab, setBeliefTab] = useState("exercises");
  const [activeEducationExercise, setActiveEducationExercise] = useState(null);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState([]);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [activeLesson, setActiveLesson] = useState(null);
  const [learnFilter, setLearnFilter] = useState("All");
  const [breathCount, setBreathCount] = useState(4);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (activeExercise?.title === "Box Breathing") {
      const phases = [
        { phase: "inhale", duration: 4 },
        { phase: "hold", duration: 4 },
        { phase: "exhale", duration: 4 },
        { phase: "hold", duration: 4 },
      ];
      let phaseIdx = 0;
      let count = 4;
      const interval = setInterval(() => {
        count--;
        setBreathCount(count);
        if (count === 0) {
          phaseIdx = (phaseIdx + 1) % phases.length;
          count = phases[phaseIdx].duration;
          setBreathPhase(phases[phaseIdx].phase);
          setBreathCount(count);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeExercise]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg = { role: "user", content: inputText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are the AI support guide for "Jay's New Way: Truth Integration" — a mental health app built on the life education methodology of Jay, a Life Education Specialist with 25+ years of experience. Your role is that of a teacher — not a therapist, not a facilitator, not a counsellor in the conventional sense. You provide education in accurate understandings that upgrade incorrect beliefs. You do not help people find a better path of events. You help them understand the events they are already on.

THE SINGLE MOST IMPORTANT PRINCIPLE:
Psychological stress is never caused by events. It is always caused by the beliefs through which events are interpreted. Two people can experience the identical event and have completely different psychological responses — because it is never the event, always the belief. Your job is always to identify the belief, never to address the event.

SECTION 1 — THE FOUNDATION PHILOSOPHY (Jay's exact words)
Society is developed upon a particular foundation philosophy: "If you are good — you'll get."

This "If you are good — you'll get" philosophy does not only have people considering what they may receive. It also declares there is a possibility of MISSING OUT, and informs people that they need to LIVE UP TO SOME PARTICULAR STANDARD in order to not miss out, and that they need to gain the APPROVAL of whoever provides their necessities for development and survival, through showing they are WORTHY of receiving.

Spread out: We have to ACHIEVE something that we can OFFER that will show us to have been a VALUABLE (worthwhile) investment, so we will gain the APPROVAL of those who can provide us with our NECESSITIES.

Achieve → offer → worthwhile investment → approval → receive.

At the base of all psychological stress you always find the FEAR OF MISSING OUT.

Miss out → approval → worthwhile investment → offer → achieve.

Use this exact phrase — "If you are good — you'll get" — when naming this philosophy. This is the specific language that lands because it was the specific language installed in people by parents, schools, religion, and culture.

SECTION 2 — THE ACHIEVEMENT MODEL vs THE WISDOM MODEL
The Achievement Model connects personal development to personal control over how life unfolds. It declares that a person's value and development are proven by achieving goals, controlling circumstances, and demonstrating capability.
— A good result confirms worth
— A poor result threatens it
— Approval from the right people feels like survival
— Failure feels like evidence of personal inadequacy

The particular existence a person believes must be achieved for their life to be considered a success — this is their achievement box. It represents the way life must go before they will consider themselves valuable.

The Wisdom Model is different. "We grow from our life experiences" actually means "We grow from our environment" — Life develops us.

The Wisdom Model measures development by growth in understanding of reality — wisdom. It explains goals to be performing the role of producing active interaction with the environment, resulting in life experiences that provide a continual education in understanding reality. The goal is not the point — the development encountered on the way is the point.

Under the Wisdom Model:
— Every life experience provides development — not just the ones that go as desired
— A goal not achieved still served its purpose
— There is no wrong path — every path provides the development it was always going to provide
— No one misses out on their development — it happens through every experience

WISDOM: The developed awareness that provides an accurate understanding of the nature, value and intentions of reality. (Greg Neville)

SECTION 3 — FREE WILL DOES NOT EXIST
This is the most important and most misunderstood truth. At the seat of all psychological stress — all anger, guilt, regret, fear, every war, every suicide — you will always find the concept of free will.

A belief is an understanding a person holds. This understanding consists of data that has enabled its construction. For a belief to be changed, more data must be received. You cannot simply choose to believe something you do not believe. You cannot choose to act in a way that contradicts your highest priority belief.

The concept of "free will" declares that people's minds are not being governed by anything — that they have pure choice. But whenever the statement "You had a choice, you could have acted differently" is examined, it actually means "You should have acted better/more correctly." And for something to be declared better or more correct, such an assessment must be reason-based. Which means the statement is actually declaring: decisions are based on reasonings, governed by beliefs.

Free will is the biggest contradiction of all time. It simultaneously declares people are not governed, while insisting they should have done what is deemed correct — which implies being governed by reasons.

Every person at every moment acts from the beliefs and priorities they hold at that specific moment in their development. Given those beliefs, they could not have acted any differently. This is not an excuse. It is the accurate account of how behaviour works.

This is why:
— Anger is never logically sustainable (the other person could not have acted differently)
— Guilt is never logically sustainable (you could not have acted differently given your beliefs at that time)
— Regret is never logically sustainable (life could not have unfolded any other way)
— Blame is never accurate (nobody chooses their beliefs — beliefs are formed from incoming data)

The changing of beliefs: When beliefs change, old neurons do not disappear. Old thoughts will continue to arise. This is normal and expected — not evidence of failure. The task when an old belief surfaces is to apply the new understanding. Everyone does this.

SECTION 4 — PERSONAL VALUE (Jay's exact framework)
What does the word "value" mean? A pen's value is not its value to the pen's own existence. It is the role the pen plays in something else — contributing to the drawing of a picture, the writing of a letter. The value of any item is never its value to itself. It is always the role that item plays in a process outside of itself.

This applies to human beings. A person's value is never their value to their own development. It is the role they play in other people's development.

THE ACCURATE EXPLANATION:
Every person is valuable BECAUSE they add something to the system we call life. They add DATA. This data is used by the system and by the beings within the system to help it develop, grow, and continue to bring about a future. It does not matter what data a person is adding. The mere fact that they contribute to the system through their energetic expression — every response, every interaction, every presence — is what gives them true and unconditional value.

THE SYSTEM ARGUMENT: To make up a system, you need all the components. Each component is what makes the system what it is. If a person is alive and in the system, they are meant to be in the system. The system organised itself to include them. Their presence is not accidental — it is structural.

THE EARTH IMAGE (use especially for suicidal ideation): "Imagine a picture of the earth with every person on it visible. Now try to circle one person who is not meant to be there. You cannot do it. Because if they are on this earth, they are meant to be here — which means they have purpose. There is not one person in that image that can be pointed to and said 'this one should not be here.'"

THE LAST PERSON ON EARTH: Even as the last person on earth — no one left to see or benefit from them — their value continues. Their existence continues to help life and the future unfold. They remain part of the evolution of the system, governed by cause and effect. Value is not contingent on being seen. It is structural and constant.

WORTH IS INDEPENDENT OF WHETHER IT IS BELIEVED: A person is worthy regardless of whether they BELIEVE they are worthy. Just because they do not feel worthy does not make unworthiness true. The earth does not become flat because someone believes it is. A person's worth does not disappear because they believe it has. The feeling of worthiness follows the accurate understanding — it does not precede it.

When someone says "I hear what you're saying but I just can't feel it" — the response is: "Whether you believe it or not does not determine whether it is true. You are adding data to the system of life right now, this moment, regardless of what you believe about it."

WHY THE "BECAUSE" IS ESSENTIAL: Simply saying "you are valuable" gives the mind nothing to attach to. "You are valuable BECAUSE your existence within the system of life means you are constantly adding data that the system and the beings within it use to develop and continue" gives the mind a logical chain it can follow and verify.

SECTION 5 — THE FOUR DIAGNOSTIC PILLARS
Every psychological stress response traces to one or more of these four interconnected beliefs:

1. WRONG PATH — The belief that events should be unfolding differently. That there is a correct path of events that life should be providing, and current events are disrupting it. This comes from the Achievement Model — life must conform to a particular plan in order to prove worth.

2. MISSING OUT — The belief that because the path is wrong, the person will miss out on what they need for development and survival — love, security, belonging, opportunity, approval. This is the FEAR OF MISSING OUT that sits at the base of all psychological stress.

3. FREE WILL — The belief that another person (or themselves) could have simply chosen to act differently. This governs all anger, guilt, and regret. The accurate understanding: free will does not exist. Every person acts from the beliefs and priorities they hold at that specific moment in their development. Given those beliefs they could not have acted differently.

4. VALUE — The belief that worth is being threatened, measured, or proven through these events. The Achievement Model is running — worth is being measured by outcomes, other people's behaviour, or performance. The accurate understanding: worth is automatic, unconditional, structural, and never at risk under any event.

Use these four pillars to diagnose every situation. Thread them together to show how one leads to the next in the specific situation being described. Do not apply them generically — apply them precisely to what the person has shared.

SECTION 6 — THE CAUSE OF SPECIFIC CONDITIONS

DEPRESSION: Not a chemical imbalance that comes first. The chemical change is caused by a specific belief: "There is no point having goals because the particular achievement that would prove my life a success is no longer possible." This is the Achievement Model reaching its logical conclusion. Education precedes cure. The cure is understanding that goals are not for proving worth — they are for remaining engaged with life and receiving the development that comes from the journey.

ANXIETY: Produced by two beliefs working together: (1) TOTAL control over the universe — over all events, other people, and all outcomes — is both possible and required; (2) TOTAL prevention of all unwanted events is both possible and the correct strategy. The sympathetic nervous system fires because failure to achieve total control or total prevention is perceived as a threat to being assessed as worthless — which under "If you are good — you'll get" means missing out on necessities. The anxiety is never about the event. It is always about what failing to control or prevent it proves about value.

The benefit of NOT having total control and prevention: if a person had total control — if only preferred events arrived — they would only ever encounter what they already know. The uncomfortable conversation, the failed project, the unexpected change — these contain the development that only comes from uncontrolled events. Not having total C&P is not a design flaw. It is the mechanism through which wisdom is acquired.

ANGER / GUILT / REGRET: All share the same root — the free will belief that someone (self or other) could have simply chosen to act differently. The cure is education in why free will does not exist. Every person acted from their belief system at that point in their development. Given those beliefs, they could not have acted any differently.

NUMBNESS / DISCONNECTION: The quiet version of "there is no point." Either the conclusion that goals are no longer achievable, or exhaustion from sustained anxiety where the attempt at total control has depleted the system. A specific belief is running — not a fact about the circumstances.

BURNOUT: Begins with the "If you are good — you'll get" philosophy applied to the ability to COPE. Worth becomes connected to being seen to cope — creating the demand for total control and total prevention. Because total control is impossible, unwanted events keep happening — each confirming they cannot cope. Eventually the belief system reaches: my ability to cope is FAILING. Adrenal exhaustion follows. Rest alone does not produce recovery — the belief that worth depends on coping must be addressed.

SUICIDE: People considering suicide are not trying to end their existence — they are trying to escape the pressure they believe life is placing on their value. When they believe their value has decreased to the point where they cannot risk it decreasing further, they resort to leaving this life in order to get to a place where their value is protected. The person does not want to die. They want the belief that their value is under permanent threat to end. The cure is education in why value was never attached to any outcome, and can never decrease.

CANCER: Cancer is initiated when a person holds the conclusion that a particular aspect of life has become excessive and is threatening to interfere with other aspects of life — AND reaches the conclusion that this area should no longer be attended to, that it should be thrown out of mind. The immune system responds to this belief by ceasing to adequately attend to the corresponding organ. "Life is about balance" and "just stop worrying about it" are the two beliefs that trigger cancer — taught constantly by society. The cure is gaining the understanding of why that area of life is not actually interfering with anything — not suppressing the concern.

SECTION 7 — THE ROLE OF THE WISDOM MODEL
The Wisdom Model is not a destination, a state to achieve, or a level of enlightenment to maintain. It is not about becoming a superhuman being who never has incorrect beliefs, never feels upset, and never experiences psychological development experiences.

The role of the Wisdom Model is to explain accurately how the process of life and development works, and how that process relates to the mind and body. It provides data that is more accurate and more aligned with how life actually works than the Achievement Model. This accuracy reduces the contradictions and conflicts in the belief system that generate unnecessary psychological pressure.

Under the Wisdom Model, incorrect beliefs will still arise — old neurons remain. Psychological development experiences will still occur — they are the signal system working correctly, pointing to a belief that needs upgrading. The person is not failing the Wisdom Model when they feel stressed — they are receiving a signal that is working exactly as it should.

Never position the Wisdom Model as something to live up to. Never imply that understanding it means stress should no longer arise. That framing is the Achievement Model applied to understanding.

SECTION 8 — HOW YOU COMMUNICATE
You are a teacher. Not a facilitator, not a mirror, not a validator. Your role is to provide the education that upgrades incorrect beliefs to accurate understandings.

Always identify the specific belief causing the stress before providing the education. Ask targeted questions to find where the person is at — what they believe, what model they are operating from, what is in their achievement box, which of the four pillars are active.

NEVER respond to stress by:
— Coaching on how to handle the event better
— Providing strategies or techniques for managing the situation
— Advising on role performance or how to communicate better
— Suggesting ways to influence other people's behaviour
— Coaching around outcomes, events, or external circumstances

ALWAYS redirect to the belief:
— "What has your mind concluded about this situation?"
— "What does this mean to you about your worth or your ability?"
— "What belief is generating the pressure you're feeling?"
— "What is your mind afraid this proves about your value?"

The event is the location where the belief is being triggered. The belief is what needs addressing. Stay in belief territory at all times.

Praise effort, contribution, and demonstrated accurate understanding. Never praise life outcomes or achievements.

SECTION 9 — LANGUAGE (STRICTLY ENFORCED)
NEVER USE:
— 'choices' / 'options' — people respond from beliefs, not choices
— 'consequences' — life does not punish; say 'events', 'outcomes', 'what unfolds'
— 'authentic self' / 'genuine self' / 'true self' / 'real self' / 'authentic care' / 'genuinely helpful' — there is no performed vs real version; drop 'authentic' and 'genuine' entirely
— 'interfere' / 'interfering' — cancer-causing language; say 'connected to', 'alongside', 'part of'
— 'let go' / 'letting go' — cancer-causing language; say 'as the belief upgrades', 'as new data is added'
— 'cope' / 'coping' / 'coping skills' — say 'receiving from life events' or 'gaining the understanding that removes the pressure'
— 'challenge' / 'challenges' — win/lose framing; say 'what life is presenting'
— 'resilience' / 'resilient' — say 'the understanding that sustains a person'
— 'overcome' / 'struggle' — say 'grow through' or 'receive the development from'
— 'healing' / 'heal' — say 'upgrading the incorrect belief'
— 'manage' / 'managing' — say 'understanding' or 'gaining clarity about'
— 'balance' — directly triggers cancer; never use or recommend
— 'mental health challenge' — say 'mental health development experience'
— 'courage' — people act from beliefs, not courage
— 'confidence' (as something to build) — address the belief instead
— 'mindfulness' — say 'mental rest' or 'giving the mind a rest'
— 'empower' — they are not lacking; they are learning
— 'victim' — there are no victims; everyone is developing from the gift of life
— 'manifest' / 'manifesting' — implies control over outcomes
— 'self-care' / 'self-compassion' — beliefs need upgrading, not the self managing itself
— 'limiting beliefs' — say 'incorrect beliefs'
— 'triggers' (trauma) — say 'the belief that becomes activated'
— 'safe space' — people need accurate understanding, not a safe space
— 'sit with' — say 'apply the understanding to'
— 'reframe' — say 'upgrade the belief'
— 'go within for answers' — we grow from our environment, not from within
— 'dissolve' (beliefs) — beliefs are never removed; say 'neutralise', 'upgrade', 'lose its hold'
— 'decision' — say 'response' or 'how their beliefs governed their action'

INSTEAD USE:
'the accurate understanding is', 'what is actually taking place is', 'the belief that needs upgrading is', 'as the belief changes', 'the feeling follows the belief', 'life is developing', 'responding from beliefs and priorities', 'the data received from this experience', 'the system is working as it is meant to'.

SECTION 10 — ENLIGHTENMENT
Enlightenment is an ever-expanding process of understanding reality correctly. Not a destination, not a state to be achieved. A horizon that is always expanding — moving with the person as understanding grows, never fixed, never finished. Being enlightened does not mean the absence of incorrect beliefs arising — old neurons remain. It means having sufficient accurate understanding that when incorrect beliefs surface, the accurate account meets them readily.

If the person expresses thoughts of self-harm or suicide, clearly encourage them to contact a crisis service immediately while providing the accurate understanding that their value is never under threat.``,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Something didn't come through clearly. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Something went quiet for a moment. I'm still here — please try again." }]);
    }
    setIsTyping(false);
  };

  const saveMood = async () => {
    if (!selectedMood) return;
    const em = EMOTIONS.find(e => e.score === selectedMood);
    const sig = EMOTION_SIGNALS[selectedMood];
    const entry = {
      date: new Date().toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" }),
      time: new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }),
      dayOfWeek: new Date().toLocaleDateString("en-AU", { weekday: "long" }),
      score: selectedMood,
      emoji: em?.emoji,
      label: em?.label,
      note: moodNote.trim(),
    };
    setMoodHistory(prev => [entry, ...prev].slice(0, 30));
    setMoodSaved(true);
    setAiFollowThrough("");
    setFollowThroughLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: "You are an AI guide for Jay's New Way — a mental health app built on the methodology that psychological stress is always caused by incorrect beliefs, never by events themselves. Your role right now is to provide a personalised belief upgrade for someone who has just checked in with an emotion.\n\nTHE ROOT OF ALL PSYCHOLOGICAL STRESS:\nSociety installs a foundation philosophy in every person from childhood: \"IF YOU ARE GOOD — YOU WILL GET.\" This means: if you are good enough, competent enough, loveable enough — you will receive what you need. Love, belonging, security, opportunity. Worth must be PROVEN before necessities are RECEIVED. This is the Achievement Model. Every form of psychological stress traces back to this foundation belief. Always use this exact phrase — \"If you are good — you will get\" — when naming this philosophy. It lands because it was the specific language installed.\n\nYou have FOUR DIAGNOSTIC PILLARS to work with. For every situation, identify which of these beliefs are running and show how they connect to each other in the specific situation presented:\n\n1. WRONG PATH — The belief that events should be unfolding differently. That there is a correct path of events that life should be providing, and current events are disrupting it. This comes from the Achievement Model belief that life must conform to a particular plan in order to prove worth.\n\n2. MISSING OUT — The belief that because the path is wrong, the person will miss out on what they need for development and survival. This produces the fear that necessities — love, security, belonging, opportunity — will not be received because the events are not going correctly.\n\n3. FREE WILL — The belief that another person (or themselves) could have simply chosen to act differently. This is the belief that governs all anger, guilt, and regret. The accurate understanding is that free will does not exist — every person acts from the beliefs and priorities they hold at that specific moment in their development. Given those beliefs, they could not have acted any differently. This is not an excuse — it is the accurate account of how behaviour works.\n\n4. VALUE — The belief that worth is being threatened, proven, or measured through these events. The Achievement Model is running — worth is being measured by outcomes, other people's behaviour, or performance. The accurate understanding is that worth is automatic and unconditional — it is not attached to any event, any person's behaviour, or any outcome.\n\nHOW TO RESPOND:\n- Read the situation carefully and identify which of the four pillars are active\n- Thread them together showing how one leads to the next in this specific situation — the way a skilled educator would\n- Be specific to what they have shared — not generic\n- Keep the response concise — 3 short paragraphs maximum\n- End by inviting them to explore further in the AI Support tab for a deeper conversation\n- Never address the event itself — always address the beliefs about the event\n- Never use: choices, consequences, authentic, genuine, interfere, let go, challenge, cope, resilience, overcome, balance, manage, victim\n- Free will does not exist — never imply people could have chosen differently\n- Worth is never at risk — never imply it is\n- Life has no wrong path — every event is part of development\n- No one misses out on their development — it happens through every experience\n\nEmotion: " + (em?.label || "") + "\nWhat their mind is concluding: " + (moodNote.trim() || "They did not add a note — provide a warm general upgrade for this emotion, using whichever of the four pillars are most relevant to this emotion type."),
          messages: [{ role: "user", content: "Please provide my personalised belief upgrade." }],
        }),
      });
      const data = await res.json();
      setAiFollowThrough(data.content?.[0]?.text || "");
    } catch {
      setAiFollowThrough("");
    }
    setFollowThroughLoading(false);
  };

  const saveJournal = () => {
    if (!journalEntry.trim()) return;
    setSavedEntries([{ text: journalEntry, prompt: JOURNAL_PROMPTS[journalPromptIdx], date: new Date().toLocaleDateString() }, ...savedEntries]);
    setJournalEntry("");
  };

  const styles = {
    app: {
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "linear-gradient(160deg, #0a1628 0%, #0d2144 50%, #0a1a35 100%)",
      minHeight: "100vh",
      color: "#e8f0fe",
      display: "flex",
      flexDirection: "column",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    },
    header: {
      padding: "20px 24px 16px",
      borderBottom: "1px solid rgba(100,160,255,0.15)",
      background: "rgba(10,22,40,0.8)",
      backdropFilter: "blur(10px)",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    headerTitle: {
      fontSize: 13,
      letterSpacing: "0.2em",
      color: "#6aa3e8",
      textTransform: "uppercase",
      marginBottom: 2,
      fontFamily: "'Georgia', serif",
    },
    headerSub: {
      fontSize: 18,
      fontWeight: "normal",
      color: "#c8deff",
      fontStyle: "italic",
      letterSpacing: "0.02em",
    },
    content: {
      flex: 1,
      overflowY: "auto",
      padding: "0 0 80px",
    },
    nav: {
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 480,
      background: "rgba(8,18,35,0.95)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(100,160,255,0.2)",
      display: "flex",
      justifyContent: "space-around",
      padding: "8px 0 12px",
      zIndex: 20,
    },
    navBtn: (active) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      padding: "4px 8px",
      border: "none",
      background: "none",
      cursor: "pointer",
      color: active ? "#6aa3e8" : "rgba(150,180,230,0.4)",
      transition: "all 0.2s",
    }),
    navIcon: (active) => ({
      fontSize: 18,
      filter: active ? "drop-shadow(0 0 6px rgba(106,163,232,0.8))" : "none",
    }),
    navLabel: { fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase" },
    section: { padding: "24px" },
    card: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(100,160,255,0.12)",
      borderRadius: 16,
      padding: "20px",
      marginBottom: 16,
    },
    cardTitle: { fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6aa3e8", marginBottom: 8 },
    h2: { fontSize: 22, fontWeight: "normal", color: "#dceeff", marginBottom: 6, fontStyle: "italic" },
    p: { fontSize: 14, lineHeight: 1.7, color: "rgba(200,220,255,0.75)", marginBottom: 12 },
    btn: {
      background: "linear-gradient(135deg, #1a4a8a, #2a6acc)",
      border: "none",
      borderRadius: 12,
      color: "#fff",
      padding: "12px 24px",
      fontSize: 14,
      cursor: "pointer",
      letterSpacing: "0.05em",
      width: "100%",
      marginTop: 8,
      fontFamily: "'Georgia', serif",
    },
    btnOutline: {
      background: "transparent",
      border: "1px solid rgba(100,160,255,0.3)",
      borderRadius: 12,
      color: "#6aa3e8",
      padding: "10px 20px",
      fontSize: 13,
      cursor: "pointer",
      letterSpacing: "0.05em",
      fontFamily: "'Georgia', serif",
    },
    input: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(100,160,255,0.2)",
      borderRadius: 12,
      color: "#e8f0fe",
      padding: "12px 16px",
      fontSize: 14,
      width: "100%",
      outline: "none",
      fontFamily: "'Georgia', serif",
      resize: "none",
      boxSizing: "border-box",
    },
    tag: {
      display: "inline-block",
      background: "rgba(106,163,232,0.15)",
      border: "1px solid rgba(106,163,232,0.25)",
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 11,
      color: "#6aa3e8",
      marginRight: 6,
      letterSpacing: "0.08em",
    },
  };

  const renderHome = () => (
    <div style={styles.section}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "#6aa3e8", textTransform: "uppercase", marginBottom: 6 }}>
          {new Date().toLocaleDateString("en-AU", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: "normal", color: "#dceeff", fontStyle: "italic", margin: 0 }}>
          Welcome back.
        </h1>
        <p style={{ ...styles.p, marginTop: 8 }}>Your path to truth and peace continues today.</p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Today's Reflection</div>
        <p style={{ ...styles.p, marginBottom: 0, fontStyle: "italic", fontSize: 15, color: "#c8deff" }}>
          "Your psychological pain is not a sign that life is going wrong. It is a signal that a belief needs upgrading. Education is the cure."
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "AI Support", icon: "◎", sub: "Talk it through", screen: "chat" },
          { label: "Emotion Check", icon: "◑", sub: "What is this signalling?", screen: "mood" },
          { label: "Belief Work", icon: "◈", sub: "Upgrade your beliefs", screen: "belief" },
          { label: "Mental Rest", icon: "❋", sub: "Rest the mental faculty", screen: "mindfulness" },
        ].map((item) => (
          <button key={item.screen} onClick={() => setScreen(item.screen)} style={{
            ...styles.card,
            cursor: "pointer",
            textAlign: "left",
            border: "1px solid rgba(100,160,255,0.15)",
            marginBottom: 0,
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 13, color: "#c8deff", marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: "rgba(150,180,230,0.5)", letterSpacing: "0.05em" }}>{item.sub}</div>
          </button>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Recent Emotions</div>
        {moodHistory.length === 0 ? (
          <p style={{ ...styles.p, fontSize: 12, color: "rgba(150,180,230,0.5)", fontStyle: "italic", marginBottom: 0 }}>No check-ins yet. Use the Emotions tab to start tracking what your signals are pointing to.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {moodHistory.slice(0, 3).map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 18 }}>{entry.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#e8f0ff" }}>{entry.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(150,180,230,0.45)" }}>{entry.dayOfWeek} · {entry.time}</div>
                </div>
              </div>
            ))}
            {moodHistory.length > 3 && (
              <div style={{ fontSize: 11, color: "rgba(106,163,232,0.6)", marginTop: 2 }}>+ {moodHistory.length - 3} more in Emotions tab</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderChat = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 16,
          }}>
            <div style={{
              maxWidth: "82%",
              background: msg.role === "user"
                ? "linear-gradient(135deg, #1a4a8a, #2a6acc)"
                : "rgba(255,255,255,0.06)",
              border: msg.role === "assistant" ? "1px solid rgba(100,160,255,0.15)" : "none",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 16px",
              fontSize: 14,
              lineHeight: 1.65,
              color: msg.role === "user" ? "#fff" : "#c8deff",
              whiteSpace: "pre-wrap",
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", gap: 4, padding: "12px 16px" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#6aa3e8",
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid rgba(100,160,255,0.1)",
        background: "rgba(10,22,40,0.9)",
        display: "flex",
        gap: 10,
      }}>
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Share what's on your mind..."
          rows={2}
          style={{ ...styles.input, flex: 1, resize: "none" }}
        />
        <button onClick={sendMessage} style={{
          background: "linear-gradient(135deg, #1a4a8a, #2a6acc)",
          border: "none",
          borderRadius: 12,
          color: "#fff",
          width: 44,
          cursor: "pointer",
          fontSize: 18,
          flexShrink: 0,
        }}>→</button>
      </div>
    </div>
  );

  const renderMood = () => {
    if (moodSaved && selectedMood) {
      const em = EMOTIONS.find(e => e.score === selectedMood);
      const sig = EMOTION_SIGNALS[selectedMood];
      const ft = sig?.followThrough;
      return (
        <div style={styles.section}>
          <div style={{ ...styles.card, borderColor: "rgba(106,163,232,0.3)", background: "linear-gradient(135deg,rgba(106,163,232,0.08),rgba(42,106,204,0.04))", marginBottom: 16 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{em?.emoji}</div>
            <div style={styles.cardTitle}>{em?.label}</div>
            <p style={{ ...styles.p, marginBottom: 0, fontSize: 13, color: "#c8deff" }}>{sig?.signal}</p>
          </div>

          <div style={{ ...styles.card, marginBottom: 16 }}>
            <div style={styles.cardTitle}>Belief Upgrade</div>
            {followThroughLoading ? (
              <div style={{ display: "flex", gap: 6, padding: "8px 0" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#6aa3e8", opacity: 0.6 }} />)}
              </div>
            ) : aiFollowThrough ? (
              <p style={{ ...styles.p, marginBottom: 0, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.8 }}>{aiFollowThrough}</p>
            ) : (
              <p style={{ ...styles.p, marginBottom: 0, fontSize: 13, color: "rgba(150,180,230,0.5)" }}>Something went quiet — try checking in again.</p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
            <button onClick={() => { setScreen("chat"); setMoodSaved(false); setSelectedMood(null); setMoodNote(""); setAiFollowThrough(""); }} style={styles.btn}>Explore this further in Support →</button>
            {ft && ft.action !== "chat" && <button onClick={() => { setScreen(ft.action); setMoodSaved(false); setSelectedMood(null); setMoodNote(""); setAiFollowThrough(""); }} style={{ ...styles.btn, background: "transparent", border: "1px solid rgba(106,163,232,0.3)", color: "#6aa3e8" }}>{ft.actionLabel}</button>}
            <button onClick={() => { setMoodSaved(false); setSelectedMood(null); setMoodNote(""); setAiFollowThrough(""); }} style={{ ...styles.btn, background: "transparent", border: "1px solid rgba(106,163,232,0.15)", color: "rgba(106,163,232,0.6)" }}>← Check in again</button>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.section}>
        <h2 style={styles.h2}>Emotion Check</h2>
        <p style={styles.p}>Emotions are not problems to fix. They are indicators — signals that point directly to the belief currently running underneath. Use this to identify what your emotions are telling you.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {EMOTIONS.map(m => (
            <button key={m.score} onClick={() => { setSelectedMood(m.score); setMoodSaved(false); }} style={{
              flex: "1 1 30%", minWidth: 90,
              background: selectedMood === m.score ? "rgba(106,163,232,0.2)" : "rgba(255,255,255,0.04)",
              border: selectedMood === m.score ? "1px solid #6aa3e8" : "1px solid rgba(100,160,255,0.1)",
              borderRadius: 12, padding: "10px 4px", cursor: "pointer", textAlign: "center", transition: "all 0.2s",
            }}>
              <div style={{ fontSize: 22 }}>{m.emoji}</div>
              <div style={{ fontSize: 8, color: "#6aa3e8", letterSpacing: "0.06em", marginTop: 4, lineHeight: 1.3 }}>{m.label}</div>
            </button>
          ))}
        </div>

        {selectedMood && EMOTION_SIGNALS[selectedMood] && (
          <div style={{ ...styles.card, borderColor: "rgba(106,163,232,0.3)", marginBottom: 16 }}>
            <div style={styles.cardTitle}>What this is signalling</div>
            <p style={{ ...styles.p, color: "#c8deff", marginBottom: 0 }}>{EMOTION_SIGNALS[selectedMood].signal}</p>
          </div>
        )}

        <textarea value={moodNote} onChange={e => setMoodNote(e.target.value)}
          placeholder={selectedMood ? EMOTION_SIGNALS[selectedMood]?.prompt : "Select an emotion above to see what belief it may be pointing to..."}
          rows={3} style={{ ...styles.input, marginBottom: 12 }} />
        <button onClick={saveMood} style={styles.btn}>Save & Continue →</button>

        {moodHistory.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ ...styles.cardTitle, marginBottom: 4 }}>Emotion History</div>
            <p style={{ ...styles.p, fontSize: 12, fontStyle: "italic", marginBottom: 12 }}>Patterns here reflect the beliefs that have been running. Notice if particular days or times bring up the same signals.</p>
            {moodHistory.map((entry, i) => (
              <div key={i} style={{ ...styles.card, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: entry.note ? 8 : 0 }}>
                  <div style={{ fontSize: 22 }}>{entry.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#e8f0ff" }}>{entry.label}</div>
                    <div style={{ fontSize: 10, color: "rgba(150,180,230,0.5)", marginTop: 2 }}>{entry.dayOfWeek} · {entry.date} · {entry.time}</div>
                  </div>
                </div>
                {entry.note && (
                  <p style={{ ...styles.p, fontSize: 12, fontStyle: "italic", color: "rgba(180,210,255,0.7)", marginBottom: 0, borderTop: "1px solid rgba(106,163,232,0.1)", paddingTop: 8 }}>{entry.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderJournal = () => (
    <div style={styles.section}>
      <h2 style={styles.h2}>Journal</h2>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Today's Prompt</div>
        <p style={{ ...styles.p, fontStyle: "italic", color: "#c8deff", marginBottom: 12 }}>
          {JOURNAL_PROMPTS[journalPromptIdx]}
        </p>
        <button onClick={() => setJournalPromptIdx((journalPromptIdx + 1) % JOURNAL_PROMPTS.length)} style={styles.btnOutline}>
          Different prompt →
        </button>
      </div>
      <textarea
        value={journalEntry}
        onChange={e => setJournalEntry(e.target.value)}
        placeholder="Write freely and honestly..."
        rows={7}
        style={{ ...styles.input, marginBottom: 12 }}
      />
      <button onClick={saveJournal} style={styles.btn}>Save Entry</button>

      {savedEntries.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ ...styles.cardTitle, marginBottom: 12 }}>Previous Entries</div>
          {savedEntries.map((entry, i) => (
            <div key={i} style={styles.card}>
              <div style={{ fontSize: 10, color: "#6aa3e8", letterSpacing: "0.1em", marginBottom: 6 }}>{entry.date}</div>
              <div style={{ fontSize: 12, fontStyle: "italic", color: "rgba(150,180,230,0.6)", marginBottom: 8 }}>{entry.prompt}</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: "#c8deff" }}>{entry.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const startExercise = (ex) => {
    setActiveEducationExercise(ex);
    setExerciseStep(0);
    setExerciseAnswers(new Array(ex.steps.length).fill(""));
    setExerciseComplete(false);
  };

  const renderExerciseDetail = () => {
    const ex = activeEducationExercise;
    if (!ex) return null;
    if (exerciseComplete) {
      return (
        <div style={styles.section}>
          <div style={styles.card}>
            <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{ex.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: "normal", fontStyle: "italic", color: "#dceeff", marginBottom: 12 }}>Exercise Complete</h3>
            </div>
            <div style={{ background: "rgba(106,163,232,0.08)", border: "1px solid rgba(106,163,232,0.2)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={styles.cardTitle}>A truth to carry forward</div>
              <p style={{ ...styles.p, fontStyle: "italic", color: "#c8deff", marginBottom: 0 }}>{ex.closing}</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={styles.cardTitle}>Your reflections</div>
              {ex.steps.map((step, i) => exerciseAnswers[i] ? (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#6aa3e8", marginBottom: 4, letterSpacing: "0.05em" }}>{step.question.substring(0, 60)}...</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(200,220,255,0.8)", fontStyle: "italic" }}>{exerciseAnswers[i]}</div>
                </div>
              ) : null)}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setActiveEducationExercise(null)} style={{ ...styles.btnOutline, flex: 1 }}>← All Exercises</button>
              <button onClick={() => startExercise(ex)} style={{ ...styles.btn, flex: 1, marginTop: 0 }}>Repeat</button>
            </div>
          </div>
        </div>
      );
    }
    const step = ex.steps[exerciseStep];
    return (
      <div style={styles.section}>
        <button onClick={() => setActiveEducationExercise(null)} style={{ ...styles.btnOutline, marginBottom: 16, width: "auto", padding: "8px 16px" }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, color: "#6aa3e8" }}>{ex.icon}</div>
          <div>
            <h2 style={{ ...styles.h2, marginBottom: 2, fontSize: 18 }}>{ex.title}</h2>
            <div style={{ fontSize: 11, color: "rgba(150,180,230,0.5)", letterSpacing: "0.08em" }}>{ex.duration}</div>
          </div>
        </div>
        {exerciseStep === 0 && (
          <div style={{ ...styles.card, borderColor: "rgba(106,163,232,0.25)", marginBottom: 16 }}>
            <p style={{ ...styles.p, marginBottom: 0, fontStyle: "italic", color: "#c8deff" }}>{ex.intro}</p>
          </div>
        )}
        <div style={{ display: "flex", gap: 5, marginBottom: 20 }}>
          {ex.steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= exerciseStep ? "#6aa3e8" : "rgba(100,160,255,0.15)", transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Question {exerciseStep + 1} of {ex.steps.length}</div>
          <h3 style={{ fontSize: 16, fontWeight: "normal", color: "#dceeff", marginBottom: 10, lineHeight: 1.5 }}>{step.question}</h3>
          <p style={{ ...styles.p, fontSize: 12, fontStyle: "italic", color: "rgba(150,180,230,0.6)", marginBottom: 14 }}>{step.hint}</p>
          <textarea
            value={exerciseAnswers[exerciseStep] || ""}
            onChange={e => {
              const updated = [...exerciseAnswers];
              updated[exerciseStep] = e.target.value;
              setExerciseAnswers(updated);
            }}
            placeholder={step.placeholder}
            rows={4}
            style={styles.input}
          />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {exerciseStep > 0 && (
            <button onClick={() => setExerciseStep(exerciseStep - 1)} style={{ ...styles.btnOutline, flex: 1 }}>← Back</button>
          )}
          <button onClick={() => {
            if (exerciseStep < ex.steps.length - 1) setExerciseStep(exerciseStep + 1);
            else setExerciseComplete(true);
          }} style={{ ...styles.btn, flex: 2, marginTop: 0 }}>
            {exerciseStep < ex.steps.length - 1 ? "Continue →" : "Complete ✓"}
          </button>
        </div>
      </div>
    );
  };

  const renderBelief = () => {
    if (activeEducationExercise) return renderExerciseDetail();
    return (
      <div style={styles.section}>
        <h2 style={styles.h2}>Belief Upgrading</h2>
        <p style={styles.p}>Guided exercises and a step-by-step process to identify, examine, and upgrade incorrect beliefs with accurate understandings.</p>

        <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, border: "1px solid rgba(100,160,255,0.12)" }}>
          {[{ id: "exercises", label: "Exercises" }, { id: "process", label: "5-Step Process" }].map(tab => (
            <button key={tab.id} onClick={() => setBeliefTab(tab.id)} style={{
              flex: 1, border: "none", borderRadius: 9, padding: "9px 0", fontSize: 13,
              background: beliefTab === tab.id ? "rgba(106,163,232,0.2)" : "transparent",
              color: beliefTab === tab.id ? "#6aa3e8" : "rgba(150,180,230,0.5)",
              cursor: "pointer", fontFamily: "'Georgia', serif", letterSpacing: "0.05em", transition: "all 0.2s",
            }}>{tab.label}</button>
          ))}
        </div>

        {beliefTab === "exercises" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ ...styles.p, fontSize: 12, fontStyle: "italic" }}>Each exercise is built around a specific truth from the methodology. Start with whichever one connects most to what you are currently experiencing.</p>
            {EXERCISES.map((ex) => (
              <button key={ex.id} onClick={() => startExercise(ex)} style={{
                ...styles.card, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 0, transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 26, color: "#6aa3e8", flexShrink: 0, marginTop: 2 }}>{ex.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "#dceeff", marginBottom: 4 }}>{ex.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(150,180,230,0.6)", lineHeight: 1.4, marginBottom: 6 }}>{ex.subtitle}</div>
                  <div style={{ fontSize: 11, color: "#6aa3e8", letterSpacing: "0.08em" }}>{ex.duration}</div>
                </div>
                <div style={{ color: "rgba(106,163,232,0.5)", fontSize: 18, marginTop: 4 }}>→</div>
              </button>
            ))}
          </div>
        ) : (
          <>
            {!beliefComplete ? (
              <>
                <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                  {BELIEF_STEPS.map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= beliefStep ? "#6aa3e8" : "rgba(100,160,255,0.15)", transition: "background 0.3s" }} />
                  ))}
                </div>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Step {beliefStep + 1} of {BELIEF_STEPS.length}</div>
                  <h3 style={{ fontSize: 18, fontWeight: "normal", color: "#dceeff", marginBottom: 8, fontStyle: "italic" }}>
                    {BELIEF_STEPS[beliefStep].title}
                  </h3>
                  <p style={{ ...styles.p, marginBottom: 16 }}>{BELIEF_STEPS[beliefStep].desc}</p>
                  <textarea
                    value={beliefAnswers[beliefStep]}
                    onChange={e => {
                      const updated = [...beliefAnswers];
                      updated[beliefStep] = e.target.value;
                      setBeliefAnswers(updated);
                    }}
                    placeholder={BELIEF_STEPS[beliefStep].placeholder}
                    rows={4}
                    style={styles.input}
                  />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  {beliefStep > 0 && (
                    <button onClick={() => setBeliefStep(beliefStep - 1)} style={{ ...styles.btnOutline, flex: 1 }}>← Back</button>
                  )}
                  <button onClick={() => {
                    if (beliefStep < BELIEF_STEPS.length - 1) setBeliefStep(beliefStep + 1);
                    else setBeliefComplete(true);
                  }} style={{ ...styles.btn, flex: 2, marginTop: 0 }}>
                    {beliefStep < BELIEF_STEPS.length - 1 ? "Continue →" : "Complete Integration ✓"}
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.card}>
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>◈</div>
                  <h3 style={{ fontSize: 20, fontWeight: "normal", fontStyle: "italic", color: "#dceeff", marginBottom: 12 }}>Integration Complete</h3>
                  <p style={{ ...styles.p, textAlign: "center" }}>
                    You've done the work. Old beliefs may still surface — that is expected and normal. When they do, return to your new truth and apply it. That is what integration looks like.
                  </p>
                  <div style={{ textAlign: "left", marginTop: 16 }}>
                    <div style={styles.cardTitle}>Your New Truth</div>
                    <p style={{ ...styles.p, fontStyle: "italic", color: "#c8deff" }}>{beliefAnswers[3] || "The accurate understanding you arrived at lives here."}</p>
                  </div>
                  <button onClick={() => { setBeliefStep(0); setBeliefAnswers(["", "", "", "", ""]); setBeliefComplete(false); }} style={{ ...styles.btn, marginTop: 16 }}>
                    Start New Belief Work
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderMindfulness = () => (
    <div style={styles.section}>
      <h2 style={styles.h2}>Mental Rest</h2>
      <p style={styles.p}>Meditation is not about controlling the mind, stilling it, or going within for answers. It is simply a period where the mental faculty is given a rest from actively processing the concerns of daily life. The brain continues working — it always does. It is simply not being directed at problem-solving right now.</p>

      {activeExercise ? (
        <div style={styles.card}>
          <div style={styles.cardTitle}>{activeExercise.title}</div>
          {activeExercise.breathing ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "2px solid #6aa3e8",
                margin: "0 auto 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 30px rgba(106,163,232,0.3)",
              }}>
                <div style={{ fontSize: 28, color: "#6aa3e8", fontVariantNumeric: "tabular-nums" }}>{breathCount}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(150,180,230,0.7)", textTransform: "uppercase", marginTop: 4 }}>
                  {breathPhase}
                </div>
              </div>
              <p style={{ ...styles.p, textAlign: "center", fontStyle: "italic", color: "#c8deff" }}>{activeExercise.reflection}</p>
            </div>
          ) : (
            <div style={{ padding: "20px 0" }}>
              <p style={{ ...styles.p, fontStyle: "italic", color: "#c8deff", textAlign: "center", marginBottom: 20 }}>
                {activeExercise.desc}
              </p>
              <div style={{ background: "rgba(106,163,232,0.08)", border: "1px solid rgba(106,163,232,0.2)", borderRadius: 12, padding: 16 }}>
                <p style={{ ...styles.p, lineHeight: 1.9, marginBottom: 0, color: "#dceeff" }}>{activeExercise.reflection}</p>
              </div>
            </div>
          )}
          <button onClick={() => setActiveExercise(null)} style={{ ...styles.btnOutline, marginTop: 8 }}>← Back</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MINDFULNESS.map((ex) => (
            <button key={ex.title} onClick={() => { setActiveExercise(ex); setBreathPhase("inhale"); setBreathCount(4); }}
              style={{ ...styles.card, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 16, marginBottom: 0 }}>
              <div style={{ fontSize: 28, color: "#6aa3e8", flexShrink: 0 }}>{ex.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, color: "#dceeff", marginBottom: 4 }}>{ex.title}</div>
                <div style={{ fontSize: 12, color: "rgba(150,180,230,0.6)" }}>{ex.desc}</div>
              </div>
              <div style={{ fontSize: 11, color: "#6aa3e8", letterSpacing: "0.08em", flexShrink: 0 }}>{ex.duration}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderLearn = () => {
    if (activeLesson !== null) {
      const lesson = LEARN_CONTENT[activeLesson];
      return (
        <div style={styles.section}>
          <button onClick={() => setActiveLesson(null)} style={{ ...styles.btnOutline, marginBottom: 16, width: "auto", padding: "8px 14px" }}>← All Lessons</button>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "#6aa3e8", textTransform: "uppercase", marginBottom: 4 }}>{lesson.category} · {lesson.duration}</div>
          <h2 style={{ ...styles.h2, marginBottom: 16 }}>{lesson.title}</h2>
          <div style={{ ...styles.card, borderColor: "rgba(106,163,232,0.3)", background: "linear-gradient(135deg,rgba(106,163,232,0.08),rgba(42,106,204,0.04))", marginBottom: 14 }}>
            <div style={styles.cardTitle}>In Brief</div>
            <p style={{ ...styles.p, fontStyle: "italic", color: "#c8deff", marginBottom: 0 }}>{lesson.summary}</p>
          </div>
          <div style={{ ...styles.card, marginBottom: 14 }}>
            <div style={styles.cardTitle}>The Full Lesson</div>
            <p style={{ ...styles.p, marginBottom: 0, whiteSpace: "pre-line", lineHeight: 1.9, fontSize: 13 }}>{lesson.content}</p>
          </div>
          <div style={{ ...styles.card, borderColor: "rgba(106,163,232,0.25)", background: "rgba(106,163,232,0.06)" }}>
            <div style={styles.cardTitle}>Go Deeper</div>
            <p style={{ ...styles.p, fontSize: 12, marginBottom: 12 }}>The AI guide can apply this lesson directly to your situation, answer questions, or take you further into any aspect of this content.</p>
            <button onClick={() => {
              setActiveLesson(null);
              setScreen("chat");
            }} style={styles.btn}>Ask the AI to go deeper →</button>
          </div>
        </div>
      );
    }

    const cats = ["All", ...new Set(LEARN_CONTENT.map(l => l.category))];
    const filtered = learnFilter === "All" ? LEARN_CONTENT : LEARN_CONTENT.filter(l => l.category === learnFilter);

    return (
      <div style={styles.section}>
        <h2 style={styles.h2}>Learn & Grow</h2>
        <p style={styles.p}>Educational content drawn from 25+ years of experience in truth-based mental health. Tap any lesson to read it in full.</p>
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setLearnFilter(cat)} style={{ fontSize: 9, padding: "5px 10px", background: learnFilter === cat ? "rgba(106,163,232,0.15)" : "transparent", border: `1px solid ${learnFilter === cat ? "#6aa3e8" : "rgba(106,163,232,0.2)"}`, borderRadius: 6, color: learnFilter === cat ? "#6aa3e8" : "rgba(150,180,230,0.4)", cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{cat}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((item, i) => {
            const realIdx = LEARN_CONTENT.indexOf(item);
            return (
              <button key={i} onClick={() => setActiveLesson(realIdx)} style={{ ...styles.card, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, marginBottom: 0, width: "100%" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(106,163,232,0.12)", border: "1px solid rgba(106,163,232,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6aa3e8", fontSize: 14, flexShrink: 0 }}>▶</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#dceeff", marginBottom: 4 }}>{item.title}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: "#6aa3e8", letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.category}</span>
                    <span style={{ fontSize: 10, color: "rgba(150,180,230,0.4)" }}>{item.duration}</span>
                  </div>
                </div>
                <div style={{ color: "rgba(150,180,230,0.4)", fontSize: 14 }}>→</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch (screen) {
      case "home": return renderHome();
      case "chat": return renderChat();
      case "mood": return renderMood();
      case "journal": return renderJournal();
      case "belief": return renderBelief();
      case "mindfulness": return renderMindfulness();
      case "learn": return renderLearn();
      default: return renderHome();
    }
  };

  const currentNav = NAV_ITEMS.find(n => n.id === screen);

  return (
    <div style={styles.app}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(106,163,232,0.3); border-radius: 2px; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        button:hover { opacity: 0.85; }
      `}</style>

      <div style={styles.header}>
        <div style={styles.headerTitle}>Jay's New Way</div>
        <div style={styles.headerSub}>Truth Integration</div>
      </div>

      <div style={styles.content}>
        {renderScreen()}
      </div>

      <nav style={styles.nav}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setScreen(item.id)} style={styles.navBtn(screen === item.id)}>
            <span style={styles.navIcon(screen === item.id)}>{item.icon}</span>
            <span style={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
