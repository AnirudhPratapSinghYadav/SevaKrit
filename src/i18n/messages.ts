export type Lang = "en" | "hi";

export const MESSAGES = {
  en: {
    brand: "HaqPath",
    tagline: "by SevaKrit · Independent guide — not a government portal",
    navDiscover: "Describe household",
    navResults: "Results",
    navPlan: "Plan",
    navHelp: "Help",
    navPrivacy: "Privacy",
    langToggle: "हिंदी",
    langNote: "Interface Hindi is a product translation, not a certified government translation.",
    footer:
      "Progress, reminders and confirmed answers stay in this browser only. They are not sent to a server and are not an official application.",
    privacyLink: "Privacy and data handling",
    skip: "Skip to main content",
    notFoundTitle: "Page not found",
    notFoundBody: "That address is not part of HaqPath.",
    notFoundHome: "Back to the start",
  },
  hi: {
    brand: "हक़पथ",
    tagline: "सेवाकृत द्वारा · स्वतंत्र मार्गदर्शिका — यह सरकारी पोर्टल नहीं है",
    navDiscover: "परिवार का विवरण",
    navResults: "परिणाम",
    navPlan: "योजना",
    navHelp: "सहायता",
    navPrivacy: "गोपनीयता",
    langToggle: "English",
    langNote: "हिंदी इंटरफ़ेस अनुवाद है, सरकारी प्रमाणित अनुवाद नहीं।",
    footer:
      "प्रगति, रिमाइंडर और पुष्ट उत्तर केवल इसी ब्राउज़र में रहते हैं। इन्हें सर्वर पर नहीं भेजा जाता और यह आधिकारिक आवेदन नहीं है।",
    privacyLink: "गोपनीयता और डेटा",
    skip: "मुख्य सामग्री पर जाएँ",
    notFoundTitle: "पृष्ठ नहीं मिला",
    notFoundBody: "यह पता हक़पथ का हिस्सा नहीं है।",
    notFoundHome: "शुरुआत पर वापस जाएँ",
  },
} as const;

export type MessageKey = keyof (typeof MESSAGES)["en"];
